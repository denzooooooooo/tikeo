'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface Event {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  startDate: string;
  venueCity: string;
  venueCountry: string;
  ticketsSold: number;
  capacity: number;
  coverImage: string;
  organizer: {
    id: string;
    companyName: string;
    user: { email: string };
  };
  _count: {
    tickets: number;
    orders: number;
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (parsedToken?.accessToken) {
          headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
        });
        if (statusFilter) params.append('status', statusFilter);
        if (search) params.append('search', search);

        const response = await fetch(`${API_URL}/admin/events?${params}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des événements');
        }

        const data = await response.json();
        setEvents(data.events);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Demo data
        setEvents([
          {
            id: '1', title: 'MASA 2025', slug: 'masa-2025', status: 'PUBLISHED', category: 'Festival',
            startDate: '2025-03-10', venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire",
            ticketsSold: 1250, capacity: 5000, coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            organizer: { id: '1', companyName: 'Tikeo Events', user: { email: 'contact@tikeo.com' } },
            _count: { tickets: 5, orders: 850 }
          },
          {
            id: '2', title: 'Dakar Jazz Festival', slug: 'dakar-jazz-2025', status: 'DRAFT', category: 'Music',
            startDate: '2025-04-05', venueCity: 'Dakar', venueCountry: 'Sénégal',
            ticketsSold: 0, capacity: 2000, coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
            organizer: { id: '2', companyName: 'Dakar Events', user: { email: 'contact@dakar.com' } },
            _count: { tickets: 3, orders: 0 }
          },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, statusFilter, search]);

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; className: string }> = {
      PUBLISHED: { label: 'Publié', className: 'bg-green-100 text-green-700' },
      DRAFT: { label: 'Brouillon', className: 'bg-gray-100 text-gray-600' },
      CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-600' },
      COMPLETED: { label: 'Terminé', className: 'bg-blue-100 text-blue-600' },
    };
    const s = statuses[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.className}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-500 mt-1">Gérer tous les événements de la plateforme</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        >
          <option value="">Tous les statuts</option>
          <option value="PUBLISHED">Publié</option>
          <option value="DRAFT">Brouillon</option>
          <option value="CANCELLED">Annulé</option>
          <option value="COMPLETED">Terminé</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                <div className="w-16 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Éénement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Billets</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => {
                  const soldPct = event.capacity > 0 ? Math.round((event.ticketsSold / event.capacity) * 100) : 0;
                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg bg-gray-100 overflow-hidden">
                            {event.coverImage && (
                              <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.venueCity}, {event.venueCountry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{event.organizer.companyName}</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${soldPct}%`, backgroundColor: soldPct >= 80 ? '#ef4444' : '#5B7CFF' }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{event.ticketsSold}/{event.capacity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/events/${event.slug}`}
                          className="text-[#5B7CFF] hover:underline text-sm font-medium"
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-600">Page {page} sur {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

