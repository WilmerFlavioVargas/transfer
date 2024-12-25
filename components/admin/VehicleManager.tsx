'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function VehicleManager() {
  const t = useTranslations('VehicleManager')
  const [vehicles, setVehicles] = useState([])
  const [providers, setProviders] = useState([])
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: '',
    capacity: '',
    luggage: '',
    category: '',
    basePrice: '',
    image: '',
    provider: '',
  })

  useEffect(() => {
    fetchVehicles()
    fetchProviders()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (!response.ok) throw new Error('Failed to fetch vehicles')
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

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers')
      if (!response.ok) throw new Error('Failed to fetch providers')
      const data = await response.json()
      setProviders(data)
    } catch (error) {
      console.error('Error fetching providers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch providers. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      })
      if (!response.ok) throw new Error('Failed to create vehicle')
      await fetchVehicles()
      setNewVehicle({
        name: '',
        type: '',
        capacity: '',
        luggage: '',
        category: '',
        basePrice: '',
        image: '',
        provider: '',
      })
      toast({
        title: "Success",
        description: "Vehicle created successfully.",
      })
    } catch (error) {
      console.error('Error creating vehicle:', error)
      toast({
        title: "Error",
        description: "Failed to create vehicle. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete vehicle')
      await fetchVehicles()
      toast({
        title: "Success",
        description: "Vehicle deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('manageVehicles')}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder={t('vehicleName')}
          value={newVehicle.name}
          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          required
        />
        <Select
          value={newVehicle.type}
          onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
          required
        >
          <option value="">{t('selectType')}</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
          <option value="Bus">Bus</option>
        </Select>
        <Input
          type="number"
          placeholder={t('capacity')}
          value={newVehicle.capacity}
          onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder={t('luggage')}
          value={newVehicle.luggage}
          onChange={(e) => setNewVehicle({ ...newVehicle, luggage: e.target.value })}
          required
        />
        <Select
          value={newVehicle.category}
          onValueChange={(value) => setNewVehicle({ ...newVehicle, category: value })}
          required
        >
          <option value="">{t('selectCategory')}</option>
          <option value="Standard">Standard</option>
          <option value="Comfort">Comfort</option>
          <option value="Luxury">Luxury</option>
          <option value="Luxury Supreme">Luxury Supreme</option>
        </Select>
        <Input
          type="number"
          placeholder={t('basePrice')}
          value={newVehicle.basePrice}
          onChange={(e) => setNewVehicle({ ...newVehicle, basePrice: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder={t('imageUrl')}
          value={newVehicle.image}
          onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })}
        />
        <Select
          value={newVehicle.provider}
          onValueChange={(value) => setNewVehicle({ ...newVehicle, provider: value })}
          required
        >
          <option value="">{t('selectProvider')}</option>
          {providers.map((provider: any) => (
            <option key={provider._id} value={provider._id}>{provider.name}</option>
          ))}
        </Select>
        <Button type="submit">{t('addVehicle')}</Button>
      </form>
      <ul className="space-y-2">
        {vehicles.map((vehicle: any) => (
          <li key={vehicle._id} className="flex justify-between items-center">
            <span>{vehicle.name} - {vehicle.type}</span>
            <Button variant="destructive" onClick={() => handleDeleteVehicle(vehicle._id)}>{t('delete')}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

