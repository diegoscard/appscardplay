package com.scard.playiptv.data.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.scard.playiptv.data.model.Category
import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.data.model.Playlist
import com.scard.playiptv.data.parser.M3uParser
import com.scard.playiptv.data.parser.ParsedPlaylistResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit

private val Context.dataStore by preferencesDataStore(name = "scard_play_prefs")

class PlaylistRepository(
    private val context: Context,
    private val parser: M3uParser = M3uParser(),
    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .followRedirects(true)
        .build()
) {
    companion object {
        private val KEY_PLAYLIST_NAME = stringPreferencesKey("playlist_name")
        private val KEY_PLAYLIST_URL = stringPreferencesKey("playlist_url")
        private val KEY_CACHED_M3U = stringPreferencesKey("cached_m3u_content")
    }

    val savedPlaylistFlow: Flow<Playlist?> = context.dataStore.data.map { prefs ->
        val url = prefs[KEY_PLAYLIST_URL]
        val name = prefs[KEY_PLAYLIST_NAME] ?: "Minha Playlist"
        if (!url.isNullOrBlank()) {
            Playlist(name = name, url = url)
        } else {
            null
        }
    }

    suspend fun getSavedPlaylist(): Playlist? {
        return savedPlaylistFlow.first()
    }

    suspend fun loadCachedChannels(): ParsedPlaylistResult? = withContext(Dispatchers.IO) {
        val prefs = context.dataStore.data.first()
        val cachedContent = prefs[KEY_CACHED_M3U] ?: return@withContext null
        if (cachedContent.isBlank()) return@withContext null
        parser.parse(cachedContent)
    }

    /**
     * Downloads and parses playlist from URL.
     * Retains old cache if new download or parse fails!
     */
    suspend fun fetchAndSavePlaylist(name: String, url: String): Result<ParsedPlaylistResult> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url(url)
                .header("User-Agent", "SCARD-PLAY-IPTV/1.0 (Android TV)")
                .build()

            val response = httpClient.newCall(request).execute()
            if (!response.isSuccessful) {
                return@withContext Result.failure(Exception("Falha ao baixar lista: HTTP ${response.code}"))
            }

            val bodyString = response.body?.string() ?: return@withContext Result.failure(Exception("Resposta vazia do servidor."))
            if (!bodyString.contains("#EXT", ignoreCase = true) && !bodyString.contains("http", ignoreCase = true)) {
                return@withContext Result.failure(Exception("Formato inválido: o conteúdo não parece ser uma lista M3U."))
            }

            val parsed = parser.parse(bodyString)
            if (parsed.channels.isEmpty()) {
                return@withContext Result.failure(Exception("A lista foi baixada mas nenhum canal válido foi encontrado."))
            }

            // Save to persistent preferences
            context.dataStore.edit { prefs ->
                prefs[KEY_PLAYLIST_NAME] = name
                prefs[KEY_PLAYLIST_URL] = url
                prefs[KEY_CACHED_M3U] = bodyString
            }

            Result.success(parsed)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun clearPlaylistData() = withContext(Dispatchers.IO) {
        context.dataStore.edit { prefs ->
            prefs.remove(KEY_PLAYLIST_NAME)
            prefs.remove(KEY_PLAYLIST_URL)
            prefs.remove(KEY_CACHED_M3U)
        }
    }
}
