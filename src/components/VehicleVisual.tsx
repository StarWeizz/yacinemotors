import type { Vehicle } from '@/payload-types'
import { findExistingImage } from '@/lib/vehicles/images'
import { getVehicleName } from '@/lib/vehicles/presentation'

type VehicleVisualProps = {
  vehicle: Vehicle
}

/** Shows the vehicle photo when the file exists, otherwise a branded placeholder. */
export function VehicleVisual({ vehicle }: VehicleVisualProps) {
  const name = getVehicleName(vehicle)
  const image = findExistingImage((vehicle.images ?? []).map(({ path }) => path))

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- dimensions are unknown; file is local
    return <img src={image} alt={name} loading="lazy" />
  }

  return (
    <svg viewBox="0 0 320 180" role="img" aria-label={`Visuel à venir : ${name}`}>
      <defs>
        <linearGradient id={`g-${vehicle.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#262c3a" />
          <stop offset="1" stopColor="#14171e" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#g-${vehicle.id})`} />
      <text x="160" y="88" textAnchor="middle" fill="#f5b83d" fontSize="30" fontWeight="800">
        {vehicle.brand}
      </text>
      <text x="160" y="118" textAnchor="middle" fill="#a9b1c0" fontSize="16">
        {vehicle.model}
      </text>
      <text x="160" y="150" textAnchor="middle" fill="#6b7385" fontSize="11">
        Photo bientôt disponible
      </text>
    </svg>
  )
}
