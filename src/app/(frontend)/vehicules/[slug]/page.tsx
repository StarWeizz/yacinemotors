import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvailabilityBadge } from '@/components/AvailabilityBadge'
import { PriceAmount } from '@/components/PriceAmount'
import { VehicleVisual } from '@/components/VehicleVisual'
import { formatKilometers, formatPrice } from '@/lib/format'
import { findExistingImage } from '@/lib/vehicles/images'
import { getConditions, getVehicleName, isAvailable } from '@/lib/vehicles/presentation'
import { getVehicleBySlug, getVehicles } from '@/lib/vehicles/queries'

type Props = {
  params: Promise<{ slug: string }>
}

/** Rental lengths shown as examples: plain arithmetic on the daily price and included kilometers. */
const EXAMPLE_DAYS = [1, 3, 7] as const

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const vehicle = await getVehicleBySlug((await params).slug)
  if (!vehicle) return { title: 'Véhicule introuvable' }
  const image = findExistingImage((vehicle.images ?? []).map(({ path }) => path))
  return {
    title: `${getVehicleName(vehicle)} ${vehicle.version}`,
    description: `${vehicle.description} ${formatPrice(vehicle.pricePerDay)} par jour, caution ${formatPrice(vehicle.deposit)}.`,
    openGraph: image ? { images: [image] } : undefined,
  }
}

const VehiclePage = async ({ params }: Props) => {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const name = getVehicleName(vehicle)
  const conditions = getConditions(vehicle)
  const equipment = vehicle.equipment ?? []
  const bookable = isAvailable(vehicle) || Boolean(vehicle.unavailableUntil)
  const sameCategory = (await getVehicles())
    .filter((other) => other.category === vehicle.category && other.id !== vehicle.id)
    .slice(0, 3)

  const specs: [string, string][] = [
    ['Catégorie', vehicle.category],
    ['Année', String(vehicle.year)],
    ['Carburant', vehicle.fuel],
    ['Boîte', vehicle.gearbox],
    ['Puissance', `${vehicle.powerHp} ch`],
    ['Transmission', vehicle.drivetrain],
    ['Places', `${vehicle.seats} places`],
    ['Portes', `${vehicle.doors} portes`],
    ['Kilométrage', formatKilometers(vehicle.mileage)],
    ['Couleur', vehicle.color],
    ["Crit'Air", String(vehicle.critAir)],
  ]

  return (
    <div className="container-x section-space">
      <nav aria-label="Fil d'Ariane" className="pt-8 text-sm text-steel">
        <Link href="/vehicules">Catalogue</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{name}</span>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pt-6 pb-10">
        <div>
          <h1 className="mb-2 text-[clamp(2.4rem,1.6rem+3.4vw,4.4rem)] leading-none tracking-[-0.02em]">{name}</h1>
          <p className="m-0 text-xl text-steel">
            {vehicle.version} · {vehicle.year}
          </p>
        </div>
        <AvailabilityBadge vehicle={vehicle} />
      </header>

      <div className="grid items-start gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="flex flex-col gap-12">
          <div className="aspect-[4/3] overflow-hidden bg-pearl lg:aspect-[16/10]">
            <VehicleVisual vehicle={vehicle} />
          </div>

          <section aria-labelledby="presentation">
            <h2 id="presentation" className="mb-3 text-3xl">Présentation</h2>
            <p className="m-0 max-w-[60ch] text-xl leading-relaxed">{vehicle.description}</p>
          </section>

          <section aria-labelledby="caracteristiques">
            <h2 id="caracteristiques" className="mb-6 text-3xl">Caractéristiques</h2>
            <dl className="m-0 grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
                  <dt className="text-steel">{label}</dt>
                  <dd className="m-0 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {equipment.length > 0 && (
            <section aria-labelledby="equipements">
              <h2 id="equipements" className="mb-6 text-3xl">Équipements</h2>
              <ul className="m-0 grid list-none border-t border-ink p-0 sm:grid-cols-2 sm:gap-x-10">
                {equipment.map(({ name: item, id }) => (
                  <li key={id ?? item} className="border-b border-line py-3 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside aria-label="Tarif et réservation" className="flex flex-col gap-6 bg-pearl p-6 lg:sticky lg:top-28">
          <p className="m-0 flex flex-wrap items-baseline gap-2">
            <PriceAmount euros={vehicle.pricePerDay} />
            <span className="text-sm text-steel">par jour</span>
          </p>
          <p className="m-0 text-sm text-steel">
            {formatKilometers(vehicle.includedKmPerDay)} inclus par jour · Caution {formatPrice(vehicle.deposit)}
          </p>

          <table className="w-full border-collapse text-sm">
            <caption className="pb-2 text-left font-semibold">Exemples de durée</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Durée</th>
                <th scope="col">Location</th>
                <th scope="col">Kilomètres inclus</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_DAYS.map((days) => (
                <tr key={days} className="border-t border-line">
                  <th scope="row" className="py-2 text-left font-normal">
                    {days} jour{days > 1 ? 's' : ''}
                  </th>
                  <td className="py-2 text-right">{formatPrice(vehicle.pricePerDay * days)}</td>
                  <td className="py-2 pl-3 text-right text-steel">{formatKilometers(vehicle.includedKmPerDay * days)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {conditions.length > 0 && (
            <ul className="m-0 list-none border-l border-ink py-1 pl-4 text-sm" aria-label="Conditions de location">
              {conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          )}

          {bookable ? (
            <Link
              className="button text-center"
              href={`/vehicules/${encodeURIComponent(vehicle.slug)}/reservation`}
              aria-label={`Demander une réservation : ${name}`}
            >
              Demander une réservation
            </Link>
          ) : (
            <p className="m-0 text-sm">
              Ce véhicule n&apos;est pas disponible actuellement. <Link href="/contact">Contactez-nous</Link> pour
              connaître les prochaines disponibilités.
            </p>
          )}
          <p className="m-0 text-[0.8rem] text-steel">
            Il s&apos;agit d&apos;une demande : elle est confirmée après réponse de l&apos;agence. Les durées
            ci-dessus sont des exemples de calcul, hors options.
          </p>
        </aside>
      </div>

      {sameCategory.length > 0 && (
        <section aria-labelledby="similaires" className="mt-20">
          <h2 id="similaires" className="mb-6 border-t border-ink pt-5 text-3xl">
            Autres véhicules : {vehicle.category}
          </h2>
          <ul className="m-0 grid list-none gap-x-8 p-0 md:grid-cols-3">
            {sameCategory.map((other) => (
              <li key={other.id} className="border-b border-line py-4">
                <Link href={`/vehicules/${encodeURIComponent(other.slug)}`} className="flex items-baseline justify-between gap-4 no-underline">
                  <span className="font-serif text-2xl">{getVehicleName(other)}</span>
                  <span className="text-sm text-steel">{formatPrice(other.pricePerDay)} / jour</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default VehiclePage
