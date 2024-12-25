import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import dbConnect from '../lib/dbConnect'

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// Create the User model (if it doesn't exist)
const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function createSuperAdmin() {
  try {
    // Connect to the database
    await dbConnect()

    const username = 'superadmin'
    const password = 'admin12345'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ username })
    if (existingAdmin) {
      console.log('Superadmin already exists')
      await mongoose.disconnect()
      return
    }

    // Create the superadmin
    await User.create({
      username,
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date()
    })

    console.log('Superadmin created successfully')
    
    // Close the connection
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error creating superadmin:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

createSuperAdmin().catch(console.error)

