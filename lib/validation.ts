import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
})

export const vehicleSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['Sedan', 'SUV', 'Van', 'Bus']),
  capacity: z.number().int().positive(),
  luggage: z.number().int().nonnegative(),
  category: z.enum(['Standard', 'Comfort', 'Luxury', 'Luxury Supreme']),
  basePrice: z.number().positive(),
  image: z.string().url().optional(),
  provider: z.string(),
})

export const reservationSchema = z.object({
  client: z.string(),
  services: z.array(z.object({
    route: z.string(),
    vehicle: z.string(),
    pickupDate: z.string(),
    pickupTime: z.string(),
    isRoundTrip: z.boolean(),
    returnDate: z.string().optional(),
    returnTime: z.string().optional(),
    passengers: z.number().int().positive(),
    price: z.number().positive(),
  })),
  totalPrice: z.number().positive(),
})

export const vehicleSearchSchema = z.object({
  pickup: z.string(),
  dropoff: z.string(),
  passengers: z.number().int().positive(),
  departureDate: z.string(),
  departureTime: z.string(),
  isRoundTrip: z.boolean(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
})

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

