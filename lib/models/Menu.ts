import mongoose, { Schema, Document } from 'mongoose';

export interface IMenu extends Document {
  title: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  image: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index pour améliorer les performances
MenuSchema.index({ category: 1 });
MenuSchema.index({ available: 1 });
MenuSchema.index({ title: 1 });
MenuSchema.index({ price: 1 });

export default mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema); 