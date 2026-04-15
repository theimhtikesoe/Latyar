import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "my" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const STORAGE_KEY = "latyar-language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

export function LanguageProvider({
  children,
  defaultLanguage = "my",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "my" || stored === "en") {
      return stored;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "my" ? "my" : "en";
  }, [language]);

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => {
        setLanguage((prev) => (prev === "my" ? "en" : "my"));
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
