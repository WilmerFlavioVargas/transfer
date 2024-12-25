'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Testimonial = {
  _id: string
  name: string
  content: string
  rating: number
}

export default function Testimonials() {
  const t = useTranslations('Testimonials')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials')
        if (!response.ok) throw new Error('Failed to fetch testimonials')
        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial._id}>
            <CardHeader>
              <CardTitle>{testimonial.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{testimonial.content}</p>
              <div className="mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

