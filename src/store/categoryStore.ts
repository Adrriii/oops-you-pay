import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSubscriptionStore } from './subscriptionStore';

export interface Category {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
}

interface CategoryState {
  categories: Category[];
  addCategory: (name: string, backgroundColor?: string, textColor?: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  resetToDefaults: () => void;
}

const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'Entertainment', backgroundColor: '#fee2e2', textColor: '#991b1b' },
  { name: 'Software', backgroundColor: '#dbeafe', textColor: '#1e40af' },
  { name: 'Streaming', backgroundColor: '#f3e8ff', textColor: '#6b21a8' },
  { name: 'Gaming', backgroundColor: '#dcfce7', textColor: '#166534' },
  { name: 'Music', backgroundColor: '#fef9c3', textColor: '#854d0e' },
  { name: 'Health', backgroundColor: '#ffedd5', textColor: '#9a3412' },
  { name: 'Other', backgroundColor: '#f3f4f6', textColor: '#374151' }
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: defaultCategories.map(cat => ({
        ...cat,
        id: crypto.randomUUID()
      })),
      
      addCategory: (name, backgroundColor = '#f3f4f6', textColor = '#374151') => {
        if (!name) return;
        
        const newCategory: Category = {
          id: crypto.randomUUID(),
          name,
          backgroundColor,
          textColor
        };
        
        set(state => ({
          categories: [...state.categories, newCategory]
        }));
      },
      
      removeCategory: (id) => {
        // When removing a category, update all subscriptions using it to be uncategorized
        const subscriptionStore = useSubscriptionStore.getState();
        const subscriptions = subscriptionStore.subscriptions.map(sub => {
          if (sub.category === get().categories.find(cat => cat.id === id)?.name) {
            return { ...sub, category: '' };
          }
          return sub;
        });
        
        subscriptionStore.updateSubscriptions(subscriptions);
        
        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },
      
      updateCategory: (id, updates) => {
        // When updating a category name, also update all subscriptions using the old name
        const oldCategory = get().categories.find(cat => cat.id === id);
        if (!oldCategory) return;
        
        if (updates.name && updates.name !== oldCategory.name) {
          const subscriptionStore = useSubscriptionStore.getState();
          const subscriptions = subscriptionStore.subscriptions.map(sub => {
            if (sub.category === oldCategory.name) {
              return { ...sub, category: updates.name };
            }
            return sub;
          });
          subscriptionStore.updateSubscriptions(subscriptions);
        }
        
        set(state => ({
          categories: state.categories.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },
      
      resetToDefaults: () => {
        // When resetting, update all subscriptions to use default categories if they exist
        const newCategories = defaultCategories.map(cat => ({
          ...cat,
          id: crypto.randomUUID()
        }));
        
        const subscriptionStore = useSubscriptionStore.getState();
        const subscriptions = subscriptionStore.subscriptions.map(sub => {
          if (!sub.category || !newCategories.some(cat => cat.name === sub.category)) {
            return { ...sub, category: '' };
          }
          return sub;
        });
        
        subscriptionStore.updateSubscriptions(subscriptions);
        
        set({ categories: newCategories });
      }
    }),
    {
      name: 'category-storage'
    }
  )
);