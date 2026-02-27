import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { VerifiedIcon, LocationIcon, CalendarIcon, GlobeIcon, StarIcon } from '@tikeo/ui';
import { FollowButton } from '@tikeo/ui';

async function getOrganizer(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizers/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching organizer:', error);
    return null;
  }
}

async function getOrganizerEvents(organizerId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?organizerId=${organizerId}&status=PUBLISHED&limit=6`, {
      cache: 'no-store',
    });

    if (!res.ok) return { data: [] };
    return res.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [] };
  }
}

export default async function OrganizerProfilePage({ params }: { params: { id: string } }) {
  const organizer = await getOrganizer(params.id);
  
  if (!organizer) {
    notFound();
  }

  const { data: events } = await getOrganizerEvents(params.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image */}
      <div className="relative h-64 lg:h-80 bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Profile Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white rounded-2xl shadow-xl p-2">
              <div className="w-full h-full bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex items-center justify-center overflow-hidden">
                {organizer.logo ? (
                  <Image
                    src={organizer.logo}
                    alt={organizer.companyName}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold text-white">
                    {typeof organizer.companyName === 'string' && organizer.companyName.length > 0 ? organizer.companyName.charAt(0) : 'O'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 lg:pt-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {organizer.companyName}
                  </h1>
                  {organizer.verified && (
                    <VerifiedIcon className="text-[#5B7CFF]" size={28} />
                  )}
                </div>
                
                {organizer.description && (
                  <p className="text-gray-600 max-w-2xl mb-4">
                    {organizer.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {organizer.website && (
                    <a
                      href={organizer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#5B7CFF] hover:underline"
                    >
                      <GlobeIcon size={18} />
                      Site web
                    </a>
                  )}
                  
                  {organizer.totalEvents !== undefined && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={18} className="text-gray-400" />
                      <span>{organizer.totalEvents} événements</span>
                    </div>
                  )}

                  {organizer.rating && (
                    <div className="flex items-center gap-2">
                      <StarIcon className="text-yellow-500 fill-yellow-500" size={18} />
                      <span className="font-medium">{organizer.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links & Follow Button */}
              <div className="flex items-center gap-3">
                <FollowButton 
                  organizerId={params.id}
                  initialFollowed={organizer.isFollowed || false}
                  initialCount={organizer.followersCount || 0}
                  size="md"
                />
                {organizer.facebookUrl && (
                  <a
                    href={organizer.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-[#5B7CFF] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                
                {organizer.twitterUrl && (
                  <a
                    href={organizer.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-[#5B7CFF] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                )}
                
                {organizer.instagramUrl && (
                  <a
                    href={organizer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-[#5B7CFF] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </a>
                )}
                
                {organizer.linkedinUrl && (
                  <a
                    href={organizer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-[#5B7CFF] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold mb-1">{organizer.totalEvents || 0}</div>
            <div className="text-white/80">Événements</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold mb-1">{organizer.totalTicketsSold?.toLocaleString() || 0}</div>
            <div className="text-white/80">Billets vendus</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold mb-1">{organizer.rating?.toFixed(1) || 'N/A'}</div>
            <div className="text-white/80">Note moyenne</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold mb-1">{organizer.verified ? '✓' : '✗'}</div>
            <div className="text-white/80">{organizer.verified ? 'Vérifié' : 'Non vérifié'}</div>
          </div>
        </div>

        {/* Events */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Événements à venir
            </h2>
            <Link
              href={`/events?organizerId=${params.id}`}
              className="text-[#5B7CFF] font-semibold hover:underline"
            >
              Voir tout
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
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
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                        {event.category}
                      </span>
                    </div>

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
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun événement à venir
              </h3>
              <p className="text-gray-600">
                Revenez bientôt pour découvrir les nouveaux événements de {organizer.companyName}
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Organisez un événement avec {organizer.companyName}
              </h3>
              <p className="text-gray-400">
                Une question ? Besoin d&apos;informations ? N&apos;hésitez pas à nous contacter.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Nous contacter
              </Link>
              {organizer.website && (
                <a
                  href={organizer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#7B61FF] transition-colors"
                >
                  Visiter le site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

