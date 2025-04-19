import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%', position: 'relative', mb: 4 }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
        <LanguageSwitcher />
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