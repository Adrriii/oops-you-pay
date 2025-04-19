import { Box, Link, Typography } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySelector } from './CurrencySelector';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        component="nav"
        aria-label="Footer navigation"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          maxWidth: 'lg',
          mx: 'auto',
          width: '100%'
        }}
      >
        <Box 
          component="div"
          aria-label="App settings"
          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <LanguageSwitcher />
          <CurrencySelector />
        </Box>

        <Box 
          component="div"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Link
            href="https://github.com/Adrriii/oops-you-pay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <GitHubIcon fontSize="small" aria-hidden="true" />
            <Typography variant="body2">Adrien Boitelle</Typography>
          </Link>
          <Typography 
            variant="body2" 
            color="text.secondary"
            component="p"
          >
            {t('common.footer.copyright', { year: currentYear })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};