package com.scard.playiptv.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.ui.theme.*

@Composable
fun TvButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    isPrimary: Boolean = true,
    enabled: Boolean = true
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()

    val scale by animateFloatAsState(if (isFocused) 1.08f else 1.0f, label = "button_scale")
    val borderColor by animateColorAsState(
        if (isFocused) CyanNeon else Color.Transparent,
        label = "button_border"
    )
    val backgroundBrush = if (isFocused) {
        Brush.horizontalGradient(listOf(CyanNeon, PurpleNeon))
    } else if (isPrimary) {
        Brush.horizontalGradient(listOf(Color(0xFF0284C7), Color(0xFF6366F1)))
    } else {
        Brush.horizontalGradient(listOf(CardDark, SurfaceDark))
    }

    Box(
        modifier = modifier
            .scale(scale)
            .shadow(if (isFocused) 16.dp else 0.dp, shape = RoundedCornerShape(12.dp), spotColor = CyanNeon)
            .clip(RoundedCornerShape(12.dp))
            .background(backgroundBrush)
            .border(2.dp, borderColor, RoundedCornerShape(12.dp))
            .clickable(interactionSource = interactionSource, indication = null, enabled = enabled) { onClick() }
            .focusable(interactionSource = interactionSource)
            .padding(horizontal = 24.dp, vertical = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (isFocused) DeepDark else TextPrimary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                color = if (isFocused) DeepDark else TextPrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.5.sp
            )
        }
    }
}

@Composable
fun ChannelCard(
    channel: Channel,
    onClick: () -> Unit,
    onToggleFavorite: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val scale by animateFloatAsState(if (isFocused) 1.07f else 1.0f, label = "card_scale")

    var imageLoadFailed by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .scale(scale)
            .shadow(if (isFocused) 18.dp else 4.dp, shape = RoundedCornerShape(14.dp), spotColor = FocusGlow)
            .clip(RoundedCornerShape(14.dp))
            .background(if (isFocused) Color(0xFF1E293B) else CardDark)
            .border(
                width = if (isFocused) 3.dp else 1.dp,
                color = if (isFocused) CyanNeon else CardBorder,
                shape = RoundedCornerShape(14.dp)
            )
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .focusable(interactionSource = interactionSource)
            .padding(12.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxSize()
        ) {
            // Logo / Initial Fallback
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF0F172A)),
                contentAlignment = Alignment.Center
            ) {
                if (!channel.logoUrl.isNullOrBlank() && !imageLoadFailed) {
                    AsyncImage(
                        model = channel.logoUrl,
                        contentDescription = channel.name,
                        contentScale = ContentScale.Fit,
                        modifier = Modifier.fillMaxSize().padding(6.dp),
                        onError = { imageLoadFailed = true }
                    )
                } else {
                    // Monogram initial fallback
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(RoundedCornerShape(27.dp))
                            .background(Brush.linearGradient(listOf(PurpleNeon, CyanNeon))),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = channel.initials,
                            color = Color.White,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 20.sp
                        )
                    }
                }

                // Favorite badge
                if (channel.isFavorite) {
                    Icon(
                        imageVector = Icons.Filled.Star,
                        contentDescription = "Favorito",
                        tint = Color(0xFFFFD700),
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(6.dp)
                            .size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Channel Title
            Text(
                text = channel.name,
                color = if (isFocused) CyanNeon else TextPrimary,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )

            // Category tag
            Text(
                text = channel.category,
                color = TextSecondary,
                fontSize = 12.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth().padding(top = 2.dp)
            )
        }
    }
}
