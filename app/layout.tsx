import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Unreal Engine Helper Tools',
  description: 'Essential utilities for Unreal Engine developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
