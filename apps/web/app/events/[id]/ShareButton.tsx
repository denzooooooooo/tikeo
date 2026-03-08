'use client';

import { useState } from 'react';
import { ShareIcon } from '@tikeo/ui';

interface ShareButtonProps {
  title: string;
  eventId: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tikeoh.com';

export default function ShareButton({ title, eventId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${SITE_URL}/events/${eventId}`;
    const shareData = {
      title: `${title} | Tikeoh`,
      text: `Découvre cet événement sur Tikeoh : ${title}`,
      url,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      if (typeof window !== 'undefined') {
        window.prompt('Copiez ce lien :', url);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg relative"
      aria-label="Partager cet événement"
      title={copied ? 'Lien copié !' : 'Partager'}
    >
      <ShareIcon className="text-gray-700" size={20} />
      {copied && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
          Lien copié
        </span>
      )}
    </button>
  );
}
