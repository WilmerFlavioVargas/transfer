import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { Toaster } from "@/components/ui/toaster"
import RealTimeNotifications from '../components/RealTimeNotifications'
import { getMessages } from '@/lib/getMessages'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Transfer Booking App',
  description: 'Book your point-to-point transfers easily',
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages;
  try {
    messages = await getMessages(locale);
  } catch (error) {
    // Instead of using notFound(), we'll fall back to a default locale
    messages = await getMessages('en'); // Fallback to English
    console.error(`Failed to load messages for locale ${locale}, falling back to default locale`);
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="min-h-screen bg-gray-100">
            {children}
          </main>
          <Toaster />
          <RealTimeNotifications />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

