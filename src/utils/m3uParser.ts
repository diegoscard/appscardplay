import { Channel } from '../types';

export interface ParsedM3uResult {
  channels: Channel[];
  categories: string[];
}

export function generateInitials(name: string): string {
  const clean = name.trim().replace(/[[\](){}]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'SP';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Zero-Vercel Direct Playback (Fast Origin Transfer = 0):
 * Returns direct media stream URLs so video playback (previews, movies, series, live channels)
 * streams directly from the origin CDN / IPTV server to the client player,
 * completely bypassing Vercel and eliminating all Fast Origin Transfer consumption.
 */
export function getPlayableStreamUrl(originalUrl: string): string {
  if (!originalUrl) return '';

  // Local blobs or base64 data
  if (originalUrl.startsWith('blob:') || originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // Strip any legacy /api/proxy/stream?url= wrappers from cached data
  if (originalUrl.includes('/api/proxy/stream?url=')) {
    try {
      const match = originalUrl.match(/url=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    } catch {
      // ignore decode error
    }
  }

  return originalUrl;
}

export function ensureUniqueChannelIds(channels: Channel[]): Channel[] {
  const seen = new Set<string>();
  return channels.map((ch, idx) => {
    let id = ch.id;
    if (!id || seen.has(id)) {
      id = `${id || 'ch'}_${idx}`;
    }
    while (seen.has(id)) {
      id = `${id}_${Math.random().toString(36).substring(2, 6)}`;
    }
    seen.add(id);

    // Clean legacy proxy URLs from cached channels
    let streamUrl = ch.streamUrl;
    if (streamUrl && streamUrl.includes('/api/proxy/stream?url=')) {
      try {
        const match = streamUrl.match(/url=([^&]+)/);
        if (match && match[1]) streamUrl = decodeURIComponent(match[1]);
      } catch {}
    }

    return { ...ch, id, streamUrl };
  });
}

const VERIFIED_VOD_FALLBACKS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
  'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
  'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8',
];

export function ensureUniqueVodIds<T extends { id: string; streamUrl?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.map((item, idx) => {
    let id = item.id;
    if (!id || seen.has(id)) {
      id = `${id || 'vod'}_${idx}`;
    }
    while (seen.has(id)) {
      id = `${id}_${Math.random().toString(36).substring(2, 6)}`;
    }
    seen.add(id);

    let streamUrl = item.streamUrl;
    // Clean legacy proxy URLs from cached items
    if (streamUrl && streamUrl.includes('/api/proxy/stream?url=')) {
      try {
        const match = streamUrl.match(/url=([^&]+)/);
        if (match && match[1]) streamUrl = decodeURIComponent(match[1]);
      } catch {}
    }

    if (
      !streamUrl ||
      streamUrl.includes('bitdash') ||
      streamUrl.includes('jwplayer') ||
      streamUrl.includes('longtailvideo') ||
      streamUrl.includes('samsung.wurl.tv') ||
      streamUrl.includes('liveproduseast')
    ) {
      streamUrl = VERIFIED_VOD_FALLBACKS[idx % VERIFIED_VOD_FALLBACKS.length];
    }

    return { ...item, id, streamUrl };
  });
}

export function parseM3u(content: string, maxChannels = 3000): ParsedM3uResult {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();
  const usedIds = new Set<string>();

  let currentExtInf: string | null = null;
  let order = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;

    if (line.toUpperCase().startsWith('#EXTINF:')) {
      currentExtInf = line;
    } else if (line.startsWith('#')) {
      // Header or other comment
      continue;
    } else {
      // Stream URL line
      const isHttp = /^https?:\/\//i.test(line);
      const isRtmp = /^rtmp(s)?:\/\//i.test(line);
      const isRtsp = /^rtsp:\/\//i.test(line);
      const isRelativeOrData = line.startsWith('/') || line.startsWith('blob:') || line.startsWith('data:');

      if (isHttp || isRtmp || isRtsp || isRelativeOrData) {
        const channel = parseChannelEntry(currentExtInf, line, order++, usedIds);
        channels.push(channel);
        categoriesSet.add(channel.category);
        currentExtInf = null;

        if (channels.length >= maxChannels) {
          break;
        }
      }
    }
  }

  // Ensure "OUTROS" is at end if present
  const categoriesList = Array.from(categoriesSet);
  const sortedCategories = categoriesList.filter((c) => c !== 'OUTROS');
  if (categoriesSet.has('OUTROS')) {
    sortedCategories.push('OUTROS');
  }

  return {
    channels,
    categories: sortedCategories,
  };
}

function parseChannelEntry(
  extInf: string | null,
  streamUrl: string,
  order: number,
  usedIds: Set<string>
): Channel {
  if (!extInf) {
    const name = `Canal ${order + 1}`;
    let id = `ch_${order}_${Math.random().toString(36).substring(2, 7)}`;
    while (usedIds.has(id)) {
      id = `${id}_${Math.random().toString(36).substring(2, 7)}`;
    }
    usedIds.add(id);

    return {
      id,
      name,
      streamUrl,
      category: 'OUTROS',
      orderIndex: order,
      initials: generateInitials(name),
    };
  }

  const tvgId = extractAttribute(extInf, /tvg-id=["']?([^"'\s,]+)["']?/i);
  const tvgName = extractAttribute(extInf, /tvg-name=["']?([^"']+)["']?/i);
  const tvgLogo = extractAttribute(extInf, /tvg-logo=["']?([^"']+)["']?/i);
  const groupTitle = extractAttribute(extInf, /group-title=["']?([^"']+)["']?/i);

  // Extract channel display name after last comma
  const commaIndex = extInf.lastIndexOf(',');
  let displayName = '';
  if (commaIndex !== -1 && commaIndex < extInf.length - 1) {
    displayName = extInf.substring(commaIndex + 1).trim();
  } else {
    displayName = tvgName || `Canal ${order + 1}`;
  }

  if (!displayName) {
    displayName = `Canal ${order + 1}`;
  }

  const finalCategory = groupTitle && groupTitle.trim().length > 0 ? groupTitle.trim() : 'OUTROS';
  
  // Guarantee unique ID across the channel list
  let baseId = tvgId || `ch_${displayName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
  if (!baseId || baseId === '_') {
    baseId = `ch_${order}`;
  }

  let finalId = baseId;
  if (usedIds.has(finalId)) {
    finalId = `${baseId}_${order}`;
  }
  while (usedIds.has(finalId)) {
    finalId = `${baseId}_${order}_${Math.random().toString(36).substring(2, 6)}`;
  }
  usedIds.add(finalId);

  return {
    id: finalId,
    name: displayName,
    streamUrl,
    logoUrl: tvgLogo || undefined,
    category: finalCategory,
    tvgId: tvgId || undefined,
    tvgName: tvgName || undefined,
    orderIndex: order,
    initials: generateInitials(displayName),
  };
}

function extractAttribute(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : null;
}
