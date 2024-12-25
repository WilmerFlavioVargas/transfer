'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function VehicleList() {
  const t = useTranslations('VehicleList')
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error('Failed to fetch vehicles:', err))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('availableVehicles')}</h2>
      {vehicles.map((vehicle: any) => (
        <div key={vehicle._id} className="border p-4 rounded">
          <h3 className="text-xl font-semibold">{vehicle.name}</h3>
          <p>{t('capacity')}: {vehicle.capacity}</p>
          <p>{t('luggage')}: {vehicle.luggage}</p>
          <p>{t('price')}: ${vehicle.price}</p>
          <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover mt-2" />
        </div>
      ))}
    </div>
  )
}

