import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin', 'superadmin']),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  createdAt: z.date(),
  lastLogin: z.date().optional(),
  isActive: z.boolean(),
  twoFactorSecret: z.string().optional(),
  isTwoFactorEnabled: z.boolean(),
  loyaltyPoints: z.number().int().nonnegative(),
})

export const clientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  nationality: z.string().optional(),
  documentType: z.enum(['DNI', 'Passport']).optional(),
  documentNumber: z.string().optional(),
  createdAt: z.date(),
})

export const locationSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['Airport', 'Train Station', 'Hotel', 'Tourist Site', 'Bus Terminal', 'City']),
  city: z.string(), // MongoDB ObjectId as string
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean(),
})

export const citySchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
})

export const providerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  createdAt: z.date(),
})

export const routeSchema = z.object({
  origin: z.string(), // MongoDB ObjectId as string
  destination: z.string(), // MongoDB ObjectId as string
  distance: z.number().positive(),
  estimatedTime: z.number().positive(),
  vehicles: z.array(z.string()), // Array of MongoDB ObjectIds as strings
})

export const reservationSchema = z.object({
  client: z.string(), // MongoDB ObjectId as string
  services: z.array(z.object({
    route: z.string(), // MongoDB ObjectId as string
    vehicle: z.string(), // MongoDB ObjectId as string
    pickupDate: z.date(),
    pickupTime: z.string(),
    isRoundTrip: z.boolean(),
    returnDate: z.date().optional(),
    returnTime: z.string().optional(),
    passengers: z.number().int().positive(),
    price: z.number().positive(),
    status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']),
  })),
  totalPrice: z.number().positive(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Refunded']),
  createdAt: z.date(),
  reservationCode: z.string(),
  reservationPassword: z.string(),
})

export const paymentSchema = z.object({
  reservation: z.string(), // MongoDB ObjectId as string
  amount: z.number().positive(),
  method: z.enum(['Credit Card', 'Debit Card', 'Yape', 'Plin']),
  status: z.enum(['Pending', 'Completed', 'Failed', 'Refunded']),
  transactionId: z.string().optional(),
  createdAt: z.date(),
})

export const vehicleSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['Sedan', 'SUV', 'Van', 'Bus']),
  capacity: z.number().int().positive(),
  luggage: z.number().int().nonnegative(),
  category: z.enum(['Standard', 'Comfort', 'Luxury', 'Luxury Supreme']),
  basePrice: z.number().positive(),
  image: z.string().url().optional(),
  provider: z.string(), // MongoDB ObjectId as string
})

export const reviewSchema = z.object({
  user: z.string(), // MongoDB ObjectId as string
  reservation: z.string(), // MongoDB ObjectId as string
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  createdAt: z.date(),
})

export const testimonialSchema = z.object({
  name: z.string().min(2),
  content: z.string(),
  rating: z.number().int().min(1).max(5),
  createdAt: z.date(),
})

export const vehicleSearchSchema = z.object({
  pickup: z.string(), // MongoDB ObjectId as string for the pickup location
  dropoff: z.string(), // MongoDB ObjectId as string for the dropoff location
  passengers: z.number().int().positive(),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
  }),
})

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}



