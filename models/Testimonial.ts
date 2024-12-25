import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)

