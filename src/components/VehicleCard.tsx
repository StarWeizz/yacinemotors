import type { Vehicle } from '@/payload-types'
import { formatKilometers, formatPrice } from '@/lib/format'
import { getAvailabilityLabel, getConditions, getVehicleName } from '@/lib/vehicles/presentation'
import { VehicleVisual } from './VehicleVisual'

type VehicleCardProps = {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const conditions = getConditions(vehicle)
  const equipment = vehicle.equipment ?? []

  return (
    <article className="card">
      <div className="card__visual">
        <VehicleVisual vehicle={vehicle} />
      </div>
      <div className="card__body">
        <div className="card__top">
          <div>
            <h3 className="card__title">{getVehicleName(vehicle)}</h3>
            <p className="card__version">
              {vehicle.version} · {vehicle.year}
            </p>
          </div>
          <span className={`badge ${vehicle.available ? 'badge--ok' : 'badge--off'}`}>
            {getAvailabilityLabel(vehicle)}
          </span>
        </div>

        <dl className="specs">
          <div>
            <dt>Catégorie</dt>
            <dd>{vehicle.category}</dd>
          </div>
          <div>
            <dt>Carburant</dt>
            <dd>{vehicle.fuel}</dd>
          </div>
          <div>
            <dt>Boîte</dt>
            <dd>{vehicle.gearbox}</dd>
          </div>
          <div>
            <dt>Puissance</dt>
            <dd>
              {vehicle.powerHp} ch · {vehicle.drivetrain}
            </dd>
          </div>
          <div>
            <dt>Places / portes</dt>
            <dd>
              {vehicle.seats} places · {vehicle.doors} portes
            </dd>
          </div>
          <div>
            <dt>Kilométrage</dt>
            <dd>{formatKilometers(vehicle.mileage)}</dd>
          </div>
          <div>
            <dt>Couleur</dt>
            <dd>{vehicle.color}</dd>
          </div>
          <div>
            <dt>Crit&apos;Air</dt>
            <dd>{vehicle.critAir}</dd>
          </div>
        </dl>

        {equipment.length > 0 && (
          <ul className="chips" aria-label="Équipements">
            {equipment.map(({ name, id }) => (
              <li key={id ?? name}>{name}</li>
            ))}
          </ul>
        )}

        {conditions.length > 0 && (
          <ul className="conditions" aria-label="Conditions de location">
            {conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        )}

        <p className="price">
          <strong>{formatPrice(vehicle.pricePerDay)}</strong>
          <small>/ jour</small>
        </p>
        <p className="terms">
          {formatKilometers(vehicle.includedKmPerDay)} inclus par jour · Caution{' '}
          {formatPrice(vehicle.deposit)}
        </p>
      </div>
    </article>
  )
}
