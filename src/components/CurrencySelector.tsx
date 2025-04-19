import { FormControl, Select, MenuItem } from '@mui/material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { currencies, Currency, currencyByCode, CurrencyCode } from '../config/currencies';

interface CurrencySelectorProps {
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
}

export const CurrencySelector = ({ variant = 'standard', size = 'small' }: CurrencySelectorProps) => {
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const updateDisplayCurrency = useSubscriptionStore((state) => state.updateDisplayCurrency);
  const updateLastUsedCurrency = useSubscriptionStore((state) => state.updateLastUsedCurrency);

  const handleCurrencyChange = (value: Currency) => {
    updateDisplayCurrency(value);
    updateLastUsedCurrency(value);
  };

  return (
    <FormControl size={size}>
      <Select
        value={displayCurrency.code}
        onChange={(e) => handleCurrencyChange(currencyByCode[e.target.value as CurrencyCode])}
        variant={variant}
        sx={{
          '& .MuiSelect-select': {
            py: 0,
            color: 'text.secondary',
          }
        }}
      >
        {currencies.map((currency) => (
          <MenuItem key={currency.code} value={currency.code}>
            {currency.code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};