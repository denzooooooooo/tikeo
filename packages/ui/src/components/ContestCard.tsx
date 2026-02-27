'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UsersIcon, FlameIcon, TrendingUpIcon, StarIcon } from './Icons';

export interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  status: ContestStatus;
  startDate: Date | string;
  endDate: Date | string;
  contestantsCount: number;
  totalVotes: number;
  prize?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  category?: string;
}

export enum ContestStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ACTIVE = 'ACTIVE',
  VOTING = 'VOTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

interface ContestCardProps {
  contest: Contest;
  showStats?: boolean;
}

// Helper function to get time remaining
function getTimeRemaining(endDate: Date | string) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return { text: 'Terminé', isUrgent: false };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return { text: `${days}j ${hours}h`, isUrgent: days <= 1 };
  }
  return { text: `${hours}h`, isUrgent: true };
}

export function ContestCard({ contest, showStats = true }: ContestCardProps) {
  const isActive = contest.status === ContestStatus.ACTIVE || contest.status === ContestStatus.VOTING;
  const isEnded = contest.status === ContestStatus.COMPLETED;
  const timeRemaining = getTimeRemaining(contest.endDate);
  
  // Calculate progress (mock - in real app this would come from API)
  const progress = Math.min((contest.totalVotes / 10000) * 100, 100);

  // Get category color
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      MUSIC: 'from-purple-500 to-pink-500',
      DANCE: 'from-pink-500 to-rose-500',
      PHOTOGRAPHY: 'from-blue-500 to-cyan-500',
      ART: 'from-orange-500 to-red-500',
      FOOD: 'from-amber-500 to-orange-500',
      SPORTS: 'from-green-500 to-emerald-500',
    };
    return category ? colors[category] || 'from-purple-500 to-pink-500' : 'from-purple-500 to-pink-500';
  };

  return (
    <Link href={`/votes/${contest.id}`} className="block">
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Cover Image with Gradient Overlay */}
        <div className="relative h-48 sm:h-56 md:h-56 lg:h-56 overflow-hidden">
          {/* Background Image */}
          <Image
            src={contest.coverImage || `https://picsum.photos/seed/${contest.id}/800/600`}
            alt={contest.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2 z-10">
            {isActive && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-500 text-white shadow-lg">
                🟢 En cours
              </span>
            )}
            {contest.isTrending && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-orange-500 text-white shadow-lg flex items-center gap-0.5 sm:gap-1">
                <FlameIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Tendances</span>
              </span>
            )}
            {contest.isFeatured && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-500 text-yellow-900 shadow-lg flex items-center gap-0.5 sm:gap-1">
                <StarIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Vedette</span>
              </span>
            )}
            {isEnded && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gray-500 text-white shadow-lg">
                🏁 Terminé
              </span>
            )}
          </div>

          {/* Prize Badge */}
          {contest.prize && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg flex items-center gap-0.5 sm:gap-1">
                🏆 {contest.prize}
              </span>
            </div>
          )}

          {/* Category Badge */}
          {contest.category && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10">
              <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r ${getCategoryColor(contest.category)} text-white shadow-lg`}>
                {contest.category}
              </span>
            </div>
          )}

          {/* Time Remaining Badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
            <span className={`px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-0.5 sm:gap-1 ${
              timeRemaining.isUrgent 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-white/90 backdrop-blur-sm text-gray-900'
            }`}>
              <CalendarIcon className="w-3 h-3" />
              {timeRemaining.text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {contest.title}
          </h3>
          
          {contest.shortDescription && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-4">
              {contest.shortDescription}
            </p>
          )}

          {/* Vote Progress Bar */}
          {showStats && (
            <div className="mb-2 sm:mb-4">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
                <span className="flex items-center gap-1">
                  <UsersIcon className="w-3 h-3" />
                  <span className="hidden xs:inline">{contest.contestantsCount} participants</span>
                  <span className="xs:hidden">{contest.contestantsCount}</span>
                </span>
                <span className="text-purple-600 font-semibold">
                  {formatNumber(contest.totalVotes)} votes
                </span>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Row */}
          {showStats && (
            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(contest.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUpIcon className="w-4 h-4 text-purple-500" />
                <span className="text-xs sm:text-sm font-medium text-purple-600">
                  {formatNumber(contest.totalVotes)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatNumber(num?: number): string {
  if (num === undefined || num === null) {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default ContestCard;

