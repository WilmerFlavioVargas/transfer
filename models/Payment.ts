import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Credit Card', 'Debit Card', 'Yape', 'Plin'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)

