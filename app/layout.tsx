import type { Metadata } from 'next'
import './globals.css'
import { SmoothScroll } from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: 'YOPABLO',
  description: 'Pablo Gnecco — experiential director and creative technologist',
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
