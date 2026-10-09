# SCARD PLAY IPTV ProGuard / R8 Rules

# Keep Media3 ExoPlayer classes
-keep class androidx.media3.** { *; }
-dontwarn androidx.media3.**

# Keep Kotlinx Coroutines & Serialization
-keepclassmembers class * {
    @kotlin.jvm.JvmField *;
}

# Keep OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**

# Keep TV Material & Compose
-keep class androidx.tv.** { *; }
-keep class androidx.compose.** { *; }

# Keep Coil
-keep class coil.** { *; }
