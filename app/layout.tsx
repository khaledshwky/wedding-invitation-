import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Amelia & Sebastian — November 21, 2026',
  description:
    'Together with their families, Amelia & Sebastian joyfully invite you to celebrate their wedding at The Grand Palace, Cairo.',
  generator: 'v0.app',
  openGraph: {
    title: 'Amelia & Sebastian — You are invited',
    description: 'Saturday, the twenty-first of November, 2026 · The Grand Palace, Cairo',
    images: ['/images/hero.webp'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.webp', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.webp', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.webp',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f3eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
