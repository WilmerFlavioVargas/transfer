import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Provider from '@/models/Provider'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { providerSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const providers = await Provider.find({})
    return NextResponse.json(providers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
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
    const validationResult = validateInput(providerSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newProvider = new Provider(validationResult.data)
    await newProvider.save()
    return NextResponse.json(newProvider, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 })
  }
}

