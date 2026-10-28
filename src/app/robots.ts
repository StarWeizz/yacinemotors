import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Back office, API and the per-vehicle request forms have nothing to index.
        disallow: ['/admin', '/api/', '/vehicules/*/reservation'],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
