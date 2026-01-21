// Types pour l'administration
export interface AdminStats {
  ordersToday: number;
  revenueToday: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
}

export interface OrderWithDetails {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  deliveryAddress?: string;
  city?: string;
  isDelivery: boolean;
  status: OrderStatus;
  estimatedTime: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  description?: string;
}

export type OrderStatus = 'A_PREPARER' | 'EN_ATTENTE' | 'EN_PREPARATION' | 'PRETE' | 'TERMINEE' | 'ANNULEE';
export type PaymentMethod = 'ESPECES' | 'CARTE';

export interface DashboardData {
  stats: AdminStats;
  recentOrders: OrderWithDetails[];
  popularItems: PopularItem[];
  weeklyRevenue: RevenueData[];
}

export interface PopularItem {
  title: string;
  quantity: number;
  revenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'system' | 'alert';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  urgent?: boolean;
}

// Types pour la gestion des menus en admin
export interface AdminMenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  priceClickAndCollect?: number | null;
  priceDelivery?: number | null;
  image: string;
  available: boolean;
  badge?: string;
  availableForClickAndCollect: boolean;
  availableForDelivery: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  itemCount?: number;
  createdAt: Date;
  updatedAt: Date;
}