'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, CalendarIcon, LocationIcon, ArrowRightIcon } from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getApiBase(url: string) {
  return url.includes('/api/v1') ? url.replace(/\/$/, '') : url.replace(/\/$/, '') + '/api/v1';
}

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch {
    return null;
  }
}

interface FavoriteEvent {
  id: string;
  eventId: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  venueName: string;
  venueCity: string;
  venueCountry: string;
  startDate: string;
  minPrice: number;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  totalPages: number;
}

function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchFavorites = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setIsLoading(true);
    try {
      const res = await fetch(`${getApiBase(API_URL)}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        setFavorites(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, totalPages: 0 });
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (e: React.MouseEvent, eventId: string, favId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    if (!token) return;

    setRemovingId(favId);
    try {
      const res = await fetch(`${getApiBase(API_URL)}/favorites/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== favId));
        setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredFavorites = favorites.filter((fav) =>
    search
      ? fav.title.toLowerCase().includes(search.toLowerCase()) ||
        fav.venueCity.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">Accueil</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium">Favoris</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <HeartIcon className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">Mes favoris</h1>
              <p className="text-white/90 mt-2">
                {isLoading ? '…' : `${meta.total} événement${meta.total > 1 ? 's' : ''} sauvegardé${meta.total > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Not logged in */}
        {!isLoggedIn && !isLoading && (
          <div className="text-center py-20">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-gray-100 rounded-full">
                <HeartIcon className="text-gray-400" size={64} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Connectez-vous pour voir vos favoris</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Créez un compte ou connectez-vous pour sauvegarder vos événements préférés.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200">
                Me connecter
              </Link>
              <Link href="/register" className="px-8 py-4 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-all duration-200">
                Créer un compte
              </Link>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <FavoritesSkeleton />}

        {/* Logged in with content */}
        {isLoggedIn && !isLoading && (
          <>
            {favorites.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher dans vos favoris…"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredFavorites.map((fav) => (
                  <div key={fav.id} className="group relative">
                    <Link href={`/events/${fav.slug || fav.eventId}`}>
                      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] mb-4">
                        <Image
                          src={fav.coverImage || `https://picsum.photos/seed/${fav.eventId}/800/600`}
                          alt={fav.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

                        {/* Remove from favorites */}
                        <button
                          className={`absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors ${removingId === fav.id ? 'opacity-50' : ''}`}
                          onClick={(e) => handleRemoveFavorite(e, fav.eventId, fav.id)}
                          disabled={removingId === fav.id}
                          title="Retirer des favoris"
                        >
                          {removingId === fav.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <HeartIcon className="text-red-500 fill-red-500" size={20} />
                          )}
                        </button>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                            {fav.category}
                          </span>
                        </div>

                        {/* Date Badge */}
                        <div className="absolute bottom-4 left-4 z-20">
                          <div className="bg-white rounded-lg p-2 text-center shadow-lg">
                            <div className="text-xs font-semibold text-gray-500 uppercase">
                              {new Date(fav.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {new Date(fav.startDate).getDate()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors line-clamp-1">
                          {fav.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LocationIcon size={16} className="text-gray-400" />
                          <span>{fav.venueCity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(fav.startDate).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-[#5B7CFF]">
                            {fav.minPrice > 0 ? `À partir de ${fav.minPrice} FCFA` : 'Gratuit'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-20">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 bg-gray-100 rounded-full">
                    <HeartIcon className="text-gray-400" size={64} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {search ? 'Aucun résultat pour cette recherche' : 'Aucun favori pour le moment'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {search
                    ? 'Essayez avec un autre terme de recherche.'
                    : 'Ajoutez des événements à vos favoris pour les retrouver facilement !'}
                </p>
                {!search && (
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                  >
                    Découvrir des événements
                    <ArrowRightIcon size={20} />
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
