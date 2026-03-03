'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from './Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

interface LikeButtonProps {
  eventId: string;
  initialLiked?: boolean;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function LikeButton({
  eventId,
  initialLiked = false,
  initialCount = 0,
  size = 'md',
  showCount = true,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Fetch real like status from API on mount (so refresh shows correct state)
  useEffect(() => {
    async function fetchStatus() {
      const token = getToken();
      try {
        const res = await fetch(`${API_URL}/likes/events/${eventId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(data.isLiked || false);
          setCount(data.likes ?? initialCount);
        }
      } catch {
        // keep initial state on error
      }
    }
    fetchStatus();
  }, [eventId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        alert('Veuillez vous connecter pour liker cet événement');
        setLoading(false);
        return;
      }
      const method = liked ? 'DELETE' : 'POST';

      const response = await fetch(`${API_URL}/likes/events/${eventId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked !== undefined ? data.liked : !liked);
        setCount(data.likes !== undefined ? data.likes : (liked ? count - 1 : count + 1));
      } else if (response.status === 401) {
        alert('Veuillez vous connecter pour liker cet événement');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 rounded-full transition-all duration-200 ${
        liked
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${sizeClasses[size]} justify-center`}
      aria-label={liked ? 'Retirer le like' : 'Mettre un like'}
    >
      <HeartIcon
        size={iconSizes[size]}
        className={`transition-all duration-200 ${
          liked ? 'fill-current scale-110' : ''
        }`}
      />
      {showCount && (
        <span className="text-sm font-semibold">{count}</span>
      )}
    </button>
  );
}

