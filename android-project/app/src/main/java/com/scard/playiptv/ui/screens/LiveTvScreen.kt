package com.scard.playiptv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.data.model.Channel
import com.scard.playiptv.ui.components.ChannelCard
import com.scard.playiptv.ui.theme.*
import com.scard.playiptv.ui.viewmodel.AppScreen
import com.scard.playiptv.ui.viewmodel.UiState

@Composable
fun LiveTvScreen(
    state: UiState,
    onChannelSelected: (Channel) -> Unit,
    onCategorySelected: (String) -> Unit,
    onNavigate: (AppScreen) -> Unit,
    onToggleFavorite: (String) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark)
    ) {
        // Sidebar
        TvSidebar(
            currentScreen = AppScreen.LIVE_TV,
            onNavigate = onNavigate
        )

        // Middle Categories Column (D-Pad vertical list)
        Column(
            modifier = Modifier
                .width(260.dp)
                .fillMaxHeight()
                .background(SurfaceDark)
                .border(1.dp, CardBorder, RoundedCornerShape(0.dp))
                .padding(vertical = 24.dp, horizontal = 16.dp)
        ) {
            Text(
                text = "CATEGORIAS",
                color = CyanNeon,
                fontWeight = FontWeight.Black,
                fontSize = 16.sp,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(state.categories) { cat ->
                    val isSelected = state.selectedCategory == cat
                    val interactionSource = remember { MutableInteractionSource() }
                    val isFocused by interactionSource.collectIsFocusedAsState()

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isFocused) CyanNeon else if (isSelected) PurpleNeon.copy(alpha = 0.35f) else CardDark)
                            .border(
                                1.5.dp,
                                if (isFocused) CyanNeon else if (isSelected) PurpleNeon else Color.Transparent,
                                RoundedCornerShape(10.dp)
                            )
                            .clickable(interactionSource = interactionSource, indication = null) {
                                onCategorySelected(cat)
                            }
                            .focusable(interactionSource = interactionSource)
                            .padding(horizontal = 14.dp, vertical = 12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = cat,
                                color = if (isFocused) DeepDark else Color.White,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                fontSize = 14.sp
                            )
                            if (cat == "FAVORITOS") {
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

        // Channels Grid on the Right
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .padding(24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = state.selectedCategory.uppercase(),
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp
                )

                Text(
                    text = "${state.filteredChannels.size} canais disponíveis",
                    color = TextSecondary,
                    fontSize = 14.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (state.filteredChannels.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(
                        text = "Nenhum canal encontrado nesta categoria.",
                        color = TextSecondary,
                        fontSize = 16.sp
                    )
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Adaptive(minSize = 160.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(state.filteredChannels) { ch ->
                        ChannelCard(
                            channel = ch,
                            onClick = { onChannelSelected(ch) },
                            onToggleFavorite = { onToggleFavorite(ch.id) },
                            modifier = Modifier.height(150.dp)
                        )
                    }
                }
            }
        }
    }
}
