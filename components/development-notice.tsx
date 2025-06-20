"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink, Zap } from "lucide-react"
import { useState } from "react"

interface DevelopmentNoticeProps {
  connectionError: string | null
  onEnableMockMode?: () => void
  showMockMode?: boolean
}

export function DevelopmentNotice({ connectionError, onEnableMockMode, showMockMode }: DevelopmentNoticeProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || !connectionError) return null

  return (
    <Alert className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 font-semibold">Connection Issue Detected</AlertTitle>
      <AlertDescription className="text-orange-700 space-y-4">
        <p className="font-medium">{connectionError}</p>
        <div className="text-sm space-y-3">
          <div>
            <p className="font-medium mb-1">Common causes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-orange-600">
              <li>CORS restrictions from the SignalR server</li>
              <li>Server is not accessible from your current network</li>
              <li>Firewall or proxy blocking WebSocket connections</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Quick solutions:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-orange-600">
              <li>Enable Mock Mode to test the application locally</li>
              <li>Check if the server URL is accessible</li>
              <li>Try from a different network or device</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 pt-2 flex-wrap">
          {showMockMode && onEnableMockMode && (
            <Button
              onClick={onEnableMockMode}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
            >
              <Zap className="h-3 w-3 mr-1" />
              Enable Mock Mode (Recommended)
            </Button>
          )}
          <Button
            onClick={() => setIsDismissed(true)}
            size="sm"
            variant="ghost"
            className="text-orange-700 hover:bg-orange-100"
          >
            Dismiss
          </Button>
          <Button asChild size="sm" variant="ghost" className="text-orange-700 hover:bg-orange-100">
            <a
              href="https://tech-test.raintor.com/Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              Test Hub URL <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">💡 Tip: Enable Mock Mode to test the application</p>
          <p className="text-xs text-green-700 mt-1">
            Mock mode simulates the SignalR connection locally, allowing you to test all features including live
            simulation and real-time map updates.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
