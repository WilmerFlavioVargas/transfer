'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function CityManager() {
  const t = useTranslations('CityManager')
  const [cities, setCities] = useState([])
  const [newCity, setNewCity] = useState({ name: '', country: '' })

  useEffect(() => {
    fetchCities()
  }, [])

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
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity),
      })
      if (!response.ok) throw new Error('Failed to create city')
      await fetchCities()
      setNewCity({ name: '', country: '' })
      toast({
        title: "Success",
        description: "City created successfully.",
      })
    } catch (error) {
      console.error('Error creating city:', error)
      toast({
        title: "Error",
        description: "Failed to create city. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCity = async (cityId: string) => {
    try {
      const response = await fetch(`/api/cities/${cityId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete city')
      await fetchCities()
      toast({
        title: "Success",
        description: "City deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting city:', error)
      toast({
        title: "Error",
        description: "Failed to delete city. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('manageCities')}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder={t('cityName')}
          value={newCity.name}
          onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder={t('country')}
          value={newCity.country}
          onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
          required
        />
        <Button type="submit">{t('addCity')}</Button>
      </form>
      <ul className="space-y-2">
        {cities.map((city: any) => (
          <li key={city._id} className="flex justify-between items-center">
            <span>{city.name}, {city.country}</span>
            <Button variant="destructive" onClick={() => handleDeleteCity(city._id)}>{t('delete')}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

