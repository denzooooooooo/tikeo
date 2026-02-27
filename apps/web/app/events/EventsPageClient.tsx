'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, FormEvent } from 'react';

// ─── Icônes SVG inline ───────────────────────────────────────────────────────
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
const MapPinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
const TicketIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>;
const FilterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const ChevronLeftIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>;
const ChevronRightIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>;
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>;

// ─── Données africaines ───────────────────────────────────────────────────────
const AFRICAN_COUNTRIES = [
  { value: '', label: 'Tous les pays' },
  { value: "Côte d'Ivoire", label: "🇨🇮 Côte d'Ivoire" },
  { value: 'Sénégal', label: '🇸🇳 Sénégal' },
  { value: 'Nigeria', label: '🇳🇬 Nigeria' },
  { value: 'Cameroun', label: '🇨🇲 Cameroun' },
  { value: 'Ghana', label: '🇬🇭 Ghana' },
  { value: 'Kenya', label: '🇰🇪 Kenya' },
  { value: 'Mali', label: '🇲🇱 Mali' },
  { value: 'Burkina Faso', label: '🇧🇫 Burkina Faso' },
  { value: 'Togo', label: '🇹🇬 Togo' },
  { value: 'Bénin', label: '🇧🇯 Bénin' },
  { value: 'Guinée', label: '🇬🇳 Guinée' },
  { value: 'Afrique du Sud', label: '🇿🇦 Afrique du Sud' },
  { value: 'Tanzanie', label: '🇹🇿 Tanzanie' },
  { value: 'Éthiopie', label: '🇪🇹 Éthiopie' },
  { value: 'Maroc', label: '🇲🇦 Maroc' },
];

const CATEGORIES = [
  { name: 'Tous', value: '', emoji: '🌍' },
  { name: 'Musique', value: 'MUSIC', emoji: '🎵' },
  { name: 'Sports', value: 'SPORTS', emoji: '⚽' },
  { name: 'Arts', value: 'ARTS', emoji: '🎨' },
  { name: 'Tech', value: 'TECHNOLOGY', emoji: '💻' },
  { name: 'Business', value: 'BUSINESS', emoji: '💼' },
  { name: 'Gastronomie', value: 'FOOD', emoji: '🍽️' },
  { name: 'Divertissement', value: 'ENTERTAINMENT', emoji: '🎭' },
  { name: 'Éducation', value: 'EDUCATION', emoji: '📚' },
];

