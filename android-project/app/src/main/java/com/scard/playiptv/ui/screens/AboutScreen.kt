package com.scard.playiptv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.ui.components.TvButton
import com.scard.playiptv.ui.theme.*

@Composable
fun AboutScreen(
    onBack: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark)
            .padding(40.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth(0.6f)
                .clip(RoundedCornerShape(20.dp))
                .background(SurfaceDark)
                .border(1.5.dp, CardBorder, RoundedCornerShape(20.dp))
                .padding(36.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Brush.linearGradient(listOf(CyanNeon, PurpleNeon))),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "SP",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    color = DeepDark
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "SCARD PLAY IPTV",
                color = Color.White,
                fontSize = 28.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )

            Text(
                text = "Versão 1.0.0",
                color = CyanNeon,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Player IPTV para Android TV e Google TV.\nDesenvolvido com Jetpack Compose for TV e Android Media3 ExoPlayer.\nTotalmente compatível com controle remoto físico D-Pad.",
                color = TextSecondary,
                fontSize = 15.sp,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp
            )

            Spacer(modifier = Modifier.height(28.dp))

            TvButton(
                text = "VOLTAR",
                icon = Icons.Default.ArrowBack,
                onClick = onBack
            )
        }
    }
}
