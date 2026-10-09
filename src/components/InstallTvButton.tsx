import React, { useState } from 'react';
import { Download, Tv, Maximize2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallTvModal } from './InstallTvModal';

interface InstallTvButtonProps {
  variant?: 'header' | 'banner' | 'card';
  className?: string;
}

export const InstallTvButton: React.FC<InstallTvButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, install, toggleTvFullscreen } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    // If browser supports native PWA prompt, trigger it
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      // Otherwise open the TV installation guide and enter fullscreen
      toggleTvFullscreen();
      setIsModalOpen(true);
    }
  };

  // If already running in standalone mode (installed as PWA), we show a Fullscreen TV toggle
  if (isInstalled) {
    if (variant === 'header') {
      return (
        <>
          <button
            onClick={() => toggleTvFullscreen()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition cursor-pointer border border-neutral-800 ${className}`}
            title="Alternar Tela Cheia na TV"
          >
            <Maximize2 className="w-3.5 h-3.5 text-red-500" />
            <span>Tela Cheia TV</span>
          </button>
          <InstallTvModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      );
    }
    return null;
  }

  if (variant === 'banner') {
    return (
      <>
        <div
          onClick={handleClick}
          className={`p-4 rounded-2xl bg-gradient-to-r from-red-650/25 via-[#180a12] to-[#12070e] border-2 border-red-600/50 hover:border-red-500 flex items-center justify-between gap-4 cursor-pointer transition shadow-[0_0_30px_rgba(220,38,38,0.2)] group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center font-black shadow-lg shadow-red-600/30 group-hover:scale-105 transition">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base">
                  INSTALAR APP NA SMART TV (1-CLIQUE)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold border border-red-500/40">
                  RECOMENDADO
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Fixe o SCARD PLAY na tela da sua Samsung/LG para não precisar digitar links nunca mais!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Instalar na TV</span>
            </button>
          </div>
        </div>

        <InstallTvModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Default header button variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600/25 via-rose-600/25 to-amber-600/20 hover:from-red-600/35 hover:via-rose-600/35 hover:to-amber-600/30 text-amber-300 hover:text-white border-2 border-red-500/60 hover:border-red-400 text-xs font-black transition cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse ${className}`}
        title="Instalar aplicativo na Smart TV"
      >
        <Download className="w-4 h-4 text-amber-400" />
        <span className="tracking-wide uppercase">Instalar App na TV</span>
      </button>

      <InstallTvModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
