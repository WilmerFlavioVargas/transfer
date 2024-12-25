import { NextResponse } from 'next/server'
import Vehicle from '@/models/Vehicle'
import Route from '@/models/Route'
import { validateInput } from '@/lib/validation'
import { vehicleSearchSchema } from '@/lib/schemas'
import dbConnect from '@/lib/dbConnect'
import { sendNotification } from '@/server/socket'

export async function POST(request: Request) {
  await dbConnect()

  try {
    const body = await request.json()
    const validationResult = validateInput(vehicleSearchSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const { pickup, dropoff, passengers, departureDate } = validationResult.data

    // Find the route
    const route = await Route.findOne({ origin: pickup, destination: dropoff })

    if (!route) {
      return NextResponse.json({ error: 'No route found' }, { status: 404 })
    }

    // Find vehicles that match the route and have enough capacity
    const vehicles = await Vehicle.find({
      _id: { $in: route.vehicles },
      capacity: { $gte: passengers }
    }).sort({ basePrice: 1 })

    sendNotification((global as any).io, 'shoppingCart', `New search for vehicles from ${pickup} to ${dropoff}`)

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to search vehicles' }, { status: 500 })
  }
}

