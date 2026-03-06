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
  endDate: string;
  venueCity: string;
  venueCountry: string;
  ticketsSold: number;
  ticketsAvailable: number;
  capacity: number;
  coverImage: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
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

const STATUSES = [
  { value: 'PUBLISHED', label: 'Publié', color: 'green' },
  { value: 'DRAFT', label: 'Brouillon', color: 'gray' },
  { value: 'CANCELLED', label: 'Annulé', color: 'red' },
  { value: 'COMPLETED', label: 'Terminé', color: 'blue' },
  { value: 'POSTPONED', label: 'Reporté', color: 'yellow' },
];

const STATUS_ACTIONS = [
  { value: 'PUBLISHED', label: 'Publier', color: 'green' },
  { value: 'DRAFT', label: 'Remettre en brouillon', color: 'gray' },
  { value: 'CANCELLED', label: 'Annuler', color: 'red' },
  { value: 'POSTPONED', label: 'Reporter', color: 'yellow' },
  { value: 'COMPLETED', label: 'Marquer comme terminé', color: 'blue' },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Status change modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusEvent, setStatusEvent] = useState<Event | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
      setEvents(data.events || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching events:', err);
      // Demo data fallback
      setEvents([
        {
          id: '1', title: 'MASA 2025', slug: 'masa-2025', status: 'PUBLISHED', category: 'MUSIC',
          startDate: '2025-03-10', endDate: '2025-03-15', venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire",
          ticketsSold: 1250, ticketsAvailable: 3750, capacity: 5000, coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
          minPrice: 5000, maxPrice: 50000, currency: 'XOF',
          organizer: { id: '1', companyName: 'Tikeoh Events', user: { email: 'contact@tikeo.africa' } },
          _count: { tickets: 5, orders: 850 }
        },
        {
          id: '2', title: 'Dakar Jazz Festival', slug: 'dakar-jazz-2025', status: 'DRAFT', category: 'MUSIC',
          startDate: '2025-04-05', endDate: '2025-04-07', venueCity: 'Dakar', venueCountry: 'Sénégal',
          ticketsSold: 0, ticketsAvailable: 2000, capacity: 2000, coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
          minPrice: 10000, maxPrice: 25000, currency: 'XOF',
          organizer: { id: '2', companyName: 'Dakar Events', user: { email: 'contact@dakar.sn' } },
          _count: { tickets: 3, orders: 0 }
        },
        {
          id: '3', title: 'Lagos Tech Summit', slug: 'lagos-tech-2025', status: 'PUBLISHED', category: 'TECHNOLOGY',
          startDate: '2025-05-20', endDate: '2025-05-22', venueCity: 'Lagos', venueCountry: 'Nigeria',
          ticketsSold: 890, ticketsAvailable: 110, capacity: 1000, coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
          minPrice: 15000, maxPrice: 75000, currency: 'NGN',
          organizer: { id: '3', companyName: 'Lagos Tech', user: { email: 'info@lagos.ng' } },
          _count: { tickets: 8, orders: 420 }
        },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, statusFilter, search]);

  const formatCurrency = (amount: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = STATUSES.find(s => s.value === status);
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-700',
      gray: 'bg-gray-100 text-gray-600',
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors[statusConfig?.color || 'gray']}`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  const deleteEvent = async (eventId: string) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (parsedToken?.accessToken) {
        headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
      }

      const response = await fetch(`${API_URL}/admin/events/${eventId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      // Remove event from list
      setEvents(events.filter(e => e.id !== eventId));
      setShowDeleteModal(false);
      setDeletingEvent(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setDeleting(false);
    }
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (parsedToken?.accessToken) {
        headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
      }

      const response = await fetch(`${API_URL}/admin/events/${eventId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour du statut');
      }

      // Update event in list
      setEvents(events.map(e => e.id === eventId ? { ...e, status } : e));
      setShowStatusModal(false);
      setStatusEvent(null);
      setNewStatus('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-500 mt-1">Gérer tous les événements de la plateforme</p>
        </div>
        <div className="text-sm text-gray-500">
          {events.length} événement(s)
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        >
          <option value="">Tous les statuts</option>
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
          <p className="text-yellow-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-yellow-700 hover:text-yellow-900">✕</button>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Événement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Billets</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
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
                          <div className="w-14 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
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
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {event.ticketsSold.toLocaleString()}/{event.capacity.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatCurrency(event.minPrice, event.currency)} - {formatCurrency(event.maxPrice, event.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setStatusEvent(event); setNewStatus(event.status); setShowStatusModal(true); }}
                            className="p-2 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                            title="Changer le statut"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setSelectedEvent(event); setShowDetailModal(true); }}
                            className="p-2 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <Link
                            href={`/events/${event.slug}`}
                            className="p-2 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                            title="Voir sur le site"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => { setDeletingEvent(event); setShowDeleteModal(true); }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer l'événement"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
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

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-48 bg-gray-100">
              {selectedEvent.coverImage && (
                <img 
                  src={selectedEvent.coverImage} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4">
                {getStatusBadge(selectedEvent.status)}
              </div>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedEvent(null); }}
                className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
              <p className="text-gray-500 mb-6">{selectedEvent.venueCity}, {selectedEvent.venueCountry}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Billets vendus</p>
                  <p className="text-xl font-bold text-gray-900">{selectedEvent.ticketsSold.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Disponibles</p>
                  <p className="text-xl font-bold text-gray-900">{selectedEvent.ticketsAvailable.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Capacité</p>
                  <p className="text-xl font-bold text-gray-900">{selectedEvent.capacity.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Taux de remplissage</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedEvent.capacity > 0 ? Math.round((selectedEvent.ticketsSold / selectedEvent.capacity) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prix minimum</span>
                  <span className="font-medium">{formatCurrency(selectedEvent.minPrice, selectedEvent.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prix maximum</span>
                  <span className="font-medium">{formatCurrency(selectedEvent.maxPrice, selectedEvent.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date de début</span>
                  <span className="font-medium">{new Date(selectedEvent.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date de fin</span>
                  <span className="font-medium">{new Date(selectedEvent.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Organisateur</p>
                <p className="font-medium text-gray-900">{selectedEvent.organizer.companyName}</p>
                <p className="text-sm text-gray-500">{selectedEvent.organizer.user.email}</p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Link
                  href={`/events/${selectedEvent.slug}`}
                  className="flex-1 px-4 py-2 bg-[#5B7CFF] text-white rounded-xl font-medium text-center hover:bg-[#4B6CEF] transition-colors"
                >
                  Voir sur le site
                </Link>
                <Link
                  href={`/admin/events`}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium text-center text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Gérer les événements
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer l'événement <strong>{deletingEvent.title}</strong> ?
              <br />
              <span className="text-red-500 text-sm">Cette action est irréversible et supprimera également tous les billets et commandes associés.</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletingEvent(null); }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                onClick={() => deleteEvent(deletingEvent.id)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && statusEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Changer le statut</h3>
            <p className="text-gray-600 mb-6">
              Changer le statut de <strong>{statusEvent.title}</strong>
            </p>
            
            <div className="space-y-3 mb-6">
              {STATUS_ACTIONS.filter(s => s.value !== statusEvent.status).map((status) => (
                <label
                  key={status.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    newStatus === status.value 
                      ? 'border-[#5B7CFF] bg-[#5B7CFF]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={newStatus === status.value}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-4 h-4 text-[#5B7CFF] border-gray-300 focus:ring-[#5B7CFF]"
                  />
                  <span className={`ml-3 font-medium ${
                    status.color === 'green' ? 'text-green-600' :
                    status.color === 'red' ? 'text-red-600' :
                    status.color === 'yellow' ? 'text-yellow-600' :
                    status.color === 'blue' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {status.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowStatusModal(false); setStatusEvent(null); setNewStatus(''); }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={updatingStatus}
              >
                Annuler
              </button>
              <button
                onClick={() => updateEventStatus(statusEvent.id, newStatus)}
                disabled={updatingStatus || newStatus === statusEvent.status}
                className="flex-1 px-4 py-2 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#4B6CEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus ? 'Mise à jour...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

