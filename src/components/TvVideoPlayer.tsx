import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import mpegts from 'mpegts.js';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Star,
  List,
  AlertTriangle,
  RotateCw,
  RotateCcw,
  ArrowLeft,
  Volume2,
  VolumeX,
  Radio,
  Tv,
  Film,
  Maximize2,
} from 'lucide-react';
import { Channel, EPGProgram } from '../types';
import { SAMPLE_EPG_MAP } from '../utils/sampleData';
import { getPlayableStreamUrl } from '../utils/m3uParser';

interface TvVideoPlayerProps {
  channel: Channel;
  channels: Channel[];
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  onSelectChannel: (channel: Channel) => void;
  onBack: () => void;
}

export const TvVideoPlayer: React.FC<TvVideoPlayerProps> = ({
  channel,
  channels,
  isFavorite,
  onToggleFavorite,
  onNextChannel,
  onPrevChannel,
  onSelectChannel,
  onBack,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const mpegtsRef = useRef<mpegts.Player | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOsd, setShowOsd] = useState<boolean>(true);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [selectedDrawerIndex, setSelectedDrawerIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const osdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isVodMedia =
    channel.category === 'FILMES' ||
    channel.category === 'SÉRIES' ||
    channel.category.toLowerCase().includes('filme') ||
    channel.category.toLowerCase().includes('série') ||
    channel.category.toLowerCase().includes('lançamentos') ||
    channel.id.startsWith('vod_') ||
    channel.id.startsWith('series_') ||
    channel.id.startsWith('ep_') ||
    channel.streamUrl.includes('/movie/') ||
    channel.streamUrl.includes('/series/');

  const handleSeek = (newTime: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
      triggerOsd();
    }
  };

  const handleSeekRelative = (delta: number) => {
    const video = videoRef.current;
    if (video) {
      const target = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta));
      video.currentTime = target;
      setCurrentTime(target);
      triggerOsd();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const triggerOsd = () => {
    setShowOsd(true);
    if (osdTimeoutRef.current) clearTimeout(osdTimeoutRef.current);
    osdTimeoutRef.current = setTimeout(() => {
      setShowOsd(false);
    }, 4500);
  };

  const cleanupPlayers = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (mpegtsRef.current) {
      try {
        mpegtsRef.current.pause();
        mpegtsRef.current.unload();
        mpegtsRef.current.detachMediaElement();
        mpegtsRef.current.destroy();
      } catch (e) {
        console.error(e);
      }
      mpegtsRef.current = null;
    }
  };

  // Setup Stream Playback (HLS, MPEG-TS or Direct Video MP4)
  const loadStream = () => {
    setErrorMessage(null);
    setIsBuffering(true);
    setCurrentTime(0);
    setDuration(0);
    triggerOsd();

    const video = videoRef.current;
    if (!video) return;

    cleanupPlayers();

    const rawUrl = channel.streamUrl;
    if (!rawUrl) {
      setErrorMessage('Endereço do stream não disponível.');
      setIsBuffering(false);
      return;
    }

    // Check if URL is Xtream Codes Live TS pattern (http://host/user/pass/id)
    let hlsCandidateUrl = rawUrl;
    const xtreamMatch = rawUrl.match(/^(https?:\/\/[^/]+)\/([^/]+)\/([^/]+)\/(\d+)$/i);
    if (xtreamMatch) {
      const [, host, user, pass, streamId] = xtreamMatch;
      hlsCandidateUrl = `${host}/live/${user}/${pass}/${streamId}.m3u8`;
    } else if (rawUrl.endsWith('.ts')) {
      hlsCandidateUrl = rawUrl.replace(/\.ts$/, '.m3u8');
    }

    const isExplicitHls =
      rawUrl.toLowerCase().includes('.m3u8') ||
      hlsCandidateUrl.toLowerCase().includes('.m3u8');

    const isDirectVideo =
      !isExplicitHls &&
      (rawUrl.includes('/movie/') ||
        rawUrl.includes('/series/') ||
        rawUrl.toLowerCase().endsWith('.mp4') ||
        rawUrl.toLowerCase().endsWith('.mkv') ||
        rawUrl.toLowerCase().endsWith('.webm') ||
        rawUrl.includes('.mp4?') ||
        rawUrl.includes('.mkv?'));

    // Playback starting helper with autoplay handling
    const attemptPlay = () => {
      setIsBuffering(false);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay restrictions may require muting first
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          });
      }
    };

    // 1. Direct Video playback (MP4 / VOD)
    if (isDirectVideo) {
      // Normalize MKV to MP4 for browser compatibility
      let targetDirectUrl = rawUrl;
      if (targetDirectUrl.toLowerCase().endsWith('.mkv')) {
        targetDirectUrl = targetDirectUrl.replace(/\.mkv$/i, '.mp4');
      } else if (targetDirectUrl.includes('.mkv?')) {
        targetDirectUrl = targetDirectUrl.replace(/\.mkv\?/i, '.mp4?');
      }

      const proxiedUrl = getPlayableStreamUrl(targetDirectUrl);
      video.src = proxiedUrl;
      video.load();

      let directFallbackAttempted = false;

      video.onloadeddata = attemptPlay;
      video.oncanplay = attemptPlay;
      video.onplaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };

      video.onerror = () => {
        // Ignore aborted requests during seeking/unloading
        if (video.error && video.error.code === 1) {
          return;
        }

        if (!directFallbackAttempted) {
          directFallbackAttempted = true;
          // If on HTTP or direct URL is HTTPS, direct fallback can be attempted safely
          const canTryDirectUrl =
            typeof window !== 'undefined' &&
            (window.location.protocol === 'http:' || targetDirectUrl.startsWith('https:'));

          if (canTryDirectUrl && video.src !== targetDirectUrl) {
            video.src = targetDirectUrl;
            video.load();
            video.onloadeddata = attemptPlay;
            video.oncanplay = attemptPlay;
            return;
          }

          // Also try HLS variant for Xtream movie/series if direct fails
          if (Hls.isSupported() && (targetDirectUrl.includes('/movie/') || targetDirectUrl.includes('/series/'))) {
            const m3u8Url = targetDirectUrl.replace(/\.(mp4|mkv)(\?.*)?$/i, '.m3u8$2');
            const proxiedM3u8 = getPlayableStreamUrl(m3u8Url);
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: false,
              backBufferLength: 90,
              maxBufferLength: 60,
            });
            hlsRef.current = hls;
            hls.loadSource(proxiedM3u8);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, attemptPlay);
            hls.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                setErrorMessage('Não foi possível reproduzir este vídeo. Verifique sua conexão.');
                setIsBuffering(false);
              }
            });
            return;
          }
        }
        setErrorMessage('Não foi possível reproduzir este vídeo. Verifique sua conexão.');
        setIsBuffering(false);
      };
      return;
    }

    // 2. HLS playback (Live TV or HLS VOD)
    const proxiedHlsUrl = getPlayableStreamUrl(hlsCandidateUrl);
    let attemptedDirectHls = false;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: !isVodMedia,
        backBufferLength: isVodMedia ? 90 : 30,
        maxBufferLength: isVodMedia ? 60 : 30,
      });
      hlsRef.current = hls;

      hls.loadSource(proxiedHlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, attemptPlay);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (!attemptedDirectHls && hlsCandidateUrl !== proxiedHlsUrl) {
                attemptedDirectHls = true;
                hls.loadSource(hlsCandidateUrl);
              } else {
                hls.destroy();
                hlsRef.current = null;
                tryMpegTsFallback(video, getPlayableStreamUrl(rawUrl));
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              hlsRef.current = null;
              tryMpegTsFallback(video, getPlayableStreamUrl(rawUrl));
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple Safari HLS
      video.src = proxiedHlsUrl;
      video.addEventListener('loadedmetadata', attemptPlay, { once: true });
      video.addEventListener(
        'error',
        () => {
          tryMpegTsFallback(video, getPlayableStreamUrl(rawUrl));
        },
        { once: true }
      );
    } else {
      tryMpegTsFallback(video, getPlayableStreamUrl(rawUrl));
    }
  };

  const tryMpegTsFallback = (video: HTMLVideoElement, streamUrl: string) => {
    if (mpegts.isSupported()) {
      try {
        const player = mpegts.createPlayer({
          type: 'mse',
          isLive: !isVodMedia,
          url: streamUrl,
        });
        mpegtsRef.current = player;
        player.attachMediaElement(video);
        player.load();
        const p = player.play() as Promise<void> | void;
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }

        player.on(mpegts.Events.LOADING_COMPLETE, () => {
          setIsBuffering(false);
        });
        player.on(mpegts.Events.ERROR, () => {
          setErrorMessage(
            isVodMedia
              ? 'Não foi possível reproduzir este vídeo.'
              : 'Não foi possível reproduzir este canal.'
          );
          setIsBuffering(false);
        });
        return;
      } catch (e) {
        console.error('MPEG-TS failed:', e);
      }
    }
    // Direct HTML5 video tag fallback as last resort
    video.src = streamUrl;
    video.load();
    video
      .play()
      .then(() => {
        setIsBuffering(false);
        setIsPlaying(true);
      })
      .catch(() => {
        setErrorMessage(
          isVodMedia
            ? 'Não foi possível reproduzir este vídeo.'
            : 'Não foi possível reproduzir este canal.'
        );
        setIsBuffering(false);
      });
  };

  useEffect(() => {
    loadStream();
    return () => {
      cleanupPlayers();
      if (osdTimeoutRef.current) clearTimeout(osdTimeoutRef.current);
    };
  }, [channel.id, channel.streamUrl]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
    triggerOsd();
  };

  const epgInfo = channel.tvgId ? SAMPLE_EPG_MAP[channel.tvgId] : undefined;

  // Sync selected index in drawer with current channel
  useEffect(() => {
    const idx = channels.findIndex((c) => c.id === channel.id);
    if (idx !== -1) setSelectedDrawerIndex(idx);
  }, [channel.id, channels]);

  return (
    <div
      className="relative w-screen h-screen bg-black overflow-hidden select-none cursor-default"
      onMouseMove={triggerOsd}
      onClick={() => {
        if (!isSideDrawerOpen) triggerOsd();
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        muted={isMuted}
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && !errorMessage && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none animate-in fade-in duration-200">
          <div className="bg-[#12070e]/95 border border-red-500/40 px-8 py-6 rounded-2xl flex flex-col items-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_#EF4444]"></div>
            <span className="text-white font-black text-lg tracking-widest">CARREGANDO...</span>
            <span className="text-red-400 text-xs mt-1 font-medium">{channel.name}</span>
          </div>
        </div>
      )}

      {/* Error Fallback Overlay */}
      {errorMessage && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md px-6">
          <div className="max-w-md w-full bg-[#12070e] border-2 border-red-600/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_40px_rgba(220,38,38,0.3)] animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isVodMedia ? 'Não foi possível reproduzir este vídeo.' : 'Não foi possível reproduzir este canal.'}
            </h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              {errorMessage} Verifique se o servidor do stream está ativo ou tente novamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={loadStream}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>TENTAR NOVAMENTE</span>
              </button>
              {!isVodMedia && (
                <button
                  onClick={onNextChannel}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm border border-neutral-700 active:scale-95 transition cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>PRÓXIMO CANAL</span>
                </button>
              )}
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-sm border border-neutral-700 active:scale-95 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>VOLTAR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top OSD Banner (Channel info & Category) */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 transition-all duration-500 ease-out pointer-events-auto bg-gradient-to-b from-black/95 via-black/70 to-transparent p-6 md:p-8 ${
          showOsd && !errorMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white hover:text-red-400 active:scale-95 transition"
              title="Voltar para a grade de canais"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Logo / Initials */}
            <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {channel.logoUrl ? (
                <img
                  src={channel.logoUrl}
                  alt={channel.name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    // Fallback to initials
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xl font-black text-red-500">{channel.initials}</span>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-400 bg-neutral-800/80 px-2.5 py-0.5 rounded">
                  {isVodMedia ? 'VOD HD' : `CH ${channel.orderIndex + 1}`}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">{channel.name}</h1>
                {isFavorite && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-red-400 tracking-wider uppercase">
                  {channel.category}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-neutral-300 flex items-center gap-1 font-mono">
                  {isVodMedia ? (
                    <>
                      <Film className="w-3.5 h-3.5 text-amber-400" /> VOD CINEMA STREAM
                    </>
                  ) : (
                    <>
                      <Radio className="w-3 h-3 text-red-500 animate-pulse" /> LIVE STREAM HLS
                    </>
                  )}
                </span>
              </div>
              {/* EPG Preview */}
              {epgInfo && !isVodMedia && (
                <p className="text-xs text-neutral-300 mt-1 max-w-xl truncate">
                  <span className="text-amber-300 font-semibold">AGORA:</span> {epgInfo.title}
                </p>
              )}
            </div>
          </div>

          {/* Remote D-Pad Navigation Hint Badges */}
          <div className="hidden lg:flex items-center gap-3">
            {!isVodMedia ? (
              <>
                <div className="flex items-center gap-2 bg-black/60 border border-neutral-700/80 px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-red-400 font-bold">▲ / ▼</span>
                  <span className="text-neutral-400">Trocar Canal</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 border border-neutral-700/80 px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-red-400 font-bold">OK</span>
                  <span className="text-neutral-400">Grade Lateral</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-black/60 border border-neutral-700/80 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-amber-400 font-bold">◄ / ►</span>
                <span className="text-neutral-400">Avançar 10s</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-black/60 border border-neutral-700/80 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-red-400 font-bold">VOLTAR</span>
              <span className="text-neutral-400">Sair</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls OSD Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-500 ease-out pointer-events-auto bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 md:p-8 ${
          showOsd && !errorMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {/* VOD Timeline scrubber */}
          {isVodMedia && duration > 0 && (
            <div className="flex items-center gap-3 bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
              <span className="font-mono text-xs text-neutral-300 min-w-[50px] text-right font-bold">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={Math.floor(duration)}
                step={1}
                value={Math.floor(currentTime)}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="flex-1 h-2 bg-neutral-700 accent-red-500 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs text-neutral-400 min-w-[50px] font-bold">
                {formatTime(duration)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isVodMedia ? (
                <>
                  {/* Rewind -10s */}
                  <button
                    onClick={() => handleSeekRelative(-10)}
                    className="w-12 h-12 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition"
                    title="Voltar 10s"
                  >
                    <RotateCcw className="w-5 h-5 text-neutral-300" />
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={togglePlayPause}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-center hover:brightness-110 active:scale-90 transition shadow-lg shadow-red-600/40"
                    title="Play / Pause"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>

                  {/* Forward +10s */}
                  <button
                    onClick={() => handleSeekRelative(10)}
                    className="w-12 h-12 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition"
                    title="Avançar 10s"
                  >
                    <RotateCw className="w-5 h-5 text-neutral-300" />
                  </button>
                </>
              ) : (
                <>
                  {/* Prev Channel */}
                  <button
                    onClick={() => {
                      onPrevChannel();
                      triggerOsd();
                    }}
                    className="w-12 h-12 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition"
                    title="Canal Anterior (D-Pad Cima)"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={togglePlayPause}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-center hover:brightness-110 active:scale-90 transition shadow-lg shadow-red-600/40"
                    title="Play / Pause (Espaço)"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>

                  {/* Next Channel */}
                  <button
                    onClick={() => {
                      onNextChannel();
                      triggerOsd();
                    }}
                    className="w-12 h-12 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition"
                    title="Próximo Canal (D-Pad Baixo)"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Toggle Favorite */}
              <button
                onClick={() => {
                  onToggleFavorite(channel.id);
                  triggerOsd();
                }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition active:scale-95 ${
                  isFavorite
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                    : 'bg-neutral-900/90 border-neutral-700 text-neutral-400 hover:text-white'
                }`}
                title="Favoritar"
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              {/* Side Drawer Toggle (only for Live TV) */}
              {!isVodMedia && (
                <button
                  onClick={() => {
                    setIsSideDrawerOpen(!isSideDrawerOpen);
                  }}
                  className={`flex items-center gap-2 px-5 h-12 rounded-xl border text-sm font-bold transition active:scale-95 ${
                    isSideDrawerOpen
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                      : 'bg-neutral-900/90 text-white border-neutral-700 hover:bg-neutral-800'
                  }`}
                  title="Abrir lista de canais (OK / Enter)"
                >
                  <List className="w-5 h-5" />
                  <span>Lista de Canais (OK)</span>
                </button>
              )}

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center transition"
                title="Mudo"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-red-400" />}
              </button>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="w-12 h-12 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center transition"
                title="Tela Cheia"
              >
                <Maximize2 className="w-5 h-5 text-neutral-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Channel Drawer (TV AO VIVO) */}
      {isSideDrawerOpen && (
        <div className="absolute top-0 left-0 bottom-0 w-80 md:w-96 bg-[#0c050a]/95 border-r border-neutral-800 z-40 backdrop-blur-xl flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
              <h2 className="text-lg font-black tracking-wider text-white">TV AO VIVO</h2>
            </div>
            <span className="text-xs font-bold text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
              {channels.length} canais
            </span>
          </div>

          {/* List of Channels */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 focus:outline-none">
            {channels.map((ch, idx) => {
              const isCurrent = ch.id === channel.id;
              return (
                <button
                  key={`${ch.id}_${idx}`}
                  onClick={() => {
                    onSelectChannel(ch);
                    setIsSideDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left cursor-pointer border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-red-600/30 to-rose-600/30 border-red-500 text-white shadow-md'
                      : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-transparent text-neutral-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-xs font-bold text-neutral-400 w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {isCurrent && (
                      <span className="text-red-500 text-xs shrink-0 font-bold animate-pulse">🔴</span>
                    )}
                    <span className="text-sm font-semibold truncate">{ch.name}</span>
                  </div>
                  {ch.isFavorite && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-between items-center text-xs text-neutral-400">
            <span>D-Pad Cima/Baixo para navegar</span>
            <button
              onClick={() => setIsSideDrawerOpen(false)}
              className="text-red-400 hover:underline font-semibold"
            >
              Fechar (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
