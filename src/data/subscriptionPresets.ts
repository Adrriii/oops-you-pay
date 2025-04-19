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
  },
  {
    translationKey: 'brands.disney.name',
    plans: [
      {
        translationKey: 'brands.disney.plans.standard',
        prices: [
          { amount: 7.99, currency: CURRENCY.USD },
          { amount: 6.99, currency: CURRENCY.EUR },
          { amount: 5.99, currency: CURRENCY.GBP },
          { amount: 990, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.disney.plans.premium',
        prices: [
          { amount: 13.99, currency: CURRENCY.USD },
          { amount: 11.99, currency: CURRENCY.EUR },
          { amount: 10.99, currency: CURRENCY.GBP },
          { amount: 1990, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  },
  {
    translationKey: 'brands.amazonprime.name',
    plans: [
      {
        translationKey: 'brands.amazonprime.plans.monthly',
        prices: [
          { amount: 14.99, currency: CURRENCY.USD },
          { amount: 12.99, currency: CURRENCY.EUR },
          { amount: 11.99, currency: CURRENCY.GBP },
          { amount: 1900, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      },
      {
        translationKey: 'brands.amazonprime.plans.annual',
        prices: [
          { amount: 139, currency: CURRENCY.USD },
          { amount: 119, currency: CURRENCY.EUR },
          { amount: 99, currency: CURRENCY.GBP },
          { amount: 19000, currency: CURRENCY.JPY }
        ],
        billingCycle: 'yearly',
        categoryKey: 'category.defaults.services'
      }
    ]
  },
  {
    translationKey: 'brands.microsoftoffice.name',
    plans: [
      {
        translationKey: 'brands.microsoftoffice.plans.personal',
        prices: [
          { amount: 6.99, currency: CURRENCY.USD },
          { amount: 5.99, currency: CURRENCY.EUR },
          { amount: 5.99, currency: CURRENCY.GBP },
          { amount: 980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.productivity'
      },
      {
        translationKey: 'brands.microsoftoffice.plans.family',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 8.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.productivity'
      }
    ]
  },
  {
    translationKey: 'brands.adobe.name',
    plans: [
      {
        translationKey: 'brands.adobe.plans.photography',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 8.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.creativity'
      },
      {
        translationKey: 'brands.adobe.plans.allapps',
        prices: [
          { amount: 54.99, currency: CURRENCY.USD },
          { amount: 49.99, currency: CURRENCY.EUR },
          { amount: 45.99, currency: CURRENCY.GBP },
          { amount: 6480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.creativity'
      }
    ]
  },
  {
    translationKey: 'brands.xboxgamepass.name',
    plans: [
      {
        translationKey: 'brands.xboxgamepass.plans.core',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 8.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.gaming'
      },
      {
        translationKey: 'brands.xboxgamepass.plans.ultimate',
        prices: [
          { amount: 16.99, currency: CURRENCY.USD },
          { amount: 14.99, currency: CURRENCY.EUR },
          { amount: 12.99, currency: CURRENCY.GBP },
          { amount: 1980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.gaming'
      }
    ]
  },
  {
    translationKey: 'brands.appleone.name',
    plans: [
      {
        translationKey: 'brands.appleone.plans.individual',
        prices: [
          { amount: 16.95, currency: CURRENCY.USD },
          { amount: 15.95, currency: CURRENCY.EUR },
          { amount: 14.95, currency: CURRENCY.GBP },
          { amount: 1980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      },
      {
        translationKey: 'brands.appleone.plans.family',
        prices: [
          { amount: 22.95, currency: CURRENCY.USD },
          { amount: 20.95, currency: CURRENCY.EUR },
          { amount: 19.95, currency: CURRENCY.GBP },
          { amount: 2480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      }
    ]
  },
  {
    translationKey: 'brands.dropbox.name',
    plans: [
      {
        translationKey: 'brands.dropbox.plans.plus',
        prices: [
          { amount: 11.99, currency: CURRENCY.USD },
          { amount: 10.99, currency: CURRENCY.EUR },
          { amount: 9.99, currency: CURRENCY.GBP },
          { amount: 1480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.storage'
      },
      {
        translationKey: 'brands.dropbox.plans.family',
        prices: [
          { amount: 19.99, currency: CURRENCY.USD },
          { amount: 18.99, currency: CURRENCY.EUR },
          { amount: 17.99, currency: CURRENCY.GBP },
          { amount: 2480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.storage'
      }
    ]
  },
  {
    translationKey: 'brands.hbomax.name',
    plans: [
      {
        translationKey: 'brands.hbomax.plans.withads',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 8.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.hbomax.plans.adsfree',
        prices: [
          { amount: 15.99, currency: CURRENCY.USD },
          { amount: 14.99, currency: CURRENCY.EUR },
          { amount: 13.99, currency: CURRENCY.GBP },
          { amount: 1980, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  },
  {
    translationKey: 'brands.paramountplus.name',
    plans: [
      {
        translationKey: 'brands.paramountplus.plans.essential',
        prices: [
          { amount: 5.99, currency: CURRENCY.USD },
          { amount: 4.99, currency: CURRENCY.EUR },
          { amount: 4.99, currency: CURRENCY.GBP },
          { amount: 890, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.paramountplus.plans.withshowtime',
        prices: [
          { amount: 11.99, currency: CURRENCY.USD },
          { amount: 10.99, currency: CURRENCY.EUR },
          { amount: 9.99, currency: CURRENCY.GBP },
          { amount: 1480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  },
  {
    translationKey: 'brands.appletv.name',
    plans: [
      {
        translationKey: 'brands.appletv.plans.standard',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 8.99, currency: CURRENCY.EUR },
          { amount: 8.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  },
  {
    translationKey: 'brands.nintendoswitch.name',
    plans: [
      {
        translationKey: 'brands.nintendoswitch.plans.individual',
        prices: [
          { amount: 3.99, currency: CURRENCY.USD },
          { amount: 3.99, currency: CURRENCY.EUR },
          { amount: 3.49, currency: CURRENCY.GBP },
          { amount: 480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.gaming'
      },
      {
        translationKey: 'brands.nintendoswitch.plans.familyannual',
        prices: [
          { amount: 34.99, currency: CURRENCY.USD },
          { amount: 34.99, currency: CURRENCY.EUR },
          { amount: 31.49, currency: CURRENCY.GBP },
          { amount: 4500, currency: CURRENCY.JPY }
        ],
        billingCycle: 'yearly',
        categoryKey: 'category.defaults.gaming'
      },
      {
        translationKey: 'brands.nintendoswitch.plans.expansionpack',
        prices: [
          { amount: 49.99, currency: CURRENCY.USD },
          { amount: 49.99, currency: CURRENCY.EUR },
          { amount: 44.99, currency: CURRENCY.GBP },
          { amount: 6480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'yearly',
        categoryKey: 'category.defaults.gaming'
      }
    ]
  },
  {
    translationKey: 'brands.hulu.name',
    plans: [
      {
        translationKey: 'brands.hulu.plans.withads',
        prices: [
          { amount: 7.99, currency: CURRENCY.USD },
          { amount: 6.99, currency: CURRENCY.EUR },
          { amount: 6.99, currency: CURRENCY.GBP },
          { amount: 990, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.hulu.plans.noads',
        prices: [
          { amount: 14.99, currency: CURRENCY.USD },
          { amount: 13.99, currency: CURRENCY.EUR },
          { amount: 12.99, currency: CURRENCY.GBP },
          { amount: 1880, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      },
      {
        translationKey: 'brands.hulu.plans.livetvwithads',
        prices: [
          { amount: 76.99, currency: CURRENCY.USD },
          { amount: 74.99, currency: CURRENCY.EUR },
          { amount: 69.99, currency: CURRENCY.GBP },
          { amount: 8900, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.streaming'
      }
    ]
  },
  {
    translationKey: 'brands.deliveroo.name',
    plans: [
      {
        translationKey: 'brands.deliveroo.plans.plus',
        prices: [
          { amount: 3.99, currency: CURRENCY.USD },
          { amount: 3.99, currency: CURRENCY.EUR },
          { amount: 3.49, currency: CURRENCY.GBP },
          { amount: 480, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      },
      {
        translationKey: 'brands.deliveroo.plans.plusannual',
        prices: [
          { amount: 41.88, currency: CURRENCY.USD },
          { amount: 41.88, currency: CURRENCY.EUR },
          { amount: 37.88, currency: CURRENCY.GBP },
          { amount: 4800, currency: CURRENCY.JPY }
        ],
        billingCycle: 'yearly',
        categoryKey: 'category.defaults.services'
      }
    ]
  },
  {
    translationKey: 'brands.uberone.name',
    plans: [
      {
        translationKey: 'brands.uberone.plans.monthly',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 9.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      }
    ]
  },
  {
    translationKey: 'brands.doordash.name',
    plans: [
      {
        translationKey: 'brands.doordash.plans.dashpass',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 9.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      },
      {
        translationKey: 'brands.doordash.plans.student',
        prices: [
          { amount: 4.99, currency: CURRENCY.USD },
          { amount: 4.99, currency: CURRENCY.EUR },
          { amount: 3.99, currency: CURRENCY.GBP },
          { amount: 680, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      }
    ]
  },
  {
    translationKey: 'brands.instacart.name',
    plans: [
      {
        translationKey: 'brands.instacart.plans.plus',
        prices: [
          { amount: 9.99, currency: CURRENCY.USD },
          { amount: 9.99, currency: CURRENCY.EUR },
          { amount: 7.99, currency: CURRENCY.GBP },
          { amount: 1280, currency: CURRENCY.JPY }
        ],
        billingCycle: 'monthly',
        categoryKey: 'category.defaults.services'
      },
      {
        translationKey: 'brands.instacart.plans.annual',
        prices: [
          { amount: 99, currency: CURRENCY.USD },
          { amount: 99, currency: CURRENCY.EUR },
          { amount: 79, currency: CURRENCY.GBP },
          { amount: 12800, currency: CURRENCY.JPY }
        ],
        billingCycle: 'yearly',
        categoryKey: 'category.defaults.services'
      }
    ]
  }
];