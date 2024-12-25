import mongoose from 'mongoose';

export interface ICity extends mongoose.Document {
  name: string;
  country: string;
}

const CitySchema = new mongoose.Schema<ICity>({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

export default mongoose.models.City || mongoose.model<ICity>('City', CitySchema);

