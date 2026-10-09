package com.scard.playiptv.ui.screens

import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.activity.compose.BackHandler
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.ui.PlayerView
import coil.compose.AsyncImage
import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.player.Media3PlayerManager
import com.scard.playiptv.player.PlaybackUiState
import com.scard.playiptv.ui.components.TvButton
import com.scard.playiptv.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun PlayerScreen(
    currentChannel: Channel?,
    playbackState: PlaybackUiState,
    playerManager: Media3PlayerManager,
    isSideDrawerOpen: Boolean,
    channelList: List<Channel>,
    onChannelSelected: (Channel) -> Unit,
    onNextChannel: () -> Unit,
    onPrevChannel: () -> Unit,
    onToggleFavorite: (String) -> Unit,
    onToggleSideDrawer: () -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    var showOsdBanner by remember { mutableStateOf(true) }

    // Intercept back button cleanly
    BackHandler {
        if (isSideDrawerOpen) {
            onToggleSideDrawer()
        } else {
            onBack()
        }
    }

    // Auto-hide OSD Banner after 4.5 seconds
    LaunchedEffect(currentChannel?.id) {
        showOsdBanner = true
        delay(4500)
        showOsdBanner = false
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // ExoPlayer Media3 AndroidView
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { ctx ->
                PlayerView(ctx).apply {
                    player = playerManager.getPlayer()
                    useController = false
                    layoutParams = FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                }
            },
            update = { playerView ->
                playerView.player = playerManager.getPlayer()
            }
        )

        // Buffering Indicator
        if (playbackState is PlaybackUiState.Buffering) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.5f)),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceDark.copy(alpha = 0.9f))
                        .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                        .padding(32.dp)
                ) {
                    CircularProgressIndicator(
                        color = CyanNeon,
                        modifier = Modifier.size(48.dp),
                        strokeWidth = 4.dp
                    )
                    Spacer(modifier = Modifier.height(18.dp))
                    Text(
                        text = "CARREGANDO...",
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = currentChannel?.name ?: "",
                        color = TextSecondary,
                        fontSize = 14.sp
                    )
                }
            }
        }

        // Error State Card
        if (playbackState is PlaybackUiState.Error) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.85f)),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .fillMaxWidth(0.6f)
                        .clip(RoundedCornerShape(18.dp))
                        .background(SurfaceDark)
                        .border(1.5.dp, ErrorRed, RoundedCornerShape(18.dp))
                        .padding(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = null,
                        tint = ErrorRed,
                        modifier = Modifier.size(54.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Não foi possível reproduzir este canal.",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = playbackState.errorMessage,
                        color = TextSecondary,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(28.dp))

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        TvButton(
                            text = "TENTAR NOVAMENTE",
                            icon = Icons.Default.Refresh,
                            onClick = { playerManager.retryCurrentChannel() }
                        )
                        TvButton(
                            text = "PRÓXIMO CANAL",
                            icon = Icons.Default.SkipNext,
                            isPrimary = false,
                            onClick = onNextChannel
                        )
                        TvButton(
                            text = "VOLTAR",
                            icon = Icons.Default.ArrowBack,
                            isPrimary = false,
                            onClick = onBack
                        )
                    }
                }
            }
        }

        // OSD Banner (Appears on channel switch / D-Pad)
        AnimatedVisibility(
            visible = showOsdBanner && currentChannel != null && playbackState !is PlaybackUiState.Error,
            enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
            exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(),
            modifier = Modifier.align(Alignment.TopCenter)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color.Black.copy(alpha = 0.9f), Color.Transparent)
                        )
                    )
                    .padding(horizontal = 48.dp, vertical = 28.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Channel Logo / Fallback
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(CardDark)
                                .border(1.dp, CardBorder, RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            if (!currentChannel?.logoUrl.isNullOrBlank()) {
                                AsyncImage(
                                    model = currentChannel?.logoUrl,
                                    contentDescription = null,
                                    modifier = Modifier.fillMaxSize().padding(6.dp)
                                )
                            } else {
                                Text(
                                    text = currentChannel?.initials ?: "SP",
                                    color = CyanNeon,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 20.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(18.dp))

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = currentChannel?.name ?: "",
                                    color = Color.White,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Black
                                )
                                if (currentChannel?.isFavorite == true) {
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Icon(
                                        imageVector = Icons.Default.Star,
                                        contentDescription = null,
                                        tint = Color(0xFFFFD700),
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "CATEGORIA: ${currentChannel?.category?.uppercase()}",
                                color = CyanNeon,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                letterSpacing = 1.sp
                            )
                        }
                    }

                    // Remote D-Pad helper hints
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RemoteHintBadge(key = "▲ / ▼", label = "Trocar Canal")
                        RemoteHintBadge(key = "OK", label = "Lista Lateral")
                        RemoteHintBadge(key = "VOLTAR", label = "Sair")
                    }
                }
            }
        }

        // Bottom Controls OSD on user request
        AnimatedVisibility(
            visible = showOsdBanner && playbackState !is PlaybackUiState.Error,
            enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
            exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color.Transparent, Color.Black.copy(alpha = 0.9f))
                        )
                    )
                    .padding(horizontal = 48.dp, vertical = 24.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TvIconButton(icon = Icons.Default.SkipPrevious, label = "Canal Anterior (▲)", onClick = onPrevChannel)
                    Spacer(modifier = Modifier.width(18.dp))
                    TvIconButton(
                        icon = if (playbackState is PlaybackUiState.Playing) Icons.Default.Pause else Icons.Default.PlayArrow,
                        label = "Play / Pause",
                        isHighlight = true,
                        onClick = { playerManager.togglePlayPause() }
                    )
                    Spacer(modifier = Modifier.width(18.dp))
                    TvIconButton(icon = Icons.Default.SkipNext, label = "Próximo Canal (▼)", onClick = onNextChannel)
                    Spacer(modifier = Modifier.width(24.dp))
                    TvIconButton(
                        icon = Icons.Default.List,
                        label = "Lista de Canais (OK)",
                        onClick = onToggleSideDrawer
                    )
                    Spacer(modifier = Modifier.width(18.dp))
                    if (currentChannel != null) {
                        TvIconButton(
                            icon = if (currentChannel.isFavorite) Icons.Default.Star else Icons.Default.StarBorder,
                            label = "Favoritar",
                            tint = if (currentChannel.isFavorite) Color(0xFFFFD700) else TextPrimary,
                            onClick = { onToggleFavorite(currentChannel.id) }
                        )
                    }
                }
            }
        }

        // Side Channel Drawer (Opened on OK or button)
        AnimatedVisibility(
            visible = isSideDrawerOpen,
            enter = slideInHorizontally(initialOffsetX = { -it }) + fadeIn(),
            exit = slideOutHorizontally(targetOffsetX = { -it }) + fadeOut(),
            modifier = Modifier.align(Alignment.CenterStart)
        ) {
            SideChannelDrawer(
                currentChannel = currentChannel,
                channels = channelList,
                onChannelSelected = { ch ->
                    onChannelSelected(ch)
                    onToggleSideDrawer()
                },
                onClose = onToggleSideDrawer
            )
        }
    }
}

