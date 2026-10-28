import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Content Security Policy for the public site (ADR-0028). A fresh nonce per request lets Next.js
 * and the page's one inline script run while everything else inline is refused; `strict-dynamic`
 * then trusts only scripts loaded by those. The Payload admin (`/admin`) and the API are not
 * matched: the admin has its own needs and a looser policy there would only weaken this one.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  // The contact page is the only one allowed to embed a frame (the Google Maps map, ADR-0029).
  const frameSrc =
    request.nextUrl.pathname === '/contact' ? 'https://maps.google.com https://www.google.com' : "'none'"

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    `frame-src ${frameSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // `upgrade-insecure-requests` is left out on purpose: it breaks plain-HTTP local use.
    // Add it together with HSTS once the site is served over HTTPS.
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|admin|_next/static|_next/image|images|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
