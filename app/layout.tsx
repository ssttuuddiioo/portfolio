import type { Metadata } from 'next'
import './globals.css'
import { SmoothScroll } from '@/components/SmoothScroll'

const siteUrl = 'https://www.yopablo.com'
const description = 'Pablo Gnecco — experiential director and creative technologist'
// og:video isn't resolved against metadataBase, so give it the full URL
const shareVideo = `${siteUrl}/og/dance.mp4`

// Link previews (iMessage, Slack, etc.): app/opengraph-image.jpg and app/twitter-image.jpg
// are picked up automatically, plus public/og/dance.mp4 as og:video; metadataBase makes URLs absolute
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'YOPABLO',
  description,
  openGraph: {
    title: 'YOPABLO',
    description,
    url: '/',
    siteName: 'YOPABLO',
    type: 'website',
    // Short loop of the 3D figure dancing; apps that don't play og:video show the image instead
    videos: [{ url: shareVideo, secureUrl: shareVideo, type: 'video/mp4', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YOPABLO',
    description,
  },
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
