import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useExchangeRatesStore } from '../../store/exchangeRatesStore';
import { getCurrentLocale } from '../../utils/getCurrentLocale';
import { getNextBillingDate } from '../../utils/getNextBillingDate';

export const UpcomingPaymentsCard = () => {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const { convertAmount } = useExchangeRatesStore();

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
      const nextBillingDate = getNextBillingDate(sub.startBillingDate, sub.billingCycle);
      return {
        name: sub.name,
        date: nextBillingDate,
        formattedDate: dateFormatter.format(nextBillingDate),
        amount: convertAmount(sub.amount, sub.currency, displayCurrency),
        wantToCancel: sub.wantToCancel
      };
    }).filter(payment => payment.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    return nextPayments;
  };

  return (
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
  );
};
