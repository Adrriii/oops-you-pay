import { ToggleButtonGroup, ToggleButton, Box, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PieChartIcon from '@mui/icons-material/PieChart';

export type DashboardView = 'default' | 'categories';

interface ViewSwitcherProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: DashboardView | null,
  ) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      mb: 3
    }}>
      <ToggleButtonGroup
        value={currentView}
        exclusive
        onChange={handleViewChange}
        aria-label="dashboard view"
        size={isMobile ? "small" : "medium"}
      >
        <ToggleButton value="default" aria-label={t('dashboard.views.default')}>
          <DashboardIcon sx={{ mr: isMobile ? 0 : 1 }} />
          {!isMobile && t('dashboard.views.default')}
        </ToggleButton>
        <ToggleButton value="categories" aria-label={t('dashboard.views.categories')}>
          <PieChartIcon sx={{ mr: isMobile ? 0 : 1 }} />
          {!isMobile && t('dashboard.views.categories')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
