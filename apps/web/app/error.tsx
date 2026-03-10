'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Segment error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        <p className="text-sm font-semibold text-red-600 mb-3">Erreur 500</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-8">
          Un problème inattendu est apparu. Veuillez réessayer.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-xl bg-[#5B7CFF] px-5 py-3 text-white font-semibold hover:opacity-90 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}
