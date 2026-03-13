'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, StarIcon, UsersIcon, MapPinIcon, GlobeIcon, VerifiedIcon, ChevronRightIcon } from "../components/ui/Icons";
import { FollowButton } from "@tikeo/ui";

interface Organizer {
  id: string;
  companyName?: string;
  name?: string;
  logo?: string | null;
  image?: string | null;
  userAvatar?: string | null;
  userId?: string | null;
  verified?: boolean;
  rating?: number;
  _count?: { events?: number; subscriptions?: number };
  eventsCount?: number;
  subscribersCount?: number;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  description?: string;
  user?: { firstName: string; lastName: string; avatar: string };
}

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrganizers();
  }, [currentPage]);

  const fetchOrganizers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-gateway-production-8ee0.up.railway.app/api/v1";
      const res = await fetch(`${API_URL}/organizers?page=${currentPage}&limit=12&sortBy=popular`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setOrganizers(data.organizers || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.totalCount || 12) / 12));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B7CFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-[#5B7CFF] bg-clip-text text-transparent mb-4">
              Organisateurs
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les meilleurs organisateurs d&apos;événements et suivez leurs actualités
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchOrganizers}
              className="px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CEF] transition-all"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Organizers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {organizers.map((org) => {
                const displayName = org.companyName || `${org.user?.firstName || ''} ${org.user?.lastName || ''}`.trim() || 'Organisateur';
                const displayImage = org.userAvatar || org.logo || org.image;
                const eventsCount = org._count?.events || org.eventsCount || 0;
                const followersCount = org._count?.subscriptions || org.subscribersCount || 0;
                const rating = org.rating || 0;

                return (
                  <Link 
                    key={org.id} 
                    href={`/organizers/${org.id}`}
                    className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:border-[#5B7CFF]/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                        {displayImage ? (
                          <Image 
                            src={displayImage} 
                            alt={displayName} 
                            width={80} 
                            height={80}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] flex items-center justify-center text-white font-bold text-xl rounded-2xl">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {org.verified && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                          <VerifiedIcon size={20} className="text-[#5B7CFF]" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 text-center mb-3 line-clamp-2 group-hover:text-[#5B7CFF] transition-colors">
                      {displayName}
                    </h3>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 rounded-xl bg-gray-50 group-hover:bg-[#5B7CFF]/5">
                        <CalendarIcon size={16} className="mx-auto mb-1 text-gray-500" />
                        <div className="text-xs font-semibold text-gray-900">{eventsCount}</div>
                        <div className="text-xs text-gray-500">événements</div>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-gray-50 group-hover:bg-[#5B7CFF]/5">
                        <UsersIcon size={16} className="mx-auto mb-1 text-gray-500" />
                        <div className="text-xs font-semibold text-gray-900">{followersCount}</div>
                        <div className="text-xs text-gray-500">abonnés</div>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-gray-50 group-hover:bg-[#5B7CFF]/5">
                        <StarIcon size={16} className="mx-auto mb-1 text-yellow-500 fill-yellow-500" />
                        <div className="text-xs font-semibold text-gray-900">{rating.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">note</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <Link 
                        href={`/organizers/${org.id}`}
                        className="w-full block text-center py-3 px-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#5B7CFF]/30 hover:-translate-y-0.5 transition-all group-hover:from-[#4B6CEF] group-hover:to-[#6A52D8]"
                      >
                        Voir le profil <ChevronRightIcon size={16} />
                      </Link>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                <span className="px-4 py-2 text-sm text-gray-600 font-medium">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* CTA si aucun organisateur */}
            {organizers.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-3xl flex items-center justify-center">
                  <UsersIcon size={48} className="text-[#5B7CFF]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Aucun organisateur trouvé
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                  Les premiers organisateurs arrivent bientôt. 
                </p>
                <Link 
                  href="/dashboard/events/create"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  Devenir organisateur
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m17 8 4 4H3l4-4"/>
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
