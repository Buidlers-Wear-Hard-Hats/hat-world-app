import type { Metadata } from 'next'
import './globals.css'
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Navbar } from '@/components/navbar'

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
      <MiniKitProvider>
      <body>
        <main className="pb-16">
          {children}
        </main>
        <Navbar />
      </body>
      </MiniKitProvider>
    </html>
  )
}
