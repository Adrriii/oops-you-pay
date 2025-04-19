import { getCurrentLocale } from './getCurrentLocale';

export const formatLocalDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat(getCurrentLocale(), options).format(d);
};

// Utility function for input fields that require yyyy-MM-dd format
export const formatDateForInput = (date: Date | string | number) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};