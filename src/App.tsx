import { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { AddSubscription } from './components/AddSubscription';
import { SubscriptionList } from './components/SubscriptionList';
import { useExchangeRatesStore } from './store/exchangeRatesStore';
import { theme } from './theme';
import './i18n/i18n';

function App() {
console.log('App component rendered');
  const { fetchRatesIfNeeded } = useExchangeRatesStore();

  useEffect(() => {
    fetchRatesIfNeeded();
  }, []); 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100%',
          bgcolor: 'background.default',
          py: { xs: 3, md: 5 },
          px: 2
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
