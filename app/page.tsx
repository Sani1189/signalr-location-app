import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Send, Eye, Zap, Globe, Users, ArrowRight, Smartphone, Wifi, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <title>LiveLocation Share</title>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-black/50"></div>
          <div className="relative container mx-auto py-20 px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-8 shadow-2xl">
                <Globe className="h-12 w-12 text-black" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">LiveLocation Share</h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Real-time location sharing with WebSocket technology
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <Zap className="h-4 w-4 text-white" />
                  Real-time
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <Users className="h-4 w-4 text-white" />
                  Multi-user
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <Shield className="h-4 w-4 text-white" />
                  Secure
                </div>
              </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
              <Card className="group relative overflow-hidden bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 shadow-2xl">
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 mx-auto shadow-lg group-hover:shadow-white/25 transition-shadow duration-300">
                    <Send className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-3xl text-white mb-4">Send Location</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Share your location with precision and control
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <Smartphone className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Current GPS</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <Wifi className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Live Track</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <MapPin className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Map Select</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <Globe className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Global</div>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-white text-black hover:bg-gray-200 border-0 h-14 text-lg font-semibold shadow-lg transition-all duration-300"
                    >
                      <Link href="/sender" className="flex items-center justify-center gap-2">
                        Start Sending
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 shadow-2xl">
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 mx-auto shadow-lg group-hover:shadow-white/25 transition-shadow duration-300">
                    <Eye className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-3xl text-white mb-4">Receive Location</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Track locations with interactive maps
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <MapPin className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Live Maps</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <Zap className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Real-time</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <Users className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">User Track</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <Globe className="h-6 w-6 text-white mb-2" />
                        <div className="text-sm text-gray-300">Places</div>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-white text-black hover:bg-gray-200 border-0 h-14 text-lg font-semibold shadow-lg transition-all duration-300"
                    >
                      <Link href="/receiver" className="flex items-center justify-center gap-2">
                        Start Receiving
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How It Works Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gray-900 border-gray-800 shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl text-white flex items-center justify-center gap-3">
                    <MapPin className="h-8 w-8 text-white" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-white/25 transition-shadow duration-300">
                        1
                      </div>
                      <h3 className="font-semibold text-white text-xl mb-4">Connect</h3>
                      <p className="text-gray-400 leading-relaxed">
                        Secure WebSocket connection with automatic reconnection
                      </p>
                    </div>
                    <div className="text-center group">
                      <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-white/25 transition-shadow duration-300">
                        2
                      </div>
                      <h3 className="font-semibold text-white text-xl mb-4">Share</h3>
                      <p className="text-gray-400 leading-relaxed">
                        Send GPS coordinates via current, live, or simulated locations
                      </p>
                    </div>
                    <div className="text-center group">
                      <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-white/25 transition-shadow duration-300">
                        3
                      </div>
                      <h3 className="font-semibold text-white text-xl mb-4">Track</h3>
                      <p className="text-gray-400 leading-relaxed">
                        View real-time updates on interactive maps with place detection
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 bg-gray-900/50">
          <div className="container mx-auto py-8 px-4">
            <div className="text-center text-gray-400">
              <p className="mb-2">Built with Next.js, SignalR, and Leaflet</p>
              <p className="text-sm">Real-time location sharing</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
