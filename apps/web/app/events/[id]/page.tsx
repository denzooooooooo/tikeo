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
  TicketIcon,
} from '@tikeo/ui';
import { LikeButton, FollowButton, ReviewForm } from '@tikeo/ui';
import { ShareButton } from './ShareButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Currency code → display symbol
const CURRENCY_SYMBOLS: Record<string, string> = {
  XOF: 'FCFA', XAF: 'FCFA', NGN: '₦', GHS: 'GH₵',
  ZAR: 'R', MAD: 'MAD', GNF: 'GNF', CDF: 'FC',
  EUR: '€', USD: '$', CAD: 'CAD', CHF: 'CHF',
};

function formatEventPrice(price: number, currency?: string): string {
  if (price === 0) return 'Gratuit';
  const c = currency || 'XOF';
  const symbol = CURRENCY_SYMBOLS[c] ?? c;
  const formatted = new Intl.NumberFormat('fr-FR').format(price);
  const suffixCurrencies = ['XOF', 'XAF', 'MAD', 'GNF', 'CDF', 'CAD', 'CHF'];
  if (suffixCurrencies.includes(c)) return `${formatted} ${symbol}`;
  return `${symbol}${formatted}`;
}

async function getEvent(id: string) {
  try {
    const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const minPrice = event.ticketTypes?.length > 0
    ? Math.min(...event.ticketTypes.map((t: any) => t.price ?? 0))
    : event.minPrice ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-[45vh] sm:h-[55vh] lg:h-[65vh] w-full">
        <Image
          src={event.coverImage || 'https://picsum.photos/seed/event/1920/1080'}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Action buttons top-right */}
        <div className="absolute top-4 right-4 flex gap-2">
          <LikeButton
            eventId={params.id}
            initialLiked={event.isLiked || false}
            initialCount={event.likesCount || 0}
          />
          <ShareButton
            title={event.title}
            description={event.description}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
          />
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold rounded-full mb-3 border border-white/30">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-white/90 text-sm">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="text-white flex-shrink-0" size={16} />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="text-white flex-shrink-0" size={16} />
                <span className="font-medium">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LocationIcon className="text-white flex-shrink-0" size={16} />
                <span className="font-medium">{event.venueCity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky booking bar ─────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-gray-500">À partir de</p>
          <p className="text-lg font-bold text-[#5B7CFF]">
            {formatEventPrice(minPrice, event.currency)}
          </p>
        </div>
        <Link
          href={`/events/${params.id}/checkout`}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <TicketIcon size={18} />
          Réserver
        </Link>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Main Content ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5 lg:space-y-8 order-2 lg:order-1">

            {/* Organizer Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  {event.organizer?.logo ? (
                    <Image src={event.organizer.logo} alt={event.organizer.companyName} width={64} height={64} className="rounded-xl object-cover" />
                  ) : (
                    <UserIcon className="text-white" size={28} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Organisé par</p>
                  <p className="font-bold text-base sm:text-lg text-gray-900 flex items-center gap-1.5 flex-wrap">
                    <span className="truncate">{event.organizer?.companyName || 'Organisateur'}</span>
                    {event.organizer?.verified && <VerifiedIcon className="text-[#5B7CFF] flex-shrink-0" size={18} />}
                  </p>
                  {/* Buttons on mobile: row below name */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {event.organizer?.id && (
                      <FollowButton
                        organizerId={event.organizer.id}
                        initialFollowed={event.isFollowingOrganizer || false}
                        initialCount={event.organizer.followersCount || 0}
                        size="sm"
                        showCount={false}
                      />
                    )}
                    <Link
                      href={`/organizers/${event.organizer?.id}`}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-all text-xs"
                    >
                      Voir le profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full flex-shrink-0"></div>
                À propos de cet événement
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 sm:p-5 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-blue-50 rounded-lg flex-shrink-0">
                    <CalendarIcon className="text-blue-600" size={16} />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Date</span>
                </div>
                <p className="text-xs text-gray-600">{startDate.toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="bg-white p-3 sm:p-5 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-purple-50 rounded-lg flex-shrink-0">
                    <ClockIcon className="text-purple-600" size={16} />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Heure</span>
                </div>
                <p className="text-xs text-gray-600">{formattedTime}</p>
              </div>
              <div className="bg-white p-3 sm:p-5 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-green-50 rounded-lg flex-shrink-0">
                    <TicketIcon className="text-green-600" size={16} />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Billets</span>
                </div>
                <p className="text-xs text-gray-600">
                  {event.ticketTypes?.length > 0 ? `${event.ticketTypes.length} type${event.ticketTypes.length > 1 ? 's' : ''}` : 'Disponibles'}
                </p>
              </div>
            </div>

            {/* Location */}
            {!event.isOnline && (
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full flex-shrink-0"></div>
                  Lieu de l&apos;événement
                </h2>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-2.5 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex-shrink-0">
                    <LocationIcon className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-gray-900 mb-0.5">{event.venueName}</p>
                    {event.venueAddress && <p className="text-sm text-gray-600 mb-0.5">{event.venueAddress}</p>}
                    <p className="text-sm text-gray-600">{event.venueCity}{event.venueCountry ? `, ${event.venueCountry}` : ''}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#5B7CFF] to-[#7B61FF] rounded-full flex-shrink-0"></div>
                Avis et Notes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-xl">
                  <div className="text-4xl sm:text-5xl font-bold text-[#5B7CFF] mb-2">
                    {(event.averageRating || 0).toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.round(event.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{event.totalReviews || 0} avis</p>
                </div>
                <ReviewForm eventId={params.id} />
              </div>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Réserver vos billets</h3>

              <div className="space-y-3 mb-5">
                {event.ticketTypes?.length > 0 ? (
                  event.ticketTypes.map((ticket: any) => (
                    <div key={ticket.id} className="group border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-[#5B7CFF] hover:shadow-md transition-all cursor-pointer">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#5B7CFF] transition-colors truncate">
                            {ticket.name}
                          </p>
                          {ticket.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ticket.description}</p>
                          )}
                          {(ticket.available ?? ticket.quantity) > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                              <TicketIcon size={12} />
                              <span>{ticket.available ?? ticket.quantity} restants</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          {ticket.price === 0 ? (
                            <span className="text-green-600 font-bold text-sm">Gratuit</span>
                          ) : (
                            <div>
                              <span className="text-lg font-bold text-[#5B7CFF]">{formatEventPrice(ticket.price, event.currency)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Aucun billet disponible pour le moment.
                  </div>
                )}
              </div>

              <Link
                href={`/events/${params.id}/checkout`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-bold text-sm sm:text-base hover:shadow-xl transition-all mb-4"
              >
                <TicketIcon size={20} />
                Réserver maintenant
              </Link>

              <div className="space-y-2.5 pt-4 border-t border-gray-100">
                {[
                  { icon: <CheckCircleIcon className="text-green-600" size={18} />, bg: 'bg-green-50', text: 'Confirmation instantanée' },
                  { icon: <ShieldCheckIcon className="text-blue-600" size={18} />, bg: 'bg-blue-50', text: 'Paiement 100% sécurisé' },
                  { icon: <CreditCardIcon className="text-purple-600" size={18} />, bg: 'bg-purple-50', text: 'Mobile Money & Carte' },
                  { icon: <RefreshIcon className="text-orange-600" size={18} />, bg: 'bg-orange-50', text: 'Remboursement possible' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                    <div className={`p-1.5 ${item.bg} rounded-lg flex-shrink-0`}>{item.icon}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
