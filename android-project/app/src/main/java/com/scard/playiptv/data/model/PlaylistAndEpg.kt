package com.scard.playiptv.data.model

data class Playlist(
    val id: String = "default_playlist",
    val name: String,
    val url: String,
    val lastUpdated: Long = System.currentTimeMillis(),
    val channelCount: Int = 0
)

data class EPGProgram(
    val channelId: String,
    val title: String,
    val description: String = "",
    val startTime: Long,
    val endTime: Long
) {
    val isLiveNow: Boolean
        get() {
            val now = System.currentTimeMillis()
            return now in startTime..endTime
        }

    val progressPercent: Float
        get() {
            val now = System.currentTimeMillis()
            if (now <= startTime) return 0f
            if (now >= endTime) return 1f
            val total = (endTime - startTime).toFloat()
            return if (total > 0) (now - startTime) / total else 0f
        }
}
