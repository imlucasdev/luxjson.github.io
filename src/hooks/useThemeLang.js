import { useState, useEffect } from 'react';

function readPreference(key, fallback, allowed) {
  try {
    const value = window.localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export default function useThemeLang() {
  const [theme, setTheme] = useState(() => readPreference('lux-theme', 'light', ['light', 'dark']));
  const [language, setLanguage] = useState(() => readPreference('lux-language', 'pt', ['pt', 'en']));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writePreference('lux-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    writePreference('lux-language', language);
  }, [language]);

  const toggleTheme = () => setTheme((previous) => (previous === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((previous) => (previous === 'pt' ? 'en' : 'pt'));

  return { theme, language, toggleTheme, toggleLanguage };
}
