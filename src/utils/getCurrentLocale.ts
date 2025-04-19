import i18n from '../i18n/i18n';
import { languages } from '../components/LanguageSwitcher';

export const getCurrentLocale = () => {
  const currentLanguage = languages.find(lang => lang.code === i18n.language);
  return currentLanguage?.locale || navigator.language;
};