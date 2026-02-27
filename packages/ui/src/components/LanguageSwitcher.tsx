'use client';

import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', native: 'Français' },
  { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', native: 'Español' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', native: 'Italiano' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', native: 'Português' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', native: 'Nederlands' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', native: 'Polski' },
];

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showLabel?: boolean;
  className?: string;
  onChange?: (lang: string) => void;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  showLabel = true,
  className = '',
  onChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');

  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const handleSelect = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    onChange?.(langCode);
    document.documentElement.lang = langCode;
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {LANGUAGES.slice(0, 4).map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
              currentLang === lang.code
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
      >
        <Globe className="h-4 w-4 text-gray-500" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">
                Choisir la langue
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                    currentLang === lang.code ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{lang.native}</p>
                      <p className="text-xs text-gray-500">{lang.name}</p>
                    </div>
                  </div>
                  {currentLang === lang.code && (
                    <Check className="h-4 w-4 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Plus de langues à venir...
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSwitcher;

