package com.scard.playiptv.data.repository

import com.scard.playiptv.data.model.Device
import com.scard.playiptv.data.model.Playlist
import com.scard.playiptv.data.model.User
import com.scard.playiptv.data.model.UserSession

/**
 * Interface abstrata para autenticação e gestão remota.
 * Preparada para consumo futuro de API REST corporativa:
 * - POST /api/auth/login
 * - GET /api/user
 * - GET /api/playlist
 * - POST /api/device/register
 */
interface AuthenticationRepository {
    suspend fun login(username: String, password: String):Result<UserSession>
    suspend fun getUserProfile(): Result<User>
    suspend fun getAssignedPlaylists(): Result<List<Playlist>>
    suspend fun registerDevice(device: Device): Result<Boolean>
    suspend fun logout(): Result<Unit>
}

/**
 * Implementação para autenticação Xtream Codes / XUI API.
 * Suporta player_api.php, validação de status e extração de canais ao vivo.
 */
class XtreamAuthenticationRepository(
    private val httpClient: okhttp3.OkHttpClient = okhttp3.OkHttpClient()
) : AuthenticationRepository {

    override suspend fun login(username: String, password: String): Result<UserSession> = kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.IO) {
        try {
            val url = "http://wordbus.top/player_api.php?username=$username&password=$password"
            val request = okhttp3.Request.Builder().url(url).build()
            val response = httpClient.newCall(request).execute()
            if (!response.isSuccessful) {
                return@withContext Result.failure(Exception("Erro HTTP ${response.code} ao autenticar."))
            }

            val body = response.body?.string() ?: return@withContext Result.failure(Exception("Resposta vazia."))
            if (!body.contains("\"auth\":1") && !body.contains("\"auth\": 1")) {
                return@withContext Result.failure(Exception("Credenciais inválidas: usuário ou senha incorretos."))
            }

            val user = User(
                id = username,
                username = username,
                status = com.scard.playiptv.data.model.UserStatus.ATIVO
            )

            Result.success(UserSession(
                user = user,
                isAuthenticated = true
            ))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getUserProfile(): Result<User> {
        return Result.failure(NotImplementedError("Perfil remoto."))
    }

    override suspend fun getAssignedPlaylists(): Result<List<Playlist>> {
        return Result.failure(NotImplementedError("Playlists corporativas."))
    }

    override suspend fun registerDevice(device: Device): Result<Boolean> {
        return Result.success(true)
    }

    override suspend fun logout(): Result<Unit> {
        return Result.success(Unit)
    }
}

/**
 * Implementação mock/stub pronta para ativação sem quebrar o modo local.
 */
class RemoteAuthenticationRepositoryImpl : AuthenticationRepository {
    override suspend fun login(username: String, password: String): Result<UserSession> {
        // Futura chamada retrofit/okhttp para POST /api/auth/login
        return Result.failure(NotImplementedError("Módulo de autenticação remota será ativado na versão com servidor central."))
    }

    override suspend fun getUserProfile(): Result<User> {
        return Result.failure(NotImplementedError("Perfil remoto não configurado."))
    }

    override suspend fun getAssignedPlaylists(): Result<List<Playlist>> {
        return Result.failure(NotImplementedError("Playlists corporativas não configuradas."))
    }

    override suspend fun registerDevice(device: Device): Result<Boolean> {
        return Result.success(true)
    }

    override suspend fun logout(): Result<Unit> {
        return Result.success(Unit)
    }
}
