import mongoose from 'mongoose';

export interface IReservation extends mongoose.Document {
  client: mongoose.Types.ObjectId;
  services: {
    route: mongoose.Types.ObjectId;
    vehicle: mongoose.Types.ObjectId;
    pickupDate: Date;
    pickupTime: string;
    isRoundTrip: boolean;
    returnDate?: Date;
    returnTime?: string;
    passengers: number;
    price: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  }[];
  totalPrice: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: Date;
  reservationCode: string;
  reservationPassword: string;
}

const ReservationSchema = new mongoose.Schema<IReservation>({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  services: [{
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    isRoundTrip: { type: Boolean, default: false },
    returnDate: Date,
    returnTime: String,
    passengers: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  }],
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  reservationCode: { type: String, required: true, unique: true },
  reservationPassword: { type: String, required: true },
});

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);

