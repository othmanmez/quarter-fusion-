import mongoose, { Schema, Document } from 'mongoose';

// Interface pour les articles de commande
export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  description?: string;
}

// Interface pour la commande
export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  deliveryAddress?: string;
  city?: string;
  isDelivery: boolean;
  status: 'A_PREPARER' | 'En attente' | 'En préparation' | 'Prête' | 'Terminée' | 'Annulée';
  estimatedTime: string;
  paymentMethod: 'especes' | 'carte';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Mongoose pour les commandes
const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  items: [{
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
  }],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  isDelivery: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    enum: ['A_PREPARER', 'En attente', 'En préparation', 'Prête', 'Terminée', 'Annulée'],
    default: 'A_PREPARER',
  },
  estimatedTime: {
    type: String,
    required: true,
    default: '30-45 minutes',
  },
  paymentMethod: {
    type: String,
    enum: ['especes', 'carte'],
    required: true,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Index pour améliorer les performances
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Fonction pour générer un numéro de commande unique
OrderSchema.statics.generateOrderNumber = async function(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const prefix = `QF${year}${month}${day}`;
  
  // Compter les commandes du jour
  const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  
  const count = await this.countDocuments({
    createdAt: {
      $gte: todayStart,
      $lt: todayEnd,
    },
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}${sequence}`;
};

// Export du modèle
export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema); 