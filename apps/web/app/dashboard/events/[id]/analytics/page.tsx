'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftIcon,
  TrendingUpIcon,
  UsersIcon,
  TicketIcon,
  DollarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  LocationIcon,
  StarIcon,
} from '@tikeo/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockEvent = {
  id: '1',
  title: 'Festival Jazz Paris 2024',
  slug: 'festival-jazz-paris-2024',
  coverImage: 'https://picsum.photos/seed/jazz/1200/400',
  startDate: '2024-06-15',
  venueName: 'Parc des Expositions',
  venueCity: 'Paris',
  category: 'Musique',
  status: 'PUBLISHED',
};

const mockAnalytics = {
  overview: {
    totalViews: 15420,
    uniqueVisitors: 8920,
    pageViewsGrowth: 12.5,
    visitorsGrowth: 8.3,
  },
  tickets: {
    sold: 1250,
    total: 2000,
    revenue: 56250,
    growth: 15.2,
  },
  social: {
    likes: 856,
    shares: 234,
    comments: 89,
    likesGrowth: 5.4,
  },
};

const mockDailyStats = [
  { date: '2024-01-01', views: 1200, tickets: 45 },
  { date: '2024-01-02', views: 1450, tickets: 52 },
  { date: '2024-01-03', views: 1320, tickets: 48 },
  { date: '2024-01-04', views: 1680, tickets: 65 },
  { date: '2024-01-05', views: 1890, tickets: 78 },
  { date: '2024-01-06', views: 2100, tickets: 92 },
  { date: '2024-01-07', views: 1950, tickets: 85 },
];

const mockTopCities = [
  { city: 'Paris', tickets: 450, percentage: 36 },
  { city: 'Lyon', tickets: 180, percentage: 14 },
  { city: 'Marseille', tickets: 150, percentage: 12 },
  { city: 'Toulouse', tickets: 120, percentage: 10 },
  { city: 'Bordeaux', tickets: 95, percentage: 8 },
];

const mockTicketTypes = [
  { name: 'Standard', sold: 850, total: 1200, revenue: 38250 },
  { name: 'VIP', sold: 280, total: 500, revenue: 14000 },
  { name: 'Premium', sold: 120, total: 300, revenue: 4000 },
];

export default function EventAnalyticsPage({ params }: PageProps) {
  const { id } = use(params);
  
  const maxViews = Math.max(...mockDailyStats.map(d => d.views));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeftIcon size={20} />
            Retour aux événements
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={mockEvent.coverImage}
                alt={mockEvent.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                  {mockEvent.category}
                </span>
                <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                  Publié
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {mockEvent.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} />
                  {new Date(mockEvent.startDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon size={18} />
                  {mockEvent.venueName}, {mockEvent.venueCity}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Vues totales"
            value={mockAnalytics.overview.totalViews.toLocaleString()}
            growth={mockAnalytics.overview.pageViewsGrowth}
            icon={EyeIcon}
            color="blue"
          />
          <StatCard
            title="Visiteurs uniques"
            value={mockAnalytics.overview.uniqueVisitors.toLocaleString()}
            growth={mockAnalytics.overview.visitorsGrowth}
            icon={UsersIcon}
            color="purple"
          />
          <StatCard
            title="Billets vendus"
            value={mockAnalytics.tickets.sold.toLocaleString()}
            growth={mockAnalytics.tickets.growth}
            icon={TicketIcon}
            color="green"
          />
          <StatCard
            title="Revenus"
            value={`${mockAnalytics.tickets.revenue.toLocaleString()}€`}
            growth={mockAnalytics.tickets.growth}
            icon={DollarIcon}
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Vues quotidiennes</h3>
            <div className="h-64 flex items-end gap-2">
              {mockDailyStats.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#5B7CFF] to-[#7B61FF] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(day.views / maxViews) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets Sales Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Ventes de billets</h3>
            <div className="h-64 flex items-end gap-2">
              {mockDailyStats.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(day.tickets / 100) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Cities */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top villes</h3>
            <div className="space-y-4">
              {mockTopCities.map((city, index) => (
                <div key={city.city}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{city.city}</span>
                    <span className="text-sm text-gray-600">{city.tickets} billets ({city.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] rounded-full"
                      style={{ width: `${city.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Types */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Types de billets</h3>
            <div className="space-y-4">
              {mockTicketTypes.map((type) => (
                <div key={type.name} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{type.name}</span>
                    <span className="text-sm text-gray-600">
                      {type.sold} / {type.total}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      style={{ width: `${(type.sold / type.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-green-600">{type.revenue.toLocaleString()}€</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Engagement social</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
              <div className="p-3 bg-red-100 rounded-lg">
                <HeartIcon className="text-red-500" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.social.likes}</p>
                <p className="text-sm text-gray-600">J'aime</p>
              </div>
              <span className="ml-auto text-green-600 text-sm font-medium flex items-center">
                <TrendingUpIcon size={16} className="mr-1" />
                +{mockAnalytics.social.likesGrowth}%
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShareIcon className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.social.shares}</p>
                <p className="text-sm text-gray-600">Partages</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.social.comments}</p>
                <p className="text-sm text-gray-600">Commentaires</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  growth,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  growth: number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl text-white`}>
          <Icon size={24} />
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <TrendingUpIcon size={16} />
          +{growth}%
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

