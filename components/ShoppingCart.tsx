'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import VehicleSearch from './VehicleSearch'
import { useWebSocket } from '../hooks/useWebSocket'

type Vehicle = {
  id: string
  name: string
  price: number
  quantity: number
}

type Service = {
  id: string
  pickup: string
  dropoff: string
  departureDate: string
  departureTime: string
  returnDate?: string
  returnTime?: string
  isRoundTrip: boolean
  vehicles: Vehicle[]
}

export default function ShoppingCart() {
  const t = useTranslations('ShoppingCart')
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [isModifyingService, setIsModifyingService] = useState<string | null>(null)
  const { notifications } = useWebSocket('shoppingCart')

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setServices(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    notifications.forEach(notification => {
      toast({
        title: "New Notification",
        description: notification,
      })
    })
  }, [notifications])

  const addService = (newService: Service) => {
    setServices([...services, newService])
    toast({
      title: "Service added",
      description: "The new service has been added to your cart.",
    })
  }

  const removeService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId))
    toast({
      title: "Service removed",
      description: "The service has been removed from your cart.",
    })
  }

  const removeVehicle = (serviceId: string, vehicleId: string) => {
    setServices(services.map(service => {
      if (service.id === serviceId) {
        const updatedVehicles = service.vehicles.filter(v => v.id !== vehicleId)
        if (updatedVehicles.length === 0) {
          toast({
            title: "Error",
            description: "A service must have at least one vehicle.",
            variant: "destructive",
          })
          return service
        }
        return { ...service, vehicles: updatedVehicles }
      }
      return service
    }))
  }

  const updateVehicleQuantity = (serviceId: string, vehicleId: string, newQuantity: number) => {
    setServices(services.map(service => {
      if (service.id === serviceId) {
        const updatedVehicles = service.vehicles.map(v => 
          v.id === vehicleId ? { ...v, quantity: newQuantity } : v
        )
        return { ...service, vehicles: updatedVehicles }
      }
      return service
    }))
  }

  const calculateServiceTotal = (service: Service) => {
    const vehicleTotal = service.vehicles.reduce((sum, vehicle) => sum + vehicle.price * vehicle.quantity, 0)
    return service.isRoundTrip ? vehicleTotal * 2 : vehicleTotal
  }

  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + calculateServiceTotal(service), 0)
  }

  const modifyService = (serviceId: string, updatedVehicles: Vehicle[]) => {
    setServices(services.map(service => 
      service.id === serviceId ? { ...service, vehicles: updatedVehicles } : service
    ))
    setIsModifyingService(null)
    toast({
      title: "Service modified",
      description: "The service has been updated with the new vehicles.",
    })
  }

  return (
    <Card className="mt-4">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">{t('shoppingCart')}</h2>
        {services.length === 0 ? (
          <p>{t('emptyCart')}</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="mb-6 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">
                {t('serviceTitle', { pickup: service.pickup, dropoff: service.dropoff })}
              </h3>
              <p>{t('departureDate')}: {service.departureDate} {service.departureTime}</p>
              {service.isRoundTrip && (
                <p>{t('returnDate')}: {service.returnDate} {service.returnTime}</p>
              )}
              <p>{service.isRoundTrip ? t('roundTrip') : t('oneWay')}</p>
              <ul className="mt-2">
                {service.vehicles.map((vehicle) => (
                  <li key={vehicle.id} className="flex justify-between items-center mb-2">
                    <span>{vehicle.name}</span>
                    <div>
                      <input 
                        type="number" 
                        min="1" 
                        value={vehicle.quantity} 
                        onChange={(e) => updateVehicleQuantity(service.id, vehicle.id, parseInt(e.target.value))}
                        className="w-16 mr-2 p-1 border rounded"
                      />
                      <span className="mr-2">${vehicle.price * vehicle.quantity}</span>
                      <Button variant="destructive" size="sm" onClick={() => removeVehicle(service.id, vehicle.id)}>
                        {t('remove')}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">{t('serviceTotal')}: ${calculateServiceTotal(service)}</p>
              <div className="mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setIsModifyingService(service.id)}>
                      {t('modifyService')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('modifyService')}</DialogTitle>
                    </DialogHeader>
                    <VehicleSearch
                      initialService={service}
                      onSearch={() => {}}
                      onSubmit={(updatedVehicles) => modifyService(service.id, updatedVehicles.vehicles)}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => removeService(service.id)} className="ml-2">
                  {t('removeService')}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="font-bold">{t('total')}: ${calculateTotal().toFixed(2)}</span>
        <Button 
          disabled={services.length === 0}
          onClick={() => router.push('/checkout')}
        >
          {t('checkout')}
        </Button>
      </CardFooter>
      <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>{t('addAnotherService')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addNewService')}</DialogTitle>
            </DialogHeader>
            <VehicleSearch onSearch={() => {}} onSubmit={addService} />
            <VehicleSearch onSearch={() => {}} onSubmit={addService} />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  )
}

