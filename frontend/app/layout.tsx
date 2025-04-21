import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hat App',
  description: 'Hat Token App',
  generator: 'Open Web Academy',
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
