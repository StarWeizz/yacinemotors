// Runs once when the Next.js server starts: initialises Payload so that production
// migrations are applied at boot instead of on the first request (ADR-0012), then
// optionally loads the initial catalog (ADR-0020).
const DEFAULT_CATALOG_PATH = 'sujet/vehicles.json'

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NEXT_PHASE === 'phase-production-build') {
    return
  }
  const { getPayload } = await import('payload')
  const { default: config } = await import('./payload.config')
  const payload = await getPayload({ config })

  if (process.env.AUTO_SEED !== 'true') return

  try {
    const { seedCatalogIfEmpty } = await import('./lib/vehicles/seed')
    const seeded = await seedCatalogIfEmpty(payload, process.env.CATALOG_PATH || DEFAULT_CATALOG_PATH)
    payload.logger.info(seeded ? 'Initial catalog loaded' : 'Catalog already present, auto-seed skipped')
  } catch (error: unknown) {
    // A seeding problem must not take the website down.
    payload.logger.error(`Auto-seed failed: ${error instanceof Error ? error.message : 'unknown error'}`)
  }
}
