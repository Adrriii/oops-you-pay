import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { Subscription } from '../types/subscription';
import { format } from 'date-fns';
import { useCategoryStore } from '../store/categoryStore';
import { useTranslation } from 'react-i18next';

interface EditSubscriptionProps {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
}

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export const EditSubscription = ({ open, onClose, subscriptionId }: EditSubscriptionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const updateSubscription = useSubscriptionStore((state) => state.updateSubscription);
  const subscription = useSubscriptionStore(
    (state) => state.subscriptions.find((s) => s.id === subscriptionId)
  );
  const updateLastUsedCurrency = useSubscriptionStore((state) => state.updateLastUsedCurrency);
  const categories = useCategoryStore((state) => state.categories);

  const [formData, setFormData] = useState<Omit<Subscription, 'id' | 'createdAt'>>({
    name: '',
    amount: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: new Date(),
    category: '',
    notes: '',
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
        category: subscription.category || '',
        notes: subscription.notes || '',
      });
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscription) {
      updateSubscription(subscription.id, {
        ...formData,
        nextBillingDate: new Date(formData.nextBillingDate),
      });
      updateLastUsedCurrency(formData.currency);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!subscription) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
          {t('subscription.edit.title')}
          <IconButton onClick={onClose} size="small">
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
                    {formData.currency === 'USD' ? '$' : 
                     formData.currency === 'EUR' ? '€' :
                     formData.currency === 'GBP' ? '£' : ''}
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
                    value={format(new Date(formData.nextBillingDate), 'yyyy-MM-dd')}
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
            onClick={onClose}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              }
            }}
          >
            {t('subscription.edit.cancel')}
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
            {t('subscription.edit.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};