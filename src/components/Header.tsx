import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
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

export const Header = () => {
  const { t } = useTranslation();
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // For English, directly change the language without loading resources
      if (languageCode === 'en') {
        await i18n.changeLanguage('en');
      } else {
        // For other languages, use the loadLocale function
        await import('../i18n/i18n').then(({ loadLocale }) => {
          loadLocale(languageCode);
        });
      }
      handleLanguageMenuClose();
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback to English on error
      await i18n.changeLanguage('en');
      handleLanguageMenuClose();
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', mb: 4 }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
        <IconButton
          onClick={handleLanguageMenuOpen}
          size="large"
          sx={{ color: 'primary.main' }}
        >
          <LanguageIcon />
        </IconButton>
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={handleLanguageMenuClose}
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
      </Box>
      
      <Typography variant="h1" component="h1" gutterBottom align="center">
        {t('app.title')}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom align="center">
        {t('app.subtitle')}
      </Typography>
    </Box>
  );
};