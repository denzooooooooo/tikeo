import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, CalendarIcon, LocationIcon, ArrowRightIcon, SadFaceIcon } from '@tikeo/ui';
import { EventCard } from '@tikeo/ui';

async function getFavorites() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
    return res.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
  }
}

function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  );
}

export default async function FavoritesPage() {
  const { data: favorites, meta } = await getFavorites();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              Accueil
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium">Favoris</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <HeartIcon className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Mes favoris
              </h1>
              <p className="text-white/90 mt-2">
                {meta.total} événement{meta.total > 1 ? 's' : ''} sauvegardé{meta.total > 1 ? 's' : ''}
              </p>
            </div>
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
        {favorites.length > 0 ? (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher dans vos favoris..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200"
                />
              </div>
              <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent">
                <option>Plus récents</option>
                <option>Date proche</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
              </select>
            </div>

            {/* Events Grid */}
            <Suspense fallback={<FavoritesSkeleton />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {favorites.map((fav: any) => (
                  <div key={fav.id} className="group relative">
                    <Link href={`/events/${fav.slug}`}>
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
                          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            // Remove from favorites logic
                          }}
                        >
                          <HeartIcon className="text-red-500 fill-red-500" size={20} />
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
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-[#5B7CFF]">
                            {fav.minPrice > 0 ? `À partir de ${fav.minPrice}€` : 'Gratuit'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Suspense>

            {/* Empty State */}
            {favorites.length === 0 && (
              <div className="text-center py-20">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 bg-gray-100 rounded-full">
                    <SadFaceIcon className="text-gray-400" size={64} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucun favori pour le moment
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Ajoutez des événements à vos favoris pour les retrouver facilement et ne manquer aucune soirée !
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                >
                  Découvrir des événements
                  <ArrowRightIcon size={20} />
                </Link>
              </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={true}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                <span className="px-4 py-2 font-semibold text-[#5B7CFF]">
                  Page 1 sur {meta.totalPages}
                </span>
                <button
                  disabled={true}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          /* Not logged in */
          <div className="text-center py-20">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-gray-100 rounded-full">
                <HeartIcon className="text-gray-400" size={64} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Connectez-vous pour voir vos favoris
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Créez un compte ou connectez-vous pour sauvegarder vos événements préférés.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                Me connecter
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-all duration-200"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

