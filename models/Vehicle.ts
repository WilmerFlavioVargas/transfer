import mongoose from 'mongoose';

export interface IVehicle extends mongoose.Document {
  name: string;
  type: 'Sedan' | 'SUV' | 'Van' | 'Bus';
  capacity: number;
  luggage: number;
  category: 'Standard' | 'Comfort' | 'Luxury' | 'Luxury Supreme';
  basePrice: number;
  image?: string;
  provider: mongoose.Types.ObjectId;
}

const VehicleSchema = new mongoose.Schema<IVehicle>({
  name: { type: String, required: true },
  type: { type: String, enum: ['Sedan', 'SUV', 'Van', 'Bus'], required: true },
  capacity: { type: Number, required: true },
  luggage: { type: Number, required: true },
  category: { type: String, enum: ['Standard', 'Comfort', 'Luxury', 'Luxury Supreme'], required: true },
  basePrice: { type: Number, required: true },
  image: String,
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

