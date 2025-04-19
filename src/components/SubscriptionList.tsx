import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useCategoryStore } from '../store/categoryStore';
import { format } from 'date-fns';
import { useState } from 'react';
import { EditSubscription } from './EditSubscription';
import { DeleteConfirmation } from './DeleteConfirmation';
import { CategoryManager } from './CategoryManager';
import { useTranslation } from 'react-i18next';
import { CurrencyCode } from '../config/currencies';

export const SubscriptionList = () => {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const { getCategoryById } = useCategoryStore();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, subscriptionId: string) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedSubscription(subscriptionId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const formatCurrency = (amount: number, currency: CurrencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getCategoryStyle = (categoryId?: string) => {
    if (!categoryId) {
      return {
        backgroundColor: '#e5e7eb',
        color: '#6b7280',
      };
    }

    const category = getCategoryById(categoryId);
    return category ? {
      backgroundColor: category.backgroundColor,
      color: category.textColor,
    } : {
      backgroundColor: '#e5e7eb',
      color: '#6b7280',
    };
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return t('subscription.add.uncategorized');
    const category = getCategoryById(categoryId);
    return category ? category.name : t('subscription.add.uncategorized');
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <CategoryManager />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2.5,
        width: '100%',
        justifyContent: 'flex-start'
      }}>
        {subscriptions.map((subscription) => (
          <Box 
            key={subscription.id} 
            sx={{ 
              width: { 
                xs: '100%', 
                sm: 'calc(50% - 20px)', 
                md: 'calc(33.33% - 27px)' 
              },
              minWidth: {
                xs: '100%',
                sm: 'calc(50% - 20px)',
                md: 'calc(33.33% - 27px)'
              },
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {subscription.name}
                    </Typography>
                    <Chip
                      label={getCategoryName(subscription.categoryId)}
                      size="small"
                      sx={{
                        ...getCategoryStyle(subscription.categoryId),
                        fontWeight: 500,
                        borderRadius: '6px',
                      }}
                    />
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, subscription.id)}
                    sx={{ ml: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(subscription.amount, subscription.currency.code)}
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    / {subscription.billingCycle}
                  </Typography>
                </Typography>

                <Box sx={{ mt: 'auto', pt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('subscription.nextBilling')}</span>
                    <span style={{ fontWeight: 500 }}>{format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy')}</span>
                  </Typography>

                  {subscription.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
                      {subscription.notes}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEditClick}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            {t('category.manage.actions.edit')}
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {t('category.manage.actions.delete')}
          </MenuItem>
        </Menu>

        {selectedSubscription && (
          <>
            <EditSubscription
              open={isEditDialogOpen}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedSubscription(null);
              }}
              subscriptionId={selectedSubscription}
            />
            <DeleteConfirmation
              open={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSubscription(null);
              }}
              subscriptionId={selectedSubscription}
            />
          </>
        )}

        {subscriptions.length === 0 && (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            py: 8 
          }}>
            <Typography variant="h6" color="text.secondary">
              {t('subscription.noSubscriptions')}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};