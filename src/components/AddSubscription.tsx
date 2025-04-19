import { useState, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  IconButton,
  useTheme,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { BillingCycle } from '../types/subscription';
import { addMonths, startOfMonth, format } from 'date-fns';
import { useCategoryStore } from '../store/categoryStore';
import { useTranslation } from 'react-i18next';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const getDefaultNextBillingDate = () => {
  const nextMonth = addMonths(new Date(), 1);
  return format(startOfMonth(nextMonth), 'yyyy-MM-dd');
};

const getInitialFormState = (currency: string) => ({
  name: '',
  amount: '',
  currency,
  billingCycle: 'monthly' as BillingCycle,
  nextBillingDate: getDefaultNextBillingDate(),
  category: '',
  notes: '',
});

export const AddSubscription = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { addSubscription, displayCurrency, updateLastUsedCurrency, lastUsedCurrency } = useSubscriptionStore();
  const categories = useCategoryStore((state) => state.categories);
  const [formData, setFormData] = useState(() => getInitialFormState(lastUsedCurrency || displayCurrency));

  const handleClose = useCallback(() => {
    setOpen(false);
    setFormData(getInitialFormState(lastUsedCurrency || displayCurrency));
    setShowAdvanced(false);
  }, [lastUsedCurrency, displayCurrency]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    addSubscription({
      ...formData,
      amount: Number(formData.amount),
      nextBillingDate: new Date(formData.nextBillingDate),
    });
    updateLastUsedCurrency(formData.currency);
    handleClose();
  }, [formData, addSubscription, updateLastUsedCurrency, handleClose]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const currencySymbol = formData.currency === 'USD' ? '$' : 
                        formData.currency === 'EUR' ? '€' :
                        formData.currency === 'GBP' ? '£' : '';

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
        size="large"
        sx={{
          px: 4,
          py: 1,
          fontSize: '1rem',
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        {t('subscription.add.button')}
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '1rem',
            p: 1,
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            {t('subscription.add.title')}
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <TextField
                label={t('subscription.add.name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                autoFocus
                placeholder={t('subscription.add.namePlaceholder')}
              />
              <TextField
                label={t('subscription.add.amount')}
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {currencySymbol}
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth required>
                <InputLabel>{t('subscription.add.billingCycle')}</InputLabel>
                <Select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleSelectChange}
                  label={t('subscription.add.billingCycle')}
                >
                  <MenuItem value="monthly">{t('subscription.add.cycles.monthly')}</MenuItem>
                  <MenuItem value="yearly">{t('subscription.add.cycles.yearly')}</MenuItem>
                  <MenuItem value="weekly">{t('subscription.add.cycles.weekly')}</MenuItem>
                </Select>
              </FormControl>

              <Accordion 
                expanded={showAdvanced}
                onChange={() => setShowAdvanced(!showAdvanced)}
                sx={{ 
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    px: 0,
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                    },
                  }}
                >
                  <Typography color="primary">{t('subscription.add.advancedOptions')}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      label={t('subscription.add.nextBillingDate')}
                      name="nextBillingDate"
                      type="date"
                      value={formData.nextBillingDate}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth>
                      <InputLabel>{t('subscription.add.currency')}</InputLabel>
                      <Select
                        name="currency"
                        value={formData.currency}
                        onChange={handleSelectChange}
                        label={t('subscription.add.currency')}
                      >
                        {currencies.map((currency) => (
                          <MenuItem key={currency} value={currency}>
                            {currency}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>{t('subscription.add.category')}</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleSelectChange}
                        label={t('subscription.add.category')}
                      >
                        <MenuItem value="">
                          <em>{t('subscription.add.uncategorized')}</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.name}>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-block',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor: category.backgroundColor,
                                color: category.textColor,
                              }}
                            >
                              {category.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label={t('subscription.add.notes')}
                      name="notes"
                      multiline
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder={t('subscription.add.notesPlaceholder')}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={handleClose}
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                }
              }}
            >
              {t('subscription.add.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                px: 4,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {t('subscription.add.submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};