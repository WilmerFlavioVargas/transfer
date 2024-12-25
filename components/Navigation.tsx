'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User } from 'lucide-react'

export default function Navigation() {
  const t = useTranslations('Navigation')
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" aria-label="Home">
              <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/search" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              {t('search')}
            </Link>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" aria-hidden="true" />
                    <span>{session.user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">{t('profile')}</Link>
                  </DropdownMenuItem>
                  {session.user?.role === 'admin' && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="w-full">{t('adminPanel')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => signOut()}>
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost">{t('signIn')}</Button>
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/search" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              {t('search')}
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                  {t('profile')}
                </Link>
                {session.user?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                    {t('adminPanel')}
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

