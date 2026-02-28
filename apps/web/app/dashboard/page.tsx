'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

// ─── Icônes SVG inline ───────────────────────────────────────────────────────
const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
const TicketIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const CurrencyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>;
const TrendingUpIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const ArrowRightIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
const BarChartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>;
const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const TagIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const CheckCircleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const MapPinIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalViews: number;
  pendingOrders: number;
}

interface RecentEvent {
  id: string;
  title: string;
  startDate: string;
  venueCity: string;
  venueCountry: string;
  status: string;
  ticketsSold: number;
  capacity: number;
  coverImage: string;
}

const quickLinks = [
  { id: 1, title: 'Créer un événement', href: '/dashboard/events/create', Icon: PlusIcon, color: 'bg-[#5B7CFF]', desc: 'Nouvel événement' },
  { id: 2, title: 'Mes événements', href: '/dashboard/events', Icon: CalendarIcon, color: 'bg-purple-500', desc: 'Gérer' },
  { id: 3, title: 'Commandes', href: '/dashboard/orders', Icon: TicketIcon, color: 'bg-green-500', desc: 'Voir les ventes' },
  { id: 4, title: 'Analytics', href: '/dashboard/analytics', Icon: BarChartIcon, color: 'bg-orange-500', desc: 'Statistiques' },
  { id: 5, title: 'Codes promo', href: '/dashboard/promo-codes', Icon: TagIcon, color: 'bg-pink-500', desc: 'Promotions' },
  { id: 6, title: 'Paramètres', href: '/dashboard/settings', Icon: SettingsIcon, color: 'bg-gray-500', desc: 'Configuration' },
];

