package com.scard.playiptv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cable
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.ui.components.TvButton
import com.scard.playiptv.ui.theme.*

@Composable
fun SetupScreen(
    isLoading: Boolean,
    errorMessage: String?,
    onConnect: (name: String, url: String) -> Unit,
    onOpenFutureLogin: () -> Unit
) {
    var playlistName by remember { mutableStateOf("Minha Lista IPTV") }
    var playlistUrl by remember { mutableStateOf("") }
    var saveLocally by remember { mutableStateOf(true) }

    val scrollState = rememberScrollState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark)
            .padding(horizontal = 48.dp, vertical = 32.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(CyanNeon),
                    contentAlignment = Alignment.Center
                ) {
                    Text("SP", fontWeight = FontWeight.Black, fontSize = 20.sp, color = DeepDark)
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "SCARD PLAY IPTV",
                        color = Color.White,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "Configure sua fonte de conteúdo",
                        color = TextSecondary,
                        fontSize = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Options Row
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth(0.85f)
            ) {
                TvOptionBadge(title = "1. URL M3U / M3U8", isSelected = true, modifier = Modifier.weight(1f))
                TvOptionBadge(title = "2. Playlist Local", isSelected = false, modifier = Modifier.weight(1f))
                TvOptionBadge(
                    title = "3. Login / API Remota",
                    isSelected = false,
                    isFuture = true,
                    onClick = onOpenFutureLogin,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Form container
            Column(
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(28.dp)
            ) {
                Text(
                    text = "Nome da Lista",
                    color = TextSecondary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(6.dp))
                TvInputField(
                    value = playlistName,
                    onValueChange = { playlistName = it },
                    placeholder = "Ex: Minha TV Por Assinatura"
                )

                Spacer(modifier = Modifier.height(18.dp))

                Text(
                    text = "URL da Playlist M3U",
                    color = TextSecondary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(6.dp))
                TvInputField(
                    value = playlistUrl,
                    onValueChange = { playlistUrl = it },
                    placeholder = "https://servidor-autorizado.com/lista.m3u"
                )

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(ErrorRed.copy(alpha = 0.15f))
                            .border(1.dp, ErrorRed, RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    ) {
                        Text(
                            text = errorMessage,
                            color = ErrorRed,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "✓ Salvar playlist para não precisar digitar novamente",
                        color = CyanNeon,
                        fontSize = 13.sp
                    )

                    if (isLoading) {
                        CircularProgressIndicator(
                            color = CyanNeon,
                            modifier = Modifier.size(36.dp)
                        )
                    } else {
                        TvButton(
                            text = "CONECTAR",
                            icon = Icons.Default.CloudDownload,
                            onClick = {
                                if (playlistUrl.isNotBlank()) {
                                    onConnect(playlistName.ifBlank { "Minha Playlist" }, playlistUrl)
                                }
                            },
                            enabled = playlistUrl.isNotBlank()
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TvInputField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String
) {
    var isFocused by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(52.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(CardDark)
            .border(2.dp, if (isFocused) CyanNeon else CardBorder, RoundedCornerShape(10.dp))
            .onFocusChanged { isFocused = it.isFocused }
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        if (value.isEmpty()) {
            Text(text = placeholder, color = TextSecondary.copy(alpha = 0.6f), fontSize = 15.sp)
        }
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            textStyle = TextStyle(color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Medium),
            cursorBrush = SolidColor(CyanNeon),
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
fun TvOptionBadge(
    title: String,
    isSelected: Boolean,
    isFuture: Boolean = false,
    onClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    var isFocused by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CyanNeon.copy(alpha = 0.15f) else CardDark)
            .border(
                1.5.dp,
                if (isFocused) CyanNeon else if (isSelected) CyanNeon else CardBorder,
                RoundedCornerShape(10.dp)
            )
            .onFocusChanged { isFocused = it.isFocused }
            .focusable()
            .padding(14.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (isFuture) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(
                text = title,
                color = if (isSelected) CyanNeon else if (isFuture) TextSecondary else Color.White,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                fontSize = 14.sp
            )
        }
    }
}
