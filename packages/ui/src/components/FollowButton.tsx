'use client';

import { useState, useEffect } from 'react';
import { UsersIcon } from './Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

interface FollowButtonProps {
  /** ID de l'utilisateur à suivre (userId du créateur de l'événement) */
  userId: string;
  initialFollowed?: boolean;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  /** @deprecated Utiliser userId à la place */
  organizerId?: string;
}

export function FollowButton({
  userId,
  organizerId,
  initialFollowed = false,
  initialCount = 0,
  size = 'md',
  showCount = true,
}: FollowButtonProps) {
  // Support legacy organizerId prop - use userId if provided, else fall back to organizerId
  const targetUserId = userId || organizerId || '';

  const [followed, setFollowed] = useState(initialFollowed);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch real follow status from API on mount
  useEffect(() => {
    if (!targetUserId) { setInitialized(true); return; }

    async function fetchStatus() {
      const token = getToken();
      try {
        // Use user follow-status endpoint (works for both logged in and guest)
        const res = await fetch(`${API_URL}/likes/users/${targetUserId}/follow-status`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setFollowed(data.isFollowing || false);
          setCount(data.followers ?? initialCount);
        }
      } catch {
        // keep initial state on error
      } finally {
        setInitialized(true);
      }
    }

    fetchStatus();
  }, [targetUserId]);

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        alert('Veuillez vous connecter pour suivre cet utilisateur');
        setLoading(false);
        return;
      }

      const method = followed ? 'DELETE' : 'POST';

      const response = await fetch(`${API_URL}/likes/users/${targetUserId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newFollowed = data.following !== undefined ? data.following : !followed;
        setFollowed(newFollowed);
        setCount(prev => newFollowed ? prev + 1 : Math.max(0, prev - 1));
      } else if (response.status === 401) {
        alert('Veuillez vous connecter pour suivre cet utilisateur');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Show loading state while fetching initial status
  if (!initialized) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 rounded-full font-semibold bg-gray-100 text-gray-400 ${sizeClasses[size]}`}
      >
        <UsersIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        <span>...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`flex items-center gap-2 rounded-full font-semibold transition-all duration-200 ${
        followed
          ? 'bg-[#5B7CFF] text-white hover:bg-[#4B6CFF]'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${sizeClasses[size]}`}
      aria-label={followed ? 'Ne plus suivre' : 'Suivre'}
    >
      <UsersIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      <span>{followed ? 'Abonné' : 'Suivre'}</span>
      {showCount && (
        <span className="opacity-80">{count > 0 ? count : ''}</span>
      )}
    </button>
  );
}

