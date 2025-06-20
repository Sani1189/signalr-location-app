"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"

interface LocationMapPickerProps {
  onLocationSelect: (lat: number, lon: number) => void
  initialLat?: number
  initialLon?: number
}

export function LocationMapPicker({
  onLocationSelect,
  initialLat = 23.8103,
  initialLon = 90.4125,
}: LocationMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({ lat: initialLat, lon: initialLon })

  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window === "undefined") return

      try {
        const L = (await import("leaflet")).default

        // Fix for default markers in Leaflet with webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map
          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
          }).setView([initialLat, initialLon], 10)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(mapInstanceRef.current)

          // Create custom marker icon
          const customIcon = L.divIcon({
            html: `
              <div style="
                background: linear-gradient(45deg, #ef4444, #f97316);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
              ">📍</div>
            `,
            className: "custom-marker",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          // Add initial marker
          markerRef.current = L.marker([initialLat, initialLon], {
            icon: customIcon,
            draggable: true,
          })
            .addTo(mapInstanceRef.current)
            .bindPopup("Click and drag to select location")

          // Handle marker drag
          markerRef.current.on("dragend", (e: any) => {
            const position = e.target.getLatLng()
            setSelectedLocation({ lat: position.lat, lon: position.lng })
            onLocationSelect(position.lat, position.lng)
          })

          // Handle map click
          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng
            markerRef.current.setLatLng([lat, lng])
            setSelectedLocation({ lat, lon: lng })
            onLocationSelect(lat, lng)
          })

          setIsMapLoaded(true)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
        setIsMapLoaded(false)
      }
    }
  }, [initialLat, initialLon, onLocationSelect])

  const centerOnLocation = (lat: number, lon: number) => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lon], 12)
      markerRef.current.setLatLng([lat, lon])
      setSelectedLocation({ lat, lon })
      onLocationSelect(lat, lon)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Target className="h-4 w-4" />
        <span>Click on the map or drag the marker to select a location</span>
      </div>

      <>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        <div
          ref={mapRef}
          className="h-64 w-full rounded-lg border border-gray-300"
          style={{
            background: isMapLoaded ? "transparent" : "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
          }}
        />
      </>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => centerOnLocation(23.8103, 90.4125)} variant="outline" size="sm" className="text-xs">
          📍 Dhaka
        </Button>
        <Button onClick={() => centerOnLocation(40.7589, -73.9851)} variant="outline" size="sm" className="text-xs">
          📍 New York
        </Button>
        <Button onClick={() => centerOnLocation(51.5074, -0.1278)} variant="outline" size="sm" className="text-xs">
          📍 London
        </Button>
        <Button onClick={() => centerOnLocation(35.6762, 139.6503)} variant="outline" size="sm" className="text-xs">
          📍 Tokyo
        </Button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <strong>Selected:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
      </div>
    </div>
  )
}
