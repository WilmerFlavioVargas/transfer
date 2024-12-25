import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: String,
  nationality: String,
  documentType: { type: String, enum: ['DNI', 'Passport'] },
  documentNumber: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Client || mongoose.model('Client', ClientSchema)

