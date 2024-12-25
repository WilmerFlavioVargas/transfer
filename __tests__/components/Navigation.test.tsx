import { render, screen } from '@testing-library/react'
import Navigation from '@/components/Navigation'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signOut: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('Navigation', () => {
  it('renders the logo', () => {
    render(<Navigation />)
    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the search link', () => {
    render(<Navigation />)
    const searchLink = screen.getByText('search')
    expect(searchLink).toBeInTheDocument()
  })

  it('renders the sign in button when user is not authenticated', () => {
    render(<Navigation />)
    const signInButton = screen.getByText('signIn')
    expect(signInButton).toBeInTheDocument()
  })
})

