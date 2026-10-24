import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { VehicleCard } from '@/components/VehicleCard'
import { formatKilometers, formatPrice } from '@/lib/format'
import { pickFeatured } from '@/lib/vehicles/presentation'
import { getAgency, getVehicles } from '@/lib/vehicles/queries'

const HomePage = async () => {
  const [agency, vehicles] = await Promise.all([getAgency(), getVehicles()])
  const featured = pickFeatured(vehicles, 3)
  const availableCount = vehicles.filter((vehicle) => vehicle.available).length
  const categories = new Set(vehicles.map((vehicle) => vehicle.category))
  const lowestPrice = vehicles.length > 0 ? Math.min(...vehicles.map((v) => v.pricePerDay)) : null
  const lowestKm =
    vehicles.length > 0 ? Math.min(...vehicles.map((vehicle) => vehicle.includedKmPerDay)) : null

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Location de véhicules · {agency.city}</p>
          <h1>Le bon véhicule, au départ de {agency.city}.</h1>
          <p>
            Citadines, compactes, SUV et sportives : des véhicules récents, des prix par jour
            clairs, la caution et les kilomètres inclus affichés avant de demander quoi que ce soit.
          </p>
          <div className="hero__actions">
            <Link className="button" href="/vehicules">
              Parcourir le catalogue
            </Link>
            <Link className="button button--ghost" href="/contact">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="section" aria-labelledby="chiffres">
          <div className="container">
            <h2 id="chiffres" className="sr-only">
              L&apos;agence en chiffres
            </h2>
            <ul className="stats">
              <li data-reveal>
                <strong>{availableCount}</strong>
                <span>véhicules disponibles sur {vehicles.length}</span>
              </li>
              <li data-reveal>
                <strong>{categories.size}</strong>
                <span>catégories : {[...categories].join(', ')}</span>
              </li>
              {lowestPrice !== null && (
                <li data-reveal>
                  <strong>{formatPrice(lowestPrice)}</strong>
                  <span>par jour, à partir de</span>
                </li>
              )}
              {lowestKm !== null && (
                <li data-reveal>
                  <strong>{formatKilometers(lowestKm)}</strong>
                  <span>inclus par jour au minimum</span>
                </li>
              )}
            </ul>
          </div>
        </section>
      </Reveal>

      {featured.length > 0 && (
        <Reveal>
          <section className="section" aria-labelledby="selection">
            <div className="container">
              <div className="section__head">
                <h2 id="selection">Notre sélection</h2>
                <Link className="button button--ghost" href="/vehicules">
                  Voir tous les véhicules
                </Link>
              </div>
              <ul className="grid">
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
