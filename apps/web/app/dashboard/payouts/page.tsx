'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { API_CONFIG } from '@tikeo/utils';

const API_URL = API_CONFIG.BASE_URL;

interface RevenueSummary {
  totalRevenue: number;
  totalCommission: number;
  netPayout: number;
  pendingPayouts: number;
  completedPayouts: number;
  events: Array<{
    eventId: string;
    eventTitle: string;
    gross: number;
    commission: number;
    net: number;
    orders: number;
  }>;
}

interface PendingPayout {
  orderId: string;
  eventId: string;
  eventTitle: string;
  gross: number;
  commission: number;
  net: number;
  createdAt: string;
}

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch { return null; }
}

export default function DashboardPayoutsPage() {
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const token = getToken();
    if (!token) {
      setError('Vous devez être connecté pour voir vos revenus');
      setIsLoading(false);
      return;
    }

    try {
      // Fetch revenue summary
      const revenueRes = await fetch(`${API_URL}/organizers/revenue/summary`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch pending payouts
      const payoutsRes = await fetch(`${API_URL}/organizers/payout/pending`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!revenueRes.ok && !payoutsRes.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      if (revenueRes.ok) {
        const revenueData = await revenueRes.json();
        setRevenue(revenueData);
      }

      if (payoutsRes.ok) {
        const payoutsData = await payoutsRes.json();
        setPendingPayouts(payoutsData.pendingPayouts || []);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const hasPayoutConfigured = revenue && revenue.pendingPayouts > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/dashboard" className="text-white/70 text-sm hover:text-white mb-2 inline-flex items-center gap-1">
            ← Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Paiements & Revenus</h1>
          <p className="text-white/80 mt-1">Suivez vos gains et configurez vos payouts</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {/* Warning if payout not configured */}
        {!isLoading && !error && !hasPayoutConfigured && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-amber-800">Configurez vos informations de paiement</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Pour recevoir vos revenus, vous devez configurer vos informations de payout.
                </p>
                <Link 
                  href="/dashboard/settings" 
                  className="inline-block mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Configurer le payout
                </Link>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 bg-blue-50 text-blue-600">
                  💰
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue?.totalRevenue || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Revenu total brut</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 bg-red-50 text-red-600">
                  📊
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue?.totalCommission || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Commission (3%)</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 bg-green-50 text-green-600">
                  ✅
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue?.netPayout || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Net à recevoir</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 bg-purple-50 text-purple-600">
                  ⏳
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue?.pendingPayouts || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">En attente</p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue by Event */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Revenus par événement</h2>
                {!revenue?.events || revenue.events.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">Aucun événement avec des ventes</p>
                ) : (
                  <div className="space-y-4">
                    {revenue.events.map((event) => (
                      <div key={event.eventId} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{event.eventTitle}</h3>
                          <span className="text-sm font-bold text-[#5B7CFF]">
                            {event.orders} commande{event.orders > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Brut</p>
                            <p className="font-semibold">{formatCurrency(event.gross)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Commission</p>
                            <p className="font-semibold text-red-500">-{formatCurrency(event.commission)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Net</p>
                            <p className="font-semibold text-green-600">{formatCurrency(event.net)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Payouts */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Paiements en attente</h2>
                {pendingPayouts.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">Aucun paiement en attente</p>
                ) : (
                  <div className="space-y-3">
                    {pendingPayouts.slice(0, 5).map((payout) => (
                      <div key={payout.orderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{payout.eventTitle}</p>
                          <p className="text-xs text-gray-500">{formatDate(payout.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(payout.net)}</p>
                          <p className="text-xs text-green-600">Net</p>
                        </div>
                      </div>
                    ))}
                    {pendingPayouts.length > 5 && (
                      <p className="text-center text-sm text-gray-500 pt-2">
                        + {pendingPayouts.length - 5} autres paiements
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Détail complet des revenus</h2>
              {pendingPayouts.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Aucune donnée disponible</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Commande</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Événement</th>
                        <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500">Brut</th>
                        <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500">Commission</th>
                        <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500">Net</th>
                        <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayouts.map((payout) => (
                        <tr key={payout.orderId} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-3 font-mono text-xs text-gray-500">{payout.orderId.slice(0, 8)}...</td>
                          <td className="py-3 px-3 font-medium text-gray-900">{payout.eventTitle}</td>
                          <td className="py-3 px-3 text-right text-gray-600">{formatCurrency(payout.gross)}</td>
                          <td className="py-3 px-3 text-right text-red-500">-{formatCurrency(payout.commission)}</td>
                          <td className="py-3 px-3 text-right font-bold text-green-600">{formatCurrency(payout.net)}</td>
                          <td className="py-3 px-3 text-right text-gray-500">{formatDate(payout.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="py-3 px-3 font-bold text-gray-900">Total</td>
                        <td className="py-3 px-3 text-right font-bold text-gray-900">
                          {formatCurrency(pendingPayouts.reduce((sum, p) => sum + p.gross, 0))}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-red-500">
                          -{formatCurrency(pendingPayouts.reduce((sum, p) => sum + p.commission, 0))}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-green-600">
                          {formatCurrency(pendingPayouts.reduce((sum, p) => sum + p.net, 0))}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

