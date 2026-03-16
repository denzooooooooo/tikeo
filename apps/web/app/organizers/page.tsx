import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Star, Users, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { VerifiedIcon, FollowButton } from '../components/ui/Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

async function getOrganizers(page = 1): Promise<{ organizers: any[]; pagination: { totalPages: number; currentPage: number } }> {
  try {
    const res = await fetch(`${API_URL}/organizers?limit=20&page=${page}&sortBy=popular`, { 
      cache: 'no-store',
      next: { revalidate: 300 }
    });
    if (!res.ok) return { organizers: [], pagination: { totalPages: 1, currentPage: 1 } };
    const data = await res.json();
    return {
      organizers: data.organizers || data || [],
      pagination: data.pagination || { totalPages: 1, currentPage: page }
    };
  } catch {
    return { organizers: [], pagination: { totalPages: 1, currentPage: 1 } };
  }
}

function OrganizerCard({ organizer }: { organizer: any }) {
  const name = organizer.companyName || `${organizer.user?.firstName || ''} ${organizer.user?.lastName || ''}`.trim() || 'Organisateur';
  const logo = organizer.logo || organizer.user?.avatar || '/tikeoh-logo.png';
  const eventsCount = organizer._count?.events || 0;
  const rating = organizer.rating || 0;

  return (
    <Link href={`/organizers/${organizer.id}`} className="group">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 hover:border-[#5B7CFF]/50 hover:shadow-2xl hover:-translate-y-2 hover:bg-white transition-all duration-500 overflow-hidden h-full">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5B7CFF]/10 to-[#7B61FF]/10 group-hover:from-[#5B7CFF]/20 group-hover:to-[#7B61FF]/20 p-1 transition-all">
          <Image
            src={logo}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full rounded-2xl object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Badge vérifié */}
        {organizer.verified && (
          <div className="absolute top-4 right-4">
            <VerifiedIcon className="text-[#5B7CFF] drop-shadow-lg" size={20} />
          </div>
        )}

        {/* Nom */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-3 group-hover:text-[#5B7CFF] transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{eventsCount} événement{eventsCount > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>{rating.toFixed(1)} ({organizer._count?.reviews || 0} avis)</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-[#5B7CFF] transition-colors">Voir profil</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default async function OrganizersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const { organizers, pagination } = await getOrganizers(page);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent drop-shadow-2xl">
            Tous les Organisateurs
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-8">
            Découvrez les meilleurs organisateurs d'événements et suivez leurs actualités.
          </p>
          
          {/* Recherche */}
          <div className="max-w-md mx-auto">
            <div className="flex bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-1">
              <Search className="w-5 h-5 text-white/70 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher un organisateur..."
                className="w-full bg-transparent outline-none text-white placeholder-white/70 px-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {organizers.map((organizer) => (
            <Suspense key={organizer.id} fallback={<div className="h-80 bg-gray-200 animate-pulse rounded-3xl" />}>
              <OrganizerCard organizer={organizer} />
            </Suspense>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/organizers?page=${Math.max(1, page - 1)}`}
              className="p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:bg-[#5B7CFF] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              prefetch={false}
            >
              <ChevronLeft size={20} />
              Précédent
            </Link>
            
            <div className="flex items-center gap-1 text-sm font-medium">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : pagination.totalPages - 4 + i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/organizers?page=${pageNum}`}
                    className={`px-3 py-2 rounded-xl transition-all ${
                      pageNum === page
                        ? 'bg-[#5B7CFF] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200 hover:shadow-lg'
                    }`}
                    prefetch={false}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            
            <Link
              href={`/organizers?page=${Math.min(pagination.totalPages, page + 1)}`}
              className="p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:bg-[#5B7CFF] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              prefetch={false}
            >
              Suivant
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

