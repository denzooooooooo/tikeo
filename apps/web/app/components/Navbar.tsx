'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIcon, UserIcon, TicketIcon, MenuIcon, CloseIcon,
  ArrowRightIcon, BellIcon, CalendarIcon, HeartIcon, SettingsIcon,
  MusicIcon, SportsIcon, TheaterIcon, FestivalIcon, ConferenceIcon,
  ArtIcon, FoodIcon, FamilyIcon, PlusIcon, ChartIcon, StarIcon,
} from '@tikeo/ui';
import { useAuth } from '../context/AuthContext';
import NavbarMobileMenu from './NavbarMobileMenu';

const categories = [
  { name: 'Concerts', icon: MusicIcon, href: '/events?category=Concerts', color: 'from-purple-500 to-pink-500' },
  { name: 'Festivals', icon: FestivalIcon, href: '/events?category=Festivals', color: 'from-orange-500 to-red-500' },
  { name: 'Spectacles', icon: TheaterIcon, href: '/events?category=Spectacles', color: 'from-blue-500 to-cyan-500' },
  { name: 'Sports', icon: SportsIcon, href: '/events?category=Sports', color: 'from-green-500 to-emerald-500' },
  { name: 'Conférences', icon: ConferenceIcon, href: '/events?category=Conferences', color: 'from-indigo-500 to-purple-500' },
  { name: 'Expositions', icon: ArtIcon, href: '/events?category=Expositions', color: 'from-pink-500 to-rose-500' },
  { name: 'Gastronomie', icon: FoodIcon, href: '/events?category=Gastronomie', color: 'from-amber-500 to-orange-500' },
  { name: 'Famille', icon: FamilyIcon, href: '/events?category=Famille', color: 'from-teal-500 to-cyan-500' },
];

function MegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 px-3 py-2 font-semibold text-sm rounded-xl transition-all ${open ? 'text-[#5B7CFF] bg-[#5B7CFF]/10' : 'text-gray-700 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8'}`}>
        Catégories
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-[540px] bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Explorer par catégorie</p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link key={cat.name} href={cat.href} onClick={() => setOpen(false)} className="group relative overflow-hidden rounded-xl p-3 border border-transparent hover:border-gray-100 hover:shadow-md transition-all">
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`} />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-white text-center">{cat.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#5B7CFF]/5 to-[#7B61FF]/5 px-4 py-3 flex justify-between border-t border-gray-100">
            <span className="text-xs text-gray-500">8 catégories</span>
            <Link href="/events" onClick={() => setOpen(false)} className="text-sm font-semibold text-[#5B7CFF]">Voir tout →</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DropMenu({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 px-3 py-2 font-semibold text-sm rounded-xl transition-all ${open ? 'text-[#5B7CFF] bg-[#5B7CFF]/10' : 'text-gray-700 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8'}`}>
        {title}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-52 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}

function DLink({ href, icon: Icon, children, onClick }: { href: string; icon?: React.ComponentType<{size?: number}>; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8 rounded-xl font-medium text-sm transition-all mx-1">
      {Icon && <Icon size={16} />}{children}
    </Link>
  );
}

function NavSearch() {
  const [focused, setFocused] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`); }} className={`hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${focused ? 'border-[#5B7CFF] bg-white shadow-lg shadow-[#5B7CFF]/10 w-60' : 'border-gray-200 bg-gray-50 w-44'}`}>
      <svg className={`flex-shrink-0 ${focused ? 'text-[#5B7CFF]' : 'text-gray-400'}`} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
      <input type="text" value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Rechercher..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 font-medium min-w-0" />
      {q && <button type="submit" className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="m9 18 6-6-6-6" /></svg></button>}
    </form>
  );
}

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mq, setMq] = useState('');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); setUserOpen(false); router.push('/'); };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/97 backdrop-blur-2xl shadow-lg shadow-gray-200/60 border-b border-gray-100' : 'bg-white/92 backdrop-blur-xl border-b border-gray-100/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px] gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)', boxShadow: '0 4px 15px rgba(91,124,255,0.35)' }}>
                <TicketIcon className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#5B7CFF,#7B61FF)' }}>tikeo</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              <MegaMenu />
              <Link href="/events" className="px-3 py-2 text-gray-700 hover:text-[#5B7CFF] font-semibold text-sm rounded-xl hover:bg-[#5B7CFF]/8 transition-all">Événements</Link>
              <Link href="/votes" className="px-3 py-2 text-gray-700 hover:text-[#5B7CFF] font-semibold text-sm rounded-xl hover:bg-[#5B7CFF]/8 transition-all flex items-center gap-1.5">
                Votes
                <span className="px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)' }}>NEW</span>
              </Link>
              <DropMenu title="Plus">
                <div className="px-3 py-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Découvrir</p></div>
                <DLink href="/events?category=Festivals" icon={FestivalIcon}>Festivals</DLink>
                <DLink href="/blog" icon={StarIcon}>Blog & Actualités</DLink>
                <DLink href="/press" icon={ChartIcon}>Presse</DLink>
                <div className="border-t border-gray-100 my-1" />
                <div className="px-3 py-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tikeo</p></div>
                <DLink href="/about" icon={UserIcon}>À propos</DLink>
                <DLink href="/contact" icon={CalendarIcon}>Contact</DLink>
                <DLink href="/affiliate" icon={StarIcon}>Affiliation</DLink>
              </DropMenu>
              <NavSearch />
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
              <Link href="/search" className="xl:hidden p-2.5 text-gray-600 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8 rounded-xl transition-all"><SearchIcon size={20} /></Link>
              {isAuthenticated && (
                <Link href="/dashboard/events/create" className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)', boxShadow: '0 4px 12px rgba(91,124,255,0.3)' }}>
                  <PlusIcon size={16} /><span>Créer</span>
                </Link>
              )}
              {isAuthenticated && user ? (
                <>
                  <Link href="/notifications" className="relative p-2.5 text-gray-600 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8 rounded-xl transition-all">
                    <BellIcon size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                  </Link>
                  <div className="relative">
                    <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)' }}>
                        {user.avatar ? <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" /> : user.firstName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{user.firstName}</span>
                      <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {userOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)' }}>
                              {user.avatar ? <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" /> : user.firstName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1.5">
                          <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mon compte</p>
                          <DLink href="/profile" icon={UserIcon}>Mon profil</DLink>
                          <DLink href="/orders" icon={TicketIcon}>Mes commandes</DLink>
                          <DLink href="/tickets" icon={TicketIcon}>Mes billets</DLink>
                          <DLink href="/favorites" icon={HeartIcon}>Favoris</DLink>
                          <DLink href="/notifications" icon={BellIcon}>Notifications</DLink>
                        </div>
                        <div className="border-t border-gray-100 py-1.5">
                          <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Organisateur</p>
                          <DLink href="/dashboard" icon={ChartIcon}>Dashboard</DLink>
                          <DLink href="/dashboard/events/create" icon={PlusIcon}>Créer un événement</DLink>
                        </div>
                        <div className="border-t border-gray-100 py-1.5">
                          <DLink href="/settings" icon={SettingsIcon}>Paramètres</DLink>
                        </div>
                        <div className="border-t border-gray-100 pt-1.5 px-2">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm w-full transition-all">
                            <ArrowRightIcon size={16} />Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-[#5B7CFF] font-semibold text-sm rounded-xl hover:bg-[#5B7CFF]/8 transition-all">Connexion</Link>
                  <Link href="/register" className="px-5 py-2 text-white font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)', boxShadow: '0 4px 12px rgba(91,124,255,0.3)' }}>S'inscrire</Link>
                </div>
              )}
            </div>

            {/* Mobile Right */}
            <div className="lg:hidden flex items-center gap-1">
              <button onClick={() => { setMobileSearch(!mobileSearch); setMobileOpen(false); }} className="p-2.5 text-gray-600 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8 rounded-xl transition-all"><SearchIcon size={20} /></button>
              <button onClick={() => { setMobileOpen(!mobileOpen); setMobileSearch(false); }} className="p-2.5 text-gray-600 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/8 rounded-xl transition-all">
                {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearch && (
          <div className="lg:hidden border-t border-gray-100 px-4 py-3 bg-white animate-in slide-in-from-top-2">
            <form onSubmit={(e) => { e.preventDefault(); if (mq.trim()) { router.push(`/search?q=${encodeURIComponent(mq)}`); setMobileSearch(false); } }} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] focus-within:bg-white transition-all">
              <svg className="text-gray-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" value={mq} onChange={(e) => setMq(e.target.value)} placeholder="Rechercher un événement, artiste..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 font-medium" autoFocus />
              {mq && <button type="submit" className="px-3 py-1.5 text-white text-xs font-bold rounded-lg" style={{ background: 'linear-gradient(135deg,#5B7CFF,#7B61FF)' }}>OK</button>}
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <NavbarMobileMenu
          user={user}
          isAuthenticated={isAuthenticated}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default Navbar;
