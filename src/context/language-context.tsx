'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { dictionary } from '@/lib/i18n';
import type { Dictionary } from '@/lib/i18n/en';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('mindmate-language') as Language | null;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'id')) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('mindmate-language', lang);
    setLanguageState(lang);
  };
  
  const currentDictionary = useMemo(() => dictionary[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dictionary: currentDictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
