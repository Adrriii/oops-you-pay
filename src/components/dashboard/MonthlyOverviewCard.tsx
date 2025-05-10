import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencySelector } from '../CurrencySelector';
import { formatLocalDate } from '../../utils/formatLocalDate';
import { useExchangeRatesStore } from '../../store/exchangeRatesStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { getCurrentLocale } from '../../utils/getCurrentLocale';

export const MonthlyOverviewCard = () => {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const { convertAmount, lastUpdated } = useExchangeRatesStore();

  const calculateTotalMonthly = () => {
    return subscriptions.reduce((total, sub) => {
      let monthlyAmount = Number(sub.amount);
      
      if (sub.billingCycle === 'yearly') {
        monthlyAmount = monthlyAmount / 12;
      } else if (sub.billingCycle === 'weekly') {
        monthlyAmount = (monthlyAmount * 52) / 12;
      }
      
      return total + convertAmount(monthlyAmount, sub.currency, displayCurrency);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(getCurrentLocale(), {
      style: 'currency',
      currency: displayCurrency.code,
    }).format(amount);
  };

  return (
    <Paper sx={{ 
      flex: 1,
      minWidth: { xs: '100%', sm: '48%' },
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    }}>
      <Typography 
        variant="h2" 
        component="h2"
        color="text.secondary"
        sx={{ 
          mb: 1,
          fontSize: '1.25rem',
          fontWeight: 500
        }}
      >
        {t('dashboard.monthlyOverview')}
      </Typography>
      <Typography 
        variant="h3" 
        component="p"
        color="primary" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 2,
          fontSize: { xs: '2rem', sm: '2.5rem' }
        }}
        aria-label={`${t('dashboard.totalMonthlySpending')}: ${formatCurrency(calculateTotalMonthly())}`}
      >
        {formatCurrency(calculateTotalMonthly())}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1
      }}>
        <Typography variant="body2" color="text.secondary">
          {t('dashboard.totalMonthlySpending')}
        </Typography>
        <CurrencySelector />
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 1 }}
          aria-label={`${t('dashboard.yearlyEstimate')}: ${formatCurrency(calculateTotalMonthly() * 12)}`}
        >
          {t('dashboard.yearlyEstimate')}: {formatCurrency(calculateTotalMonthly() * 12)}
        </Typography>
      </Box>
      {lastUpdated && (
        <Typography 
          variant="caption" 
          sx={{ mt: 2, opacity: 0.7 }}
          role="status"
        >
          {t('dashboard.exchangeRatesUpdated', { date: formatLocalDate(lastUpdated) })}
        </Typography>
      )}
    </Paper>
  );
};
