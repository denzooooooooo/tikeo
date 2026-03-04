'use client';




import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HeartIcon, CalendarIcon, LocationIcon } from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

interface FavoriteEvent {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  startDate: string;
  venueName: string;
  venueCity: string;
  minPrice: number;
  organizer?: { companyName: string };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [events, setEvents] = useState<FavoriteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    fetchFavorites(token);
  }, []);

  const fetchFavorites = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/likes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      } else if (res.status === 401) {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (eventId: string) => {
    const token = getAuthToken();
    if (!token) return;
    setRemovingId(eventId);
    try {
      const res = await fetch(`${API_URL}/likes/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    } finally {
      setRemovingId(null);
    }
  };

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
            <HeartIcon className="text-pink-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Connectez-vous pour voir vos favoris</h2>
          <p className="text-gray-600 mb-6">Sauvegardez vos événements préférés et retrouvez-les facilement.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] transition-colors">
              Se connecter
            </Link>
            <Link href="/register" className="px-6 py-3 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-colors">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <HeartIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mes favoris</h1>
              <p className="text-white/80">{events.length} événement{events.length !== 1 ? 's' : ''} sauvegardé{events.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
              <HeartIcon className="text-pink-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun favori pour le moment</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ajoutez des événements à vos favoris en cliquant sur le ❤️ sur les cartes d'événements.
            </p>
            <Link href="/events" className="inline-flex items-center gap-2 px-8 py-4 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] transition-colors">
              Découvrir des événements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.coverImage || `https://picsum.photos/seed/${event.id}/800/600`}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(event.id)}
                    disabled={removingId === event.id}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-md"
                    title="Retirer des favoris"
                  >
                    {removingId === event.id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HeartIcon className="text-red-500 fill-red-500" size={18} />
                    )}
                  </button>
                  {/* Date badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white rounded-lg px-2 py-1 text-center shadow">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">
                        {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold text-gray-900 leading-none">
                        {new Date(event.startDate).getDate()}
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={`/events/${event.slug || event.id}`} className="block p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-[#5B7CFF] transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <LocationIcon size={14} className="text-gray-400" />
                    <span>{event.venueName}, {event.venueCity}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <CalendarIcon size={14} className="text-gray-400" />
                      <span>{new Date(event.startDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className="font-bold text-[#5B7CFF]">
                      {event.minPrice === 0 ? 'Gratuit' : `${event.minPrice}€`}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
