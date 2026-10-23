import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { parseCatalog, type VehicleSource } from '../src/lib/vehicles/source'

const SOURCE_PATH = path.resolve(process.cwd(), 'sujet/vehicles.json')

const toVehicleData = (v: VehicleSource) => ({
  slug: v.slug,
  sourceId: v.id,
  brand: v.marque,
  model: v.modele,
  version: v.version,
  year: v.annee,
  category: v.categorie as 'Citadine' | 'Compacte' | 'SUV' | 'Sportive',
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
  images: v.images.map((imagePath) => ({ path: imagePath })),
  description: v.description,
})

/** Reads sujet/vehicles.json (never written) and upserts the agency and vehicles by slug. */
const seed = async (): Promise<void> => {
  const catalog = parseCatalog(JSON.parse(readFileSync(SOURCE_PATH, 'utf-8')))
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'agency',
    data: { name: catalog.agence.nom, city: catalog.agence.ville, currency: catalog.agence.devise },
  })

  for (const vehicle of catalog.vehicules) {
    const data = toVehicleData(vehicle)
    const existing = await payload.find({
      collection: 'vehicles',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    const [found] = existing.docs
    if (found) {
      await payload.update({ collection: 'vehicles', id: found.id, data })
    } else {
      await payload.create({ collection: 'vehicles', data })
    }
    payload.logger.info(`${found ? 'Updated' : 'Created'} ${data.slug}`)
  }
  payload.logger.info(`Seed done: ${catalog.vehicules.length} vehicles`)
}

// Top-level await: `payload run` exits as soon as the module has finished evaluating.
try {
  await seed()
} catch (error: unknown) {
  console.error(error)
  process.exitCode = 1
}
process.exit()
