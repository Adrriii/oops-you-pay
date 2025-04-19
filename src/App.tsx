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

function App() {
  const { fetchRatesIfNeeded } = useExchangeRatesStore();

  useEffect(() => {
    fetchRatesIfNeeded();
  }, []); 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container 
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
          
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <AddSubscription />
          </Box>
          
          <Box sx={{ width: '100%' }}>
            <SubscriptionList />
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
