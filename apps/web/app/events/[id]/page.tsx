import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  UserIcon,
  VerifiedIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  RefreshIcon,
  HeartIcon,
  ShareIcon,
  TicketIcon,
} from '@tikeo/ui';
import { LikeButton, ReviewForm } from '@tikeo/ui';

async function getEvent(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image avec Gradient Overlay */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={event.coverImage || 'https://picsum.photos/seed/event/1920/1080'}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <LikeButton 
            eventId={params.id} 
            initialLiked={event.isLiked || false}
            initialCount={event.likesCount || 0}
          />
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg group">
            <ShareIcon className="text-gray-700 group-hover:text-[#5B7CFF]" size={24} />
          </button>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full mb-4 border border-white/30">
              {event.category}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-white" size={20} />
                <span className="font-medium">
                  {new Date(event.startDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="text-white" size={20} />
                <span className="font-medium">
                  {new Date(event.startDate).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon className="text-white" size={20} />
                <span className="font-medium">{event.venueCity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Organizer Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  {event.organizer?.logo ? (
                    <Image
                      src={event.organizer.logo}
                      alt={event.organizer.companyName}
                      width={64}
                      height={64}
                      className="rounded-xl"
                    />
                  ) : (
                    <UserIcon className="text-white" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Organisé par</p>
                  <p className="font-bold text-xl text-gray-900 flex items-center gap-2">
                    {event.organizer?.companyName || 'Organisateur'}
                    {event.organizer?.verified && (
                      <VerifiedIcon className="text-[#5B7CFF]" size={20} />
                    )}
                  </p>
                </div>
                <Link
                  href={`/organizers/${event.organizer?.id}`}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-all duration-200"
                >
                  Voir le profil
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full"></div>
                À propos de cet événement
              </h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full"></div>
                Lieu de l&apos;événement
              </h2>
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="p-3 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex-shrink-0">
                  <LocationIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-gray-900 mb-1">{event.venueName}</p>
                  <p className="text-gray-600 mb-1">{event.venueAddress}</p>
                  <p className="text-gray-600">
                    {event.venueCity}, {event.venueCountry}
                  </p>
                </div>
                <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-all duration-200">
                  Itinéraire
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="text-blue-600" size={20} />
                  </div>
                  <span className="font-semibold text-gray-900">Date</span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClockIcon className="text-purple-600" size={20} />
                  </div>
                  <span className="font-semibold text-gray-900">Heure</span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TicketIcon className="text-green-600" size={20} />
                  </div>
                  <span className="font-semibold text-gray-900">Billets</span>
                </div>
                <p className="text-sm text-gray-600">Disponibles</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full"></div>
                Avis et Notes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                  <div className="text-5xl font-bold text-[#5B7CFF] mb-2">
                    {event.averageRating || '0.0'}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(event.averageRating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600">{event.totalReviews || 0} avis</p>
                </div>
                <ReviewForm eventId={params.id} />
              </div>
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Réserver vos billets</h3>

              <div className="space-y-4 mb-6">
                {event.ticketTypes?.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="group border-2 border-gray-200 rounded-xl p-5 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-gray-900 group-hover:text-[#5B7CFF] transition-colors">
                          {ticket.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-[#5B7CFF]">{ticket.price}€</p>
                      </div>
                    </div>
                    {ticket.quantityAvailable && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <TicketIcon size={14} />
                        <span>{ticket.quantityAvailable} places restantes</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-200 mb-6">
                <TicketIcon size={24} />
                Réserver maintenant
              </button>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="text-green-600" size={20} />
                  </div>
                  <span>Confirmation instantanée</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ShieldCheckIcon className="text-blue-600" size={20} />
                  </div>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <CreditCardIcon className="text-purple-600" size={20} />
                  </div>
                  <span>Apple Pay & Google Pay</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <RefreshIcon className="text-orange-600" size={20} />
                  </div>
                  <span>Remboursement possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
