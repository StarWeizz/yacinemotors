import type { MetadataRoute } from 'next'
import type { Vehicle } from '@/payload-types'

/** Public address of the site, without a trailing slash (`SITE_URL`, see .env.example). */
export const getSiteUrl = (): string => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

type SitemapPage = { path: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }

/** Pages that exist whatever the catalog holds. The reservation forms are left out on purpose. */
const STATIC_PAGES: readonly SitemapPage[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/vehicules', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/mentions-legales', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/confidentialite', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/credits-photos', changeFrequency: 'yearly', priority: 0.1 },
]

export const buildSitemap = (
  vehicles: readonly Pick<Vehicle, 'slug' | 'updatedAt'>[],
  baseUrl: string,
): MetadataRoute.Sitemap => [
  ...STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path === '/' ? '' : path}`,
    changeFrequency,
    priority,
  })),
  ...vehicles.map((vehicle) => ({
    url: `${baseUrl}/vehicules/${encodeURIComponent(vehicle.slug)}`,
    lastModified: vehicle.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })),
]
