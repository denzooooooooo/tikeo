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

export default function DashboardAnalyticsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/events/my`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des données');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Compute analytics
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED').length;
  const draftEvents = events.filter((e) => e.status === 'DRAFT').length;
  const totalTicketsSold = events.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
  const totalCapacity = events.reduce((acc, e) => acc + (e.capacity || 0), 0);
  const totalViews = events.reduce((acc, e) => acc + (e.views || 0), 0);
  const totalRevenue = events.reduce((acc, e) => acc + ((e.ticketsSold || 0) * (e.minPrice || 0)), 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M FCFA`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K FCFA`;
    return `${amount.toLocaleString()} FCFA`;
  };

  const topEvents = [...events]
    .sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0))
    .slice(0, 5);

  const categoryStats = events.reduce((acc: Record<string, number>, e) => {
    const cat = e.category || 'Autre';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/dashboard" className="text-white/70 text-sm hover:text-white mb-2 inline-flex items-center gap-1">
            ← Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-white/80 mt-1">Performance globale de vos événements</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
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
              {[
                { label: 'Total événements', value: totalEvents, icon: '📅', color: 'bg-blue-50 text-blue-600' },
                { label: 'Publiés', value: publishedEvents, icon: '✅', color: 'bg-green-50 text-green-600' },
                { label: 'Brouillons', value: draftEvents, icon: '📝', color: 'bg-gray-50 text-gray-600' },
                { label: 'Billets vendus', value: totalTicketsSold.toLocaleString(), icon: '🎟️', color: 'bg-purple-50 text-purple-600' },
                { label: 'Revenus estimés', value: formatCurrency(totalRevenue), icon: '💰', color: 'bg-yellow-50 text-yellow-600' },
                { label: 'Vues totales', value: totalViews.toLocaleString(), icon: '👁️', color: 'bg-pink-50 text-pink-600' },
                { label: 'Capacité totale', value: totalCapacity.toLocaleString(), icon: '🏟️', color: 'bg-orange-50 text-orange-600' },
                { label: 'Taux de remplissage', value: `${fillRate}%`, icon: '📊', color: 'bg-teal-50 text-teal-600' },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${kpi.color}`}>
                    {kpi.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Events */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🏆 Top événements (billets vendus)</h2>
                {topEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">Aucun événement</p>
                ) : (
                  <div className="space-y-3">
                    {topEvents.map((event, idx) => {
                      const pct = event.capacity > 0 ? Math.round(((event.ticketsSold || 0) / event.capacity) * 100) : 0;
                      return (
                        <div key={event.id} className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-300 w-6 text-center">{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                              <span className="text-xs font-bold text-[#5B7CFF] ml-2 flex-shrink-0">
                                {(event.ticketsSold || 0).toLocaleString()} billets
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: 'linear-gradient(90deg, #5B7CFF, #7B61FF)',
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{pct}% de remplissage</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📂 Répartition par catégorie</h2>
                {Object.keys(categoryStats).length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">Aucune donnée</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(categoryStats)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, count]) => {
                        const pct = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;
                        return (
                          <div key={cat}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{cat}</span>
                              <span className="text-xs font-bold text-gray-500">{count} événement{count > 1 ? 's' : ''} ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: 'linear-gradient(90deg, #9D4EDD, #7B61FF)',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Events Status Overview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Détail par événement</h2>
                {events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Aucun événement créé</p>
                    <Link href="/dashboard/events/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5B7CFF] text-white rounded-xl font-medium text-sm hover:bg-[#7B61FF] transition-colors">
                      Créer un événement
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Événement</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Statut</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Billets</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Capacité</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Vues</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Remplissage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => {
                          const pct = event.capacity > 0 ? Math.round(((event.ticketsSold || 0) / event.capacity) * 100) : 0;
                          return (
                            <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 px-3">
                                <Link href={`/dashboard/events/${event.id}/analytics`} className="font-medium text-gray-900 hover:text-[#5B7CFF] line-clamp-1">
                                  {event.title}
                                </Link>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                                  event.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                                  'bg-red-100 text-red-600'
                                }`}>
                                  {event.status === 'PUBLISHED' ? 'Publié' : event.status === 'DRAFT' ? 'Brouillon' : event.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-semibold text-gray-900">{(event.ticketsSold || 0).toLocaleString()}</td>
                              <td className="py-3 px-3 text-right text-gray-500">{(event.capacity || 0).toLocaleString()}</td>
                              <td className="py-3 px-3 text-right text-gray-500">{(event.views || 0).toLocaleString()}</td>
                              <td className="py-3 px-3 text-right">
                                <span className={`font-bold ${pct >= 80 ? 'text-red-500' : pct >= 50 ? 'text-orange-500' : 'text-[#5B7CFF]'}`}>
                                  {pct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
