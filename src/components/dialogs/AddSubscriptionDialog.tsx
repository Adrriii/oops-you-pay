import { useState, useCallback } from 'react';
import {
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
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useTranslation } from 'react-i18next';
import getDefaultNextBillingDate from '../../utils/getDefaultNextBillingDate';
import { BillingCycle } from '../../types/subscription';
import { currencies, Currency, currencyByCode, CurrencyCode, getCurrencySymbol } from '../../config/currencies';
import { formatDateForInput } from '../../utils/formatLocalDate';

interface AddSubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
}

const getInitialFormState = (currency: Currency) => ({
  name: '',
  amount: '',
  currency,
  billingCycle: 'monthly' as BillingCycle,
  nextBillingDate: formatDateForInput(getDefaultNextBillingDate()),
  categoryId: '',
  notes: '',
  wantToCancel: false,
});

const AddSubscriptionDialog = ({ open, onClose }: AddSubscriptionDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { addSubscription, displayCurrency, updateLastUsedCurrency, lastUsedCurrency } = useSubscriptionStore();
  const { categories } = useCategoryStore();
  const [formData, setFormData] = useState(() => getInitialFormState(lastUsedCurrency || displayCurrency));

  const handleClose = useCallback(() => {
    onClose();
    setFormData(getInitialFormState(lastUsedCurrency || displayCurrency));
    setShowAdvanced(false);
  }, [lastUsedCurrency, displayCurrency, onClose]);

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

  const handleCurrencySelectChange = useCallback((e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      currency: currencyByCode[e.target.value as CurrencyCode],
    }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSwitchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      wantToCancel: e.target.checked,
    }));
  }, []);

  return (
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
                    {getCurrencySymbol(formData.currency.code)}
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
			
			<FormControlLabel
			control={
				<Switch
				checked={formData.wantToCancel}
				onChange={handleSwitchChange}
				color="error"
				/>
			}
			label={t('subscription.wantToCancel')}
			/>

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
                      value={formData.currency.code}
                      onChange={handleCurrencySelectChange}
                      label={t('subscription.add.currency')}
                    >
                      {currencies.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>{t('subscription.add.category')}</InputLabel>
                    <Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleSelectChange}
                      label={t('subscription.add.category')}
                    >
                      <MenuItem value="">
                        <em>{t('subscription.add.uncategorized')}</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
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
  );
};

export default AddSubscriptionDialog;