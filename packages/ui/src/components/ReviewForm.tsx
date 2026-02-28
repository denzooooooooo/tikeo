'use client';

import { useState } from 'react';
import { StarIcon } from './Icons';

interface ReviewFormProps {
  eventId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ReviewForm({ eventId, onSuccess, onError }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedTokens = localStorage.getItem('auth_tokens');
    const token = storedTokens ? JSON.parse(storedTokens).accessToken : null;

    if (!token) {
      setError('Connectez-vous pour laisser un avis');
      return;
    }

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiUrl}/reviews/events/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      if (response.ok) {
        setRating(0);
        setComment('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        onSuccess?.();
      } else if (response.status === 401) {
        setError('Session expirée — reconnectez-vous');
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data.message || 'Erreur lors de la soumission';
        setError(msg);
        onError?.(msg);
      }
    } catch {
      setError('Erreur de connexion');
      onError?.('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">{'⭐'}</div>
        <h3 className="text-lg font-bold text-green-800 mb-1">Avis envoyé !</h3>
        <p className="text-green-600 text-sm">Merci pour votre retour.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Laisser un avis</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <StarIcon
                size={28}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience..."
          rows={3}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent resize-none text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">{comment.length} / 10 min</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
      >
        {loading ? 'Envoi...' : 'Soumettre mon avis'}
      </button>
    </form>
  );
}
