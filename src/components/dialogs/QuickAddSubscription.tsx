import { useState, useMemo } from 'react';
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
  Typography,
  Box,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useExchangeRatesStore } from '../../store/exchangeRatesStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useTranslation } from 'react-i18next';
import { subscriptionPresets, RegionalPrice } from '../../data/subscriptionPresets';
import getDefaultNextBillingDate from '../../utils/getDefaultNextBillingDate';
import { getDefaultCurrency } from '../../config/currencies';
import { getCurrentLocale } from '../../utils/getCurrentLocale';

const PRIORITY_CATEGORIES = [
  'category.defaults.streaming',
  'category.defaults.services',
  'category.defaults.music',
  'category.defaults.software',
];

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
        formatted: new Intl.NumberFormat(getCurrentLocale(), {
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
      formatted: new Intl.NumberFormat(getCurrentLocale(), {
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

  // Group brands by category and sort alphabetically
  const groupedBrands = useMemo(() => {
    const brandsByCategory = new Map<string, Array<{brand: typeof subscriptionPresets[0], category: ReturnType<typeof getCategoryByTranslationKey> | null}>>();
    const translatedBrandNames = new Map<string, string>();

    // Pre-translate all brand names
    subscriptionPresets.forEach(brand => {
      translatedBrandNames.set(brand.translationKey, t(brand.translationKey));
    });

    const filteredBrands = subscriptionPresets.filter(brand => 
      translatedBrandNames.get(brand.translationKey)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort brands alphabetically by translated name
    const sortedBrands = [...filteredBrands].sort((a, b) => {
      const aName = translatedBrandNames.get(a.translationKey) || '';
      const bName = translatedBrandNames.get(b.translationKey) || '';
      return aName.localeCompare(bName);
    });

    // Group by category using actual category data
    sortedBrands.forEach(brand => {
      const categoryKey = brand.plans[0]?.categoryKey || 'category.defaults.other';
      const category = getCategoryByTranslationKey(categoryKey);
      
      // Group under uncategorized if category doesn't exist
      const categoryId = category?.id || 'uncategorized';
      if (!brandsByCategory.has(categoryId)) {
        brandsByCategory.set(categoryId, []);
      }
      brandsByCategory.get(categoryId)?.push({ brand, category });
    });

    // Sort categories with priority categories first, then alphabetically
    return new Map([...brandsByCategory.entries()].sort((a, b) => {
      const categoryA = a[1][0].category;
      const categoryB = b[1][0].category;
      
      const categoryAKey = a[1][0].brand.plans[0].categoryKey;
      const categoryBKey = b[1][0].brand.plans[0].categoryKey;
      
      // If either is uncategorized, put it at the end
      if (a[0] === 'uncategorized') return 1;
      if (b[0] === 'uncategorized') return -1;
      
      // Check if either category is in the priority list
      const priorityA = PRIORITY_CATEGORIES.indexOf(categoryAKey);
      const priorityB = PRIORITY_CATEGORIES.indexOf(categoryBKey);
      
      // If both are priority categories, sort by their order in PRIORITY_CATEGORIES
      if (priorityA !== -1 && priorityB !== -1) {
        return priorityA - priorityB;
      }
      
      // If only one is a priority category, it should come first
      if (priorityA !== -1) return -1;
      if (priorityB !== -1) return 1;
      
      // For non-priority categories, sort alphabetically by name
      return (categoryA?.name || '').localeCompare(categoryB?.name || '');
    }));
  }, [searchTerm, t, getCategoryByTranslationKey]);

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
            placeholder={t('subscription.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }} // Increased margin bottom
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}
        <List sx={{ 
          '& > .MuiBox-root + .MuiBox-root': { 
            mt: 3 // Add margin top between category groups
          }
        }}>
          {!selectedBrand ? (
            Array.from(groupedBrands.entries()).map(([categoryId, brands]) => {
              const category = brands[0].category;
              const isUncategorized = categoryId === 'uncategorized';
              
              return (
                <Box key={categoryId}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: isUncategorized ? '#e5e7eb' : category?.backgroundColor,
                      color: isUncategorized ? '#6b7280' : category?.textColor,
                      borderRadius: '8px 8px 0 0', // Rounded corners only on top
                      mb: 0, // Remove margin bottom
                    }}
                  >
                    {isUncategorized ? t('subscription.add.uncategorized') : category?.name}
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: 'action.hover',
                    borderRadius: '0 0 8px 8px', // Rounded corners only on bottom
                    mt: 0, // Remove margin top
                    p: 0.5, // Add padding around the list
                  }}>
                    {brands.map(({ brand }) => (
                      <ListItemButton 
                        key={brand.translationKey}
                        onClick={() => handleBrandSelect(brand.translationKey)}
                        sx={{
                          borderRadius: 1,
                          mx: 0.5,
                          '&:hover': {
                            backgroundColor: 'action.selected',
                          }
                        }}
                      >
                        <ListItemText primary={t(brand.translationKey)} />
                      </ListItemButton>
                    ))}
                  </Box>
                </Box>
              );
            })
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