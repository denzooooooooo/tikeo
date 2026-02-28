import HeroCarousel from './components/HeroCarousel';
import Link from 'next/link';
import NearbyEventsSection from './components/NearbyEventsSection';
import HomeCategoriesSection from './components/HomeCategoriesSection';
import HomeCountriesSection from './components/HomeCountriesSection';
import HomeContestsSection from './components/HomeContestsSection';
import HomeFeaturesSection from './components/HomeFeaturesSection';
import NewsletterSection from './components/NewsletterSection';
import {
  HomeStatsSection,
  HomeHowItWorksSection,
  HomeOrganizersSection,
  HomeCTASection,
} from './components/HomeBottomSections';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getFeaturedEvents() {
  try {
    const res = await fetch(`${API_URL}/events/featured?limit=5`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || data.length === 0) return [];
    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      coverImage: e.coverImage || null,
      teaserVideo: e.teaserVideo || null,
      startDate: e.startDate,
      venueCity: e.venueCity,
      venueCountry: e.venueCountry,
      category: e.category,
      price: e.ticketTypes?.[0]?.price ?? 0,
      description: e.description,
    }));
  } catch {
    return [];
  }
}

async function getNearbyEvents() {
  try {
    const res = await fetch(`${API_URL}/events?limit=6&page=1`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

async function getContests() {
  try {
    const res = await fetch(`${API_URL}/contests?limit=3&status=ACTIVE`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.contests || data || [];
  } catch {
    return [];
  }
}

async function getFeaturedOrganizers() {
  try {
    const res = await fetch(`${API_URL}/organizers?limit=4`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.organizers || data || [];
  } catch {
    return [];
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
  const [featuredEvents, nearbyEvents, contests, organizers, categoryCounts] = await Promise.all([
    getFeaturedEvents(),
    getNearbyEvents(),
    getContests(),
    getFeaturedOrganizers(),
    getCategoryCounts(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel — Teaser plein écran */}
      <HeroCarousel events={featuredEvents} />

      {/* Barre de recherche rapide */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] focus-within:bg-white transition-all">
              <svg className="text-gray-400 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" placeholder="Rechercher un événement, artiste, lieu..." className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-sm" />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] focus-within:bg-white transition-all sm:w-52">
              <svg className="text-gray-400 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
              <input type="text" placeholder="Ville ou pays" className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-sm" />
            </div>
            <Link
              href="/events"
              className="flex items-center justify-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5B7CFF]/30 text-sm sm:text-base flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <span>Rechercher</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-2 px-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs text-gray-400 font-medium flex-shrink-0">Populaire :</span>
            {['Concerts', 'Festivals', 'Sports', 'Conférences', 'Gratuit', 'Abidjan', 'Dakar', 'Lagos'].map((tag) => (
              <Link
                key={tag}
                href={`/events?${tag === 'Abidjan' || tag === 'Dakar' || tag === 'Lagos' ? `city=${tag}` : `category=${tag}`}`}
                className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-[#5B7CFF]/10 hover:text-[#5B7CFF] text-gray-600 rounded-full text-xs font-semibold transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 15 pays africains */}
      <HomeCountriesSection />

      {/* Événements à proximité avec teaser au survol */}
      <NearbyEventsSection events={nearbyEvents} />

      {/* Catégories */}
      <HomeCategoriesSection categoryCounts={categoryCounts} />

      {/* Concours & Votes */}
      <HomeContestsSection contests={contests} />

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
