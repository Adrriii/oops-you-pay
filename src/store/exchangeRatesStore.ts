import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ratesJSON = '/rates.json';

interface ExchangeRatesState {
  rates: Record<string, number>;
  lastUpdated: Date | null;
  baseCurrency: string;
  isLoading: boolean;
  error: string | null;
  fetchRatesIfNeeded: () => Promise<void>;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

export const useExchangeRatesStore = create<ExchangeRatesState>()(
  persist(
    (set, get) => ({
      rates: {},
      lastUpdated: null,
      baseCurrency: 'USD',
      isLoading: false,
      error: null,
      fetchRatesIfNeeded: async () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastUpdated = state.lastUpdated ? new Date(state.lastUpdated).toISOString().split('T')[0] : null;

        if (!state.lastUpdated || lastUpdated !== today) {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(ratesJSON);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            set({
              rates: data.rates,
              lastUpdated: new Date(data.date),
              baseCurrency: data.base,
              isLoading: false,
              error: null
            });
          } catch (error) {
            console.error('Error loading exchange rates:', error);
            set({
              isLoading: false,
              error: 'Failed to load exchange rates'
            });
          }
        }
      },
      convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => {
        if (fromCurrency === toCurrency) {
          return amount;
        }
        
        const rates = get().rates;
        const baseCurrency = get().baseCurrency;

        if (fromCurrency === baseCurrency) {
          const rate = rates[toCurrency];
          return rate ? amount * rate : amount;
        }

        if (toCurrency === baseCurrency) {
          const rate = rates[fromCurrency];
          return rate ? amount / rate : amount;
        }

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        if (fromRate && toRate) {
          return (amount / fromRate) * toRate;
        }

        return amount;
      },
    }),
    {
      name: 'exchange-rates-storage',
    }
  )
);