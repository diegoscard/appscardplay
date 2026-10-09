package com.scard.playiptv.data.model

enum class UserStatus {
    ATIVO,
    EXPIRADO,
    BLOQUEADO,
    DISPOSITIVO_NAO_AUTORIZADO
}

data class User(
    val id: String,
    val username: String,
    val status: UserStatus = UserStatus.ATIVO,
    val expirationDate: Long? = null
)

data class Subscription(
    val id: String,
    val userId: String,
    val status: UserStatus = UserStatus.ATIVO,
    val expirationDate: Long? = null,
    val maxDevices: Int = 1
)

data class Device(
    val id: String,
    val name: String,
    val lastSeen: Long = System.currentTimeMillis()
)

data class UserSession(
    val token: String? = null,
    val user: User? = null,
    val subscription: Subscription? = null,
    val currentDevice: Device? = null,
    val isAuthenticated: Boolean = false
)
