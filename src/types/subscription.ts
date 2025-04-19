import { Currency } from '../config/currencies';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: Date;
  categoryId?: string;  // Changed from category to categoryId
  notes?: string;
  createdAt: Date;
  wantToCancel: boolean;  // Track if user wants to cancel this subscription
}

export type BillingCycle = Subscription['billingCycle'];