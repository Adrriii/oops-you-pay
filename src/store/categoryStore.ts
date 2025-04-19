import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18next from 'i18next';

export interface Category {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  translationKey?: string;
  isDefault?: boolean;
  userModified?: boolean;
}

interface CategoryState {
  categories: Category[];
  isUpdatingTranslations: boolean;
  addCategory: (name: string, backgroundColor?: string, textColor?: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  resetToDefaults: () => void;
  updateTranslations: () => void;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByTranslationKey: (key: string) => Category | undefined;
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
    id: `default-${cat.translationKey}`,
    name: i18next.t(cat.translationKey),
    isDefault: true,
    userModified: false
  }));
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: createDefaultCategories(),
      isUpdatingTranslations: false,
      
      getCategoryById: (id: string) => {
        return get().categories.find(cat => cat.id === id);
      },

      getCategoryByTranslationKey: (key: string) => {
        return get().categories.find(cat => cat.translationKey === key);
      },
      
      addCategory: (name, backgroundColor = '#f3f4f6', textColor = '#374151') => {
        if (!name) return;
        
        const newCategory: Category = {
          id: crypto.randomUUID(),
          name,
          backgroundColor,
          textColor,
          isDefault: false,
          userModified: false
        };
        
        set(state => ({
          categories: [...state.categories, newCategory]
        }));

        return newCategory.id;
      },
      
      removeCategory: (id) => {
        const category = get().categories.find(cat => cat.id === id);
        if (!category) return;
        
        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },
      
      updateCategory: (id, updates) => {
        if (get().isUpdatingTranslations && updates.name) return;

        const category = get().categories.find(cat => cat.id === id);
        if (!category) return;
        
        set(state => ({
          categories: state.categories.map(cat =>
            cat.id === id ? {
              ...cat,
              ...updates,
              userModified: true,
              // Preserve isDefault if it's a default category
              isDefault: cat.isDefault
            } : cat
          )
        }));
      },
      
      resetToDefaults: () => {
        // Keep user-added categories but reset default ones
        const userCategories = get().categories.filter(cat => !cat.isDefault);
        const newDefaultCategories = createDefaultCategories();
        
        set({
          categories: [...newDefaultCategories, ...userCategories]
        });
      },

      updateTranslations: () => {
        const state = get();
        if (state.isUpdatingTranslations) return;

        set({ isUpdatingTranslations: true });
        
        const updatedCategories = state.categories.map(category => {
          if (!category.translationKey || category.userModified) return category;
          
          const newName = i18next.t(category.translationKey);
          if (newName === category.name) return category;

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