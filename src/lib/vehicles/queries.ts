import config from '@payload-config'
import { getPayload } from 'payload'
import type { Agency, Vehicle } from '@/payload-types'

export const getAgency = async (): Promise<Agency> => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'agency' })
}

/** All vehicles in the order of the source catalog. */
export const getVehicles = async (): Promise<Vehicle[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'vehicles',
    sort: 'sourceId',
    limit: 100,
    depth: 0,
    pagination: false,
  })
  return docs
}
