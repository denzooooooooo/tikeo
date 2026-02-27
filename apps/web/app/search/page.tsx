'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  SearchIcon,
  FilterIcon,
  LocationIcon,
  CalendarIcon,
  CloseIcon,
  SadFaceIcon,
  TrendingUpIcon,
  ClockIcon,
  DollarIcon,
} from '@tikeo/ui';

const categories = [
  { name: 'Tous', value: '' },
  { name: 'Musique', value: 'MUSIC' },
  { name: 'Sport', value: 'SPORTS' },
  { name: 'Conférence', value: 'BUSINESS' },
  { name: 'Festival', value: 'ENTERTAINMENT' },
  { name: 'Théâtre', value: 'ARTS' },
  { name: 'Exposition', value: 'ARTS' },
  { name: 'Technologie', value: 'TECHNOLOGY' },
];

const sortOptions = [
  { name: 'Date proche', value: 'date_asc' },
  { name: 'Date lointaine', value: 'date_desc' },
  { name: 'Prix croissant', value: 'price_asc' },
  { name: 'Prix décroissant', value: 'price_desc' },
  { name: 'Plus populaires', value: 'popular' },
  { name: 'Plus récents', value: 'recent' },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  // Filters
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [isOnline, setIsOnline] = useState(searchParams.get('isOnline') === 'true');
  const [sortBy, setSortBy] = useState('date_asc');

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    if (searchParams.get('q') || searchParams.get('category')) {
      performSearch();
    }
  }, [searchParams]);

  const fetchTrending = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/trending?limit=6`);
      const data = await res.json();
      setTrending(data.trending || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const fetchSuggestions = async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query || '',
        category,
        city,
        startDate,
        endDate,
        minPrice,
        maxPrice,
        isOnline: isOnline.toString(),
        sortBy,
        page: '1',
        limit: '20',
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/events?${params}`);
      const data = await res.json();
      setResults(data.data || []);
      setTotal(data.meta?.total || 0);
      setSuggestions([]);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    const params = new URLSearchParams({ q: suggestion });
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory('');
    setCity('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setIsOnline(false);
    setSortBy('date_asc');
  };

  const activeFiltersCount = [category, city, startDate, endDate, minPrice, maxPrice].filter(Boolean).length +
    (isOnline ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec gradient */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Recherche
            </h1>
            <p className="text-xl text-white/90">
              Trouvez l&apos;événement parfait
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex-1 flex items-center px-6 py-4">
                  <SearchIcon className="text-gray-400 mr-4" size={24} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    placeholder="Rechercher un événement, artiste, lieu..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setSuggestions([]);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <CloseIcon size={20} className="text-gray-400" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Rechercher
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <SearchIcon size={18} className="text-gray-400" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Quick Categories */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.slice(1).map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  router.push(`/search?category=${cat.value}`);
                }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat.value
                    ? 'bg-white text-[#5B7CFF]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl mb-4"
              >
                <span className="flex items-center gap-2 font-medium">
                  <FilterIcon size={20} />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#5B7CFF] text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </span>
                <span className="text-[#5B7CFF]">
                  {showFilters ? 'Masquer' : 'Afficher'}
                </span>
              </button>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Filtres</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#5B7CFF] hover:underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <div className="relative">
                    <LocationIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Paris, Lyon, Marseille..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dates
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <DollarIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <DollarIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Online Events */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                    className="w-5 h-5 text-[#5B7CFF] rounded focus:ring-[#5B7CFF]"
                  />
                  <label htmlFor="isOnline" className="text-sm font-medium text-gray-700">
                    Événements en ligne uniquement
                  </label>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={performSearch}
                  className="w-full py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full"></div>
                <p className="text-lg text-gray-600">
                  <span className="font-bold text-gray-900">{total}</span> résultat{total > 1 ? 's' : ''}
                  {query && (
                    <>
                      {' '}pour <span className="font-medium text-[#5B7CFF]">"{query}"</span>
                    </>
                  )}
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  performSearch();
                }}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {results.map((event: any) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={event.coverImage || `https://picsum.photos/seed/${event.id}/800/600`}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                          {event.category}
                        </span>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white rounded-lg p-2 text-center shadow-lg">
                          <div className="text-xs font-semibold text-gray-500 uppercase">
                            {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {new Date(event.startDate).getDate()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors line-clamp-1 mb-2">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <LocationIcon size={16} className="text-gray-400" />
                        <span>{event.venueCity}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarIcon size={16} className="text-gray-400" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-[#5B7CFF]">
                          {event.minPrice > 0 ? `À partir de ${event.minPrice}€` : 'Gratuit'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && (
              <div className="text-center py-20">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 bg-gray-100 rounded-full">
                    <SadFaceIcon className="text-gray-400" size={64} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Essayez de modifier vos critères de recherche ou d&apos;élargir vos filtres.
                </p>

                {/* Trending Events */}
                {trending.length > 0 && (
                  <div className="mt-12">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
                      <TrendingUpIcon className="text-[#5B7CFF]" size={24} />
                      Tendances du moment
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                      {trending.slice(0, 3).map((event: any) => (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                        >
                          <p className="font-semibold text-gray-900 line-clamp-1">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.venueCity}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    clearFilters();
                    router.push('/search');
                  }}
                  className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}

