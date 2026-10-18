import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SmoothScroll } from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: 'YOPABLO',
  description: 'Pablo Gnecco — experiential director and creative technologist',
}

// Android Chrome: shrink the page to fit above the on-screen keyboard instead of covering it
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
