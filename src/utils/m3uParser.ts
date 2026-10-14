import { Channel, VodMovie, VodSeries } from '../types';

export interface ParsedM3uResult {
  channels: Channel[];
  categories: string[];
  movies: VodMovie[];
  movieCategories: string[];
  series: VodSeries[];
  seriesCategories: string[];
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

    // Keep real authentic stream URL intact without generic overwrites
    return { ...item, id, streamUrl };
  });
}

export function parseM3u(content: string, maxItems = 25000): ParsedM3uResult {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();
  const movies: VodMovie[] = [];
  const movieCategoriesSet = new Set<string>();
  const series: VodSeries[] = [];
  const seriesCategoriesSet = new Set<string>();
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
        const streamUrl = line;
        const extInf = currentExtInf;
        currentExtInf = null;
        order++;

        const tvgId = extInf ? extractAttribute(extInf, /tvg-id=["']?([^"'\s,]+)["']?/i) : null;
        const tvgName = extInf ? extractAttribute(extInf, /tvg-name=["']?([^"']+)["']?/i) : null;
        const tvgLogo = extInf ? extractAttribute(extInf, /tvg-logo=["']?([^"']+)["']?/i) : null;
        const groupTitle = extInf ? extractAttribute(extInf, /group-title=["']?([^"']+)["']?/i) : null;

        let displayName = '';
        if (extInf) {
          const commaIndex = extInf.lastIndexOf(',');
          if (commaIndex !== -1 && commaIndex < extInf.length - 1) {
            displayName = extInf.substring(commaIndex + 1).trim();
          } else {
            displayName = tvgName || `Item ${order}`;
          }
        } else {
          displayName = `Item ${order}`;
        }
        if (!displayName) displayName = `Item ${order}`;

        const finalCategory = groupTitle && groupTitle.trim().length > 0 ? groupTitle.trim() : 'OUTROS';
        const groupLower = finalCategory.toLowerCase();
        const urlLower = streamUrl.toLowerCase();

        // Unique ID generation
        let baseId = tvgId || `item_${displayName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
        if (!baseId || baseId === '_') baseId = `item_${order}`;
        let finalId = baseId;
        if (usedIds.has(finalId)) finalId = `${baseId}_${order}`;
        while (usedIds.has(finalId)) {
          finalId = `${baseId}_${order}_${Math.random().toString(36).substring(2, 6)}`;
        }
        usedIds.add(finalId);

        // Detect if entry is a Series
        const isSeries =
          urlLower.includes('/series/') ||
          groupLower.includes('série') ||
          groupLower.includes('serie') ||
          groupLower.includes('series') ||
          groupLower.includes('temporada') ||
          groupLower.includes('season') ||
          groupLower.includes('novela') ||
          groupLower.includes('animes') ||
          groupLower.includes('desenhos');

        // Detect if entry is a VOD Movie
        const isMovie =
          !isSeries && (
            urlLower.includes('/movie/') ||
            urlLower.endsWith('.mp4') ||
            urlLower.endsWith('.mkv') ||
            urlLower.endsWith('.avi') ||
            urlLower.includes('.mp4?') ||
            urlLower.includes('.mkv?') ||
            groupLower.includes('filme') ||
            groupLower.includes('filmes') ||
            groupLower.includes('movie') ||
            groupLower.includes('vod') ||
            groupLower.includes('cinema') ||
            groupLower.includes('cine') ||
            groupLower.includes('lançamento') ||
            groupLower.includes('lançamentos') ||
            groupLower.includes('telecine') ||
            groupLower.includes('hbo max') ||
            groupLower.includes('prime video') ||
            groupLower.includes('disney+') ||
            groupLower.includes('paramount+') ||
            groupLower.includes('4k*')
          );

        if (isSeries) {
          series.push({
            id: `series_${finalId}`,
            name: displayName,
            posterUrl: tvgLogo || undefined,
            category: finalCategory,
            plot: `Conteúdo da série "${displayName}" da sua lista IPTV.`,
            rating: 8.5,
          });
          seriesCategoriesSet.add(finalCategory);
        } else if (isMovie) {
          const yearMatch = displayName.match(/\b(19\d\d|20\d\d)\b/);
          movies.push({
            id: `vod_${finalId}`,
            name: displayName,
            streamUrl,
            posterUrl: tvgLogo || undefined,
            category: finalCategory,
            year: yearMatch ? yearMatch[1] : undefined,
            rating: 8.0,
            plot: `Filme "${displayName}" da sua lista IPTV.`,
          });
          movieCategoriesSet.add(finalCategory);
        } else {
          channels.push({
            id: finalId,
            name: displayName,
            streamUrl,
            logoUrl: tvgLogo || undefined,
            category: finalCategory,
            tvgId: tvgId || undefined,
            tvgName: tvgName || undefined,
            orderIndex: order,
            initials: generateInitials(displayName),
          });
          categoriesSet.add(finalCategory);
        }

        if (channels.length + movies.length + series.length >= maxItems) {
          break;
        }
      }
    }
  }

  // Ensure "OUTROS" is at end if present
  const sortedCategories = Array.from(categoriesSet).filter((c) => c !== 'OUTROS');
  if (categoriesSet.has('OUTROS')) sortedCategories.push('OUTROS');

  const sortedMovieCategories = Array.from(movieCategoriesSet).filter((c) => c !== 'OUTROS');
  if (movieCategoriesSet.has('OUTROS')) sortedMovieCategories.push('OUTROS');

  const sortedSeriesCategories = Array.from(seriesCategoriesSet).filter((c) => c !== 'OUTROS');
  if (seriesCategoriesSet.has('OUTROS')) sortedSeriesCategories.push('OUTROS');

  return {
    channels,
    categories: sortedCategories,
    movies,
    movieCategories: sortedMovieCategories,
    series,
    seriesCategories: sortedSeriesCategories,
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
