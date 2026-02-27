'use client';

import React, { useState } from 'react';
import { ShareIcon, CopyIcon, CheckIcon } from './Icons';

export interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
  onShare?: (platform: string) => void;
}

const shareUrls = {
  facebook: (url: string, title: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  whatsapp: (url: string, title: string) =>
    `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  linkedin: (url: string, title: string, description?: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  email: (url: string, title: string, description?: string) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || ''}\n\n${url}`)}`,
};

const platformInfo = {
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  twitter: {
    name: 'X (Twitter)',
    color: 'bg-gray-900 hover:bg-gray-800',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  whatsapp: {
    name: 'WhatsApp',
    color: 'bg-green-500 hover:bg-green-600',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-blue-700 hover:bg-blue-800',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  email: {
    name: 'Email',
    color: 'bg-gray-500 hover:bg-gray-600',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
};

const sizeClasses = {
  sm: {
    button: 'h-8 w-8',
    icon: 'h-4 w-4',
  },
  md: {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
  },
  lg: {
    button: 'h-12 w-12',
    icon: 'h-6 w-6',
  },
};

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description,
  size = 'md',
  showLabels = false,
  className = '',
  onShare,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = platformInfo[platform as keyof typeof platformInfo];
    window.open(shareUrls[platform](url, title, description), '_blank', 'width=600,height=400');
    onShare?.(platform);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShare?.('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Object.entries(platformInfo).map(([platform, info]) => (
        <button
          key={platform}
          onClick={() => handleShare(platform as keyof typeof shareUrls)}
          className={`${info.color} ${sizes.button} flex items-center justify-center rounded-full text-white transition-colors ${showLabels ? 'gap-2 px-4' : ''}`}
          title={`Partager sur ${info.name}`}
        >
          {info.icon}
          {showLabels && <span className="text-sm font-medium">{info.name}</span>}
        </button>
      ))}
      <button
        onClick={handleCopy}
        className={`${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} ${sizes.button} flex items-center justify-center rounded-full text-white transition-colors ${showLabels ? 'gap-2 px-4' : ''}`}
        title={copied ? 'Lien copié!' : 'Copier le lien'}
      >
        {copied ? (
          <CheckIcon className={`${sizes.icon}`} />
        ) : (
          <CopyIcon className={`${sizes.icon}`} />
        )}
        {showLabels && <span className="text-sm font-medium">{copied ? 'Copié!' : 'Copier'}</span>}
      </button>
    </div>
  );
};

export const ShareButton: React.FC<{
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'icon' | 'button' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}> = ({
  url,
  title,
  description,
  className = '',
  variant = 'icon',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const sizes = sizeClasses[size];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform](url, title, description), '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${variant === 'outline' ? 'border border-gray-300 bg-white hover:bg-gray-50' : 'bg-tikeo-primary hover:bg-tikeo-primary/90'} ${sizes.button} flex items-center justify-center rounded-lg text-white transition-colors`}
        title="Partager"
      >
        <ShareIcon className={`${sizes.icon}`} />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
            {Object.entries(platformInfo).map(([platform, info]) => (
              <button
                key={platform}
                onClick={() => handleShare(platform as keyof typeof shareUrls)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className={`${info.color} rounded-full p-1 text-white`}>
                  {info.icon}
                </span>
                {info.name}
              </button>
            ))}
            <hr className="my-2" />
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              {copied ? (
                <>
                  <span className="rounded-full bg-green-100 p-1 text-green-600">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  Copié!
                </>
              ) : (
                <>
                  <span className="rounded-full bg-gray-100 p-1 text-gray-600">
                    <CopyIcon className="h-4 w-4" />
                  </span>
                  Copier le lien
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButtons;

