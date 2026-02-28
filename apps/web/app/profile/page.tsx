'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationIcon,
  CalendarIcon,
  EditIcon,
  SettingsIcon,
  HeartIcon,
  TicketIcon,
  OrderIcon,
  StarIcon,
  VerifiedIcon,
  ShieldCheckIcon,
  CameraIcon,
} from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UserStats {
  ticketsPurchased: number;
  eventsAttended: number;
  favorites: number;
  reviews: number;
}

interface RecentOrder {
  id: string;
  event: string;
  date: string;
  status: string;
  price: number;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({ ticketsPurchased: 0, eventsAttended: 0, favorites: 0, reviews: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    } else {
      setIsPageLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    setIsPageLoading(true);
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [statsRes, ordersRes] = await Promise.allSettled([
        fetch(`${API_URL}/users/stats`, { headers }),
        fetch(`${API_URL}/orders?limit=5`, { headers }),
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setUserStats({
          ticketsPurchased: data.ticketsPurchased ?? data.tickets ?? 0,
          eventsAttended: data.eventsAttended ?? data.events ?? 0,
          favorites: data.favorites ?? 0,
          reviews: data.reviews ?? 0,
        });
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const data = await ordersRes.value.json();
        const orders = data.orders || data || [];
        setRecentOrders(
          orders.slice(0, 5).map((o: any) => ({
            id: o.id,
            event: o.event?.title || o.eventTitle || o.event || 'Événement',
            date: o.createdAt || o.date,
            status: o.status?.toLowerCase() || 'completed',
            price: o.totalAmount || o.total || o.price || 0,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setIsPageLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: UserIcon },
    { id: 'orders', label: 'Mes commandes', icon: OrderIcon },
    { id: 'tickets', label: 'Mes billets', icon: TicketIcon },
    { id: 'favorites', label: 'Favoris', icon: HeartIcon },
    { id: 'reviews', label: 'Avis', icon: StarIcon },
  ];

  // Show loading state
  if (authLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B7CFF]"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Veuillez vous connecter</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour voir votre profil</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Use user from AuthContext
  const userData = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
    isVerified: user.role === 'USER',
    bio: 'Passionné de musique et de événements culturels.',
    joinedDate: '2023-06-15',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Avatar Section */}
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#5B7CFF] rounded-full flex items-center justify-center text-white hover:bg-[#7B61FF] transition-colors shadow-md">
                  <CameraIcon size={18} />
                </button>
                {userData.isVerified && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <VerifiedIcon size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {userData.name}
                  </h1>
                  {userData.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <VerifiedIcon size={14} />
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4 max-w-lg">{userData.bio}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <MailIcon size={16} />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <PhoneIcon size={16} />
                    {userData.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <LocationIcon size={16} />
                    {userData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} />
                    Membre depuis {new Date(userData.joinedDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
                  >
                    <EditIcon size={18} />
                    Modifier le profil
                  </Link>
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <SettingsIcon size={18} />
                    Paramètres
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 pt-0">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <TicketIcon className="mx-auto text-blue-500 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-900">{userStats.ticketsPurchased}</p>
              <p className="text-sm text-blue-600">Billets achetés</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <CalendarIcon className="mx-auto text-purple-500 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-900">{userStats.eventsAttended}</p>
              <p className="text-sm text-purple-600">Événements</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
              <HeartIcon className="mx-auto text-pink-500 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-900">{userStats.favorites}</p>
              <p className="text-sm text-pink-600">Favoris</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
              <StarIcon className="mx-auto text-yellow-500 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-900">{userStats.reviews}</p>
              <p className="text-sm text-yellow-600">Avis</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#5B7CFF] text-white shadow-lg shadow-[#5B7CFF]/30'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune commande récente</p>
                ) : recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center">
                        <TicketIcon className="text-[#5B7CFF]" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.event}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {order.status === 'completed' ? 'Terminé' : 'À venir'}
                      </span>
                      <p className="font-bold text-gray-900 mt-1">{order.price}€</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <OrderIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes commandes</h3>
                <p className="text-gray-500 mb-6">Consultez l'historique de vos commandes</p>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
                >
                  Voir toutes les commandes
                </Link>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="text-center py-12">
                <TicketIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes billets</h3>
                <p className="text-gray-500 mb-6">Gérez vos billets d'événement</p>
                <Link
                  href="/tickets"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
                >
                  Voir tous les billets
                </Link>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="text-center py-12">
                <HeartIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes favoris</h3>
                <p className="text-gray-500 mb-6">Vos événements préférés</p>
                <Link
                  href="/favorites"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
                >
                  Voir tous les favoris
                </Link>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <StarIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes avis</h3>
                <p className="text-gray-500">Vous n'avez pas encore laissé d'avis</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheckIcon className="text-green-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Sécurité du compte</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900 mb-1">Mot de passe</p>
              <p className="text-sm text-gray-500 mb-3">Dernière modification il y a 30 jours</p>
              <Link
                href="/settings?tab=security"
                className="text-[#5B7CFF] text-sm font-medium hover:underline"
              >
                Modifier
              </Link>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900 mb-1">Authentification à deux facteurs</p>
              <p className="text-sm text-gray-500 mb-3">Non activée</p>
              <Link
                href="/settings?tab=security"
                className="text-[#5B7CFF] text-sm font-medium hover:underline"
              >
                Activer
              </Link>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900 mb-1">Sessions actives</p>
              <p className="text-sm text-gray-500 mb-3">1 appareil</p>
              <Link
                href="/settings?tab=security"
                className="text-[#5B7CFF] text-sm font-medium hover:underline"
              >
                Gérer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

