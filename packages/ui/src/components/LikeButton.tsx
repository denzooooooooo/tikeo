'use client';

import { useState } from 'react';
import { HeartIcon } from './Icons';

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
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLike = async () => {
    if (loading) return;

    const storedTokens = localStorage.getItem('auth_tokens');
    const token = storedTokens ? JSON.parse(storedTokens).accessToken : null;

    if (!token) {
      showToast('Connectez-vous pour liker cet événement');
      return;
    }

    setLoading(true);
    try {
      const method = liked ? 'DELETE' : 'POST';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiUrl}/likes/events/${eventId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
      } else if (response.status === 401) {
        showToast('Session expirée — reconnectez-vous');
      } else {
        showToast('Erreur lors du like');
      }
    } catch {
      showToast('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const iconSizes = { sm: 16, md: 20, lg: 24 };

  return (
    <div className="relative">
      {toast && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 rounded-full transition-all duration-200 ${
          liked
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500'
        } ${sizeClasses[size]} justify-center shadow-lg`}
        aria-label={liked ? 'Retirer le like' : 'Mettre un like'}
      >
        <HeartIcon
          size={iconSizes[size]}
          className={`transition-all duration-200 ${liked ? 'fill-current scale-110' : ''}`}
        />
        {showCount && count > 0 && (
          <span className="text-sm font-semibold pr-1">{count}</span>
        )}
      </button>
    </div>
  );
}
