import mongoose from 'mongoose';

export interface IProvider extends mongoose.Document {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdAt: Date;
}

const ProviderSchema = new mongoose.Schema<IProvider>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Provider || mongoose.model<IProvider>('Provider', ProviderSchema);

