import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Vehicle from '@/models/Vehicle'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { vehicleSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const vehicles = await Vehicle.find({}).populate('provider')
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
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
    const validationResult = validateInput(vehicleSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newVehicle = new Vehicle(validationResult.data)
    await newVehicle.save()
    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}

