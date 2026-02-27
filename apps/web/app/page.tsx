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

// Données africaines de fallback (utilisées si l'API n'est pas disponible)
const AFRICAN_FEATURED_EVENTS = [
  {
    id: '1',
    title: 'MASA 2025 — Marché des Arts du Spectacle',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    startDate: '2025-03-10T18:00:00',
    venueCity: 'Abidjan',
    venueCountry: 'Côte d\'Ivoire',
    category: 'Festival',
    price: 5000,
    description: 'Le plus grand marché des arts du spectacle d\'Afrique. Danse, théâtre, musique et cirque.',
  },
  {
    id: '2',
    title: 'Dakar Jazz Festival',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    startDate: '2025-04-05T20:00:00',
    venueCity: 'Dakar',
    venueCountry: 'Sénégal',
    category: 'Concert',
    price: 15000,
    description: 'Festival international de jazz avec les meilleurs artistes africains et internationaux.',
  },
  {
    id: '3',
    title: 'Lagos Music Festival',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    startDate: '2025-05-20T21:00:00',
    venueCity: 'Lagos',
    venueCountry: 'Nigeria',
    category: 'Festival',
    price: 8000,
    description: 'Le festival de musique le plus attendu de l\'Afrique de l\'Ouest. Afrobeats, Highlife et plus.',
  },
  {
    id: '4',
    title: 'Afrobeats Summit Accra',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    startDate: '2025-06-15T19:00:00',
    venueCity: 'Accra',
    venueCountry: 'Ghana',
    category: 'Conférence',
    price: 25000,
    description: 'Le sommet mondial de l\'Afrobeats. Networking, panels et performances live.',
  },
  {
    id: '5',
    title: 'Fête de la Musique — Douala',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1920&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    startDate: '2025-06-21T17:00:00',
    venueCity: 'Douala',
    venueCountry: 'Cameroun',
    category: 'Concert',
    price: 0,
    description: 'Célébration gratuite de la musique dans toute la ville. Scènes ouvertes et concerts.',
  },
];

const AFRICAN_NEARBY_EVENTS = [
  {
    id: '1',
    title: 'MASA 2025',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    startDate: '2025-03-10T18:00:00',
    venueCity: 'Abidjan',
    venueCountry: 'Côte d\'Ivoire',
    category: 'Festival',
    price: 5000,
    description: 'Marché des Arts du Spectacle Africain',
    organizer: { companyName: 'Abidjan Productions', logo: null, verified: true },
    ticketTypes: [{ price: 5000 }],
  },
  {
    id: '2',
    title: 'Dakar Jazz Festival',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    startDate: '2025-04-05T20:00:00',
    venueCity: 'Dakar',
    venueCountry: 'Sénégal',
    category: 'Concert',
    price: 15000,
    description: 'Festival international de jazz',
    organizer: { companyName: 'Dakar Events', logo: null, verified: true },
    ticketTypes: [{ price: 15000 }],
  },
  {
    id: '3',
    title: 'Lagos Music Festival',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    startDate: '2025-05-20T21:00:00',
    venueCity: 'Lagos',
    venueCountry: 'Nigeria',
    category: 'Festival',
    price: 8000,
    description: 'Le festival de musique le plus attendu',
    organizer: { companyName: 'Lagos Entertainment', logo: null, verified: true },
    ticketTypes: [{ price: 8000 }],
  },
  {
    id: '4',
    title: 'Afrobeats Summit',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    startDate: '2025-06-15T19:00:00',
    venueCity: 'Accra',
    venueCountry: 'Ghana',
    category: 'Conférence',
    price: 25000,
    description: 'Le sommet mondial de l\'Afrobeats',
    organizer: { companyName: 'Ghana Events Co.', logo: null, verified: true },
    ticketTypes: [{ price: 25000 }],
  },
  {
    id: '5',
    title: 'Fête de la Musique',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    startDate: '2025-06-21T17:00:00',
    venueCity: 'Douala',
    venueCountry: 'Cameroun',
    category: 'Concert',
    price: 0,
    description: 'Célébration gratuite de la musique',
    organizer: { companyName: 'Douala Culture', logo: null, verified: false },
    ticketTypes: [{ price: 0 }],
  },
  {
    id: '6',
    title: 'Nairobi Tech Summit',
    coverImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80',
    teaserVideo: null,
    startDate: '2025-07-10T09:00:00',
    venueCity: 'Nairobi',
    venueCountry: 'Kenya',
    category: 'Conférence',
    price: 50000,
    description: 'Le plus grand sommet tech d\'Afrique de l\'Est',
    organizer: { companyName: 'Kenya Tech Events', logo: null, verified: true },
    ticketTypes: [{ price: 50000 }],
  },
];

async function getFeaturedEvents() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/events/featured?limit=5`, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (!data || data.length === 0) return AFRICAN_FEATURED_EVENTS;
    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      coverImage: e.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80',
      teaserVideo: e.teaserVideo || null,
      startDate: e.startDate,
      venueCity: e.venueCity,
      venueCountry: e.venueCountry,
      category: e.category,
      price: e.ticketTypes?.[0]?.price ?? 0,
      description: e.description,
    }));
  } catch {
    return AFRICAN_FEATURED_EVENTS;
  }
}

async function getNearbyEvents() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/events?limit=6&page=1`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    if (!data?.data || data.data.length === 0) return AFRICAN_NEARBY_EVENTS;
    return data.data;
  } catch {
    return AFRICAN_NEARBY_EVENTS;
  }
}

export default async function HomePage() {
  const [featuredEvents, nearbyEvents] = await Promise.all([
    getFeaturedEvents(),
    getNearbyEvents(),
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
      <HomeCategoriesSection />

      {/* Concours & Votes */}
      <HomeContestsSection />

      {/* Pourquoi Tikeo */}
      <HomeFeaturesSection />

      {/* Stats */}
      <HomeStatsSection />

      {/* Comment ça marche */}
      <HomeHowItWorksSection />

      {/* Organisateurs */}
      <HomeOrganizersSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA Final */}
      <HomeCTASection />
    </div>
  );
}
