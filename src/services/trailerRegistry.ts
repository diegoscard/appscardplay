/**
 * SCARD PLAY IPTV - Trailer & Teaser Metadata Registry
 * 
 * Regra: ZERO CONSUMO VERCEL.
 * Armazena exclusivamente METADADOS dos trailers de 60 segundos.
 * Nenhum arquivo de vídeo é salvo no banco nem na infraestrutura da Vercel.
 * Os vídeos são requisitados e reproduzidos diretamente do servidor/CDN externo.
 */

export interface TrailerMetadata {
  contentId: string;
  contentType: 'movie' | 'series';
  title: string;
  trailerUrl: string;
  durationSec: number; // Máximo 60 segundos
  startSec: number;
  endSec: number;
  format: 'mp4' | 'm3u8' | 'webm';
  resolution: string;
  source: 'external_cdn' | 'stream_server' | 'cloudflare_r2' | 'custom_proxy';
  updatedAt: string;
  status: 'ready' | 'unavailable' | 'pending';
  assetId?: string;
  notes?: string;
}

const STORAGE_KEY = 'scardplay_trailer_metadata_v1';

// Cache em memória para acesso síncrono e ultra rápido
const memoryCache: Map<string, TrailerMetadata> = new Map();

/**
 * Calcula um ponto de início determinístico para um filme/série com base no ID.
 * Garante que aquele título sempre exiba exatamente a mesma cena de 60s em todas as exibições!
 */
export function calculateDeterministicStartSec(id: string, name: string): number {
  let hash = 0;
  const str = `${id}_${name}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  // Offset fixo entre 1m30s (90s) e 4m30s (270s) para evitar logotipos iniciais de estúdio
  return 90 + (Math.abs(hash) % 180);
}

/**
 * Inicializa e carrega metadados salvos
 */
function initMetadataStore(): void {
  if (memoryCache.size > 0 || typeof window === 'undefined') return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const list: TrailerMetadata[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((item) => {
          if (item && item.contentId) {
            memoryCache.set(item.contentId, item);
          }
        });
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar trailer metadata:', err);
  }
}

/**
 * Salva metadados no localStorage
 */
function persistMetadataStore(): void {
  if (typeof window === 'undefined') return;
  try {
    const array = Array.from(memoryCache.values());
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
  } catch (err) {
    console.warn('Erro ao persistir trailer metadata:', err);
  }
}

/**
 * Obtém ou registra os metadados do trailer de 60 segundos para um filme ou série.
 * Trecho cadastrado uma única vez e reutilizado em todas as exibições do título.
 */
export function getOrCreateTrailerMetadata(
  contentId: string,
  title: string,
  rawMediaUrl: string,
  contentType: 'movie' | 'series' = 'movie',
  customTrailerUrl?: string
): TrailerMetadata {
  initMetadataStore();

  const existing = memoryCache.get(contentId);
  if (existing) {
    return existing;
  }

  // Se não existir, registra uma única vez com trecho determinístico de 60 segundos
  const startSec = calculateDeterministicStartSec(contentId, title);
  const endSec = startSec + 60;
  const isHls = rawMediaUrl.includes('.m3u8') || (customTrailerUrl && customTrailerUrl.includes('.m3u8'));
  const effectiveUrl = customTrailerUrl || rawMediaUrl;

  const metadata: TrailerMetadata = {
    contentId,
    contentType,
    title,
    trailerUrl: effectiveUrl,
    durationSec: 60,
    startSec,
    endSec,
    format: isHls ? 'm3u8' : 'mp4',
    resolution: '720p',
    source: customTrailerUrl ? 'external_cdn' : 'stream_server',
    updatedAt: new Date().toISOString(),
    status: effectiveUrl ? 'ready' : 'unavailable',
    assetId: `trailer_${contentId}`,
  };

  memoryCache.set(contentId, metadata);
  persistMetadataStore();

  return metadata;
}

/**
 * Constrói a URL externa direta para reprodução do trecho de 60 segundos no player,
 * respeitando a regra de ZERO BYTES na Vercel e aplicando Media Fragment (#t=start,end) para MP4.
 */
export function buildDirectTrailerPlaybackUrl(metadata: TrailerMetadata): string {
  if (!metadata || !metadata.trailerUrl) return '';

  let customProxy = '';
  let streamMode = 'direct';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      streamMode = window.localStorage.getItem('scardplay_stream_mode') || 'direct';
      customProxy = window.localStorage.getItem('scardplay_custom_proxy') || '';
    }
  } catch {}

  let url = metadata.trailerUrl;

  // Se o usuário configurou um proxy externo gratuito (ex: Cloudflare Worker ou VPS):
  if (streamMode === 'custom' && customProxy.trim()) {
    const trimmed = customProxy.trim();
    url = trimmed.includes('?')
      ? `${trimmed}&url=${encodeURIComponent(url)}`
      : `${trimmed}?url=${encodeURIComponent(url)}`;
  }

  // Para MP4: Media Fragments RFC 7233 (#t=start,end) indica ao navegador para solicitar
  // apenas a faixa de bytes (Range HTTP) correspondente aos 60 segundos selecionados!
  if (metadata.format === 'mp4' && !url.includes('#t=')) {
    url = `${url}#t=${metadata.startSec},${metadata.endSec}`;
  }

  return url;
}

/**
 * Atualiza manualmente ou registra trailer externo específico para um título
 */
export function registerCustomTrailer(
  contentId: string,
  title: string,
  externalTrailerUrl: string,
  contentType: 'movie' | 'series' = 'movie',
  startSec = 0,
  durationSec = 60
): TrailerMetadata {
  initMetadataStore();

  const metadata: TrailerMetadata = {
    contentId,
    contentType,
    title,
    trailerUrl: externalTrailerUrl,
    durationSec: Math.min(60, durationSec),
    startSec,
    endSec: startSec + Math.min(60, durationSec),
    format: externalTrailerUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
    resolution: '1080p',
    source: 'external_cdn',
    updatedAt: new Date().toISOString(),
    status: 'ready',
    assetId: `custom_${contentId}`,
  };

  memoryCache.set(contentId, metadata);
  persistMetadataStore();

  return metadata;
}

/**
 * Retorna todos os metadados registrados para exportação ou auditoria
 */
export function getAllTrailerMetadata(): TrailerMetadata[] {
  initMetadataStore();
  return Array.from(memoryCache.values());
}
