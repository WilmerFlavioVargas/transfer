import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { userSchema } from '@/lib/schemas'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await User.find({}).select('-password')
    return NextResponse.json(users)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validationResult = validateInput(userSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const { password, ...userData } = validationResult.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    })
    await newUser.save()

    const { password: _, ...userWithoutPassword } = newUser.toObject()
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

