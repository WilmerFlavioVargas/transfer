import mongoose from 'mongoose'
import City from '../models/City'
import Location from '../models/Location'
import Provider from '../models/Provider'
import Route from '../models/Route'
import Vehicle from '../models/Vehicle'
import User from '../models/User'
import Testimonial from '../models/Testimonial'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

async function seedDatabase() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }
    await mongoose.connect(MONGODB_URI)

    // Seed Cities
    const newYork = await City.create({ name: 'New York', country: 'USA' })
    const london = await City.create({ name: 'London', country: 'UK' })
    const paris = await City.create({ name: 'Paris', country: 'France' })

    // Seed Locations
    const jfk = await Location.create({
      name: 'JFK Airport',
      type: 'Airport',
      city: newYork._id,
      coordinates: { latitude: 40.6413, longitude: -73.7781 },
      isFeatured: true
    })
    const timesSquare = await Location.create({
      name: 'Times Square',
      type: 'Tourist Site',
      city: newYork._id,
      coordinates: { latitude: 40.7580, longitude: -73.9855 },
      isFeatured: true
    })
    const heathrow = await Location.create({
      name: 'Heathrow Airport',
      type: 'Airport',
      city: london._id,
      coordinates: { latitude: 51.4700, longitude: -0.4543 },
      isFeatured: true
    })
    const eiffelTower = await Location.create({
      name: 'Eiffel Tower',
      type: 'Tourist Site',
      city: paris._id,
      coordinates: { latitude: 48.8584, longitude: 2.2945 },
      isFeatured: true
    })

    // Seed Providers
    const luxuryTransfers = await Provider.create({
      name: 'Luxury Transfers',
      email: 'info@luxurytransfers.com',
      phoneNumber: '+1234567890'
    })
    const cityRides = await Provider.create({
      name: 'City Rides',
      email: 'support@cityrides.com',
      phoneNumber: '+0987654321'
    })

    // Seed Vehicles
    const luxurySedan = await Vehicle.create({
      name: 'Luxury Sedan',
      type: 'Sedan',
      capacity: 4,
      luggage: 2,
      category: 'Luxury',
      basePrice: 100,
      provider: luxuryTransfers._id
    })
    const cityVan = await Vehicle.create({
      name: 'City Van',
      type: 'Van',
      capacity: 8,
      luggage: 4,
      category: 'Standard',
      basePrice: 80,
      provider: cityRides._id
    })

    // Seed Routes
    await Route.create({
      origin: jfk._id,
      destination: timesSquare._id,
      distance: 20,
      estimatedTime: 45,
      vehicles: [luxurySedan._id, cityVan._id]
    })
    await Route.create({
      origin: heathrow._id,
      destination: eiffelTower._id,
      distance: 340,
      estimatedTime: 360,
      vehicles: [luxurySedan._id]
    })

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10)
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    })
    await User.create({
      username: 'user',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      firstName: 'Regular',
      lastName: 'User'
    })

    // Seed Testimonials
    await Testimonial.create({
      name: 'John Doe',
      content: 'Great service! The driver was punctual and professional.',
      rating: 5
    })
    await Testimonial.create({
      name: 'Jane Smith',
      content: 'Very comfortable ride. Will use again for sure.',
      rating: 4
    })

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase()

