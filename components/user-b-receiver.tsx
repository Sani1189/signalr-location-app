"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Wifi, WifiOff, User, Activity, Clock, Navigation, Target, Home } from "lucide-react"
import { useSignalR } from "@/hooks/use-signalr"
import dynamic from "next/dynamic"
import { DevelopmentNotice } from "./development-notice"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-300">Loading interactive map...</p>
      </div>
    </div>
  ),
})

const SIGNALR_HUB_URL = "https://tech-test.raintor.com/Hub"

export function UserBReceiver() {
  const { isConnected, isConnecting, receivedLocation, connectionError, mockMode, enableMockMode } =
    useSignalR(SIGNALR_HUB_URL)
  const lastUpdateRef = useRef<Date | null>(null)

  // Enhanced place name detection (same as sender)
  const getPlaceName = (lat: number, lon: number): string => {
    // Bangladesh
    if (lat >= 20.5 && lat <= 26.8 && lon >= 88.0 && lon <= 92.8) {
      if (lat >= 23.6 && lat <= 23.9 && lon >= 90.3 && lon <= 90.5) return "Dhaka, Bangladesh 🇧🇩"
      if (lat >= 22.2 && lat <= 22.4 && lon >= 91.7 && lon <= 91.9) return "Chittagong, Bangladesh 🇧🇩"
      if (lat >= 24.8 && lat <= 25.0 && lon >= 89.2 && lon <= 89.4) return "Rangpur, Bangladesh 🇧🇩"
      if (lat >= 24.3 && lat <= 24.4 && lon >= 88.5 && lon <= 88.7) return "Rajshahi, Bangladesh 🇧🇩"
      return "Bangladesh 🇧🇩"
    }

    // India
    if (lat >= 6.0 && lat <= 37.0 && lon >= 68.0 && lon <= 97.0) {
      if (lat >= 28.4 && lat <= 28.9 && lon >= 76.8 && lon <= 77.3) return "New Delhi, India 🇮🇳"
      if (lat >= 19.0 && lat <= 19.3 && lon >= 72.7 && lon <= 73.0) return "Mumbai, India 🇮🇳"
      if (lat >= 12.8 && lat <= 13.1 && lon >= 77.4 && lon <= 77.8) return "Bangalore, India 🇮🇳"
      if (lat >= 22.4 && lat <= 22.7 && lon >= 88.2 && lon <= 88.5) return "Kolkata, India 🇮🇳"
      return "India 🇮🇳"
    }

    // USA
    if (lat >= 24.0 && lat <= 49.0 && lon >= -125.0 && lon <= -66.0) {
      if (lat >= 40.6 && lat <= 40.9 && lon >= -74.1 && lon <= -73.9) return "New York City, USA 🇺🇸"
      if (lat >= 34.0 && lat <= 34.1 && lon >= -118.3 && lon <= -118.2) return "Los Angeles, USA 🇺🇸"
      if (lat >= 41.8 && lat <= 42.0 && lon >= -87.7 && lon <= -87.6) return "Chicago, USA 🇺🇸"
      if (lat >= 37.7 && lat <= 37.8 && lon >= -122.5 && lon <= -122.4) return "San Francisco, USA 🇺🇸"
      return "United States 🇺🇸"
    }

    // UK
    if (lat >= 49.9 && lat <= 60.9 && lon >= -8.2 && lon <= 1.8) {
      if (lat >= 51.4 && lat <= 51.6 && lon >= -0.2 && lon <= 0.1) return "London, UK 🇬🇧"
      if (lat >= 53.4 && lat <= 53.5 && lon >= -2.3 && lon <= -2.2) return "Manchester, UK 🇬🇧"
      return "United Kingdom 🇬🇧"
    }

    // Japan
    if (lat >= 24.0 && lat <= 46.0 && lon >= 123.0 && lon <= 146.0) {
      if (lat >= 35.6 && lat <= 35.7 && lon >= 139.6 && lon <= 139.8) return "Tokyo, Japan 🇯🇵"
      if (lat >= 34.6 && lat <= 34.7 && lon >= 135.4 && lon <= 135.6) return "Osaka, Japan 🇯🇵"
      return "Japan 🇯🇵"
    }

    // Australia
    if (lat >= -44.0 && lat <= -10.0 && lon >= 113.0 && lon <= 154.0) {
      if (lat >= -33.9 && lat <= -33.8 && lon >= 151.1 && lon <= 151.3) return "Sydney, Australia 🇦🇺"
      if (lat >= -37.9 && lat <= -37.7 && lon >= 144.8 && lon <= 145.0) return "Melbourne, Australia 🇦🇺"
      return "Australia 🇦🇺"
    }

    // Canada
    if (lat >= 41.0 && lat <= 84.0 && lon >= -141.0 && lon <= -52.0) {
      if (lat >= 43.6 && lat <= 43.7 && lon >= -79.4 && lon <= -79.3) return "Toronto, Canada 🇨🇦"
      if (lat >= 45.4 && lat <= 45.6 && lon >= -75.8 && lon <= -75.6) return "Ottawa, Canada 🇨🇦"
      return "Canada 🇨🇦"
    }

    // Germany
    if (lat >= 47.0 && lat <= 55.0 && lon >= 5.0 && lon <= 15.0) {
      if (lat >= 52.4 && lat <= 52.6 && lon >= 13.3 && lon <= 13.5) return "Berlin, Germany 🇩🇪"
      return "Germany 🇩🇪"
    }

    // France
    if (lat >= 41.0 && lat <= 51.0 && lon >= -5.0 && lon <= 10.0) {
      if (lat >= 48.8 && lat <= 48.9 && lon >= 2.2 && lon <= 2.4) return "Paris, France 🇫🇷"
      return "France 🇫🇷"
    }

    return `${lat.toFixed(4)}, ${lon.toFixed(4)} 🌍`
  }

  useEffect(() => {
    if (receivedLocation) {
      lastUpdateRef.current = new Date()
    }
  }, [receivedLocation])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }

  const getLocationTypeIcon = () => {
    if (!receivedLocation) return <Target className="h-4 w-4" />

    // Try to determine location type based on movement patterns or timing
    const placeName = getPlaceName(receivedLocation.lat, receivedLocation.lon)
    if (placeName.includes("Bangladesh") && lastUpdateRef.current) {
      const timeSinceUpdate = Date.now() - lastUpdateRef.current.getTime()
      if (timeSinceUpdate < 10000) {
        // Less than 10 seconds ago
        return <Navigation className="h-4 w-4 text-white" />
      }
    }
    return <Target className="h-4 w-4 text-white" />
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-start mb-4">
          <Button asChild variant="outline" className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Activity className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Location Receiver</h1>
          <p className="text-gray-400">Track real-time location updates</p>
        </div>

        {connectionError && !mockMode && (
          <DevelopmentNotice connectionError={connectionError} onEnableMockMode={enableMockMode} showMockMode={true} />
        )}

        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl text-white">
              <MapPin className="h-5 w-5 text-white" />
              Location Dashboard
            </CardTitle>
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {isConnecting ? (
                <Badge variant="secondary" className="animate-pulse bg-gray-800 text-gray-300">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connecting...
                </Badge>
              ) : isConnected ? (
                <Badge className="bg-white text-black border-0">
                  <Wifi className="h-3 w-3 mr-1" />
                  {mockMode ? "Mock Mode" : "Connected"}
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-900 text-red-100">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}

              {receivedLocation && (
                <Badge className="bg-white text-black border-0">
                  <User className="h-3 w-3 mr-1" />
                  {receivedLocation.userName.split("@")[0]}
                </Badge>
              )}

              {lastUpdateRef.current && (
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimeAgo(lastUpdateRef.current)}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {receivedLocation ? (
              <div className="space-y-6">
                {/* Location Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-white" />
                      <div className="font-medium text-white">User</div>
                    </div>
                    <div className="text-gray-300 font-mono text-sm truncate">{receivedLocation.userName}</div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-white" />
                      <div className="font-medium text-white">Latitude</div>
                    </div>
                    <div className="text-gray-300 font-mono text-sm">{receivedLocation.lat.toFixed(6)}</div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-white" />
                      <div className="font-medium text-white">Longitude</div>
                    </div>
                    <div className="text-gray-300 font-mono text-sm">{receivedLocation.lon.toFixed(6)}</div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      {getLocationTypeIcon()}
                      <div className="font-medium text-white">Type</div>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {lastUpdateRef.current && Date.now() - lastUpdateRef.current.getTime() < 10000
                        ? "Live"
                        : "Static"}
                    </div>
                  </div>
                </div>

                {/* Place Information */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-white" />
                    <div className="font-semibold text-white">Location Details</div>
                  </div>
                  <div className="text-lg font-medium text-white mb-1">
                    📍 {getPlaceName(receivedLocation.lat, receivedLocation.lon)}
                  </div>
                  <div className="text-sm text-gray-300 font-mono">
                    Coordinates: {receivedLocation.lat.toFixed(6)}, {receivedLocation.lon.toFixed(6)}
                  </div>
                  {receivedLocation.timestamp && (
                    <div className="text-xs text-gray-400 mt-1">
                      Last updated: {new Date(receivedLocation.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Map Display */}
                <Tabs defaultValue="map" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                    <TabsTrigger
                      value="map"
                      className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Interactive Map
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Location Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="map" className="mt-4">
                    <div className="border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                      <MapComponent location={receivedLocation} />
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-semibold text-white mb-2">Coordinate Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Latitude:</span>
                              <span className="font-mono text-gray-300">{receivedLocation.lat.toFixed(6)}°</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Longitude:</span>
                              <span className="font-mono text-gray-300">{receivedLocation.lon.toFixed(6)}°</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Precision:</span>
                              <span className="text-gray-300">±1 meter</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-semibold text-white mb-2">Location Analysis</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Region:</span>
                              <span className="text-gray-300">
                                {getPlaceName(receivedLocation.lat, receivedLocation.lon).split(",")[1] || "Unknown"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">City/Area:</span>
                              <span className="text-gray-300">
                                {getPlaceName(receivedLocation.lat, receivedLocation.lon).split(",")[0] || "Unknown"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Hemisphere:</span>
                              <span className="text-gray-300">
                                {receivedLocation.lat >= 0 ? "Northern" : "Southern"},{" "}
                                {receivedLocation.lon >= 0 ? "Eastern" : "Western"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-semibold text-white mb-2">Tracking Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">User:</span>
                              <span className="truncate ml-2 text-gray-300">{receivedLocation.userName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <span className="text-white font-medium">Active</span>
                            </div>
                            {lastUpdateRef.current && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Last Update:</span>
                                <span className="text-gray-300">{formatTimeAgo(lastUpdateRef.current)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-semibold text-white mb-2">Connection Status</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Connection:</span>
                              <span className="text-white font-medium">{mockMode ? "Mock Mode" : "Live SignalR"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Protocol:</span>
                              <span className="text-gray-300">WebSocket</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Updates:</span>
                              <span className="text-gray-300">Real-time</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-96 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-gray-700">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 animate-ping">
                      <MapPin className="h-12 w-12 mx-auto opacity-20" />
                    </div>
                    <MapPin className="h-12 w-12 mx-auto opacity-60" />
                  </div>
                  <p className="text-lg font-medium mb-2 text-white">Waiting for location updates...</p>
                  <p className="text-sm">
                    {isConnecting
                      ? "Connecting to SignalR hub..."
                      : isConnected
                        ? "Connected and ready to receive location data"
                        : "Connection failed - retrying..."}
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    The sender will appear here once they start sharing their location
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
