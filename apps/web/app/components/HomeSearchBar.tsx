'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearchBar() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('city', location);
    router.push(`/events?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] focus-within:bg-white transition-all">
          <svg className="text-gray-400 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input 
            type="text" 
            placeholder="Rechercher un événement, artiste, lieu..." 
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#5B7CFF] focus-within:bg-white transition-all sm:w-52">
          <svg className="text-gray-400 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
          <input 
            type="text" 
            placeholder="Ville ou pays" 
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="flex items-center justify-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5B7CFF]/30 text-sm sm:text-base flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <span>Rechercher</span>
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2 px-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs text-gray-400 font-medium flex-shrink-0">Populaire :</span>
        {['Concerts', 'Festivals', 'Sports', 'Conférences', 'Gratuit', 'Abidjan', 'Dakar', 'Lagos'].map((tag) => (
          <a
            key={tag}
            href={`/events?${tag === 'Abidjan' || tag === 'Dakar' || tag === 'Lagos' ? `city=${encodeURIComponent(tag)}` : `category=${encodeURIComponent(tag)}`}`}
            className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-[#5B7CFF]/10 hover:text-[#5B7CFF] text-gray-600 rounded-full text-xs font-semibold transition-all"
          >
            {tag}
          </a>
        ))}
      </div>
    </form>
  );
}

