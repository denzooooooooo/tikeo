'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  CalendarIcon,
  TicketIcon,
  StarIcon,
  TrophyIcon,
  UserIcon,
  BellIcon,
  ArrowRightIcon,
  LoadingSpinner,
} from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Activity {
  id: string;
  type: 'LIKE' | 'FOLLOW' | 'REVIEW' | 'PURCHASE' | 'CONTEST_VOTE' | 'EVENT_CREATED';
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  event?: {
    id: string;
    title: string;
    coverImage?: string;
  };
  organizer?: {
    id: string;
    companyName: string;
    logo?: string;
  };
  contest?: {
    id: string;
    title: string;
  };
  message: string;
  createdAt: string;
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const response = await fetch(`${API_URL}/users/activity${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Mock data for demo
      setActivities([
        {
          id: '1',
          type: 'LIKE',
          user: { id: '1', firstName: 'Marie', lastName: 'Dupont', avatar: 'https://picsum.photos/seed/user1/100/100' },
          event: { id: '1', title: 'Festival Jazz 2024', coverImage: 'https://picsum.photos/seed/event1/400/300' },
          message: 'a aimé cet événement',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: '2',
          type: 'FOLLOW',
          user: { id: '2', firstName: 'Jean', lastName: 'Martin' },
          organizer: { id: '1', companyName: 'Paris Events', logo: 'https://picsum.photos/seed/org1/100/100' },
          message: 'suit cet organisateur',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '3',
          type: 'PURCHASE',
          user: { id: '3', firstName: 'Sophie', lastName: 'Bernard' },
          event: { id: '2', title: 'Concert Rock Arena', coverImage: 'https://picsum.photos/seed/event2/400/300' },
          message: 'a acheté des billets pour',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
        {
          id: '4',
          type: 'REVIEW',
          user: { id: '4', firstName: 'Lucas', lastName: 'Moreau' },
          event: { id: '3', title: 'Tech Conference 2024', coverImage: 'https://picsum.photos/seed/event3/400/300' },
          message: 'a laissé un avis sur',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: '5',
          type: 'CONTEST_VOTE',
          user: { id: '5', firstName: 'Emma', lastName: 'Petit' },
          contest: { id: '1', title: 'Miss France 2024' },
          message: 'a vote pour',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <HeartIcon className="text-red-500" size={20} />;
      case 'FOLLOW':
        return <UserIcon className="text-blue-500" size={20} />;
      case 'PURCHASE':
        return <TicketIcon className="text-green-500" size={20} />;
      case 'REVIEW':
        return <StarIcon className="text-yellow-500" size={20} />;
      case 'CONTEST_VOTE':
        return <TrophyIcon className="text-purple-500" size={20} />;
      default:
        return <BellIcon className="text-gray-500" size={20} />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString('fr-FR');
  };

  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'LIKE', label: 'Likes' },
    { id: 'FOLLOW', label: 'Abonnements' },
    { id: 'PURCHASE', label: 'Achats' },
    { id: 'REVIEW', label: 'Avis' },
    { id: 'CONTEST_VOTE', label: 'Votes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Fil d&apos;activité
          </h1>
          <p className="text-gray-600">
           Suivez les dernières activités des personnes que vous suivez
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filter === f.id
                  ? 'bg-[#5B7CFF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Activity List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <BellIcon className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune activité
            </h3>
            <p className="text-gray-600 mb-6">
              Suivez des utilisateurs et des organizers pour voir leur activité ici
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#7B61FF] transition-colors"
            >
              Découvrir des événements
              <ArrowRightIcon size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] flex items-center justify-center text-white font-bold">
                      {activity.user?.avatar ? (
                        <Image
                          src={activity.user.avatar}
                          alt={activity.user.firstName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        activity.user?.firstName?.charAt(0) || '?'
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-gray-900">
                          <span className="font-bold">
                            {activity.user?.firstName} {activity.user?.lastName}
                          </span>{' '}
                          {activity.message}{' '}
                          {activity.event && (
                            <Link
                              href={`/events/${activity.event.id}`}
                              className="font-semibold text-[#5B7CFF] hover:underline"
                            >
                              {activity.event.title}
                            </Link>
                          )}
                          {activity.organizer && (
                            <Link
                              href={`/organizers/${activity.organizer.id}`}
                              className="font-semibold text-[#5B7CFF] hover:underline"
                            >
                              {activity.organizer.companyName}
                            </Link>
                          )}
                          {activity.contest && (
                            <Link
                              href={`/votes/${activity.contest.id}`}
                              className="font-semibold text-[#5B7CFF] hover:underline"
                            >
                              {activity.contest.title}
                            </Link>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimeAgo(activity.createdAt)}
                        </p>
                      </div>

                      {/* Activity Type Icon */}
                      <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>

                    {/* Preview Image */}
                    {activity.event?.coverImage && (
                      <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden">
                        <Image
                          src={activity.event.coverImage}
                          alt={activity.event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {activities.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-all">
              Charger plus d&apos;activité
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

