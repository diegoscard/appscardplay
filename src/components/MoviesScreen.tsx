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

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#080407] text-neutral-100 font-['Outfit'] select-none">
      {/* Hero Featured Movie Banner */}
      {heroMovie && (
        <div className="relative w-full h-[380px] md:h-[440px] shrink-0 overflow-hidden bg-gradient-to-t from-[#080407] via-[#080407]/70 to-transparent">
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
            <div className="hidden sm:block w-44 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-[0_0_40px_rgba(220,38,38,0.4)] border-2 border-red-600/50 bg-neutral-900">
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
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
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

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {heroMovie.name}
              </h1>

              {heroMovie.plot && (
                <p className="text-sm md:text-base text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
                  {heroMovie.plot}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onPlayMovie(heroMovie)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-xl shadow-red-600/30 flex items-center gap-2.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ASSISTIR FILME AGORA</span>
                </button>

                <button
                  onClick={() => setSelectedMovie(heroMovie)}
                  className="px-4 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 font-bold text-xs border border-neutral-700 transition flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Mais Detalhes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog Area removed as requested */}

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
