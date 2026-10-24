import { readFileSync } from 'node:fs'
import type { Payload } from 'payload'
import type { Vehicle } from '@/payload-types'
import { parseCatalog, type CatalogSource, type VehicleSource } from './source'

type VehicleData = Omit<Vehicle, 'id' | 'updatedAt' | 'createdAt'>

/** Maps a vehicle of vehicles.json (French keys) to the Payload `vehicles` collection. */
export const toVehicleData = (v: VehicleSource): VehicleData => ({
  slug: v.slug,
  sourceId: v.id,
  brand: v.marque,
  model: v.modele,
  version: v.version,
  year: v.annee,
  category: v.categorie as Vehicle['category'],
  fuel: v.carburant,
  gearbox: v.boite,
  powerHp: v.puissance_ch,
  drivetrain: v.transmission,
  mileage: v.kilometrage,
  seats: v.places,
  doors: v.portes,
  color: v.couleur,
  critAir: v.crit_air,
  pricePerDay: v.prix_jour,
  deposit: v.caution,
  includedKmPerDay: v.km_inclus_jour,
  available: v.disponible,
  unavailableUntil: v.indisponible_jusqu_au ?? null,
  minimumAge: v.age_minimum ?? null,
  minimumLicenseYears: v.permis_minimum_annees ?? null,
  equipment: v.equipements.map((name) => ({ name })),
  images: v.images.map((path) => ({ path })),
  description: v.description,
})

/** Reads and validates the catalog file. The file is never written. */
export const readCatalogFile = (filePath: string): CatalogSource =>
  parseCatalog(JSON.parse(readFileSync(filePath, 'utf-8')))

/** Creates or updates the agency and the vehicles (by slug). Safe to run several times. */
export const seedCatalog = async (payload: Payload, catalog: CatalogSource): Promise<void> => {
  await payload.updateGlobal({
    slug: 'agency',
    data: { name: catalog.agence.nom, city: catalog.agence.ville, currency: catalog.agence.devise },
  })

  for (const source of catalog.vehicules) {
    const data = toVehicleData(source)
    const { docs } = await payload.find({
      collection: 'vehicles',
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
    })
    const [existing] = docs
    if (existing) {
      await payload.update({ collection: 'vehicles', id: existing.id, data })
    } else {
      await payload.create({ collection: 'vehicles', data })
    }
    payload.logger.info(`${existing ? 'Updated' : 'Created'} ${data.slug}`)
  }
}

/** Seeds the catalog only when there is no vehicle yet. Returns whether it seeded. */
export const seedCatalogIfEmpty = async (payload: Payload, filePath: string): Promise<boolean> => {
  const { totalDocs } = await payload.count({ collection: 'vehicles' })
  if (totalDocs > 0) return false
  await seedCatalog(payload, readCatalogFile(filePath))
  return true
}
