import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingForm from '@/components/BookingForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('BookingForm', () => {
  it('renders the form fields', () => {
    render(<BookingForm />)
    
    expect(screen.getByLabelText('pickup')).toBeInTheDocument()
    expect(screen.getByLabelText('dropoff')).toBeInTheDocument()
    expect(screen.getByLabelText('passengers')).toBeInTheDocument()
    expect(screen.getByLabelText('departureDate')).toBeInTheDocument()
    expect(screen.getByLabelText('departureTime')).toBeInTheDocument()
    expect(screen.getByLabelText('roundTrip')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search' })).toBeInTheDocument()
  })

  it('shows return date and time fields when round trip is selected', () => {
    render(<BookingForm />)
    
    const roundTripCheckbox = screen.getByLabelText('roundTrip')
    fireEvent.click(roundTripCheckbox)

    expect(screen.getByLabelText('returnDate')).toBeInTheDocument()
    expect(screen.getByLabelText('returnTime')).toBeInTheDocument()
  })

  // Add more tests as needed
})

