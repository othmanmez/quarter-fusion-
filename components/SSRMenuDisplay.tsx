import { prisma } from '../lib/prisma';
import ClientMenuInteraction from './ClientMenuInteraction';

import { MenuItem, Category } from '../app/types/menu';

interface SSRMenuDisplayProps {
  mode: 'click-and-collect' | 'livraison';
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  showAddToCart?: boolean;
}

async function getMenuItems(mode: 'click-and-collect' | 'livraison'): Promise<MenuItem[]> {
  try {
    const whereConditions: any = {
      available: true,
    };

    if (mode === 'click-and-collect') {
      whereConditions.availableForClickAndCollect = true;
    } else if (mode === 'livraison') {
      whereConditions.availableForDelivery = true;
    }

    const menuItems = await prisma.menu.findMany({
      where: whereConditions,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { category: { name: 'asc' } },
        { title: 'asc' },
      ],
    });

    return menuItems.map((item: any) => ({
      ...item,
      badge: item.badge === null ? undefined : item.badge,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    return [];
  }
}

export default async function SSRMenuDisplay({ mode, onAddToCart, showAddToCart = false }: SSRMenuDisplayProps) {
  const menuItems = await getMenuItems(mode);
  
  // Extract unique categories
  const categories: Category[] = Array.from(
    new Map(menuItems.map(item => [item.category.id, item.category])).values()
  );

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Aucun plat disponible
        </h3>
        <p className="text-gray-500">
          Aucun plat n'est disponible pour {mode === 'click-and-collect' ? 'le retrait en restaurant' : 'la livraison'} pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ClientMenuInteraction 
        menuItems={menuItems}
        categories={categories}
        onAddToCart={onAddToCart}
        showAddToCart={showAddToCart}
      />
    </div>
  );
}

