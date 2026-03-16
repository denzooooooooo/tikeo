'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { VerifiedIcon, LocationIcon, CalendarIcon, GlobeIcon, StarIcon, FollowButton } from '../../components/ui/Icons';

function ShareOrganizerButton({ organizerId, organizerName }: { organizerId: string; organizerName: string }) {
  const handleShare = async () => {
    const url = `${window.location.origin}/organizers/${organizerId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${organizerName} - Tikeoh`,
          text: `Découvrez ${organizerName}`,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        alert("Lien copié !");
      }
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-800 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all duration-300 whitespace-nowrap"
    >
      Partager
    </button>
  );
}

export default function OrganizerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizer, setOrganizer] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

        const [organizerRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/organizers/${params.id}`, { cache: 'no-store' }),
          fetch(`${API_URL}/events?organizerId=${params.id}&status=PUBLISHED&limit=9`, { cache: 'no-store' })
        ]);

        if (!organizerRes.ok) {
          setOrganizer(null);
        } else {
          setOrganizer(await organizerRes.json());
        }

        if (!eventsRes.ok) {
          setEvents([]);
        } else {
          const data = await eventsRes.json();
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center border">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Organisateur introuvable</h2>
          <p className="text-gray-600 mb-8">{error || 'Page non trouvée'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors mr-4"
          >
            Réessayer
          </button>
          <button 
            onClick={() => router.push('/events')} 
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Voir les événements
          </button>
        </div>
      </div>
    );
  }

  const displayName = organizer.companyName || `${organizer.user?.firstName || ''} ${organizer.user?.lastName || ''}`.trim() || 'Organisateur';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-80 lg:h-96 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        {organizer.bannerImage && (
          <Image 
            src={organizer.bannerImage} 
            alt={displayName}
            fill className="object-cover opacity-30" 
          />
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 pb-24">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-200 -mb-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
                {(organizer.user?.avatar || organizer.logo) ? (
                  <Image
                    src={organizer.user?.avatar || organizer.logo}
                    alt={displayName}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                ) : (
                  <span className="text-5xl font-black text-white">
                    {(displayName.charAt(0)).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">{displayName}</h1>
                {organizer.verified && <VerifiedIcon className="w-12 h-12 text-blue-600" />}
              </div>
              
              {organizer.description && (
                <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-2xl">
                  {organizer.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-8 text-lg mb-8">
                {organizer.website && (
                  <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    <GlobeIcon size={24} />
                    Site web
                  </a>
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon size={24} className="text-gray-500" />
                  <span className="font-semibold">{organizer.totalEvents || 0} événements</span>
                </div>
                {organizer.rating && (
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-yellow-500 w-6 h-6" />
                    <span className="font-bold text-2xl">{organizer.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <ShareOrganizerButton organizerId={params.id} organizerName={displayName} />
                {organizer.userId && (
                  <FollowButton
                    userId={organizer.userId}
                    initialCount={organizer._count?.subscriptions || 0}
                    size="lg"
                  />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-8 hover:shadow-2xl transition-shadow duration-300 text-center">
            <div className="text-4xl font-black mb-2">{organizer._count?.events || organizer.totalEvents || 0}</div>
            <div className="text-blue-100 font-semibold text-lg">Événements</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-3xl p-8 hover:shadow-2xl transition-shadow duration-300 text-center">
            <div className="text-4xl font-black mb-2">{organizer._count?.subscriptions || 0}</div>
            <div className="text-emerald-100 font-semibold text-lg">Abonnés</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-8 hover:shadow-2xl transition-shadow duration-300 text-center">
            <div className="text-4xl font-black mb-2">{organizer.rating?.toFixed(1) || 'N/A'}</div>
            <div className="text-orange-100 font-semibold text-lg">Note</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-3xl p-8 hover:shadow-2xl transition-shadow duration-300 text-center">
            <div className="text-4xl font-black mb-2">{organizer.verified ? '✓' : '✗'}</div>
            <div className="text-purple-100 font-semibold text-lg">{organizer.verified ? 'Vérifié' : 'Non vérifié'}</div>
          </div>
        </div>

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-gray-900">Événements à venir</h2>
            <Link href={`/events?organizerId=${params.id}`} className="text-blue-600 hover:text-blue-700 font-semibold text-xl">
              Voir tout →
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`} className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-200">
                  <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    <Image
                      src={event.coverImage || '/placeholder-event.jpg'}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white rounded-2xl font-bold text-gray-900 text-sm shadow-lg">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-white rounded-2xl p-4 shadow-2xl text-center min-w-[80px]">
                        <div className="text-xs font-bold text-gray-500 uppercase">
                          {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                          {new Date(event.startDate).getDate()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 text-lg text-gray-600 mb-4">
                      <LocationIcon size={20} />
                      <span className="font-semibold">{event.venueCity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-lg text-gray-600">
                        <CalendarIcon size={20} />
                        <span>{new Date(event.startDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {event.minPrice > 0 ? `${event.minPrice.toLocaleString()} FCFA` : 'Gratuit'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <CalendarIcon className="mx-auto mb-8 w-24 h-24 text-gray-400" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Aucun événement à venir</h3>
              <p className="text-xl text-gray-600 max-w-lg mx-auto">
                {displayName} prépare prochainement de nouveaux événements. Revenez bientôt !
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-24 bg-gradient-to-r from-gray-900 to-slate-900 rounded-3xl p-12 lg:p-20 text-white text-center">
          <h3 className="text-4xl lg:text-5xl font-black mb-6">Prêt à organiser votre événement ?</h3>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Collaborez avec {displayName} pour créer des expériences uniques et mémorables.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact" className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-300">
              Nous contacter
            </Link>
            {organizer.website && (
              <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="px-10 py-5 border-2 border-white text-white rounded-2xl font-bold text-xl hover:bg-white hover:text-gray-900 transition-all duration-300">
                Site officiel
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

