'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookies, type CookiePreferences } from '../context/CookieContext';
import { CookieIcon, SettingsIcon, CloseIcon } from '@tikeo/ui';

interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  description: string;
  required: boolean;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essentiels',
    description: 'Nécessaires au fonctionnement du site',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytiques',
    description: 'Nous aident à améliorer le site',
    required: false,
  },
  {
    id: 'functional',
    name: 'Fonctionnels',
    description: 'Améliorent votre expérience',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Permettent des publicités personnalisées',
    required: false,
  },
];

export function CookieConsentBanner() {
  const { preferences, hasInteracted, acceptAll, rejectAll, updatePreferences } = useCookies();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't interacted yet
    if (!hasInteracted) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  const handleAccept = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      acceptAll();
      setIsVisible(false);
    }, 300);
  };

  const handleReject = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      rejectAll();
      setIsVisible(false);
    }, 300);
  };

  const handleSaveSettings = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setShowSettings(false);
      setIsVisible(false);
    }, 300);
  };

  const toggleCategory = (categoryId: keyof CookiePreferences) => {
    if (categoryId === 'essential') return; // Can't toggle essential
    updatePreferences({ [categoryId]: !preferences[categoryId] });
  };

  if (!isVisible && !hasInteracted) return null;

  // Full settings modal
  if (showSettings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div 
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 ${
            isAnimatingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="text-[#5B7CFF]" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Paramètres des cookies
                </h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <p className="text-gray-600 text-sm mb-6">
              Gérez vos préférences en matière de cookies. Les cookies essentiels sont nécessaires au fonctionnement du site.
            </p>

            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  preferences[category.id] 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {category.required && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Obligatoire
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    disabled={category.required}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      category.required
                        ? 'bg-green-500 cursor-not-allowed'
                        : preferences[category.id]
                        ? 'bg-[#5B7CFF]'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        preferences[category.id] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Tout refuser
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex-1 px-4 py-3 bg-[#5B7CFF] text-white font-medium rounded-xl hover:bg-[#4a6ae5] transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Banner at bottom
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg transition-all duration-500 ${
        isAnimatingOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <CookieIcon className="text-[#5B7CFF]" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Nous utilisons des cookies
            </h3>
            <p className="text-sm text-gray-600 max-w-xl">
              Nous utilisons des cookies pour améliorer votre expérience sur Tikeo. 
              Certains sont nécessaires au fonctionnement du site, tandis que d&apos;autres nous aident à optimiser nos services.
              <Link href="/cookies" className="text-[#5B7CFF] hover:underline ml-1">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
          >
            <SettingsIcon size={16} />
            Personnaliser
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Tout refuser
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-[#5B7CFF] text-white font-medium rounded-xl hover:bg-[#4a6ae5] transition-colors"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}

