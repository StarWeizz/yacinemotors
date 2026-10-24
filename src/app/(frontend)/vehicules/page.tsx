import type { Metadata } from 'next'
import { Reveal } from '@/components/Reveal'
import { VehicleCard } from '@/components/VehicleCard'
import { getVehicles } from '@/lib/vehicles/queries'

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Tous les véhicules de Yacine Motors : tarifs, caution, kilomètres inclus et conditions.',
}

const CatalogPage = async () => {
  const vehicles = await getVehicles()

  return (
    <div className="container">
      <header className="page-title">
        <h1>Catalogue</h1>
        <p>
          {vehicles.length} véhicules. Les prix s&apos;entendent par jour ; la caution et les
          conditions du conducteur sont indiquées sur chaque fiche.
        </p>
      </header>

      <Reveal className="section">
        {vehicles.length === 0 ? (
          <p>Aucun véhicule n&apos;est disponible pour le moment.</p>
        ) : (
          <ul className="grid">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} data-reveal>
                <VehicleCard vehicle={vehicle} />
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  )
}

export default CatalogPage
