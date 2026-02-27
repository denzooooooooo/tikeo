'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  timezone: string;
  region?: string;
}

export interface GeolocationState {
  country: string;
  countryName: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  currency: string;
  timezone: string;
  isLoading: boolean;
  error: string | null;
}

interface GeolocationContextType extends GeolocationState {
  setCountry: (code: string) => void;
  setManualLocation: (location: Partial<GeolocationState>) => void;
  refreshLocation: () => Promise<void>;
  isDefault: boolean;
}

// ── Pays africains en PRIORITÉ (plateforme africaine) ──
const AFRICAN_COUNTRIES: Country[] = [
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', currency: 'XOF', timezone: 'Africa/Abidjan', region: 'Afrique de l\'Ouest' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', timezone: 'Africa/Dakar', region: 'Afrique de l\'Ouest' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', timezone: 'Africa/Lagos', region: 'Afrique de l\'Ouest' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', currency: 'XAF', timezone: 'Africa/Douala', region: 'Afrique Centrale' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', timezone: 'Africa/Accra', region: 'Afrique de l\'Ouest' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', timezone: 'Africa/Nairobi', region: 'Afrique de l\'Est' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', timezone: 'Africa/Casablanca', region: 'Afrique du Nord' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', currency: 'TND', timezone: 'Africa/Tunis', region: 'Afrique du Nord' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', currency: 'DZD', timezone: 'Africa/Algiers', region: 'Afrique du Nord' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', currency: 'EGP', timezone: 'Africa/Cairo', region: 'Afrique du Nord' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', currency: 'ZAR', timezone: 'Africa/Johannesburg', region: 'Afrique Australe' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', currency: 'ETB', timezone: 'Africa/Addis_Ababa', region: 'Afrique de l\'Est' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', currency: 'TZS', timezone: 'Africa/Dar_es_Salaam', region: 'Afrique de l\'Est' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', currency: 'UGX', timezone: 'Africa/Kampala', region: 'Afrique de l\'Est' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', timezone: 'Africa/Kigali', region: 'Afrique de l\'Est' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', currency: 'XOF', timezone: 'Africa/Porto-Novo', region: 'Afrique de l\'Ouest' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF', timezone: 'Africa/Ouagadougou', region: 'Afrique de l\'Ouest' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', currency: 'XOF', timezone: 'Africa/Bamako', region: 'Afrique de l\'Ouest' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', currency: 'GNF', timezone: 'Africa/Conakry', region: 'Afrique de l\'Ouest' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', currency: 'XOF', timezone: 'Africa/Lome', region: 'Afrique de l\'Ouest' },
  { code: 'CD', name: 'Congo (RDC)', flag: '🇨🇩', currency: 'CDF', timezone: 'Africa/Kinshasa', region: 'Afrique Centrale' },
  { code: 'CG', name: 'Congo (Brazzaville)', flag: '🇨🇬', currency: 'XAF', timezone: 'Africa/Brazzaville', region: 'Afrique Centrale' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', currency: 'XAF', timezone: 'Africa/Libreville', region: 'Afrique Centrale' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', currency: 'MZN', timezone: 'Africa/Maputo', region: 'Afrique Australe' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', currency: 'MGA', timezone: 'Indian/Antananarivo', region: 'Afrique Australe' },
];

// ── Autres pays (diaspora africaine) ──
const OTHER_COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', timezone: 'Europe/Paris' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', currency: 'EUR', timezone: 'Europe/Brussels' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', currency: 'CHF', timezone: 'Europe/Zurich' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', timezone: 'America/Toronto' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', currency: 'USD', timezone: 'America/New_York' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', currency: 'GBP', timezone: 'Europe/London' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', currency: 'EUR', timezone: 'Europe/Berlin' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', currency: 'EUR', timezone: 'Europe/Madrid' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', currency: 'EUR', timezone: 'Europe/Rome' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', timezone: 'Europe/Lisbon' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', currency: 'EUR', timezone: 'Europe/Amsterdam' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', currency: 'AED', timezone: 'Asia/Dubai' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', currency: 'BRL', timezone: 'America/Sao_Paulo' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', currency: 'AUD', timezone: 'Australia/Sydney' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', currency: 'JPY', timezone: 'Asia/Tokyo' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', currency: 'CNY', timezone: 'Asia/Shanghai' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', currency: 'INR', timezone: 'Asia/Kolkata' },
];

