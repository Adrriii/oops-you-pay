import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';

// List of available locales (only those that have translation files)
const availableLocales = [
  'en',
  'fr',
  'de',
  'es',
  'it',
  'ja',
  'ko',
  'pt',
  'zh-CN',
  'zh-TW'
];

// Map of full locale codes to their base language codes
const localeMap: Record<string, string> = {
  'en-US': 'en',
  'en-GB': 'en',
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'es-ES': 'es',
  'es-MX': 'es',
  'de-DE': 'de',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-TW'
};

// Normalize locale code to base language code
const normalizeLocale = (locale: string): string => {
  return localeMap[locale] || locale.split('-')[0];
};

// Check if a locale is available
const isLocaleAvailable = (locale: string): boolean => {
  const normalized = normalizeLocale(locale);
  return availableLocales.includes(normalized);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Disable suspense to avoid loading flickers
    }
  });

// Define async resource loading for non-English languages
export const loadLocale = async (language: string) => {
  console.log('Loading locale:', language);
  
  // If the language is English, we already have the translations loaded
  if (language === 'en') {
    return;
  }

  // Check if the locale is available before attempting to load it
  if (!isLocaleAvailable(language)) {
    console.log(`Locale ${language} not available, falling back to English`);
    await i18n.changeLanguage('en');
    return;
  }
  
  try {
    // Normalize the locale code before trying to load resources
    const normalizedLocale = normalizeLocale(language);
    console.log('Normalized locale:', normalizedLocale);

    const module = await import(`./locales/${normalizedLocale}.json`);
    console.log('Loaded locale:', module);
    
    // Change the language but keep the original language code for proper regional handling
    await i18n.changeLanguage(language);
    console.log('Changed language:', language);
    
    await i18n.addResourceBundle(language, 'translation', module.default, true, true);
    console.log('Added resource bundle:', module.default);
    
    // Force update all translations
    await i18n.reloadResources([language]);
    console.log('Reloaded resources:', language);
    
    // Trigger a manual language change event to ensure all components update
    i18n.emit('languageChanged', language);
    console.log('Emitted languageChanged event:', language);
  } catch (error) {
    console.error(`Error loading language ${language}:`, error);
    // If the normalized locale is different from the original, try falling back to it
    const normalizedLocale = normalizeLocale(language);
    if (normalizedLocale !== language) {
      console.log('Falling back to base language:', normalizedLocale);
      await loadLocale(normalizedLocale);
    } else {
      // Fallback to English on any error
      console.log('Error loading locale, falling back to English');
      await i18n.changeLanguage('en');
    }
  }
};

// Load initial language if it's not English
const initialLanguage = i18n.language || 'en';
if (initialLanguage !== 'en') {
  loadLocale(initialLanguage);
}

export default i18n;