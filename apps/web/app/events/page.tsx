import { Metadata } from 'next';
import { Suspense } from 'react';
import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = {
  title: 'Événements Africains | Tikeo',
  description: 'Découvrez les meilleurs événements à travers toute l\'Afrique. Concerts, festivals, conférences tech, gastronomie et plus encore.',
  keywords: 'événements afrique, concerts abidjan, festivals dakar, lagos events, tikeo',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    const res = await fetch(`${API_URL}/events?${qs}`, {
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
      data: [],
      meta: { total: 0, page: 1, totalPages: 1, limit: 20 },
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

