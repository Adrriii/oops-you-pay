import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useExchangeRatesStore } from '../../store/exchangeRatesStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useTranslation } from 'react-i18next';
import { subscriptionPresets, RegionalPrice } from '../../data/subscriptionPresets';
import getDefaultNextBillingDate from '../../utils/getDefaultNextBillingDate';
import { getDefaultCurrency } from '../../config/currencies';

interface QuickAddSubscriptionProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddSubscription = ({ open, onClose }: QuickAddSubscriptionProps) => {
  const { t } = useTranslation();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { addSubscription, displayCurrency, updateLastUsedCurrency, lastUsedCurrency } = useSubscriptionStore();
  const { convertAmount } = useExchangeRatesStore();
  const { getCategoryByTranslationKey } = useCategoryStore();

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
  };

  const handleClose = () => {
    setSelectedBrand(null);
    setSearchTerm('');
    onClose();
  };

  const handlePlanSelect = (plan: any) => {
    const preferredCurrency = lastUsedCurrency || displayCurrency;
    const priceInPreferredCurrency = plan.prices.find(
      (p: RegionalPrice) => p.currency === preferredCurrency.code
    );

    const basePrice = priceInPreferredCurrency || plan.prices.find(
      (p: RegionalPrice) => p.currency === getDefaultCurrency().code
    );

    if (!basePrice) return;

    const amount = priceInPreferredCurrency 
      ? basePrice.amount 
      : convertAmount(basePrice.amount, basePrice.currency, preferredCurrency);

    const categoryId = plan.categoryKey ? getCategoryByTranslationKey(plan.categoryKey)?.id : undefined;

    addSubscription({
      name: t(plan.translationKey),
      amount: amount,
      currency: preferredCurrency,
      billingCycle: plan.billingCycle,
      nextBillingDate: new Date(getDefaultNextBillingDate()),
      categoryId,
      notes: '',
      wantToCancel: false,
    });
    updateLastUsedCurrency(preferredCurrency);
    handleClose();
  };

  const formatPresetPrices = (plan: any) => {
    const preferredCurrency = lastUsedCurrency || displayCurrency;
    
    const priceInPreferredCurrency = plan.prices.find(
      (p: RegionalPrice) => p.currency === preferredCurrency.code
    );

    if (priceInPreferredCurrency) {
      return {
        formatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: preferredCurrency.code
        }).format(priceInPreferredCurrency.amount),
        amount: priceInPreferredCurrency.amount
      };
    }

    const defaultPrice = plan.prices.find((p: RegionalPrice) => p.currency === getDefaultCurrency().code);
    if (!defaultPrice) return { formatted: '', amount: 0 };

    const convertedAmount = convertAmount(defaultPrice.amount, getDefaultCurrency(), preferredCurrency);
    return {
      formatted: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: preferredCurrency.code
      }).format(convertedAmount),
      amount: convertedAmount
    };
  };

  const getSortedPlans = (plans: any[]) => {
    return [...plans].sort((a, b) => {
      const priceA = formatPresetPrices(a).amount;
      const priceB = formatPresetPrices(b).amount;
      return priceA - priceB;
    });
  };

  const filteredBrands = subscriptionPresets.filter(brand => 
    t(brand.translationKey).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {selectedBrand 
          ? t('subscription.add.presets.selectPlan', { brand: t(selectedBrand) })
          : t('subscription.add.presets.selectBrand')
        }
      </DialogTitle>
      <DialogContent>
        {!selectedBrand && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}
        <List>
          {!selectedBrand ? (
            filteredBrands.map((brand) => (
              <ListItemButton 
                key={brand.translationKey}
                onClick={() => handleBrandSelect(brand.translationKey)}
              >
                <ListItemText primary={t(brand.translationKey)} />
              </ListItemButton>
            ))
          ) : (
            getSortedPlans(
              subscriptionPresets
                .find(brand => brand.translationKey === selectedBrand)
                ?.plans || []
            ).map((plan, index) => (
              <ListItemButton 
                key={index}
                onClick={() => handlePlanSelect(plan)}
              >
                <ListItemText 
                  primary={t(plan.translationKey)}
                  secondary={`${formatPresetPrices(plan).formatted} / ${t(`subscription.add.cycles.${plan.billingCycle}`)}`}
                />
              </ListItemButton>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions>
        {selectedBrand && (
          <Button onClick={() => setSelectedBrand(null)}>
            {t('subscription.add.presets.backToBrands')}
          </Button>
        )}
        <Button onClick={handleClose}>{t('subscription.add.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickAddSubscription;