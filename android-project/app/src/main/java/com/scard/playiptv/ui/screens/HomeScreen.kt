package com.scard.playiptv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.ui.components.ChannelCard
import com.scard.playiptv.ui.components.TvButton
import com.scard.playiptv.ui.theme.*
import com.scard.playiptv.ui.viewmodel.AppScreen
import com.scard.playiptv.ui.viewmodel.UiState

@Composable
fun HomeScreen(
    state: UiState,
    onChannelSelected: (Channel) -> Unit,
    onCategorySelected: (String) -> Unit,
    onNavigate: (AppScreen) -> Unit,
    onToggleFavorite: (String) -> Unit
) {
    val recentChannels = remember(state.recentChannelIds, state.channels) {
        val map = state.channels.associateBy { it.id }
        state.recentChannelIds.mapNotNull { map[it] }
    }

    val favoriteChannels = remember(state.favoriteIds, state.channels) {
        state.channels.filter { state.favoriteIds.contains(it.id) }
    }

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark)
    ) {
        // Left Navigation Sidebar
        TvSidebar(
            currentScreen = AppScreen.HOME,
            onNavigate = onNavigate
        )

        // Main Content Area
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .padding(top = 24.dp, end = 32.dp, bottom = 24.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "SCARD PLAY",
                        color = Color.White,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "IPTV PLAYER",
                        color = CyanNeon,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    )
                }

                if (state.playlist != null) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(CardDark)
                            .border(1.dp, CardBorder, RoundedCornerShape(8.dp))
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "${state.playlist.name} • ${state.channels.size} Canais",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Scrollable Content
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(28.dp),
                contentPadding = PaddingValues(bottom = 32.dp)
            ) {
                // Section 1: Continuar Assistindo (Recent)
                if (recentChannels.isNotEmpty()) {
                    item {
                        SectionHeader(title = "CONTINUAR ASSISTINDO", icon = Icons.Default.History)
                        Spacer(modifier = Modifier.height(12.dp))
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(16.dp),
                            contentPadding = PaddingValues(horizontal = 4.dp)
                        ) {
                            items(recentChannels) { ch ->
                                ChannelCard(
                                    channel = ch,
                                    onClick = { onChannelSelected(ch) },
                                    onToggleFavorite = { onToggleFavorite(ch.id) },
                                    modifier = Modifier.size(width = 170.dp, height = 150.dp)
                                )
                            }
                        }
                    }
                }

                // Section 2: Favoritos
                if (favoriteChannels.isNotEmpty()) {
                    item {
                        SectionHeader(title = "⭐ FAVORITOS", icon = Icons.Default.Star)
                        Spacer(modifier = Modifier.height(12.dp))
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(16.dp),
                            contentPadding = PaddingValues(horizontal = 4.dp)
                        ) {
                            items(favoriteChannels) { ch ->
                                ChannelCard(
                                    channel = ch,
                                    onClick = { onChannelSelected(ch) },
                                    onToggleFavorite = { onToggleFavorite(ch.id) },
                                    modifier = Modifier.size(width = 170.dp, height = 150.dp)
                                )
                            }
                        }
                    }
                }

                // Section 3: Categorias Dinâmicas
                item {
                    SectionHeader(title = "CATEGORIAS", icon = Icons.Default.Category)
                    Spacer(modifier = Modifier.height(12.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        contentPadding = PaddingValues(horizontal = 4.dp)
                    ) {
                        items(state.categories) { cat ->
                            CategoryPill(
                                name = cat,
                                isSelected = state.selectedCategory == cat,
                                onClick = {
                                    onCategorySelected(cat)
                                    onNavigate(AppScreen.LIVE_TV)
                                }
                            )
                        }
                    }
                }

                // Section 4: Todos os Canais (ou Canais em Destaque)
                item {
                    SectionHeader(title = "TODOS OS CANAIS", icon = Icons.Default.Tv)
                    Spacer(modifier = Modifier.height(12.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        contentPadding = PaddingValues(horizontal = 4.dp)
                    ) {
                        items(state.channels.take(25)) { ch ->
                            ChannelCard(
                                channel = ch,
                                onClick = { onChannelSelected(ch) },
                                onToggleFavorite = { onToggleFavorite(ch.id) },
                                modifier = Modifier.size(width = 170.dp, height = 150.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SectionHeader(title: String, icon: ImageVector) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, tint = CyanNeon, modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.5.sp
        )
    }
}

@Composable
fun CategoryPill(
    name: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (isFocused) CyanNeon else if (isSelected) PurpleNeon else CardDark)
            .border(
                1.5.dp,
                if (isFocused) CyanNeon else CardBorder,
                RoundedCornerShape(20.dp)
            )
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .focusable(interactionSource = interactionSource)
            .padding(horizontal = 20.dp, vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = name,
            color = if (isFocused) DeepDark else Color.White,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun TvSidebar(
    currentScreen: AppScreen,
    onNavigate: (AppScreen) -> Unit
) {
    Column(
        modifier = Modifier
            .width(80.dp)
            .fillMaxHeight()
            .background(SurfaceDark)
            .padding(vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // App SP icon
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(Brush.linearGradient(listOf(CyanNeon, PurpleNeon))),
            contentAlignment = Alignment.Center
        ) {
            Text("SP", fontWeight = FontWeight.Black, fontSize = 18.sp, color = DeepDark)
        }

        // Navigation icons
        Column(
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            SidebarIconItem(
                icon = Icons.Default.Home,
                label = "Início",
                isSelected = currentScreen == AppScreen.HOME,
                onClick = { onNavigate(AppScreen.HOME) }
            )
            SidebarIconItem(
                icon = Icons.Default.LiveTv,
                label = "TV ao Vivo",
                isSelected = currentScreen == AppScreen.LIVE_TV,
                onClick = { onNavigate(AppScreen.LIVE_TV) }
            )
            SidebarIconItem(
                icon = Icons.Default.Settings,
                label = "Configurações",
                isSelected = currentScreen == AppScreen.SETTINGS,
                onClick = { onNavigate(AppScreen.SETTINGS) }
            )
        }

        // About
        SidebarIconItem(
            icon = Icons.Default.Info,
            label = "Sobre",
            isSelected = currentScreen == AppScreen.ABOUT,
            onClick = { onNavigate(AppScreen.ABOUT) }
        )
    }
}

@Composable
fun SidebarIconItem(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()

    Box(
        modifier = Modifier
            .size(50.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isFocused) CyanNeon else if (isSelected) PurpleNeon.copy(alpha = 0.3f) else Color.Transparent)
            .border(
                2.dp,
                if (isFocused) CyanNeon else if (isSelected) PurpleNeon else Color.Transparent,
                RoundedCornerShape(12.dp)
            )
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .focusable(interactionSource = interactionSource),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isFocused) DeepDark else if (isSelected) CyanNeon else TextSecondary,
            modifier = Modifier.size(24.dp)
        )
    }
}
