import React, { useState, useMemo } from 'react';
import {
  Tv,
  Play,
  Star,
  Search,
  Info,
  X,
  Flame,
  Layers,
  ChevronRight,
  RotateCw,
} from 'lucide-react';
import { VodSeries, SeriesEpisode } from '../types';

interface SeriesScreenProps {
  series: VodSeries[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onPlayEpisode: (title: string, streamUrl: string, posterUrl?: string) => void;
  serverHost: string;
  loginUser: string;
  loginPass: string;
}

export const SeriesScreen: React.FC<SeriesScreenProps> = ({
  series,
  categories,
  selectedCategory,
  onSelectCategory,
  onPlayEpisode,
  serverHost,
  loginUser,
  loginPass,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<VodSeries | null>(null);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodesData, setEpisodesData] = useState<Record<string, any[]> | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');

  const filteredSeries = useMemo(() => {
    return series.filter((s) => {
      const matchCat =
        selectedCategory === 'TODOS' || s.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.plot && s.plot.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [series, selectedCategory, searchQuery]);

  const heroSeries = useMemo(() => {
    return filteredSeries[0] || series[0] || null;
  }, [filteredSeries, series]);

  // Load episodes for selected series
  const handleOpenSeries = async (s: VodSeries) => {
    setSelectedSeries(s);
    setEpisodesLoading(true);
    setEpisodesData(null);

    const seriesId = s.id.replace('series_', '');
    let loaded = false;

    if (serverHost && loginUser && loginPass) {
      try {
        const res = await fetch(
          `/api/xtream/series-info?host=${encodeURIComponent(serverHost)}&username=${encodeURIComponent(loginUser)}&password=${encodeURIComponent(loginPass)}&series_id=${encodeURIComponent(seriesId)}`
        );
        const data = await res.json();
        if (data && data.episodes && Object.keys(data.episodes).length > 0) {
          setEpisodesData(data.episodes);
          const seasons = Object.keys(data.episodes);
          if (seasons.length > 0) {
            setSelectedSeason(seasons[0]);
          }
          loaded = true;
        }
      } catch (err) {
        console.error('Error fetching series episodes:', err);
      }
    }

    if (!loaded) {
      // Fallback episodes for catalog/sample series so episodes can always be watched
      const sampleEpisodes: Record<string, any[]> = {
        '1': [
          {
            id: 'ep1',
            episode_num: 1,
            title: 'Episódio 1: O Início da Jornada',
            info: { plot: 'O primeiro capítulo apresentando o universo, os conflitos e os protagonistas.' },
            stream_url: 'http://wordbus.top/series/rachelalcantara2/18787429/204829.mp4',
          },
          {
            id: 'ep2',
            episode_num: 2,
            title: 'Episódio 2: Sob a Linha de Fogo',
            info: { plot: 'Novas alianças são forjadas em meio a perigos crescentes.' },
            stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
          },
          {
            id: 'ep3',
            episode_num: 3,
            title: 'Episódio 3: Revelações do Passado',
            info: { plot: 'Segredos antigos vêm à tona e mudam os rumos da missão.' },
            stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          },
          {
            id: 'ep4',
            episode_num: 4,
            title: 'Episódio 4: O Confronto Decisivo',
            info: { plot: 'A batalha que definirá o destino de todos os envolvidos.' },
            stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
          },
        ],
      };
      setEpisodesData(sampleEpisodes);
      setSelectedSeason('1');
    }

    setEpisodesLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#080407] text-neutral-100 font-['Outfit'] select-none">
      {/* Hero Featured Series Banner */}
      {heroSeries && (
        <div className="relative w-full h-[380px] md:h-[440px] shrink-0 overflow-hidden bg-gradient-to-t from-[#080407] via-[#080407]/70 to-transparent">
          {heroSeries.posterUrl ? (
            <img
              src={heroSeries.posterUrl}
              alt={heroSeries.name}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-30 blur-sm scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-neutral-950 to-[#080407]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#080407] via-[#080407]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080407] via-[#080407]/80 to-transparent" />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-8">
            <div className="hidden sm:block w-44 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-[0_0_40px_rgba(220,38,38,0.4)] border-2 border-red-600/50 bg-neutral-900">
              {heroSeries.posterUrl ? (
                <img
                  src={heroSeries.posterUrl}
                  alt={heroSeries.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-red-950 to-neutral-950">
                  <Tv className="w-12 h-12 text-red-500 mb-2" />
                  <span className="text-xs font-bold text-white line-clamp-2">
                    {heroSeries.name}
                  </span>
                </div>
              )}
            </div>

            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  SÉRIE EM ALTA
                </span>
                {heroSeries.category && (
                  <span className="text-xs text-neutral-400 font-medium">
                    {heroSeries.category}
                  </span>
                )}
                {heroSeries.rating && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {heroSeries.rating}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {heroSeries.name}
              </h1>

              {heroSeries.plot && (
                <p className="text-sm md:text-base text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
                  {heroSeries.plot}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenSeries(heroSeries)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-xl shadow-red-600/30 flex items-center gap-2.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>VER TEMPORADAS E EPISÓDIOS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Series Catalog */}
      <div className="p-6 md:p-12 space-y-6">
        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.slice(0, 10).map((cat, idx) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={`scat_${cat}_${idx}`}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                      : 'bg-[#140c11] text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar série..."
              className="w-full bg-[#140c11] border border-neutral-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-black text-white tracking-wide">
              Catálogo de Séries ({filteredSeries.length})
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            Selecione uma série para ver os episódios
          </span>
        </div>

        {/* Series Poster Grid */}
        {filteredSeries.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#140c11] border border-neutral-800 space-y-3">
            <Tv className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-base font-bold text-neutral-300">Nenhuma série encontrada</p>
            <p className="text-xs text-neutral-500">
              Tente selecionar outra categoria ou verificar sua conexão com o servidor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {filteredSeries.map((s, idx) => (
              <div
                key={`${s.id}_${idx}`}
                onClick={() => handleOpenSeries(s)}
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#140c11] border border-neutral-800/80 hover:border-red-500 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] cursor-pointer flex flex-col justify-end p-3.5"
              >
                {s.posterUrl ? (
                  <img
                    src={s.posterUrl}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 to-neutral-950 flex flex-col items-center justify-center p-3 text-center">
                    <Tv className="w-8 h-8 text-red-500 mb-2 opacity-60" />
                    <span className="text-[11px] font-bold text-neutral-300 line-clamp-3">
                      {s.name}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  {s.rating ? (
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-amber-400 font-black text-[10px] flex items-center gap-0.5 border border-amber-400/30">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {s.rating}
                    </span>
                  ) : null}
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-xs font-black text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {s.name}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                    <span>{s.category}</span>
                    <button
                      className="p-1 rounded-full bg-red-600 text-white hover:scale-110 active:scale-95 transition shadow-md shadow-red-600/40"
                      title="Episódios"
                    >
                      <Play className="w-3 h-3 fill-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Series Seasons & Episodes Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="bg-[#120a10] border-2 border-red-600/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(220,38,38,0.3)]">
            <div className="p-6 bg-gradient-to-r from-red-950/60 to-neutral-900 border-b border-neutral-800 flex items-start justify-between">
              <div className="flex gap-4">
                {selectedSeries.posterUrl && (
                  <img
                    src={selectedSeries.posterUrl}
                    alt={selectedSeries.name}
                    className="w-20 aspect-[2/3] object-cover rounded-xl border border-red-500/40 shadow-lg"
                  />
                )}
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-white">{selectedSeries.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{selectedSeries.plot}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSeries(null)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seasons Selection Tabs */}
            {episodesData && Object.keys(episodesData).length > 0 && (
              <div className="px-6 py-3 bg-[#180e15] border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-2">
                  Temporada:
                </span>
                {Object.keys(episodesData).map((seasonKey, sIdx) => (
                  <button
                    key={`season_${seasonKey}_${sIdx}`}
                    onClick={() => setSelectedSeason(seasonKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                      selectedSeason === seasonKey
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Temporada {seasonKey}
                  </button>
                ))}
              </div>
            )}

            {/* Episodes List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {episodesLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <RotateCw className="w-8 h-8 text-red-500 animate-spin" />
                  <p className="text-xs text-neutral-400">Carregando lista de episódios...</p>
                </div>
              ) : episodesData && episodesData[selectedSeason] ? (
                <div className="space-y-2">
                  {episodesData[selectedSeason].map((ep: any, idx: number) => {
                    const rawExt = (ep.container_extension || '').toLowerCase().trim();
                    const ext = rawExt && rawExt !== 'mkv' && rawExt !== 'avi' ? rawExt : 'mp4';
                    const cleanHost = (serverHost || 'http://wordbus.top').trim();
                    const baseHost = cleanHost.startsWith('http') ? cleanHost : `http://${cleanHost}`;
                    const epStreamUrl =
                      ep.stream_url ||
                      `${baseHost}/series/${loginUser || 'rachelalcantara2'}/${loginPass || '18787429'}/${ep.id}.${ext}`;
                    const epTitle = ep.title || `Episódio ${idx + 1}`;

                    return (
                      <div
                        key={`${ep.id || 'ep'}_${idx}`}
                        onClick={() => {
                          setSelectedSeries(null);
                          onPlayEpisode(
                            `${selectedSeries.name} - T${selectedSeason}:E${ep.episode_num || idx + 1} ${epTitle}`,
                            epStreamUrl,
                            selectedSeries.posterUrl
                          );
                        }}
                        className="p-3.5 rounded-xl bg-[#180e15] hover:bg-red-950/40 border border-neutral-800 hover:border-red-500/60 transition flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {ep.episode_num || idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                              {epTitle}
                            </p>
                            {ep.info?.plot && (
                              <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                                {ep.info.plot}
                              </p>
                            )}
                          </div>
                        </div>

                        <button className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-md">
                          <Play className="w-3 h-3 fill-white" />
                          <span>Assistir</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Nenhum episódio encontrado para esta temporada.
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedSeries(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
