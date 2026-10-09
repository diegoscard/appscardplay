package com.scard.playiptv.data.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

class HistoryRepository(private val context: Context) {
    companion object {
        private val KEY_HISTORY = stringPreferencesKey("recent_channels_history")
        private const val MAX_HISTORY = 20
    }

    val historyFlow: Flow<List<String>> = context.dataStore.data.map { prefs ->
        val raw = prefs[KEY_HISTORY] ?: ""
        if (raw.isBlank()) emptyList() else raw.split(",").filter { it.isNotBlank() }
    }

    suspend fun recordChannelWatched(channelId: String) {
        context.dataStore.edit { prefs ->
            val raw = prefs[KEY_HISTORY] ?: ""
            val list = if (raw.isBlank()) mutableListOf() else raw.split(",").filter { it.isNotBlank() }.toMutableList()
            list.remove(channelId)
            list.add(0, channelId)
            val trimmed = list.take(MAX_HISTORY)
            prefs[KEY_HISTORY] = trimmed.joinToString(",")
        }
    }

    suspend fun clearHistory() {
        context.dataStore.edit { prefs ->
            prefs.remove(KEY_HISTORY)
        }
    }
}
