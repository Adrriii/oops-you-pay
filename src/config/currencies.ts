export const CURRENCY = {
	USD: 'USD',
	EUR: 'EUR',
	GBP: 'GBP',
	JPY: 'JPY',
	CAD: 'CAD',
	AUD: 'AUD'
} as const;

export type CurrencyCode = typeof CURRENCY[keyof typeof CURRENCY];

export interface Currency {
  code: CurrencyCode;
  symbol: string;
}

export const currencyByCode : { [key in CurrencyCode]: Currency } = {
  USD: { code: CURRENCY.USD, symbol: '$' },
  EUR: { code: CURRENCY.EUR, symbol: '€' },
  GBP: { code: CURRENCY.GBP, symbol: '£' },
  JPY: { code: CURRENCY.JPY, symbol: '¥' },
  CAD: { code: CURRENCY.CAD, symbol: 'C$' },
  AUD: { code: CURRENCY.AUD, symbol: 'A$' }
};

export const currencies: Currency[] = Object.values(currencyByCode);

export const currencyCodes = currencies.map(c => c.code);

export const getCurrencySymbol = (code: CurrencyCode): string => {
  const currency = currencies.find(c => c.code === code);
  return currency?.symbol || '';
};

export const getDefaultCurrency = (): Currency => currencyByCode.USD;