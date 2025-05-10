import { BillingCycle } from '../types/subscription';
import { addDays, addMonths, addYears, isBefore } from 'date-fns';

/**
 * Calculates the next billing date based on the start date and billing cycle
 * @param startDate The date the billing cycle started
 * @param billingCycle The billing cycle frequency
 * @param referenceDate Optional reference date (defaults to current date)
 * @returns The next billing date after the reference date
 */
export function getNextBillingDate(startDate: Date, billingCycle: BillingCycle, referenceDate: Date = new Date()): Date {
  // Ensure we're working with Date objects
  const start = new Date(startDate);
  const reference = new Date(referenceDate);
  
  // Calculate the first billing date after the reference date
  let nextDate = new Date(start);
  
  // Function to increment the date based on the billing cycle
  const incrementDate = () => {
    switch (billingCycle) {
      case 'weekly':
        nextDate = addDays(nextDate, 7);
        break;
      case 'monthly':
        nextDate = addMonths(nextDate, 1);
        break;
      case 'yearly':
        nextDate = addYears(nextDate, 1);
        break;
    }
  };
  
  // Keep incrementing until we find a date that's after the reference date
  while (isBefore(nextDate, reference)) {
    incrementDate();
  }
  
  return nextDate;
}