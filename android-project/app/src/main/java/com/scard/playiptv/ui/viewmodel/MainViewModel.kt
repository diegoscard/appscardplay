package com.scard.playiptv.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.scard.playiptv.data.model.Category
import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.data.model.EPGProgram
import com.scard.playiptv.data.model.Playlist
import com.scard.playiptv.data.repository.FavoritesRepository
import com.scard.playiptv.data.repository.HistoryRepository
import com.scard.playiptv.data.repository.PlaylistRepository
import com.scard.playiptv.player.Media3PlayerManager
import com.scard.playiptv.player.PlaybackUiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class AppScreen {
    SPLASH,
    SETUP,
    HOME,
    LIVE_TV,
    PLAYER,
    SETTINGS,
    FUTURE_LOGIN,
    ABOUT
}

data class UiState(
    val currentScreen: AppScreen = AppScreen.SPLASH,
    val previousScreen: AppScreen = AppScreen.HOME,
    val playlist: Playlist? = null,
    val channels: List<Channel> = emptyList(),
    val categories: List<String> = emptyList(),
    val selectedCategory: String = "TODOS",
    val filteredChannels: List<Channel> = emptyList(),
    val favoriteIds: Set<String> = emptySet(),
    val recentChannelIds: List<String> = emptyList(),
    val currentPlayingChannel: Channel? = null,
    val isSideDrawerOpen: Boolean = false,
    val isLoading: Boolean = false,
    val notificationMessage: String? = null,
    val errorMessage: String? = null
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    val playlistRepo = PlaylistRepository(application)
    val favoritesRepo = FavoritesRepository(application)
    val historyRepo = HistoryRepository(application)
    val playerManager = Media3PlayerManager(application)

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    val playbackUiState: StateFlow<PlaybackUiState> = playerManager.uiState

    init {
        observeFavorites()
        observeHistory()
        checkInitialSetup()
    }

    private fun observeFavorites() {
        viewModelScope.launch {
            favoritesRepo.favoritesFlow.collect { favs ->
                _uiState.value = _uiState.value.copy(
                    favoriteIds = favs,
                    channels = _uiState.value.channels.map { it.copy(isFavorite = favs.contains(it.id)) }
                )
                refreshFilteredChannels()
            }
        }
    }

    private fun observeHistory() {
        viewModelScope.launch {
            historyRepo.historyFlow.collect { recents ->
                _uiState.value = _uiState.value.copy(recentChannelIds = recents)
            }
        }
    }

    fun checkInitialSetup() {
        viewModelScope.launch {
            val cachedResult = playlistRepo.loadCachedChannels()
            val savedPlaylist = playlistRepo.getSavedPlaylist()

            if (cachedResult != null && cachedResult.channels.isNotEmpty() && savedPlaylist != null) {
                applyChannelsData(savedPlaylist, cachedResult.channels, cachedResult.categories)
                _uiState.value = _uiState.value.copy(currentScreen = AppScreen.HOME)
            } else {
                _uiState.value = _uiState.value.copy(currentScreen = AppScreen.SETUP)
            }
        }
    }

    fun connectPlaylist(name: String, url: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = playlistRepo.fetchAndSavePlaylist(name, url)
            result.onSuccess { parsed ->
                val pl = Playlist(name = name, url = url, channelCount = parsed.channels.size)
                applyChannelsData(pl, parsed.channels, parsed.categories)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    currentScreen = AppScreen.HOME,
                    notificationMessage = "Lista conectada com sucesso! (${parsed.channels.size} canais)"
                )
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = err.message ?: "Erro ao conectar playlist."
                )
            }
        }
    }

    fun refreshPlaylist() {
        val currentPlaylist = _uiState.value.playlist ?: return
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, notificationMessage = null)
            val result = playlistRepo.fetchAndSavePlaylist(currentPlaylist.name, currentPlaylist.url)
            result.onSuccess { parsed ->
                applyChannelsData(currentPlaylist.copy(channelCount = parsed.channels.size), parsed.channels, parsed.categories)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    notificationMessage = "Lista atualizada com sucesso."
                )
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    notificationMessage = "Falha ao atualizar. Mantendo lista anterior: ${err.message}"
                )
            }
        }
    }

    private fun applyChannelsData(playlist: Playlist, channelsList: List<Channel>, categoriesList: List<String>) {
        val favs = _uiState.value.favoriteIds
        val mappedChannels = channelsList.map { it.copy(isFavorite = favs.contains(it.id)) }
        val allCategories = listOf("TODOS", "FAVORITOS") + categoriesList.filter { it != "TODOS" && it != "FAVORITOS" }

        _uiState.value = _uiState.value.copy(
            playlist = playlist,
            channels = mappedChannels,
            categories = allCategories
        )
        refreshFilteredChannels()
    }

    fun selectCategory(category: String) {
        _uiState.value = _uiState.value.copy(selectedCategory = category)
        refreshFilteredChannels()
    }

    private fun refreshFilteredChannels() {
        val current = _uiState.value
        val list = when (current.selectedCategory) {
            "TODOS" -> current.channels
            "FAVORITOS" -> current.channels.filter { current.favoriteIds.contains(it.id) }
            "CONTINUAR ASSISTINDO" -> {
                val idMap = current.channels.associateBy { it.id }
                current.recentChannelIds.mapNotNull { idMap[it] }
            }
            else -> current.channels.filter { it.category.equals(current.selectedCategory, ignoreCase = true) }
        }
        _uiState.value = current.copy(filteredChannels = list)
    }

    fun playChannel(channel: Channel) {
        viewModelScope.launch {
            historyRepo.recordChannelWatched(channel.id)
        }
        _uiState.value = _uiState.value.copy(
            currentPlayingChannel = channel,
            currentScreen = AppScreen.PLAYER,
            isSideDrawerOpen = false
        )
        playerManager.playChannel(channel)
    }

    fun nextChannel() {
        val currentList = if (_uiState.value.filteredChannels.isNotEmpty()) _uiState.value.filteredChannels else _uiState.value.channels
        val current = _uiState.value.currentPlayingChannel ?: return
        val index = currentList.indexOfFirst { it.id == current.id }
        if (index != -1 && currentList.isNotEmpty()) {
            val nextIndex = (index + 1) % currentList.size
            playChannel(currentList[nextIndex])
        }
    }

    fun previousChannel() {
        val currentList = if (_uiState.value.filteredChannels.isNotEmpty()) _uiState.value.filteredChannels else _uiState.value.channels
        val current = _uiState.value.currentPlayingChannel ?: return
        val index = currentList.indexOfFirst { it.id == current.id }
        if (index != -1 && currentList.isNotEmpty()) {
            val prevIndex = if (index - 1 < 0) currentList.size - 1 else index - 1
            playChannel(currentList[prevIndex])
        }
    }

    fun toggleFavorite(channelId: String) {
        viewModelScope.launch {
            favoritesRepo.toggleFavorite(channelId)
        }
    }

    fun toggleSideDrawer() {
        _uiState.value = _uiState.value.copy(isSideDrawerOpen = !_uiState.value.isSideDrawerOpen)
    }

    fun navigateTo(screen: AppScreen) {
        _uiState.value = _uiState.value.copy(
            previousScreen = _uiState.value.currentScreen,
            currentScreen = screen
        )
    }

    fun navigateBack(): Boolean {
        val state = _uiState.value
        if (state.isSideDrawerOpen) {
            _uiState.value = state.copy(isSideDrawerOpen = false)
            return true
        }
        if (state.currentScreen == AppScreen.PLAYER) {
            playerManager.release()
            _uiState.value = state.copy(currentScreen = state.previousScreen)
            return true
        }
        if (state.currentScreen != AppScreen.HOME && state.currentScreen != AppScreen.SETUP && state.currentScreen != AppScreen.SPLASH) {
            _uiState.value = state.copy(currentScreen = AppScreen.HOME)
            return true
        }
        return false // Let system handle exit
    }

    fun clearFavorites() {
        viewModelScope.launch {
            favoritesRepo.clearFavorites()
            _uiState.value = _uiState.value.copy(notificationMessage = "Favoritos limpos.")
        }
    }

    fun clearHistory() {
        viewModelScope.launch {
            historyRepo.clearHistory()
            _uiState.value = _uiState.value.copy(notificationMessage = "Histórico de reprodução limpo.")
        }
    }

    fun clearNotification() {
        _uiState.value = _uiState.value.copy(notificationMessage = null)
    }

    override fun onCleared() {
        super.onCleared()
        playerManager.release()
    }
}
