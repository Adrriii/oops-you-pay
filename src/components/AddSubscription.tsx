import { useState, useEffect } from 'react';
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

const categories = [
  'Entertainment',
  'Software',
  'Streaming',
  'Gaming',
  'Music',
  'Health',
  'Other',
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const getDefaultNextBillingDate = () => {
  const nextMonth = addMonths(new Date(), 1);
  return format(startOfMonth(nextMonth), 'yyyy-MM-dd');
};

export const AddSubscription = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const updateLastUsedCurrency = useSubscriptionStore((state) => state.updateLastUsedCurrency);
  const lastUsedCurrency = useSubscriptionStore((state) => state.lastUsedCurrency);

  console.log('Last used currency:', lastUsedCurrency);
  console.log('Display currency:', displayCurrency);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: lastUsedCurrency || displayCurrency,
    billingCycle: 'monthly' as BillingCycle,
    nextBillingDate: getDefaultNextBillingDate(),
    category: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      currency: lastUsedCurrency || displayCurrency,
      billingCycle: 'monthly',
      nextBillingDate: getDefaultNextBillingDate(),
      category: '',
      notes: '',
    });
    setShowAdvanced(false);
  };

  // Reset form when opening dialog
  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  // Sync form with displayCurrency changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      currency: displayCurrency,
    }));
  }, [displayCurrency]);

  // Sync form with lastUsedCurrency changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      currency: lastUsedCurrency,
    }));
  }, [lastUsedCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubscription({
      ...formData,
      amount: Number(formData.amount),
      nextBillingDate: new Date(formData.nextBillingDate),
    });
	updateLastUsedCurrency(formData.currency);
    setOpen(false);
    setFormData({
      name: '',
      amount: '',
      currency: lastUsedCurrency || displayCurrency,
      billingCycle: 'monthly',
      nextBillingDate: getDefaultNextBillingDate(),
      category: '',
      notes: '',
    });
    setShowAdvanced(false);
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

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
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
        Add Subscription
      </Button>
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
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
            Add New Subscription
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <TextField
                label="Subscription Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                autoFocus
                placeholder="e.g., Netflix, Spotify, etc."
              />
              <TextField
                label="Amount"
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
                <InputLabel>Billing Cycle</InputLabel>
                <Select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleSelectChange}
                  label="Billing Cycle"
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
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
                  <Typography color="primary">Advanced Options</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      label="Next Billing Date"
                      name="nextBillingDate"
                      type="date"
                      value={formData.nextBillingDate}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        name="currency"
                        value={formData.currency}
                        onChange={handleSelectChange}
                        label="Currency"
                      >
                        {currencies.map((currency) => (
                          <MenuItem key={currency} value={currency}>
                            {currency}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Category (Optional)</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleSelectChange}
                        label="Category (Optional)"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Notes (Optional)"
                      name="notes"
                      multiline
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="Add any additional details about this subscription..."
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={() => setOpen(false)}
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                }
              }}
            >
              Cancel
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
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};