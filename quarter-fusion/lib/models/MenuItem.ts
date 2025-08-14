import mongoose, { Schema, Document } from 'mongoose';

// Interface pour les éléments du menu
export interface IMenuItem extends Document {
  title: string;
  description: string;
  price: number;
  category: 'buckets' | 'quarters' | 'sandwiches' | 'accompagnements';
  image: string;
  badge?: 'HOT' | 'NEW' | 'TOP';
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Mongoose pour les éléments du menu
const MenuItemSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['buckets', 'quarters', 'sandwiches', 'accompagnements'],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    enum: ['HOT', 'NEW', 'TOP'],
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index pour améliorer les performances
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });
MenuItemSchema.index({ title: 1 });

// Export du modèle
export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema); 