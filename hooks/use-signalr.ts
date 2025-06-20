"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import * as signalR from "@microsoft/signalr"

export interface LocationData {
  userName: string
  lat: number
  lon: number
  timestamp?: string
}

export interface UseSignalRReturn {
  connection: signalR.HubConnection | null
  isConnected: boolean
  sendLocation: (lat: number, lon: number, userName: string) => Promise<void>
  receivedLocation: LocationData | null
  connectionError: string | null
  isConnecting: boolean
  mockMode: boolean
  enableMockMode: () => void
}

export function useSignalR(hubUrl: string): UseSignalRReturn {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [receivedLocation, setReceivedLocation] = useState<LocationData | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [mockMode, setMockMode] = useState(false)
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const enableMockMode = useCallback(() => {
    setMockMode(true)
    setIsConnected(true)
    setIsConnecting(false)
    setConnectionError(null)
    console.log("Mock mode enabled - simulating SignalR connection")
  }, [])

  useEffect(() => {
    if (mockMode) return

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < 3) {
            return Math.random() * 10000
          } else {
            return null
          }
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build()

    connectionRef.current = newConnection
    setConnection(newConnection)

    const startConnection = async () => {
      setIsConnecting(true)
      setConnectionError(null)

      try {
        console.log("Attempting to connect to SignalR hub:", hubUrl)
        await newConnection.start()
        setIsConnected(true)
        setIsConnecting(false)
        setConnectionError(null)
        console.log("SignalR Connected successfully")

        newConnection.on("ReceiveLatLon", (data: LocationData) => {
          console.log("Received location:", data)
          setReceivedLocation({ ...data, timestamp: new Date().toISOString() })
        })
      } catch (error) {
        console.error("SignalR Connection Error:", error)
        setIsConnecting(false)
        setIsConnected(false)

        let errorMessage = "Connection failed"
        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch")) {
            errorMessage = "Unable to reach the SignalR server. CORS restrictions or server unavailable."
          } else if (error.message.includes("negotiate")) {
            errorMessage = "Failed to negotiate connection with the server."
          } else {
            errorMessage = error.message
          }
        }

        setConnectionError(errorMessage)

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Retrying connection...")
          startConnection()
        }, 5000)
      }
    }

    startConnection()

    newConnection.onclose((error) => {
      setIsConnected(false)
      setIsConnecting(false)
      console.log("SignalR Disconnected", error)
      if (error) {
        setConnectionError(`Connection closed: ${error.message}`)
      }
    })

    newConnection.onreconnecting((error) => {
      setIsConnected(false)
      setIsConnecting(true)
      console.log("SignalR Reconnecting...", error)
      setConnectionError("Reconnecting...")
    })

    newConnection.onreconnected((connectionId) => {
      setIsConnected(true)
      setIsConnecting(false)
      setConnectionError(null)
      console.log("SignalR Reconnected with ID:", connectionId)
    })

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (connectionRef.current) {
        connectionRef.current.stop()
      }
    }
  }, [hubUrl, mockMode])

  const sendLocation = useCallback(
    async (lat: number, lon: number, userName: string) => {
      // Validate coordinates
      if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
        throw new Error("Invalid coordinates provided")
      }

      if (mockMode) {
        // Simulate sending in mock mode with realistic delay
        console.log("Mock mode: Location sent:", { lat, lon, userName })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100))

        // Simulate receiving the same location (for demo purposes)
        setReceivedLocation({
          userName,
          lat,
          lon,
          timestamp: new Date().toISOString(),
        })
        return
      }

      if (connection && isConnected) {
        try {
          await connection.invoke("SendLatLon", lat, lon, userName)
          console.log("Location sent successfully:", { lat, lon, userName })
        } catch (error) {
          console.error("Error sending location:", error)
          // Auto-enable mock mode if sending fails repeatedly
          console.log("Auto-enabling mock mode due to send failure")
          setMockMode(true)
          setIsConnected(true)
          setConnectionError("Switched to mock mode due to connection issues")

          // Retry in mock mode
          setTimeout(() => {
            setReceivedLocation({
              userName,
              lat,
              lon,
              timestamp: new Date().toISOString(),
            })
          }, 100)

          throw new Error(`Failed to send location: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      } else {
        // Auto-enable mock mode if not connected
        console.log("Auto-enabling mock mode - no connection available")
        setMockMode(true)
        setIsConnected(true)
        setConnectionError("Using mock mode - no server connection")

        // Send in mock mode
        setTimeout(() => {
          setReceivedLocation({
            userName,
            lat,
            lon,
            timestamp: new Date().toISOString(),
          })
        }, 100)
      }
    },
    [connection, isConnected, mockMode],
  )

  return {
    connection,
    isConnected,
    sendLocation,
    receivedLocation,
    connectionError,
    isConnecting,
    mockMode,
    enableMockMode,
  }
}
