import Link from 'next/link'
import { HeroTitle } from '@/components/HeroTitle'
import { PriceAmount } from '@/components/PriceAmount'
import { Reveal } from '@/components/Reveal'
import { VehicleCard } from '@/components/VehicleCard'
import { formatKilometers, formatPrice } from '@/lib/format'
import { getVehicleName, pickFeatured } from '@/lib/vehicles/presentation'
import { getAgency, getVehicles } from '@/lib/vehicles/queries'

const range = (values: number[], format: (value: number) => string): string => {
  const low = Math.min(...values)
  const high = Math.max(...values)
  return low === high ? format(low) : `de ${format(low)} à ${format(high)}`
}

const HomePage = async () => {
  const [agency, vehicles] = await Promise.all([getAgency(), getVehicles()])
  const featured = pickFeatured(vehicles, 3)
  const mostPowerful = vehicles
    .filter((vehicle) => vehicle.available)
    .sort((a, b) => b.powerHp - a.powerHp)[0]

  return (
    <>
      <section className="on-dark relative isolate flex min-h-svh items-center overflow-hidden bg-ink pt-32 pb-20 text-paper">
        {/* Décor : la route des Crêtes entre Cassis et La Ciotat, assombrie pour garder le texte lisible. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- fond plein écran, fichier local */}
        <img
          src="/images/hero-route-des-cretes.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover object-[65%_center]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />
        <div className="container-x grid grid-cols-1 items-end gap-x-8 gap-y-12 min-[960px]:grid-cols-12">
          <div className="min-[960px]:col-span-7">
            <HeroTitle text={`Le bon véhicule, au départ de ${agency.city}.`} />
            <p className="max-w-[46ch] text-xl leading-normal text-paper/85">
              Citadines, compactes, SUV et sportives : des véhicules récents, des prix par jour
              clairs, la caution et les kilomètres inclus affichés avant de demander quoi que ce
              soit.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="button button-light" href="/vehicules">
                Parcourir le catalogue
              </Link>
              <Link className="button button-ghost-light" href="/contact">
                Nous contacter
              </Link>
            </div>
          </div>

          {mostPowerful && (
            <aside className="on-dark flex flex-col gap-5 bg-ink p-[clamp(1.5rem,3vw,2.25rem)] text-paper min-[960px]:col-span-4 min-[960px]:col-start-9" aria-label="Véhicule le plus puissant disponible">
              <p className="m-0 text-sm text-steel-light">Le plus puissant disponible</p>
              <div>
                <p className="m-0 font-serif text-4xl leading-[1.02] font-medium">{getVehicleName(mostPowerful)}</p>
                <p className="mt-1.5 mb-0 text-sm text-steel-light">{mostPowerful.version}</p>
              </div>
              <dl className="m-0 border-t border-graphite">
                <div className="flex justify-between gap-4 border-b border-graphite py-3 text-sm">
                  <dt className="text-steel-light">Puissance</dt>
                  <dd className="m-0 text-right">{mostPowerful.powerHp} ch</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-graphite py-3 text-sm">
                  <dt className="text-steel-light">Transmission</dt>
                  <dd className="m-0 text-right">{mostPowerful.drivetrain}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-graphite py-3 text-sm">
                  <dt className="text-steel-light">Boîte</dt>
                  <dd className="m-0 text-right">{mostPowerful.gearbox}</dd>
                </div>
              </dl>
              <p className="m-0 flex items-baseline gap-2">
                <PriceAmount euros={mostPowerful.pricePerDay} />
                <span className="text-sm text-steel-light">par jour</span>
              </p>
              <Link
                className="button button-light self-start"
                href={`/vehicules/${encodeURIComponent(mostPowerful.slug)}/reservation`}
                aria-label={`Demander une réservation : ${getVehicleName(mostPowerful)}`}
              >
                Demander une réservation
              </Link>
            </aside>
          )}
        </div>
      </section>

      {vehicles.length > 0 && (
        <Reveal>
          <section className="section-space" aria-labelledby="annonce">
            <div className="container-x">
              <div className="mb-[clamp(1.75rem,4vw,3rem)] flex flex-wrap items-end justify-between gap-4 border-t border-ink pt-5">
                <h2 id="annonce" className="m-0">Tout est annoncé avant la demande</h2>
              </div>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-10 p-0">
                <li data-reveal className="border-t border-line pt-4">
                  <h3 className="mb-2 text-2xl">Le prix</h3>
                  <p className="m-0 max-w-[34ch] text-steel">
                    <strong className="font-semibold text-ink">{range(vehicles.map((v) => v.pricePerDay), formatPrice)}</strong> par
                    jour selon le véhicule, sans supplément caché dans l&apos;annonce.
                  </p>
                </li>
                <li data-reveal className="border-t border-line pt-4">
                  <h3 className="mb-2 text-2xl">La caution</h3>
                  <p className="m-0 max-w-[34ch] text-steel">
                    <strong className="font-semibold text-ink">{range(vehicles.map((v) => v.deposit), formatPrice)}</strong>, indiquée
                    sur chaque fiche avant toute demande de réservation.
                  </p>
                </li>
                <li data-reveal className="border-t border-line pt-4">
                  <h3 className="mb-2 text-2xl">Les kilomètres</h3>
                  <p className="m-0 max-w-[34ch] text-steel">
                    <strong className="font-semibold text-ink">
                      {range(vehicles.map((v) => v.includedKmPerDay), formatKilometers)}
                    </strong>{' '}
                    inclus par jour, ainsi que l&apos;âge et le permis requis par véhicule.
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </Reveal>
      )}

      {featured.length > 0 && (
        <Reveal>
          <section className="section-space" aria-labelledby="selection">
            <div className="container-x">
              <div className="mb-[clamp(1.75rem,4vw,3rem)] flex flex-wrap items-end justify-between gap-4 border-t border-ink pt-5">
                <h2 id="selection" className="m-0">Notre sélection</h2>
                <Link className="button button-ghost" href="/vehicules">
                  Voir tous les véhicules
                </Link>
              </div>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-8 gap-y-[clamp(2.5rem,5vw,4rem)] p-0 min-[900px]:*:nth-[3n+2]:mt-14">
                {featured.map((vehicle) => (
                  <li key={vehicle.id} data-reveal>
                    <VehicleCard vehicle={vehicle} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      )}
    </>
  )
}

export default HomePage
