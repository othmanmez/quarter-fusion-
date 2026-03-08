import { useEffect, useState } from 'react';
import { MenuItem, Category } from '../app/types/menu';

interface UseMenuDataResult {
  menuItems: MenuItem[];
  categories: Category[];
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useMenuData(mode: 'click-and-collect' | 'livraison'): UseMenuDataResult {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenuData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = `/api/menu?mode=${mode}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.items || []);
        
        // Extraire les catégories uniques, Boissons en dernier
        const byId = new Map(data.items.map((item: MenuItem) => [item.category.id, item.category]));
        const uniqueCategories: Category[] = Array.from(byId.values()) as Category[];
        const sortBoissonsLast = (a: Category, b: Category) => {
          const aBoissons = (a.slug || '').toLowerCase() === 'boissons' || (a.name || '').toLowerCase().includes('boisson');
          const bBoissons = (b.slug || '').toLowerCase() === 'boissons' || (b.name || '').toLowerCase().includes('boisson');
          if (aBoissons && !bBoissons) return 1;
          if (!aBoissons && bBoissons) return -1;
          return 0;
        };
        uniqueCategories.sort(sortBoissonsLast);
        setCategories(uniqueCategories);
      } else {
        throw new Error('Erreur lors du chargement du menu');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement du menu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [mode]);

  return {
    menuItems,
    categories,
    error,
    isLoading,
    refetch: fetchMenuData,
  };
}