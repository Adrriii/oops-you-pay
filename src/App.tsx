import { ThemeProvider, CssBaseline, createTheme, Container, Box, Typography, Paper, Select, MenuItem, FormControl } from '@mui/material';
import { AddSubscription } from './components/AddSubscription';
import { SubscriptionList } from './components/SubscriptionList';
import { useSubscriptionStore } from './store/subscriptionStore';
import { useExchangeRatesStore } from './store/exchangeRatesStore';
import React from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          ':hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

function App() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const updateDisplayCurrency = useSubscriptionStore((state) => state.updateDisplayCurrency);
  const { convertAmount, lastUpdated, fetchRatesIfNeeded } = useExchangeRatesStore();

  // Fetch rates on mount if needed
  React.useEffect(() => {
    fetchRatesIfNeeded();
  }, [fetchRatesIfNeeded]);

  const calculateTotalMonthly = () => {
    console.log('Starting monthly total calculation...');
    console.log('Current subscriptions:', subscriptions);
    console.log('Display currency:', displayCurrency);
    
    return subscriptions.reduce((total, sub) => {
      console.log(`\nProcessing subscription: ${sub.name}`);
      console.log(`Original amount: ${sub.amount} ${sub.currency}`);
      
      let monthlyAmount = Number(sub.amount);
      
      // First convert to monthly amount based on billing cycle
      if (sub.billingCycle === 'yearly') {
        monthlyAmount = monthlyAmount / 12;
        console.log(`Yearly subscription converted to monthly: ${monthlyAmount} ${sub.currency}`);
      } else if (sub.billingCycle === 'weekly') {
        monthlyAmount = (monthlyAmount * 52) / 12;
        console.log(`Weekly subscription converted to monthly: ${monthlyAmount} ${sub.currency}`);
      } else {
        console.log(`Monthly subscription, amount unchanged: ${monthlyAmount} ${sub.currency}`);
      }
      
      // Then convert to the display currency
      const convertedAmount = Number(convertAmount(monthlyAmount, sub.currency, displayCurrency));
      console.log(`Converted to ${displayCurrency}: ${convertedAmount}`);
      
      const newTotal = Number(total) + convertedAmount;
      console.log(`Running total: ${newTotal} ${displayCurrency}`);
      return newTotal;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency,
    }).format(amount);
  };

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
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <Typography variant="h1" component="h1" gutterBottom align="center">
              OopsYouPay
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom align="center" sx={{ mb: 4 }}>
              Track and manage your subscriptions wisely
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexWrap: 'wrap', 
              mt: 2, 
              mb: 4,
              width: '100%',
              justifyContent: 'center'
            }}>
              <Box sx={{ 
                flex: 1, 
                minWidth: { xs: '100%', md: '45%' },
                maxWidth: { xs: '100%', md: '45%' }
              }}>
                <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Monthly Overview
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(calculateTotalMonthly())}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Total monthly spending in
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={displayCurrency}
                        onChange={(e) => updateDisplayCurrency(e.target.value)}
                        variant="standard"
                        sx={{ 
                          '& .MuiSelect-select': { 
                            py: 0,
                            color: 'text.secondary',
                          }
                        }}
                      >
                        {currencies.map((currency) => (
                          <MenuItem key={currency} value={currency}>
                            {currency}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {lastUpdated && (
                    <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.8 }}>
                      Exchange rates updated: {new Date(lastUpdated).toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              </Box>
              <Box sx={{ 
                flex: 1, 
                minWidth: { xs: '100%', md: '45%' },
                maxWidth: { xs: '100%', md: '45%' }
              }}>
                <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Active Subscriptions
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {subscriptions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total number of subscriptions
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <AddSubscription />
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <SubscriptionList />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
