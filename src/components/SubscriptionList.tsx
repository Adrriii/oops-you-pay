import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem, ToggleButton } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useCategoryStore } from '../store/categoryStore';
import { useState, lazy, Suspense, ComponentProps, useMemo, useEffect } from 'react';
import { CategoryManager } from './CategoryManager';
import { useTranslation } from 'react-i18next';
import { Currency } from '../config/currencies';
import getBillingCycleTranslation from '../types/getBillingCycleTranslation';
import { formatLocalDate } from '../utils/formatLocalDate';
import { getCurrentLocale } from '../utils/getCurrentLocale';
import { getNextBillingDate } from '../utils/getNextBillingDate';

const EditSubscriptionComponent = lazy(() => import('./dialogs').then(m => ({ default: m.EditSubscription })));
const DeleteConfirmationComponent = lazy(() => import('./dialogs').then(m => ({ default: m.DeleteConfirmation })));

type EditSubscriptionProps = ComponentProps<typeof EditSubscriptionComponent>;
type DeleteConfirmationProps = ComponentProps<typeof DeleteConfirmationComponent>;

const EditSubscription = EditSubscriptionComponent as React.ComponentType<EditSubscriptionProps>;
const DeleteConfirmation = DeleteConfirmationComponent as React.ComponentType<DeleteConfirmationProps>;

