'use client';

import { useState } from 'react';
import { UsersIcon } from './Icons';

interface FollowButtonProps {
  organizerId: string;
  initialFollowed?: boolean;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function FollowButton({
  organizerId,
  initialFollowed = false,
  initialCount = 0,
  size = 'md',
  showCount = true,
}: FollowButtonProps) {
  const [followed, setFollowed] = useState(initialFollowed);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleFollow = async () => {
    if (loading) return;

    const storedTokens = localStorage.getItem('auth_tokens');
    const token = storedTokens ? JSON.parse(storedTokens).accessToken : null;

    if (!token) {
      showToast('Connectez-vous pour suivre cet organisateur');
      return;
    }

    setLoading(true);
    try {
      const method = followed ? 'DELETE' : 'POST';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiUrl}/likes/organizers/${organizerId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowed(!followed);
        setCount(followed ? count - 1 : count + 1);
        showToast(followed ? 'Vous ne suivez plus cet organisateur' : 'Vous suivez maintenant cet organisateur');
      } else if (response.status === 401) {
        showToast('Session expirée — reconnectez-vous');
      } else {
        showToast('Erreur lors de l\'action');
      }
    } catch {
      showToast('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <div className="relative">
      {toast && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 ${
          followed
            ? 'bg-[#5B7CFF] text-white hover:bg-[#4B6CFF]'
            : 'bg-gray-100 text-gray-700 hover:bg-[#5B7CFF]/10 hover:text-[#5B7CFF] border border-gray-200'
        } ${sizeClasses[size]}`}
        aria-label={followed ? 'Ne plus suivre' : 'Suivre'}
      >
        <UsersIcon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
        <span>{followed ? 'Suivi ✓' : 'Suivre'}</span>
        {showCount && count > 0 && (
          <span className="opacity-70 text-xs">{count}</span>
        )}
      </button>
    </div>
  );
}
