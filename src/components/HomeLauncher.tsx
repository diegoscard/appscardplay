import React from 'react';
import { User, Calendar } from 'lucide-react';
import {
  LiveTvLauncherIcon,
  MoviesLauncherIcon,
  SeriesLauncherIcon,
  SettingsLauncherIcon,
} from './LauncherIcons';

interface HomeLauncherProps {
  channelsCount: number;
  moviesCount: number;
  seriesCount: number;
  favoritesCount: number;
  accountInfo: {
    username: string;
    status: string;
    expirationDate?: string;
    maxConnections?: number;
    activeConnections?: number;
  } | null;
  focusedCardIndex: number;
  setFocusedCardIndex: (index: number) => void;
  onNavigate: (destination: 'livetv' | 'movies' | 'series' | 'settings') => void;
  onOpenSamsungModal: () => void;
  onOpenSettings: () => void;
  onSwitchPlaylist: () => void;
}

export const HomeLauncher: React.FC<HomeLauncherProps> = ({
  channelsCount,
  moviesCount,
  seriesCount,
  accountInfo,
  focusedCardIndex,
  setFocusedCardIndex,
  onNavigate,
}) => {
  // Main 4 TV Tiles (Ao Vivo, Filmes, Séries, Configurações)
  const tiles = [
    {
      id: 'livetv',
      title: 'Ao Vivo',
      subtext: `${channelsCount > 0 ? channelsCount.toLocaleString('pt-BR') : '0'} canais`,
      destination: 'livetv' as const,
      icon: (isFocused: boolean) => <LiveTvLauncherIcon isFocused={isFocused} />,
    },
    {
      id: 'movies',
      title: 'Filmes',
      subtext: `${moviesCount > 0 ? moviesCount.toLocaleString('pt-BR') : '0'} filmes VOD`,
      destination: 'movies' as const,
      icon: (isFocused: boolean) => <MoviesLauncherIcon isFocused={isFocused} />,
    },
    {
      id: 'series',
      title: 'Séries',
      subtext: `${seriesCount > 0 ? seriesCount.toLocaleString('pt-BR') : '0'} séries VOD`,
      destination: 'series' as const,
      icon: (isFocused: boolean) => <SeriesLauncherIcon isFocused={isFocused} />,
    },
    {
      id: 'settings',
      title: 'Configurações',
      subtext: 'Ajustes, Listas & Conta',
      destination: 'settings' as const,
      icon: (isFocused: boolean) => <SettingsLauncherIcon isFocused={isFocused} />,
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto bg-[#080205] text-white font-['Outfit'] select-none">
      {/* Cinematic Dark Background with Faded Vignette & Poster Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep ambient dark red glow radial gradients */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-red-700/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-600/10 rounded-full blur-[120px]" />

        {/* Faint overlay grid matching screenshot atmosphere */}
        <div
          className="absolute inset-0 opacity-[0.07] bg-repeat bg-center"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060104] via-transparent to-[#080205]/90" />
      </div>

      {/* Main Center Stage: 3D Logo & The 4 Big Action Cards */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-6 max-w-6xl mx-auto w-full">
        {/* Brand Title */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 tracking-[0.2em] uppercase filter drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]">
              SCARD PLAY
            </h1>
            <p className="text-red-400 text-xs md:text-sm font-black tracking-[0.4em] uppercase">
              SISTEMA IPTV PARA SMART TV
            </p>
          </div>
        </div>

        {/* The 4 Big Horizontal Action Cards (Live Tv, Movies, Series, Settings) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 justify-center items-center max-w-4xl mx-auto">
          {tiles.map((tile, idx) => {
            const isFocused = focusedCardIndex === idx;

            return (
              <div
                key={`tile_${tile.id}_${idx}`}
                onMouseEnter={() => setFocusedCardIndex(idx)}
                onClick={() => onNavigate(tile.destination)}
                className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isFocused ? 'scale-105 -translate-y-2' : 'hover:scale-105 hover:-translate-y-1'
                }`}
              >
                {/* Square TV Card Container */}
                <div
                  className={`relative w-full aspect-square max-w-[140px] rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    isFocused
                      ? 'bg-gradient-to-b from-[#2a0e17] via-[#1c0810] to-[#120409] border-2 border-red-500 shadow-[0_0_35px_rgba(220,38,38,0.6)]'
                      : 'bg-[#15070e]/80 hover:bg-[#200b16]/90 border-2 border-neutral-800 hover:border-red-500/50 shadow-lg'
                  }`}
                >
                  {/* Subtle top gloss highlight */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl pointer-events-none" />

                  {/* 3D Icon Glyph */}
                  <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                    {tile.icon(isFocused)}
                  </div>

                  {/* Remote selection indicator dot */}
                  {isFocused && (
                    <div className="absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#ef4444]" />
                  )}
                </div>

                {/* Label Below Card (Title Case like in the image) */}
                <div className="mt-3.5 text-center space-y-0.5">
                  <h3
                    className={`text-base md:text-xl font-black tracking-wide transition-colors ${
                      isFocused ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'text-neutral-200 group-hover:text-white'
                    }`}
                  >
                    {tile.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    {tile.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Bottom Bar with Logged In User (Left) and Expiration Date (Right) matching screenshot */}
      <footer className="relative z-20 w-full px-6 md:px-12 pb-6 md:pb-8 flex items-center justify-between text-xs pointer-events-auto">
        {/* Bottom Left: Usuário Logado */}
        <div className="flex items-center gap-3 bg-[#14060e]/85 hover:bg-[#1a0813] border border-neutral-800/80 hover:border-red-500/40 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl transition">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-600/30">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Usuário Conectado
            </span>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm tracking-wide">
                {accountInfo?.username || 'Desconectado'}
              </span>
              {accountInfo?.username && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {accountInfo.status || 'Ativo'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Right: Data de Vencimento */}
        <div className="flex items-center gap-3 bg-[#14060e]/85 hover:bg-[#1a0813] border border-neutral-800/80 hover:border-red-500/40 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl transition">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Data de Vencimento
            </span>
            <div className="flex items-center justify-end gap-1.5">
              <span className="font-black text-amber-300 text-sm tracking-wide font-mono">
                {accountInfo?.expirationDate || 'Ilimitado'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
