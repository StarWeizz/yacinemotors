import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: {
    // Throttle password guessing and keep the session token out of API responses, so a script
    // injected into a page could not read it (the cookie stays HttpOnly). ADR-0028.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    removeTokenFromResponses: true,
    cookies: {
      sameSite: 'Strict',
      secure: (process.env.SITE_URL ?? '').startsWith('https://'),
    },
  },
  fields: [],
}
