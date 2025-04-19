import { CURRENCY } from '../config/currencies';
import { BillingCycle } from '../types/subscription';

export interface RegionalPrice {
  amount: number;
  currency: string;
}

interface Plan {
  translationKey: string;  // Key for i18n translation
  prices: RegionalPrice[];
  billingCycle: BillingCycle;  // Billing cycle type
  categoryKey: string;  // Changed to categoryKey to use translation key instead of hardcoded name
}

interface Brand {
  translationKey: string;  // Key for i18n translation
  icon?: string;
  plans: Plan[];
}

export const subscriptionPresets: Brand[] = [
  {
    translationKey: 'brands.netflix.name',
    plans: [
      {
        translationKey: 'brands.netflix.plans.basic',
        prices: [
          { amount: 6.99, currency: CURRENCY.USD },
          { amount: 5.99, currency: CURRENCY.EUR },
          { amount: 4.99, currency: CURRENCY.GBP },
          { amount: 990, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.netflix.plans.standard',
        prices: [
          { amount: 15.49, currency: CURRENCY.USD },
          { amount: 13.49, currency: CURRENCY.EUR },
          { amount: 11.99, currency: CURRENCY.GBP },
          { amount: 1980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.netflix.plans.premium',
        prices: [
          { amount: 22.99, currency: CURRENCY.USD },
          { amount: 19.99, currency: CURRENCY.EUR },
          { amount: 17.99, currency: CURRENCY.GBP },
          { amount: 2980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  },
  {
    translationKey: 'brands.spotify.name',
    plans: [
      {
        translationKey: 'brands.spotify.plans.individual',
        prices: [
          { amount: 10.99, currency: CURRENCY.USD },
          { amount: 9.99, currency: CURRENCY.EUR },
          { amount: 8.99, currency: CURRENCY.GBP },
          { amount: 1480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.music'
      },
      {
        translationKey: 'brands.spotify.plans.duo',
        prices: [
          { amount: 14.99, currency: CURRENCY.USD },
          { amount: 12.99, currency: CURRENCY.EUR },
          { amount: 11.99, currency: CURRENCY.GBP },
          { amount: 1980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.music'
      },
      {
        translationKey: 'brands.spotify.plans.family',
        prices: [
          { amount: 16.99, currency: CURRENCY.USD },
          { amount: 14.99, currency: CURRENCY.EUR },
          { amount: 13.99, currency: CURRENCY.GBP },
          { amount: 2480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.music'
      }
    ]
  },
  {
    translationKey: 'brands.youtube.name',
    plans: [
      {
        translationKey: 'brands.youtube.plans.individual',
        prices: [
          { amount: 13.99, currency: CURRENCY.USD },
          { amount: 11.99, currency: CURRENCY.EUR },
          { amount: 10.99, currency: CURRENCY.GBP },
          { amount: 1880, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.youtube.plans.family',
        prices: [
          { amount: 22.99, currency: CURRENCY.USD },
          { amount: 19.99, currency: CURRENCY.EUR },
          { amount: 17.99, currency: CURRENCY.GBP },
          { amount: 2880, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.youtube.plans.student',
        prices: [
          { amount: 7.99, currency: CURRENCY.USD },
          { amount: 6.99, currency: CURRENCY.EUR },
          { amount: 5.99, currency: CURRENCY.GBP },
          { amount: 980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  }
];