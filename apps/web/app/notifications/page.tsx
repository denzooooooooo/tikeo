'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BellIcon,
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
  SettingsIcon,
  FilterIcon,
  OrderIcon,
  TicketIcon,
  CalendarIcon,
  CreditCardIcon,
  HeartIcon,
  MessageIcon,
  StarIcon,
  DiscountIcon,
} from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: { orderId?: string; eventId?: string; organizerId?: string };
}

const notificationTypeIcons: Record<string, any> = {
  order_confirmation: OrderIcon,
  event_reminder: CalendarIcon,
  price_drop: DiscountIcon,
  favorite_on_sale: TicketIcon,
  review_request: StarIcon,
  payment_received: CreditCardIcon,
  event_update: MessageIcon,
  new_follower: HeartIcon,
};

const notificationTypeColors: Record<string, string> = {
  order_confirmation: 'bg-blue-100 text-blue-600',
  event_reminder: 'bg-orange-100 text-orange-600',
  price_drop: 'bg-green-100 text-green-600',
  favorite_on_sale: 'bg-purple-100 text-purple-600',
  review_request: 'bg-yellow-100 text-yellow-600',
  payment_received: 'bg-emerald-100 text-emerald-600',
  event_update: 'bg-indigo-100 text-indigo-600',
  new_follower: 'bg-pink-100 text-pink-600',
};

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = notificationTypeIcons[notification.type] || BellIcon;
  const colorClass = notificationTypeColors[notification.type] || 'bg-gray-100 text-gray-600';
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-200 ${
        notification.read
          ? 'bg-white border border-gray-100 hover:border-gray-200'
          : 'bg-gradient-to-r from-blue-50 to-white border border-blue-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {!notification.read && (
                  <span className="w-2 h-2 bg-[#5B7CFF] rounded-full flex-shrink-0"></span>
                )}
                <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                  {notification.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{notification.message}</p>
              <p className="text-gray-400 text-xs mt-2">{timeAgo}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-2 text-gray-400 hover:text-[#5B7CFF] hover:bg-blue-50 rounded-lg transition-colors"
                  title="Marquer comme lu"
                >
                  <CheckIcon size={18} />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <TrashIcon size={18} />
              </button>
            </div>
          </div>

          {/* CTA Button if applicable */}
          {notification.data?.eventId && (
            <Link
              href={`/events/${notification.data.eventId}`}
              className="inline-flex items-center gap-2 mt-3 text-sm text-[#5B7CFF] font-medium hover:text-[#7B61FF]"
            >
              Voir l&apos;événement →
            </Link>
          )}
          {notification.data?.orderId && (
            <Link
              href={`/orders/${notification.data.orderId}`}
              className="inline-flex items-center gap-2 mt-3 text-sm text-[#5B7CFF] font-medium hover:text-[#7B61FF]"
            >
              Voir la commande →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'À l\'instant';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteAll = async () => {
    setNotifications([]);
    try {
      await fetch(`${API_URL}/notifications`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error('Error deleting all notifications:', err);
    }
  };

  const filteredNotifications = activeFilter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon size={20} />
                <span>Retour</span>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <BellIcon className="text-[#5B7CFF]" size={28} />
                <span className="text-xl font-bold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#5B7CFF] text-white text-xs font-semibold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#5B7CFF] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <CheckIcon size={18} />
                    Tout marquer lu
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon size={18} />
                    Tout supprimer
                  </button>
                </>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-[#5B7CFF] hover:bg-blue-50 rounded-lg transition-colors"
              >
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#5B7CFF] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'unread'
                  ? 'bg-[#5B7CFF] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>

          <select className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent bg-white">
            <option value="newest">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
            <option value="unread">Non lues en premier</option>
          </select>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Préférences de notification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'orders', label: 'Commandes & Billets', description: 'Confirmations, rappels' },
                { key: 'events', label: 'Événements suivis', description: 'Nouvelles ventes, baisses de prix' },
                { key: 'promotions', label: 'Promotions', description: 'Offres spéciales et réductions' },
                { key: 'social', label: 'Activité sociale', description: 'Nouveaux abonnés, commentaires' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5B7CFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B7CFF]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <BellIcon className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {activeFilter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {activeFilter === 'unread'
                ? 'Vous avez lu toutes vos notifications. Revenez plus tard pour de nouvelles!'
                : 'Vous n\'avez aucune notification pour le moment.'}
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
            >
              Découvrir des événements
            </Link>
          </div>
        )}

        {/* Load More */}
        {filteredNotifications.length > 0 && filteredNotifications.length >= 10 && (
          <div className="text-center mt-8">
            <button className="px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors">
              Charger plus de notifications
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

