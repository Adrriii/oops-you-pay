import { Box, Typography, Paper, FormControl, Select, MenuItem } from '@mui/material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useExchangeRatesStore } from '../store/exchangeRatesStore';
import { useTranslation } from 'react-i18next';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export const DashboardStats = () => {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const updateDisplayCurrency = useSubscriptionStore((state) => state.updateDisplayCurrency);
  const updateLastUsedCurrency = useSubscriptionStore((state) => state.updateLastUsedCurrency);
  const { convertAmount, lastUpdated } = useExchangeRatesStore();

  const calculateTotalMonthly = () => {
    return subscriptions.reduce((total, sub) => {
      let monthlyAmount = Number(sub.amount);
      
      if (sub.billingCycle === 'yearly') {
        monthlyAmount = monthlyAmount / 12;
      } else if (sub.billingCycle === 'weekly') {
        monthlyAmount = (monthlyAmount * 52) / 12;
      }
      
      const convertedAmount = Number(convertAmount(monthlyAmount, sub.currency, displayCurrency));
      return Number(total) + convertedAmount;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency,
    }).format(amount);
  };

  const handleCurrencyChange = (value: string) => {
    updateDisplayCurrency(value);
    updateLastUsedCurrency(value);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 3, 
      flexWrap: 'wrap', 
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
            {t('dashboard.monthlyOverview')}
          </Typography>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(calculateTotalMonthly())}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {t('dashboard.totalMonthlySpending')}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={displayCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
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
              {t('dashboard.exchangeRatesUpdated', { date: new Date(lastUpdated).toLocaleDateString() })}
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
            {t('dashboard.activeSubscriptions')}
          </Typography>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
            {subscriptions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard.totalSubscriptions')}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};