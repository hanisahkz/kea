import { fontInter } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Nurul's Portfolio`,
  description: `Nurul's Portfolio`,
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className={cn(
            `${fontInter.className} theme-violet`
          )}>{children}</body>
      </html>
    )
  }