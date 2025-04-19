import { addMonths, startOfMonth, format } from 'date-fns';

export default () => {
  const nextMonth = addMonths(new Date(), 1);
  return format(startOfMonth(nextMonth), 'yyyy-MM-dd');
};