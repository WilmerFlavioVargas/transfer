import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'

export async function POST(request: Request) {
  await dbConnect()
  const session: any = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const secret = authenticator.generateSecret()
    user.twoFactorSecret = secret
    await user.save()

    const otpauth = authenticator.keyuri(user.email, 'TransferBookingApp', secret)
    const qrCode = await qrcode.toDataURL(otpauth)

    return NextResponse.json({ qrCode })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to setup two-factor authentication' }, { status: 500 })
  }
}

