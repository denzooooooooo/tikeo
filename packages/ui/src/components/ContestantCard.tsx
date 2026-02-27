'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  HeartIcon, 
  TrophyIcon, 
  CrownIcon, 
  ShareIcon, 
  ChevronUpIcon,
} from './Icons';
import { ShareButton } from './ShareButtons';

interface Contestant {
  id: string;
  contestId?: string;
  userId?: string;
  name: string;
  bio?: string;
  mainImage: string;
  images?: string[];
  votesCount: number;
  rank?: number;
  status?: string;
  isWinner?: boolean;
  winnerPosition?: number;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
}

interface ContestantCardProps {
  contestant: Contestant;
  rank?: number;
  hasVoted?: boolean;
  onVote?: () => void;
  isOwner?: boolean;
  showVoting?: boolean;
  maxVotes?: number;
  votesUsed?: number;
}

// Helper function to format numbers
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

export function ContestantCard({
  contestant,
  rank,
  hasVoted = false,
  onVote,
  isOwner = false,
  showVoting = true,
  maxVotes = 5,
  votesUsed = 0,
}: ContestantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const isWinner = contestant.isWinner;
  
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/contestant/${contestant.id}`
    : `/contestant/${contestant.id}`;

  // Get rank badge styles
  const getRankBadge = () => {
    if (!rank || rank > 3) return null;
    
    const badges = {
      1: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500', text: 'text-yellow-900', icon: CrownIcon, label: '1er' },
      2: { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-700', icon: TrophyIcon, label: '2ème' },
      3: { bg: 'bg-gradient-to-r from-amber-600 to-amber-700', text: 'text-white', icon: TrophyIcon, label: '3ème' },
    };
    
    const badge = badges[rank as 1 | 2 | 3];
    const Icon = badge.icon;
    
    return (
      <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${badge.bg} ${badge.text} shadow-lg`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </div>
    );
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isWinner ? 'ring-4 ring-yellow-400' : ''}`}>
      {/* Main Image with Gradient Overlay */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={contestant.mainImage || `https://picsum.photos/seed/${contestant.id}/400/500`}
          alt={contestant.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Rank Badge */}
        {getRankBadge()}
        
        {/* Winner Badge */}
        {isWinner && (
          <div className="absolute top-3 right-3 z-20">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg flex items-center gap-1">
              <CrownIcon className="w-3 h-3" />
              Gagnant
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-16 z-20 flex gap-2" onClick={(e) => e.preventDefault()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-red-100 hover:text-red-500'
            }`}
          >
            <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Share Button */}
        <div className="absolute top-3 right-28 z-20" onClick={(e) => e.preventDefault()}>
          <ShareButton
            url={shareUrl}
            title={contestant.name}
            description={contestant.bio || ''}
            size="sm"
            variant="icon"
          />
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-bold text-xl text-white mb-1 drop-shadow-lg">{contestant.name}</h3>
          {contestant.bio && (
            <p className="text-sm text-white/80 line-clamp-2 drop-shadow-md">{contestant.bio}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Social Links */}
        {contestant.socialLinks && (
          <div className="flex gap-3 mb-4">
            {contestant.socialLinks.instagram && (
              <a 
                href={contestant.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {contestant.socialLinks.tiktok && (
              <a 
                href={contestant.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            )}
            {contestant.socialLinks.twitter && (
              <a 
                href={contestant.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
          </div>
        )}

        {/* Vote Section */}
        {showVoting && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg">
                {formatNumber(contestant.votesCount)}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">votes</p>
                {rank && rank <= 10 && (
                  <p className="text-xs text-purple-600 font-semibold">#{rank}</p>
                )}
              </div>
            </div>
            
            {onVote && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onVote();
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${
                  hasVoted
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                }`}
              >
                <HeartIcon className={`w-5 h-5 ${hasVoted ? 'fill-current' : ''}`} />
                {hasVoted ? 'Voté' : 'Voter'}
              </button>
            )}
          </div>
        )}

        {/* Votes Progress (if maxVotes is defined) */}
        {maxVotes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Votes restants</span>
              <span className="font-semibold text-purple-600">{maxVotes - votesUsed}/{maxVotes}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${((maxVotes - votesUsed) / maxVotes) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Owner Badge */}
        {isOwner && (
          <div className="mt-3 text-xs text-center text-purple-600 font-medium bg-purple-50 py-2 rounded-lg">
            C&apos;est votre participation
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestantCard;

