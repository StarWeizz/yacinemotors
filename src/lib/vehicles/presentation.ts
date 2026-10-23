import type { Vehicle } from '@/payload-types'
import { formatDate } from '@/lib/format'

type Conditions = Pick<Vehicle, 'minimumAge' | 'minimumLicenseYears'>
type Availability = Pick<Vehicle, 'available' | 'unavailableUntil'>

/** Driver requirements shown to the customer, e.g. "Conducteur de 25 ans minimum". */
export const getConditions = ({ minimumAge, minimumLicenseYears }: Conditions): string[] => {
  const conditions: string[] = []
  if (minimumAge) conditions.push(`Conducteur de ${minimumAge} ans minimum`)
  if (minimumLicenseYears) conditions.push(`${minimumLicenseYears} ans de permis minimum`)
  return conditions
}

export const getAvailabilityLabel = ({ available, unavailableUntil }: Availability): string => {
  if (available) return 'Disponible'
  return unavailableUntil
    ? `Indisponible jusqu'au ${formatDate(unavailableUntil)}`
    : 'Indisponible'
}

export const getVehicleName = ({ brand, model }: Pick<Vehicle, 'brand' | 'model'>): string =>
  `${brand} ${model}`

/** One available vehicle per category (catalog order), up to `limit`, to feature on the home page. */
export const pickFeatured = (vehicles: readonly Vehicle[], limit: number): Vehicle[] => {
  const seen = new Set<string>()
  const featured: Vehicle[] = []
  for (const vehicle of vehicles) {
    if (!vehicle.available || seen.has(vehicle.category)) continue
    seen.add(vehicle.category)
    featured.push(vehicle)
    if (featured.length === limit) break
  }
  return featured
}
