'use client';

import Link from 'next/link';
import {
  UserIcon,
  TicketIcon,
  HeartIcon,
  SettingsIcon,
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  TrendingUpIcon,
  MusicIcon,
  SportsIcon,
  TheaterIcon,
  FestivalIcon,
  ConferenceIcon,
  ArtIcon,
  PlusIcon,
  ChartIcon,
  StarIcon,
} from '@tikeo/ui';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

interface NavbarMobileMenuProps {
  user: User | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const mobileCategories = [
  { name: 'Concerts', href: '/events?category=Concerts', icon: MusicIcon, color: 'from-purple-500 to-pink-500' },
  { name: 'Festivals', href: '/events?category=Festivals', icon: FestivalIcon, color: 'from-orange-500 to-red-500' },
  { name: 'Spectacles', href: '/events?category=Spectacles', icon: TheaterIcon, color: 'from-blue-500 to-cyan-500' },
  { name: 'Sports', href: '/events?category=Sports', icon: SportsIcon, color: 'from-green-500 to-emerald-500' },
  { name: 'Conférences', href: '/events?category=Conferences', icon: ConferenceIcon, color: 'from-indigo-500 to-purple-500' },
  { name: 'Expositions', href: '/events?category=Expositions', icon: ArtIcon, color: 'from-pink-500 to-rose-500' },
];

export default function NavbarMobileMenu({ user, isAuthenticated, onClose, onLogout }: NavbarMobileMenuProps) {
  return (
    <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl">
      <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">

        {/* Auth Buttons */}
        {!isAuthenticated && (
          <div className="flex gap-2">
            <Link href="/login" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-all" onClick={onClose}>
              <UserIcon size={17} /> Connexion
            </Link>
            <Link href="/register" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%)' }} onClick={onClose}>
              S'inscrire
            </Link>
          </div>
        )}

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[#5B7CFF]/15" style={{ background: 'linear-gradient(135deg, rgba(91,124,255,0.06), rgba(123,97,255,0.06))' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%)' }}>
              {user.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        {/* Categories */}
        <div>
          <p className="px-1 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégories</p>
          <div className="grid grid-cols-3 gap-2">
            {mobileCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={cat.href} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95" onClick={onClose}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Links */}
        <div className="border-t border-gray-100 pt-2 space-y-0.5">
          <p className="px-1 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigation</p>
          <Link href="/events" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
            <CalendarIcon size={18} /> Tous les événements
          </Link>
          <Link href="/votes" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
            <TrendingUpIcon size={18} />
            <span>Votes & Concours</span>
            <span className="ml-auto px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>NEW</span>
          </Link>
          <Link href="/blog" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
            <StarIcon size={18} /> Blog & Actualités
          </Link>
        </div>

        {/* Create Event */}
        {isAuthenticated && (
          <div className="border-t border-gray-100 pt-2">
            <Link href="/dashboard/events/create" className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%)' }} onClick={onClose}>
              <PlusIcon size={18} /> Créer un événement
            </Link>
          </div>
        )}

        {/* User Account Links */}
        {isAuthenticated && user && (
          <div className="border-t border-gray-100 pt-2 space-y-0.5">
            <p className="px-1 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mon compte</p>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <ChartIcon size={17} /> Dashboard
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <UserIcon size={17} /> Mon profil
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <TicketIcon size={17} /> Mes commandes
            </Link>
            <Link href="/tickets" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <TicketIcon size={17} /> Mes billets
            </Link>
            <Link href="/favorites" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <HeartIcon size={17} /> Favoris
            </Link>
            <Link href="/notifications" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <BellIcon size={17} /> Notifications
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-[#5B7CFF]/8 hover:text-[#5B7CFF] rounded-xl font-medium text-sm transition-all" onClick={onClose}>
              <SettingsIcon size={17} /> Paramètres
            </Link>
            <button className="flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition-all w-full" onClick={() => { onLogout(); onClose(); }}>
              <ArrowRightIcon size={17} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
