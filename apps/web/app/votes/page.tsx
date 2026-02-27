'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner, ErrorAlert, EmptyState } from "@tikeo/ui";
import { ContestCard } from "@tikeo/ui";
import {
  SearchIcon,
  TrophyIcon,
  UsersIcon,
  VoteIcon,
  TargetIcon,
  MusicIcon,
  DanceIcon,
  CameraIcon,
  ArtIcon,
  FlameIcon,
  TrendingUpIcon,
  StarIcon,
  ChevronRightIcon,
  CalendarIcon,
  FilterIcon,
} from "@tikeo/ui";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
interface Contest {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  coverImage?: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  prize?: string;
  organizerId: string;
  maxContestants?: number;
  currentContestants?: number;
  votesPerUser?: number;
  isPublicResults?: boolean;
  isFeatured?: boolean;
  votesCount?: number;
  isTrending?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ContestStats {
  totalContests: number;
  totalParticipants: number;
  totalVotes: number;
  totalPrize: string;
}

const categories = [
  { id: "all", name: "Tous", icon: TargetIcon, color: "bg-gray-100 text-gray-700" },
  { id: "MUSIC", name: "Musique", icon: MusicIcon, color: "bg-purple-100 text-purple-700" },
  { id: "DANCE", name: "Danse", icon: DanceIcon, color: "bg-pink-100 text-pink-700" },
  { id: "PHOTOGRAPHY", name: "Photo", icon: CameraIcon, color: "bg-blue-100 text-blue-700" },
  { id: "ART", name: "Art", icon: ArtIcon, color: "bg-orange-100 text-orange-700" },
];

// Fetch functions
async function fetchContests(category: string = "all"): Promise<Contest[]> {
  const params = new URLSearchParams();
  if (category !== "all") {
    params.append("category", category);
  }
  params.append("status", "ACTIVE");
  
  const response = await fetch(`${API_URL}/contests?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch contests");
  }
  
  const data = await response.json();
  return data.contests || data || [];
}

async function fetchContestStats(): Promise<ContestStats> {
  const response = await fetch(`${API_URL}/contests/stats`);
  
  if (!response.ok) {
    // Return default stats if endpoint doesn't exist
    return {
      totalContests: 0,
      totalParticipants: 0,
      totalVotes: 0,
      totalPrize: "0€",
    };
  }
  
  return response.json();
}

async function fetchFeaturedContests(): Promise<Contest[]> {
  const response = await fetch(`${API_URL}/contests?isFeatured=true&status=ACTIVE`);
  
  if (!response.ok) {
    return [];
  }
  
  const data = await response.json();
  return data.contests || data || [];
}

async function fetchTrendingContests(): Promise<Contest[]> {
  const response = await fetch(`${API_URL}/contests?isTrending=true&status=ACTIVE`);
  
  if (!response.ok) {
    return [];
  }
  
  const data = await response.json();
  return data.contests || data || [];
}

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span className="tabular-nums">
      {value}{suffix}
    </span>
  );
}

// Stats Card Component
function StatsCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  const colorClasses: Record<string, string> = {
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    red: "from-red-500 to-red-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white mb-4 shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">
          <AnimatedCounter value={value} />
        </p>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
      </div>
    </div>
  );
}

// Search Bar Component
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative max-w-xl w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un concours..."
        className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Skeleton Card Component
function ContestCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white shadow-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="h-2 w-full bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function VotesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch contests with React Query
  const { 
    data: contests = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["contests", selectedCategory],
    queryFn: () => fetchContests(selectedCategory),
    staleTime: 30000,
    retry: 1,
  });

  // Fetch featured contests
  const { 
    data: featuredContests = [], 
    isLoading: loadingFeatured 
  } = useQuery({
    queryKey: ["contests", "featured"],
    queryFn: fetchFeaturedContests,
    staleTime: 30000,
  });

  // Fetch trending contests  
  const { 
    data: trendingContests = [], 
    isLoading: loadingTrending 
  } = useQuery({
    queryKey: ["contests", "trending"],
    queryFn: fetchTrendingContests,
    staleTime: 30000,
  });

  // Fetch stats
  const { 
    data: stats,
    isLoading: loadingStats 
  } = useQuery({
    queryKey: ["contests", "stats"],
    queryFn: fetchContestStats,
    staleTime: 60000,
  });

  // Filter contests by search
  const filteredContests = contests.filter((c) => {
    const matchesSearch = debouncedSearch === "" || 
      c.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.shortDescription?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesSearch;
  });

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Animated Header Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <VoteIcon className="w-4 h-4 text-white" />
              <span className="text-sm text-white/90 font-medium">Plateforme de voting #1 en France</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Concours & Votes
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Participez à nos concours et votez pour vos artistes préférés !
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-8 px-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/votes/create"
                className="group inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Créer un concours</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
              className="text-gray-50"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatsCard
              icon={TrophyIcon}
              value={loadingStats ? "..." : String(stats?.totalContests || 0)}
              label="Concours actifs"
              color="purple"
              delay={0}
            />
            <StatsCard
              icon={UsersIcon}
              value={loadingStats ? "..." : String(stats?.totalParticipants || 0)}
              label="Participants"
              color="pink"
              delay={100}
            />
            <StatsCard
              icon={VoteIcon}
              value={loadingStats ? "..." : String(stats?.totalVotes || 0)}
              label="Votes"
              color="red"
              delay={200}
            />
            <StatsCard
              icon={FlameIcon}
              value={loadingStats ? "..." : (stats?.totalPrize || "0€")}
              label="Prix à gagner"
              color="green"
              delay={300}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Error Alert */}
          {error && (
            <div className="mb-8">
              <ErrorAlert 
                message="Impossible de charger les concours. Veuillez réessayer." 
                onDismiss={() => {}}
                actionLabel="Réessayer"
                onAction={handleRetry}
              />
            </div>
          )}

          {/* Category Filters with Icons */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    isSelected 
                      ? "text-white" 
                      : `${cat.color} border border-gray-200 hover:bg-gray-50 hover:border-gray-300`
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : ""}`} />
                    <span>{cat.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Loading State with Skeleton */}
          {isLoading || loadingFeatured || loadingTrending ? (
            <>
              {/* Trending Skeleton */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg">
                    <TrendingUpIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Tendances</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <ContestCardSkeleton key={`trending-${i}`} />
                  ))}
                </div>
              </div>

              {/* Featured Skeleton */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg">
                    <StarIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Concours Vedettes</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <ContestCardSkeleton key={`featured-${i}`} />
                  ))}
                </div>
              </div>

              {/* All Contests Skeleton */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg">
                    <TargetIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Tous les concours</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ContestCardSkeleton key={`all-${i}`} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Trending Contests */}
              {trendingContests.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg">
                      <TrendingUpIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Tendances</h2>
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
                      🔥 Populaire
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingContests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest as any} />
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Contests */}
              {featuredContests.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg">
                      <StarIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Concours Vedettes</h2>
                    <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded-full">
                      ⭐ Sélectionnés
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredContests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest as any} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Contests */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg">
                    <TargetIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Tous les concours</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {filteredContests.length}
                  </span>
                </div>
                {filteredContests.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest as any} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100">
                      <SearchIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucun concours trouvé
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? `Aucun résultat pour "${searchQuery}". Essayez une autre recherche.`
                        : "Aucun concours dans cette catégorie pour le moment."}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Effacer la recherche
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 py-20">
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <TrophyIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Créez votre concours !
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Organisez votre propre concours sur Tikeo et engagez votre communauté
          </p>
          <Link
            href="/votes/create"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Commencer maintenant</span>
            <ChevronRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

