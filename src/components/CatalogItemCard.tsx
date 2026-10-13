import React, { useState, useRef, useEffect } from 'react';
import { Film, Play, Star, Volume2, VolumeX } from 'lucide-react';
import { VodMovie } from '../types';
import { getOrCreateTrailerMetadata, buildDirectTrailerPlaybackUrl, TrailerMetadata } from '../services/trailerRegistry';

interface CatalogItemCardProps {
  movie: VodMovie;
  index: number;
  activeTrailerId: string | null;
  setActiveTrailerId: (id: string | null) => void;
  onSelectMovie: (movie: VodMovie) => void;
  onPlayMovie: (movie: VodMovie) => void;
  allowHoverTrailer?: boolean;
}

export const CatalogItemCard: React.FC<CatalogItemCardProps> = ({
  movie,
  index,
  activeTrailerId,
  setActiveTrailerId,
  onSelectMovie,
  onPlayMovie,
  allowHoverTrailer = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isTrailerMuted, setIsTrailerMuted] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [imageError, setImageError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<any>(null);
  const trailerTimerRef = useRef<any>(null);
  const metadataRef = useRef<TrailerMetadata | null>(null);

  const isActive = activeTrailerId === movie.id;

  // Carrega metadados do trecho cadastrado uma única vez para este filme
  if (!metadataRef.current && movie.streamUrl) {
    metadataRef.current = getOrCreateTrailerMetadata(
      movie.id,
      movie.name,
      movie.streamUrl,
      'movie'
    );
  }

  // Desativa este trailer se outro card se tornou ativo
  useEffect(() => {
    if (!isActive && isPlayingTrailer) {
      stopAndCleanupTrailer();
    }
  }, [isActive]);

  const stopAndCleanupTrailer = () => {
    if (trailerTimerRef.current) {
      clearInterval(trailerTimerRef.current);
      trailerTimerRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
        // Limpeza rigorosa: remove o src e chama load() para cancelar requisições de rede
        video.removeAttribute('src');
        video.load();
      } catch {}
    }
    setIsPlayingTrailer(false);
    setTimeRemaining(60);
  };

  // Tratamento de hover com debounce de 400ms para evitar requisições de rede acidentais
  const handleMouseEnter = () => {
    setIsHovered(true);

    if (!allowHoverTrailer || !movie.streamUrl) return;

    // Verificar se o usuário desabilitou trailers nas configurações
    const isPreviewEnabled =
      typeof window !== 'undefined' ? window.localStorage.getItem('scardplay_preview_video') !== 'false' : true;
    if (!isPreviewEnabled) return;

    hoverTimeoutRef.current = setTimeout(() => {
      startTrailer();
    }, 450); // 450ms de espera intencional
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (isActive) {
      setActiveTrailerId(null);
    }
    stopAndCleanupTrailer();
  };

  const startTrailer = () => {
    if (!metadataRef.current) return;
    setActiveTrailerId(movie.id);

    const video = videoRef.current;
    if (!video) return;

    const playbackUrl = buildDirectTrailerPlaybackUrl(metadataRef.current);
    if (!playbackUrl) return;

    video.src = playbackUrl;
    video.muted = isTrailerMuted;
    video.currentTime = metadataRef.current.startSec;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingTrailer(true);
          setTimeRemaining(60);

          // Contagem regressiva rigorosa de 60 segundos
          let secondsLeft = 60;
          if (trailerTimerRef.current) clearInterval(trailerTimerRef.current);

          trailerTimerRef.current = setInterval(() => {
            secondsLeft -= 1;
            setTimeRemaining(secondsLeft);

            // Ao atingir 60 segundos de trailer, interrompe e volta para a capa
            if (secondsLeft <= 0) {
              stopAndCleanupTrailer();
              if (isActive) setActiveTrailerId(null);
            }
          }, 1000);
        })
        .catch(() => {
          // Autoplay bloqueado ou erro de reprodução: permanece na capa estática
          stopAndCleanupTrailer();
        });
    }
  };

  // Limpeza completa quando o card sai de cena / desmonta
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      stopAndCleanupTrailer();
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectMovie(movie)}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#140c11] border border-neutral-800/80 hover:border-red-500 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] cursor-pointer flex flex-col justify-end p-3.5 select-none"
    >
      {/* Poster Image (Zero tráfego Vercel - Servido pelo CDN de origem com Lazy Loading) */}
      {movie.posterUrl && !imageError ? (
        <img
          src={movie.posterUrl}
          alt={movie.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isPlayingTrailer ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br from-red-950/60 to-neutral-950 flex flex-col items-center justify-center p-3 text-center ${
          isPlayingTrailer ? 'opacity-0' : 'opacity-100'
        }`}>
          <Film className="w-8 h-8 text-red-500 mb-2 opacity-60" />
          <span className="text-[11px] font-bold text-neutral-300 line-clamp-3">
            {movie.name}
          </span>
        </div>
      )}

      {/* Video Element: PRELOAD="NONE", 60s max, ZERO BYTES Vercel */}
      <video
        ref={videoRef}
        playsInline
        muted={isTrailerMuted}
        preload="none"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10 ${
          isPlayingTrailer ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Indicador do Trailer de 60s em reprodução */}
      {isPlayingTrailer && (
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-red-500/40 text-[10px] font-mono text-red-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>TRAILER {timeRemaining}s</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextMute = !isTrailerMuted;
              setIsTrailerMuted(nextMute);
              if (videoRef.current) videoRef.current.muted = nextMute;
            }}
            className="ml-1 text-white hover:text-amber-300"
          >
            {isTrailerMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Dark overlay scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity z-10 pointer-events-none" />

      {/* Top Badge: Rating / Year */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
        {movie.rating ? (
          <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-amber-400 font-black text-[10px] flex items-center gap-0.5 border border-amber-400/30">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {movie.rating}
          </span>
        ) : null}
      </div>

      {/* Bottom Content */}
      <div className="relative z-20 space-y-1">
        <h3 className="text-xs font-black text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
          {movie.name}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
          <span>{movie.year || movie.category}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayMovie(movie);
            }}
            className="p-1 rounded-full bg-red-600 text-white hover:scale-110 active:scale-95 transition shadow-md shadow-red-600/40 cursor-pointer"
            title="Assistir Filme Completo"
          >
            <Play className="w-3 h-3 fill-white" />
          </button>
        </div>
      </div>

      {/* Barra de progresso do trailer de 60 segundos */}
      {isPlayingTrailer && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900 z-30">
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
