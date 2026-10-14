import React, { useState, useEffect, useRef, useMemo } from 'react';
import Hls from 'hls.js';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight, Clock, Tv, Radio } from 'lucide-react';
import { Channel } from '../types';
import { getPlayableStreamUrl } from '../utils/m3uParser';

interface LiveTvHeroPreviewProps {
  channels: Channel[];
  selectedCategory: string;
  onPlayChannel: (channel: Channel) => void;
  selectedChannel?: Channel | null;
}

export const LiveTvHeroPreview: React.FC<LiveTvHeroPreviewProps> = ({
  channels,
  selectedCategory,
  onPlayChannel,
  selectedChannel,
}) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isMuted, setIsMuted] = useState(false); // Áudio ativo por padrão conforme solicitado
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Active catalog for preview: 100% faithful to the displayed channels
  const displayCatalog = useMemo(() => {
    return channels.length > 0 ? channels : [];
  }, [channels]);

  // If user selected a specific channel, jump to it
  useEffect(() => {
    if (selectedChannel && displayCatalog.length > 0) {
      const idx = displayCatalog.findIndex((c) => c.id === selectedChannel.id);
      if (idx !== -1) {
        setHeroIndex(idx);
        setTimeRemaining(60);
      }
    }
  }, [selectedChannel, displayCatalog]);

  // Current rotating hero channel directly from the real catalog displayed
  const heroChannel = useMemo(() => {
    if (displayCatalog.length === 0) return null;
    return displayCatalog[heroIndex % displayCatalog.length];
  }, [displayCatalog, heroIndex]);

  // Reset heroIndex and timer when category changes
  useEffect(() => {
    setHeroIndex(0);
    setTimeRemaining(60);
  }, [selectedCategory]);

  // Handle 1-minute countdown timer to switch channels within the active catalog
  useEffect(() => {
    if (displayCatalog.length <= 1) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setHeroIndex((idx) => (idx + 1) % displayCatalog.length);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [displayCatalog.length]);

  const handleNextHero = () => {
    if (displayCatalog.length <= 1) return;
    setHeroIndex((prev) => (prev + 1) % displayCatalog.length);
    setTimeRemaining(60);
  };

  const handlePrevHero = () => {
    if (displayCatalog.length <= 1) return;
    setHeroIndex((prev) => (prev - 1 + displayCatalog.length) % displayCatalog.length);
    setTimeRemaining(60);
  };

  // Direct authentic stream from origin (Fast Origin Transfer = 0 on Vercel)
  useEffect(() => {
    setVideoLoaded(false);
    const video = videoRef.current;
    if (!video || !heroChannel) return;

    let hls: Hls | null = null;
    let isCancelled = false;

    const rawUrl = heroChannel.streamUrl || '';
    if (!rawUrl) {
      setVideoLoaded(false);
      return;
    }

    const playableUrl = getPlayableStreamUrl(rawUrl);

    const playStream = (srcUrl: string) => {
      if (isCancelled || !video) return;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {}

      let targetStreamUrl = srcUrl;
      const isHls = targetStreamUrl.includes('.m3u8') || targetStreamUrl.includes('m3u8');

      const attemptPlay = () => {
        if (isCancelled || !video) return;
        video.muted = isMuted;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (!isCancelled) setVideoLoaded(true);
            })
            .catch(() => {
              if (video && !isCancelled) {
                video.muted = true;
                video
                  .play()
                  .then(() => {
                    if (!isCancelled) setVideoLoaded(true);
                  })
                  .catch(() => {
                    if (!isCancelled) setVideoLoaded(false);
                  });
              }
            });
        }
      };

      if (Hls.isSupported() && isHls) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
        });
        hlsRef.current = hls;
        hls.loadSource(targetStreamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          attemptPlay();
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls?.recoverMediaError();
                break;
              default:
                hls?.destroy();
                hlsRef.current = null;
                if (!isCancelled) setVideoLoaded(false);
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl') && isHls) {
        video.src = targetStreamUrl;
        video.addEventListener('loadedmetadata', attemptPlay, { once: true });
        video.addEventListener('error', () => {
          if (!isCancelled) setVideoLoaded(false);
        }, { once: true });
      } else {
        video.src = targetStreamUrl;
        video.load();
        video.addEventListener('loadeddata', attemptPlay, { once: true });
        video.addEventListener('canplay', attemptPlay, { once: true });
        video.addEventListener('playing', () => {
          if (!isCancelled) setVideoLoaded(true);
        }, { once: true });
        video.addEventListener('error', () => {
          if (!isCancelled) setVideoLoaded(false);
        }, { once: true });
      }
    };

    playStream(playableUrl);

    return () => {
      isCancelled = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [heroChannel?.id, heroChannel?.streamUrl, heroIndex]);

  // Sync mute state and auto-unmute on first user gesture
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }

    if (!isMuted) {
      const handleGesture = () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
        }
      };
      window.addEventListener('click', handleGesture, { once: true });
      window.addEventListener('keydown', handleGesture, { once: true });
      return () => {
        window.removeEventListener('click', handleGesture);
        window.removeEventListener('keydown', handleGesture);
      };
    }
  }, [isMuted]);

  // Compact View state: after 10 seconds of spotlight
  const isCompactView = timeRemaining <= 50;

  if (!heroChannel) return null;

  return (
    <div className="relative w-full mb-5 rounded-2xl overflow-hidden border border-neutral-800/90 shadow-2xl bg-[#0b0509]">
      <div
        className={`relative w-full transition-all duration-700 ease-in-out ${
          isCompactView ? 'h-[100px] md:h-[110px]' : 'h-[240px] md:h-[280px]'
        }`}
      >
        {/* Background Direct Video Player */}
        <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-85 scale-105' : 'opacity-0 scale-100'
            }`}
          />

          {/* Gradients to integrate with UI seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080407] via-black/40 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-700 pointer-events-none ${
              isCompactView ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Top-Right Controls: Navigation, Countdown Timer & Audio Mute Toggle */}
        <div className="absolute top-3 right-3 md:right-5 z-30 flex items-center gap-1.5 sm:gap-2">
          {/* Botão Canal Anterior */}
          <button
            onClick={handlePrevHero}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-black/60 hover:bg-black/90 active:scale-95 backdrop-blur-md border border-neutral-700/80 text-neutral-300 hover:text-white transition flex items-center justify-center cursor-pointer shadow-lg shrink-0"
            title="Canal anterior"
            aria-label="Canal anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mostrador de Tempo ao Lado do Som (sem /60s conforme solicitado) */}
          <div
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-neutral-700/80 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shrink-0 select-none"
            title={`Próximo canal em ${timeRemaining} segundos`}
          >
            <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-white font-mono tracking-wider font-extrabold">
              {timeRemaining}s
            </span>
          </div>

          {/* Botão Avançar Canal */}
          <button
            onClick={handleNextHero}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-black/60 hover:bg-black/90 active:scale-95 backdrop-blur-md border border-neutral-700/80 text-neutral-300 hover:text-white transition flex items-center justify-center cursor-pointer shadow-lg shrink-0"
            title="Próximo canal"
            aria-label="Próximo canal"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Botão de Áudio (Com Som / Sem Áudio) */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-neutral-700/80 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 shrink-0"
            title={isMuted ? 'Ativar Áudio da Prévia' : 'Mutar Prévia'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sem Áudio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Com Áudio</span>
              </>
            )}
          </button>
        </div>

        {/* Compact View: Top/Center Channel Header & Action */}
        <div
          className={`absolute inset-0 px-4 md:px-6 flex items-center justify-between z-20 transition-all duration-700 ease-in-out ${
            isCompactView
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3.5 max-w-[calc(100%-180px)]">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              {heroChannel.logoUrl ? (
                <img
                  src={heroChannel.logoUrl}
                  alt={heroChannel.name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Radio className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  AO VIVO • {heroChannel.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate drop-shadow-md">
                {heroChannel.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onPlayChannel(heroChannel)}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-xl shadow-red-600/50 flex items-center gap-2 cursor-pointer border border-red-500/50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">ASSISTIR EM TELA CHEIA</span>
            <span className="sm:hidden">ASSISTIR</span>
          </button>
        </div>

        {/* Full View: Hero Spotlight Content (Smooth fade out after 10 seconds) */}
        <div
          className={`relative z-20 h-full max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between gap-6 transition-all duration-700 ease-in-out ${
            isCompactView
              ? 'opacity-0 translate-y-4 scale-95 pointer-events-none'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="flex items-center gap-5 max-w-2xl">
            {/* Channel Logo / Initials Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#140610] border-2 border-red-600/60 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_30px_rgba(220,38,38,0.35)]">
              {heroChannel.logoUrl ? (
                <img
                  src={heroChannel.logoUrl}
                  alt={heroChannel.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Tv className="w-8 h-8 text-red-500 mb-1" />
                  <span className="text-xs font-black text-white">{heroChannel.initials || 'TV'}</span>
                </div>
              )}
            </div>

            {/* Channel Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 text-[10px] font-black uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  AO VIVO AGORA
                </span>
                <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  {heroChannel.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg line-clamp-1">
                {heroChannel.name}
              </h1>

              <p className="text-xs text-neutral-300 line-clamp-2 max-w-lg">
                Transmissão direta de alta velocidade direto do servidor de origem com zero consumo de proxy.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onPlayChannel(heroChannel)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-2xl shadow-red-600/60 flex items-center gap-2 cursor-pointer border border-red-500/50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>ASSISTIR EM TELA CHEIA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
