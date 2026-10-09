package com.scard.playiptv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scard.playiptv.data.model.UserStatus
import com.scard.playiptv.ui.components.TvButton
import com.scard.playiptv.ui.theme.*

@Composable
fun FutureLoginScreen(
    onBack: () -> Unit
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var simulatedStatus by remember { mutableStateOf<UserStatus?>(null) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepDark)
            .padding(40.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Header
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(CyanNeon),
                    contentAlignment = Alignment.Center
                ) {
                    Text("SP", fontWeight = FontWeight.Black, fontSize = 20.sp, color = DeepDark)
                }
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text("SCARD PLAY", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Black)
                    Text("PORTAL DE ACESSO REMOTO", color = CyanNeon, fontSize = 13.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Login Box
            Column(
                modifier = Modifier
                    .fillMaxWidth(0.55f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(28.dp)
            ) {
                Text(text = "Usuário", color = TextSecondary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(6.dp))
                TvInputField(
                    value = username,
                    onValueChange = { username = it },
                    placeholder = "Digite seu usuário ou código"
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(text = "Senha", color = TextSecondary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(6.dp))
                TvInputField(
                    value = password,
                    onValueChange = { password = it },
                    placeholder = "••••••••"
                )

                Spacer(modifier = Modifier.height(22.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TvButton(
                        text = "ENTRAR",
                        icon = Icons.Default.Lock,
                        onClick = {
                            simulatedStatus = UserStatus.ATIVO
                        }
                    )

                    Text(
                        text = "Não possui acesso?",
                        color = TextSecondary,
                        fontSize = 14.sp
                    )
                }

                // Status Simulation Info
                if (simulatedStatus != null) {
                    Spacer(modifier = Modifier.height(18.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(CardDark)
                            .border(1.dp, CyanNeon, RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    ) {
                        Column {
                            Text(
                                text = "Status da Sessão: ${simulatedStatus?.name}",
                                color = CyanNeon,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            Text(
                                text = "Arquitetura pronta: conecte endpoints REST (POST /api/auth/login, GET /api/user).",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            TvButton(
                text = "VOLTAR ÀS CONFIGURAÇÕES",
                icon = Icons.Default.ArrowBack,
                isPrimary = false,
                onClick = onBack
            )
        }
    }
}
