import express, { Request, Response } from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Normalize URL in case Vercel rewrites stripped the /api prefix
app.use((req, _res, next) => {
  if (req.url && !req.url.startsWith('/api') && (req.url.startsWith('/proxy') || req.url.startsWith('/xtream'))) {
    req.url = '/api' + req.url;
  }
  next();
});

// Helper function to fetch URL following redirects
function fetchWithRedirect(
  targetUrl: string,
  headers: Record<string, string> = {},
  maxRedirects = 5,
  method = 'GET'
): Promise<{ status: number; headers: http.IncomingHttpHeaders; bodyStream: http.IncomingMessage; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Exceeded max redirects'));
    }

    try {
      const parsed = new URL(targetUrl);
      const isHttps = parsed.protocol === 'https:';
      const client = isHttps ? https : http;

      const reqHeaders = {
        'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        ...headers,
      };

      const req = client.request(
        targetUrl,
        {
          method,
          headers: reqHeaders,
        },
        (res) => {
          // Connected and response headers received: clear timeout for stream
          req.setTimeout(0);

          if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            let nextUrl = res.headers.location;
            if (!nextUrl.startsWith('http')) {
              nextUrl = new URL(nextUrl, targetUrl).toString();
            }
            res.resume(); // consume response data to free up memory
            return resolve(fetchWithRedirect(nextUrl, headers, maxRedirects - 1, method));
          }

          resolve({
            status: res.statusCode || 200,
            headers: res.headers,
            bodyStream: res,
            finalUrl: targetUrl,
          });
        }
      );

      // Connection timeout: 20s to establish connection
      req.setTimeout(20000, () => {
        req.destroy();
        reject(new Error('Connection timeout to stream server'));
      });

      req.on('error', reject);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// 1. PROXY PLAYLIST ENDPOINT
app.get('/api/proxy/playlist', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const { status, bodyStream } = await fetchWithRedirect(targetUrl);
    if (status >= 400) {
      return res.status(status).json({ error: `Remote server returned ${status}` });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Pipe directly with streaming. If maxChannels/maxSize is passed, stop after 4MB (~4000 live channels)
    // to keep browser memory super responsive.
    let bytesSent = 0;
    const maxBytes = 4 * 1024 * 1024; // 4 MB is plenty for thousands of channels

    bodyStream.on('data', (chunk: Buffer) => {
      bytesSent += chunk.length;
      res.write(chunk);
      if (bytesSent >= maxBytes) {
        bodyStream.destroy();
        res.end();
      }
    });

    bodyStream.on('end', () => {
      if (!res.writableEnded) {
        res.end();
      }
    });

    bodyStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      } else {
        res.end();
      }
    });
  } catch (err: any) {
    console.error('Playlist fetch error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: `Failed to fetch playlist: ${err.message}` });
    }
  }
});

// 2. PROXY STREAM ENDPOINT (Zero Vercel Transfer / Fast Origin Transfer = 0)
// Does NOT stream or proxy video chunks through the server/Vercel functions.
// Sends an immediate 302 redirect so the client streams directly from the origin CDN/IPTV server.
app.options('/api/proxy/stream', (_req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.sendStatus(204);
});

app.all('/api/proxy/stream', (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  // Zero Vercel Transfer: Redirect client directly to the media source
  return res.redirect(302, targetUrl);
});

