// components/MapFilter.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
})

interface Project {
  id: string
  name: string
  location: string
  continent: string
  country: string
  images: string[]
  lat: number
  lng: number
}

interface MapFilterProps {
  projects: Project[]
  onContinentClick?: (continent: string) => void
}

export default function MapFilter({ projects }: MapFilterProps) {
  const defaultCenter: [number, number] = [20, 0] // Rough center of the world

  return (
    <div className="w-full h-[400px] mb-10 rounded-md overflow-hidden">
      <MapContainer center={defaultCenter} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[project.lat, project.lng]}
            icon={customIcon}
          >
            <Popup>
              <strong>{project.name}</strong>
              <br />
              {project.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
