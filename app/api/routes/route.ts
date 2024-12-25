import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Route from '@/models/Route'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { routeSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const routes = await Route.find({}).populate('origin destination vehicles')
    return NextResponse.json(routes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 })
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
    const validationResult = validateInput(routeSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newRoute = new Route(validationResult.data)
    await newRoute.save()
    return NextResponse.json(newRoute, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 })
  }
}

