'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContestLeaderboardEntry } from '@tikeo/types';
import { TrophyIcon, CrownIcon, MedalIcon } from './Icons';

interface LeaderboardProps {
  entries: ContestLeaderboardEntry[];
  title?: string;
  showPercentage?: boolean;
  variant?: 'card' | 'list';
}

export function Leaderboard({
  entries,
  title = 'Classement',
  showPercentage = true,
  variant = 'list',
}: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <TrophyIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Aucun participant pour le moment</p>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
        <div className="grid gap-4">
          {entries.map((entry) => (
            <LeaderboardCard key={entry.contestantId} entry={entry} showPercentage={showPercentage} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrophyIcon className="w-6 h-6" />
          {title}
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {entries.map((entry) => (
          <LeaderboardRow key={entry.contestantId} entry={entry} showPercentage={showPercentage} />
        ))}
      </div>
    </div>
  );
}

function LeaderboardCard({ entry, showPercentage }: { entry: ContestLeaderboardEntry; showPercentage: boolean }) {
  const rankIcons = [CrownIcon, MedalIcon, TrophyIcon];
  const RankIcon = entry.rank <= 3 ? rankIcons[entry.rank - 1] : null;
  const rankColors = [
    'from-yellow-400 to-yellow-600',
    'from-gray-300 to-gray-500',
    'from-amber-600 to-amber-800',
  ];

  return (
    <div className={`relative overflow-hidden rounded-xl bg-white shadow-md ${entry.isWinner ? 'ring-2 ring-yellow-400' : ''}`}>
      {/* Rank */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${rankColors[entry.rank - 1] || 'bg-gray-200'}`} />
      
      <div className="flex items-center gap-4 p-4">
        {/* Rank Icon */}
        <div className="relative w-12 h-12 flex-shrink-0">
          {RankIcon && (
            <RankIcon className={`w-12 h-12 ${
              entry.rank === 1 ? 'text-yellow-500' :
              entry.rank === 2 ? 'text-gray-400' :
              'text-amber-600'
            }`} />
          )}
          <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-sm font-bold ${
            entry.rank === 1 ? 'text-yellow-500' :
            entry.rank === 2 ? 'text-gray-500' :
            'text-gray-700'
          }`}>
            {entry.rank}
          </span>
        </div>

        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={entry.contestantImage || '/placeholder.jpg'}
            alt={entry.contestantName}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{entry.contestantName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-purple-600" suppressHydrationWarning>{entry.votesCount ?? 0}</span>
            <span className="text-sm text-gray-500">votes</span>
            {showPercentage && (
              <span className="text-sm text-gray-400" suppressHydrationWarning>({entry.percentage ?? 0}%)</span>
            )}
          </div>
        </div>

        {/* Winner Badge */}
        {entry.isWinner && (
          <div className="flex-shrink-0">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              🏆 #{entry.winnerPosition}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showPercentage && (
        <div className="px-4 pb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${rankColors[entry.rank - 1] || 'from-purple-500 to-pink-500'}`}
              style={{ width: `${entry.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ entry, showPercentage }: { entry: ContestLeaderboardEntry; showPercentage: boolean }) {
  const rankColors = ['bg-yellow-400', 'bg-gray-400', 'bg-amber-600', 'bg-gray-200'];
  const rowColors = entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : '';

  return (
    <div className={`flex items-center gap-4 px-6 py-4 ${rowColors}`}>
      {/* Rank */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${rankColors[entry.rank - 1] || 'bg-gray-100'} ${
        entry.rank <= 3 ? 'text-white' : 'text-gray-600'
      }`}>
        {entry.rank}
      </div>

      {/* Image */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={entry.contestantImage || '/placeholder.jpg'}
          alt={entry.contestantName}
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{entry.contestantName}</p>
        {entry.isWinner && (
          <span className="text-xs text-yellow-600">🏆 Gagnant #{entry.winnerPosition}</span>
        )}
      </div>

      {/* Votes */}
      <div className="text-right">
        <p className="font-bold text-gray-900">{entry.votesCount ?? 0}</p>
        {showPercentage && (
          <p className="text-xs text-gray-500">{entry.percentage ?? 0}%</p>
        )}
      </div>

      {/* Progress */}
      {showPercentage && (
        <div className="w-24">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${entry.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;

