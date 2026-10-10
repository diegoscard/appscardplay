import React, { useState, useMemo } from 'react';
import {
  Film,
  Play,
  Star,
  Search,
  Calendar,
  Clock,
  Info,
  X,
  Sparkles,
  Flame,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { VodMovie } from '../types';

interface MoviesScreenProps {
  movies: VodMovie[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onPlayMovie: (movie: VodMovie) => void;
}

export const MoviesScreen: React.FC<MoviesScreenProps> = ({
  movies,
  categories,
  selectedCategory,
  onSelectCategory,
  onPlayMovie,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<VodMovie | null>(null);
  const [displayLimit, setDisplayLimit] = useState(60);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchCat =
        selectedCategory === 'TODOS' || m.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.plot && m.plot.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [movies, selectedCategory, searchQuery]);

  // Reset display limit when category or search changes
  React.useEffect(() => {
    setDisplayLimit(60);
  }, [selectedCategory, searchQuery]);

  const displayedMovies = useMemo(() => {
    return filteredMovies.slice(0, displayLimit);
  }, [filteredMovies, displayLimit]);

  const heroMovie = useMemo(() => {
    return filteredMovies[0] || movies[0] || null;
  }, [filteredMovies, movies]);

  // Pre-calculate movie counts per category for high performance
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { TODOS: movies.length };
    movies.forEach((m) => {
      if (m.category) {
        counts[m.category] = (counts[m.category] || 0) + 1;
      }
    });
    return counts;
  }, [movies]);

  // Filtered categories in the sidebar
  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#080407] text-neutral-100 font-['Outfit'] select-none">
      
      {/* ================= LEFT SIDEBAR CATEGORIES (MATCHING LIVE TV STYLE) ================= */}
      <div className="w-full md:w-80 bg-[#0c0409] border-r border-neutral-800/80 p-4 md:p-5 overflow-y-auto space-y-4 shrink-0 flex flex-col h-full md:h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>Filmes</span>
            </h3>
            <p className="text-[11px] text-neutral-400">Categorias organizadas</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/30 font-bold shrink-0">
            {movies.length.toLocaleString('pt-BR')} títulos
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
                key={`mcat_${cat}_${idx}`}
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
      <div className="flex-1 overflow-y-auto flex flex-col h-full bg-[#080407]">
        
        {/* Hero Featured Movie Banner */}
        {heroMovie && (
          <div className="relative w-full h-[340px] md:h-[390px] shrink-0 overflow-hidden bg-gradient-to-t from-[#080407] via-[#080407]/70 to-transparent">
            {/* Background backdrop glow */}
            {heroMovie.posterUrl ? (
              <img
                src={heroMovie.posterUrl}
                alt={heroMovie.name}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-30 blur-sm scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-neutral-950 to-[#080407]" />
            )}

            {/* Gradients to blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080407] via-[#080407]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080407] via-[#080407]/80 to-transparent" />

            {/* Hero Content Container */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-8">
              {/* Poster Card */}
              <div className="hidden sm:block w-36 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-[0_0_40px_rgba(220,38,38,0.4)] border-2 border-red-600/50 bg-neutral-900">
                {heroMovie.posterUrl ? (
                  <img
                    src={heroMovie.posterUrl}
                    alt={heroMovie.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-red-950 to-neutral-950">
                    <Film className="w-12 h-12 text-red-500 mb-2" />
                    <span className="text-xs font-bold text-white line-clamp-2">
                      {heroMovie.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Info details */}
              <div className="max-w-2xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    DESTAQUE
                  </span>
                  {heroMovie.category && (
                    <span className="text-xs text-neutral-400 font-medium">
                      {heroMovie.category}
                    </span>
                  )}
                  {heroMovie.year && (
                    <>
                      <span className="text-neutral-600">·</span>
                      <span className="text-xs text-amber-400 font-bold">
                        {heroMovie.year}
                      </span>
                    </>
                  )}
                  {heroMovie.rating && (
                    <>
                      <span className="text-neutral-600">·</span>
                      <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {heroMovie.rating}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  {heroMovie.name}
                </h1>

                {heroMovie.plot && (
                  <p className="text-xs md:text-sm text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
                    {heroMovie.plot}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onPlayMovie(heroMovie)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>ASSISTIR AGORA</span>
                  </button>

                  <button
                    onClick={() => setSelectedMovie(heroMovie)}
                    className="px-4 py-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 font-bold text-xs border border-neutral-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mais Detalhes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Grid Area */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Top Controls: Dynamic Header & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0 border-b border-neutral-800/60 pb-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold">
                <span>Filmes</span>
                <span>•</span>
                <span className="text-red-400 uppercase">{selectedCategory}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                {selectedCategory}
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Exibindo {displayedMovies.length} de {filteredMovies.length} títulos
              </p>
            </div>

            {/* Search Bar for Movies */}
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

          {/* Movies Grid */}
          {filteredMovies.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#140c11] border border-neutral-800 space-y-3">
              <Film className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="text-base font-bold text-neutral-300">Nenhum filme encontrado</p>
              <p className="text-xs text-neutral-500">
                Verifique os filtros ou tente outra busca nesta categoria.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayedMovies.map((movie, idx) => (
                  <div
                    key={`${movie.id}_${idx}`}
                    onClick={() => setSelectedMovie(movie)}
                    className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#140c11] border border-neutral-800/80 hover:border-red-500 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] cursor-pointer flex flex-col justify-end p-3.5"
                  >
                    {/* Poster Image */}
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 to-neutral-950 flex flex-col items-center justify-center p-3 text-center">
                        <Film className="w-8 h-8 text-red-500 mb-2 opacity-60" />
                        <span className="text-[11px] font-bold text-neutral-300 line-clamp-3">
                          {movie.name}
                        </span>
                      </div>
                    )}

                    {/* Dark overlay scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Top Badge: Rating / Year */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                      {movie.rating ? (
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-amber-400 font-black text-[10px] flex items-center gap-0.5 border border-amber-400/30">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {movie.rating}
                        </span>
                      ) : null}
                    </div>

                    {/* Bottom Content */}
                    <div className="relative z-10 space-y-1">
                      <h3 className="text-xs font-black text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {movie.name}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                        <span>{movie.year || movie.category}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayMovie(movie);
                          }}
                          className="p-1 rounded-full bg-red-600 text-white hover:scale-110 active:scale-95 transition shadow-md shadow-red-600/40"
                          title="Assistir"
                        >
                          <Play className="w-3 h-3 fill-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedMovies.length < filteredMovies.length && (
                <div className="flex justify-center pb-6">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 60)}
                    className="px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <span>Carregar Mais Filmes (+60)</span>
                    <span className="text-red-400">• Exibindo {displayedMovies.length} de {filteredMovies.length}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="bg-[#120a10] border-2 border-red-600/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(220,38,38,0.3)]">
            {/* Modal Header / Banner */}
            <div className="relative p-6 bg-gradient-to-r from-red-950/60 to-neutral-900 border-b border-neutral-800 flex items-start justify-between">
              <div className="flex gap-4">
                {selectedMovie.posterUrl && (
                  <img
                    src={selectedMovie.posterUrl}
                    alt={selectedMovie.name}
                    className="w-24 aspect-[2/3] object-cover rounded-xl border border-red-500/40 shadow-lg"
                  />
                )}
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-white">{selectedMovie.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    {selectedMovie.year && (
                      <span className="text-amber-400 font-bold">{selectedMovie.year}</span>
                    )}
                    {selectedMovie.category && (
                      <>
                        <span>·</span>
                        <span>{selectedMovie.category}</span>
                      </>
                    )}
                    {selectedMovie.rating && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {selectedMovie.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMovie(null)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
              {selectedMovie.plot && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Sinopse
                  </h4>
                  <p className="text-neutral-300 leading-relaxed text-sm">
                    {selectedMovie.plot}
                  </p>
                </div>
              )}

              {selectedMovie.cast && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Elenco
                  </h4>
                  <p className="text-neutral-400 text-xs">{selectedMovie.cast}</p>
                </div>
              )}

              {selectedMovie.director && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Direção
                  </h4>
                  <p className="text-neutral-400 text-xs">{selectedMovie.director}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedMovie(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs transition cursor-pointer"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  const m = selectedMovie;
                  setSelectedMovie(null);
                  onPlayMovie(m);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>REPRODUZIR FILME</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
