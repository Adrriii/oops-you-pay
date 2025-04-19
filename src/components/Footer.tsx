import { Box, Link, Typography } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySelector } from './CurrencySelector';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
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
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LanguageSwitcher />
          <CurrencySelector />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link
            href="https://github.com/Adrriii/oopsyoupay"
            target="_blank"
            rel="noopener noreferrer"
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
            <GitHubIcon fontSize="small" />
            <Typography variant="body2">Adrien Boitelle</Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">
            © {currentYear}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};