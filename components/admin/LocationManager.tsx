'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function LocationManager() {
  const t = useTranslations('LocationManager')
  const [locations, setLocations] = useState([])
  const [cities, setCities] = useState([])
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: '',
    city: '',
    latitude: '',
    longitude: '',
    description: '',
  })

  useEffect(() => {
    fetchLocations()
    fetchCities()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (!response.ok) throw new Error('Failed to fetch locations')
      const data = await response.json()
      setLocations(data)
    } catch (error) {
      console.error('Error fetching locations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch locations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities')
      if (!response.ok) throw new Error('Failed to fetch cities')
      const data = await response.json()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast({
        title: "Error",
        description: "Failed to fetch cities. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLocation),
      })
      if (!response.ok) throw new Error('Failed to create location')
      await fetchLocations()
      setNewLocation({
        name: '',
        type: '',
        city: '',
        latitude: '',
        longitude: '',
        description: '',
      })
      toast({
        title: "Success",
        description: "Location created successfully.",
      })
    } catch (error) {
      console.error('Error creating location:', error)
      toast({
        title: "Error",
        description: "Failed to create location. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLocation = async (locationId: string) => {
    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete location')
      await fetchLocations()
      toast({
        title: "Success",
        description: "Location deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting location:', error)
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('manageLocations')}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder={t('locationName')}
          value={newLocation.name}
          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
          required
        />
        <Select
          value={newLocation.type}
          onValueChange={(value) => setNewLocation({ ...newLocation, type: value })}
          required
        >
          <option value="">{t('selectType')}</option>
          <option value="Airport">{t('airport')}</option>
          <option value="Train Station">{t('trainStation')}</option>
          <option value="Hotel">{t('hotel')}</option>
          <option value="Tourist Site">{t('touristSite')}</option>
          <option value="Bus Terminal">{t('busTerminal')}</option>
          <option value="City">{t('city')}</option>
        </Select>
        <Select
          value={newLocation.city}
          onValueChange={(value) => setNewLocation({ ...newLocation, city: value })}
          required
        >
          <option value="">{t('selectCity')}</option>
          {cities.map((city: any) => (
            <option key={city._id} value={city._id}>{city.name}</option>
          ))}
        </Select>
        <Input
          type="number"
          placeholder={t('latitude')}
          value={newLocation.latitude}
          onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder={t('longitude')}
          value={newLocation.longitude}
          onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder={t('description')}
          value={newLocation.description}
          onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
        />
        <Button type="submit">{t('addLocation')}</Button>
      </form>
      <ul className="space-y-2">
        {locations.map((location: any) => (
          <li key={location._id} className="flex justify-between items-center">
            <span>{location.name} - {location.type}</span>
            <Button variant="destructive" onClick={() => handleDeleteLocation(location._id)}>{t('delete')}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

