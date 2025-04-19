import { create } from 'zustand';
import { Subscription } from '../types/subscription';
import { persist } from 'zustand/middleware';

interface SubscriptionState {
  subscriptions: Subscription[];
  displayCurrency: string;
  lastUsedCurrency: string;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  updateSubscriptions: (subscriptions: Subscription[]) => void;
  updateDisplayCurrency: (currency: string) => void;
  updateLastUsedCurrency: (currency: string) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscriptions: [],
      displayCurrency: 'USD',
      lastUsedCurrency: 'USD',
      addSubscription: (subscription) => 
        set((state) => ({
          subscriptions: [
            ...state.subscriptions,
            {
              ...subscription,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      removeSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        })),
      updateSubscription: (id, subscription) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...subscription } : sub
          ),
        })),
      updateSubscriptions: (subscriptions) =>
        set(() => ({
          subscriptions,
        })),
      updateDisplayCurrency: (currency) =>
        set(() => ({
          displayCurrency: currency,
        })),
      updateLastUsedCurrency: (currency) =>
        set(() => ({
          lastUsedCurrency: currency,
        })),
    }),
    {
      name: 'subscription-storage',
    }
  )
);