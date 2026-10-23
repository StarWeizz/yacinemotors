// Runs once when the Next.js server starts: initialises Payload so that
// production migrations are applied at boot instead of on the first request.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NEXT_PHASE === 'phase-production-build') {
    return
  }
  const { getPayload } = await import('payload')
  const { default: config } = await import('./payload.config')
  await getPayload({ config })
}
