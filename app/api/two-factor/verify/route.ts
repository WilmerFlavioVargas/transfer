import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { authenticator } from 'otplib'

export async function POST(request: Request) {
  await dbConnect()
  const session: { user: { id: string } } | null = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { verificationCode } = await request.json()
    const user = await User.findById(session.user.id)
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: 'User not found or two-factor not set up' }, { status: 404 })
    }

    const isValid = authenticator.verify({ token: verificationCode, secret: user.twoFactorSecret })

    if (isValid) {
      user.isTwoFactorEnabled = true
      await user.save()
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to verify two-factor authentication' }, { status: 500 })
  }
}

