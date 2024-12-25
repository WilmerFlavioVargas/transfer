'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function RouteManager() {
  const t = useTranslations('RouteManager')
  const [routes, setRoutes] = useState([])
  const [locations, setLocations] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [newRoute, setNewRoute] = useState<{
    origin: string,
    destination: string,
    distance: string,
    estimatedTime: string,
    vehicles: string[],
  }>({
    origin: '',
    destination: '',
    distance: '',
    estimatedTime: '',
    vehicles: [],
  })

  useEffect(() => {
    fetchRoutes()
    fetchLocations()
    fetchVehicles()
  }, [])

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes')
      if (!response.ok) throw new Error('Failed to fetch routes')
      const data = await response.json()
      setRoutes(data)
    } catch (error) {
      console.error('Error fetching routes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch routes. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoute),
      })
      if (!response.ok) throw new Error('Failed to create route')
      await fetchRoutes()
      setNewRoute({
        origin: '',
        destination: '',
        distance: '',
        estimatedTime: '',
        vehicles: [],
      })
      toast({
        title: "Success",
        description: "Route created successfully.",
      })
    } catch (error) {
      console.error('Error creating route:', error)
      toast({
        title: "Error",
        description: "Failed to create route. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRoute = async (routeId: string) => {
    try {
      const response = await fetch(`/api/routes/${routeId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete route')
      await fetchRoutes()
      toast({
        title: "Success",
        description: "Route deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting route:', error)
      toast({
        title: "Error",
        description: "Failed to delete route. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('manageRoutes')}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Select
          value={newRoute.origin}
          onValueChange={(value) => setNewRoute({ ...newRoute, origin: value })}
          required
        >
          <option value="">{t('selectOrigin')}</option>
          {locations.map((location: any) => (
            <option key={location._id} value={location._id}>{location.name}</option>
          ))}
        </Select>
        <Select
          value={newRoute.destination}
          onValueChange={(value) => setNewRoute({ ...newRoute, destination: value })}
          required
        >
          <option value="">{t('selectDestination')}</option>
          {locations.map((location: any) => (
            <option key={location._id} value={location._id}>{location.name}</option>
          ))}
        </Select>
        <Input
          type="number"
          placeholder={t('distance')}
          value={newRoute.distance}
          onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder={t('estimatedTime')}
          value={newRoute.estimatedTime}
          onChange={(e) => setNewRoute({ ...newRoute, estimatedTime: e.target.value })}
          required
        />
        <select
          multiple
          value={newRoute.vehicles}
          onChange={(e) => setNewRoute({ ...newRoute, vehicles: Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value) })}
          required
          className="select-class"
        >
          {vehicles.map((vehicle: any) => (
            <option key={vehicle._id} value={vehicle._id}>{vehicle.name}</option>
          ))}
        </select>
        <Button type="submit">{t('addRoute')}</Button>
      </form>
      <ul className="space-y-2">
        {routes.map((route: any) => (
          <li key={route._id} className="flex justify-between items-center">
            <span>{route.origin.name} to {route.destination.name}</span>
            <Button variant="destructive" onClick={() => handleDeleteRoute(route._id)}>{t('delete')}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