const SORT_OPTIONS = [
  { value: 'date', label: 'Date (proche)' },
  { value: 'popular', label: 'Popularité' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
];

// ─── Fallback data africaine ──────────────────────────────────────────────────
const FALLBACK_EVENTS = [
  { id: 'abidjan-music-festival-2025', title: 'Abidjan Music Festival 2025', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', startDate: new Date(Date.now() + 15 * 86400000).toISOString(), venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", category: 'MUSIC', minPrice: 5000, ticketsAvailable: 17550, capacity: 50000, organizer: { companyName: 'Abidjan Productions', verified: true } },
  { id: 'afrobeats-lagos-concert-2025', title: 'Afrobeats Lagos Concert', coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', startDate: new Date(Date.now() + 10 * 86400000).toISOString(), venueCity: 'Lagos', venueCountry: 'Nigeria', category: 'MUSIC', minPrice: 5000, ticketsAvailable: 15000, capacity: 80000, organizer: { companyName: 'Lagos Vibes', verified: true } },
  { id: 'dakar-music-week-2025', title: 'Dakar Music Week 2025', coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', startDate: new Date(Date.now() + 20 * 86400000).toISOString(), venueCity: 'Dakar', venueCountry: 'Sénégal', category: 'MUSIC', minPrice: 3000, ticketsAvailable: 6100, capacity: 25000, organizer: { companyName: 'Dakar Événements', verified: true } },
  { id: 'nuit-mode-abidjan-2025', title: 'Nuit de la Mode Abidjan', coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', startDate: new Date(Date.now() + 22 * 86400000).toISOString(), venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", category: 'ARTS', minPrice: 25000, ticketsAvailable: 180, capacity: 800, organizer: { companyName: 'Abidjan Productions', verified: true } },
  { id: 'tech-africa-abidjan-2025', title: 'Conférence Tech Africa', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', startDate: new Date(Date.now() + 30 * 86400000).toISOString(), venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", category: 'TECHNOLOGY', minPrice: 0, ticketsAvailable: 550, capacity: 2000, organizer: { companyName: 'Abidjan Productions', verified: true } },
  { id: 'douala-jazz-blues-festival-2025', title: 'Douala Jazz & Blues Festival', coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80', startDate: new Date(Date.now() + 35 * 86400000).toISOString(), venueCity: 'Douala', venueCountry: 'Cameroun', category: 'MUSIC', minPrice: 5000, ticketsAvailable: 5200, capacity: 15000, organizer: { companyName: 'Douala Events Pro', verified: true } },
];

interface Event {
  id: string;
  title: string;
  coverImage: string;
  startDate: string;
  venueCity: string;
  venueCountry: string;
  category: string;
  minPrice: number;
  ticketsAvailable: number;
  capacity: number;
  organizer?: { companyName: string; verified: boolean };
}

interface Meta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface Props {
  initialEvents: Event[];
  initialMeta: Meta;
  searchParams: Record<string, string | undefined>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EventsPageClient({ initialEvents, initialMeta, searchParams }: Props) {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>(initialEvents?.length ? initialEvents : FALLBACK_EVENTS);
  const [meta, setMeta] = useState<Meta>(initialMeta || { total: FALLBACK_EVENTS.length, page: 1, totalPages: 1, limit: 20 });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [search, setSearch] = useState(searchParams.search || '');
  const [country, setCountry] = useState(searchParams.country || '');
  const [category, setCategory] = useState(searchParams.category || '');
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'date');
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');
  const [isFree, setIsFree] = useState(searchParams.isFree === 'true');
  const [page, setPage] = useState(Number(searchParams.page || 1));

  // Geolocation
  const [userCountry, setUserCountry] = useState('');

  useEffect(() => {
    // Try to get user's country from geolocation
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tikeo_country');
      if (stored) setUserCountry(stored);
    }
  }, []);

  const buildParams = useCallback((overrides: Record<string, string | undefined | boolean> = {}) => {
    const p: Record<string, string> = {};
    const s = overrides.search !== undefined ? String(overrides.search) : search;
    const c = overrides.country !== undefined ? String(overrides.country) : country;
    const cat = overrides.category !== undefined ? String(overrides.category) : category;
    const sort = overrides.sortBy !== undefined ? String(overrides.sortBy) : sortBy;
    const pg = overrides.page !== undefined ? String(overrides.page) : String(page);
    const free = overrides.isFree !== undefined ? overrides.isFree : isFree;
    const mn = overrides.minPrice !== undefined ? String(overrides.minPrice) : minPrice;
    const mx = overrides.maxPrice !== undefined ? String(overrides.maxPrice) : maxPrice;

    if (s) p.search = s;
    if (c) p.country = c;
    if (cat) p.category = cat;
    if (sort && sort !== 'date') p.sortBy = sort;
    if (pg && pg !== '1') p.page = pg;
    if (free) p.isFree = 'true';
    if (mn) p.minPrice = mn;
    if (mx) p.maxPrice = mx;
    if (userCountry) p.userCountry = userCountry;

    return p;
  }, [search, country, category, sortBy, page, isFree, minPrice, maxPrice, userCountry]);

  const fetchEvents = useCallback(async (params: Record<string, string>) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await fetch(`${API_URL}/api/events?${qs}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.data || data || []);
        setMeta(data.meta || { total: (data.data || data || []).length, page: 1, totalPages: 1, limit: 20 });
      } else {
        setEvents(FALLBACK_EVENTS);
      }
    } catch {
      setEvents(FALLBACK_EVENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback((overrides: Record<string, string | undefined | boolean> = {}) => {
    const params = buildParams({ ...overrides, page: '1' });
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    router.push(`/events${qs ? `?${qs}` : ''}`);
    fetchEvents(params as Record<string, string>);
    setPage(1);
  }, [buildParams, router, fetchEvents]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  const handleCategoryClick = (val: string) => {
    setCategory(val);
    applyFilters({ category: val });
  };

  const handleCountryChange = (val: string) => {
    setCountry(val);
    applyFilters({ country: val });
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    applyFilters({ sortBy: val });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = buildParams({ page: String(newPage) });
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    router.push(`/events${qs ? `?${qs}` : ''}`);
    fetchEvents(params as Record<string, string>);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearch(''); setCountry(''); setCategory(''); setSortBy('date');
    setMinPrice(''); setMaxPrice(''); setIsFree(false); setPage(1);
    router.push('/events');
    fetchEvents({});
  };

  const hasActiveFilters = search || country || category || isFree || minPrice || maxPrice;

  const formatPrice = (price: number, currency = 'XOF') => {
    if (price === 0) return 'Gratuit';
    if (currency === 'NGN') return `₦${price.toLocaleString()}`;
    if (currency === 'GHS') return `GH₵${price.toLocaleString()}`;
    if (currency === 'KES') return `KSh${price.toLocaleString()}`;
    return `${price.toLocaleString()} FCFA`;
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const pct = (available / total) * 100;
    if (pct <= 10) return 'text-red-500';
    if (pct <= 30) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ── */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <GlobeIcon />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">Événements Africains</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Tous les événements
            </h1>
            <p className="text-xl text-white/85 max-w-2xl mx-auto">
              Découvrez les meilleurs événements à travers toute l&apos;Afrique
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── SEARCH + FILTERS BAR ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] focus-within:bg-white transition-all">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un événement, artiste, lieu..."
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
              />
              {search && (
                <button type="button" onClick={() => { setSearch(''); applyFilters({ search: '' }); }} className="text-gray-400 hover:text-gray-600">
                  <XIcon />
                </button>
              )}
            </div>

            {/* Country */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] sm:w-56">
              <MapPinIcon />
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm font-medium cursor-pointer"
              >
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm font-medium cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all hover:opacity-90 text-sm"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
            >
              <SearchIcon />
              Rechercher
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${showFilters ? 'border-[#5B7CFF] text-[#5B7CFF] bg-[#5B7CFF]/5' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              <FilterIcon />
              Filtres
              {hasActiveFilters && <span className="w-2 h-2 bg-[#5B7CFF] rounded-full" />}
            </button>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Prix min (FCFA)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => applyFilters({ minPrice })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#5B7CFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Prix max (FCFA)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => applyFilters({ maxPrice })}
                  placeholder="Illimité"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#5B7CFF] outline-none"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => { setIsFree(!isFree); applyFilters({ isFree: !isFree }); }}
                    className={`w-12 h-6 rounded-full transition-all relative ${isFree ? 'bg-[#5B7CFF]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isFree ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Événements gratuits uniquement</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat.value
                  ? 'text-white shadow-lg shadow-[#5B7CFF]/30'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#5B7CFF] hover:text-[#5B7CFF]'
              }`}
              style={category === cat.value ? { background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' } : {}}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── RESULTS HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-gray-600">
              <span className="font-bold text-gray-900 text-lg">{meta.total}</span>
              <span className="ml-1">événement{meta.total > 1 ? 's' : ''} trouvé{meta.total > 1 ? 's' : ''}</span>
            </p>
            {userCountry && (
              <span className="flex items-center gap-1 px-3 py-1 bg-[#5B7CFF]/10 text-[#5B7CFF] rounded-full text-xs font-semibold">
                <MapPinIcon />
                Trié par proximité
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
            >
              <XIcon />
              Réinitialiser
            </button>
          )}
        </div>

        {/* ── EVENTS GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {events.map((event) => {
                const availPct = event.capacity > 0 ? (event.ticketsAvailable / event.capacity) * 100 : 100;
                const isAlmostFull = availPct <= 15;
                const eventDate = new Date(event.startDate);

                return (
                  <Link key={event.id} href={`/events/${event.id}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={event.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-full">
                            {CATEGORIES.find(c => c.value === event.category)?.emoji} {event.category}
                          </span>
                        </div>
                        {/* Availability badge */}
                        {isAlmostFull && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                              Presque complet !
                            </span>
                          </div>
                        )}
                        {/* Price badge */}
                        <div className="absolute bottom-3 right-3">
                          <span className="px-3 py-1.5 bg-white text-gray-900 text-sm font-bold rounded-full shadow-lg">
                            {formatPrice(event.minPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-[#5B7CFF] transition-colors">
                          {event.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1.5">
                          <CalendarIcon />
                          <span>{eventDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                          <MapPinIcon />
                          <span>{event.venueCity}, {event.venueCountry}</span>
                        </div>

                        {/* Organizer + availability */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5">
                            {event.organizer?.verified && (
                              <span className="text-[#5B7CFF]">✓</span>
                            )}
                            <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                              {event.organizer?.companyName || 'Organisateur'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TicketIcon />
                            <span className={`text-xs font-semibold ${getAvailabilityColor(event.ticketsAvailable, event.capacity)}`}>
                              {event.ticketsAvailable > 0
                                ? `${event.ticketsAvailable.toLocaleString()} places`
                                : 'Complet'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ── PAGINATION ── */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeftIcon /> Précédent
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(meta.totalPages, 7) }, (_, i) => {
                    const pg = i + 1;
                    return (
                      <button
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          pg === page
                            ? 'text-white shadow-lg'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-[#5B7CFF] hover:text-[#5B7CFF]'
                        }`}
                        style={pg === page ? { background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' } : {}}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === meta.totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Suivant <ChevronRightIcon />
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── EMPTY STATE ── */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun événement trouvé</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Essayez de modifier vos filtres ou explorez d&apos;autres pays africains
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-xl transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
            >
              <FilterIcon />
              Voir tous les événements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
