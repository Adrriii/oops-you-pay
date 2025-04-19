import { IconButton, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useState } from 'react';
import i18n from '../i18n/i18n';

const languages = [
  { code: 'en', name: 'English', locale: 'en-US' },
  { code: 'fr', name: 'Français', locale: 'fr-FR' },
  { code: 'de', name: 'Deutsch', locale: 'de-DE' },
  { code: 'es', name: 'Español', locale: 'es-ES' },
  { code: 'it', name: 'Italiano', locale: 'it-IT' },
  { code: 'pt', name: 'Português', locale: 'pt-PT' },
  { code: 'ja', name: '日本語', locale: 'ja-JP' },
  { code: 'ko', name: '한국어', locale: 'ko-KR' },
  { code: 'zh-CN', name: '简体中文', locale: 'zh-CN' },
  { code: 'zh-TW', name: '繁體中文', locale: 'zh-TW' }
];

export const LanguageSwitcher = () => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      const htmlElement = document.documentElement;
      const selectedLang = languages.find(lang => lang.code === languageCode);
      
      if (languageCode === 'en') {
        await i18n.changeLanguage('en');
      } else {
        await import('../i18n/i18n').then(({ loadLocale }) => {
          loadLocale(languageCode);
        });
      }

      // Update HTML lang attribute and dir attribute
      if (selectedLang) {
        htmlElement.lang = selectedLang.locale;
        htmlElement.dir = ['ar', 'he', 'fa'].includes(languageCode) ? 'rtl' : 'ltr';
      }

      handleMenuClose();
    } catch (error) {
      console.error('Error changing language:', error);
      await i18n.changeLanguage('en');
      handleMenuClose();
    }
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        aria-label={`Change language. Current language: ${currentLanguage.name}`}
        aria-haspopup="true"
        aria-expanded={Boolean(menuAnchor)}
        aria-controls={menuAnchor ? 'language-menu' : undefined}
        sx={{ color: 'primary.main' }}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        role="menu"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
            role="menuitem"
            lang={lang.locale}
            aria-current={i18n.language === lang.code ? 'true' : undefined}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};