'use client'

import { useState, useEffect } from 'react'
import Map, { Marker, Source, Layer } from 'react-map-gl'
import { LineLayer } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

type Location = {
  _id: string
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

const lineLayer: LineLayer = {
  id: 'route',
  type: 'line',
  source: 'route', // Add the source property
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#0080ff',
    'line-width': 3
  }
}

export default function MapComponent({ searchData }: { searchData: any }) {
  const [viewState, setViewState] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 11
  })
  const [pickup, setPickup] = useState<Location | null>(null)
  const [dropoff, setDropoff] = useState<Location | null>(null)
  const [route, setRoute] = useState<GeoJSON.Feature<GeoJSON.Geometry> | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      if (searchData.pickup && searchData.dropoff) {
        try {
          const [pickupRes, dropoffRes] = await Promise.all([
            fetch(`/api/locations/${searchData.pickup}`),
            fetch(`/api/locations/${searchData.dropoff}`)
          ])

          if (!pickupRes.ok || !dropoffRes.ok) {
            throw new Error('Failed to fetch locations')
          }

          const [pickupData, dropoffData] = await Promise.all([
            pickupRes.json(),
            dropoffRes.json()
          ])

          setPickup(pickupData)
          setDropoff(dropoffData)

          // Center the map on the midpoint between pickup and dropoff
          const midLng = (pickupData.coordinates.longitude + dropoffData.coordinates.longitude) / 2
          const midLat = (pickupData.coordinates.latitude + dropoffData.coordinates.latitude) / 2
          setViewState({
            longitude: midLng,
            latitude: midLat,
            zoom: 10
          })

          // Fetch route
          const routeRes = await fetch(`/api/route?from=${searchData.pickup}&to=${searchData.dropoff}`)
          if (!routeRes.ok) {
            throw new Error('Failed to fetch route')
          }
          const routeData = await routeRes.json()
          setRoute(routeData)
        } catch (error) {
          console.error('Error fetching locations or route:', error)
        }
      }
    }

    fetchLocations()
  }, [searchData])

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: '100%', height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      {pickup && (
        <Marker longitude={pickup.coordinates.longitude} latitude={pickup.coordinates.latitude} color="green" />
      )}
      {dropoff && (
        <Marker longitude={dropoff.coordinates.longitude} latitude={dropoff.coordinates.latitude} color="red" />
      )}
      {route && (
        <Source id="route" type="geojson" data={route}>
          <Layer {...lineLayer} />
        </Source>
      )}
    </Map>
  )
}

