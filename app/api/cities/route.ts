import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import City from '@/models/City'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { citySchema } from '@/lib/schemas'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cities = await City.find({})
    return NextResponse.json(cities)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
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
    const validationResult = validateInput(citySchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newCity = new City(validationResult.data)
    await newCity.save()
    return NextResponse.json(newCity, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 })
  }
}

