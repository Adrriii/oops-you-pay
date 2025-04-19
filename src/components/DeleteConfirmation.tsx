import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { useSubscriptionStore } from '../store/subscriptionStore';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
}

export const DeleteConfirmation = ({ open, onClose, subscriptionId }: DeleteConfirmationProps) => {
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
      <DialogTitle>Delete Subscription</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the subscription for {subscription.name}? This action cannot be undone.
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
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          sx={{
            px: 4,
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};