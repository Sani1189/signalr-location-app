"use client"

import { useEffect, useRef, useState } from "react"
import type { LocationData } from "@/hooks/use-signalr"

interface MapComponentProps {
  location: LocationData
}

export default function MapComponent({ location }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

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
          // Initialize map with custom styling
          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
          }).setView([location.lat, location.lon], 15)

          // Add multiple tile layer options for better visual appeal
          const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          })

          const satelliteLayer = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "© Esri",
              maxZoom: 19,
            },
          )

          // Add default layer
          osmLayer.addTo(mapInstanceRef.current)

          // Add layer control
          const baseMaps = {
            "Street Map": osmLayer,
            Satellite: satelliteLayer,
          }
          L.control.layers(baseMaps).addTo(mapInstanceRef.current)

          // Create custom marker icon
          const customIcon = L.divIcon({
            html: `
              <div style="
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              "></div>
              <style>
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.2); }
                  100% { transform: scale(1); }
                }
              </style>
            `,
            className: "custom-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          // Add animated marker
          markerRef.current = L.marker([location.lat, location.lon], { icon: customIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(
              `
              <div style="text-align: center; padding: 8px;">
                <strong style="color: #1f2937; font-size: 14px;">${location.userName}</strong><br/>
                <div style="margin: 8px 0; padding: 4px; background: #f3f4f6; border-radius: 4px; font-family: monospace; font-size: 12px;">
                  <div style="color: #059669;">Lat: ${location.lat.toFixed(6)}</div>
                  <div style="color: #7c3aed;">Lon: ${location.lon.toFixed(6)}</div>
                </div>
                <div style="color: #6b7280; font-size: 11px;">
                  Updated: ${new Date().toLocaleTimeString()}
                </div>
              </div>
              `,
              {
                maxWidth: 250,
                className: "custom-popup",
              },
            )
            .openPopup()

          // Add accuracy circle
          const accuracyCircle = L.circle([location.lat, location.lon], {
            radius: 50, // 50 meter accuracy circle
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            color: "#3b82f6",
            weight: 2,
            opacity: 0.5,
          }).addTo(mapInstanceRef.current)

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
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && location && isMapLoaded) {
      // Smooth animation to new location
      const newLatLng = [location.lat, location.lon] as [number, number]

      // Animate marker to new position
      markerRef.current.setLatLng(newLatLng)

      // Update popup content with animation
      markerRef.current.setPopupContent(
        `
        <div style="text-align: center; padding: 8px;">
          <strong style="color: #1f2937; font-size: 14px;">${location.userName}</strong><br/>
          <div style="margin: 8px 0; padding: 4px; background: #f3f4f6; border-radius: 4px; font-family: monospace; font-size: 12px;">
            <div style="color: #059669;">Lat: ${location.lat.toFixed(6)}</div>
            <div style="color: #7c3aed;">Lon: ${location.lon.toFixed(6)}</div>
          </div>
          <div style="color: #6b7280; font-size: 11px;">
            Updated: ${new Date().toLocaleTimeString()}
          </div>
          <div style="margin-top: 4px;">
            <span style="background: linear-gradient(45deg, #10b981, #3b82f6); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">
              LIVE
            </span>
          </div>
        </div>
        `,
      )

      // Smooth pan to new location
      mapInstanceRef.current.panTo(newLatLng, {
        animate: true,
        duration: 1.0,
      })
    }
  }, [location, isMapLoaded])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div
        ref={mapRef}
        className="h-96 w-full rounded-lg"
        style={{
          background: isMapLoaded ? "transparent" : "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
        }}
      />
    </>
  )
}
