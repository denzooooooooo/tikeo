import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasInteracted: boolean;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const STORAGE_KEY = 'tikeo_cookie_preferences';

export function useCookies() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
}

function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storePreferences(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { detail: prefs }));
  } catch {
    // Storage not available
  }
}

interface CookieProviderProps {
  children: ReactNode;
}

export function CookieProvider({ children }: CookieProviderProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage on mount
    const stored = getStoredPreferences();
    if (stored) {
      setPreferences(stored);
      setHasInteracted(true);
    }
    setIsLoaded(true);
  }, []);

  const updatePreferences = (prefs: Partial<CookiePreferences>) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...prefs, essential: true }; // Essential always true
      storePreferences(newPrefs);
      return newPrefs;
    });
    setHasInteracted(true);
  };

  const acceptAll = () => {
    const allPrefs: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allPrefs);
    storePreferences(allPrefs);
    setHasInteracted(true);
  };

  const rejectAll = () => {
    const minPrefs: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(minPrefs);
    storePreferences(minPrefs);
    setHasInteracted(true);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setHasInteracted(false);
  };

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasInteracted,
        updatePreferences,
        acceptAll,
        rejectAll,
        resetPreferences,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

// Utility to check if a cookie category is allowed
export function isCookieAllowed(category: keyof CookiePreferences): boolean {
  if (typeof window === 'undefined') return category === 'essential';
  const stored = getStoredPreferences();
  if (!stored) return category === 'essential';
  return stored[category];
}

