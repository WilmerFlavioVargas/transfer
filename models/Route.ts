import mongoose from 'mongoose';

export interface IRoute extends mongoose.Document {
  origin: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
  distance: number;
  estimatedTime: number;
  vehicles: mongoose.Types.ObjectId[];
}

const RouteSchema = new mongoose.Schema<IRoute>({
  origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  distance: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
});

export default mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);

