import { Metadata } from 'next';
import { Suspense } from 'react';
import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = {
  title: 'Événements Africains | Tikeo',
  description: 'Découvrez les meilleurs événements à travers toute l\'Afrique. Concerts, festivals, conférences tech, gastronomie et plus encore.',
  keywords: 'événements afrique, concerts abidjan, festivals dakar, lagos events, tikeo',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const FALLBACK_EVENTS = [
  { id: 'abidjan-music-festival-2025', title: 'Abidjan Music Festival 2025', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', startDate: new Date(Date.now() + 15 * 86400000).toISOString(), venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", category: 'MUSIC', minPrice: 5000, ticketsAvailable: 17550, capacity: 50000, organizer: { companyName: 'Abidjan Productions', verified: true } },
  { id: 'afrobeats-lagos-concert-2025', title: 'Afrobeats Lagos Concert', coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', startDate: new Date(Date.now() + 10 * 86400000).toISOString(), venueCity: 'Lagos', venueCountry: 'Nigeria', category: 'MUSIC', minPrice: 5000, ticketsAvailable: 15000, capacity: 80000, organizer: { companyName: 'Lagos Vibes', verified: true } },
  { id: 'dakar-music-week-2025', title: 'Dakar Music Week 2025', coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', startDate: new Date(Date.now() + 20 * 86400000).toISOString(), venueCity: 'Dakar', venueCountry: 'Sénégal', category: 'MUSIC', minPrice: 3000, ticketsAvailable: 6100, capacity: 25000, organizer: { companyName: 'Dakar Événements', verified: true } },
  { id: 'nuit-mode-abidjan-2025', title: 'Nuit de la Mode Abidjan', coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', startDate: new Date(Date.now() + 22 * 86400000).toISOString(), venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", category: 'ARTS', minPrice: 25000, ticketsAvailable: 180, capacity: 800, organizer: { companyName: 'Abidjan Productions', verified: true } },
  { id: 'tech-africa-abidjan-2025', title: 'Conférence Tech Africa', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', startDate: new Date(Date.now() + 30 * 86400000).toISOString(), venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", category: 'TECHNOLOGY', minPrice: 0, ticketsAvailable: 550, capacity: 2000, organizer: { companyName: 'Abidjan Productions', verified: true } },
  { id: 'douala-jazz-blues-festival-2025', title: 'Douala Jazz & Blues Festival', coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80', startDate: new Date(Date.now() + 35 * 86400000).toISOString(), venueCity: 'Douala', venueCountry: 'Cameroun', category: 'MUSIC', minPrice: 5000, ticketsAvailable: 5200, capacity: 15000, organizer: { companyName: 'Douala Events Pro', verified: true } },
];

async function getEvents(searchParams: Record<string, string | undefined>) {
  try {
    const p: Record<string, string> = { page: searchParams.page || '1', limit: '20' };
    if (searchParams.category) p.category = searchParams.category;
    if (searchParams.search) p.search = searchParams.search;
    if (searchParams.city) p.city = searchParams.city;
    if (searchParams.country) p.country = searchParams.country;
    if (searchParams.sortBy) p.sortBy = searchParams.sortBy;
    if (searchParams.minPrice) p.minPrice = searchParams.minPrice;
    if (searchParams.maxPrice) p.maxPrice = searchParams.maxPrice;
    if (searchParams.isFree) p.isFree = searchParams.isFree;
    if (searchParams.isOnline) p.isOnline = searchParams.isOnline;

    const qs = new URLSearchParams(p).toString();
    const res = await fetch(`${API_URL}/api/events?${qs}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return {
      data: json.data || json || [],
      meta: json.meta || { total: (json.data || json || []).length, page: 1, totalPages: 1, limit: 20 },
    };
  } catch (error) {
    console.error('Events fetch error:', error);
    return {
      data: FALLBACK_EVENTS,
      meta: { total: FALLBACK_EVENTS.length, page: 1, totalPages: 1, limit: 20 },
    };
  }
}

export const dynamic = 'force-dynamic';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { data: events, meta } = await getEvents(searchParams);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5B7CFF]/30 border-t-[#5B7CFF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Chargement des événements...</p>
        </div>
      </div>
    }>
      <EventsPageClient
        initialEvents={events}
        initialMeta={meta}
        searchParams={searchParams}
      />
    </Suspense>
  );
}

