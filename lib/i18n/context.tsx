'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import de from './translations/de.json';
import en from './translations/en.json';

type Language = 'de' | 'en';

type Translations = typeof de;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translationsMap = {
  de,
  en,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('papyr_language') as Language;
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('papyr_language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translationsMap[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value as string;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: translationsMap[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
