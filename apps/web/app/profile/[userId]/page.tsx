import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

async function getUserProfile(userId: string) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/public`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getUserEvents(userId: string) {
  try {
    // Get events created by this user (via their organizer profile)
    const res = await fetch(`${API_URL}/events?organizerUserId=${userId}&status=PUBLISHED&limit=12`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data || [];
  } catch {
    return [];
  }
}

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const [profile, events] = await Promise.all([
    getUserProfile(params.userId),
    getUserEvents(params.userId),
  ]);

  // If no profile found, show a minimal page (user exists but no public profile endpoint)
  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.email?.split('@')[0] || 'Utilisateur'
    : 'Créateur';

  const avatar = profile?.avatar
    ? profile.avatar
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.userId}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              <Image
                src={avatar}
                alt={displayName}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{displayName}</h1>
              {profile?.bio && (
                <p className="text-gray-600 text-sm mb-3 max-w-lg">{profile.bio}</p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-4">
                {profile?.location && (
                  <span> {profile.location}</span>
                )}
                {profile?.createdAt && (
                  <span> Membre depuis {new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                )}
                <span> {events.length} événement{events.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Follow button */}
              <FollowButton
                userId={params.userId}
                size="md"
                showCount={true}
              />
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Événements créés par {displayName}
          </h2>

          {events.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="text-5xl mb-3"></div>
              <p className="text-gray-500">Aucun événement publié pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event: any) => {
                const startDate = new Date(event.startDate);
                const minPrice = event.ticketTypes?.length > 0
                  ? Math.min(...event.ticketTypes.map((t: any) => t.price ?? 0))
                  : event.minPrice ?? 0;

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    {/* Cover */}
                    <div className="relative h-40 bg-gray-100">
                      <Image
                        src={event.coverImage || 'https://picsum.photos/seed/event/400/200'}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <span className="text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#5B7CFF] transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <span></span>
                        <span>{startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <span></span>
                        <span>{event.venueCity}, {event.venueCountry}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#5B7CFF]">
                          {minPrice === 0 ? 'Gratuit' : `À partir de ${minPrice.toLocaleString('fr-FR')} FCFA`}
                        </span>
                        <span className="text-xs text-white bg-[#5B7CFF] px-2 py-1 rounded-lg font-semibold">
                          Voir →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
