import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'

export async function POST(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions) as { user: { id: string } } | null

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.loyaltyPoints < 100) {
      return NextResponse.json({ error: 'Not enough points' }, { status: 400 })
    }

    const redeemedPoints = 100
    user.loyaltyPoints -= redeemedPoints
    await user.save()

    return NextResponse.json({ newPoints: user.loyaltyPoints, redeemedPoints })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to redeem points' }, { status: 500 })
  }
}

