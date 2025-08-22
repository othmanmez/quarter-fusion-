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
        
        // Extract unique categories
        const uniqueCategories: Category[] = Array.from(
          new Map(data.items.map((item: MenuItem) => [item.category.id, item.category])).values()
        ) as Category[];
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