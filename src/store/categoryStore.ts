import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSubscriptionStore } from './subscriptionStore';
import i18next from 'i18next';

export interface Category {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  translationKey?: string;  // Added to track original translation key
}

interface CategoryState {
  categories: Category[];
  isUpdatingTranslations: boolean;
  addCategory: (name: string, backgroundColor?: string, textColor?: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  resetToDefaults: () => void;
  updateTranslations: () => void;
}

type DefaultCategory = {
  translationKey: string;
  backgroundColor: string;
  textColor: string;
};

const defaultCategories: DefaultCategory[] = [
  { translationKey: 'category.defaults.entertainment', backgroundColor: '#fee2e2', textColor: '#991b1b' },
  { translationKey: 'category.defaults.software', backgroundColor: '#dbeafe', textColor: '#1e40af' },
  { translationKey: 'category.defaults.streaming', backgroundColor: '#f3e8ff', textColor: '#6b21a8' },
  { translationKey: 'category.defaults.gaming', backgroundColor: '#dcfce7', textColor: '#166534' },
  { translationKey: 'category.defaults.music', backgroundColor: '#fef9c3', textColor: '#854d0e' },
  { translationKey: 'category.defaults.health', backgroundColor: '#ffedd5', textColor: '#9a3412' },
  { translationKey: 'category.defaults.other', backgroundColor: '#f3f4f6', textColor: '#374151' }
];

const createDefaultCategories = () => {
  return defaultCategories.map(cat => ({
    ...cat,
    id: crypto.randomUUID(),
    name: i18next.t(cat.translationKey),
  }));
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: createDefaultCategories(),
      isUpdatingTranslations: false,
      
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
        if (get().isUpdatingTranslations && updates.name) return;

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
        // Create new default categories with current language translations
        const newCategories = createDefaultCategories();
        
        // When resetting, update all subscriptions to match the new translated category names
        const subscriptionStore = useSubscriptionStore.getState();
        const subscriptions = subscriptionStore.subscriptions.map(sub => {
          // Find if the subscription's category matches any of the default category translation keys
          const defaultCat = defaultCategories.find(dc => 
            i18next.t(dc.translationKey) === sub.category ||
            get().categories.find(c => c.translationKey === dc.translationKey)?.name === sub.category
          );

          if (defaultCat) {
            // If it matches, update to the new translated name
            return { ...sub, category: i18next.t(defaultCat.translationKey) };
          }
          // If no match, set to uncategorized
          return { ...sub, category: '' };
        });
        
        subscriptionStore.updateSubscriptions(subscriptions);
        
        set({ categories: newCategories });
      },

      updateTranslations: () => {
        const state = get();
        if (state.isUpdatingTranslations) return;

        set({ isUpdatingTranslations: true });
        
        const subscriptionStore = useSubscriptionStore.getState();
        const updatedCategories = state.categories.map(category => {
          if (!category.translationKey) return category;
          
          const newName = i18next.t(category.translationKey);
          if (newName === category.name) return category;

          // Update subscriptions using this category
          const subscriptions = subscriptionStore.subscriptions.map(sub => {
            if (sub.category === category.name) {
              return { ...sub, category: newName };
            }
            return sub;
          });
          subscriptionStore.updateSubscriptions(subscriptions);

          return { ...category, name: newName };
        });

        set({ 
          categories: updatedCategories,
          isUpdatingTranslations: false
        });
      }
    }),
    {
      name: 'category-storage',
      onRehydrateStorage: () => {
        // Update category names on language change
        i18next.on('languageChanged', () => {
          const store = useCategoryStore.getState();
          store.updateTranslations();
        });
      }
    }
  )
);