// Données de menu temporaires pour Quarter Fusion
export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Burgers', slug: 'burgers' },
  { id: '2', name: 'Wings & Tenders', slug: 'wings-tenders' },
  { id: '3', name: 'Sandwiches', slug: 'sandwiches' },
  { id: '4', name: 'Frites & Accompagnements', slug: 'accompagnements' },
  { id: '5', name: 'Boissons', slug: 'boissons' },
  { id: '6', name: 'Desserts', slug: 'desserts' }
];

export const menuItems: MenuItem[] = [
  // Burgers
  {
    id: '1',
    title: 'Quarter Fusion Burger',
    description: 'Burger signature avec steak de bœuf, fromage, salade, tomate, oignon et sauce maison',
    price: 12.90,
    category: 'Burgers',
    available: true
  },
  {
    id: '2',
    title: 'Chicken Burger',
    description: 'Burger au poulet pané, salade, tomate et sauce ranch',
    price: 11.50,
    category: 'Burgers',
    available: true
  },
  {
    id: '3',
    title: 'Double Cheese Burger',
    description: 'Double steak, double fromage, salade, tomate, oignon et sauce spéciale',
    price: 15.90,
    category: 'Burgers',
    available: true
  },

  // Wings & Tenders
  {
    id: '4',
    title: 'Wings Buffalo (6 pièces)',
    description: 'Ailes de poulet sauce buffalo, servies avec sauce ranch',
    price: 8.90,
    category: 'Wings & Tenders',
    available: true
  },
  {
    id: '5',
    title: 'Wings BBQ (6 pièces)',
    description: 'Ailes de poulet sauce barbecue, servies avec sauce ranch',
    price: 8.90,
    category: 'Wings & Tenders',
    available: true
  },
  {
    id: '6',
    title: 'Tenders de Poulet (4 pièces)',
    description: 'Filets de poulet panés, servis avec sauce au choix',
    price: 9.50,
    category: 'Wings & Tenders',
    available: true
  },
  {
    id: '7',
    title: 'Bucket Maxi Fusion',
    description: '8 pièces de poulet + 6 wings + frites + 2 sauces au choix',
    price: 24.90,
    category: 'Wings & Tenders',
    available: true
  },

  // Sandwiches
  {
    id: '8',
    title: 'Sandwich au Four',
    description: 'Poulet grillé, fromage fondu, salade, tomate dans un pain au four',
    price: 10.90,
    category: 'Sandwiches',
    available: true
  },
  {
    id: '9',
    title: 'Sandwich Tender',
    description: 'Tenders de poulet, salade, tomate, sauce ranch dans un pain brioché',
    price: 9.90,
    category: 'Sandwiches',
    available: true
  },
  {
    id: '10',
    title: 'Sandwich Végétarien',
    description: 'Légumes grillés, fromage, salade, tomate dans un pain complet',
    price: 8.90,
    category: 'Sandwiches',
    available: true
  },

  // Frites & Accompagnements
  {
    id: '11',
    title: 'Frites Maison',
    description: 'Frites fraîches coupées à la main, dorées et croustillantes',
    price: 4.50,
    category: 'Frites & Accompagnements',
    available: true
  },
  {
    id: '12',
    title: 'Frites Fromage',
    description: 'Frites maison recouvertes de fromage fondu et bacon',
    price: 6.90,
    category: 'Frites & Accompagnements',
    available: true
  },
  {
    id: '13',
    title: 'Onion Rings',
    description: 'Anneaux d\'oignon panés et frits, servis avec sauce ranch',
    price: 5.50,
    category: 'Frites & Accompagnements',
    available: true
  },
  {
    id: '14',
    title: 'Salade César',
    description: 'Laitue, parmesan, croûtons, sauce césar maison',
    price: 7.90,
    category: 'Frites & Accompagnements',
    available: true
  },

  // Boissons
  {
    id: '15',
    title: 'Coca-Cola',
    description: 'Soda 33cl',
    price: 2.50,
    category: 'Boissons',
    available: true
  },
  {
    id: '16',
    title: 'Sprite',
    description: 'Limonade 33cl',
    price: 2.50,
    category: 'Boissons',
    available: true
  },
  {
    id: '17',
    title: 'Fanta',
    description: 'Soda orange 33cl',
    price: 2.50,
    category: 'Boissons',
    available: true
  },
  {
    id: '18',
    title: 'Eau Minérale',
    description: 'Eau minérale 50cl',
    price: 2.00,
    category: 'Boissons',
    available: true
  },

  // Desserts
  {
    id: '19',
    title: 'Brownie Chocolat',
    description: 'Brownie moelleux au chocolat noir, servi chaud',
    price: 4.90,
    category: 'Desserts',
    available: true
  },
  {
    id: '20',
    title: 'Cheesecake',
    description: 'Cheesecake classique avec coulis de fruits rouges',
    price: 5.50,
    category: 'Desserts',
    available: true
  },
  {
    id: '21',
    title: 'Sundae Vanille',
    description: 'Glace vanille, chantilly, sauce chocolat et noix de pécan',
    price: 4.90,
    category: 'Desserts',
    available: true
  }
];

// Fonction pour obtenir les plats par catégorie
export const getMenuByCategory = (categorySlug: string): MenuItem[] => {
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return menuItems.filter(item => item.category === category.name);
};

// Fonction pour obtenir toutes les catégories
export const getAllCategories = (): Category[] => {
  return categories;
};

// Fonction pour obtenir tous les plats
export const getAllMenuItems = (): MenuItem[] => {
  return menuItems;
}; 