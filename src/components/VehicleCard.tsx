import Link from 'next/link'
import type { Vehicle } from '@/payload-types'
import { formatKilometers, formatPrice } from '@/lib/format'
import { getConditions, getVehicleName, isAvailable } from '@/lib/vehicles/presentation'
import { AvailabilityBadge } from './AvailabilityBadge'
import { PriceAmount } from './PriceAmount'
import { VehicleVisual } from './VehicleVisual'

type VehicleCardProps = {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const conditions = getConditions(vehicle)
  const equipment = vehicle.equipment ?? []
  const detailHref = `/vehicules/${encodeURIComponent(vehicle.slug)}`

  return (
    <article className="group flex h-full flex-col border-t border-ink">
      <Link
        href={detailHref}
        aria-hidden="true"
        tabIndex={-1}
        className="mt-[1.1rem] block aspect-[4/3] overflow-hidden bg-pearl"
      >
        <VehicleVisual vehicle={vehicle} />
      </Link>
      <div className="flex flex-1 flex-col gap-[1.1rem] pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="m-0 text-3xl">
              <Link href={detailHref} className="no-underline hover:underline">
                {getVehicleName(vehicle)}
              </Link>
            </h3>
            <p className="mt-1 mb-0 text-sm text-steel">
              {vehicle.version} · {vehicle.year}
            </p>
          </div>
          <AvailabilityBadge vehicle={vehicle} />
        </div>

        <dl className="m-0 grid grid-cols-2 gap-x-6 text-sm">
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Catégorie</dt>
            <dd className="m-0">{vehicle.category}</dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Carburant</dt>
            <dd className="m-0">{vehicle.fuel}</dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Boîte</dt>
            <dd className="m-0">{vehicle.gearbox}</dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Puissance</dt>
            <dd className="m-0">
              {vehicle.powerHp} ch · {vehicle.drivetrain}
            </dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Places / portes</dt>
            <dd className="m-0">
              {vehicle.seats} places · {vehicle.doors} portes
            </dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Kilométrage</dt>
            <dd className="m-0">{formatKilometers(vehicle.mileage)}</dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Couleur</dt>
            <dd className="m-0">{vehicle.color}</dd>
          </div>
          <div className="border-t border-mist py-2">
            <dt className="text-[0.78rem] text-steel">Crit&apos;Air</dt>
            <dd className="m-0">{vehicle.critAir}</dd>
          </div>
        </dl>

        {equipment.length > 0 && (
          <ul className="m-0 list-none p-0 text-sm text-steel" aria-label="Équipements">
            {equipment.map(({ name, id }) => (
              <li key={id ?? name} className="inline not-last:after:content-[',_']">
                {name}
              </li>
            ))}
          </ul>
        )}

        {conditions.length > 0 && (
          <ul className="m-0 list-none border-l border-ink py-3 pl-4 text-sm" aria-label="Conditions de location">
            {conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        )}

        <p className="mt-auto mb-0 flex flex-wrap items-baseline gap-2 pt-2">
          <PriceAmount euros={vehicle.pricePerDay} />
          <small className="text-sm text-steel">/ jour</small>
        </p>
        <p className="m-0 text-sm text-steel">
          {formatKilometers(vehicle.includedKmPerDay)} inclus par jour · Caution{' '}
          {formatPrice(vehicle.deposit)}
        </p>
        {(isAvailable(vehicle) || vehicle.unavailableUntil) && (
          <Link
            className="button self-start"
            href={`/vehicules/${encodeURIComponent(vehicle.slug)}/reservation`}
            aria-label={`Demander une réservation : ${getVehicleName(vehicle)}`}
          >
            Demander une réservation
          </Link>
        )}
      </div>
    </article>
  )
}
