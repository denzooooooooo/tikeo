'use client';

import { useState, useEffect } from 'react';
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
  const [initialized, setInitialized] = useState(false);

  // Fetch initial status from API on mount
  useEffect(() => {
    async function fetchStatus() {
      try {
        const storedTokens = localStorage.getItem('auth_tokens');
        const token = storedTokens ? JSON.parse(storedTokens).accessToken : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

        const response = await fetch(
          `${apiUrl}/likes/organizers/${organizerId}`,
          {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFollowed(data.isFollowing || data.isSubscribed || false);
          setCount(data.subscribersCount || data.subscribers || initialCount);
        }
      } catch (error) {
        console.log('Using initial follow state');
      } finally {
        setInitialized(true);
      }
    }

    fetchStatus();
  }, [organizerId, initialCount]);

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const storedTokens = localStorage.getItem('auth_tokens');
      const token = storedTokens ? JSON.parse(storedTokens).accessToken : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';
      const method = followed ? 'DELETE' : 'POST';

      const response = await fetch(
        `${apiUrl}/likes/organizers/${organizerId}/follow`,
        {
          method,
          headers: token 
            ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            : { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Use server response to update state
        const newFollowed = data.subscribed !== undefined ? data.subscribed : !followed;
        setFollowed(newFollowed);
        setCount(data.subscribers !== undefined ? data.subscribers : count);
      } else if (response.status === 401) {
        // Not logged in - show alert or redirect
        alert('Veuillez vous connecter pour suivre cet organisateur');
      } else {
        console.error('Follow request failed with status:', response.status);
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

