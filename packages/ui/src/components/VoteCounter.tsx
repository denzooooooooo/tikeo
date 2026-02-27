'use client';

import React from 'react';
import { FlameIcon, TrophyIcon } from './Icons';

interface VoteCounterProps {
  votes: number;
  maxVotes: number;
  label?: string;
  showProgress?: boolean;
}

export function VoteCounter({
  votes,
  maxVotes,
  label = 'Vos votes',
  showProgress = true,
}: VoteCounterProps) {
  const percentage = Math.min((votes / maxVotes) * 100, 100);
  const remaining = maxVotes - votes;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FlameIcon className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm text-gray-500">
          {votes}/{maxVotes}
        </span>
      </div>

      {showProgress && (
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
          {Array.from({ length: maxVotes }).map((_, i) => (
            <div
              key={i}
              className={`absolute top-0 h-full w-1 bg-white/50 ${
                i < votes ? 'bg-purple-300' : ''
              }`}
              style={{ left: `${(i / maxVotes) * 100}%` }}
            />
          ))}
        </div>
      )}

      {remaining > 0 ? (
        <p className="mt-2 text-sm text-purple-600">
          {remaining} vote{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''}
        </p>
      ) : (
        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
          <TrophyIcon className="w-4 h-4" />
          <span>Vous avez utilisé tous vos votes !</span>
        </div>
      )}
    </div>
  );
}

export default VoteCounter;

