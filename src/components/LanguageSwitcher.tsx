import { IconButton, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useState } from 'react';
import i18n from '../i18n/i18n';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' }
];

export const LanguageSwitcher = () => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      if (languageCode === 'en') {
        await i18n.changeLanguage('en');
      } else {
        await import('../i18n/i18n').then(({ loadLocale }) => {
          loadLocale(languageCode);
        });
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
        sx={{ color: 'primary.main' }}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
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
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};