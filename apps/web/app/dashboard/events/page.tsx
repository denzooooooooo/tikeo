'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  startDate: string;
  venueCity: string;
  venueCountry: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketsSold: number;
  revenue: number;
  views: number;
  category: string;
}

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch {
    return null;
  }
}

export default function DashboardEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const fetchMyEvents = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/events/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : data.data || []);
      }
    } catch {
      showToast('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handlePublish = async (eventId: string) => {
    const token = getToken();
    if (!token) {
      showToast('Connectez-vous pour publier');
      return;
    }
    setPublishingId(eventId);
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Événement publié avec succès !');
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: 'PUBLISHED' } : e))
        );
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || 'Erreur lors de la publication');
      }
    } catch {
      showToast('Erreur de connexion');
    } finally {
      setPublishingId(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes événements</h1>
            <p className="text-gray-500 text-sm mt-1">{events.length} événement{events.length !== 1 ? 's' : ''} au total</p>
          </div>
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
            Créer un événement
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
            <svg className="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#5B7CFF]"
          >
            <option value="all">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
            <option value="CANCELLED">Annulé</option>
            <option value="COMPLETED">Terminé</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#5B7CFF]/30 border-t-[#5B7CFF] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Chargement de vos événements...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {events.length === 0 ? 'Aucun événement créé' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {events.length === 0
                ? 'Commencez par créer votre premier événement'
                : 'Modifiez vos filtres de recherche'}
            </p>
            {events.length === 0 && (
              <Link
                href="/dashboard/events/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold text-sm hover:bg-[#7B61FF] transition-colors"
              >
                Créer un événement
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Événement</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{event.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{event.venueCity}{event.venueCountry ? `, ${event.venueCountry}` : ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">
                          {new Date(event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[event.status]}`}>
                          {statusLabels[event.status]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {event.status === 'DRAFT' && (
                            <button
                              onClick={() => handlePublish(event.id)}
                              disabled={publishingId === event.id}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {publishingId === event.id ? '...' : 'Publier'}
                            </button>
                          )}
                          <Link
                            href={`/events/${event.slug || event.id}`}
                            className="p-1.5 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                          </Link>
                          <Link
                            href={`/dashboard/events/${event.id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </Link>
                          <Link
                            href={`/dashboard/events/${event.id}/analytics`}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Analytics"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
