'use client';

import { useState } from 'react';
import { HeartIcon } from '@tikeo/ui';

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

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const method = liked ? 'DELETE' : 'POST';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/likes/events/${eventId}`,
        {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
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

