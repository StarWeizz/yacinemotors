import type { MetadataRoute } from 'next'
import { buildSitemap, getSiteUrl } from '@/lib/seo'
import { getVehicles } from '@/lib/vehicles/queries'

// Reads the catalog: built per request, never at build time (the build has no database).
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(await getVehicles(), getSiteUrl())
}
