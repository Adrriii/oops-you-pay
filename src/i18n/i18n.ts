import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';

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
  
  try {
    const module = await import(`./locales/${language}.json`);
	console.log('Loaded locale:', module);
    await i18n.changeLanguage(language); // First change the language
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
    // Fallback to English on error
    await i18n.changeLanguage('en');
  }
};

// Load initial language if it's not English
const initialLanguage = i18n.language || 'en';
if (initialLanguage !== 'en') {
  loadLocale(initialLanguage);
}

export default i18n;