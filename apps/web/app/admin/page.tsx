'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

// Icons
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const TicketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
  </svg>
);
const CurrencyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
);
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

interface DashboardStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  totalTicketsSold: number;
  totalOrders: number;
  totalRevenue: number;
  adminCommission: number;
  netToOrganizers: number;
}

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  event: {
    title: string;
    coverImage: string | null;
  };
}

interface TopEvent {
  id: string;
  title: string;
  coverImage: string | null;
  organizer: string;
  ticketsSold: number;
  revenue: number;
}

interface PlatformHealth {
  orders: { last24h: number; last7d: number; last30d: number };
  users: { last24h: number; last7d: number; last30d: number };
  events: { last24h: number; last7d: number; last30d: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (parsedToken?.accessToken) {
          headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
        }

        // Fetch all data in parallel
        const [statsRes, ordersRes, eventsRes, healthRes] = await Promise.all([
          fetch(`${API_URL}/admin/dashboard/stats`, { headers }),
          fetch(`${API_URL}/admin/orders/recent?limit=5`, { headers }),
          fetch(`${API_URL}/admin/events/top?limit=5`, { headers }),
          fetch(`${API_URL}/admin/health`, { headers }),
        ]);

        if (!statsRes.ok) {
          if (statsRes.status === 401 || statsRes.status === 403) {
            throw new Error('Accès refusé. Veuillez vous connecter en tant qu\'administrateur.');
          }
          throw new Error('Erreur lors du chargement des données');
        }

        const [statsData, ordersData, eventsData, healthData] = await Promise.all([
          statsRes.json(),
          ordersRes.ok ? ordersRes.json() : Promise.resolve({ data: [] }),
          eventsRes.ok ? eventsRes.json() : Promise.resolve([]),
          healthRes.ok ? healthRes.json() : Promise.resolve(null),
        ]);

        setStats(statsData);
        setRecentOrders(ordersData.data || []);
        setTopEvents(eventsData || []);
        setHealth(healthData);
      } catch (err) {
        console.error('Admin stats error:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = stats ? [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers.toLocaleString(),
      subtitle: 'Total utilisateurs',
      icon: UsersIcon,
      color: 'bg-blue-500',
      href: '/admin/users',
      change: health?.users.last30d || 0,
    },
    {
      title: 'Organisateurs',
      value: stats.totalOrganizers.toLocaleString(),
      subtitle: 'Comptes actifs',
      icon: CalendarIcon,
      color: 'bg-purple-500',
      href: '/admin/users',
      change: 0,
    },
    {
      title: 'Événements',
      value: stats.totalEvents.toLocaleString(),
      subtitle: 'Événements publiés',
      icon: CalendarIcon,
      color: 'bg-green-500',
      href: '/admin/events',
      change: health?.events.last30d || 0,
    },
    {
      title: 'Billets vendus',
      value: stats.totalTicketsSold.toLocaleString(),
      subtitle: 'Total commandes',
      icon: TicketIcon,
      color: 'bg-orange-500',
      href: '/admin/tickets',
      change: health?.orders.last30d || 0,
    },
    {
      title: 'Revenus totaux',
      value: formatCurrency(stats.totalRevenue),
      subtitle: 'Chiffre d\'affaires',
      icon: CurrencyIcon,
      color: 'bg-emerald-500',
      href: '/admin/payouts',
      change: 0,
    },
    {
      title: 'Commission (1%)',
      value: formatCurrency(stats.adminCommission),
      subtitle: 'Revenus admin',
      icon: WalletIcon,
      color: 'bg-indigo-500',
      href: '/admin/payouts',
      change: 0,
    },
  ] : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Vue d&apos;ensemble de la plateforme Tikeoh</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color} text-white group-hover:scale-110 transition-transform`}>
                  <card.icon />
                </div>
                {card.change > 0 && (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <TrendingUpIcon />
                    <span>+{card.change}</span>
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm font-semibold text-gray-700">{card.title}</p>
              <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
            { label: 'Événements', href: '/admin/events', icon: CalendarIcon },
            { label: 'Billets', href: '/admin/tickets', icon: TicketIcon },
            { label: 'Paiements', href: '/admin/payouts', icon: WalletIcon },
            { label: 'Audit Logs', href: '/admin/audit', icon: ActivityIcon },
            { label: 'Paramètres', href: '/admin/settings', icon: ShieldIcon },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#5B7CFF]/30 hover:shadow-md transition-all"
            >
              <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mb-2">
                <action.icon />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Revenue Summary */}
      {stats && (
        <div className="mt-6 sm:mt-8 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Revenus nets aux organisateurs (99%)</p>
              <p className="text-3xl font-bold">
                {formatCurrency(stats.netToOrganizers)}
              </p>
              <p className="text-white/70 text-sm mt-2">
                Commission admin: {formatCurrency(stats.adminCommission)} (1%)
              </p>
            </div>
            <div className="hidden md:block">
              <WalletIcon />
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders & Top Events */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
            <Link href="/admin/tickets" className="text-[#5B7CFF] text-sm font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucune commande récente
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {order.event.coverImage ? (
                      <img 
                        src={order.event.coverImage} 
                        alt={order.event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <TicketIcon />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{order.event.title}</p>
                    <p className="text-sm text-gray-500">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Top Événements</h3>
            <Link href="/admin/events" className="text-[#5B7CFF] text-sm font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {topEvents.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucun événement publié
              </div>
            ) : (
              topEvents.map((event, index) => (
                <div key={event.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[#5B7CFF] text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {event.coverImage ? (
                      <img 
                        src={event.coverImage} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CalendarIcon />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.organizer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(event.revenue)}</p>
                    <p className="text-xs text-gray-500">{event.ticketsSold} billets</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Platform Health */}
      {health && (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Santé de la plateforme</h3>
            <p className="text-sm text-gray-500">Activité des 30 derniers jours</p>
          </div>
          <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Commandes</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">24h</span>
                    <span className="text-sm font-semibold">{health.orders.last24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">7 jours</span>
                    <span className="text-sm font-semibold">{health.orders.last7d}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">30 jours</span>
                    <span className="text-sm font-semibold">{health.orders.last30d}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Utilisateurs</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">24h</span>
                    <span className="text-sm font-semibold">{health.users.last24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">7 jours</span>
                    <span className="text-sm font-semibold">{health.users.last7d}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">30 jours</span>
                    <span className="text-sm font-semibold">{health.users.last30d}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Événements</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">24h</span>
                    <span className="text-sm font-semibold">{health.events.last24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">7 jours</span>
                    <span className="text-sm font-semibold">{health.events.last7d}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">30 jours</span>
                    <span className="text-sm font-semibold">{health.events.last30d}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

