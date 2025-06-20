"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Play, Square, Wifi, WifiOff, Zap, Navigation, Target, Map, Send, Home } from "lucide-react"
import { useSignalR } from "@/hooks/use-signalr"
import { DevelopmentNotice } from "./development-notice"
import { LocationMapPicker } from "./location-map-picker"
import Link from "next/link"

const SIGNALR_HUB_URL = "https://tech-test.raintor.com/Hub"

export function UserASender() {
  const [userName, setUserName] = useState("")
  const [currentLat, setCurrentLat] = useState("")
  const [currentLon, setCurrentLon] = useState("")
  const [simulatedLat, setSimulatedLat] = useState("")
  const [simulatedLon, setSimulatedLon] = useState("")
  const [isLiveTracking, setIsLiveTracking] = useState(false)
  const [liveInterval, setLiveInterval] = useState<NodeJS.Timeout | null>(null)
  const [sentCount, setSentCount] = useState(0)
  const [activeTab, setActiveTab] = useState("current")

  const { isConnected, isConnecting, sendLocation, connectionError, mockMode, enableMockMode } =
    useSignalR(SIGNALR_HUB_URL)

  // Enhanced place name detection
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

  // Get current location once
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser")
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const lat = position.coords.latitude
      const lon = position.coords.longitude
      setCurrentLat(lat.toString())
      setCurrentLon(lon.toString())
    } catch (error) {
      console.error("Error getting location:", error)
      alert("Unable to get your current location")
    }
  }

  // Send current location once
  const sendCurrentLocation = async () => {
    if (!userName.trim()) {
      alert("Please enter your email address")
      return
    }

    if (!currentLat || !currentLon) {
      alert("Please get your current location first")
      return
    }

    const lat = Number.parseFloat(currentLat)
    const lon = Number.parseFloat(currentLon)

    try {
      await sendLocation(lat, lon, userName.trim())
      setSentCount((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to send location:", error)
      alert("Failed to send location. Please try again.")
    }
  }

  // Start live location tracking
  const startLiveTracking = async () => {
    if (!userName.trim()) {
      alert("Please enter your email address")
      return
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser")
      return
    }

    setIsLiveTracking(true)
    setSentCount(0)

    // Send initial location
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const lat = position.coords.latitude
      const lon = position.coords.longitude
      setCurrentLat(lat.toString())
      setCurrentLon(lon.toString())

      await sendLocation(lat, lon, userName.trim())
      setSentCount(1)
    } catch (error) {
      console.error("Failed to get initial location:", error)
    }

    // Set up interval to get and send location every 5 seconds
    const interval = setInterval(async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          })
        })

        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setCurrentLat(lat.toString())
        setCurrentLon(lon.toString())

        await sendLocation(lat, lon, userName.trim())
        setSentCount((prev) => prev + 1)
      } catch (error) {
        console.error("Failed to get/send live location:", error)
      }
    }, 5000) // Every 5 seconds

    setLiveInterval(interval)
  }

  // Stop live tracking
  const stopLiveTracking = () => {
    setIsLiveTracking(false)
    if (liveInterval) {
      clearInterval(liveInterval)
      setLiveInterval(null)
    }
  }

  // Send simulated location once
  const sendSimulatedLocation = async () => {
    if (!userName.trim()) {
      alert("Please enter your email address")
      return
    }

    if (!simulatedLat || !simulatedLon) {
      alert("Please select or enter simulation coordinates")
      return
    }

    const lat = Number.parseFloat(simulatedLat)
    const lon = Number.parseFloat(simulatedLon)

    if (isNaN(lat) || isNaN(lon)) {
      alert("Please enter valid coordinates")
      return
    }

    try {
      await sendLocation(lat, lon, userName.trim())
      setSentCount((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to send simulated location:", error)
      alert("Failed to send location. Please try again.")
    }
  }

  // Handle map location selection
  const handleMapLocationSelect = (lat: number, lon: number) => {
    setSimulatedLat(lat.toString())
    setSimulatedLon(lon.toString())
  }

  useEffect(() => {
    return () => {
      if (liveInterval) clearInterval(liveInterval)
    }
  }, [liveInterval])

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto max-w-lg">
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
            <Navigation className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Location Sender</h1>
          <p className="text-gray-400">Choose your location sharing method</p>
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
            <div className="flex items-center justify-center gap-3 mt-4">
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

              {isLiveTracking && (
                <Badge className="bg-white text-black border-0 animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  Live ({sentCount})
                </Badge>
              )}

              {sentCount > 0 && !isLiveTracking && (
                <Badge className="bg-white text-black border-0">
                  <Send className="h-3 w-3 mr-1" />
                  Sent ({sentCount})
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-sm font-medium text-gray-300">
                Email Address
              </Label>
              <Input
                id="userName"
                type="email"
                placeholder="your.email@example.com"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isLiveTracking}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-white focus:ring-white/20"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                <TabsTrigger
                  value="current"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-black text-gray-300"
                >
                  <Target className="h-3 w-3 mr-1" />
                  Current
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-black text-gray-300"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Live
                </TabsTrigger>
                <TabsTrigger
                  value="simulated"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-black text-gray-300"
                >
                  <Map className="h-3 w-3 mr-1" />
                  Simulated
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Target className="h-8 w-8 mx-auto mb-2 text-white" />
                  <h3 className="font-semibold text-white mb-1">Current Location</h3>
                  <p className="text-sm text-gray-400 mb-3">Send your exact current GPS location once</p>

                  {currentLat && currentLon && (
                    <div className="mb-3 p-2 bg-gray-700 rounded border border-gray-600">
                      <div className="text-xs font-mono text-gray-300">
                        {Number.parseFloat(currentLat).toFixed(6)}, {Number.parseFloat(currentLon).toFixed(6)}
                      </div>
                      <div className="text-sm font-medium text-white">
                        📍 {getPlaceName(Number.parseFloat(currentLat), Number.parseFloat(currentLon))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={getCurrentLocation}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      disabled={isLiveTracking}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Current Location
                    </Button>
                    <Button
                      onClick={sendCurrentLocation}
                      disabled={!isConnected || !currentLat || !currentLon || isLiveTracking}
                      className="w-full bg-white text-black hover:bg-gray-200 border-0"
                    >
                      Send Current Location
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="live" className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Navigation className="h-8 w-8 mx-auto mb-2 text-white" />
                  <h3 className="font-semibold text-white mb-1">Live Location Tracking</h3>
                  <p className="text-sm text-gray-400 mb-3">Continuously send your real GPS location every 5 seconds</p>

                  {currentLat && currentLon && (
                    <div className="mb-3 p-2 bg-gray-700 rounded border border-gray-600">
                      <div className="text-xs font-mono text-gray-300">
                        {Number.parseFloat(currentLat).toFixed(6)}, {Number.parseFloat(currentLon).toFixed(6)}
                      </div>
                      <div className="text-sm font-medium text-white">
                        📍 {getPlaceName(Number.parseFloat(currentLat), Number.parseFloat(currentLon))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {!isLiveTracking ? (
                      <Button
                        onClick={startLiveTracking}
                        disabled={!isConnected}
                        className="w-full bg-white text-black hover:bg-gray-200 border-0"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Live Tracking
                      </Button>
                    ) : (
                      <Button
                        onClick={stopLiveTracking}
                        className="w-full bg-red-900 text-red-100 hover:bg-red-800 border-0"
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Stop Live Tracking
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="simulated" className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-center mb-4">
                    <Map className="h-8 w-8 mx-auto mb-2 text-white" />
                    <h3 className="font-semibold text-white mb-1">Simulated Location</h3>
                    <p className="text-sm text-gray-400">Select a location on the map or enter coordinates manually</p>
                  </div>

                  <div className="space-y-4">
                    <LocationMapPicker
                      onLocationSelect={handleMapLocationSelect}
                      initialLat={simulatedLat ? Number.parseFloat(simulatedLat) : 23.8103}
                      initialLon={simulatedLon ? Number.parseFloat(simulatedLon) : 90.4125}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-300">Latitude</Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder="23.8103"
                          value={simulatedLat}
                          onChange={(e) => setSimulatedLat(e.target.value)}
                          disabled={isLiveTracking}
                          className="text-sm bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Longitude</Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder="90.4125"
                          value={simulatedLon}
                          onChange={(e) => setSimulatedLon(e.target.value)}
                          disabled={isLiveTracking}
                          className="text-sm bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {simulatedLat && simulatedLon && (
                      <div className="p-2 bg-gray-700 rounded border border-gray-600">
                        <div className="text-xs font-mono text-gray-300">
                          {Number.parseFloat(simulatedLat).toFixed(6)}, {Number.parseFloat(simulatedLon).toFixed(6)}
                        </div>
                        <div className="text-sm font-medium text-white">
                          📍 {getPlaceName(Number.parseFloat(simulatedLat), Number.parseFloat(simulatedLon))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={sendSimulatedLocation}
                      disabled={!isConnected || !simulatedLat || !simulatedLon || isLiveTracking}
                      className="w-full bg-white text-black hover:bg-gray-200 border-0"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Simulated Location
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
