package com.scard.playiptv.data.model

data class Channel(
    val id: String,
    val name: String,
    val streamUrl: String,
    val logoUrl: String? = null,
    val category: String = "OUTROS",
    val tvgId: String? = null,
    val tvgName: String? = null,
    val isFavorite: Boolean = false,
    val orderIndex: Int = 0
) {
    /**
     * Generates a 2-letter uppercase monogram fallback when no logo URL is available.
     */
    val initials: String
        get() {
            val words = name.trim().split("\\s+".toRegex()).filter { it.isNotEmpty() }
            return when {
                words.isEmpty() -> "SP"
                words.size == 1 -> words[0].take(2).uppercase()
                else -> "${words[0].first()}${words[1].first()}".uppercase()
            }
        }
}
