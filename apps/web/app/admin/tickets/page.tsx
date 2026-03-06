'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface Ticket {
  id: string;
  qrCode: string;
  status: string;
  price: number;
  total: number;
  purchaseDate: string;
  scannedAt: string | null;
  event: { title: string };
  user: { email: string; firstName: string; lastName: string } | null;
  ticketType: { name: string };
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
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

        const response = await fetch(`${API_URL}/admin/tickets?${params}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des billets');
        }

        const data = await response.json();
        setTickets(data.tickets);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Demo data
        setTickets([
          { id: '1', qrCode: 'QR123456', status: 'VALID', price: 5000, total: 5500, purchaseDate: '2024-03-10T10:00:00Z', scannedAt: null, event: { title: 'MASA 2025' }, user: { email: 'john@example.com', firstName: 'John', lastName: 'Doe' }, ticketType: { name: 'Standard' } },
          { id: '2', qrCode: 'QR789012', status: 'USED', price: 10000, total: 10500, purchaseDate: '2024-03-08T15:30:00Z', scannedAt: '2024-03-10T18:00:00Z', event: { title: 'Dakar Jazz' }, user: { email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' }, ticketType: { name: 'VIP' } },
          { id: '3', qrCode: 'QR345678', status: 'VALID', price: 3000, total: 3300, purchaseDate: '2024-03-05T09:00:00Z', scannedAt: null, event: { title: 'Lagos Festival' }, user: { email: 'bob@example.com', firstName: 'Bob', lastName: 'Wilson' }, ticketType: { name: 'Early Bird' } },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page, statusFilter]);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billets</h1>
          <p className="text-gray-500 mt-1">Gérer tous les billets de la plateforme</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        >
          <option value="">Tous les statuts</option>
          <option value="VALID">Valide</option>
          <option value="USED">Utilisé</option>
          <option value="CANCELLED">Annulé</option>
          <option value="EXPIRED">Expiré</option>
        </select>
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
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{ticket.qrCode}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{ticket.event.title}</td>
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

