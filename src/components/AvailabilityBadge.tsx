import type { Vehicle } from '@/payload-types'
import { getAvailabilityLabel } from '@/lib/vehicles/presentation'

type AvailabilityBadgeProps = {
  vehicle: Pick<Vehicle, 'available' | 'unavailableUntil'>
}

/** Filled dot = available, hollow ring = unavailable: the state never depends on color alone. */
export function AvailabilityBadge({ vehicle }: AvailabilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-right text-[0.8rem] leading-snug ${vehicle.available ? 'text-ink' : 'text-steel'}`}
    >
      <span
        aria-hidden="true"
        className={`size-[0.55rem] flex-none rounded-full border border-ink ${vehicle.available ? 'bg-ink' : 'bg-transparent'}`}
      />
      {getAvailabilityLabel(vehicle)}
    </span>
  )
}
