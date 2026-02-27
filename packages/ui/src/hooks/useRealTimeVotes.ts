'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoteUpdate {
  contestantId: string;
  votesCount: number;
  rank?: number;
}

export interface UseRealTimeVotesOptions {
  contestId: string;
  enabled?: boolean;
  pollInterval?: number; // in milliseconds
  onVoteUpdate?: (update: VoteUpdate) => void;
}

export interface UseRealTimeVotesReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  connectionError: string | null;
  reconnect: () => void;
  disconnect: () => void;
}

// Simulated real-time voting using polling
// In production, this would connect to WebSocket or SSE
export function useRealTimeVotes({
  contestId,
  enabled = true,
  pollInterval = 5000, // 5 seconds default
  onVoteUpdate,
}: UseRealTimeVotesOptions): UseRealTimeVotesReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const fetchUpdates = useCallback(async () => {
    if (!enabled || !contestId) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/contests/${contestId}/contestants`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vote updates');
      }

      const data = await response.json();
      
      if (!isMounted.current) return;

      // Notify about vote updates
      if (onVoteUpdate && Array.isArray(data.contestants || data)) {
        const contestants = data.contestants || data;
        
        // Find any contestant with updated votes
        contestants.forEach((contestant: any) => {
          onVoteUpdate({
            contestantId: contestant.id,
            votesCount: contestant.votesCount,
            rank: contestant.rank,
          });
        });
      }

      setIsConnected(true);
      setLastUpdate(new Date());
      setConnectionError(null);
    } catch (error) {
      if (isMounted.current) {
        setConnectionError(error instanceof Error ? error.message : 'Connection error');
        setIsConnected(false);
      }
    }
  }, [contestId, enabled, onVoteUpdate]);

  const connect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch
    fetchUpdates();

    // Set up polling
    intervalRef.current = setInterval(fetchUpdates, pollInterval);
  }, [fetchUpdates, pollInterval]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    isMounted.current = true;
    
    if (enabled && contestId) {
      connect();
    }

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contestId, enabled, connect, disconnect]);

  return {
    isConnected,
    lastUpdate,
    connectionError,
    reconnect,
    disconnect,
  };
}

// Hook for managing vote state with optimistic updates
export function useVoting(contestId: string) {
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);

  const canVote = useCallback((maxVotes: number) => {
    return votedIds.length < maxVotes;
  }, [votedIds]);

  const hasVotedFor = useCallback((contestantId: string) => {
    return votedIds.includes(contestantId);
  }, [votedIds]);

  const vote = useCallback(async (contestantId: string, maxVotes: number) => {
    if (!canVote(maxVotes)) {
      throw new Error('Maximum votes reached');
    }

    setIsVoting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/contest-votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contestantId,
          contestId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // Optimistic update
      setVotedIds(prev => [...prev, contestantId]);
      
      return true;
    } catch (error) {
      console.error('Vote error:', error);
      throw error;
    } finally {
      setIsVoting(false);
    }
  }, [contestId, canVote]);

  const removeVote = useCallback(async (contestantId: string) => {
    if (!hasVotedFor(contestantId)) return;

    setIsVoting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/contest-votes/${contestantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove vote');
      }

      setVotedIds(prev => prev.filter(id => id !== contestantId));
    } catch (error) {
      console.error('Remove vote error:', error);
      throw error;
    } finally {
      setIsVoting(false);
    }
  }, [hasVotedFor]);

  return {
    votedIds,
    isVoting,
    canVote,
    hasVotedFor,
    vote,
    removeVote,
    setVotedIds,
  };
}

export default useRealTimeVotes;

