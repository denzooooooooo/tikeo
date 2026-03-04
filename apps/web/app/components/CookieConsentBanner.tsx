'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookies, type CookiePreferences } from '../context/CookieContext';

interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  description: string;
  required: boolean;
  icon: string;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essentiels',
    description: 'Authentification, sécurité, panier — indispensables au fonctionnement',
    required: true,
    icon: '',
  },
  {
    id: 'analytics',
    name: 'Analytiques',
    description: 'Statistiques anonymes pour améliorer le site',
    required: false,
    icon: '',
  },
  {
    id: 'functional',
    name: 'Fonctionnels',
    description: 'Préférences de langue, devise, localisation',
    required: false,
    icon: '',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Publicités personnalisées selon vos intérêts',
    required: false,
    icon: '',
  },
];

export function CookieConsentBanner() {
  const { preferences, hasInteracted, isLoaded, acceptAll, rejectAll, updatePreferences } = useCookies();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  //  Fix: attendre isLoaded avant de décider d'afficher 
  useEffect(() => {
    if (!isLoaded) return; // Attendre que localStorage soit lu
    if (!hasInteracted) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
    // Si déjà interagi → ne jamais afficher
    setIsVisible(false);
  }, [isLoaded, hasInteracted]);

  const dismiss = (action: () => void) => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      action();
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 350);
  };

  const handleAccept = () => dismiss(acceptAll);
  const handleReject = () => dismiss(rejectAll);
  const handleSaveSettings = () => {
    dismiss(() => {
      setShowSettings(false);
    });
  };

  const toggleCategory = (categoryId: keyof CookiePreferences) => {
    if (categoryId === 'essential') return;
    updatePreferences({ [categoryId]: !preferences[categoryId] });
  };

  //  Fix: ne rien rendre si pas visible 
  if (!isVisible) return null;

  //  Modal paramètres 
  if (showSettings) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-350 ${
            isAnimatingOut ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, #5B7CFF20, #7B61FF20)' }}>
                
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Paramètres des cookies</h2>
                <p className="text-xs text-gray-500">Personnalisez vos préférences</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              
            </button>
          </div>

          {/* Categories */}
          <div className="p-5 space-y-3 max-h-[55vh] overflow-y-auto">
            {cookieCategories.map((cat) => (
              <div
                key={cat.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  preferences[cat.id]
                    ? 'border-[#5B7CFF]/30 bg-[#5B7CFF]/5'
                    : 'border-gray-100 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl flex-shrink-0">{cat.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                        {cat.required && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    disabled={cat.required}
                    aria-label={`${preferences[cat.id] ? 'Désactiver' : 'Activer'} ${cat.name}`}
                    className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/50 ${
                      cat.required
                        ? 'bg-green-500 cursor-not-allowed'
                        : preferences[cat.id]
                        ? 'bg-[#5B7CFF]'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        preferences[cat.id] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Tout refuser
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  }

  //  Banner principal 
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-400 ${
        isAnimatingOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Gradient border top */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #5B7CFF, #7B61FF, #5B7CFF)' }} />

      <div className="bg-white/95 backdrop-blur-md shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Icon + Text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5B7CFF15, #7B61FF15)' }}
              >
                
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  Nous utilisons des cookies
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Pour améliorer votre expérience et analyser notre trafic.{' '}
                  <Link href="/cookies" className="text-[#5B7CFF] hover:underline font-medium">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 text-xs text-gray-500 font-medium hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                 Personnaliser
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-xs text-white font-semibold rounded-lg transition-all hover:opacity-90 active:scale-95 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
              >
                 Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