@Composable
fun SideChannelDrawer(
    currentChannel: Channel?,
    channels: List<Channel>,
    onChannelSelected: (Channel) -> Unit,
    onClose: () -> Unit
) {
    Column(
        modifier = Modifier
            .width(360.dp)
            .fillMaxHeight()
            .background(SurfaceDark.copy(alpha = 0.96f))
            .border(1.dp, CardBorder, RoundedCornerShape(0.dp))
            .padding(20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(Color.Red)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "TV AO VIVO",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    letterSpacing = 1.sp
                )
            }
            Text(
                text = "${channels.size} canais",
                color = TextSecondary,
                fontSize = 13.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            itemsIndexed(channels) { index, ch ->
                val isCurrent = ch.id == currentChannel?.id
                val interactionSource = remember { MutableInteractionSource() }
                val isFocused by interactionSource.collectIsFocusedAsState()

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isFocused) CyanNeon else if (isCurrent) PurpleNeon.copy(alpha = 0.25f) else CardDark)
                        .border(
                            1.5.dp,
                            if (isFocused) CyanNeon else if (isCurrent) PurpleNeon else Color.Transparent,
                            RoundedCornerShape(8.dp)
                        )
                        .clickable(interactionSource = interactionSource, indication = null) { onChannelSelected(ch) }
                        .focusable(interactionSource = interactionSource)
                        .padding(horizontal = 12.dp, vertical = 10.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = String.format("%02d", index + 1),
                            color = if (isFocused) DeepDark else TextSecondary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            modifier = Modifier.width(28.dp)
                        )

                        if (isCurrent) {
                            Text(
                                text = "🔴",
                                fontSize = 10.sp,
                                modifier = Modifier.padding(end = 6.dp)
                            )
                        }

                        Text(
                            text = ch.name,
                            color = if (isFocused) DeepDark else Color.White,
                            fontWeight = if (isCurrent) FontWeight.Black else FontWeight.Medium,
                            fontSize = 14.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.weight(1f)
                        )

                        if (ch.isFavorite) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = if (isFocused) DeepDark else Color(0xFFFFD700),
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun RemoteHintBadge(key: String, label: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(Color.Black.copy(alpha = 0.6f))
            .border(1.dp, CardBorder, RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(text = key, color = CyanNeon, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        Spacer(modifier = Modifier.width(6.dp))
        Text(text = label, color = TextSecondary, fontSize = 12.sp)
    }
}

@Composable
fun TvIconButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    isHighlight: Boolean = false,
    tint: Color = TextPrimary,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()

    Box(
        modifier = Modifier
            .size(48.dp)
            .clip(CircleShape)
            .background(if (isFocused) CyanNeon else if (isHighlight) PurpleNeon else CardDark)
            .border(2.dp, if (isFocused) CyanNeon else CardBorder, CircleShape)
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .focusable(interactionSource = interactionSource),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isFocused) DeepDark else tint,
            modifier = Modifier.size(22.dp)
        )
    }
}
