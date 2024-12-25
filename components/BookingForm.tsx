'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
/* import { useToast } from "@/components/ui/use-toast" */
import { useWebSocket } from '../hooks/useWebSocket'

const schema = z.object({
  pickup: z.string().min(1, { message: "Pickup location is required" }),
  dropoff: z.string().min(1, { message: "Drop-off location is required" }),
  passengers: z.number().min(1, { message: "At least 1 passenger is required" }).max(50, { message: "Maximum 50 passengers allowed" }),
  departureDate: z.date().min(new Date(), { message: "Departure date must be in the future" }),
  departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format" }),
  isRoundTrip: z.boolean(),
  returnDate: z.date().optional(),
  returnTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format" }).optional(),
})

type FormData = z.infer<typeof schema>

export default function BookingForm() {
  const t = useTranslations('BookingForm')
  const router = useRouter()
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const { socket, notifications } = useWebSocket('bookings')
  const { toast } = useToast()

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isRoundTrip: false,
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      toast({
        title: "Booking submitted",
        description: "Your booking request has been submitted successfully.",
      })

      if (socket) {
        socket.emit('newBooking', data)
      }

      router.push('/search?' + new URLSearchParams(data as any).toString())
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast({
        title: "Error",
        description: "There was a problem submitting your booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="pickup">{t('pickup')}</Label>
        <Select onValueChange={(value) => register('pickup').onChange({ target: { value } })}>
          <SelectTrigger id="pickup">
            <SelectValue placeholder="Select pickup location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="airport">Airport</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="city_center">City Center</SelectItem>
          </SelectContent>
        </Select>
        {errors.pickup && <p className="text-red-500 text-sm">{errors.pickup.message}</p>}
      </div>

      <div>
        <Label htmlFor="dropoff">{t('dropoff')}</Label>
        <Select onValueChange={(value) => register('dropoff').onChange({ target: { value } })}>
          <SelectTrigger id="dropoff">
            <SelectValue placeholder="Select drop-off location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="airport">Airport</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="city_center">City Center</SelectItem>
          </SelectContent>
        </Select>
        {errors.dropoff && <p className="text-red-500 text-sm">{errors.dropoff.message}</p>}
      </div>

      <div>
        <Label htmlFor="passengers">{t('passengers')}</Label>
        <Input id="passengers" type="number" {...register('passengers', { valueAsNumber: true })} />
        {errors.passengers && <p className="text-red-500 text-sm">{errors.passengers.message}</p>}
      </div>

      <div>
        <Label htmlFor="departureDate">{t('departureDate')}</Label>
        <Controller
          control={control}
          name="departureDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              onChange={onChange}
              selected={value}
              minDate={new Date()}
              className="w-full p-2 border rounded"
            />
          )}
        />
        {errors.departureDate && <p className="text-red-500 text-sm">{errors.departureDate.message}</p>}
      </div>

      <div>
        <Label htmlFor="departureTime">{t('departureTime')}</Label>
        <Input id="departureTime" type="time" {...register('departureTime')} />
        {errors.departureTime && <p className="text-red-500 text-sm">{errors.departureTime.message}</p>}
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
                  onChange={onChange}
                  selected={value}
                  minDate={watch('departureDate') || new Date()}
                  className="w-full p-2 border rounded"
                />
              )}
            />
            {errors.returnDate && <p className="text-red-500 text-sm">{errors.returnDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="returnTime">{t('returnTime')}</Label>
            <Input id="returnTime" type="time" {...register('returnTime')} />
            {errors.returnTime && <p className="text-red-500 text-sm">{errors.returnTime.message}</p>}
          </div>
        </>
      )}

      <Button type="submit" className="w-full">{t('search')}</Button>
    </form>
  )
}

