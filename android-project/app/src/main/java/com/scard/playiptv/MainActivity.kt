package com.scard.playiptv

import android.os.Bundle
import android.view.KeyEvent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.scard.playiptv.player.PlaybackUiState
import com.scard.playiptv.ui.screens.*
import com.scard.playiptv.ui.theme.DeepDark
import com.scard.playiptv.ui.theme.ScardPlayTheme
import com.scard.playiptv.ui.viewmodel.AppScreen
import com.scard.playiptv.ui.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            ScardPlayTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DeepDark
                ) {
                    val state by viewModel.uiState.collectAsState()
                    val playbackState by viewModel.playbackUiState.collectAsState()

                    when (state.currentScreen) {
                        AppScreen.SPLASH -> {
                            SplashScreen(
                                onSplashFinished = {
                                    viewModel.checkInitialSetup()
                                }
                            )
                        }
                        AppScreen.SETUP -> {
                            SetupScreen(
                                isLoading = state.isLoading,
                                errorMessage = state.errorMessage,
                                onConnect = { name, url ->
                                    viewModel.connectPlaylist(name, url)
                                },
                                onOpenFutureLogin = {
                                    viewModel.navigateTo(AppScreen.FUTURE_LOGIN)
                                }
                            )
                        }
                        AppScreen.HOME -> {
                            HomeScreen(
                                state = state,
                                onChannelSelected = { ch -> viewModel.playChannel(ch) },
                                onCategorySelected = { cat -> viewModel.selectCategory(cat) },
                                onNavigate = { screen -> viewModel.navigateTo(screen) },
                                onToggleFavorite = { id -> viewModel.toggleFavorite(id) }
                            )
                        }
                        AppScreen.LIVE_TV -> {
                            LiveTvScreen(
                                state = state,
                                onChannelSelected = { ch -> viewModel.playChannel(ch) },
                                onCategorySelected = { cat -> viewModel.selectCategory(cat) },
                                onNavigate = { screen -> viewModel.navigateTo(screen) },
                                onToggleFavorite = { id -> viewModel.toggleFavorite(id) }
                            )
                        }
                        AppScreen.PLAYER -> {
                            PlayerScreen(
                                currentChannel = state.currentPlayingChannel,
                                playbackState = playbackState,
                                playerManager = viewModel.playerManager,
                                isSideDrawerOpen = state.isSideDrawerOpen,
                                channelList = if (state.filteredChannels.isNotEmpty()) state.filteredChannels else state.channels,
                                onChannelSelected = { ch -> viewModel.playChannel(ch) },
                                onNextChannel = { viewModel.nextChannel() },
                                onPrevChannel = { viewModel.previousChannel() },
                                onToggleFavorite = { id -> viewModel.toggleFavorite(id) },
                                onToggleSideDrawer = { viewModel.toggleSideDrawer() },
                                onBack = { viewModel.navigateBack() }
                            )
                        }
                        AppScreen.SETTINGS -> {
                            SettingsScreen(
                                state = state,
                                onRefreshPlaylist = { viewModel.refreshPlaylist() },
                                onChangePlaylist = { viewModel.navigateTo(AppScreen.SETUP) },
                                onClearFavorites = { viewModel.clearFavorites() },
                                onClearHistory = { viewModel.clearHistory() },
                                onNavigate = { screen -> viewModel.navigateTo(screen) }
                            )
                        }
                        AppScreen.FUTURE_LOGIN -> {
                            FutureLoginScreen(
                                onBack = { viewModel.navigateTo(AppScreen.SETTINGS) }
                            )
                        }
                        AppScreen.ABOUT -> {
                            AboutScreen(
                                onBack = { viewModel.navigateTo(AppScreen.SETTINGS) }
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     * Physical Remote Control D-Pad & TV Key Handler
     */
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        val state = viewModel.uiState.value

        if (state.currentScreen == AppScreen.PLAYER) {
            when (keyCode) {
                KeyEvent.KEYCODE_CHANNEL_UP -> {
                    viewModel.nextChannel()
                    return true
                }
                KeyEvent.KEYCODE_CHANNEL_DOWN -> {
                    viewModel.previousChannel()
                    return true
                }
                KeyEvent.KEYCODE_DPAD_UP -> {
                    if (!state.isSideDrawerOpen) {
                        viewModel.previousChannel()
                        return true
                    }
                }
                KeyEvent.KEYCODE_DPAD_DOWN -> {
                    if (!state.isSideDrawerOpen) {
                        viewModel.nextChannel()
                        return true
                    }
                }
                KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                    if (!state.isSideDrawerOpen) {
                        viewModel.toggleSideDrawer()
                        return true
                    }
                }
                KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE -> {
                    viewModel.playerManager.togglePlayPause()
                    return true
                }
                KeyEvent.KEYCODE_BACK -> {
                    if (viewModel.navigateBack()) {
                        return true
                    }
                }
            }
        } else {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                if (viewModel.navigateBack()) {
                    return true
                }
            }
        }

        return super.onKeyDown(keyCode, event)
    }
}
