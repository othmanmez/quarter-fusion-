// Types simplifiés pour le frontend - seulement ce qui est affiché à l'utilisateur
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  priceClickAndCollect?: number | null;
  priceDelivery?: number | null;
  image: string;
  available: boolean;
  badge?: string;
  category: Category;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations?: string[];
}

export interface OrderFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  moyenPaiement: string;
  notes: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}

// Types pour les formulaires et commandes - seulement l'essentiel frontend
export type PaymentMethod = 'especes' | 'carte';