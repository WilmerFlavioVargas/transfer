import { Suspense, lazy } from 'react'
import BookingForm from '../components/BookingForm'
import Navigation from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const FeaturedDestinations = lazy(() => import('../components/FeaturedDestinations'))
const Testimonials = lazy(() => import('../components/Testimonials'))

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 bg-gradient-to-r from-blue-500 to-purple-600">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to Transfer Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingForm />
            <Suspense fallback={<div>Loading featured destinations...</div>}>
              <FeaturedDestinations />
            </Suspense>
            <Suspense fallback={<div>Loading testimonials...</div>}>
              <Testimonials />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

