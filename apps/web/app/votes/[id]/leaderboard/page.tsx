'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { TrophyIcon, CrownIcon, ShareButton, LoadingSpinner, ErrorAlert, VoteProgress } from '@tikeo/ui';

interface Contestant {
  id: string;
  name: string;
  mainImage: string;
  votesCount: number;
  rank?: number;
  isWinner: boolean;
  winnerPosition?: number;
}

interface Contest {
  id: string;
  title: string;
  status: string;
  endDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function LeaderboardRow({ contestant, index, isCurrentUser = false }: { contestant: Contestant; index: number; isCurrentUser?: boolean }) {
  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <CrownIcon className="w-10 h-10 text-yellow-500 drop-shadow-lg" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative">
          <CrownIcon className="w-10 h-10 text-gray-400 drop-shadow-lg" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative">
          <CrownIcon className="w-10 h-10 text-amber-600 drop-shadow-lg" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">3</span>
        </div>
      );
    }
    return <span className="text-xl font-bold text-gray-500">#{rank}</span>;
  };

  const percentage = Math.min(100, Math.round((contestant.votesCount / Math.max(contestant.votesCount, 1)) * 100));

  return (
    <div className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
      isCurrentUser 
        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
        : 'bg-white hover:shadow-lg'
    }`}>
      <div className="flex items-center gap-4 p-4">
        {/* Rank */}
        <div className="flex-shrink-0">
          {getRankDisplay(contestant.rank!)}
        </div>

        {/* Avatar */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-purple-200">
          <Image
            src={contestant.mainImage}
            alt={contestant.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Name & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 truncate">{contestant.name}</h3>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                Vous
              </span>
            )}
            {contestant.isWinner && (
              <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs rounded-full flex items-center gap-1">
                🏆 Gagnant
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  contestant.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  contestant.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  contestant.rank === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-700' :
                  'bg-gradient-to-r from-purple-400 to-pink-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-16 text-right">
              {contestant.votesCount.toLocaleString()} votes
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <Link
            href={`/votes/1/contestant/${contestant.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Voter
          </Link>
        </div>
      </div>

      {/* Animated rank badge */}
      {contestant.rank === 1 && (
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-2 text-xs font-bold transform rotate-45 translate-x-8 -translate-y-2">
            PREMIER
          </div>
        </div>
      )}
    </div>
  );
}

function TopThreePreview({ contestants }: { contestants: Contestant[] }) {
  const top3 = contestants.slice(0, 3);

  return (
    <div className="flex items-end justify-center gap-4 mb-12">
      {/* 2nd Place */}
      <div className="flex flex-col items-center transform scale-90">
        <div className="relative w-28 h-28 mb-2">
          <Image
            src={top3[1]?.mainImage || '/placeholder.jpg'}
            alt={top3[1]?.name || '2nd'}
            fill
            className="object-cover rounded-full border-4 border-gray-300"
          />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
            #2
          </div>
        </div>
        <p className="font-semibold text-gray-700 truncate max-w-24">{top3[1]?.name}</p>
        <p className="text-sm text-gray-500">{top3[1]?.votesCount.toLocaleString()}</p>
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center transform scale-110">
        <div className="relative w-36 h-36 mb-2">
          <CrownIcon className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 text-yellow-400 drop-shadow-lg z-10" />
          <Image
            src={top3[0]?.mainImage || '/placeholder.jpg'}
            alt={top3[0]?.name || '1st'}
            fill
            className="object-cover rounded-full border-4 border-yellow-400"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-lg font-bold">
            #1
          </div>
        </div>
        <p className="font-bold text-gray-900 text-lg">{top3[0]?.name}</p>
        <p className="text-purple-600 font-semibold">{top3[0]?.votesCount.toLocaleString()}</p>
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center transform scale-90">
        <div className="relative w-28 h-28 mb-2">
          <Image
            src={top3[2]?.mainImage || '/placeholder.jpg'}
            alt={top3[2]?.name || '3rd'}
            fill
            className="object-cover rounded-full border-4 border-amber-600"
          />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            #3
          </div>
        </div>
        <p className="font-semibold text-amber-700 truncate max-w-24">{top3[2]?.name}</p>
        <p className="text-sm text-gray-500">{top3[2]?.votesCount.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const params = useParams();
  const contestId = params?.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'top10' | 'top50'>('all');

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [contestRes, leaderboardRes] = await Promise.all([
        fetch(`${API_URL}/contests/${contestId}`),
        fetch(`${API_URL}/contests/${contestId}/leaderboard`),
      ]);
      if (!contestRes.ok || !leaderboardRes.ok) {
        throw new Error('Erreur lors du chargement');
      }
      const contestData = await contestRes.json();
      const leaderboardData = await leaderboardRes.json();
      setContest(contestData);
      const raw = leaderboardData.contestants || leaderboardData || [];
      const sorted = raw
        .sort((a: any, b: any) => (b.votesCount ?? b.votes ?? 0) - (a.votesCount ?? a.votes ?? 0))
        .map((c: any, i: number) => ({
          id: c.id,
          name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
          mainImage: c.mainImage || c.image || c.avatar || '/placeholder.jpg',
          votesCount: c.votesCount ?? c.votes ?? 0,
          rank: i + 1,
          isWinner: c.isWinner ?? false,
          winnerPosition: c.winnerPosition,
        }));
      setContestants(sorted);
    } catch (err) {
      setError('Impossible de charger le classement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contestId) {
      fetchLeaderboard();
    }
  }, [contestId]);

  const filteredContestants = contestants
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => {
      if (filter === 'top10') return c.rank! <= 10;
      if (filter === 'top50') return c.rank! <= 50;
      return true;
    });

  const handleRetry = () => {
    fetchLeaderboard();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-12">
            <LoadingSpinner size="lg" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <ErrorAlert
          message={error}
          actionLabel="Réessayer"
          onAction={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrophyIcon className="w-12 h-12 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold">Classement</h1>
          </div>
          <h2 className="text-xl text-purple-100 mb-6">{contest?.title}</h2>
          
          {/* User Progress */}
          <div className="max-w-md mx-auto">
            <VoteProgress
              userVotes={0}
              maxVotes={10}
              totalVotes={contestants.reduce((acc, c) => acc + c.votesCount, 0)}
              size="md"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un participant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {(['all', 'top10', 'top50'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    filter === f 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'Tous' : f === 'top10' ? 'Top 10' : 'Top 50'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {filteredContestants.length} participants
            </div>
            <ShareButton
              url={`/votes/${contestId}/leaderboard`}
              title={`Classement - ${contest?.title}`}
              description="Découvrez le classement des participants !"
              variant="icon"
              size="sm"
            />
          </div>
        </div>

        {/* Top 3 Podium Preview */}
        {filter === 'all' && (
          <div className="mb-8">
            <TopThreePreview contestants={contestants} />
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-4">
          {filteredContestants.map((contestant, index) => (
            <LeaderboardRow
              key={contestant.id}
              contestant={contestant}
              index={index}
              isCurrentUser={contestant.id === 'current-user'}
            />
          ))}
        </div>

        {/* Load More */}
        {filteredContestants.length < contestants.length && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow">
              Charger plus
            </button>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Vous aussi, participez au vote !
          </h3>
          <Link
            href={`/votes/${contestId}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors"
          >
            Retour au concours
          </Link>
        </div>
      </div>
    </div>
  );
}

