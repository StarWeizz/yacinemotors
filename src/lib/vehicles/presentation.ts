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
