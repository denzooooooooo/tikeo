'use client';

import { useState, useEffect } from 'react';
import { UsersIcon } from './Icons';

const TOKEN_KEY = 'auth_tokens';

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
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Fetch initial status from API on mount
  useEffect(() => {
    async function fetchStatus() {
      try {
        const storedTokens = localStorage.getItem(TOKEN_KEY);
        const tokenData = storedTokens ? JSON.parse(storedTokens) : null;
        const token = tokenData?.accessToken;
        
        if (!token) {
          console.log('[FollowButton] No token found, using initial state');
          setDebugInfo('No token - guest mode');
          setInitialized(true);
          return;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';
        console.log('[FollowButton] Fetching follow status for organizer:', organizerId);

        const response = await fetch(
          `${apiUrl}/likes/organizers/${organizerId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        console.log('[FollowButton] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[FollowButton] Response data:', data);
          setFollowed(data.isFollowing || data.isSubscribed || false);
          setCount(data.subscribersCount || data.subscribers || initialCount);
          setDebugInfo(`Connected - following: ${data.isFollowing || data.isSubscribed}`);
        } else {
          console.log('[FollowButton] API error, using initial state');
          setDebugInfo(`API error: ${response.status}`);
        }
      } catch (error) {
        console.log('[FollowButton] Error fetching status:', error);
        setDebugInfo('Error');
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
      const storedTokens = localStorage.getItem(TOKEN_KEY);
      const tokenData = storedTokens ? JSON.parse(storedTokens) : null;
      const token = tokenData?.accessToken;
      
      if (!token) {
        alert('Veuillez vous connecter pour suivre cet organisateur');
        setLoading(false);
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';
      const method = followed ? 'DELETE' : 'POST';

      console.log('[FollowButton] Toggling follow:', { organizerId, method });

      const response = await fetch(
        `${apiUrl}/likes/organizers/${organizerId}/follow`,
        {
          method,
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          },
        }
      );

      console.log('[FollowButton] Toggle response:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[FollowButton] Toggle data:', data);
        // Use server response to update state
        const newFollowed = data.subscribed !== undefined ? data.subscribed : !followed;
        setFollowed(newFollowed);
        setCount(data.subscribers !== undefined ? data.subscribers : count);
        setDebugInfo(`Updated - following: ${newFollowed}`);
      } else if (response.status === 401) {
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
      title={debugInfo}
    >
      <UsersIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      <span>{followed ? 'Abonné' : 'Suivre'}</span>
      {showCount && (
        <span className="opacity-80">{count > 0 ? count : ''}</span>
      )}
    </button>
  );
}

