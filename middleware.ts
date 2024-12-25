import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
