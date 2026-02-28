'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  description?: string;
  className?: string;
}

export function ShareButton({ title, description, className }: ShareButtonProps) {
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url });
      } catch {
        // User cancelled share — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Lien copié dans le presse-papiers !');
      } catch {
        showToast('Impossible de copier le lien');
      }
    }
  };

  return (
    <div className="relative">
      {toast && (
        <div className="absolute bottom-full mb-2 right-0 whitespace-nowrap px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
      <button
        onClick={handleShare}
        className={className}
        aria-label="Partager cet événement"
        title="Partager"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    </div>
  );
}
