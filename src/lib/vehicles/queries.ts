import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Agency, Vehicle } from '@/payload-types'

// `cache` shares the result between the layout and the page within one request (one query, not two).
export const getAgency = cache(async (): Promise<Agency> => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'agency' })
})

/** All vehicles in the order of the source catalog. */
export const getVehicles = cache(async (): Promise<Vehicle[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'vehicles',
    sort: 'sourceId',
    limit: 100,
    depth: 0,
    pagination: false,
  })
  return docs
})

export const getVehicleBySlug = async (slug: string): Promise<Vehicle | null> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'vehicles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0] ?? null
}
