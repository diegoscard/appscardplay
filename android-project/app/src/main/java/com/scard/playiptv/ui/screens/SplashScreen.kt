package com.scard.playiptv.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.ui.theme.CyanNeon
import com.scard.playiptv.ui.theme.DeepDark
import com.scard.playiptv.ui.theme.PurpleNeon
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.96f,
        targetValue = 1.04f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    LaunchedEffect(Unit) {
        delay(2000)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // SP Badge Icon
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .scale(scale)
                    .clip(CircleShape)
                    .background(Brush.linearGradient(listOf(CyanNeon, PurpleNeon))),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "SP",
                    fontSize = 44.sp,
                    fontWeight = FontWeight.Black,
                    color = DeepDark
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "SCARD PLAY",
                fontSize = 38.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 2.sp,
                color = Color.White
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "IPTV PLAYER",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 6.sp,
                color = CyanNeon
            )
        }
    }
}
