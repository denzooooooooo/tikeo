'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from './Icons';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

interface EventReviewsResponse {
  reviews: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  averageRating?: number;
  totalReviews?: number;
}

interface EventReviewsProps {
  eventId: string;
}

export function EventReviews({ eventId }: EventReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, distribution: [0, 0, 0, 0, 0] });

  useEffect(() => {
    fetchReviews();
  }, [eventId, page]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/reviews/events/${eventId}?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des avis');
      }

      const data: EventReviewsResponse = await response.json();
      const reviewsData = data.reviews || [];
      const pages = data.pagination?.pages || 1;

      setReviews(reviewsData);
      setTotalPages(pages);

      const distribution = [0, 0, 0, 0, 0];
      reviewsData.forEach((r) => {
        if (r.rating >= 1 && r.rating <= 5) distribution[r.rating - 1]++;
      });

      setStats({
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || reviewsData.length,
        distribution,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setReviews([]);
      setStats({ averageRating: 0, totalReviews: 0, distribution: [0, 0, 0, 0, 0] });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size = 16) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={size}
          className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Avis ({stats.totalReviews})</h3>

      {stats.totalReviews > 0 && (
        <div className="flex items-center gap-8 mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            <div className="flex justify-center my-1">{renderStars(Math.round(stats.averageRating), 18)}</div>
            <p className="text-sm text-gray-500">{stats.totalReviews} avis</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating - 1];
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{rating}</span>
                  <StarIcon size={12} className="text-gray-400 fill-gray-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <StarIcon size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun avis pour le moment</p>
          <p className="text-sm text-gray-400">Soyez le premier à laisser un avis !</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.title && <p className="font-medium text-gray-800 mb-1">{review.title}</p>}
                {review.content && <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="text-sm text-gray-600">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
