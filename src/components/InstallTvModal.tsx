import React, { useState } from 'react';
import {
  Tv,
  Download,
  Sparkles,
  CheckCircle,
  X,
  Maximize2,
  Bookmark,
  Star,
  Monitor,
  Smartphone,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallTvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallTvModal: React.FC<InstallTvModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, toggleTvFullscreen, isFullscreen } = usePWAInstall();
  const [selectedBrand, setSelectedBrand] = useState<'samsung' | 'lg' | 'android' | 'pc'>('samsung');
  const [installTriggered, setInstallTriggered] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    setInstallTriggered(true);
    // Try browser PWA install
    if (isInstallable) {
      await install();
    }
    // Also enter fullscreen on TV
    await toggleTvFullscreen();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      <div className="bg-[#0c060a] border-2 border-red-600/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_0_80px_rgba(220,38,38,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-neutral-950 via-[#180a12] to-[#14060e] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1c0c15] border border-red-600/40 flex items-center justify-center p-1.5 shadow-lg shadow-red-600/30">
              <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  Instalar SCARD PLAY na Smart TV
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold border border-red-500/40">
                  Sem Pendrive
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Fixe o app na tela inicial da TV para abrir direto em 1 clique, sem digitar link!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Quick Action Button Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/15 via-[#1a0b14] to-neutral-900 border-2 border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-base">Ação Rápida de Instalação</p>
                <p className="text-xs text-neutral-300">
                  {isInstallable
                    ? 'Seu navegador suporta instalação direta em 1 clique!'
                    : 'Ative tela cheia para ocultar a barra do navegador e rodar como app nativo.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDirectInstall}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{isInstallable ? 'Instalar App Agora' : 'Ativar Modo Tela Cheia TV'}</span>
              </button>
            </div>
          </div>

          {/* TV Brand Tabs */}
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              Escolha o modelo da sua Smart TV:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedBrand('samsung')}
                className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer ${
                  selectedBrand === 'samsung'
                    ? 'bg-red-600/20 border-red-500 text-red-300 shadow-md shadow-red-600/20'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Samsung (Tizen)</span>
              </button>

              <button
                onClick={() => setSelectedBrand('lg')}
                className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer ${
                  selectedBrand === 'lg'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>LG (webOS)</span>
              </button>

              <button
                onClick={() => setSelectedBrand('android')}
                className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer ${
                  selectedBrand === 'android'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Android / Google TV</span>
              </button>

              <button
                onClick={() => setSelectedBrand('pc')}
                className={`p-3 rounded-xl border text-center transition font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer ${
                  selectedBrand === 'pc'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Celular / PC</span>
              </button>
            </div>
          </div>

          {/* Guide for Selected Brand */}
          <div className="bg-neutral-900/80 rounded-2xl p-5 border border-neutral-800 space-y-4">
            {selectedBrand === 'samsung' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <h3 className="font-bold text-white text-base">
                    Como fixar na Smart TV Samsung Crystal UHD (Tizen)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-red-400 font-black text-xs block mb-1">PASSO 1</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      No navegador da Samsung, suba o cursor até a barra superior e clique no menu de{' '}
                      <strong>Opções (ícone ≡ ou 3 pontinhos)</strong> ou no ícone de <strong>Estrela ⭐</strong>.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-red-400 font-black text-xs block mb-1">PASSO 2</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Selecione a opção{' '}
                      <span className="text-red-300 font-bold">"Adicionar à Tela Inicial"</span> ou{' '}
                      <span className="text-red-300 font-bold">"Fixar na Barra de Aplicativos"</span>.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-emerald-400 font-black text-xs block mb-1">PRONTO!</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      O ícone do <strong>SCARD PLAY</strong> aparecerá na barra inferior da TV junto com a
                      Netflix e YouTube. Nunca mais precisará digitar links!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBrand === 'lg' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <h3 className="font-bold text-white text-base">Como fixar na Smart TV LG (webOS)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-purple-400 font-black text-xs block mb-1">PASSO 1</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      No navegador da TV LG, clique no ícone de <strong>Favoritos (Estrela ⭐)</strong> no topo.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-purple-400 font-black text-xs block mb-1">PASSO 2</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Selecione <span className="text-purple-300 font-bold">"Adicionar aos Favoritos"</span> e marque{' '}
                      <span className="text-purple-300 font-bold">"Exibir na Barra Inicial"</span>.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-emerald-400 font-black text-xs block mb-1">PRONTO!</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Ao ligar a TV e abrir o menu Home, o atalho abre o player diretamente em tela cheia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBrand === 'android' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <h3 className="font-bold text-white text-base">Como instalar em Android TV / Google TV</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-emerald-400 font-black text-xs block mb-1">PASSO 1</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      No navegador (Chrome ou TV Bro), clique no botão <strong>"Instalar App"</strong> no topo da página.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-emerald-400 font-black text-xs block mb-1">PASSO 2</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      O Android exibirá a confirmação de instalação PWA. Confirme em <strong>"Instalar"</strong>.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-emerald-400 font-black text-xs block mb-1">PRONTO!</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      O aplicativo é instalado como app nativo na gaveta de aplicativos da sua Android TV.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBrand === 'pc' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <h3 className="font-bold text-white text-base">Como instalar no Celular ou Computador</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-amber-400 font-black text-xs block mb-1">NO CHROME / EDGE</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Clique no ícone de <strong>computador com setinha</strong> no canto direito da barra de endereço e clique em <strong>Instalar</strong>.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-amber-400 font-black text-xs block mb-1">NO IPHONE (SAFARI)</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Toque no botão <strong>Compartilhar</strong> (quadrado com seta para cima) e selecione <strong>Adicionar à Tela de Início</strong>.
                    </p>
                  </div>

                  <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-emerald-400 font-black text-xs block mb-1">NO ANDROID</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Nos 3 pontinhos do Chrome, selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={toggleTvFullscreen}
            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
            <span>{isFullscreen ? 'Sair do Modo Tela Cheia' : 'Alternar Modo Tela Cheia (TV 16:9)'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
