// Force dynamic rendering on every request — no CDN caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import HeroCarousel from './components/HeroCarousel';
import HomeSearchBar from './components/HomeSearchBar';
import NearbyEventsSection from './components/NearbyEventsSection';
import HomeCategoriesSection from './components/HomeCategoriesSection';
import HomeCountriesSection from './components/HomeCountriesSection';
import HomeFeaturesSection from './components/HomeFeaturesSection';
import NewsletterSection from './components/NewsletterSection';
import {
  HomeStatsSection,
  HomeHowItWorksSection,
  HomeOrganizersSection,
  HomeCTASection,
} from './components/HomeBottomSections';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

async function getFeaturedEvents() {
  try {
    const res = await fetch(`${API_URL}/events?limit=6&sortBy=popular`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const response = await res.json();
    const data = response.data || response || [];
    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      coverImage: e.coverImage || null,
      teaserVideo: e.teaserVideo || null,
      startDate: e.startDate,
      venueCity: e.venueCity,
      venueCountry: e.venueCountry,
      category: e.category,
      price: e.ticketTypes?.[0]?.price ?? e.minPrice ?? 0,
      description: e.description,
    }));
  } catch {
    return [];
  }
}

async function getNearbyEvents() {
  try {
    const res = await fetch(`${API_URL}/events?limit=8&page=1`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const response = await res.json();
    const data = response.data || response || [];
    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      coverImage: e.coverImage || 'https://picsum.photos/seed/event/400/300',
      teaserVideo: e.teaserVideo || null,
      startDate: e.startDate,
      city: e.venueCity,
      price: e.ticketTypes?.[0]?.price ?? e.minPrice ?? 0,
      category: e.category,
      organizer: e.organizer?.companyName || 'Organisateur',
      organizerId: e.organizer?.id || null,
      organizerUserId: e.organizer?.userId || null,
      ticketsLeft: e.ticketsAvailable ?? e.capacity,
      totalTickets: e.capacity ?? 100,
    }));
  } catch {
    return [];
  }
}

async function getFeaturedOrganizers() {
  try {
    const res = await fetch(`${API_URL}/organizers?limit=4&sortBy=popular`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const organizers = data?.organizers || data || [];
    
    // Enrich with additional data
    return organizers.map((o: any) => ({
      id: o.id,
      companyName: o.companyName,
      name: o.name,
      logo: o.logo,
      image: o.image,
      verified: o.verified,
      rating: o.rating,
      _count: {
        events: o.eventsCount || o._count?.events || 0,
        subscribers: o.subscribersCount || o._count?.subscribers || 0,
      },
    }));
  } catch {
    return [];
  }
}

async function getCountryCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API_URL}/events/countries/counts`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data || {};
  } catch {
    return {};
  }
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const categoryNames = ['Concerts', 'Festivals', 'Spectacles', 'Sports', 'Conférences', 'Expositions', 'Gastronomie', 'Famille'];
  try {
    const results = await Promise.all(
      categoryNames.map(async (cat) => {
        try {
          const res = await fetch(
            `${API_URL}/events?category=${encodeURIComponent(cat)}&limit=1`,
            { next: { revalidate: 3600 } }
          );
          if (!res.ok) return [cat, 0] as [string, number];
          const data = await res.json();
          return [cat, data.total ?? data.count ?? 0] as [string, number];
        } catch {
          return [cat, 0] as [string, number];
        }
      })
    );
    return Object.fromEntries(results);
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [featuredEvents, nearbyEvents, organizers, categoryCounts, countryCounts] = await Promise.all([
    getFeaturedEvents(),
    getNearbyEvents(),
    getFeaturedOrganizers(),
    getCategoryCounts(),
    getCountryCounts(),
  ]);
 
 
  
 
  return (
    <div className="min-h-screen">
      {/* Hero Carousel — Teaser plein écran */}
      <HeroCarousel events={featuredEvents} />

      {/* Barre de recherche rapide */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <HomeSearchBar />
      </div>

      {/* 15 pays africains */}
      <HomeCountriesSection countryCounts={countryCounts} />

      {/* Événements à proximité avec teaser au survol */}
      <NearbyEventsSection events={nearbyEvents} />

      {/* Catégories */}
      <HomeCategoriesSection categoryCounts={categoryCounts} />

      {/* Pourquoi Tikeo */}
      <HomeFeaturesSection />

      {/* Stats */}
      <HomeStatsSection />

      {/* Comment ça marche */}
      <HomeHowItWorksSection />

      {/* Organisateurs */}
      <HomeOrganizersSection organizers={organizers} />

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA Final */}
      <HomeCTASection />
    </div>
  );
}
