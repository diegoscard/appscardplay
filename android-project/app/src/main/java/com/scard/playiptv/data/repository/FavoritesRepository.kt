package com.scard.playiptv.data.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

class FavoritesRepository(private val context: Context) {
    companion object {
        private val KEY_FAVORITES = stringSetPreferencesKey("user_favorites")
    }

    val favoritesFlow: Flow<Set<String>> = context.dataStore.data.map { prefs ->
        prefs[KEY_FAVORITES] ?: emptySet()
    }

    suspend fun isFavorite(channelId: String): Boolean {
        val current = favoritesFlow.first()
        return current.contains(channelId)
    }

    suspend fun toggleFavorite(channelId: String): Boolean {
        var isNowFavorite = false
        context.dataStore.edit { prefs ->
            val current = (prefs[KEY_FAVORITES] ?: emptySet()).toMutableSet()
            if (current.contains(channelId)) {
                current.remove(channelId)
                isNowFavorite = false
            } else {
                current.add(channelId)
                isNowFavorite = true
            }
            prefs[KEY_FAVORITES] = current
        }
        return isNowFavorite
    }

    suspend fun clearFavorites() {
        context.dataStore.edit { prefs ->
            prefs.remove(KEY_FAVORITES)
        }
    }
}
