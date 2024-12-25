import mongoose from 'mongoose';

export interface ILocation extends mongoose.Document {
  name: string;
  type: 'Airport' | 'Train Station' | 'Hotel' | 'Tourist Site' | 'Bus Terminal' | 'City';
  city: mongoose.Types.ObjectId;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  images?: string[];
  isFeatured: boolean;
}

const LocationSchema = new mongoose.Schema<ILocation>({
  name: { type: String, required: true },
  type: { type: String, enum: ['Airport', 'Train Station', 'Hotel', 'Tourist Site', 'Bus Terminal', 'City'], required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  description: String,
  images: [String],
  isFeatured: { type: Boolean, default: false },
});

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);

