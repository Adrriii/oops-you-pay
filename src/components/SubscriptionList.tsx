import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { format } from 'date-fns';
import { useState } from 'react';
import { EditSubscription } from './EditSubscription';
import { DeleteConfirmation } from './DeleteConfirmation';

const categoryColors: Record<string, { bg: string; text: string }> = {
  Entertainment: { bg: '#fee2e2', text: '#991b1b' },
  Software: { bg: '#dbeafe', text: '#1e40af' },
  Streaming: { bg: '#f3e8ff', text: '#6b21a8' },
  Gaming: { bg: '#dcfce7', text: '#166534' },
  Music: { bg: '#fef9c3', text: '#854d0e' },
  Health: { bg: '#ffedd5', text: '#9a3412' },
  Other: { bg: '#f3f4f6', text: '#374151' },
  Uncategorized: { bg: '#e5e7eb', text: '#6b7280' },
};

export const SubscriptionList = () => {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
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
                    label={subscription.category || 'Uncategorized'}
                    size="small"
                    sx={{
                      bgcolor: categoryColors[subscription.category || 'Uncategorized'].bg,
                      color: categoryColors[subscription.category || 'Uncategorized'].text,
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
                {formatCurrency(subscription.amount, subscription.currency)}
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  / {subscription.billingCycle}
                </Typography>
              </Typography>

              <Box sx={{ mt: 'auto', pt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Next billing:</span>
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
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
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
            No subscriptions yet. Add your first one!
          </Typography>
        </Box>
      )}
    </Box>
  );
};