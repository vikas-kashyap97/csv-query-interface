import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import SupabaseProvider from '@/components/supabase-provider'
import { Navigation } from '@/components/navigation'
import { AnimatePresence } from 'framer-motion'
import { UserHeader } from '@/components/user-header'
import './globals.css'

const fontSans = GeistSans
const fontMono = GeistMono

export const metadata = {
  title: 'CSV Query App',
  description: 'Upload and query CSV files using natural language',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="csv-query-theme"
        >
          <SupabaseProvider>
            <div className="flex h-screen">
              <Navigation />
              <main className="flex-1 overflow-auto">
                <UserHeader />
                <AnimatePresence mode="wait">
                  {children}
                </AnimatePresence>
              </main>
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

