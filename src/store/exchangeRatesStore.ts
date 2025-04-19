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
        console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);
        
        if (fromCurrency === toCurrency) {
          console.log('Same currency, returning original amount:', amount);
          return amount;
        }
        
        const rates = get().rates;
        const baseCurrency = get().baseCurrency;
        console.log('Current rates:', rates);
        console.log('Base currency:', baseCurrency);

        // Both currencies are the same as base
        if (fromCurrency === baseCurrency && toCurrency === baseCurrency) {
          console.log('Both currencies are base currency, returning:', amount);
          return amount;
        }

        // Converting from base currency to another currency
        if (fromCurrency === baseCurrency) {
          const rate = rates[toCurrency];
          const result = rate ? amount * rate : amount;
          console.log(`Converting from base ${fromCurrency} to ${toCurrency}, rate: ${rate}, result: ${result}`);
          return result;
        }

        // Converting from another currency to base currency
        if (toCurrency === baseCurrency) {
          const rate = rates[fromCurrency];
          const result = rate ? amount / rate : amount;
          console.log(`Converting to base ${toCurrency} from ${fromCurrency}, rate: ${rate}, result: ${result}`);
          return result;
        }

        // Converting between two non-base currencies
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        if (fromRate && toRate) {
          // First convert to base currency, then to target currency
          const amountInBase = amount / fromRate;
          const result = amountInBase * toRate;
          console.log(`Cross-currency conversion ${fromCurrency}->${baseCurrency}->${toCurrency}`);
          console.log(`Rates: ${fromCurrency}=${fromRate}, ${toCurrency}=${toRate}`);
          console.log(`Step 1: ${amount} ${fromCurrency} -> ${amountInBase} ${baseCurrency}`);
          console.log(`Step 2: ${amountInBase} ${baseCurrency} -> ${result} ${toCurrency}`);
          return result;
        }

        console.log('No conversion rates available, returning original amount:', amount);
        return amount; // fallback if rates are not available
      },
    }),
    {
      name: 'exchange-rates-storage',
    }
  )
);