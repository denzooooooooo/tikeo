'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { API_CONFIG } from '@tikeo/utils';

const API_URL = API_CONFIG.BASE_URL;

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch { return null; }
}

function getUserId(): string | null {
  try {
    const stored = localStorage.getItem('auth_user');
    if (!stored) return null;
    return JSON.parse(stored).id ?? null;
  } catch { return null; }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-orange-100 text-orange-700',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  COMPLETED: 'Complétée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
};

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const userId = getUserId();
      if (!userId) throw new Error('Utilisateur non connecté');

      const res = await fetch(`${API_URL}/orders/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des commandes');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchSearch = o.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-white/70 text-sm hover:text-white mb-2 inline-flex items-center gap-1">
                ← Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-white">Mes Commandes</h1>
              <p className="text-white/80 mt-1">Historique de toutes vos commandes de billets</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total commandes</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Complétées</p>
            <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">En attente</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par événement ou ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
          >
            <option value="all">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmée</option>
            <option value="COMPLETED">Complétée</option>
            <option value="CANCELLED">Annulée</option>
            <option value="REFUNDED">Remboursée</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#5B7CFF] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des commandes…</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎟️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
                <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors">
                  Découvrir les événements
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Commande</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Événement</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Statut</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Billets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <p className="font-mono text-xs text-gray-500">#{order.id?.slice(-8).toUpperCase()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {order.event?.title || 'Événement inconnu'}
                          </p>
                          <p className="text-xs text-gray-500">{order.event?.venueCity}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          }) : '—'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">
                            {(order.total || 0).toLocaleString('fr-FR')} {order.currency || 'FCFA'}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-600">
                            {order.tickets?.length || order.OrderItem?.length || 0} billet(s)
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
