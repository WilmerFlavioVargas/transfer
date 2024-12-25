'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import { useApi } from '@/hooks/useApi'

type Vehicle = {
  _id: string
  name: string
  type: string
  capacity: number
  luggage: number
  category: string
  basePrice: number
  image: string
}

export default function SearchResults({ searchParams }: { searchParams: any }) {
  const t = useTranslations('SearchResults')
  const { data: vehicles, isLoading, isError, mutate } = useApi<Vehicle[]>('/api/search-vehicles')

  useEffect(() => {
    mutate()
  }, [searchParams, mutate])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading vehicles</div>

  const addToCart = (vehicle: Vehicle) => {
    // Implement add to cart functionality
    console.log('Adding to cart:', vehicle)
    toast({
      title: "Added to cart",
      description: `${vehicle.name} has been added to your cart.`,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles && vehicles.map((vehicle, index) => (
        <motion.div
          key={vehicle._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="flex flex-col">
            <CardContent>
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h3 className="text-lg font-semibold">{vehicle.name}</h3>
              <p>{t('type')}: {vehicle.type}</p>
              <p>{t('capacity')}: {vehicle.capacity}</p>
              <p>{t('luggage')}: {vehicle.luggage}</p>
              <p>{t('category')}: {vehicle.category}</p>
              <p className="text-xl font-bold mt-2">{t('price')}: ${vehicle.basePrice}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button onClick={() => addToCart(vehicle)} className="w-full">{t('addToCart')}</Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

