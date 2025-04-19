import { BillingCycle } from './subscription';

export default (billingCycle: BillingCycle) => {
  switch (billingCycle) {
	case 'monthly':
	  return 'subscription.billingCycle.monthly';
	case 'yearly':
	  return 'subscription.billingCycle.yearly';
	case 'weekly':
	  return 'subscription.billingCycle.weekly';
  }
}