import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Location from '@/models/Location'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { locationSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const locations = await Location.find({}).populate('city')
    return NextResponse.json(locations)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
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
    const validationResult = validateInput(locationSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newLocation = new Location(validationResult.data)
    await newLocation.save()
    return NextResponse.json(newLocation, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}

