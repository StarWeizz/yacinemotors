import type { Metadata } from 'next'
import { CatalogFilters } from '@/components/CatalogFilters'
import { Reveal } from '@/components/Reveal'
import { VehicleCard } from '@/components/VehicleCard'
import {
  applyFilters,
  getChoices,
  hasActiveFilters,
  parseFilters,
  type SearchParams,
} from '@/lib/vehicles/catalog'
import { getVehicles } from '@/lib/vehicles/queries'

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Tous les véhicules de Yacine Motors : tarifs, caution, kilomètres inclus et conditions.',
}

type Props = {
  searchParams: Promise<SearchParams>
}

const CatalogPage = async ({ searchParams }: Props) => {
  const all = await getVehicles()
  const choices = getChoices(all)
  const filters = parseFilters(await searchParams, choices)
  const vehicles = applyFilters(all, filters)
  const filtered = hasActiveFilters(filters)

  return (
    <div className="container-x">
      <header className="page-title">
        <h1>Catalogue</h1>
        <p>
          Les prix s&apos;entendent par jour ; la caution et les conditions du conducteur sont
          indiquées sur chaque fiche.
        </p>
      </header>

      {all.length > 0 ? <CatalogFilters choices={choices} filters={filters} /> : null}

      <Reveal className="section-space">
        <p className="mt-8 mb-8 text-sm text-steel" role="status" aria-live="polite">
          {filtered
            ? `${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''} sur ${all.length}`
            : `${all.length} véhicule${all.length > 1 ? 's' : ''}`}
        </p>
        {vehicles.length === 0 ? (
          <p>
            {filtered
              ? 'Aucun véhicule ne correspond à ces critères. Essayez de les assouplir ou réinitialisez les filtres.'
              : "Aucun véhicule n'est disponible pour le moment."}
          </p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-8 gap-y-[clamp(2.5rem,5vw,4rem)] p-0">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} data-reveal>
                <VehicleCard vehicle={vehicle} headingLevel="h2" />
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  )
}

export default CatalogPage
