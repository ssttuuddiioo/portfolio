import type { Metadata } from 'next'
import './globals.css'
import { SmoothScroll } from '@/components/SmoothScroll'

const description = 'Pablo Gnecco — experiential director and creative technologist'

// Link previews (iMessage, Slack, etc.): app/opengraph-image.jpg and app/twitter-image.jpg
// are picked up automatically; metadataBase makes their URLs absolute
export const metadata: Metadata = {
  metadataBase: new URL('https://www.yopablo.com'),
  title: 'YOPABLO',
  description,
  openGraph: {
    title: 'YOPABLO',
    description,
    url: '/',
    siteName: 'YOPABLO',
    type: 'website',
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
