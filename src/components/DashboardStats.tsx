import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useExchangeRatesStore } from '../store/exchangeRatesStore';
import { useTranslation } from 'react-i18next';
import { CurrencySelector } from './CurrencySelector';
import { format, addWeeks, addMonths, addYears } from 'date-fns';

export const DashboardStats = () => {
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
      
      const convertedAmount = Number(convertAmount(monthlyAmount, sub.currency, displayCurrency));
      return Number(total) + convertedAmount;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency.code,
    }).format(amount);
  };

  const getNextPayments = () => {
    const payments = subscriptions.flatMap(sub => {
      const nextDate = new Date(sub.nextBillingDate);
      const amount = Number(convertAmount(sub.amount, sub.currency, displayCurrency));
      
      // Generate next 5 billing dates for this subscription
      const dates = [nextDate];
      for (let i = 1; i < 5; i++) {
        if (sub.billingCycle === 'weekly') {
          dates.push(addWeeks(nextDate, i));
        } else if (sub.billingCycle === 'monthly') {
          dates.push(addMonths(nextDate, i));
        } else if (sub.billingCycle === 'yearly') {
          dates.push(addYears(nextDate, i));
        }
      }
      
      return dates.map(date => ({
        date,
        amount,
        name: sub.name
      }));
    });
    
    // Sort by date and take first 5
    return payments
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, width: '100%' }}>
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
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {t('dashboard.monthlyOverview')}
        </Typography>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
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
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {t('dashboard.yearlyEstimate')}: {formatCurrency(calculateTotalMonthly() * 12)}
          </Typography>
        </Box>
        {lastUpdated && (
          <Typography variant="caption" sx={{ mt: 2, opacity: 0.7 }}>
            {t('dashboard.exchangeRatesUpdated', { date: new Date(lastUpdated).toLocaleDateString() })}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ 
        flex: 1,
        minWidth: { xs: '100%', sm: '48%' },
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {t('dashboard.upcomingPayments')}
        </Typography>
        <List sx={{ py: 0 }}>
          {getNextPayments().map((payment, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                px: 0, 
                py: 0.5,
                borderBottom: index < getNextPayments().length - 1 ? '1px solid' : 'none',
                borderColor: 'divider'
              }}
            >
              <ListItemText
                primary={payment.name}
                secondary={format(payment.date, 'MMM dd, yyyy')}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 500 
                }}
                secondaryTypographyProps={{
                  variant: 'caption'
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {formatCurrency(payment.amount)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};