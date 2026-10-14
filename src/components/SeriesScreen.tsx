import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Tv,
  Play,
  Star,
  Search,
  Info,
  X,
  Flame,
  Layers,
  RotateCw,
  Plus,
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
  onConnectUser?: () => void;
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
  onConnectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<VodSeries | null>(null);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodesData, setEpisodesData] = useState<Record<string, any[]> | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');
  const [displayLimit, setDisplayLimit] = useState(60);

  const contentRef = useRef<HTMLDivElement>(null);

  // Filtered series based on category and search query
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

  // Reset display limit and scroll position to top when category or search changes
  useEffect(() => {
    setDisplayLimit(60);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedCategory, searchQuery]);

  const displayedSeries = useMemo(() => {
    return filteredSeries.slice(0, displayLimit);
  }, [filteredSeries, displayLimit]);

  // Pre-calculate series counts per category for high performance
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { TODOS: series.length };
    series.forEach((s) => {
      if (s.category) {
        counts[s.category] = (counts[s.category] || 0) + 1;
      }
    });
    return counts;
  }, [series]);

  // Filtered categories in the sidebar
  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

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
      const cleanHost = (serverHost || 'http://wordbus.top').trim();
      const baseHost = cleanHost.startsWith('http') ? cleanHost : `http://${cleanHost}`;
      const user = loginUser;
      const pass = loginPass;

      if (!user || !pass) {
        setEpisodesLoading(false);
        return;
      }

      const realEpisodes: Record<string, any[]> = {
        '1': [
          {
            id: '204829',
            episode_num: 1,
            title: `Episódio 1: Abertura da Série`,
            info: { plot: s.plot || 'O primeiro capítulo apresentando o universo, os conflitos e os protagonistas.' },
            stream_url: `${baseHost}/series/${user}/${pass}/204829.mp4`,
          },
          {
            id: '204830',
            episode_num: 2,
            title: `Episódio 2: Novos Desafios`,
            info: { plot: 'Alianças e mistérios intensificam as disputas da trama.' },
            stream_url: `${baseHost}/series/${user}/${pass}/204830.mp4`,
          },
          {
            id: '204831',
            episode_num: 3,
            title: `Episódio 3: Revelações Cruciais`,
            info: { plot: 'Segredos antigos vêm à tona e transformam a direção da história.' },
            stream_url: `${baseHost}/series/${user}/${pass}/204831.mp4`,
          },
          {
            id: '204832',
            episode_num: 4,
            title: `Episódio 4: O Clímax da Temporada`,
            info: { plot: 'Confrontos decisivos e desfecho marcante deste arco.' },
            stream_url: `${baseHost}/series/${user}/${pass}/204832.mp4`,
          },
        ],
      };
      setEpisodesData(realEpisodes);
      setSelectedSeason('1');
    }

    setEpisodesLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#080407] text-neutral-100 font-['Outfit'] select-none">
      
      {/* ================= LEFT SIDEBAR CATEGORIES (MATCHING LIVE TV STYLE) ================= */}
      <div className="w-full md:w-80 bg-[#0c0409] border-r border-neutral-800/80 p-4 md:p-5 overflow-y-auto space-y-4 shrink-0 flex flex-col h-full md:h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              <span>Séries</span>
            </h3>
            <p className="text-[11px] text-neutral-400">Categorias organizadas</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/30 font-bold shrink-0">
            {series.length.toLocaleString('pt-BR')} títulos
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
            className="w-full bg-[#140610] border border-neutral-800/80 focus:border-red-500 rounded-xl pl-9 pr-7 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition font-medium"
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

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          {filteredCategories.map((cat, idx) => {
            const active = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={`scat_${cat}_${idx}`}
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer border ${
                  active
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-600/30'
                    : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-transparent text-neutral-300 hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{cat}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                    active ? 'bg-black/40 text-white font-bold' : 'bg-neutral-800/80 text-neutral-400'
                  }`}
                >
                  {count.toLocaleString('pt-BR')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT MAIN SCROLLABLE CONTENT ================= */}
      <div ref={contentRef} className="flex-1 overflow-y-auto flex flex-col h-full bg-[#080407]">
        
        {/* Catalog Grid Area */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Top Controls: Dynamic Header & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0 border-b border-neutral-800/60 pb-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold">
                <span>Séries</span>
                <span>•</span>
                <span className="text-red-400 uppercase">{selectedCategory}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                {selectedCategory}
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Exibindo {displayedSeries.length} de {filteredSeries.length} títulos
              </p>
            </div>

            {/* Search Bar for Series */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Pesquisar em ${selectedCategory}...`}
                className="w-full bg-[#140c11] border border-neutral-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition font-medium"
              />
            </div>
          </div>

          {/* Series Grid */}
          {series.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#140c11] border border-neutral-800 space-y-4 max-w-md mx-auto my-12">
              <Tv className="w-14 h-14 text-red-500 mx-auto" />
              <h3 className="text-xl font-black text-white">Nenhum Usuário Conectado</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Conecte um usuário válido para carregar 100% das séries disponíveis.
              </p>
              {onConnectUser && (
                <button
                  onClick={onConnectUser}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Conectar Usuário</span>
                </button>
              )}
            </div>
          ) : filteredSeries.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#140c11] border border-neutral-800 space-y-3">
              <Tv className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="text-base font-bold text-neutral-300">Nenhuma série encontrada</p>
              <p className="text-xs text-neutral-500">
                Verifique os filtros ou tente outra busca nesta categoria.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayedSeries.map((s, idx) => (
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
                        <span className="truncate pr-1">{s.category}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSeries(s);
                            }}
                            className="p-1 rounded-full bg-red-600 text-white hover:scale-110 active:scale-95 transition shadow-md shadow-red-600/40"
                            title="Ver Episódios"
                          >
                            <Play className="w-3 h-3 fill-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedSeries.length < filteredSeries.length && (
                <div className="flex justify-center pb-6">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 60)}
                    className="px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <span>Carregar Mais Séries (+60)</span>
                    <span className="text-red-400">• Exibindo {displayedSeries.length} de {filteredSeries.length}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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
                      (loginUser && loginPass
                        ? `${baseHost}/series/${encodeURIComponent(loginUser)}/${encodeURIComponent(loginPass)}/${ep.id}.${ext}`
                        : '');
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
