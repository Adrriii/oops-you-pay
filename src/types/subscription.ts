export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: Date;
  categoryId?: string;  // Changed from category to categoryId
  notes?: string;
  createdAt: Date;
}

export type BillingCycle = Subscription['billingCycle'];