// Liste complète : Afrique d'abord, puis diaspora
const defaultCountries: Country[] = [...AFRICAN_COUNTRIES, ...OTHER_COUNTRIES];

// Codes pays africains pour détection rapide
const AFRICAN_COUNTRY_CODES = new Set(AFRICAN_COUNTRIES.map(c => c.code));

// Défaut : Côte d'Ivoire (plateforme africaine)
const defaultState: GeolocationState = {
  country: 'CI',
  countryName: 'Côte d\'Ivoire',
  region: '',
  city: 'Abidjan',
  latitude: 5.3600,
  longitude: -4.0083,
  currency: 'XOF',
  timezone: 'Africa/Abidjan',
  isLoading: true,
  error: null,
};

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GeolocationState>(defaultState);
  const [isDefault, setIsDefault] = useState(true);

  const getCountryByCode = (code: string): Country | undefined => {
    return defaultCountries.find(c => c.code === code);
  };

  const fetchGeolocation = useCallback(async () => {
    // Check localStorage first
    const stored = localStorage.getItem('tikeo_location');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const country = getCountryByCode(parsed.country);
        if (country) {
          setState({
            ...parsed,
            countryName: country.name,
            currency: country.currency,
            timezone: country.timezone,
            isLoading: false,
            error: null,
          });
          setIsDefault(false);
          return;
        }
      } catch (e) {
        // Continue to browser geolocation
      }
    }

    // Try browser geolocation first
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 3600000, // 1 hour
          });
        });

        // Use reverse geocoding to get country
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          const countryCode = data.countryCode || 'FR';
          const country = getCountryByCode(countryCode) || defaultCountries[0];

          const newState: GeolocationState = {
            country: countryCode,
            countryName: country.name,
            region: data.principalSubdivision || '',
            city: data.city || '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            currency: country.currency,
            timezone: country.timezone,
            isLoading: false,
            error: null,
          };

          setState(newState);
          setIsDefault(false);
          localStorage.setItem('tikeo_location', JSON.stringify(newState));
          return;
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError);
        }
      } catch (geoError) {
        console.log('Browser geolocation failed, using IP-based fallback');
      }
    }

    // IP-based fallback
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const countryCode = data.country_code || 'FR';
      const country = getCountryByCode(countryCode) || defaultCountries[0];

      const newState: GeolocationState = {
        country: countryCode,
        countryName: country.name,
        region: data.region || '',
        city: data.city || '',
        latitude: data.latitude || 48.8566,
        longitude: data.longitude || 2.3522,
        currency: country.currency,
        timezone: country.timezone,
        isLoading: false,
        error: null,
      };

      setState(newState);
      setIsDefault(false);
      localStorage.setItem('tikeo_location', JSON.stringify(newState));
    } catch (ipError) {
      console.error('IP-based geolocation failed:', ipError);
      
      // Default to France
      const newState: GeolocationState = {
        ...defaultState,
        isLoading: false,
        error: 'Using default location',
      };
      setState(newState);
      setIsDefault(true);
    }
  }, []);

  useEffect(() => {
    fetchGeolocation();
  }, [fetchGeolocation]);

  const setCountry = useCallback((code: string) => {
    const country = getCountryByCode(code);
    if (country) {
      const newState: GeolocationState = {
        ...state,
        country: code,
        countryName: country.name,
        currency: country.currency,
        timezone: country.timezone,
        isLoading: false,
        error: null,
      };
      setState(newState);
      setIsDefault(false);
      localStorage.setItem('tikeo_location', JSON.stringify(newState));
    }
  }, [state]);

  const setManualLocation = useCallback((location: Partial<GeolocationState>) => {
    const newState = { ...state, ...location };
    setState(newState);
    setIsDefault(false);
    localStorage.setItem('tikeo_location', JSON.stringify(newState));
  }, [state]);

  const refreshLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await fetchGeolocation();
  }, [fetchGeolocation]);

  return (
    <GeolocationContext.Provider
      value={{
        ...state,
        setCountry,
        setManualLocation,
        refreshLocation,
        isDefault,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
}

export function useCountries() {
  return defaultCountries;
}

export function getCountryByCode(code: string): Country | undefined {
  return defaultCountries.find(c => c.code === code);
}

export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return defaultCountries.filter(
    c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.code.toLowerCase().includes(lowerQuery)
  );
}

