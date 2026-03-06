'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface Event {
  id: string;
  title: string;
}

interface Ticket {
  id: string;
  qrCode: string;
  status: string;
  price: number;
  total: number;
  purchaseDate: string;
  scannedAt: string | null;
  event: { id: string; title: string };
  user: { email: string; firstName: string; lastName: string } | null;
  ticketType: { name: string };
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [searchQR, setSearchQR] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
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
        if (eventFilter) params.append('eventId', eventFilter);

        const response = await fetch(`${API_URL}/admin/tickets?${params}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des billets');
        }

        const data = await response.json();
        setTickets(data.tickets || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Demo data
        setTickets([
          { id: '1', qrCode: 'QR123456', status: 'VALID', price: 5000, total: 5500, purchaseDate: '2024-03-10T10:00:00Z', scannedAt: null, event: { id: '1', title: 'MASA 2025' }, user: { email: 'john@example.com', firstName: 'John', lastName: 'Doe' }, ticketType: { name: 'Standard' } },
          { id: '2', qrCode: 'QR789012', status: 'USED', price: 10000, total: 10500, purchaseDate: '2024-03-08T15:30:00Z', scannedAt: '2024-03-10T18:00:00Z', event: { id: '2', title: 'Dakar Jazz' }, user: { email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' }, ticketType: { name: 'VIP' } },
          { id: '3', qrCode: 'QR345678', status: 'VALID', price: 3000, total: 3300, purchaseDate: '2024-03-05T09:00:00Z', scannedAt: null, event: { id: '1', title: 'MASA 2025' }, user: { email: 'bob@example.com', firstName: 'Bob', lastName: 'Wilson' }, ticketType: { name: 'Early Bird' } },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page, statusFilter, eventFilter]);

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

      const response = await fetch(`${API_URL}/admin/events?limit=100`, { headers });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; className: string }> = {
      VALID: { label: 'Valide', className: 'bg-green-100 text-green-700' },
      USED: { label: 'Utilisé', className: 'bg-gray-100 text-gray-600' },
      CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-600' },
      EXPIRED: { label: 'Expiré', className: 'bg-orange-100 text-orange-600' },
    };
    const s = statuses[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.className}`}>{s.label}</span>;
  };

  // Filter by QR code search
  const filteredTickets = searchQR 
    ? tickets.filter(t => t.qrCode.toLowerCase().includes(searchQR.toLowerCase()))
    : tickets;

  // Calculate stats
  const stats = {
    total: filteredTickets.length,
    valid: filteredTickets.filter(t => t.status === 'VALID').length,
    used: filteredTickets.filter(t => t.status === 'USED').length,
    cancelled: filteredTickets.filter(t => t.status === 'CANCELLED').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billets</h1>
          <p className="text-gray-500 mt-1">Gérer tous les billets de la plateforme</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-blue-50 rounded-xl">
            <p className="text-xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-blue-500">Total</p>
          </div>
          <div className="text-center px-4 py-2 bg-green-50 rounded-xl">
            <p className="text-xl font-bold text-green-600">{stats.valid}</p>
            <p className="text-xs text-green-500">Valides</p>
          </div>
          <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
            <p className="text-xl font-bold text-gray-600">{stats.used}</p>
            <p className="text-xs text-gray-500">Utilisés</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par QR code..."
          value={searchQR}
          onChange={(e) => setSearchQR(e.target.value)}
          className="flex-1 min-w-[200px] max-w-xs px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        />
        <select
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        >
          <option value="">Tous les événements</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        >
          <option value="">Tous les statuts</option>
          <option value="VALID">Valide</option>
          <option value="USED">Utilisé</option>
          <option value="CANCELLED">Annulé</option>
          <option value="EXPIRED">Expiré</option>
        </select>
        
        {/* Export button */}
        <button
          onClick={() => {
            const csv = [
              ['QR Code', 'Événement', 'Type', 'Client', 'Email', 'Prix', 'Statut', 'Date'].join(','),
              ...filteredTickets.map(t => [
                t.qrCode,
                t.event.title,
                t.ticketType.name,
                t.user ? `${t.user.firstName} ${t.user.lastName}` : 'N/A',
                t.user?.email || 'N/A',
                t.total,
                t.status,
                new Date(t.purchaseDate).toLocaleDateString()
              ].join(','))
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                <div className="w-24 h-6 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">Aucun billet trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">QR Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Événement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">{ticket.qrCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{ticket.event.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.ticketType.name}</td>
                    <td className="px-6 py-4">
                      {ticket.user ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ticket.user.firstName} {ticket.user.lastName}</p>
                          <p className="text-xs text-gray-500">{ticket.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Acheté par invité</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.total.toLocaleString()} XOF</td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(ticket.purchaseDate).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
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

