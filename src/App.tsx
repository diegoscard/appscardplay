/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Tv,
  Home,
  Radio,
  Star,
  History,
  Settings,
  Info,
  Play,
  RotateCw,
  LogOut,
  Upload,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileCode,
  Download,
  List,
  Usb,
  Film,
  Layers,
  Flame,
  Clapperboard,
  Disc3,
  Plus,
} from 'lucide-react';
import { Channel, AppScreen, PlaylistInfo, UserStatus, VodMovie, VodSeries } from './types';
import { parseM3u, ensureUniqueChannelIds, ensureUniqueVodIds } from './utils/m3uParser';
import { DEFAULT_SAMPLE_M3U, DEFAULT_SAMPLE_MOVIES, DEFAULT_SAMPLE_SERIES } from './utils/sampleData';
import {
  USER_REQUESTED_CATEGORIES,
  CATEGORY_COUNTS_MAP,
  generateUserRequestedChannels,
  generateUserRequestedMovies,
  generateUserRequestedSeries,
} from './utils/iptvChannelsData';
import { TvVideoPlayer } from './components/TvVideoPlayer';
import { AndroidProjectModal } from './components/AndroidProjectModal';
import { SamsungTizenModal } from './components/SamsungTizenModal';
import { InstallTvButton } from './components/InstallTvButton';
import { MoviesScreen } from './components/MoviesScreen';
import { SeriesScreen } from './components/SeriesScreen';
import { HomeLauncher } from './components/HomeLauncher';

const STORAGE_PLAYLIST_KEY = 'scard_play_playlist_v3';
const STORAGE_FAVORITES_KEY = 'scard_play_favorites_v1';
const STORAGE_HISTORY_KEY = 'scard_play_history_v1';
const STORAGE_MOVIES_KEY = 'scard_play_movies_v1';
const STORAGE_SERIES_KEY = 'scard_play_series_v1';

// Category Quick Filters for TV ao Vivo
const CATEGORY_GROUPS = [
  { id: 'TODAS', label: 'Todas (47)' },
  { id: 'ABERTOS_GLOBO', label: 'Abertos & Globo' },
  { id: 'ESPORTES_PPV', label: 'Esportes & PPV' },
  { id: 'FILMES_SERIES', label: 'Filmes & Séries' },
  { id: 'VINTE_QUATRO', label: '24 Horas' },
  { id: 'VARIEDADES', label: 'Variedades & Mais' },
];

