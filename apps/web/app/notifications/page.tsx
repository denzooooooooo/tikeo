'use client';


import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Notifications | Tikeo',
  description: 'Consultez toutes vos notifications Tikeo : confirmations de billets, mises a jour d'evenements, rappels et messages importants.',
  openGraph: { title: 'Notifications - Tikeo', description: 'Vos notifications et alertes Tikeo.', url: 'https://tikeo.com/notifications' },
  alternates: { canonical: 'https://tikeo.com/notifications' },
};

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: string | Record<string, any>;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';
const LIMIT = 15;
const REFRESH_INTERVAL = 30_000; // 30s auto-refresh

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

function parseData(raw?: string | Record<string, any>): Record<string, any> {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) { const m = Math.floor(diff / 60); return `Il y a ${m} min`; }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return `Il y a ${h}h`; }
  if (diff < 604800) { const d = Math.floor(diff / 86400); return `Il y a ${d}j`; }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ─── Notification type config ─────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  order_confirmation:  { emoji: '🛒', color: 'bg-blue-100 text-blue-700',    label: 'Commande' },
  ticket_ready:        { emoji: '🎫', color: 'bg-indigo-100 text-indigo-700', label: 'Billet' },
  event_reminder:      { emoji: '⏰', color: 'bg-orange-100 text-orange-700', label: 'Rappel' },
  event_update:        { emoji: '📢', color: 'bg-yellow-100 text-yellow-700', label: 'Mise à jour' },
  event_cancelled:     { emoji: '❌', color: 'bg-red-100 text-red-700',       label: 'Annulation' },
  new_event:           { emoji: '🎉', color: 'bg-purple-100 text-purple-700', label: 'Nouvel événement' },
  favorite_on_sale:    { emoji: '🏷️', color: 'bg-green-100 text-green-700',  label: 'En vente' },
  price_drop:          { emoji: '💸', color: 'bg-emerald-100 text-emerald-700', label: 'Baisse de prix' },
  review_request:      { emoji: '⭐', color: 'bg-amber-100 text-amber-700',   label: 'Avis' },
  payment_received:    { emoji: '💳', color: 'bg-teal-100 text-teal-700',     label: 'Paiement' },
  new_follower:        { emoji: '👤', color: 'bg-pink-100 text-pink-700',     label: 'Abonné' },
  comment:             { emoji: '💬', color: 'bg-sky-100 text-sky-700',       label: 'Commentaire' },
  like:                { emoji: '❤️', color: 'bg-rose-100 text-rose-700',     label: 'Like' },
  system:              { emoji: '🔔', color: 'bg-gray-100 text-gray-700',     label: 'Système' },
  // Backend enum types
  EVENT_REMINDER:      { emoji: '⏰', color: 'bg-orange-100 text-orange-700', label: 'Rappel' },
  TICKET_PURCHASED:    { emoji: '🎫', color: 'bg-indigo-100 text-indigo-700', label: 'Billet acheté' },
  TICKET_TRANSFERRED:  { emoji: '🔄', color: 'bg-blue-100 text-blue-700',    label: 'Transfert' },
  EVENT_UPDATED:       { emoji: '📢', color: 'bg-yellow-100 text-yellow-700', label: 'Mise à jour' },
  EVENT_CANCELLED:     { emoji: '❌', color: 'bg-red-100 text-red-700',       label: 'Annulation' },
  REFUND_PROCESSED:    { emoji: '💰', color: 'bg-green-100 text-green-700',   label: 'Remboursement' },
  RECOMMENDATION:      { emoji: '✨', color: 'bg-purple-100 text-purple-700', label: 'Recommandation' },
  MARKETING:           { emoji: '🎯', color: 'bg-pink-100 text-pink-700',     label: 'Promo' },
  SYSTEM:              { emoji: '🔔', color: 'bg-gray-100 text-gray-700',     label: 'Système' },
};

const DEFAULT_TYPE = { emoji: '🔔', color: 'bg-gray-100 text-gray-700', label: 'Notification' };

