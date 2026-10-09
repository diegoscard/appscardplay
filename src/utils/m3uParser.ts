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
 * Returns a playable URL: if the stream is HTTP or needs proxying to bypass CORS/mixed-content,
 * routes through /api/proxy/stream.
 */
export function getPlayableStreamUrl(originalUrl: string): string {
  if (!originalUrl) return '';

  // If already relative proxy or local blob
  if (originalUrl.startsWith('/api/') || originalUrl.startsWith('blob:')) {
    return originalUrl;
  }

  // If page is HTTPS and stream is HTTP, or external IPTV server without CORS
  const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isHttpStream = originalUrl.startsWith('http://');

  if (isHttpStream || isHttpsPage || originalUrl.includes('lazercp.sbs') || originalUrl.includes('wordbus.top')) {
    return `/api/proxy/stream?url=${encodeURIComponent(originalUrl)}`;
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
    return id === ch.id ? ch : { ...ch, id };
  });
}

export function ensureUniqueVodIds<T extends { id: string }>(items: T[]): T[] {
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
    return id === item.id ? item : { ...item, id };
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
