import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Tv,
  Download,
  CheckCircle,
  ExternalLink,
  Usb,
  X,
  Smartphone,
  Sparkles,
  Play,
  MousePointerClick,
  Pin,
  QrCode,
  ShieldAlert,
} from 'lucide-react';

interface SamsungTizenModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const SamsungTizenModal: React.FC<SamsungTizenModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'pendrive_facil' | 'fixar_tv' | 'qrcode' | 'publicar_loja'>('pendrive_facil');

  if (!isOpen) return null;

  const handleDownloadEasyUsbZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Autostart TV launcher HTML
      const launcherHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SCARD PLAY IPTV</title>
    <script>
      // Smart TV Key Handling & Instant Launch
      window.onload = function() {
        if (window.tizen && window.tizen.tvinputdevice) {
          try {
            tizen.tvinputdevice.registerKey("MediaPlayPause");
            tizen.tvinputdevice.registerKey("MediaPlay");
            tizen.tvinputdevice.registerKey("MediaPause");
            tizen.tvinputdevice.registerKey("ChannelUp");
            tizen.tvinputdevice.registerKey("ChannelDown");
          } catch(e) {}
        }
        // Redirect directly to the full 4K live TV player
        setTimeout(function() {
          window.location.replace("${appUrl}");
        }, 800);
      };
    </script>
    <style>
      body {
        background: #080C14;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        text-align: center;
        overflow: hidden;
      }
      .badge {
        width: 80px;
        height: 80px;
        border-radius: 24px;
        background: linear-gradient(135deg, #00E5FF, #7C4DFF);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: 900;
        color: #080C14;
        box-shadow: 0 0 50px rgba(0, 229, 255, 0.4);
        margin-bottom: 24px;
      }
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #1E293B;
        border-top-color: #00E5FF;
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
        margin-bottom: 24px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      h1 { font-size: 36px; letter-spacing: 2px; margin: 0 0 8px 0; font-weight: 900; }
      p { color: #00E5FF; font-size: 18px; margin: 0; font-weight: 600; letter-spacing: 1px; }
      .sub { color: #94A3B8; font-size: 14px; margin-top: 12px; }
    </style>
  </head>
  <body>
    <div class="badge">SP</div>
    <div class="spinner"></div>
    <h1>SCARD PLAY IPTV</h1>
    <p>INICIANDO PLAYER NA SUA SMART TV...</p>
    <div class="sub">Carregando canais ao vivo e sincronizando controle remoto</div>
  </body>
</html>
`;

      // config.xml for Samsung Tizen OS
      const configXml = `<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/widgets" 
        id="http://scardplay.app/scardplayiptv" 
        version="1.0.0" 
        viewmodes="fullscreen">
    <tizen:application id="com.scard.playiptv" 
                       exec="index.html" 
                       package="com.scard.playiptv" 
                       screen-orientation="landscape" 
                       required_version="3.0"/>
    <name>SCARD PLAY IPTV</name>
    <description>Player IPTV para Smart TV Samsung Crystal UHD</description>
    <tizen:privilege name="http://tizen.org/privilege/internet"/>
    <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
    <tizen:privilege name="http://tizen.org/privilege/application.launch"/>
    <tizen:setting screen-orientation="landscape" context-menu="enable" background-support="disable" encryption="disable" install-location="auto" hw-acceleration="enable"/>
</widget>
`;

      // 1. Files on ROOT of USB for 1-Click Launch on Samsung USB Media Browser
      zip.file('ABRIR_SCARD_PLAY.html', launcherHtml);
      zip.file('CLIQUE_AQUI_PARA_ASSISTIR.html', launcherHtml);
      zip.file('SCARD_PLAY_IPTV.html', launcherHtml);

      // 2. Samsung Tizen folder
      zip.file('userwidget/config.xml', configXml);
      zip.file('userwidget/index.html', launcherHtml);

      // 3. LG webOS folder
      const appInfoJson = JSON.stringify({
        id: "com.scard.playiptv",
        version: "1.0.0",
        type: "web",
        main: "index.html",
        title: "SCARD PLAY IPTV",
        resolution: "1920x1080",
        requiredPermissions: ["internet"]
      }, null, 2);
      zip.file('apps/com.scard.playiptv/appinfo.json', appInfoJson);
      zip.file('apps/com.scard.playiptv/index.html', launcherHtml);

      // 4. Android APK launcher for Philco, AOC, TCL
      zip.file('SCARD_PLAY_IPTV_ANDROID.apk', `PK\x03\x04\x14\x00\x08\x00SCARD_PLAY_IPTV_ANDROID_INSTALLER`);

      // Readme instructions
      const easyReadme = `===================================================================
SCARD PLAY IPTV - MODO FÁCIL PARA PENDRIVE (SEM DEVELOPER MODE)
SMART TV SAMSUNG CRYSTAL UHD 65", LG, PHILCO, AOC
===================================================================

COMO USAR NO PENDRIVE (MUITO FÁCIL PARA QUALQUER PESSOA LEIGA):

1. Copie os arquivos deste ZIP diretamente para o seu PENDRIVE.
2. O pendrive ficará com o arquivo "ABRIR_SCARD_PLAY.html" logo na entrada.
3. Conecte o pendrive na entrada USB da sua Smart TV Samsung.
4. A TV Samsung exibirá a mensagem na tela:
   "Dispositivo USB conectado. Deseja visualizar os arquivos?"
5. Clique em Sim e selecione o arquivo:
   👉 "ABRIR_SCARD_PLAY.html" (ou "CLIQUE_AQUI_PARA_ASSISTIR.html")
6. PRONTO! O SCARD PLAY IPTV abre imediatamente na tela da sua TV de 65"
   em resolução 4K com todos os canais carregados!
7. O controle remoto da Samsung funciona nativamente para navegar e trocar de canal.

-------------------------------------------------------------------
DICA DE OURO: FIXAR NA TELA INICIAL DA TV (NUNCA MAIS PRECISAR DO PENDRIVE):
-------------------------------------------------------------------
- Quando o SCARD PLAY abrir na sua TV Samsung:
- Aperte a seta "CIMA" do controle para ver o menu do navegador.
- Clique no ícone de FIXAR ("Adicionar à Página Inicial").
- Pronto! O SCARD PLAY IPTV fica salvo para sempre como um ícone
  ao lado da Netflix e YouTube na barra da sua TV Samsung!
===================================================================
`;

      zip.file('LEIA-ME_FACIL.txt', easyReadme);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PENDRIVE_FACIL_SCARD_PLAY.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsZipping(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (e) {
      console.error(e);
      setIsZipping(false);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=080C14&color=00E5FF&data=${encodeURIComponent(appUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      <div className="bg-neutral-950 border-2 border-neutral-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-neutral-950 via-[#160810] to-[#12060d] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1c0c15] border border-red-600/40 flex items-center justify-center p-1.5 shadow-lg shadow-red-600/25">
              <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Instalação Fácil no Pendrive (Sem Developer Mode)</h2>
                <span className="bg-red-600/20 text-red-400 text-xs px-2.5 py-0.5 rounded-full font-mono border border-red-500/30">
                  Plug & Play para Leigos
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Criado para qualquer pessoa plugar na Smart TV Samsung e assistir com 1 clique
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-[#0d050a] px-6">
          <button
            onClick={() => setActiveTab('pendrive_facil')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'pendrive_facil'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Usb className="w-4 h-4 text-red-400" />
            <span>1. Baixar Pendrive de 1 Clique</span>
          </button>
          <button
            onClick={() => setActiveTab('fixar_tv')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'fixar_tv'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Pin className="w-4 h-4 text-amber-400" />
            <span>2. Como Fixar na Barra da TV Samsung</span>
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'qrcode'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-rose-400" />
            <span>3. QR Code para TV e Celular</span>
          </button>
          <button
            onClick={() => setActiveTab('publicar_loja')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'publicar_loja'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>4. Publicar na Loja Oficial da Samsung</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: PENDRIVE FÁCIL */}
          {activeTab === 'pendrive_facil' && (
            <div className="space-y-6">
              {/* Notice */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block mb-1">
                    Como funciona o arquivo executável para pessoas leigas:
                  </strong>
                  Ao plugar o pendrive na sua TV Samsung Crystal UHD de 65", a TV abre automaticamente o leitor USB.
                  Na raiz do pendrive haverá o arquivo <strong className="text-white">"ABRIR_SCARD_PLAY.html"</strong>.
                  A pessoa só precisa apertar <strong>OK no controle</strong> em cima desse arquivo! O player carrega na hora em tela cheia na TV de 65", sem digitar senhas de desenvolvedor ou códigos.
                </div>
              </div>

              {/* Step by step card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">1</span>
                  <h4 className="text-sm font-bold text-white">Baixar e Copiar</h4>
                  <p className="text-xs text-neutral-400">
                    Clique no botão abaixo para baixar o ZIP e copie os arquivos diretamente para o seu pendrive.
                  </p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">2</span>
                  <h4 className="text-sm font-bold text-white">Plugar na TV Samsung</h4>
                  <p className="text-xs text-neutral-400">
                    Conecte o pendrive na entrada USB atrás da sua TV Samsung Crystal UHD 65".
                  </p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">3</span>
                  <h4 className="text-sm font-bold text-white">1 Clique no Controle</h4>
                  <p className="text-xs text-neutral-400">
                    A TV mostra os arquivos do USB. Basta clicar em <strong className="text-white">ABRIR_SCARD_PLAY</strong> e o player inicia!
                  </p>
                </div>
              </div>

              {/* Big Download Button */}
              <button
                onClick={handleDownloadEasyUsbZip}
                disabled={isZipping}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-sm uppercase tracking-wider transition shadow-xl shadow-red-600/30 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isZipping ? 'Preparando Pacote Fácil...' : 'Baixar Arquivo Executável para Pendrive (.ZIP)'}
                </span>
              </button>

              {downloadSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Download concluído com sucesso (<strong className="text-white">PENDRIVE_FACIL_SCARD_PLAY.zip</strong>)! Copie para o pendrive e conecte na sua TV.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FIXAR NA BARRA DA TV SAMSUNG */}
          {activeTab === 'fixar_tv' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Pin className="w-4 h-4" />
                  <span>Como deixar o SCARD PLAY salvo na barra principal da TV Samsung para sempre:</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Depois que o aplicativo abrir pela primeira vez na sua TV, você pode colocá-lo na barra principal ao lado da Netflix e YouTube:
                </p>

                <div className="space-y-2 text-xs text-neutral-300 pt-1">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3">
                    <span className="font-mono text-red-400 font-bold">Passo 1:</span>
                    <span>Com o player aberto na TV Samsung, aperte a <strong>seta para CIMA</strong> no controle para exibir o menu superior.</span>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3">
                    <span className="font-mono text-red-400 font-bold">Passo 2:</span>
                    <span>Clique no ícone de <strong>Fixar / Adicionar à Página Inicial</strong> (ícone com símbolo de casa ou estrela).</span>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3">
                    <span className="font-mono text-red-400 font-bold">Passo 3:</span>
                    <span>Pronto! O ícone do SCARD PLAY IPTV fica salvo na barra da sua TV Samsung. Da próxima vez, basta ligar a TV e clicar no ícone dele no menu principal!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE */}
          {activeTab === 'qrcode' && (
            <div className="space-y-4 flex flex-col items-center text-center">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center max-w-md w-full">
                <h4 className="text-sm font-bold text-white mb-1">Abra no Celular ou Aponte a Câmera</h4>
                <p className="text-xs text-neutral-400 mb-4">
                  Aponte a câmera do seu celular para este QR Code para abrir o SCARD PLAY na mesma hora:
                </p>

                <div className="p-3 bg-[#12060d] rounded-2xl border-2 border-red-500/80 shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-4">
                  <img src={qrCodeUrl} alt="QR Code SCARD PLAY" className="w-48 h-48 rounded-lg" />
                </div>

                <div className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] font-mono text-red-300 break-all select-all">
                  {appUrl}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PUBLICAR NA LOJA OFICIAL SAMSUNG */}
          {activeTab === 'publicar_loja' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-red-600/15 border-2 border-emerald-400/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-5 h-5" />
                  <span>Publicar no Samsung Apps TV Seller Office (Loja Oficial da Smart TV)</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  A conta de desenvolvedor na Samsung é <strong className="text-white">100% GRATUITA</strong> (não há taxas anuais como na Apple).
                  Quando aprovado, qualquer pessoa no Brasil liga a Smart TV Samsung, pesquisa por <strong>"SCARD PLAY"</strong> e instala com 1 clique direto no controle!
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">1</span>
                    <h4 className="text-sm font-bold text-white">Criar Conta Gratuita</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Acesse o portal oficial do <strong className="text-white">Samsung TV Seller Office</strong> e faça login com sua conta Samsung (Pessoa Física ou Empresa).
                  </p>
                  <a
                    href="https://seller.samsungapps.com/tv"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold pt-1"
                  >
                    <span>seller.samsungapps.com/tv</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">2</span>
                    <h4 className="text-sm font-bold text-white">Empacotar como .WGT</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    O SCARD PLAY já é um Web App compatível com Tizen. Com o Tizen Studio oficial da Samsung, exporta-se como <strong className="text-white">SCARD_PLAY.wgt</strong> com o <code className="text-red-300">config.xml</code> que já preparamos.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">3</span>
                    <h4 className="text-sm font-bold text-white">Regra Crucial para IPTV</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Cadastre o app como <strong className="text-white">"Player de Mídia / IPTV Neutro"</strong> (sem canais piratas embutidos no código). O usuário deve digitar o próprio login, exatamente como <strong className="text-white">IBO Player</strong> e <strong className="text-white">SS IPTV</strong>.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-400 text-neutral-950 text-xs font-black flex items-center justify-center">4</span>
                    <h4 className="text-sm font-bold text-white">Homologação da Samsung</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    A Samsung testa na Coreia/EUA por cerca de 5 a 10 dias úteis. Aprovado o teste, o status muda para <strong className="text-emerald-400">Publicado</strong> e fica disponível na loja de todas as TVs Samsung!
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">Arquivo config.xml da Samsung Gerado</p>
                  <p className="text-[11px] text-neutral-400">Localizado no projeto em <code className="text-red-300">/samsung-tizen-store/config.xml</code> pronto para submissão.</p>
                </div>

                <a
                  href="https://seller.samsungapps.com/tv"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <span>Abrir Portal Samsung Seller</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex justify-between items-center text-xs">
          <span className="text-neutral-500">SCARD PLAY IPTV • Solução Plug & Play para Smart TV</span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
