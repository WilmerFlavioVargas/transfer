'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

interface MapboxMapProps {
  center: [number, number]
  zoom: number
}

export default function MapboxMap({ center, zoom }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (map.current) return

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom
      })

      map.current.on('load', () => {
        setMapLoaded(true)
        console.log('Mapbox cargado exitosamente')
      })
    } catch (error) {
      console.error('Error al cargar Mapbox:', error)
    }

    return () => {
      map.current?.remove()
    }
  }, [center, zoom])

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
}

