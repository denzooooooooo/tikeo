'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusIcon, 
  CalendarIcon, 
  LocationIcon, 
  TicketIcon,
  DollarIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  MoreVerticalIcon,
  SearchIcon,
  FilterIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@tikeo/ui';

interface Event {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  startDate: string;
  venueCity: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketsSold: number;
  revenue: number;
  views: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Festival Jazz Paris 2024',
    slug: 'festival-jazz-paris-2024',
    coverImage: 'https://picsum.photos/seed/jazz/400/300',
    startDate: '2024-06-15',
    venueCity: 'Paris',
    status: 'PUBLISHED',
    ticketsSold: 1250,
    revenue: 56250,
    views: 15420,
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    slug: 'tech-conference-2024',
    coverImage: 'https://picsum.photos/seed/tech/400/300',
    startDate: '2024-09-20',
    venueCity: 'Lyon',
    status: 'PUBLISHED',
    ticketsSold: 850,
    revenue: 42500,
    views: 8900,
  },
  {
    id: '3',
    title: 'Electronic Music Festival',
    slug: 'electronic-music-festival',
    coverImage: 'https://picsum.photos/seed/electro/400/300',
    startDate: '2024-07-22',
    venueCity: 'Marseille',
    status: 'DRAFT',
    ticketsSold: 0,
    revenue: 0,
    views: 0,
  },
  {
    id: '4',
    title: 'Art Exhibition 2024',
    slug: 'art-exhibition-2024',
    coverImage: 'https://picsum.photos/seed/art/400/300',
    startDate: '2024-05-10',
    venueCity: 'Bordeaux',
    status: 'COMPLETED',
    ticketsSold: 2100,
    revenue: 31500,
    views: 25000,
  },
];

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
};

export default function DashboardEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [events, setEvents] = useState(mockEvents);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    events: events.length,
    published: events.filter((e) => e.status === 'PUBLISHED').length,
    totalTickets: events.reduce((acc, e) => acc + e.ticketsSold, 0),
    totalRevenue: events.reduce((acc, e) => acc + e.revenue, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Mes Événements
              </h1>
              <p className="text-xl text-white/90">
                Gérez et suivez vos événements
              </p>
            </div>
            <Link
              href="/dashboard/events/create"
              className="flex items-center gap-2 px-6 py-4 bg-white text-[#5B7CFF] rounded-xl hover:shadow-2xl transition-all duration-200 font-bold"
            >
              <PlusIcon size={20} />
              Créer un événement
            </Link>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#5B7CFF]/10 rounded-lg">
                <CalendarIcon className="text-[#5B7CFF]" size={20} />
              </div>
              <span className="text-gray-600 text-sm">Total événements</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalStats.events}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUpIcon className="text-green-600" size={20} />
              </div>
              <span className="text-gray-600 text-sm">Publiés</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalStats.published}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TicketIcon className="text-purple-600" size={20} />
              </div>
              <span className="text-gray-600 text-sm">Billets vendus</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalStats.totalTickets.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarIcon className="text-orange-600" size={20} />
              </div>
              <span className="text-gray-600 text-sm">Revenus totaux</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalStats.totalRevenue.toLocaleString()}€</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
          >
            <option value="all">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Événement</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Billets</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Revenus</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Vues</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={event.coverImage}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{event.title}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <LocationIcon size={14} />
                            {event.venueCity}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon size={16} />
                        {new Date(event.startDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                        {statusLabels[event.status]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <TicketIcon size={16} className="text-gray-400" />
                        {event.ticketsSold.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-900 font-bold">
                        <DollarIcon size={16} className="text-green-500" />
                        {event.revenue.toLocaleString()}€
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <EyeIcon size={16} />
                        {event.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/events/${event.slug}`}
                          className="p-2 text-gray-600 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <EyeIcon size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/events/${event.id}/edit`}
                          className="p-2 text-gray-600 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <EditIcon size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/events/${event.id}/analytics`}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Analytics"
                        >
                          <TrendingUpIcon size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 mb-6">Commencez par créer votre premier événement</p>
              <Link
                href="/dashboard/events/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
              >
                <PlusIcon size={20} />
                Créer un événement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