export const SubscriptionList = () => {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const { getCategoryById } = useCategoryStore();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Get categories that have at least one subscription
  const activeCategories = useMemo(() => {
    const categoryCounts = new Map<string, number>();
    
    // Count uncategorized subscriptions
    const uncategorizedCount = subscriptions.filter(sub => !sub.categoryId).length;
    if (uncategorizedCount > 0) {
      categoryCounts.set('uncategorized', uncategorizedCount);
    }
    
    // Count categorized subscriptions
    subscriptions.forEach(sub => {
      if (sub.categoryId) {
        categoryCounts.set(sub.categoryId, (categoryCounts.get(sub.categoryId) || 0) + 1);
      }
    });
    
    return Array.from(categoryCounts.entries())
      .map(([id, count]) => {
        if (id === 'uncategorized') {
          return {
            id,
            count,
            name: t('subscription.add.uncategorized'),
            backgroundColor: '#e5e7eb',
            textColor: '#6b7280',
          };
        }
        const category = getCategoryById(id);
        if (!category) return null;
        return {
          ...category,
          id,
          count,
        };
      })
      .filter((cat): cat is { id: string; count: number; name: string; backgroundColor: string; textColor: string } => 
        cat !== null
      );
  }, [subscriptions, getCategoryById, t]);

  // Initialize selected categories when activeCategories changes
  useEffect(() => {
    setSelectedCategories(new Set(activeCategories.map(cat => cat.id)));
  }, [activeCategories]);

  const filteredSubscriptions = useMemo(() => {
    if (selectedCategories.size === 0) return [];
    return subscriptions.filter(sub => {
      if (!sub.categoryId) {
        return selectedCategories.has('uncategorized');
      }
      return selectedCategories.has(sub.categoryId);
    });
  }, [subscriptions, selectedCategories]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

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

  const formatAmount = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat(getCurrentLocale(), {
      style: 'currency',
      currency: currency.code
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
    <Box 
      component="section"
      role="region"
      aria-label="Subscription Management"
    >
      {subscriptions.length > 0 && (
        <Box 
          component="div"
          role="toolbar"
          aria-label="Category filters"
          sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <CategoryManager />
          {activeCategories.length > 1 && (
            <Box 
              component="div"
              role="group"
              aria-label="Category filter buttons"
              sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
            >
              {activeCategories.map((category) => (
                <ToggleButton
                  key={category.id}
                  value={category.id}
                  selected={selectedCategories.has(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  aria-label={`Filter by ${category.name}`}
                  sx={{
                    backgroundColor: category.backgroundColor,
                    color: category.textColor,
                    borderColor: category.backgroundColor,
                    opacity: selectedCategories.has(category.id) ? 1 : 0.4,
                    '&:hover': {
                      backgroundColor: category.backgroundColor,
                      color: category.textColor,
                      opacity: selectedCategories.has(category.id) ? 0.9 : 0.7,
                    },
                    '&.Mui-selected': {
                      backgroundColor: category.backgroundColor,
                      color: category.textColor,
                      opacity: 1,
                      '&:hover': {
                        backgroundColor: category.backgroundColor,
                        opacity: 0.9,
                      },
                    },
                  }}
                >
                  {category.name} ({category.count})
                </ToggleButton>
              ))}
            </Box>
          )}
        </Box>
      )}

      <Box 
        component="div"
        role="list"
        aria-label="Subscriptions list"
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2.5,
          width: '100%',
          justifyContent: 'flex-start'
        }}
      >
        {filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription) => (
            <Box 
              component="div"
              role="listitem"
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
              <Card sx={{ 
                height: '100%',
                backgroundColor: subscription.wantToCancel ? 'error.lighter' : 'background.paper',
                borderColor: subscription.wantToCancel ? 'error.light' : 'divider',
                borderWidth: 1,
                borderStyle: 'solid'
             }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ fontWeight: 600 }}
                      >
                        {subscription.name}
                      </Typography>
                      <Chip
                        label={getCategoryName(subscription.categoryId)}
                        size="small"
                        aria-label={`Category: ${getCategoryName(subscription.categoryId)}`}
                        sx={{
                          ...getCategoryStyle(subscription.categoryId),
                          fontWeight: 500,
                          borderRadius: '6px',
                        }}
                      />
                      {subscription.wantToCancel && (
                        <Chip
                          label={t('subscription.wantToCancel')}
                          size="small"
                          color="error"
                          aria-label="Marked for cancellation"
                          sx={{
                            fontWeight: 500,
                            borderRadius: '6px',
                          }}
                        />
                      )}
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, subscription.id)}
                      aria-label="Subscription actions"
                      aria-haspopup="true"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    component="p"
                    color="primary" 
                    sx={{ fontWeight: 'bold' }}
                    aria-label={`Amount: ${formatAmount(subscription.amount, subscription.currency)} ${t(getBillingCycleTranslation(subscription.billingCycle))}`}
                  >
                    {formatAmount(subscription.amount, subscription.currency)}
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {t(getBillingCycleTranslation(subscription.billingCycle))}
                    </Typography>
                  </Typography>

                  <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{t('subscription.nextBilling')}</span>
                      <span style={{ fontWeight: 500 }}>
                        {formatLocalDate(getNextBillingDate(subscription.startBillingDate, subscription.billingCycle))}
                      </span>
                    </Typography>

                    {subscription.notes && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mt: 1, fontSize: '0.875rem' }}
                        aria-label={`Notes: ${subscription.notes}`}
                      >
                        {subscription.notes}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          subscriptions.length > 0 && (
            <Box sx={{ 
              width: '100%', 
              textAlign: 'center', 
              py: 8 
            }}>
              <Typography variant="h6" color="text.secondary">
                {selectedCategories.size === 0 
                  ? t('subscription.selectCategory') 
                  : t('subscription.noSubscriptions')}
              </Typography>
            </Box>
          )
        )}

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
          <MenuItem 
            onClick={handleEditClick}
            aria-label="Edit subscription"
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            {t('category.manage.actions.edit')}
          </MenuItem>
          <MenuItem 
            onClick={handleDeleteClick} 
            sx={{ color: 'error.main' }}
            aria-label="Delete subscription"
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {t('category.manage.actions.delete')}
          </MenuItem>
        </Menu>

        {selectedSubscription && (
          <Suspense fallback={null}>
            {isEditDialogOpen && (
              <EditSubscription
                open={isEditDialogOpen}
                onClose={() => {
                  setIsEditDialogOpen(false);
                  setSelectedSubscription(null);
                }}
                subscriptionId={selectedSubscription}
              />
            )}
            {isDeleteDialogOpen && (
              <DeleteConfirmation
                open={isDeleteDialogOpen}
                onClose={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedSubscription(null);
                }}
                subscriptionId={selectedSubscription}
              />
            )}
          </Suspense>
        )}
      </Box>
    </Box>
  );
};