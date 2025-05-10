import { Box, Typography, Paper } from '@mui/material';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useExchangeRatesStore } from '../../store/exchangeRatesStore';
import { useCategoryStore } from '../../store/categoryStore';
import { getCurrentLocale } from '../../utils/getCurrentLocale';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Chart
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryPieChartCard = () => {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const displayCurrency = useSubscriptionStore((state) => state.displayCurrency);
  const { convertAmount } = useExchangeRatesStore();
  const { getCategoryById } = useCategoryStore();
  
  // State to track categories excluded from total calculation
  const [excludedFromTotal, setExcludedFromTotal] = useState<Set<string>>(new Set());
  // Reference to the chart instance for updating legend items
  const chartRef = useRef<Chart<"pie"> | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(getCurrentLocale(), {
      style: 'currency',
      currency: displayCurrency.code,
    }).format(amount);
  };

  const calculateMonthlyCostsByCategory = () => {
    // Initialize with "No Category" for uncategorized subscriptions
    const costsByCategory: Record<string, { 
      amount: number, 
      name: string, 
      backgroundColor: string, 
      textColor: string,
      id: string 
    }> = {
      'no-category': {
        amount: 0,
        name: t('category.noCategory'),
        backgroundColor: '#e5e7eb',
        textColor: '#1f2937',
        id: 'no-category'
      }
    };
    
    // Calculate monthly costs by category
    subscriptions.forEach(sub => {
      let monthlyAmount = Number(sub.amount);
      
      if (sub.billingCycle === 'yearly') {
        monthlyAmount = monthlyAmount / 12;
      } else if (sub.billingCycle === 'weekly') {
        monthlyAmount = (monthlyAmount * 52) / 12;
      }
      
      const amount = convertAmount(monthlyAmount, sub.currency, displayCurrency);
      const categoryId = sub.categoryId || 'no-category';
      
      if (!costsByCategory[categoryId] && categoryId !== 'no-category') {
        const category = getCategoryById(categoryId);
        if (category) {
          costsByCategory[categoryId] = {
            amount: 0,
            name: category.name,
            backgroundColor: category.backgroundColor,
            textColor: category.textColor,
            id: categoryId
          };
        } else {
          // Fallback if category doesn't exist anymore
          costsByCategory[categoryId] = {
            amount: 0,
            name: t('category.deleted'),
            backgroundColor: '#e5e7eb',
            textColor: '#1f2937',
            id: categoryId
          };
        }
      }
      
      costsByCategory[categoryId].amount += amount;
    });
    
    return costsByCategory;
  };

  const allCategoryCosts = calculateMonthlyCostsByCategory();
  const categories = Object.values(allCategoryCosts);
  
  // Keep all categories in chart but update style for excluded ones
  const chartData: ChartData<'pie'> = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => cat.amount),
        backgroundColor: categories.map(cat => cat.backgroundColor),
        borderColor: categories.map(cat => cat.textColor),
        borderWidth: 1,
      },
    ],
  };

  // Calculate total for visible (non-excluded) categories only
  const visibleTotalMonthly = categories
    .filter(cat => !excludedFromTotal.has(cat.id))
    .reduce((total, cat) => total + cat.amount, 0);

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: (e, legendItem, legend) => {
          // Get original onClick implementation
          const originalOnClick = Chart.overrides.pie.plugins.legend.onClick;
          
          // Call the original onClick to handle the default behavior (hiding/showing the slice)
          originalOnClick.call(legend, e, legendItem, legend);
          
          // Our custom logic to toggle category in excluded list
          if (legendItem.index !== undefined && legendItem.index < categories.length) {
            const categoryId = categories[legendItem.index].id;
            
            setExcludedFromTotal(prev => {
              const newExcluded = new Set(prev);
              if (newExcluded.has(categoryId)) {
                newExcluded.delete(categoryId);
              } else {
                newExcluded.add(categoryId);
              }
              return newExcluded;
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  return (
    <Paper sx={{ 
      width: '100%',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '400px'
    }}>
      <Typography 
        variant="h2" 
        component="h2"
        color="text.secondary"
        sx={{ 
          mb: 1,
          fontSize: '1.25rem',
          fontWeight: 500,
          textAlign: 'center'
        }}
      >
        {t('dashboard.categoryDistribution')}
      </Typography>
      
      <Typography 
        variant="h4" 
        component="p"
        color="primary" 
        sx={{ 
          textAlign: 'center',
          mb: 2
        }}
      >
        {formatCurrency(visibleTotalMonthly)} / {t('dashboard.month')}
      </Typography>
      
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px'
      }}>
        <Pie 
          data={chartData} 
          options={chartOptions}
          ref={chartRef}
        />
      </Box>

      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          textAlign: 'center',
          mt: 2
        }}
      >
        {t('dashboard.clickLegend')}
      </Typography>
    </Paper>
  );
};
