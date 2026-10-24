import { existsSync } from 'node:fs'
import path from 'node:path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

/**
 * The image files referenced by the catalog are not guaranteed to exist.
 * Returns the first referenced path that is really in /public, or null (the UI then shows a placeholder).
 */
export const findExistingImage = (imagePaths: readonly string[]): string | null => {
  for (const imagePath of imagePaths) {
    const absolute = path.join(PUBLIC_DIR, imagePath)
    // Stay inside /public even if a path contains "..".
    if (absolute.startsWith(PUBLIC_DIR + path.sep) && existsSync(absolute)) return imagePath
  }
  return null
}
