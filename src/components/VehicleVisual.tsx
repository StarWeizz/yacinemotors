import type { Vehicle } from '@/payload-types'
import { findExistingImage } from '@/lib/vehicles/images'
import { getVehicleName } from '@/lib/vehicles/presentation'

type VehicleVisualProps = {
  vehicle: Vehicle
}

const ZOOM = 'size-full object-cover transition-transform duration-1000 ease-lux group-hover:scale-[1.035]'

/** Shows the vehicle photo when the file exists, otherwise a typographic plate (never a fake photo). */
export function VehicleVisual({ vehicle }: VehicleVisualProps) {
  const name = getVehicleName(vehicle)
  const image = findExistingImage((vehicle.images ?? []).map(({ path }) => path))

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- dimensions are unknown; file is local
    return <img src={image} alt={name} loading="lazy" className={ZOOM} />
  }

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Visuel à venir : ${name}`} className={ZOOM}>
      <rect width="400" height="300" className="fill-pearl" />
      <rect x="16.5" y="16.5" width="367" height="267" className="fill-none stroke-line" />
      <text x="32" y="150" className="fill-ink font-serif text-[54px] tracking-tight">
        {vehicle.brand}
      </text>
      <text x="32" y="184" className="fill-steel font-sans text-lg">
        {vehicle.model}
      </text>
      <text x="32" y="264" className="fill-steel font-sans text-xs">
        Photo à venir
      </text>
    </svg>
  )
}
