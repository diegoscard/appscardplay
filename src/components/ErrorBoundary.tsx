import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-[#080407] text-white flex flex-col items-center justify-center p-6 font-['Outfit'] text-center">
          <div className="max-w-md w-full bg-[#140c11] border-2 border-red-600/50 rounded-3xl p-8 space-y-6 shadow-[0_0_60px_rgba(220,38,38,0.3)]">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">SCARD PLAY</h1>
              <p className="text-xs text-neutral-400">
                Ocorreu uma falha ao carregar a interface. Você pode tentar reiniciar o aplicativo ou limpar o cache local.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
                <span>Recarregar Aplicativo</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Limpar Cache e Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
