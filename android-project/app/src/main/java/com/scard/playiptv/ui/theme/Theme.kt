package com.scard.playiptv.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.tv.material3.ColorScheme
import androidx.tv.material3.ExperimentalTvMaterial3Api
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.darkColorScheme

val CyanNeon = Color(0xFF00E5FF)
val PurpleNeon = Color(0xFF7C4DFF)
val DeepDark = Color(0xFF080C14)
val SurfaceDark = Color(0xFF101726)
val CardDark = Color(0xFF182236)
val CardBorder = Color(0xFF24334F)
val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)
val FocusGlow = Color(0xFF38BDF8)
val ErrorRed = Color(0xFFEF4444)

@OptIn(ExperimentalTvMaterial3Api::class)
private val TvDarkColors: ColorScheme = darkColorScheme(
    primary = CyanNeon,
    onPrimary = DeepDark,
    secondary = PurpleNeon,
    onSecondary = TextPrimary,
    background = DeepDark,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = CardDark,
    onSurfaceVariant = TextSecondary,
    error = ErrorRed
)

@OptIn(ExperimentalTvMaterial3Api::class)
@Composable
fun ScardPlayTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = TvDarkColors,
        content = content
    )
}