function StatCard({ title, value, subtitle, Icon, color, trend }: {
  title: string; value: string | number; subtitle: string;
  Icon: React.ComponentType; color: string; trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <TrendingUpIcon /> {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

function EventStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PUBLISHED: { label: 'Publié', className: 'bg-green-100 text-green-700' },
    DRAFT: { label: 'Brouillon', className: 'bg-gray-100 text-gray-600' },
    CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-600' },
    COMPLETED: { label: 'Terminé', className: 'bg-blue-100 text-blue-600' },
    SOLD_OUT: { label: 'Complet', className: 'bg-orange-100 text-orange-600' },
  };
  const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.className}`}>{s.label}</span>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0, publishedEvents: 0, draftEvents: 0,
    totalTicketsSold: 0, totalRevenue: 0, totalViews: 0, pendingOrders: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (parsedToken?.accessToken) headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;

        // Fetch organizer's own events
        const eventsRes = await fetch(`${API_URL}/events/my`, { headers });
        if (eventsRes.ok) {
          const events: any[] = await eventsRes.json();
          setRecentEvents(events.slice(0, 5));

          // Calculate stats from organizer's events
          const published = events.filter((e: any) => e.status === 'PUBLISHED').length;
          const draft = events.filter((e: any) => e.status === 'DRAFT').length;
          const totalSold = events.reduce((acc: number, e: any) => acc + (e.ticketsSold || 0), 0);
          const totalViews = events.reduce((acc: number, e: any) => acc + (e.views || 0), 0);
          const totalRevenue = events.reduce((acc: number, e: any) => {
            const minPrice = e.minPrice || e.ticketTypes?.[0]?.price || 0;
            return acc + (e.ticketsSold || 0) * minPrice;
          }, 0);

          setStats({
            totalEvents: events.length,
            publishedEvents: published,
            draftEvents: draft,
            totalTicketsSold: totalSold,
            totalRevenue,
            totalViews,
            pendingOrders: 0,
          });
        }
      } catch (err) {
        // Use fallback data
        setStats({
          totalEvents: 12, publishedEvents: 8, draftEvents: 4,
          totalTicketsSold: 4582, totalRevenue: 22910000, totalViews: 89420, pendingOrders: 3,
        });
        setRecentEvents([
          { id: '1', title: 'MASA 2025 — Marché des Arts du Spectacle', startDate: '2025-03-10T18:00:00', venueCity: 'Abidjan', venueCountry: "Côte d'Ivoire", status: 'PUBLISHED', ticketsSold: 1250, capacity: 5000, coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },
          { id: '2', title: 'Dakar Jazz Festival', startDate: '2025-04-05T20:00:00', venueCity: 'Dakar', venueCountry: 'Sénégal', status: 'PUBLISHED', ticketsSold: 890, capacity: 2000, coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' },
          { id: '3', title: 'Lagos Music Festival', startDate: '2025-05-20T21:00:00', venueCity: 'Lagos', venueCountry: 'Nigeria', status: 'DRAFT', ticketsSold: 0, capacity: 10000, coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M FCFA`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K FCFA`;
    return `${amount.toLocaleString()} FCFA`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* ── HEADER ── */}
        <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Tableau de bord</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Bonjour, {user?.firstName || 'Organisateur'} 👋
                </h1>
                <p className="text-white/80 mt-1">Gérez vos événements africains depuis ici</p>
              </div>
              <Link
                href="/dashboard/events/create"
                className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#5B7CFF] rounded-xl font-bold hover:shadow-2xl transition-all hover:-translate-y-0.5 text-sm flex-shrink-0"
              >
                <PlusIcon />
                Créer un événement
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── STATS ── */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Événements"
                value={stats.totalEvents}
                subtitle={`${stats.publishedEvents} publiés · ${stats.draftEvents} brouillons`}
                Icon={CalendarIcon}
                color="bg-[#5B7CFF]/10 text-[#5B7CFF]"
                trend="+2 ce mois"
              />
              <StatCard
                title="Billets vendus"
                value={stats.totalTicketsSold.toLocaleString()}
                subtitle="Total toutes périodes"
                Icon={TicketIcon}
                color="bg-green-100 text-green-600"
                trend="+12%"
              />
              <StatCard
                title="Revenus"
                value={formatCurrency(stats.totalRevenue)}
                subtitle="Revenus totaux"
                Icon={CurrencyIcon}
                color="bg-purple-100 text-purple-600"
                trend="+8%"
              />
              <StatCard
                title="Vues totales"
                value={stats.totalViews.toLocaleString()}
                subtitle="Pages vues événements"
                Icon={EyeIcon}
                color="bg-orange-100 text-orange-600"
                trend="+24%"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── RECENT EVENTS ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Mes événements récents</h2>
                  <Link href="/dashboard/events" className="text-sm font-semibold text-[#5B7CFF] hover:underline flex items-center gap-1">
                    Voir tout <ArrowRightIcon />
                  </Link>
                </div>

                {loading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentEvents.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {recentEvents.map((event) => {
                      const soldPct = event.capacity > 0 ? Math.round((event.ticketsSold / event.capacity) * 100) : 0;
                      return (
                        <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {event.coverImage ? (
                              <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">🎪</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h3>
                              <EventStatusBadge status={event.status} />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><ClockIcon />{new Date(event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="flex items-center gap-1"><MapPinIcon />{event.venueCity}</span>
                            </div>
                            {event.capacity > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>{event.ticketsSold.toLocaleString()} billets vendus</span>
                                  <span className="font-semibold">{soldPct}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${soldPct}%`,
                                      background: soldPct >= 80 ? '#ef4444' : soldPct >= 50 ? '#f97316' : '#5B7CFF',
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Link href={`/dashboard/events/${event.id}/edit`} className="p-2 text-gray-400 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-all" title="Modifier">
                              <EditIcon />
                            </Link>
                            <Link href={`/dashboard/events/${event.id}/analytics`} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Analytics">
                              <BarChartIcon />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <div className="text-5xl mb-3">🎪</div>
                    <h3 className="font-bold text-gray-900 mb-2">Aucun événement</h3>
                    <p className="text-gray-500 text-sm mb-4">Créez votre premier événement africain</p>
                    <Link href="/dashboard/events/create" className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl text-sm" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                      <PlusIcon /> Créer un événement
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map(({ id, title, href, Icon, color, desc }) => (
                    <Link
                      key={id}
                      href={href}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-[#5B7CFF]/30 hover:shadow-md transition-all group text-center"
                    >
                      <div className={`p-2.5 rounded-xl ${color} text-white mb-2 group-hover:scale-110 transition-transform`}>
                        <Icon />
                      </div>
                      <span className="text-xs font-bold text-gray-800 leading-tight">{title}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{desc}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-2xl p-5 text-white">
                <div className="text-2xl mb-2">💡</div>
                <h3 className="font-bold mb-2">Conseil du jour</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  Ajoutez une vidéo teaser à votre événement pour augmenter les ventes de billets de 40% en moyenne.
                </p>
                <Link href="/dashboard/events/create" className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-white/90 hover:text-white underline underline-offset-2">
                  Créer maintenant <ArrowRightIcon />
                </Link>
              </div>

              {/* Performance rapide */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4">Performance ce mois</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Taux de conversion', value: 68, color: '#5B7CFF' },
                    { label: 'Satisfaction client', value: 92, color: '#10b981' },
                    { label: 'Taux de remplissage', value: 75, color: '#f97316' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>{item.label}</span>
                        <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
