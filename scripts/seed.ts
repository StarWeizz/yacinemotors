import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { readCatalogFile, seedCatalog } from '../src/lib/vehicles/seed'

const SOURCE_PATH = path.resolve(process.cwd(), 'sujet/vehicles.json')

/** Reads sujet/vehicles.json (never written) and upserts the agency and vehicles by slug. */
const seed = async (): Promise<void> => {
  const catalog = readCatalogFile(SOURCE_PATH)
  const payload = await getPayload({ config })
  await seedCatalog(payload, catalog)
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
