import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useExchangeRatesStore } from '../store/exchangeRatesStore';
import { useTranslation } from 'react-i18next';
import { CurrencySelector } from './CurrencySelector';
import { formatLocalDate } from '../utils/formatLocalDate';
import { getCurrentLocale } from '../utils/getCurrentLocale';

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
      
      return total + convertAmount(monthlyAmount, sub.currency, displayCurrency);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(getCurrentLocale(), {
      style: 'currency',
      currency: displayCurrency.code,
    }).format(amount);
  };

  const getNextPayments = () => {
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    
    const nextPayments = subscriptions.map(sub => {
      const date = new Date(sub.nextBillingDate);
      return {
        name: sub.name,
        date,
        formattedDate: dateFormatter.format(date),
        amount: convertAmount(sub.amount, sub.currency, displayCurrency),
        wantToCancel: sub.wantToCancel
      };
    }).filter(payment => payment.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    return nextPayments;
  };

  return (
    <Box 
      component="section"
      aria-label="Dashboard Statistics"
      sx={{ 
        display: 'flex', 
        gap: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        mb: 4 
      }}
    >
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

      <Paper sx={{ 
        flex: 1,
        minWidth: { xs: '100%', sm: '48%' },
        p: 2,
        display: 'flex',
        flexDirection: 'column'
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
          {t('dashboard.upcomingPayments')}
        </Typography>
        <List 
          sx={{ py: 0 }}
          aria-label="Upcoming payments list"
        >
          {getNextPayments().map((payment, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                px: 0, 
                py: 0.5,
                borderBottom: index < getNextPayments().length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                backgroundColor: payment.wantToCancel ? 'error.lighter' : 'transparent'
              }}
            >
              <ListItemText
                primary={payment.name}
                secondary={payment.formattedDate}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 500,
                  color: payment.wantToCancel ? 'error.main' : 'inherit'
                }}
                secondaryTypographyProps={{
                  variant: 'caption'
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 500, color: 'primary.main' }}
                aria-label={`Payment amount: ${formatCurrency(payment.amount)}`}
              >
                {formatCurrency(payment.amount)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};