import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Location from '@/models/Location'
import dbConnect from '@/lib/dbConnect'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const featuredDestinations = await Location.find({ isFeatured: true }).limit(6)
    return NextResponse.json(featuredDestinations)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch featured destinations' }, { status: 500 })
  }
}

