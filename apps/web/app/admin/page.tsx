'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (parsedToken?.accessToken) {
          headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
        }

        const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
          headers,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Accès refusé. Veuillez vous connecter en tant qu\'administrateur.');
          }
          throw new Error('Erreur lors du chargement des statistiques');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Admin stats error:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Fallback demo data
        setStats({
          totalUsers: 12458,
          totalOrganizers: 342,
          totalEvents: 1856,
          totalTicketsSold: 89420,
          totalOrders: 45632,
          totalRevenue: 456320000,
          adminCommission: 4563200,
          netToOrganizers: 451845600,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats?.totalUsers.toLocaleString() || '0',
      subtitle: 'Total utilisateurs',
      icon: UsersIcon,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      title: 'Organisateurs',
      value: stats?.totalOrganizers.toLocaleString() || '0',
      subtitle: 'Comptes actifs',
      icon: CalendarIcon,
      color: 'bg-purple-500',
      href: '/admin/users',
    },
    {
      title: 'Événements',
      value: stats?.totalEvents.toLocaleString() || '0',
      subtitle: 'Événements publiés',
      icon: CalendarIcon,
      color: 'bg-green-500',
      href: '/admin/events',
    },
    {
      title: 'Billets vendus',
      value: stats?.totalTicketsSold.toLocaleString() || '0',
      subtitle: 'Total commandes',
      icon: TicketIcon,
      color: 'bg-orange-500',
      href: '/admin/tickets',
    },
    {
      title: 'Revenus totaux',
      value: `${formatCurrency(stats?.totalRevenue || 0)} XOF`,
      subtitle: 'Chiffre d\'affaires',
      icon: CurrencyIcon,
      color: 'bg-emerald-500',
      href: '/admin/payouts',
    },
    {
      title: 'Commission (1%)',
      value: `${formatCurrency(stats?.adminCommission || 0)} XOF`,
      subtitle: 'Revenus admin',
      icon: WalletIcon,
      color: 'bg-indigo-500',
      href: '/admin/payouts',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de la plateforme Tikeo</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-600 text-xs mt-1">Affichage des données de démonstration</p>
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
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <TrendingUpIcon />
                  <span>+12%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm font-semibold text-gray-700">{card.title}</p>
              <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
            { label: 'Événements', href: '/admin/events', icon: CalendarIcon },
            { label: 'Billets', href: '/admin/tickets', icon: TicketIcon },
            { label: 'Paiements', href: '/admin/payouts', icon: WalletIcon },
            { label: 'Audit Logs', href: '/admin/audit', icon: CalendarIcon },
            { label: 'Paramètres', href: '/admin/settings', icon: CalendarIcon },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#5B7CFF]/30 hover:shadow-md transition-all"
            >
              <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mb-2">
                <action.icon />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="mt-8 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Revenus nets aux organisateurs (99%)</p>
            <p className="text-3xl font-bold">
              {formatCurrency(stats?.netToOrganizers || 0)} XOF
            </p>
            <p className="text-white/70 text-sm mt-2">
              Commission admin: {formatCurrency(stats?.adminCommission || 0)} XOF (1%)
            </p>
          </div>
          <div className="hidden md:block">
            <WalletIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

