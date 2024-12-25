import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
let clientPromise: Promise<typeof mongoose>

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usa una variable global para preservar la conexión entre recargas de HMR
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<typeof mongoose>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = mongoose.connect(uri)
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, es mejor no usar una variable global.
  clientPromise = mongoose.connect(uri)
}

export default clientPromise

