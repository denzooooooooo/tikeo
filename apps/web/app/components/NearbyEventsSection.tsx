'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NearbyEvent {
  id: string;
  title: string;
  coverImage: string;
  teaserVideo?: string;
  date?: string;
  startDate?: string;
  city: string;
  price: number;
  category: string;
  organizer?: string;
  organizerId?: string | null;
  likesCount?: number;
  currency?: string;
  ticketsLeft?: number;
  totalTickets?: number;
}

// Currency code → display symbol
const CURRENCY_SYMBOLS: Record<string, string> = {
  XOF: 'FCFA', XAF: 'FCFA', NGN: '₦', GHS: 'GH₵',
  ZAR: 'R', MAD: 'MAD', GNF: 'GNF', CDF: 'FC',
  EUR: '€', USD: '$', CAD: 'CAD', CHF: 'CHF',
};

function getCurrencySymbol(currency?: string): string {
  if (!currency) return 'FCFA';
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

function formatEventPrice(price: number, currency?: string): string {
  if (price === 0) return 'Gratuit';
  const symbol = getCurrencySymbol(currency);
  const formatted = new Intl.NumberFormat('fr-FR').format(price);
  // Suffix currencies
  const suffixCurrencies = ['XOF', 'XAF', 'MAD', 'GNF', 'CDF', 'CAD', 'CHF'];
  if (!currency || suffixCurrencies.includes(currency)) {
    return `${formatted} ${symbol}`;
  }
  return `${symbol}${formatted}`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch {
    return null;
  }
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const TicketIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Event Card ─────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: NearbyEvent }) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(event.likesCount ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [toast, setToast] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && event.teaserVideo) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (likeLoading) return;

    const token = getAuthToken();
    if (!token) {
      showToast('Connectez-vous pour liker cet événement');
      return;
    }

    setLikeLoading(true);
    try {
      const method = liked ? 'DELETE' : 'POST';
      const res = await fetch(`${API_URL}/likes/events/${event.id}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      } else if (res.status === 401) {
        showToast('Session expirée — reconnectez-vous');
      } else {
        const data = await res.json().catch(() => ({}));
        // If already liked/unliked (400), still sync the UI
        if (res.status === 400) {
          setLiked(!liked);
          setLikeCount(prev => liked ? prev - 1 : prev + 1);
        } else {
          showToast(data.message || 'Erreur lors du like');
        }
      }
    } catch {
      showToast('Erreur de connexion');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (followLoading) return;

    if (!event.organizerId) {
      showToast('Organisateur non disponible');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showToast('Connectez-vous pour suivre cet organisateur');
      return;
    }

    setFollowLoading(true);
    try {
      const method = followed ? 'DELETE' : 'POST';
      const res = await fetch(`${API_URL}/likes/organizers/${event.organizerId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setFollowed(!followed);
        showToast(followed ? 'Vous ne suivez plus cet organisateur' : 'Vous suivez maintenant cet organisateur ✓');
      } else if (res.status === 401) {
        showToast('Session expirée — reconnectez-vous');
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 400) {
          // Already followed/unfollowed — sync UI
          setFollowed(!followed);
        } else {
          showToast(data.message || "Erreur lors de l'action");
        }
      }
    } catch {
      showToast('Erreur de connexion');
    } finally {
      setFollowLoading(false);
    }
  };

  const rawDate = event.startDate || event.date || '';
  const dateObj = rawDate ? new Date(rawDate) : null;
  const dateParts = dateObj && !isNaN(dateObj.getTime())
    ? [
        dateObj.toLocaleDateString('fr-FR', { day: '2-digit' }),
        dateObj.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
        dateObj.getFullYear().toString(),
      ]
    : ['--', '---', '----'];
  const ticketsLeft = event.ticketsLeft ?? Math.floor(Math.random() * 50) + 5;
  const totalTickets = event.totalTickets ?? 200;
  const ticketPercent = Math.min(100, ((totalTickets - ticketsLeft) / totalTickets) * 100);
  const isLowStock = ticketsLeft < 20;

  // organizer is always a string (companyName) or undefined
  const organizerName = event.organizer || 'Organisateur';
  const organizerInitial = organizerName.charAt(0).toUpperCase();

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image / Video */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          className={`object-cover transition-all duration-700 ${isHovered && event.teaserVideo ? 'opacity-20 scale-105' : 'scale-100'}`}
        />
        {event.teaserVideo && (
          <video
            ref={videoRef}
            src={event.teaserVideo}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            muted loop playsInline
          />
        )}
        <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'bg-black/45' : 'bg-gradient-to-t from-black/60 via-black/10 to-transparent'}`} />

        {/* Play indicator */}
        {event.teaserVideo && isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center animate-scale-in">
              <PlayIcon />
            </div>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white">
            {event.category}
          </span>
          {event.teaserVideo && isHovered && (
            <span className="px-2 py-1 rounded-md text-xs font-bold text-white animate-fade-in" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              ▶ TEASER
            </span>
          )}
        </div>

        {/* Date badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{dateParts[0]}</div>
            <div className="text-xl font-extrabold text-gray-900 leading-tight">{dateParts[1]}</div>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-gray-900/95 text-white text-xs rounded-lg shadow-lg z-50 pointer-events-none">
            {toast}
          </div>
        )}

        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-sm border transition-all duration-200 disabled:opacity-60 ${
            liked
              ? 'bg-red-500/90 border-red-400 text-white'
              : 'bg-black/30 border-white/20 text-white hover:bg-red-500/80 hover:border-red-400'
          }`}
        >
          <HeartIcon filled={liked} />
          <span className="text-xs font-bold">{likeCount}</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/events/${event.id}`}>
          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#5B7CFF] transition-colors line-clamp-1 leading-tight">
            {event.title}
          </h3>
        </Link>

        {/* Location + Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-500">
            <span className="text-[#5B7CFF]"><MapPinIcon /></span>
            <span className="text-xs font-medium">{event.city}</span>
          </div>
          <div className="font-extrabold text-sm">
            {event.price === 0 ? (
              <span className="text-green-600 px-2 py-0.5 bg-green-50 rounded-lg text-xs font-bold">Gratuit</span>
            ) : (
              <span className="text-[#5B7CFF]">
                <span className="text-xs text-gray-400 font-normal">dès </span>
                {formatEventPrice(event.price, event.currency)}
              </span>
            )}
          </div>
        </div>

        {/* Tickets availability bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <TicketIcon />
              <span>{ticketsLeft} billets restants</span>
            </div>
            {isLowStock && (
              <span className="text-xs font-bold text-orange-500 animate-pulse">⚡ Presque complet</span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${ticketPercent}%`,
                background: isLowStock
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(90deg, #5B7CFF, #7B61FF)',
              }}
            />
          </div>
        </div>

        {/* Organizer + Follow */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              {organizerInitial}
            </div>
            <span className="text-xs text-gray-600 font-medium truncate max-w-[90px]">{organizerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFollow}
              disabled={followLoading || !event.organizerId}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                followed
                  ? 'bg-[#5B7CFF]/10 text-[#5B7CFF] border border-[#5B7CFF]/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#5B7CFF]/10 hover:text-[#5B7CFF] border border-transparent'
              }`}
            >
              {followed ? <CheckIcon /> : <UserPlusIcon />}
              <span>{followed ? 'Suivi' : 'Suivre'}</span>
            </button>
            <Link
              href={`/events/${event.id}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:shadow-md hover:shadow-[#5B7CFF]/30"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
            >
              Réserver
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function NearbyEventsSection({ events }: { events: NearbyEvent[] }) {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#5B7CFF]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#7B61FF]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl shadow-lg shadow-[#5B7CFF]/30" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                <TrendingUpIcon />
              </div>
              <span className="text-sm font-bold text-[#5B7CFF] uppercase tracking-widest">Proche de vous</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Événements près de{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                chez vous
              </span>
            </h2>
            <p className="mt-2 text-gray-500">Survolez une carte pour voir le teaser · Likez · Suivez l&apos;organisateur</p>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-2 px-5 py-3 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-all flex-shrink-0"
          >
            Voir tout <ArrowRightIcon />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden text-center">
          <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg shadow-[#5B7CFF]/30" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
            Voir tous les événements <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
