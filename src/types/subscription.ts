export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: Date;
  category?: string;
  notes?: string;
  createdAt: Date;
}

export type BillingCycle = Subscription['billingCycle'];