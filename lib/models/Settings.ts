import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  orderingOpen: boolean;
  deliveryFee: number;
  deliveryCities: string[];
  minimumOrder: number;
  deliveryTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  orderingOpen: {
    type: Boolean,
    default: true,
  },
  deliveryFee: {
    type: Number,
    default: 2.50,
    min: 0,
  },
  deliveryCities: [{
    type: String,
    trim: true,
  }],
  minimumOrder: {
    type: Number,
    default: 20,
    min: 0,
  },
  deliveryTime: {
    type: String,
    default: '30-45 minutes',
    trim: true,
  },
}, {
  timestamps: true,
});

// Index pour améliorer les performances
SettingsSchema.index({ orderingOpen: 1 });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema); 