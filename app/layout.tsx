import './globals.css'
import { Inter } from 'next/font/google'
import { VibeProvider } from '../hooks/useVibe'
import { ThemeProvider } from '../hooks/useTheme'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FeetCode - Coding Practice with Personality',
  description: 'Master algorithms and data structures with customizable vibes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <VibeProvider>
            {children}
          </VibeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}