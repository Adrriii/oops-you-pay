import { Box } from '@mui/material';
import { useState } from 'react';
import { MonthlyOverviewCard } from './dashboard/MonthlyOverviewCard';
import { UpcomingPaymentsCard } from './dashboard/UpcomingPaymentsCard';
import { CategoryPieChartCard } from './dashboard/CategoryPieChartCard';
import { ViewSwitcher, DashboardView } from './dashboard/ViewSwitcher';

export const DashboardStats = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('default');

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  return (
    <>
      <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />
      
      {currentView === 'default' ? (
        <Box 
          component="section"
          aria-label="Dashboard Statistics"
          sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            mb: 4 
          }}
        >
          <MonthlyOverviewCard />
          <UpcomingPaymentsCard />
        </Box>
      ) : (
        <Box 
          component="section"
          aria-label="Category Distribution"
          sx={{ mb: 4 }}
        >
          <CategoryPieChartCard />
        </Box>
      )}
    </>
  );
};