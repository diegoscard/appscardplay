package com.scard.playiptv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.ui.components.TvButton
import com.scard.playiptv.ui.theme.*
import com.scard.playiptv.ui.viewmodel.AppScreen
import com.scard.playiptv.ui.viewmodel.UiState

@Composable
fun SettingsScreen(
    state: UiState,
    onRefreshPlaylist: () -> Unit,
    onChangePlaylist: () -> Unit,
    onClearFavorites: () -> Unit,
    onClearHistory: () -> Unit,
    onNavigate: (AppScreen) -> Unit
) {
    val scrollState = rememberScrollState()

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark)
    ) {
        TvSidebar(
            currentScreen = AppScreen.SETTINGS,
            onNavigate = onNavigate
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .padding(32.dp)
                .verticalScroll(scrollState)
        ) {
            Text(
                text = "CONFIGURAÇÕES",
                color = Color.White,
                fontSize = 28.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )

            if (state.notificationMessage != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.8f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(CyanNeon.copy(alpha = 0.15f))
                        .border(1.dp, CyanNeon, RoundedCornerShape(8.dp))
                        .padding(12.dp)
                ) {
                    Text(text = state.notificationMessage, color = CyanNeon, fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Section 1: Playlist
            SettingsCardSection(title = "Playlist e Conteúdo") {
                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "Fonte da Playlist", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(
                                text = state.playlist?.name ?: "Nenhuma playlist carregada",
                                color = TextSecondary,
                                fontSize = 14.sp
                            )
                            if (state.playlist != null) {
                                Text(
                                    text = state.playlist.url,
                                    color = CyanNeon,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            TvButton(
                                text = "ATUALIZAR LISTA",
                                icon = Icons.Default.Refresh,
                                onClick = onRefreshPlaylist
                            )
                            TvButton(
                                text = "TROCAR PLAYLIST",
                                icon = Icons.Default.SwapHoriz,
                                isPrimary = false,
                                onClick = onChangePlaylist
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Section 2: Dados Locais
            SettingsCardSection(title = "Dados e Armazenamento") {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "Gerenciar Dados do Aplicativo", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(
                            text = "${state.favoriteIds.size} favoritos salvos • ${state.recentChannelIds.size} itens no histórico",
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        TvButton(
                            text = "LIMPAR FAVORITOS",
                            icon = Icons.Default.DeleteSweep,
                            isPrimary = false,
                            onClick = onClearFavorites
                        )
                        TvButton(
                            text = "LIMPAR HISTÓRICO",
                            icon = Icons.Default.HistoryToggleOff,
                            isPrimary = false,
                            onClick = onClearHistory
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Section 3: Futura API
            SettingsCardSection(title = "Servidor e Autenticação (Futuro)") {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "Módulo de Login Centralizado", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(
                            text = "Preparado para integração REST (POST /api/auth/login)",
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                    }

                    TvButton(
                        text = "VER TELA DE LOGIN",
                        icon = Icons.Default.Login,
                        isPrimary = false,
                        onClick = { onNavigate(AppScreen.FUTURE_LOGIN) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Section 4: Sobre
            SettingsCardSection(title = "Informações do Sistema") {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "SCARD PLAY IPTV", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(text = "Versão 1.0.0 • Player IPTV para Android TV", color = TextSecondary, fontSize = 14.sp)
                    }
                    TvButton(
                        text = "SOBRE O APP",
                        icon = Icons.Default.Info,
                        isPrimary = false,
                        onClick = { onNavigate(AppScreen.ABOUT) }
                    )
                }
            }
        }
    }
}

@Composable
fun SettingsCardSection(
    title: String,
    content: @Composable () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceDark)
            .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
            .padding(20.dp)
    ) {
        Text(
            text = title.uppercase(),
            color = CyanNeon,
            fontWeight = FontWeight.Bold,
            fontSize = 13.sp,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(14.dp))
        content()
    }
}
