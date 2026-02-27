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

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const method = followed ? 'DELETE' : 'POST';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/likes/organizers/${organizerId}/follow`,
        {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setFollowed(!followed);
        setCount(followed ? count - 1 : count + 1);
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
      <span>{followed ? 'Suivi' : 'Suivre'}</span>
      {showCount && (
        <span className="opacity-80">{count}</span>
      )}
    </button>
  );
}

