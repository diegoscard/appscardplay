package com.scard.playiptv

import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.data.parser.M3uParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class CategoryAndFavoritesTest {

    @Test
    fun testDynamicCategoryExtraction() {
        val parser = M3uParser()
        val playlist = """
            #EXTM3U
            #EXTINF:-1 group-title="ESPORTES",ESPN Brasil
            https://exemplo.com/espn.m3u8
            #EXTINF:-1 group-title="ESPORTES",SporTV
            https://exemplo.com/sportv.m3u8
            #EXTINF:-1 group-title="FILMES",HBO Max
            https://exemplo.com/hbo.m3u8
            #EXTINF:-1,Canal Avulso
            https://exemplo.com/avulso.m3u8
        """.trimIndent()

        val result = parser.parse(playlist)
        assertEquals(3, result.categories.size)
        assertTrue(result.categories.contains("ESPORTES"))
        assertTrue(result.categories.contains("FILMES"))
        assertTrue(result.categories.contains("OUTROS"))

        val esportesChannels = result.channels.filter { it.category == "ESPORTES" }
        assertEquals(2, esportesChannels.size)

        val outrosChannels = result.channels.filter { it.category == "OUTROS" }
        assertEquals(1, outrosChannels.size)
    }

    @Test
    fun testFavoritesTogglingLogic() {
        val favorites = mutableSetOf<String>()
        val channelId = "canal_100"

        // Add
        val added = if (favorites.contains(channelId)) favorites.remove(channelId) else favorites.add(channelId)
        assertTrue(added)
        assertTrue(favorites.contains(channelId))

        // Remove
        val removed = if (favorites.contains(channelId)) {
            favorites.remove(channelId)
            true
        } else false
        assertTrue(removed)
        assertFalse(favorites.contains(channelId))
    }

    @Test
    fun testHistoryLimiting() {
        val history = mutableListOf<String>()
        val maxHistory = 5

        for (i in 1..10) {
            val id = "channel_$i"
            history.remove(id)
            history.add(0, id)
        }
        val limited = history.take(maxHistory)

        assertEquals(5, limited.size)
        assertEquals("channel_10", limited[0])
        assertEquals("channel_9", limited[1])
    }
}
