'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCountries, searchCountries, type Country } from '../context/GeolocationContext';

// SVG Icons - Custom Beautiful Icons
const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MapPinIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

interface CountrySelectorProps {
  value?: string;
  onChange: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
  showFlag?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountrySelector({
  value,
  onChange,
  placeholder = 'Sélectionner un pays',
  className = '',
  showFlag = true,
  size = 'md',
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const countries = useCountries();
  const filteredCountries = search ? searchCountries(search) : countries;
  
  // Get selected country
  const selectedCountry = value ? countries.find(c => c.code === value) : null;

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredCountries.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCountries[highlightedIndex]) {
            onChange(filteredCountries[highlightedIndex].code);
            setIsOpen(false);
            setSearch('');
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearch('');
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCountries, highlightedIndex, onChange]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlighted = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.code);
    setIsOpen(false);
    setSearch('');
  };

  // Popular countries to show at top
  const popularCodes = ['FR', 'US', 'GB', 'DE', 'ES', 'IT', 'BE', 'CH', 'NL', 'CA'];
  const popularCountries = countries.filter(c => popularCodes.includes(c.code));
  const otherCountries = countries.filter(c => !popularCodes.includes(c.code));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2
          bg-white/80 backdrop-blur-lg border-2 border-sky-200/50
          rounded-xl font-medium text-gray-900
          hover:bg-white hover:border-[#5B7CFF]/50
          focus:outline-none focus:border-[#5B7CFF] focus:ring-4 focus:ring-[#5B7CFF]/10
          transition-all duration-200
          ${sizeClasses[size]}
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          {showFlag && selectedCountry && (
            <span className="text-xl flex-shrink-0">{selectedCountry.flag}</span>
          )}
          <span className={`truncate ${!selectedCountry ? 'text-gray-400' : ''}`}>
            {selectedCountry ? selectedCountry.name : placeholder}
          </span>
        </div>
        <ChevronDownIcon 
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${iconSizes[size]}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2">
          {/* Search Input */}
          <div className="glass-card rounded-t-xl overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder="Rechercher un pays..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/10 transition-all"
                  autoFocus
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Countries List */}
            <div 
              ref={listRef}
              className="max-h-72 overflow-y-auto"
            >
              {/* Popular Countries */}
              {!search && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Pays populaires
                  </p>
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleSelect(country)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-150
                        ${value === country.code 
                          ? 'bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 text-[#5B7CFF]' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                      {value === country.code && (
                        <CheckIcon className="ml-auto w-4 h-4 text-[#5B7CFF]" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* All Countries or Search Results */}
              <div className="p-2 border-t border-gray-100">
                <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {search ? `Résultats (${filteredCountries.length})` : 'Tous les pays'}
                </p>
                {(search ? filteredCountries : otherCountries).map((country, index) => (
                  <button
                    key={country.code}
                    onClick={() => handleSelect(country)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-150
                      ${(search ? filteredCountries : otherCountries)[highlightedIndex] === country
                        ? 'bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10'
                        : ''
                      }
                      ${value === country.code 
                        ? 'bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 text-[#5B7CFF]' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{country.code}</span>
                    {value === country.code && (
                      <CheckIcon className="w-4 h-4 text-[#5B7CFF]" />
                    )}
                  </button>
                ))}
              </div>

              {filteredCountries.length === 0 && search && (
                <div className="p-8 text-center">
                  <MapPinIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Aucun pays trouvé</p>
                  <p className="text-sm text-gray-400">Essayez avec un autre terme</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for forms
export function CountryBadge({ countryCode, onClick, showCode = false }: { 
  countryCode: string; 
  onClick?: () => void;
  showCode?: boolean;
}) {
  const countries = useCountries();
  const country = countries.find(c => c.code === countryCode);

  if (!country) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:border-[#5B7CFF]/30 transition-all"
    >
      <span>{country.flag}</span>
      {showCode && <span className="text-gray-500">{country.code}</span>}
    </button>
  );
}

