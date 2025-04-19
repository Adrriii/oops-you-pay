import { useState, lazy, Suspense, ComponentProps } from 'react';
import {
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, AutoStories as PresetIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AddSubscriptionDialogComponent = lazy(() => import('./dialogs').then(m => ({ default: m.AddSubscriptionDialog })));
const QuickAddSubscriptionComponent = lazy(() => import('./dialogs').then(m => ({ default: m.QuickAddSubscription })));

type AddSubscriptionDialogProps = ComponentProps<typeof AddSubscriptionDialogComponent>;
type QuickAddSubscriptionProps = ComponentProps<typeof QuickAddSubscriptionComponent>;

const AddSubscriptionDialog = AddSubscriptionDialogComponent as React.ComponentType<AddSubscriptionDialogProps>;
const QuickAddSubscription = QuickAddSubscriptionComponent as React.ComponentType<QuickAddSubscriptionProps>;

export const AddSubscription = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
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
        <Button
          variant="outlined"
          onClick={() => setPresetsOpen(true)}
          startIcon={<PresetIcon />}
          size="large"
          sx={{
            px: 4,
            py: 1,
            fontSize: '1rem',
          }}
        >
          {t('subscription.add.presets.button')}
        </Button>
      </Box>

      <Suspense fallback={null}>
        {open && (
          <AddSubscriptionDialog
            open={open}
            onClose={() => setOpen(false)}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {presetsOpen && (
          <QuickAddSubscription 
            open={presetsOpen}
            onClose={() => setPresetsOpen(false)}
          />
        )}
      </Suspense>
    </>
  );
};