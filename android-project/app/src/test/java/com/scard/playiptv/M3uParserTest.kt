package com.scard.playiptv

import com.scard.playiptv.data.parser.M3uParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class M3uParserTest {

    private lateinit var parser: M3uParser

    @Before
    fun setUp() {
        parser = M3uParser()
    }

    @Test
    fun testStandardM3uParsing() {
        val content = """
            #EXTM3U
            #EXTINF:-1 tvg-id="canal1" tvg-name="Canal Um" tvg-logo="https://exemplo.com/logo1.png" group-title="Brasil",Canal Um HD
            https://servidor.com/live/canal1.m3u8
            #EXTINF:-1 tvg-id="canal2" tvg-name="Canal Dois" tvg-logo="https://exemplo.com/logo2.png" group-title="Esportes",Canal Dois Esportes
            https://servidor.com/live/canal2.m3u8
        """.trimIndent()

        val result = parser.parse(content)

        assertEquals(2, result.channels.size)
        assertEquals(2, result.categories.size)

        val first = result.channels[0]
        assertEquals("canal1", first.id)
        assertEquals("Canal Um HD", first.name)
        assertEquals("Brasil", first.category)
        assertEquals("https://exemplo.com/logo1.png", first.logoUrl)
        assertEquals("https://servidor.com/live/canal1.m3u8", first.streamUrl)

        val second = result.channels[1]
        assertEquals("Canal Dois Esportes", second.name)
        assertEquals("Esportes", second.category)
    }

    @Test
    fun testMissingGroupTitleDefaultsToOutros() {
        val content = """
            #EXTM3U
            #EXTINF:-1 tvg-id="canal_sem_grupo",Canal Sem Grupo
            http://stream.exemplo.com/live.m3u8
        """.trimIndent()

        val result = parser.parse(content)

        assertEquals(1, result.channels.size)
        assertEquals("OUTROS", result.channels[0].category)
        assertTrue(result.categories.contains("OUTROS"))
    }

    @Test
    fun testAccentedCharactersAndSpecialSymbols() {
        val content = """
            #EXTM3U
            #EXTINF:-1 tvg-id="noticias_br" tvg-logo="" group-title="NOTÍCIAS & INFORMAÇÃO",São Paulo Notícias 24h (Ação & Emoção)
            https://stream.br/noticias.m3u8
            #EXTINF:-1 group-title="MÚSICA",Rádio & TV Canção Nova
            https://stream.br/cancao.m3u8
        """.trimIndent()

        val result = parser.parse(content)

        assertEquals(2, result.channels.size)
        assertEquals("São Paulo Notícias 24h (Ação & Emoção)", result.channels[0].name)
        assertEquals("NOTÍCIAS & INFORMAÇÃO", result.channels[0].category)
        assertNull(result.channels[0].logoUrl)
        assertEquals("SP", result.channels[0].initials)
    }

    @Test
    fun testEmptyPlaylistAndInvalidLines() {
        val emptyContent = ""
        val emptyResult = parser.parse(emptyContent)
        assertEquals(0, emptyResult.channels.size)
        assertEquals(0, emptyResult.categories.size)

        val commentsOnly = """
            #EXTM3U
            # Some comment
            # Another comment
        """.trimIndent()
        val commentResult = parser.parse(commentsOnly)
        assertEquals(0, commentResult.channels.size)
    }

    @Test
    fun testChannelInitialsFallback() {
        val content = """
            #EXTM3U
            #EXTINF:-1,Globo News
            https://exemplo.com/live.m3u8
            #EXTINF:-1,ESPN
            https://exemplo.com/live2.m3u8
        """.trimIndent()

        val result = parser.parse(content)
        assertEquals("GN", result.channels[0].initials)
        assertEquals("ES", result.channels[1].initials)
    }
}
