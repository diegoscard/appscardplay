package com.scard.playiptv.player

import android.content.Context
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.datasource.DefaultHttpDataSource
import com.scard.playiptv.data.model.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

sealed class PlaybackUiState {
    object Idle : PlaybackUiState()
    data class Buffering(val channel: Channel) : PlaybackUiState()
    data class Playing(val channel: Channel) : PlaybackUiState()
    data class Paused(val channel: Channel) : PlaybackUiState()
    data class Error(val channel: Channel, val errorMessage: String) : PlaybackUiState()
}

class Media3PlayerManager(private val context: Context) {

    private var exoPlayer: ExoPlayer? = null

    private val _uiState = MutableStateFlow<PlaybackUiState>(PlaybackUiState.Idle)
    val uiState: StateFlow<PlaybackUiState> = _uiState.asStateFlow()

    private var currentChannel: Channel? = null

    fun getPlayer(): ExoPlayer {
        if (exoPlayer == null) {
            exoPlayer = ExoPlayer.Builder(context).build().apply {
                playWhenReady = true
                addListener(object : Player.Listener {
                    override fun onPlaybackStateChanged(playbackState: Int) {
                        val channel = currentChannel ?: return
                        when (playbackState) {
                            Player.STATE_BUFFERING -> {
                                _uiState.value = PlaybackUiState.Buffering(channel)
                            }
                            Player.STATE_READY -> {
                                _uiState.value = if (isPlaying) {
                                    PlaybackUiState.Playing(channel)
                                } else {
                                    PlaybackUiState.Paused(channel)
                                }
                            }
                            Player.STATE_ENDED -> {
                                _uiState.value = PlaybackUiState.Paused(channel)
                            }
                            Player.STATE_IDLE -> {
                                // Handled via error or idle
                            }
                        }
                    }

                    override fun onIsPlayingChanged(isPlaying: Boolean) {
                        val channel = currentChannel ?: return
                        if (isPlaying) {
                            _uiState.value = PlaybackUiState.Playing(channel)
                        } else if (_uiState.value !is PlaybackUiState.Buffering && _uiState.value !is PlaybackUiState.Error) {
                            _uiState.value = PlaybackUiState.Paused(channel)
                        }
                    }

                    override fun onPlayerError(error: PlaybackException) {
                        val channel = currentChannel ?: return
                        val readableMsg = when (error.errorCode) {
                            PlaybackException.ERROR_CODE_IO_NETWORK_CONNECTION_FAILED,
                            PlaybackException.ERROR_CODE_IO_NETWORK_CONNECTION_TIMEOUT ->
                                "Falha de conexão com o servidor do stream."
                            PlaybackException.ERROR_CODE_PARSING_CONTAINER_MALFORMED,
                            PlaybackException.ERROR_CODE_PARSING_MANIFEST_MALFORMED ->
                                "Formato de vídeo incompatível ou inválido."
                            else -> "Não foi possível reproduzir este canal."
                        }
                        _uiState.value = PlaybackUiState.Error(channel, readableMsg)
                    }
                })
            }
        }
        return exoPlayer!!
    }

    fun playChannel(channel: Channel) {
        currentChannel = channel
        _uiState.value = PlaybackUiState.Buffering(channel)

        val player = getPlayer()
        player.stop()
        player.clearMediaItems()

        val mediaItem = MediaItem.Builder()
            .setUri(channel.streamUrl)
            .build()

        player.setMediaItem(mediaItem)
        player.prepare()
        player.playWhenReady = true
    }

    fun togglePlayPause() {
        exoPlayer?.let { player ->
            if (player.isPlaying) {
                player.pause()
            } else {
                player.play()
            }
        }
    }

    fun retryCurrentChannel() {
        currentChannel?.let { playChannel(it) }
    }

    fun release() {
        exoPlayer?.release()
        exoPlayer = null
        currentChannel = null
        _uiState.value = PlaybackUiState.Idle
    }
}
