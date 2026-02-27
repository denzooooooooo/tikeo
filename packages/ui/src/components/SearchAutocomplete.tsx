'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, Clock, TrendingUp, Calendar, MapPin, Loader2 } from 'lucide-react';

export interface SearchSuggestion {
  type: 'event' | 'category' | 'organizer' | 'recent';
  id?: string;
  title: string;
  subtitle?: string;
  url?: string;
  icon?: string;
  image?: string;
}

export interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  className?: string;
  minChars?: number;
  maxSuggestions?: number;
  delay?: number;
}

const CATEGORIES = [
  { name: 'Musique', icon: '🎵', slug: 'music' },
  { name: 'Sports', icon: '⚽', slug: 'sports' },
  { name: 'Arts', icon: '🎭', slug: 'arts' },
  { name: 'Technologie', icon: '💻', slug: 'technology' },
  { name: 'Business', icon: '💼', slug: 'business' },
  { name: 'Gastronomie', icon: '🍽️', slug: 'food' },
  { name: 'Santé', icon: '🏥', slug: 'health' },
  { name: 'Éducation', icon: '📚', slug: 'education' },
];

export function SearchAutocomplete({
  onSearch,
  onSelect,
  placeholder = 'Rechercher un événement, artiste, organisateur...',
  suggestions = [],
  recentSearches = [],
  popularSearches = ['Festival', 'Concert', 'Exposition', 'Conférence'],
  className = '',
  minChars = 2,
  maxSuggestions = 8,
  delay = 300,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearchesState, setRecentSearchesState] = useState<string[]>(recentSearches);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tikeo_recent_searches');
    if (saved) {
      setRecentSearchesState(JSON.parse(saved));
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock search function - replace with real API
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minChars) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));

    const mockResults: SearchSuggestion[] = [
      { type: 'event' as const, id: '1', title: `${searchQuery} - Concert`, subtitle: 'Paris', url: '/events/1' },
      { type: 'event' as const, id: '2', title: `${searchQuery} Festival`, subtitle: 'Lyon', url: '/events/2' },
      { type: 'category' as const, title: 'Voir tout pour: ' + searchQuery, icon: '🔍' },
      ...CATEGORIES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(c => ({
        type: 'category' as const,
        title: c.name,
        icon: c.icon,
        url: `/events?category=${c.slug}`,
      })),
    ].slice(0, maxSuggestions);

    setResults(mockResults);
    setIsLoading(false);
  }, [minChars, maxSuggestions]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= minChars) {
      debounceRef.current = setTimeout(() => {
        performSearch(query);
      }, delay);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, minChars, delay, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      addToRecentSearches(query);
      setIsOpen(false);
    }
  };

  const addToRecentSearches = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearchesState.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearchesState(updated);
    localStorage.setItem('tikeo_recent_searches', JSON.stringify(updated));
  };

  const handleSelect = (suggestion: SearchSuggestion) => {
    onSelect?.(suggestion);
    if (suggestion.title) {
      addToRecentSearches(suggestion.title);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + (query.length >= minChars ? 0 : recentSearchesState.length + popularSearches.length);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearchesState([]);
    localStorage.removeItem('tikeo_recent_searches');
  };

  const displayResults = query.length >= minChars 
    ? results 
    : [];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {displayResults.length > 0 ? (
            <div className="py-2">
              {displayResults.map((result, index) => (
                <button
                  key={result.type + result.id || result.title}
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-purple-50' : ''
                  }`}
                >
                  {result.image ? (
                    <img src={result.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                      {result.icon || '🔍'}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-sm text-gray-500">{result.subtitle}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                </button>
              ))}
            </div>
          ) : query.length >= minChars ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Aucun résultat pour "{query}"</p>
            </div>
          ) : null}

          {/* Recent & Popular Searches */}
          {query.length < minChars && (recentSearchesState.length > 0 || popularSearches.length > 0) && (
            <div className="border-t border-gray-100">
              {recentSearchesState.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recherches récentes
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      Effacer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearchesState.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          setIsOpen(true);
                        }}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {popularSearches.length > 0 && (
                <div className="px-4 py-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                    Tendances
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 bg-purple-50 rounded-full text-sm text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Categories */}
              <div className="px-4 py-3 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                  Catégories
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/events?category=${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;