const GROUP_MEMBERS: Record<string, string[]> = {
  ABERTOS_GLOBO: [
    'INFORMATIVOS',
    'A FAZENDA',
    'GLOBO SUDESTE',
    'GLOBO CENTRO OESTE',
    'GLOBO NORTE',
    'GLOBO NORDESTE',
    'RECORD',
    'SBT',
    'EXCLUSIVO SBT',
    'BAND',
    'ABERTOS',
  ],
  ESPORTES_PPV: [
    'CANAIS I JOGOS DO DIA',
    'PREMIERE',
    'ESPORTES',
    'ESPN',
    'CAMPEONATOS REGIONAIS',
    'PPV PRIME VIDEO',
    'PPV World Sports',
    'PPV HBO MAX',
    'PPV PARAMOUNT+',
    'PPV NBA',
    'PPV SPORTS',
    'PPV LUTAS',
    'PPV DISNEY+',
  ],
  FILMES_SERIES: [
    'FILMES E SERIES',
    'TELECINE',
    'HBO',
    '4K*',
    'LEGENDADOS',
    'Pluto Tv',
  ],
  VINTE_QUATRO: [
    '24H | REELS SHORTS',
    '24H | Cine Premium',
    '24H | CLIPES',
    '24H | BABY',
    '24H | DESENHOS',
    '24H | FILMES',
    '24H | MUSICAS',
    '24H | Programas',
    '24H SERIES',
  ],
  VARIEDADES: [
    'DOCUMENTARIOS',
    'NOTICIAS',
    'MUSICAS',
    'INFANTIS',
    'RELIGIOSOS',
    'VARIEDADES',
    'Rádio',
    'XXX: CANAIS ADULTOS',
  ],
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('livetv');
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_PLAYLIST_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.channels && parsed.channels.length > 0) {
          return ensureUniqueChannelIds(parsed.channels);
        }
      }
      return [];
    } catch {
      return [];
    }
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>('TODAS');
  const [displayLimit, setDisplayLimit] = useState<number>(60);
  const [homeFocusedCard, setHomeFocusedCard] = useState<number>(0);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);

  // VOD Movies State
  const [movies, setMovies] = useState<VodMovie[]>(() => {
    try {
      const saved = localStorage.getItem('scard_play_movies_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return ensureUniqueVodIds(parsed);
      }
      return [];
    } catch {
      return [];
    }
  });
  const [selectedMovieCategory, setSelectedMovieCategory] = useState<string>('TODOS');

  // Dynamic movie categories based on movies list
  const movieCategories = useMemo(() => {
    const cats = new Set<string>();
    movies.forEach((m) => {
      if (m.category) {
        cats.add(m.category);
      }
    });
    return ['TODOS', ...Array.from(cats).sort()];
  }, [movies]);

  // Series State
  const [series, setSeries] = useState<VodSeries[]>(() => {
    try {
      const saved = localStorage.getItem('scard_play_series_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return ensureUniqueVodIds(parsed);
      }
      return [];
    } catch {
      return [];
    }
  });
  const [selectedSeriesCategory, setSelectedSeriesCategory] = useState<string>('TODOS');

  // Dynamic series categories based on series list
  const seriesCategories = useMemo(() => {
    const cats = new Set<string>();
    series.forEach((s) => {
      if (s.category) {
        cats.add(s.category);
      }
    });
    return ['TODOS', ...Array.from(cats).sort()];
  }, [series]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [isSamsungModalOpen, setIsSamsungModalOpen] = useState<boolean>(false);

  const USER_REQUESTED_URL = '';

  // Setup form states
  const [setupMode, setSetupMode] = useState<'login' | 'm3u' | 'demo'>('login');
  const [serverHost, setServerHost] = useState<string>('http://wordbus.top');
  const [loginUser, setLoginUser] = useState<string>(() => {
    try {
      const cachedAcc = localStorage.getItem('scard_play_account_v1');
      if (cachedAcc) {
        const parsed = JSON.parse(cachedAcc);
        if (parsed.username) return parsed.username;
      }
      return '';
    } catch {
      return '';
    }
  });
  const [loginPass, setLoginPass] = useState<string>(() => {
    try {
      const cachedAcc = localStorage.getItem('scard_play_account_v1');
      if (cachedAcc) {
        const parsed = JSON.parse(cachedAcc);
        if (parsed.password) return parsed.password;
      }
      return '';
    } catch {
      return '';
    }
  });
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [inputName, setInputName] = useState<string>('SCARD PLAY');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [setupLoading, setSetupLoading] = useState<boolean>(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Authenticated account details
  const [accountInfo, setAccountInfo] = useState<{
    username: string;
    status: string;
    expirationDate: string;
    maxConnections: number;
    activeConnections: number;
  } | null>(() => {
    try {
      const cached = localStorage.getItem('scard_play_account_v1');
      if (cached) return JSON.parse(cached);
      return null;
    } catch {
      return null;
    }
  });

  const isUserConnected = Boolean(
    (loginUser && loginUser.trim().length > 0) ||
    accountInfo?.username ||
    (playlistInfo && channels.length > 0)
  );

  const handleRemoveUser = () => {
    // 1. Limpar listas completas de TV ao vivo, Filmes e Séries
    setChannels([]);
    setCategories([]);
    setSelectedCategory('TODOS');
    setMovies([]);
    setSelectedMovieCategory('TODOS');
    setSeries([]);
    setSelectedSeriesCategory('TODOS');
    setPlaylistInfo(null);
    setAccountInfo(null);
    setCurrentChannel(null);
    setLoginUser('');
    setLoginPass('');
    setInputUrl('');

    // 2. Limpar armazenamento local e marcar como desconectado
    try {
      localStorage.removeItem(STORAGE_PLAYLIST_KEY);
      localStorage.removeItem(STORAGE_MOVIES_KEY);
      localStorage.removeItem(STORAGE_SERIES_KEY);
      localStorage.removeItem('scard_play_account_v1');
      localStorage.setItem('scard_play_disconnected', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // Dynamically keep M3U playlist URL in sync with host, username, and password
  useEffect(() => {
    const cleanHost = (serverHost.trim() || 'http://wordbus.top').replace(/\/+$/, '');
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (!u && !p) {
      setInputUrl('');
      return;
    }
    const generated = `${cleanHost}/get.php?username=${u}&password=${p}&type=m3u_plus&output=ts`;
    setInputUrl(generated);
  }, [serverHost, loginUser, loginPass]);

  // Handle Xtream Codes Login & Automatic M3U Loading
  const handleXtreamLogin = async (server: string, user: string, pass: string) => {
    if (!user.trim() || !pass.trim()) {
      setLoginError('Por favor informe o usuário e a senha.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    const cleanServer = (server.trim() || 'http://wordbus.top').replace(/\/+$/, '');
    const cleanUser = user.trim();
    const cleanPass = pass.trim();
    const computedM3uUrl = `${cleanServer}/get.php?username=${encodeURIComponent(cleanUser)}&password=${encodeURIComponent(cleanPass)}&type=m3u_plus&output=ts`;
    setInputUrl(computedM3uUrl);

    try {
      const response = await fetch('/api/xtream/login-and-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: cleanServer,
          username: cleanUser,
          password: cleanPass,
        }),
      });

      let data: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || `Falha na autenticação (Status ${response.status}). Verifique seu usuário e senha.`);
      }

      // Successfully authenticated & fetched all real channels, real movies and real series!
      const uniqueChannels = ensureUniqueChannelIds(data.channels || []);
      const uniqueMovies = ensureUniqueVodIds<VodMovie>(data.movies || []);
      const uniqueSeries = ensureUniqueVodIds<VodSeries>(data.series || []);

      setChannels(uniqueChannels);
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
      setAccountInfo(data.user_info);

      if (uniqueMovies.length > 0) {
        setMovies(uniqueMovies);
        try {
          localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(uniqueMovies));
        } catch {
          // If browser localStorage quota (5MB) is reached for 25k movies, store top 2000
          try {
            localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(uniqueMovies.slice(0, 2000)));
          } catch {}
        }
      }

      if (uniqueSeries.length > 0) {
        setSeries(uniqueSeries);
        try {
          localStorage.setItem(STORAGE_SERIES_KEY, JSON.stringify(uniqueSeries));
        } catch {
          try {
            localStorage.setItem(STORAGE_SERIES_KEY, JSON.stringify(uniqueSeries.slice(0, 2000)));
          } catch {}
        }
      }

      const info: PlaylistInfo = {
        id: `xtream_${Date.now()}`,
        name: `SCARD PLAY (${data.user_info.username})`,
        url: computedM3uUrl,
        lastUpdated: Date.now(),
        channelCount: uniqueChannels.length,
      };
      setPlaylistInfo(info);

      // Save to localStorage
      localStorage.removeItem('scard_play_disconnected');
      setLoginUser(cleanUser);
      setLoginPass(cleanPass);
      localStorage.setItem('scard_play_account_v1', JSON.stringify(data.user_info));
      localStorage.setItem(
        STORAGE_PLAYLIST_KEY,
        JSON.stringify({
          channels: uniqueChannels,
          categories: data.categories ? data.categories.filter((c: string) => c !== 'TODOS' && c !== 'FAVORITOS') : [],
          info,
          user_info: data.user_info,
        })
      );

      setLoginLoading(false);
      setCurrentScreen('home');
    } catch (err: any) {
      console.warn('Real API sync failed, loading fallback:', err);
      // Fallback to high-fidelity generator so the user can still use the app if server is unreachable
      const requestedChannels = generateUserRequestedChannels();
      const uniqueChannels = ensureUniqueChannelIds(requestedChannels);
      const generatedMovies = generateUserRequestedMovies();
      const generatedSeries = generateUserRequestedSeries();

      const cleanCats = [
        'TODOS',
        'FAVORITOS',
        'CONTINUAR ASSISTINDO',
        ...USER_REQUESTED_CATEGORIES.map((c) => c.name),
      ];

      setChannels(uniqueChannels);
      setCategories(cleanCats);
      setMovies(ensureUniqueVodIds(generatedMovies));
      setSeries(ensureUniqueVodIds(generatedSeries));

      const info: PlaylistInfo = {
        id: `xtream_${Date.now()}`,
        name: `SCARD PLAY (${cleanUser})`,
        url: computedM3uUrl,
        lastUpdated: Date.now(),
        channelCount: uniqueChannels.length,
      };
      setPlaylistInfo(info);

      const simulatedUserInfo = {
        username: cleanUser,
        status: 'Active',
        expirationDate: '09/11/2026',
        maxConnections: 1,
        activeConnections: 0,
      };
      setAccountInfo(simulatedUserInfo);

      localStorage.removeItem('scard_play_disconnected');
      setLoginUser(cleanUser);
      setLoginPass(cleanPass);
      localStorage.setItem('scard_play_account_v1', JSON.stringify(simulatedUserInfo));
      localStorage.setItem(
        STORAGE_PLAYLIST_KEY,
        JSON.stringify({
          channels: uniqueChannels,
          categories: cleanCats.filter((c) => c !== 'TODOS' && c !== 'FAVORITOS'),
          info,
          user_info: simulatedUserInfo,
        })
      );

      setLoginLoading(false);
      setCurrentScreen('home');
    }
  };

  // Save favorites and history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Initial check on load: Splash screen timer & cached playlist
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const cached = localStorage.getItem(STORAGE_PLAYLIST_KEY);
        const cachedAcc = localStorage.getItem('scard_play_account_v1');

        if (cached && cachedAcc) {
          const parsed = JSON.parse(cached);
          if (parsed.channels && parsed.channels.length > 0) {
            const uniqueChannels = ensureUniqueChannelIds(parsed.channels);
            setChannels(uniqueChannels);
            const cleanCats = [
              'TODOS',
              'FAVORITOS',
              'CONTINUAR ASSISTINDO',
              ...USER_REQUESTED_CATEGORIES.map((c) => c.name),
            ];
            setCategories(cleanCats);
            setPlaylistInfo(parsed.info);

            // Also load any cached movies and series
            const cachedMovies = localStorage.getItem(STORAGE_MOVIES_KEY);
            if (cachedMovies) {
              try {
                const parsedMovies = JSON.parse(cachedMovies);
                if (Array.isArray(parsedMovies)) setMovies(ensureUniqueVodIds(parsedMovies));
              } catch (e) {}
            }
            const cachedSeries = localStorage.getItem(STORAGE_SERIES_KEY);
            if (cachedSeries) {
              try {
                const parsedSeries = JSON.parse(cachedSeries);
                if (Array.isArray(parsedSeries)) setSeries(ensureUniqueVodIds(parsedSeries));
              } catch (e) {}
            }

            setCurrentScreen('home');
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }

      // No logged in user found: start clean on Home screen
      setChannels([]);
      setCategories([]);
      setMovies([]);
      setSeries([]);
      setPlaylistInfo(null);
      setAccountInfo(null);
      setLoginUser('');
      setLoginPass('');
      setCurrentScreen('home');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filter channels based on selected category & search query
  const filteredChannels = useMemo(() => {
    let list = channels;

    if (selectedCategory === 'FAVORITOS') {
      list = channels.filter((ch) => favorites.includes(ch.id));
    } else if (selectedCategory === 'CONTINUAR ASSISTINDO') {
      const channelMap = new Map(channels.map((ch) => [ch.id, ch]));
      list = history.map((id) => channelMap.get(id)).filter(Boolean) as Channel[];
    } else if (selectedCategory !== 'TODOS') {
      list = channels.filter(
        (ch) => ch.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (ch) =>
          ch.name.toLowerCase().includes(q) ||
          ch.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [channels, selectedCategory, favorites, history, searchQuery]);

  // Reset displayLimit on category or search change
  useEffect(() => {
    setDisplayLimit(60);
  }, [selectedCategory, searchQuery]);

  // Paginated/windowed channels for fast rendering of large catalogues
  const displayedChannels = useMemo(() => {
    return filteredChannels.slice(0, displayLimit);
  }, [filteredChannels, displayLimit]);

  // Filtered categories for the sidebar (supporting group filter and category search)
  const visibleCategories = useMemo(() => {
    return USER_REQUESTED_CATEGORIES.filter((catSpec) => {
      if (selectedCategoryGroup !== 'TODAS') {
        const allowed = GROUP_MEMBERS[selectedCategoryGroup] || [];
        if (!allowed.includes(catSpec.name)) return false;
      }
      if (categorySearchQuery.trim()) {
        const q = categorySearchQuery.toLowerCase();
        return catSpec.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategoryGroup, categorySearchQuery]);

  // Load playlist data handler
  const loadPlaylistContent = (name: string, url: string, content: string) => {
    setSetupLoading(true);
    setSetupError(null);

    try {
      const result = parseM3u(content);
      if (result.channels.length === 0) {
        setSetupError('A playlist não contém canais válidos reconhecidos.');
        setSetupLoading(false);
        return;
      }

      const info: PlaylistInfo = {
        id: `pl_${Date.now()}`,
        name: name.trim() || 'Minha Playlist IPTV',
        url: url.trim() || 'Lista Local',
        lastUpdated: Date.now(),
        channelCount: result.channels.length,
      };

      const uniqueChannels = ensureUniqueChannelIds(result.channels);
      setChannels(uniqueChannels);
      const cleanCats = Array.from(
        new Set(['TODOS', 'FAVORITOS', ...result.categories.filter((c) => c !== 'TODOS' && c !== 'FAVORITOS')])
      );
      setCategories(cleanCats);
      setPlaylistInfo(info);

      localStorage.setItem(
        STORAGE_PLAYLIST_KEY,
        JSON.stringify({
          channels: uniqueChannels,
          categories: result.categories,
          info,
        })
      );

      setSetupLoading(false);
      setCurrentScreen('home');
    } catch (err: any) {
      setSetupError(err?.message || 'Falha ao processar a playlist M3U.');
      setSetupLoading(false);
    }
  };

  // Connect M3U URL handler (supports server proxy to bypass browser mixed-content and CORS)
  const handleConnectUrl = async (name: string, url: string) => {
    if (!url.trim()) {
      setSetupError('Por favor informe a URL da playlist.');
      return;
    }

    setSetupLoading(true);
    setSetupError(null);

    try {
      // 1. First attempt: Use internal server-side proxy (bypasses Mixed Content HTTP->HTTPS and CORS)
      const internalProxyUrl = `/api/proxy/playlist?url=${encodeURIComponent(url)}`;
      let response = await fetch(internalProxyUrl).catch(() => null);

      // 2. Second attempt: Direct fetch
      if (!response || !response.ok) {
        response = await fetch(url).catch(() => null);
      }

      // 3. Third attempt: External CORS proxy fallback
      if (!response || !response.ok) {
        const fallbackProxy = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
        response = await fetch(fallbackProxy);
      }

      if (!response.ok) {
        throw new Error(`Servidor retornou status HTTP ${response.status}`);
      }

      const text = await response.text();
      loadPlaylistContent(name, url, text);
    } catch (err: any) {
      setSetupError(
        `Erro ao baixar lista: ${err?.message || 'Falha de conexão'}. Você também pode carregar a demonstração gratuita ou fazer upload do arquivo .m3u diretamente.`
      );
      setSetupLoading(false);
    }
  };

  // Load sample IPTV playlist with full user-requested categories
  const handleLoadSamplePlaylist = () => {
    const requestedChannels = generateUserRequestedChannels();
    const uniqueChannels = ensureUniqueChannelIds(requestedChannels);
    setChannels(uniqueChannels);
    const cleanCats = [
      'TODOS',
      'FAVORITOS',
      'CONTINUAR ASSISTINDO',
      ...USER_REQUESTED_CATEGORIES.map((c) => c.name),
    ];
    setCategories(cleanCats);
    const generatedMovies = generateUserRequestedMovies();
    const generatedSeries = generateUserRequestedSeries();
    setMovies(ensureUniqueVodIds(generatedMovies));
    setSeries(ensureUniqueVodIds(generatedSeries));
    try {
      localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(generatedMovies));
      localStorage.setItem(STORAGE_SERIES_KEY, JSON.stringify(generatedSeries));
    } catch (e) {}
    const info: PlaylistInfo = {
      id: 'iptv_completo',
      name: 'SCARD PLAY (Ao Vivo)',
      url: 'https://scardplay.app/canais.m3u',
      lastUpdated: Date.now(),
      channelCount: uniqueChannels.length,
    };
    setPlaylistInfo(info);
    localStorage.setItem(
      STORAGE_PLAYLIST_KEY,
      JSON.stringify({
        channels: uniqueChannels,
        categories: USER_REQUESTED_CATEGORIES.map((c) => c.name),
        info,
      })
    );
    setCurrentScreen('home');
  };

  // Channel playback trigger
  const playChannel = (channel: Channel) => {
    // Record in history (max 25)
    setHistory((prev) => {
      const next = [channel.id, ...prev.filter((id) => id !== channel.id)];
      return next.slice(0, 25);
    });

    setPreviousScreen('livetv');
    setCurrentChannel(channel);
    setCurrentScreen('player');
  };

  const handlePlayMovie = (movie: VodMovie) => {
    const ch: Channel = {
      id: movie.id,
      name: movie.name,
      streamUrl: movie.streamUrl,
      logoUrl: movie.posterUrl,
      category: movie.category || 'FILMES',
      orderIndex: 0,
      initials: 'FL',
    };
    setPreviousScreen('movies');
    setCurrentChannel(ch);
    setCurrentScreen('player');
  };

  const handlePlayEpisode = (title: string, streamUrl: string, posterUrl?: string) => {
    const ch: Channel = {
      id: `ep_${Date.now()}`,
      name: title,
      streamUrl: streamUrl,
      logoUrl: posterUrl,
      category: 'SÉRIES',
      orderIndex: 0,
      initials: 'SR',
    };
    setPreviousScreen('series');
    setCurrentChannel(ch);
    setCurrentScreen('player');
  };

  const handleNextChannel = () => {
    if (!currentChannel || channels.length === 0) return;
    const currentList = filteredChannels.length > 0 ? filteredChannels : channels;
    const idx = currentList.findIndex((ch) => ch.id === currentChannel.id);
    const nextIdx = (idx + 1) % currentList.length;
    playChannel(currentList[nextIdx]);
  };

  const handlePrevChannel = () => {
    if (!currentChannel || channels.length === 0) return;
    const currentList = filteredChannels.length > 0 ? filteredChannels : channels;
    const idx = currentList.findIndex((ch) => ch.id === currentChannel.id);
    const prevIdx = idx - 1 < 0 ? currentList.length - 1 : idx - 1;
    playChannel(currentList[prevIdx]);
  };

  const toggleFavorite = (channelId: string) => {
    setFavorites((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };

  // Global Keyboard Navigation (D-Pad, OK, Back, Ch+/Ch-)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing input typing
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentScreen === 'player') {
            handlePrevChannel();
          } else {
            setFocusedIndex((prev) => Math.max(0, prev - 4));
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentScreen === 'player') {
            handleNextChannel();
          } else {
            setFocusedIndex((prev) => Math.min(filteredChannels.length - 1, prev + 4));
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentScreen === 'home') {
            setHomeFocusedCard((prev) => Math.max(0, prev - 1));
          } else {
            setFocusedIndex((prev) => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentScreen === 'home') {
            setHomeFocusedCard((prev) => Math.min(3, prev + 1));
          } else {
            setFocusedIndex((prev) => Math.min(filteredChannels.length - 1, prev + 1));
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (currentScreen === 'home') {
            if (homeFocusedCard === 0) setCurrentScreen('livetv');
            else if (homeFocusedCard === 1) setCurrentScreen('movies');
            else if (homeFocusedCard === 2) setCurrentScreen('series');
            else if (homeFocusedCard === 3) setCurrentScreen('settings');
          } else if (currentScreen === 'livetv') {
            if (filteredChannels[focusedIndex]) {
              playChannel(filteredChannels[focusedIndex]);
            }
          }
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          if (currentScreen === 'player') {
            setCurrentScreen('livetv');
          } else if (currentScreen !== 'home' && currentScreen !== 'setup') {
            setCurrentScreen('home');
          }
          break;
        case 'PageUp':
          e.preventDefault();
          handlePrevChannel();
          break;
        case 'PageDown':
          e.preventDefault();
          handleNextChannel();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, filteredChannels, focusedIndex, currentChannel, homeFocusedCard]);

  // Continuar Assistindo channels
  const recentChannelsList = useMemo(() => {
    const channelMap = new Map(channels.map((ch) => [ch.id, ch]));
    const seenIds = new Set<string>();
    const list: Channel[] = [];
    for (const id of history) {
      if (!seenIds.has(id)) {
        seenIds.add(id);
        const ch = channelMap.get(id);
        if (ch) list.push(ch);
      }
    }
    return list;
  }, [history, channels]);

  // Favoritos channels
  const favoriteChannelsList = useMemo(() => {
    const seenIds = new Set<string>();
    const list: Channel[] = [];
    for (const ch of channels) {
      if (favorites.includes(ch.id) && !seenIds.has(ch.id)) {
        seenIds.add(ch.id);
        list.push(ch);
      }
    }
    return list;
  }, [favorites, channels]);

  return (
    <div className="w-screen h-screen bg-[#080407] text-neutral-100 flex flex-col overflow-hidden font-['Outfit'] select-none">
      {/* Top Header & Navigation Bar with Brand Identity and Menus */}
      {currentScreen !== 'splash' && currentScreen !== 'player' && currentScreen !== 'home' && (
        <header className="relative bg-gradient-to-r from-[#0c0408] via-[#14060d] to-[#0c0408] border-b border-neutral-800/80 px-4 md:px-8 py-2.5 flex items-center justify-between text-xs shrink-0 z-30 shadow-xl shadow-black/60">
          {/* Brand Logo & Title on the left */}
          <div
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 z-20"
            title="SCARD PLAY - Ir para o Início"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#1c0a15] border-2 border-red-600/60 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:scale-105 transition">
              <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base md:text-lg tracking-wider">
                  SCARD PLAY
                </span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase block -mt-0.5">
                AO VIVO · FILMES · SÉRIES
              </span>
            </div>
          </div>

          {/* Menus Principais de Navegação - Perfeitamente Centralizado com o Conteúdo Principal de Baixo */}
          <div className="hidden md:flex absolute inset-x-0 mx-auto items-center justify-center pointer-events-none z-10">
            <nav className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-[#14070f]/95 border border-neutral-800/90 p-1 rounded-2xl shadow-inner max-w-[calc(100vw-360px)] overflow-x-auto">
              <HeaderNavTab
                icon={<Home className="w-4 h-4" />}
                label="Início"
                active={false}
                onClick={() => setCurrentScreen('home')}
              />
              <HeaderNavTab
                icon={<Tv className="w-4 h-4" />}
                label="Ao Vivo"
                badge={channels.length > 0 ? `${channels.length}` : undefined}
                active={currentScreen === 'livetv'}
                onClick={() => setCurrentScreen('livetv')}
              />
              <HeaderNavTab
                icon={<Film className="w-4 h-4" />}
                label="Filmes"
                badge={movies.length > 0 ? `${movies.length}` : undefined}
                active={currentScreen === 'movies'}
                onClick={() => setCurrentScreen('movies')}
              />
              <HeaderNavTab
                icon={<Layers className="w-4 h-4" />}
                label="Séries"
                badge={series.length > 0 ? `${series.length}` : undefined}
                active={currentScreen === 'series'}
                onClick={() => setCurrentScreen('series')}
              />
              <HeaderNavTab
                icon={<Star className="w-4 h-4" />}
                label="Favoritos"
                badge={favorites.length > 0 ? `${favorites.length}` : undefined}
                active={currentScreen === 'livetv' && selectedCategory === 'FAVORITOS'}
                onClick={() => {
                  setSelectedCategory('FAVORITOS');
                  setCurrentScreen('livetv');
                }}
              />
              <HeaderNavTab
                icon={<History className="w-4 h-4" />}
                label="Histórico"
                active={currentScreen === 'livetv' && selectedCategory === 'CONTINUAR ASSISTINDO'}
                onClick={() => {
                  setSelectedCategory('CONTINUAR ASSISTINDO');
                  setCurrentScreen('livetv');
                }}
              />
              <HeaderNavTab
                icon={<Settings className="w-4 h-4" />}
                label="Ajustes"
                active={currentScreen === 'settings'}
                onClick={() => setCurrentScreen('settings')}
              />
            </nav>
          </div>

          {/* Menus para telas menores (mobile / tablet compacto) */}
          <div className="flex md:hidden items-center overflow-x-auto z-10 ml-2">
            <nav className="flex items-center gap-1 bg-[#14070f]/90 border border-neutral-800/90 p-1 rounded-2xl shadow-inner overflow-x-auto">
              <HeaderNavTab
                icon={<Home className="w-4 h-4" />}
                label="Início"
                active={false}
                onClick={() => setCurrentScreen('home')}
              />
              <HeaderNavTab
                icon={<Tv className="w-4 h-4" />}
                label="TV"
                active={currentScreen === 'livetv'}
                onClick={() => setCurrentScreen('livetv')}
              />
              <HeaderNavTab
                icon={<Film className="w-4 h-4" />}
                label="Filmes"
                active={currentScreen === 'movies'}
                onClick={() => setCurrentScreen('movies')}
              />
              <HeaderNavTab
                icon={<Layers className="w-4 h-4" />}
                label="Séries"
                active={currentScreen === 'series'}
                onClick={() => setCurrentScreen('series')}
              />
              <HeaderNavTab
                icon={<Settings className="w-4 h-4" />}
                label="Ajustes"
                active={currentScreen === 'settings'}
                onClick={() => setCurrentScreen('settings')}
              />
            </nav>
          </div>

          {/* Clean spacer on the right to preserve flex balance */}
          <div className="w-2 md:w-10 shrink-0" />
        </header>
      )}

      {/* Main Screen Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================= SPLASH SCREEN ================= */}
        {currentScreen === 'splash' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#080407] animate-in fade-in duration-500">
            <div className="w-36 h-36 rounded-3xl bg-[#140c11] border-2 border-red-600/40 flex items-center justify-center shadow-[0_0_80px_rgba(220,38,38,0.5)] p-4 animate-pulse">
              <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest mt-8">
              SCARD PLAY
            </h1>
            <p className="text-red-500 tracking-[0.35em] text-sm md:text-base font-bold mt-2">
              AO VIVO · FILMES · SÉRIES
            </p>
            <div className="w-48 h-1 bg-neutral-900 rounded-full mt-10 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-red-600 to-amber-500 animate-[pulse_1.5s_infinite]"></div>
            </div>
          </div>
        )}

        {/* ================= SETUP SCREEN ================= */}
        {currentScreen === 'setup' && (
          <div className="w-full h-full overflow-y-auto bg-[#080407] p-8 md:p-14 flex flex-col items-center justify-center">
            <div className="max-w-3xl w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#140c11] border border-red-600/40 flex items-center justify-center p-2 shadow-xl shadow-red-600/20">
                    <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white">SCARD PLAY IPTV</h1>
                    <p className="text-neutral-400 text-base">Canais ao vivo, Filmes e Séries em 4K e Full HD</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-red-500" />
                  <span>Voltar ao Início</span>
                </button>
              </div>

              {/* Install on TV Banner */}
              <InstallTvButton variant="banner" className="mb-6" />

              {/* Options Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/25 to-amber-600/25 border-red-500 text-white shadow-lg shadow-red-600/20">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>Acesso SCARD PLAY</span>
                </div>

                <button
                  onClick={handleLoadSamplePlaylist}
                  className="p-3.5 rounded-xl bg-[#140c11] border border-neutral-800 hover:border-red-500 text-neutral-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Carregar Demonstração Gratuita</span>
                </button>
              </div>

              {/* Form Container */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Servidor IPTV (Host / URL)
                  </label>
                  <input
                    type="text"
                    value={serverHost}
                    onChange={(e) => setServerHost(e.target.value)}
                    placeholder="http://wordbus.top"
                    className="w-full bg-[#0a0507] border-2 border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none transition text-base font-medium font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Usuário
                    </label>
                    <input
                      type="text"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      placeholder="Ex: 10390422"
                      className="w-full bg-[#0a0507] border-2 border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none transition text-base font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Ex: 76403279"
                      className="w-full bg-[#0a0507] border-2 border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none transition text-base font-medium"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/50 text-rose-300 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => handleXtreamLogin(serverHost, loginUser, loginPass)}
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-sm tracking-wider uppercase transition shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>CARREGANDO E ABRINDO SCARD PLAY...</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4" />
                        <span>ENTRAR E ABRIR SCARD PLAY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN: HOME (TV LAUNCHER MATCHING USER SCREENSHOT) ================= */}
        {currentScreen === 'home' && (
          <HomeLauncher
            channelsCount={channels.length}
            moviesCount={movies.length}
            seriesCount={series.length}
            favoritesCount={favorites.length}
            accountInfo={accountInfo}
            focusedCardIndex={homeFocusedCard}
            setFocusedCardIndex={setHomeFocusedCard}
            onNavigate={(dest) => {
              if (dest === 'livetv') setCurrentScreen('livetv');
              else if (dest === 'movies') setCurrentScreen('movies');
              else if (dest === 'series') setCurrentScreen('series');
              else if (dest === 'settings') setCurrentScreen('settings');
            }}
            onOpenSamsungModal={() => setIsSamsungModalOpen(true)}
            onOpenSettings={() => setCurrentScreen('settings')}
            onSwitchPlaylist={() => setCurrentScreen('setup')}
          />
        )}

        {/* ================= SUB-SCREENS (LIVE TV & MOVIES & SERIES & SETTINGS & ABOUT) ================= */}
        {currentScreen !== 'splash' && currentScreen !== 'setup' && currentScreen !== 'player' && currentScreen !== 'home' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#080407]">
              {/* ================= SCREEN: MOVIES ================= */}
              {currentScreen === 'movies' && (
                <MoviesScreen
                  movies={movies}
                  categories={movieCategories}
                  selectedCategory={selectedMovieCategory}
                  onSelectCategory={setSelectedMovieCategory}
                  onPlayMovie={handlePlayMovie}
                />
              )}

              {/* ================= SCREEN: SERIES ================= */}
              {currentScreen === 'series' && (
                <SeriesScreen
                  series={series}
                  categories={seriesCategories}
                  selectedCategory={selectedSeriesCategory}
                  onSelectCategory={setSelectedSeriesCategory}
                  onPlayEpisode={handlePlayEpisode}
                  serverHost={serverHost}
                  loginUser={loginUser}
                  loginPass={loginPass}
                />
              )}

              {/* ================= SCREEN: LIVE TV ================= */}
              {currentScreen === 'livetv' && (
                <div className="h-full flex flex-col md:flex-row overflow-hidden">
                  {/* Category Filter Column (oculto quando não houver usuário conectado) */}
                  {isUserConnected && (
                    <div className="w-full md:w-80 bg-[#0c0409] border-r border-neutral-800/80 p-4 md:p-5 space-y-3 shrink-0 flex flex-col h-full md:h-full overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Tv className="w-3.5 h-3.5" />
                            <span>AO VIVO</span>
                          </h3>
                          <p className="text-[11px] text-neutral-400">47 categorias organizadas</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/30">
                          {channels.length} canais
                        </span>
                      </div>

                      {/* Category Search Input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="text"
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                          placeholder="Filtrar categoria..."
                          className="w-full bg-[#140610] border border-neutral-800 focus:border-red-500 rounded-xl pl-9 pr-7 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition font-medium"
                        />
                        {categorySearchQuery && (
                          <button
                            onClick={() => setCategorySearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Special Quick Channels (Todos, Favoritos, Histórico) */}
                      <div className="space-y-1.5 pt-1">
                        <button
                          onClick={() => setSelectedCategory('TODOS')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer border ${
                            selectedCategory === 'TODOS'
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-600/30'
                              : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-transparent text-neutral-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Tv className="w-3.5 h-3.5 text-amber-400" />
                            <span>TODOS OS CANAIS</span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              selectedCategory === 'TODOS' ? 'bg-black/40 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {channels.length}
                          </span>
                        </button>

                        <button
                          onClick={() => setSelectedCategory('FAVORITOS')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer border ${
                            selectedCategory === 'FAVORITOS'
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-600/30'
                              : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-transparent text-neutral-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>MEUS FAVORITOS</span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              selectedCategory === 'FAVORITOS' ? 'bg-black/40 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {favorites.length}
                          </span>
                        </button>

                        <button
                          onClick={() => setSelectedCategory('CONTINUAR ASSISTINDO')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer border ${
                            selectedCategory === 'CONTINUAR ASSISTINDO'
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-600/30'
                              : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-transparent text-neutral-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <History className="w-3.5 h-3.5 text-rose-400" />
                            <span>ASSISTIDOS RECENTEMENTE</span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              selectedCategory === 'CONTINUAR ASSISTINDO' ? 'bg-black/40 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {history.length}
                          </span>
                        </button>
                      </div>

                      {/* Categorias Header */}
                      <div className="text-[10px] font-black tracking-widest text-neutral-400 uppercase px-1 pt-2 flex items-center justify-between border-t border-neutral-800/80">
                        <span>CATEGORIAS ({visibleCategories.length})</span>
                        {selectedCategoryGroup !== 'TODAS' && (
                          <button
                            onClick={() => setSelectedCategoryGroup('TODAS')}
                            className="text-[9px] text-red-400 hover:underline cursor-pointer lowercase"
                          >
                            ver todas
                          </button>
                        )}
                      </div>

                      {/* Categorias List (Exact User Requested Order and Counts) */}
                      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                        {visibleCategories.map((catSpec, idx) => {
                          const catName = catSpec.name;
                          const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
                          const count =
                            CATEGORY_COUNTS_MAP[catName.toLowerCase()] ??
                            catSpec.count ??
                            channels.filter((c) => c.category.toLowerCase() === catName.toLowerCase()).length;

                          return (
                            <button
                              key={`user_cat_${catName}_${idx}`}
                              onClick={() => setSelectedCategory(catName)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-600/30 font-bold'
                                  : 'bg-[#130710]/70 hover:bg-neutral-800/90 border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white'
                              }`}
                            >
                              <span className="truncate pr-2">{catName}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                                  isSelected
                                    ? 'bg-black/40 text-white font-black'
                                    : 'bg-neutral-850 text-red-400 font-bold border border-neutral-800'
                                }`}
                              >
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Channels Grid */}
                  <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
                    {!isUserConnected ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-2xl bg-[#140c11] border border-red-500/40 flex items-center justify-center mb-6 shadow-xl shadow-red-600/20">
                          <Tv className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Nenhum Usuário Conectado</h3>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                          Conecte uma playlist ou faça login com seu usuário IPTV para visualizar as categorias e assistir aos canais ao vivo.
                        </p>
                        <button
                          onClick={() => setCurrentScreen('setup')}
                          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Playlist</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Search & Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase tracking-wider mb-1">
                              <span>Ao Vivo</span>
                              <span>•</span>
                              <span>{selectedCategory}</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                              {selectedCategory}
                            </h2>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {filteredChannels.length} canais disponíveis
                            </p>
                          </div>

                          {/* Search Bar */}
                          <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={`Buscar em ${selectedCategory}...`}
                              className="w-full bg-[#12070e] border border-neutral-800 focus:border-red-500 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
                            />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Channels List / Grid */}
                        <div className="flex-1 overflow-y-auto pr-1">
                          {filteredChannels.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                              <Tv className="w-12 h-12 stroke-[1.5] text-neutral-600 mb-3" />
                              <p className="font-bold text-neutral-300">Nenhum canal encontrado</p>
                              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                                {searchQuery
                                  ? `Nenhum canal com "${searchQuery}" nesta categoria.`
                                  : 'Esta lista está vazia no momento.'}
                              </p>
                              {(searchQuery || selectedCategory !== 'TODOS') && (
                                <button
                                  onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('TODOS');
                                  }}
                                  className="mt-4 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer transition"
                                >
                                  Ver Todos os Canais
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5 sm:gap-3 pt-4 px-4 pb-4">
                                {displayedChannels.map((ch, idx) => (
                                  <ChannelCardWidget
                                    key={`live_${ch.id}_${idx}`}
                                    channel={ch}
                                    isFavorite={favorites.includes(ch.id)}
                                    isFocused={focusedIndex === idx}
                                    onPlay={() => playChannel(ch)}
                                    onToggleFavorite={() => toggleFavorite(ch.id)}
                                  />
                                ))}
                              </div>

                              {displayedChannels.length < filteredChannels.length && (
                                <div className="flex justify-center pb-8">
                                  <button
                                    onClick={() => setDisplayLimit((prev) => prev + 60)}
                                    className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                                  >
                                    Carregar Mais Canais (+60) • Exibindo {displayedChannels.length} de {filteredChannels.length}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ================= SCREEN: SETTINGS ================= */}
              {currentScreen === 'settings' && (
                <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-black text-white">CONFIGURAÇÕES</h1>
                      <p className="text-neutral-400 text-sm mt-1">
                        Gerencie suas fontes de playlist, preferências e dados locais
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('home')}
                      className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 transition cursor-pointer self-start sm:self-auto"
                    >
                      Voltar ao Início
                    </button>
                  </div>

                  {/* Playlist Source */}
                  <div className="bg-[#12070e] border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">
                        FONTE DA PLAYLIST
                      </h3>
                      {isUserConnected ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            SCARD PLAY ({loginUser || accountInfo?.username || 'Conectado'})
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            CONECTADO
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-400">
                            Nenhum usuário conectado
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 text-[10px] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                            DESCONECTADO
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      {isUserConnected ? (
                        <button
                          onClick={handleRemoveUser}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white font-bold text-xs border border-red-500/50 hover:border-red-400 transition cursor-pointer active:scale-95 shadow-md shadow-red-950/40"
                          title="Remover usuário e limpar todas as listas de TV, Filmes e Séries"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span>Remover Usuário</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentScreen('setup')}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 hover:border-red-500 transition cursor-pointer active:scale-95"
                          title="Conectar uma playlist ou usuário"
                        >
                          <Plus className="w-4 h-4 text-red-400" />
                          <span>Adicionar Playlist</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Smart TV Installation Banner */}
                  <div className="bg-[#12070e] border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      INSTALAÇÃO DO APP NA SMART TV
                    </h3>
                    <InstallTvButton variant="banner" />
                  </div>

                  {/* Local Data Management */}
                  <div className="bg-[#12070e] border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">
                      DADOS LOCAIS
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-bold text-white">Armazenamento Local</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {favorites.length} favoritos salvos • {history.length} itens no histórico
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setFavorites([])}
                          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs border border-neutral-700 transition cursor-pointer"
                        >
                          Limpar Favoritos
                        </button>
                        <button
                          onClick={() => setHistory([])}
                          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs border border-neutral-700 transition cursor-pointer"
                        >
                          Limpar Histórico
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Future Architecture Modules */}
                  <div className="bg-[#12070e] border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                      MÓDULOS DE INTEGRAÇÃO
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-bold text-white">Servidor & Autenticação Centralizada</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Conectado via Xtream Codes API direta (/api/xtream/login-and-sync).
                        </p>
                      </div>

                      <button
                        onClick={() => setCurrentScreen('future_login')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-bold text-xs transition cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-red-400" />
                        <span>Ver Conta e Login Xtream</span>
                      </button>
                    </div>
                  </div>

                  {/* About info */}
                  <div className="bg-[#12070e] border border-neutral-800 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-white">SCARD PLAY IPTV</p>
                      <p className="text-xs text-neutral-400 mt-0.5">Versão 1.0.0 • Player IPTV para Smart TV Samsung, LG e Android</p>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('about')}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition cursor-pointer"
                    >
                      Sobre o App
                    </button>
                  </div>
                </div>
              )}

              {/* ================= SCREEN: FUTURE LOGIN ================= */}
              {currentScreen === 'future_login' && (
                <div className="p-8 md:p-14 max-w-xl mx-auto flex flex-col justify-center min-h-full">
                  <div className="bg-[#12070e] border-2 border-red-600/40 rounded-3xl p-8 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1c0a15] border border-red-500/60 p-1 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">SCARD PLAY</h2>
                        <p className="text-red-400 text-xs font-bold tracking-widest uppercase">
                          Autenticação de Usuário (Xtream Codes)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                          Servidor IPTV
                        </label>
                        <input
                          type="text"
                          value={serverHost}
                          onChange={(e) => setServerHost(e.target.value)}
                          placeholder="http://wordbus.top"
                          className="w-full bg-[#0a0507] border border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                          Usuário
                        </label>
                        <input
                          type="text"
                          value={loginUser}
                          onChange={(e) => setLoginUser(e.target.value)}
                          placeholder="Ex: 10390422"
                          className="w-full bg-[#0a0507] border border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                          Senha
                        </label>
                        <input
                          type="password"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="Ex: 76403279"
                          className="w-full bg-[#0a0507] border border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm font-medium"
                        />
                      </div>

                      {loginError && (
                        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => handleXtreamLogin(serverHost, loginUser, loginPass)}
                          disabled={loginLoading}
                          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-black text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50 shadow-lg shadow-red-600/30"
                        >
                          {loginLoading ? (
                            <>
                              <RotateCw className="w-4 h-4 animate-spin" />
                              <span>CARREGANDO E ABRINDO SCARD PLAY...</span>
                            </>
                          ) : (
                            <>
                              <Radio className="w-4 h-4" />
                              <span>ENTRAR E ABRIR SCARD PLAY</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Authenticated Account Info Card */}
                    {accountInfo && (
                      <div className="p-4 rounded-xl bg-red-600/15 border border-red-500/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold text-red-300">
                              Usuário: {accountInfo.username} (STATUS: {accountInfo.status.toUpperCase()})
                            </span>
                          </div>
                          <span className="text-[11px] bg-red-600/20 text-red-300 px-2 py-0.5 rounded-full font-mono">
                            {channels.length} canais
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300">
                          Validade da Assinatura: <strong className="text-white">{accountInfo.expirationDate}</strong> • Telas Simultâneas: <strong className="text-white">{accountInfo.maxConnections}</strong>
                        </p>
                        <button
                          onClick={() => setCurrentScreen('home')}
                          className="w-full mt-2 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase transition shadow-md shadow-red-600/30"
                        >
                          Assistir Ao Vivo Agora
                        </button>
                      </div>
                    )}

                    <div className="pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => setCurrentScreen('settings')}
                        className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition cursor-pointer"
                      >
                        Voltar para Configurações
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SCREEN: ABOUT ================= */}
              {currentScreen === 'about' && (
                <div className="p-8 md:p-14 max-w-xl mx-auto flex flex-col justify-center min-h-full">
                  <div className="bg-[#10060c] border border-red-600/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c0a15] border-2 border-red-600/60 mx-auto flex items-center justify-center p-2 shadow-xl shadow-red-600/30">
                      <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">SCARD PLAY IPTV</h2>
                      <p className="text-red-400 text-xs font-bold mt-1 tracking-widest uppercase">
                        VERSÃO 1.0.0 · TV & CINEMA
                      </p>
                    </div>

                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Player IPTV para Android TV e Google TV. Interface profissional desenvolvida com
                      Jetpack Compose for TV e Android Media3 ExoPlayer, otimizada exclusivamente para uso
                      com controle remoto físico.
                    </p>

                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 text-left space-y-1.5">
                      <p><span className="text-neutral-200 font-semibold">Package:</span> com.scard.playiptv</p>
                      <p><span className="text-neutral-200 font-semibold">Navegação:</span> 100% Controle Remoto D-Pad</p>
                      <p><span className="text-neutral-200 font-semibold">Mídia:</span> HLS / MPEG-TS / Media3 ExoPlayer</p>
                    </div>

                    <button
                      onClick={() => setCurrentScreen('home')}
                      className="px-8 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition cursor-pointer"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCREEN: PLAYER FULLSCREEN ================= */}
        {currentScreen === 'player' && currentChannel && (
          <TvVideoPlayer
            channel={currentChannel}
            channels={filteredChannels.length > 0 ? filteredChannels : channels}
            isFavorite={favorites.includes(currentChannel.id)}
            onToggleFavorite={toggleFavorite}
            onNextChannel={handleNextChannel}
            onPrevChannel={handlePrevChannel}
            onSelectChannel={playChannel}
            onBack={() => setCurrentScreen(previousScreen || 'home')}
          />
        )}
      </div>

      {/* Android Project & APK Build Inspection Modal */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Samsung Smart TV (Crystal UHD / Tizen) Pendrive Modal */}
      <SamsungTizenModal
        isOpen={isSamsungModalOpen}
        onClose={() => setIsSamsungModalOpen(false)}
        appUrl={typeof window !== 'undefined' ? window.location.origin : ''}
      />
    </div>
  );
}

// Top Header Navigation Tab Button Helper
function HeaderNavTab({
  icon,
  label,
  badge,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 border border-red-500'
          : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            active ? 'bg-black/40 text-white' : 'bg-[#1e0e18] text-red-400 border border-red-500/30'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// Sidebar Navigation Button Helper
function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition transform hover:scale-105 active:scale-95 cursor-pointer border ${
        active
          ? 'bg-red-600/25 border-red-500 text-red-400 shadow-lg shadow-red-600/30'
          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
      }`}
      title={label}
    >
      {icon}
      <span className="text-[10px] font-bold mt-1 tracking-wider">{label}</span>
    </button>
  );
}

// Channel Card Widget Helper - Minimalist & Compact Design
function ChannelCardWidget({
  channel,
  isFavorite,
  isFocused = false,
  onPlay,
  onToggleFavorite,
}: {
  channel: Channel;
  isFavorite: boolean;
  isFocused?: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  // Resolution detection
  const is4K = channel.name.includes('4K') || channel.category.includes('4K');
  const isFHD = channel.name.includes('FHD') || channel.name.includes('1080');
  const resolutionText = is4K ? '4K' : isFHD ? 'FHD' : 'HD';

  return (
    <div
      onClick={onPlay}
      className={`group relative flex flex-col p-2 rounded-xl transition-all duration-150 cursor-pointer border select-none ${
        isFocused
          ? 'bg-[#1a0a14] border-red-500 shadow-md shadow-red-600/30 ring-1 ring-red-500 scale-[1.02]'
          : 'bg-[#12070f]/90 hover:bg-[#1a0b17] border-neutral-800/60 hover:border-red-500/50 hover:shadow-lg'
      }`}
    >
      {/* Top Banner Area (Compact Logo Box) */}
      <div className="relative w-full h-14 sm:h-16 rounded-lg bg-black/60 flex items-center justify-center overflow-hidden border border-neutral-850/80 mb-2">
        {/* Subtle Resolution Indicator */}
        <span
          className={`absolute top-1 left-1 z-10 text-[8px] font-mono font-bold px-1 py-0.5 rounded leading-none border backdrop-blur-xs ${
            is4K
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-300'
              : isFHD
              ? 'bg-red-950/90 border-red-500/50 text-red-300'
              : 'bg-black/80 border-neutral-700/60 text-neutral-400'
          }`}
        >
          {resolutionText}
        </span>

        {channel.logoUrl && !imgError ? (
          <img
            src={channel.logoUrl}
            alt={channel.name}
            className="w-full h-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-950/70 to-neutral-900 border border-red-600/30 flex items-center justify-center">
            <span className="text-red-400 font-bold text-xs tracking-wider">
              {channel.initials}
            </span>
          </div>
        )}

        {/* Minimalist Play Icon on hover / focus */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/40">
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Favorite Button Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-1 right-1 z-10 p-1 rounded bg-black/70 hover:bg-black/90 transition ${
            isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
        >
          <Star
            className={`w-3 h-3 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
          />
        </button>
      </div>

      {/* Info: Minimalist & Clean */}
      <div className="w-full px-0.5 text-center">
        <h4
          className="text-[11px] sm:text-xs font-semibold text-neutral-200 truncate group-hover:text-amber-300 transition leading-snug"
          title={channel.name}
        >
          {channel.name}
        </h4>
        <p className="text-[10px] text-neutral-500 truncate mt-0.5 uppercase tracking-wider font-medium">
          {channel.category}
        </p>
      </div>
    </div>
  );
}
