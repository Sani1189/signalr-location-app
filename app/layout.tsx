import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LiveLocation',
  description: 'Real-time location sharing app using SignalR and Next.js',
  icons: {
    icon: 'https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
