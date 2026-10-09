package com.scard.playiptv.data.parser

import com.scard.playiptv.data.model.Channel
import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.util.UUID
import java.util.regex.Pattern

data class ParsedPlaylistResult(
    val channels: List<Channel>,
    val categories: List<String>
)

class M3uParser {

    companion object {
        private const val DEFAULT_CATEGORY = "OUTROS"
        private val TVG_ID_REGEX = Pattern.compile("""tvg-id=["']([^"']*)["']""", Pattern.CASE_INSENSITIVE)
        private val TVG_NAME_REGEX = Pattern.compile("""tvg-name=["']([^"']*)["']""", Pattern.CASE_INSENSITIVE)
        private val TVG_LOGO_REGEX = Pattern.compile("""tvg-logo=["']([^"']*)["']""", Pattern.CASE_INSENSITIVE)
        private val GROUP_TITLE_REGEX = Pattern.compile("""group-title=["']([^"']*)["']""", Pattern.CASE_INSENSITIVE)
    }

    /**
     * Parses an M3U playlist from an InputStream or raw string.
     * Tolerant to missing attributes, accented characters, varied spacing, and empty lines.
     */
    fun parse(content: String): ParsedPlaylistResult {
        val lines = content.lineSequence()
        return parseLines(lines)
    }

    fun parse(inputStream: InputStream): ParsedPlaylistResult {
        val reader = BufferedReader(InputStreamReader(inputStream, Charsets.UTF_8))
        return parseLines(reader.lineSequence())
    }

    private fun parseLines(lines: Sequence<String>): ParsedPlaylistResult {
        val channels = mutableListOf<Channel>()
        val categoriesSet = linkedSetOf<String>()

        var currentExtInf: String? = null
        var order = 0

        for (rawLine in lines) {
            val line = rawLine.trim()
            if (line.isEmpty()) continue

            if (line.startsWith("#EXTINF:", ignoreCase = true)) {
                currentExtInf = line
            } else if (line.startsWith("#EXTM3U", ignoreCase = true) || line.startsWith("#")) {
                // Comment or header line, ignore
                continue
            } else {
                // This is a stream URL line
                val streamUrl = line
                if (streamUrl.startsWith("http://", ignoreCase = true) || 
                    streamUrl.startsWith("https://", ignoreCase = true) ||
                    streamUrl.startsWith("rtmp://", ignoreCase = true) ||
                    streamUrl.startsWith("rtsp://", ignoreCase = true)) {
                    
                    val channel = parseChannelEntry(currentExtInf, streamUrl, order++)
                    channels.add(channel)
                    categoriesSet.add(channel.category)
                    currentExtInf = null
                }
            }
        }

        // Always put OUTROS at the end of the category set if present
        val orderedCategories = categoriesSet.toList()

        return ParsedPlaylistResult(
            channels = channels,
            categories = orderedCategories
        )
    }

    private fun parseChannelEntry(extInf: String?, streamUrl: String, order: Int): Channel {
        if (extInf == null) {
            val fallbackName = "Canal ${order + 1}"
            return Channel(
                id = UUID.randomUUID().toString(),
                name = fallbackName,
                streamUrl = streamUrl,
                category = DEFAULT_CATEGORY,
                orderIndex = order
            )
        }

        val tvgId = extractAttribute(TVG_ID_REGEX, extInf)
        val tvgName = extractAttribute(TVG_NAME_REGEX, extInf)
        val tvgLogo = extractAttribute(TVG_LOGO_REGEX, extInf)
        val groupTitle = extractAttribute(GROUP_TITLE_REGEX, extInf)

        // The channel display name is after the comma in #EXTINF:-1 ... , Channel Name
        val commaIndex = extInf.lastIndexOf(',')
        val displayName = if (commaIndex != -1 && commaIndex < extInf.length - 1) {
            extInf.substring(commaIndex + 1).trim()
        } else {
            tvgName?.takeIf { it.isNotBlank() } ?: "Canal ${order + 1}"
        }

        val finalCategory = if (!groupTitle.isNullOrBlank()) {
            groupTitle.trim()
        } else {
            DEFAULT_CATEGORY
        }

        val finalName = if (displayName.isNotBlank()) displayName else "Canal ${order + 1}"

        return Channel(
            id = tvgId?.takeIf { it.isNotBlank() } ?: UUID.randomUUID().toString(),
            name = finalName,
            streamUrl = streamUrl,
            logoUrl = tvgLogo?.takeIf { it.isNotBlank() },
            category = finalCategory,
            tvgId = tvgId?.takeIf { it.isNotBlank() },
            tvgName = tvgName?.takeIf { it.isNotBlank() },
            orderIndex = order
        )
    }

    private fun extractAttribute(pattern: Pattern, text: String): String? {
        val matcher = pattern.matcher(text)
        return if (matcher.find()) {
            matcher.group(1)?.trim()
        } else {
            null
        }
    }
}
