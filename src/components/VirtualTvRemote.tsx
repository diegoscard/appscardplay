import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Undo2,
  Home,
  Play,
  Pause,
  Tv,
  List,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface VirtualTvRemoteProps {
  onDpadUp: () => void;
  onDpadDown: () => void;
  onDpadLeft: () => void;
  onDpadRight: () => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
  onChUp: () => void;
  onChDown: () => void;
  onPlayPause: () => void;
  onMenu: () => void;
}

export const VirtualTvRemote: React.FC<VirtualTvRemoteProps> = ({
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  onSelect,
  onBack,
  onHome,
  onChUp,
  onChDown,
  onPlayPause,
  onMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  return (
    <>
      {/* Floating launcher badge when closed */}
      {!isOpen && (
        <button
          onClick={() => {
            triggerHaptic();
            setIsOpen(true);
          }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#160810]/95 text-red-400 border border-red-500/50 shadow-2xl backdrop-blur-md hover:bg-[#200b17] hover:scale-105 active:scale-95 transition-all text-xs font-bold cursor-pointer shadow-red-600/20"
          title="Abrir Controle Remoto Virtual Android TV"
        >
          <Tv className="w-4 h-4 text-red-500 animate-pulse" />
          <span>Controle Remoto TV</span>
          <span className="bg-red-600/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-mono">D-PAD</span>
        </button>
      )}

      {/* Floating Remote Control Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-72 bg-[#0c050a]/95 border-2 border-red-600/60 rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col items-center select-none animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#DC2626]"></div>
              <span className="text-xs font-black tracking-wider text-neutral-200">CONTROLE SMART TV</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                className="text-neutral-400 hover:text-red-400 p-1 rounded-md transition"
                title="Atalhos do Teclado"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-rose-400 p-1 rounded-md transition"
                title="Recolher Controle"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint Modal/Overlay */}
          {showKeyboardHelp && (
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-[11px] text-neutral-300 mb-3 space-y-1">
              <p className="font-bold text-red-400 border-b border-neutral-800 pb-1">Atalhos de Teclado:</p>
              <div className="flex justify-between"><span>D-Pad Cima / Baixo:</span><kbd className="bg-neutral-800 px-1 rounded text-red-300">Setas ↑ / ↓</kbd></div>
              <div className="flex justify-between"><span>D-Pad Esq / Dir:</span><kbd className="bg-neutral-800 px-1 rounded text-red-300">Setas ← / →</kbd></div>
              <div className="flex justify-between"><span>Confirmar / OK:</span><kbd className="bg-neutral-800 px-1 rounded text-red-300">Enter</kbd></div>
              <div className="flex justify-between"><span>Voltar:</span><kbd className="bg-neutral-800 px-1 rounded text-red-300">Esc / Backspace</kbd></div>
              <div className="flex justify-between"><span>Troca de Canal:</span><kbd className="bg-neutral-800 px-1 rounded text-red-300">PgUp / PgDn</kbd></div>
              <div className="flex justify-between"><span>Play / Pause:</span><kbd className="bg-neutral-800 px-1 rounded text-red-300">Espaço</kbd></div>
            </div>
          )}

          {/* Top Quick Actions: Home, Menu, Back */}
          <div className="grid grid-cols-3 gap-2 w-full mb-4">
            <button
              onClick={() => { triggerHaptic(); onBack(); }}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 active:bg-red-600/20 active:border-red-500 transition text-neutral-300 hover:text-white"
              title="Voltar (Esc / Backspace)"
            >
              <Undo2 className="w-4 h-4 text-rose-400 mb-0.5" />
              <span className="text-[10px] font-semibold">VOLTAR</span>
            </button>
            <button
              onClick={() => { triggerHaptic(); onHome(); }}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 active:bg-red-600/20 active:border-red-500 transition text-neutral-300 hover:text-white"
              title="Tela Inicial"
            >
              <Home className="w-4 h-4 text-red-400 mb-0.5" />
              <span className="text-[10px] font-semibold">INÍCIO</span>
            </button>
            <button
              onClick={() => { triggerHaptic(); onMenu(); }}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 active:bg-red-600/20 active:border-red-500 transition text-neutral-300 hover:text-white"
              title="Lista de Canais (OK / Menu)"
            >
              <List className="w-4 h-4 text-amber-400 mb-0.5" />
              <span className="text-[10px] font-semibold">CANAIS</span>
            </button>
          </div>

          {/* D-PAD Circular Pad */}
          <div className="relative w-44 h-44 rounded-full bg-neutral-900 border-2 border-neutral-800 shadow-inner flex items-center justify-center my-1">
            {/* UP */}
            <button
              onClick={() => { triggerHaptic(); onDpadUp(); }}
              className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-12 flex items-center justify-center text-neutral-300 hover:text-red-400 active:scale-95 transition"
              title="D-Pad Cima"
            >
              <ChevronUp className="w-7 h-7" />
            </button>

            {/* DOWN */}
            <button
              onClick={() => { triggerHaptic(); onDpadDown(); }}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-12 flex items-center justify-center text-neutral-300 hover:text-red-400 active:scale-95 transition"
              title="D-Pad Baixo"
            >
              <ChevronDown className="w-7 h-7" />
            </button>

            {/* LEFT */}
            <button
              onClick={() => { triggerHaptic(); onDpadLeft(); }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-12 h-14 flex items-center justify-center text-neutral-300 hover:text-red-400 active:scale-95 transition"
              title="D-Pad Esquerda"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* RIGHT */}
            <button
              onClick={() => { triggerHaptic(); onDpadRight(); }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-14 flex items-center justify-center text-neutral-300 hover:text-red-400 active:scale-95 transition"
              title="D-Pad Direita"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* CENTER OK BUTTON */}
            <button
              onClick={() => { triggerHaptic(); onSelect(); }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-red-600/40 hover:brightness-110 active:scale-90 transition transform"
              title="OK / Enter"
            >
              OK
            </button>
          </div>

          {/* CH+ / CH- & Play/Pause row */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4">
            {/* CH+ */}
            <button
              onClick={() => { triggerHaptic(); onChUp(); }}
              className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 active:bg-red-600/20 active:border-red-500 transition text-neutral-200"
              title="Próximo Canal (CH+)"
            >
              <span className="text-xs font-black text-red-400">CH +</span>
              <span className="text-[9px] text-neutral-400 mt-0.5">▲ Cima</span>
            </button>

            {/* PLAY / PAUSE */}
            <button
              onClick={() => { triggerHaptic(); onPlayPause(); }}
              className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/40 active:scale-95 transition text-red-300"
              title="Play / Pause (Espaço)"
            >
              <Play className="w-4 h-4 fill-red-500 text-red-500" />
              <span className="text-[9px] font-bold text-neutral-200 mt-1">PLAY</span>
            </button>

            {/* CH- */}
            <button
              onClick={() => { triggerHaptic(); onChDown(); }}
              className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 active:bg-red-600/20 active:border-red-500 transition text-neutral-200"
              title="Canal Anterior (CH-)"
            >
              <span className="text-xs font-black text-red-400">CH -</span>
              <span className="text-[9px] text-neutral-400 mt-0.5">▼ Baixo</span>
            </button>
          </div>

          <p className="text-[10px] text-neutral-500 mt-3 text-center">
            SCARD PLAY • Otimizado para TV
          </p>
        </div>
      )}
    </>
  );
};
