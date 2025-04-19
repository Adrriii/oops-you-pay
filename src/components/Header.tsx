import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <Box 
      component="header" 
      role="banner"
      sx={{ width: '100%', position: 'relative', mb: 4 }}
    >
      <Box 
        component="nav"
        aria-label="Language selection"
        sx={{ position: 'absolute', top: 0, right: 0 }}
      >
        <LanguageSwitcher />
      </Box>
      
      <Typography 
        variant="h1" 
        component="h1"
        gutterBottom 
        align="center"
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          color: 'primary.main'
        }}
      >
        {t('app.title')}
      </Typography>
      <Typography 
        variant="h6" 
        component="p"
        color="text.secondary" 
        gutterBottom 
        align="center"
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}
      >
        {t('app.subtitle')}
      </Typography>
    </Box>
  );
};