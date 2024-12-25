'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import { vehicleSearchSchema } from '@/lib/validation'
import MapboxMap from './MapboxMap'
import IzipayPayment from './IzipayPayment'

type FormData = z.infer<typeof vehicleSearchSchema>

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

type VehicleSearchProps = {
  initialService?: Service
  onSearch: (data: any) => void;
  onSubmit: (service: Service) => void
}

export default function VehicleSearch({ initialService, onSubmit }: VehicleSearchProps) {
  const t = useTranslations('VehicleSearch')
  const [isRoundTrip, setIsRoundTrip] = useState(initialService?.isRoundTrip || false)
  const [locations, setLocations] = useState([])
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>(initialService?.vehicles || [])
  const [showPayment, setShowPayment] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(vehicleSearchSchema),
    defaultValues: initialService || {
      isRoundTrip: false,
    }
  })

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => {
        console.error('Failed to fetch locations:', err)
        toast({
          title: "Error",
          description: "Failed to fetch locations. Please try again.",
          variant: "destructive",
        })
      })
  }, [])

  const searchVehicles = async (data: FormData) => {
    try {
      const response = await fetch('/api/search-vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to search vehicles')
      }

      const result = await response.json()
      setAvailableVehicles(result)
    } catch (error) {
      console.error('Error searching vehicles:', error)
      toast({
        title: "Error",
        description: "Failed to search vehicles. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = async (data: FormData) => {
    await searchVehicles(data)
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    const existingVehicle = selectedVehicles.find(v => v.id === vehicle.id)
    if (existingVehicle) {
      setSelectedVehicles(selectedVehicles.map(v => 
        v.id === vehicle.id ? { ...v, quantity: v.quantity + 1 } : v
      ))
    } else {
      setSelectedVehicles([...selectedVehicles, { ...vehicle, quantity: 1 }])
    }
    updateTotalAmount([...selectedVehicles, { ...vehicle, quantity: 1 }])
  }

  const handleVehicleRemove = (vehicleId: string) => {
    const updatedVehicles = selectedVehicles.filter(v => v.id !== vehicleId)
    setSelectedVehicles(updatedVehicles)
    updateTotalAmount(updatedVehicles)
  }

  const updateTotalAmount = (vehicles: Vehicle[]) => {
    const total = vehicles.reduce((sum, vehicle) => sum + vehicle.price * vehicle.quantity, 0)
    setTotalAmount(total)
  }

  const handleSubmitService = (data: FormData) => {
    if (selectedVehicles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one vehicle.",
        variant: "destructive",
      })
      return
    }

    const newService: Service = {
      id: initialService?.id || Date.now().toString(),
      ...data,
      vehicles: selectedVehicles,
    }

    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    const newService: Service = {
      id: initialService?.id || Date.now().toString(),
      ...watch(),
      vehicles: selectedVehicles,
    }
    onSubmit(newService)
    setShowPayment(false)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    setShowPayment(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="pickup">{t('pickup')}</Label>
          <Select {...register('pickup')}>
            {locations.map((location: any) => (
              <option key={location._id} value={location._id}>{location.name}</option>
            ))}
          </Select>
          {errors.pickup && <p className="text-red-500 text-sm mt-1">{errors.pickup.message}</p>}
        </div>

        <div>
          <Label htmlFor="dropoff">{t('dropoff')}</Label>
          <Select {...register('dropoff')}>
            {locations.map((location: any) => (
              <option key={location._id} value={location._id}>{location.name}</option>
            ))}
          </Select>
          {errors.dropoff && <p className="text-red-500 text-sm mt-1">{errors.dropoff.message}</p>}
        </div>

        <div>
          <Label htmlFor="passengers">{t('passengers')}</Label>
          <Input id="passengers" type="number" {...register('passengers', { valueAsNumber: true })} />
          {errors.passengers && <p className="text-red-500 text-sm mt-1">{errors.passengers.message}</p>}
        </div>

        <div>
          <Label htmlFor="departureDate">{t('departureDate')}</Label>
          <Controller
            control={control}
            name="departureDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                onChange={(date) => onChange(date?.toISOString())}
                selected={value ? new Date(value) : null}
                minDate={new Date()}
                className="w-full p-2 border rounded"
              />
            )}
          />
          {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate.message}</p>}
        </div>

        <div>
          <Label htmlFor="departureTime">{t('departureTime')}</Label>
          <Input id="departureTime" type="time" {...register('departureTime')} />
          {errors.departureTime && <p className="text-red-500 text-sm mt-1">{errors.departureTime.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRoundTrip"
            checked={isRoundTrip}
            onCheckedChange={(checked) => {
              setIsRoundTrip(checked as boolean)
            }}
            {...register('isRoundTrip')}
          />
          <Label htmlFor="isRoundTrip">{t('roundTrip')}</Label>
        </div>

        {isRoundTrip && (
          <>
            <div>
              <Label htmlFor="returnDate">{t('returnDate')}</Label>
              <Controller
                control={control}
                name="returnDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    onChange={(date) => onChange(date?.toISOString())}
                    selected={value ? new Date(value) : null}
                    minDate={watch('departureDate') ? new Date(watch('departureDate')) : new Date()}
                    className="w-full p-2 border rounded"
                  />
                )}
              />
              {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate.message}</p>}
            </div>

            <div>
              <Label htmlFor="returnTime">{t('returnTime')}</Label>
              <Input id="returnTime" type="time" {...register('returnTime')} />
              {errors.returnTime && <p className="text-red-500 text-sm mt-1">{errors.returnTime.message}</p>}
            </div>
          </>
        )}

        <Button type="submit" className="w-full">{t('search')}</Button>
      </form>

      {availableVehicles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('availableVehicles')}</h3>
          <ul className="space-y-2">
            {availableVehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex justify-between items-center">
                <span>{vehicle.name} - ${vehicle.price}</span>
                <Button onClick={() => handleVehicleSelect(vehicle)}>{t('select')}</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedVehicles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('selectedVehicles')}</h3>
          <ul className="space-y-2">
            {selectedVehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex justify-between items-center">
                <span>{vehicle.name} - ${vehicle.price} x {vehicle.quantity}</span>
                <Button variant="destructive" onClick={() => handleVehicleRemove(vehicle.id)}>{t('remove')}</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button 
        onClick={() => handleSubmitService(watch())} 
        className="w-full mt-4"
        disabled={selectedVehicles.length === 0}
      >
        {initialService ? t('updateService') : t('addService')}
      </Button>

      {showPayment && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('payment')}</h3>
          <IzipayPayment
            amount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{t('map')}</h3>
        <MapboxMap center={[-74.006, 40.7128]} zoom={12} />
      </div>
    </div>
  )
}

