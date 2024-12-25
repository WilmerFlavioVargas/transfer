'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

type Destination = {
  _id: string
  name: string
  image: string
}

export default function FeaturedDestinations() {
  const t = useTranslations('FeaturedDestinations')
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/featured-destinations')
        if (!response.ok) throw new Error('Failed to fetch destinations')
        const data = await response.json()
        setDestinations(data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
      }
    }

    fetchDestinations()
  }, [])

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {destinations.map((destination) => (
          <Card key={destination._id}>
            <CardHeader>
              <CardTitle>{destination.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={destination.image}
                alt={destination.name}
                width={300}
                height={200}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

