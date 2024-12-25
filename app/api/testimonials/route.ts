import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Testimonial from '@/models/Testimonial'
import dbConnect from '@/lib/dbConnect'
import { validateInput } from '@/lib/validation'
import { testimonialSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const testimonials = await Testimonial.find().limit(4)
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validationResult = validateInput(testimonialSchema, body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    const newTestimonial = new Testimonial(validationResult.data)
    await newTestimonial.save()
    return NextResponse.json(newTestimonial, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

