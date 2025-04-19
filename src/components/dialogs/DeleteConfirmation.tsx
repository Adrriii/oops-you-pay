import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
}

const DeleteConfirmation = ({ open, onClose, subscriptionId }: DeleteConfirmationProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const removeSubscription = useSubscriptionStore((state) => state.removeSubscription);
  const subscription = useSubscriptionStore(
    (state) => state.subscriptions.find((s) => s.id === subscriptionId)
  );

  const handleDelete = () => {
    removeSubscription(subscriptionId);
    onClose();
  };

  if (!subscription) {
    onClose();
    return null;
  }

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
      <DialogTitle>{t('subscription.delete.title')}</DialogTitle>
      <DialogContent>
        <Typography>
          {t('subscription.delete.confirmation', { name: subscription.name })}
        </Typography>
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
          {t('subscription.delete.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          sx={{
            px: 4,
          }}
        >
          {t('subscription.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;