import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Reservation from '@/models/Reservation'
import clientPromise from '@/lib/mongodb'
import { validateInput } from '@/lib/validation'
import { reservationSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  const client = await clientPromise
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }
  await client.connect(mongoUri)
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validationResult = validateInput(reservationSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newReservation = new Reservation(validationResult.data)
    await newReservation.save()
    return NextResponse.json(newReservation, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const client = await clientPromise
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }
  await client.connect(mongoUri)
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const reservations = await Reservation.find({}).populate('client').populate('services.route').populate('services.vehicle')
    return NextResponse.json(reservations)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 })
  }
}

