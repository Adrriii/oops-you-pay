import { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardStats } from './components/DashboardStats';
import { AddSubscription } from './components/AddSubscription';
import { SubscriptionList } from './components/SubscriptionList';
import { useExchangeRatesStore } from './store/exchangeRatesStore';
import { theme } from './theme';
import './i18n/i18n';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', locale: 'en-US' },
  { code: 'fr', locale: 'fr-FR' },
  { code: 'de', locale: 'de-DE' },
  { code: 'es', locale: 'es-ES' },
  { code: 'it', locale: 'it-IT' },
  { code: 'pt', locale: 'pt-PT' },
  { code: 'ja', locale: 'ja-JP' },
  { code: 'ko', locale: 'ko-KR' },
  { code: 'zh-CN', locale: 'zh-CN' },
  { code: 'zh-TW', locale: 'zh-TW' }
];

function App() {
  const { fetchRatesIfNeeded } = useExchangeRatesStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchRatesIfNeeded();
  }, []); 

  // Update hreflang tags when language changes
  useEffect(() => {
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());

    // Add new hreflang tags for each supported language
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang.code;
      link.href = `https://oops-you-pay.adri-web.dev/${lang.code === 'en' ? '' : lang.code}`;
      document.head.appendChild(link);
    });

    // Add x-default hreflang
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = 'https://oops-you-pay.adri-web.dev/';
    document.head.appendChild(defaultLink);
  }, [i18n.language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        component="div"
        role="application"
        aria-label="OopsYouPay Subscription Manager"
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <main>
          <Container 
            component="section"
            maxWidth="lg" 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              py: 4 
            }}
          >
            <Header />
            <DashboardStats />
            
            <Box 
              component="section" 
              aria-label="Add Subscription"
              sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}
            >
              <AddSubscription />
            </Box>
            
            <Box 
              component="section"
              aria-label="Subscription List"
              sx={{ width: '100%' }}
            >
              <SubscriptionList />
            </Box>
          </Container>
        </main>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