// 3. XTREAM CODES DIRECT FAST API (Bypasses downloading 200,000 channels all at once)
app.post('/api/xtream/login-and-sync', async (req: Request, res: Response) => {
  const { server = 'http://wordbus.top', username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const cleanHost = server.startsWith('http') ? server : `http://${server}`;

  try {
    // 1. Authenticate user
    const authUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const { bodyStream: authStream } = await fetchWithRedirect(authUrl);
    const authChunks: Buffer[] = [];
    for await (const chunk of authStream) {
      authChunks.push(chunk as Buffer);
    }
    const rawAuthText = Buffer.concat(authChunks).toString('utf-8');

    let authData: any;
    try {
      authData = JSON.parse(rawAuthText);
    } catch {
      return res.status(401).json({
        error: 'Credenciais inválidas: usuário ou senha não autorizados pelo servidor.',
        status: 'BLOQUEADO',
      });
    }

    if (!authData.user_info || authData.user_info.auth !== 1) {
      return res.status(401).json({
        error: 'Credenciais inválidas: usuário ou senha incorretos.',
        status: 'BLOQUEADO',
      });
    }

    if (authData.user_info.status !== 'Active') {
      return res.status(403).json({
        error: `Conta com status: ${authData.user_info.status}. Por favor contate seu provedor.`,
        status: authData.user_info.status === 'Expired' ? 'EXPIRADO' : 'BLOQUEADO',
      });
    }

    // 2. Fetch categories, live streams, vod and series in parallel
    const catUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_live_categories`;
    const streamUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_live_streams`;
    const vodCatUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_vod_categories`;
    const vodStreamsUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_vod_streams`;
    const seriesCatUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_series_categories`;
    const seriesStreamsUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_series`;

    const [catRes, streamRes, vodCatRes, vodStreamsRes, seriesCatRes, seriesStreamsRes] = await Promise.all([
      fetchWithRedirect(catUrl).catch(() => ({ bodyStream: Buffer.from('[]') })),
      fetchWithRedirect(streamUrl).catch(() => ({ bodyStream: Buffer.from('[]') })),
      fetchWithRedirect(vodCatUrl).catch(() => ({ bodyStream: Buffer.from('[]') })),
      fetchWithRedirect(vodStreamsUrl).catch(() => ({ bodyStream: Buffer.from('[]') })),
      fetchWithRedirect(seriesCatUrl).catch(() => ({ bodyStream: Buffer.from('[]') })),
      fetchWithRedirect(seriesStreamsUrl).catch(() => ({ bodyStream: Buffer.from('[]') })),
    ]);

    const readStreamJson = async (res: any) => {
      try {
        if (!res.bodyStream) return [];
        const chunks: Buffer[] = [];
        for await (const chunk of res.bodyStream) chunks.push(chunk as Buffer);
        const text = Buffer.concat(chunks).toString('utf-8');
        return JSON.parse(text);
      } catch {
        return [];
      }
    };

    const categoriesJson = await readStreamJson(catRes);
    const streamsJson = await readStreamJson(streamRes);
    const vodCatJson = await readStreamJson(vodCatRes);
    const vodStreamsJson = await readStreamJson(vodStreamsRes);
    const seriesCatJson = await readStreamJson(seriesCatRes);
    const seriesStreamsJson = await readStreamJson(seriesStreamsRes);

    // Category mapping for Live TV
    const categoryMap: Record<string, string> = {};
    const categoriesList: string[] = [];
    if (Array.isArray(categoriesJson)) {
      categoriesJson.forEach((c: any) => {
        categoryMap[String(c.category_id)] = c.category_name;
        if (!categoriesList.includes(c.category_name)) {
          categoriesList.push(c.category_name);
        }
      });
    }

    // Category mapping for Movies (VOD)
    const vodCategoryMap: Record<string, string> = {};
    const vodCategoriesList: string[] = [];
    if (Array.isArray(vodCatJson)) {
      vodCatJson.forEach((c: any) => {
        vodCategoryMap[String(c.category_id)] = c.category_name;
        if (!vodCategoriesList.includes(c.category_name)) {
          vodCategoriesList.push(c.category_name);
        }
      });
    }

    // Category mapping for Series
    const seriesCategoryMap: Record<string, string> = {};
    const seriesCategoriesList: string[] = [];
    if (Array.isArray(seriesCatJson)) {
      seriesCatJson.forEach((c: any) => {
        seriesCategoryMap[String(c.category_id)] = c.category_name;
        if (!seriesCategoriesList.includes(c.category_name)) {
          seriesCategoriesList.push(c.category_name);
        }
      });
    }

    // Stream server URL: Always use cleanHost (e.g. http://wordbus.top) which is the reliable entry point
    const streamBase = cleanHost;

    // Map channels
    const seenStreamIds = new Set<string>();
    const channels = Array.isArray(streamsJson)
      ? streamsJson.map((s: any, idx: number) => {
          const rawStreamUrl = `${streamBase}/live/${username}/${password}/${s.stream_id}.m3u8`;
          const catName = categoryMap[String(s.category_id)] || 'OUTROS';
          const name = s.name || `Canal ${idx + 1}`;

          // Generate 2-letter initials
          const cleanWords = name.trim().replace(/[[\](){}]/g, '').split(/\s+/).filter(Boolean);
          const initials =
            cleanWords.length === 0
              ? 'SP'
              : cleanWords.length === 1
              ? cleanWords[0].slice(0, 2).toUpperCase()
              : (cleanWords[0][0] + cleanWords[1][0]).toUpperCase();

          let streamId = s.stream_id != null ? `stream_${s.stream_id}` : `stream_${idx}`;
          if (seenStreamIds.has(streamId)) {
            streamId = `${streamId}_${idx}`;
          }
          seenStreamIds.add(streamId);

          return {
            id: streamId,
            name,
            streamUrl: rawStreamUrl,
            logoUrl: s.stream_icon || undefined,
            category: catName,
            tvgId: s.epg_channel_id || undefined,
            orderIndex: idx,
            initials,
          };
        })
      : [];

    // Map Movies (VOD) - Carregar todos os conteúdos sem limitação
    const seenMovieIds = new Set<string>();
    const movies = Array.isArray(vodStreamsJson)
      ? vodStreamsJson.map((m: any, idx: number) => {
          const rawExt = (m.container_extension || '').toLowerCase().trim();
          const ext = rawExt && rawExt !== 'mkv' && rawExt !== 'avi' ? rawExt : 'mp4';
          const rawStreamUrl = `${streamBase}/movie/${username}/${password}/${m.stream_id}.${ext}`;
          const catName = vodCategoryMap[String(m.category_id)] || 'Filmes';
          let movieId = m.stream_id != null ? `vod_${m.stream_id}` : `vod_${idx}`;
          if (seenMovieIds.has(movieId)) {
            movieId = `${movieId}_${idx}`;
          }
          seenMovieIds.add(movieId);

          return {
            id: movieId,
            name: m.name || m.title || `Filme ${idx + 1}`,
            streamUrl: rawStreamUrl,
            posterUrl: m.stream_icon || undefined,
            category: catName,
            year: m.year || undefined,
            rating: m.rating ? Number(m.rating) : undefined,
            plot: m.plot || undefined,
            cast: m.cast || undefined,
            director: m.director || undefined,
          };
        })
      : [];

    // Map Series - Carregar todas as séries sem limitação
    const seenSeriesIds = new Set<string>();
    const series = Array.isArray(seriesStreamsJson)
      ? seriesStreamsJson.map((s: any, idx: number) => {
          const catName = seriesCategoryMap[String(s.category_id)] || 'Séries';
          let seriesId = s.series_id != null ? `series_${s.series_id}` : `series_${idx}`;
          if (seenSeriesIds.has(seriesId)) {
            seriesId = `${seriesId}_${idx}`;
          }
          seenSeriesIds.add(seriesId);

          return {
            id: seriesId,
            name: s.name || s.title || `Série ${idx + 1}`,
            posterUrl: s.cover || undefined,
            category: catName,
            plot: s.plot || undefined,
            cast: s.cast || undefined,
            genre: s.genre || undefined,
            rating: s.rating ? Number(s.rating) : undefined,
            year: s.year || undefined,
          };
        })
      : [];

    let expFormatted = 'Ilimitado';
    if (authData.user_info.exp_date) {
      const expTimestamp = Number(authData.user_info.exp_date);
      if (!isNaN(expTimestamp) && expTimestamp > 0) {
        expFormatted = new Date(expTimestamp * 1000).toLocaleDateString('pt-BR');
      }
    }

    res.json({
      success: true,
      user_info: {
        username: authData.user_info.username,
        status: authData.user_info.status,
        expirationDate: expFormatted,
        maxConnections: authData.user_info.max_connections || 1,
        activeConnections: authData.user_info.active_cons || 0,
      },
      channels,
      categories: ['TODOS', 'FAVORITOS', ...categoriesList],
      movies,
      movieCategories: ['TODOS', ...vodCategoriesList],
      series,
      seriesCategories: ['TODOS', ...seriesCategoriesList],
    });
  } catch (err: any) {
    console.error('Xtream login-and-sync error:', err);
    res.status(500).json({ error: `Erro na comunicação com o servidor: ${err.message}` });
  }
});

app.get('/api/xtream/categories', async (req: Request, res: Response) => {
  const { host, username, password } = req.query as Record<string, string>;
  if (!host || !username || !password) {
    return res.status(400).json({ error: 'Missing host, username or password' });
  }

  const cleanHost = host.startsWith('http') ? host : `http://${host}`;
  const apiUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_live_categories`;

  try {
    const { bodyStream } = await fetchWithRedirect(apiUrl);
    const chunks: Buffer[] = [];
    bodyStream.on('data', (c) => chunks.push(c));
    bodyStream.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.concat(chunks).toString('utf-8'));
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/xtream/streams', async (req: Request, res: Response) => {
  const { host, username, password, category_id } = req.query as Record<string, string>;
  if (!host || !username || !password) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const cleanHost = host.startsWith('http') ? host : `http://${host}`;
  const catParam = category_id ? `&category_id=${encodeURIComponent(category_id)}` : '';
  const apiUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_live_streams${catParam}`;

  try {
    const { bodyStream } = await fetchWithRedirect(apiUrl);
    const chunks: Buffer[] = [];
    bodyStream.on('data', (c) => chunks.push(c));
    bodyStream.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.concat(chunks).toString('utf-8'));
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// VOD Movies Endpoint
app.get('/api/xtream/vod', async (req: Request, res: Response) => {
  const { host, username, password, category_id } = req.query as Record<string, string>;
  if (!host || !username || !password) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const cleanHost = host.startsWith('http') ? host : `http://${host}`;
  const catParam = category_id && category_id !== 'TODOS' ? `&category_id=${encodeURIComponent(category_id)}` : '';
  const apiUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_vod_streams${catParam}`;

  try {
    const { bodyStream } = await fetchWithRedirect(apiUrl);
    const chunks: Buffer[] = [];
    bodyStream.on('data', (c) => chunks.push(c));
    bodyStream.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.concat(chunks).toString('utf-8'));
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Series Endpoint
app.get('/api/xtream/series', async (req: Request, res: Response) => {
  const { host, username, password, category_id } = req.query as Record<string, string>;
  if (!host || !username || !password) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const cleanHost = host.startsWith('http') ? host : `http://${host}`;
  const catParam = category_id && category_id !== 'TODOS' ? `&category_id=${encodeURIComponent(category_id)}` : '';
  const apiUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_series${catParam}`;

  try {
    const { bodyStream } = await fetchWithRedirect(apiUrl);
    const chunks: Buffer[] = [];
    bodyStream.on('data', (c) => chunks.push(c));
    bodyStream.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.concat(chunks).toString('utf-8'));
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Series Info (Episodes & Seasons) Endpoint
app.get('/api/xtream/series-info', async (req: Request, res: Response) => {
  const { host, username, password, series_id } = req.query as Record<string, string>;
  if (!host || !username || !password || !series_id) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const cleanHost = host.startsWith('http') ? host : `http://${host}`;
  const apiUrl = `${cleanHost}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=get_series_info&series_id=${encodeURIComponent(series_id)}`;

  try {
    const { bodyStream } = await fetchWithRedirect(apiUrl);
    const chunks: Buffer[] = [];
    bodyStream.on('data', (c) => chunks.push(c));
    bodyStream.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.concat(chunks).toString('utf-8'));
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Export Express app for Vercel Serverless Functions
export { app };
export default app;

// Only start standalone HTTP server when not in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer().catch(console.error);
}
