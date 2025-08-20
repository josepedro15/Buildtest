import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
}

interface UseCookiesReturn {
  preferences: CookiePreferences;
  updatePreferences: (newPreferences: Partial<CookiePreferences>) => void;
  hasAccepted: boolean;
  acceptAll: () => void;
  acceptEssential: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  preferences: false,
};

export function useCookies(): UseCookiesReturn {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    // Carregar preferências salvas
    const savedPreferences = localStorage.getItem('cookiesPreferences');
    const accepted = localStorage.getItem('cookiesAccepted');

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Erro ao carregar preferências de cookies:', error);
      }
    }

    if (accepted === 'true') {
      setHasAccepted(true);
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('cookiesPreferences', JSON.stringify(updated));
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    setHasAccepted(true);
    localStorage.setItem('cookiesPreferences', JSON.stringify(allAccepted));
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const acceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      preferences: false,
    };
    setPreferences(essentialOnly);
    setHasAccepted(true);
    localStorage.setItem('cookiesPreferences', JSON.stringify(essentialOnly));
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setHasAccepted(false);
    localStorage.removeItem('cookiesPreferences');
    localStorage.removeItem('cookiesAccepted');
  };

  return {
    preferences,
    updatePreferences,
    hasAccepted,
    acceptAll,
    acceptEssential,
    resetPreferences,
  };
}
