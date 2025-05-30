/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { Subscription } from '../types/subscription';
import { persist } from 'zustand/middleware';
import { Currency, getDefaultCurrency } from '../config/currencies';

interface SubscriptionState {
	subscriptions: Subscription[];
	displayCurrency: Currency;
	lastUsedCurrency: Currency;
	addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
	removeSubscription: (id: string) => void;
	updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
	updateSubscriptions: (subscriptions: Subscription[]) => void;
	updateDisplayCurrency: (currency: Currency) => void;
	updateLastUsedCurrency: (currency: Currency) => void;
	removeCategory: (categoryId: string) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
	persist(
		(set) => ({
			subscriptions: [],
			displayCurrency: getDefaultCurrency(),
			lastUsedCurrency: getDefaultCurrency(),
			addSubscription: (subscription) => 
				set((state) => ({
					subscriptions: [
						...state.subscriptions,
						{
						...subscription,
						id: crypto.randomUUID(),
						createdAt: new Date(),
						wantToCancel: subscription.wantToCancel ?? false,
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
			removeCategory: (categoryId) =>
				set((state) => ({
					subscriptions: state.subscriptions.map(sub => 
						sub.categoryId === categoryId ? { ...sub, categoryId: undefined } : sub
					),
				})),
		}),
		{
			name: 'subscription-storage',
			// Handle data migration from nextBillingDate to startBillingDate
			migrate: (persistedState: any) => {
				const state = persistedState as SubscriptionState;
				
				if (state && state.subscriptions) {
					// Check if we need to migrate from nextBillingDate to startBillingDate
					const needsMigration = state.subscriptions.some(
						(sub: any) => sub.nextBillingDate && !sub.startBillingDate
					);
					
					if (needsMigration) {
						state.subscriptions = state.subscriptions.map((sub: any) => {
						// If it's an old record with nextBillingDate, convert to startBillingDate
						if (sub.nextBillingDate && !sub.startBillingDate) {
							sub.startBillingDate = sub.nextBillingDate;
							delete sub.nextBillingDate;
						}
						
						return sub;
						});
					}
				}
				
				return state;
			},
			version: 2, // Increment version to trigger migration
		}
	)
);