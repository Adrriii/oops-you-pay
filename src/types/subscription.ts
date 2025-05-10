import { Currency } from '../config/currencies';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  startBillingDate: Date;
  categoryId?: string;
  notes?: string;
  createdAt: Date;
  wantToCancel: boolean;
}

export type BillingCycle = Subscription['billingCycle'];