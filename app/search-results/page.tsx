'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import Map from '../../components/Map'
import ShoppingCart from '../../components/ShoppingCart'

type Vehicle = {
  _id: string
  name: string
  type: string
  capacity: number
  luggage: number
  category: string
  basePrice: number
  image: string
  quantity?: number
}

export default function SearchResults() {
  const t = useTranslations('SearchResults')
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/search-vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(searchParams ? searchParams.entries() : [])),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch vehicles')
        }

        const data = await response.json()
        setVehicles(data)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        toast({
          title: "Error",
          description: "Failed to fetch vehicles. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchVehicles()
  }, [searchParams])

  const addToCart = (vehicle: Vehicle) => {
    const existingVehicle = selectedVehicles.find(v => v._id === vehicle._id)
    if (existingVehicle) {
      setSelectedVehicles(selectedVehicles.map(v => 
        v._id === vehicle._id ? { ...v, quantity: (v.quantity || 1) + 1 } : v
      ))
    } else {
      setSelectedVehicles([...selectedVehicles, { ...vehicle, quantity: 1 }])
    }
    toast({
      title: "Added to cart",
      description: `${vehicle.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(v => v._id !== vehicleId))
    toast({
      title: "Removed from cart",
      description: "The vehicle has been removed from your cart.",
    })
  }

  const addServiceToCart = () => {
    if (selectedVehicles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one vehicle.",
        variant: "destructive",
      })
      return
    }

    const newService = {
      id: Date.now().toString(),
      pickup: searchParams?.get('pickup') || '',
      dropoff: searchParams?.get('dropoff') || '',
      departureDate: searchParams?.get('departureDate') || '',
      departureTime: searchParams?.get('departureTime') || '',
      returnDate: searchParams?.get('returnDate') || undefined,
      returnTime: searchParams?.get('returnTime') || undefined,
      isRoundTrip: searchParams?.get('isRoundTrip') === 'true',
      vehicles: selectedVehicles.map(v => ({
        id: v._id,
        name: v.name,
        price: v.basePrice,
        quantity: v.quantity || 1,
      })),
    }

    // Add the new service to the cart in local storage
    const storedCart = localStorage.getItem('cart')
    const cart = storedCart ? JSON.parse(storedCart) : []
    cart.push(newService)
    localStorage.setItem('cart', JSON.stringify(cart))

    toast({
      title: "Service added to cart",
      description: "The selected vehicles have been added to your cart as a new service.",
    })

    // Clear selected vehicles
    setSelectedVehicles([])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('searchResults')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Map searchData={searchParams ? Object.fromEntries(searchParams.entries()) : {}} />
          <div className="mt-4">
            <ShoppingCart />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle._id} className="flex flex-col">
              <CardContent className="p-4">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover mb-4 rounded" />
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p>{t('type')}: {vehicle.type}</p>
                <p>{t('capacity')}: {vehicle.capacity}</p>
                <p>{t('luggage')}: {vehicle.luggage}</p>
                <p>{t('category')}: {vehicle.category}</p>
                <p className="text-xl font-bold mt-2">{t('price')}: ${vehicle.basePrice}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button onClick={() => addToCart(vehicle)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t('addToCart')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {selectedVehicles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">{t('selectedVehicles')}</h2>
          <ul className="space-y-2">
            {selectedVehicles.map((vehicle) => (
              <li key={vehicle._id} className="flex justify-between items-center">
                <span>{vehicle.name} - ${vehicle.basePrice} x {vehicle.quantity || 1}</span>
                <Button variant="destructive" onClick={() => removeFromCart(vehicle._id)}>{t('remove')}</Button>
              </li>
            ))}
          </ul>
          <Button onClick={addServiceToCart} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
            {t('addServiceToCart')}
          </Button>
        </div>
      )}
    </div>
  )
}

