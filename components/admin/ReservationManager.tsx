'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

type Reservation = {
  _id: string
  client: {
    name: string
    email: string
  }
  services: {
    pickup: string
    dropoff: string
    date: string
    vehicle: string
  }[]
  totalPrice: number
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
}

export default function ReservationManager() {
  const t = useTranslations('ReservationManager')
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      if (!response.ok) throw new Error('Failed to fetch reservations')
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch reservations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('Failed to update reservation status')
      fetchReservations()
      toast({
        title: "Success",
        description: "Reservation status updated successfully.",
      })
    } catch (error) {
      console.error('Error updating reservation status:', error)
      toast({
        title: "Error",
        description: "Failed to update reservation status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('manageReservations')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('client')}</TableHead>
            <TableHead>{t('services')}</TableHead>
            <TableHead>{t('totalPrice')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation._id}>
              <TableCell>
                {reservation.client.name}<br />
                {reservation.client.email}
              </TableCell>
              <TableCell>
                {reservation.services.map((service, index) => (
                  <div key={index}>
                    {service.pickup} to {service.dropoff}<br />
                    {service.date} - {service.vehicle}
                  </div>
                ))}
              </TableCell>
              <TableCell>${reservation.totalPrice}</TableCell>
              <TableCell>{reservation.status}</TableCell>
              <TableCell>
                <select
                  value={reservation.status}
                  onChange={(e) => updateReservationStatus(reservation._id, e.target.value as Reservation['status'])}
                  className="p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