// ─── NotificationCard ─────────────────────────────────────────────────────────
function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[notification.type] || DEFAULT_TYPE;
  const data = parseData(notification.data);

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
        notification.read
          ? 'bg-white border-gray-100 hover:border-gray-200'
          : 'bg-gradient-to-r from-blue-50/80 to-white border-blue-200 hover:border-blue-300'
      }`}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#5B7CFF] rounded-full" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${cfg.color}`}>
          {cfg.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-gray-400">{getTimeAgo(notification.createdAt)}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{notification.title}</h3>
          <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{notification.message}</p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {data.eventId && (
              <Link href={`/events/${data.eventId}`}
                className="text-xs text-[#5B7CFF] font-semibold hover:underline">
                Voir l&apos;événement →
              </Link>
            )}
            {data.orderId && (
              <Link href={`/orders`}
                className="text-xs text-[#5B7CFF] font-semibold hover:underline">
                Voir la commande →
              </Link>
            )}
            {data.organizerId && (
              <Link href={`/organizers/${data.organizerId}`}
                className="text-xs text-[#5B7CFF] font-semibold hover:underline">
                Voir l&apos;organisateur →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            title="Marquer comme lu"
            className="p-1.5 text-gray-400 hover:text-[#5B7CFF] hover:bg-blue-50 rounded-lg transition-colors text-xs"
          >
            ✓
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          title="Supprimer"
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: LIMIT, totalPages: 1, unreadCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'unread'>('newest');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    orders: true, events: true, promotions: true, social: true,
  });
  const [toast, setToast] = useState<string | null>(null);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login?redirect=/notifications');
    }
  }, [router]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async (page = 1, append = false) => {
    const token = getToken();
    if (!token) return;

    if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        sortBy,
      });
      if (activeFilter === 'unread') params.set('read', 'false');
      if (typeFilter) params.set('type', typeFilter);

      const res = await fetch(`${API_URL}/notifications?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login?redirect=/notifications');
        return;
      }

      if (res.ok) {
        const json = await res.json();
        // Backend returns { data: [...], meta: {...} }
        const items: Notification[] = json.data || json.notifications || json || [];
        const m: Meta = json.meta || { total: items.length, page, limit: LIMIT, totalPages: 1, unreadCount: 0 };

        setNotifications(prev => append ? [...prev, ...items] : items);
        setMeta(m);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeFilter, sortBy, typeFilter, router]);

  // ── Initial load + auto-refresh ─────────────────────────────────────────────
  useEffect(() => {
    fetchNotifications(1, false);

    // Auto-refresh every 30s
    refreshTimer.current = setInterval(() => {
      fetchNotifications(1, false);
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [fetchNotifications]);

  // ── Toast helper ─────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setMeta(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1) }));
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    const wasUnread = notifications.find(n => n.id === id)?.read === false;
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (wasUnread) setMeta(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1), total: prev.total - 1 }));
    else setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Notification supprimée');
    } catch (err) { console.error(err); }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setMeta(prev => ({ ...prev, unreadCount: 0 }));
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Toutes les notifications marquées comme lues');
    } catch (err) { console.error(err); }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Supprimer toutes les notifications ?')) return;
    setNotifications([]);
    setMeta(prev => ({ ...prev, total: 0, unreadCount: 0 }));
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/all`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Toutes les notifications supprimées');
    } catch (err) { console.error(err); }
  };

  const handleLoadMore = () => {
    if (meta.page < meta.totalPages) {
      fetchNotifications(meta.page + 1, true);
    }
  };

  const unreadCount = meta.unreadCount;
  const hasMore = meta.page < meta.totalPages;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                ←
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white rounded-full"
                    style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-[#5B7CFF] hover:bg-blue-50 rounded-lg transition-colors font-medium">
                  ✓ Tout lire
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleDeleteAll}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
                  🗑 Tout supprimer
                </button>
              )}
              <button onClick={() => setShowSettings(s => !s)}
                className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[#5B7CFF] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* ── Settings Panel ── */}
        {showSettings && (
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">⚙️ Préférences de notification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'orders' as const, label: '🛒 Commandes & Billets', desc: 'Confirmations, rappels' },
                { key: 'events' as const, label: '📅 Événements suivis', desc: 'Mises à jour, annulations' },
                { key: 'promotions' as const, label: '🏷️ Promotions', desc: 'Baisses de prix, offres' },
                { key: 'social' as const, label: '👥 Social', desc: 'Abonnés, likes, commentaires' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${notifPrefs[item.key] ? 'bg-[#5B7CFF]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifPrefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Filters Bar ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Read filter */}
          <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
            {(['all', 'unread'] as const).map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === f ? 'text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeFilter === f ? { background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' } : {}}>
                {f === 'all' ? `Toutes (${meta.total})` : `Non lues (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] outline-none">
            <option value="">Tous les types</option>
            <option value="EVENT_REMINDER">⏰ Rappels</option>
            <option value="TICKET_PURCHASED">🎫 Billets</option>
            <option value="EVENT_UPDATED">📢 Mises à jour</option>
            <option value="EVENT_CANCELLED">❌ Annulations</option>
            <option value="REFUND_PROCESSED">💰 Remboursements</option>
            <option value="RECOMMENDATION">✨ Recommandations</option>
            <option value="MARKETING">🎯 Promotions</option>
            <option value="SYSTEM">🔔 Système</option>
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] outline-none">
            <option value="newest">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
            <option value="unread">Non lues en premier</option>
          </select>

          {/* Mobile: mark all + delete all */}
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead}
              className="sm:hidden px-3 py-2 text-xs text-[#5B7CFF] border border-[#5B7CFF]/30 rounded-xl font-medium">
              ✓ Tout lire
            </button>
          )}
        </div>

        {/* ── List ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Chargement des notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="space-y-3">
              {notifications.map(n => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center pt-2">
                <button onClick={handleLoadMore} disabled={isLoadingMore}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors disabled:opacity-50">
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
                      Chargement...
                    </span>
                  ) : `Charger plus (${meta.total - notifications.length} restantes)`}
                </button>
              </div>
            )}

            {/* Stats footer */}
            <p className="text-center text-xs text-gray-400 pb-4">
              {notifications.length} / {meta.total} notifications · Actualisation auto toutes les 30s
            </p>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
              🔔
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeFilter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              {activeFilter === 'unread'
                ? 'Vous avez tout lu ! Revenez plus tard.'
                : typeFilter
                ? 'Aucune notification de ce type pour le moment.'
                : 'Vous n\'avez aucune notification pour le moment.'}
            </p>
            {(activeFilter !== 'all' || typeFilter) && (
              <button onClick={() => { setActiveFilter('all'); setTypeFilter(''); }}
                className="px-5 py-2.5 text-sm text-white font-semibold rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                Voir toutes les notifications
              </button>
            )}
            {activeFilter === 'all' && !typeFilter && (
              <Link href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                Découvrir des événements
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
