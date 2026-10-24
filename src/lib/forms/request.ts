import type { RawForm } from './validation'

const MAX_BODY_BYTES = 20_000

export type Submission =
  | { ok: true; raw: RawForm }
  | { ok: false; status: 400 | 403 | 413 | 415; message: string }

/** Name of the invisible anti-spam field (honeypot): real visitors never fill it. */
export const HONEYPOT_FIELD = 'website'

/**
 * Simple CSRF protection: a browser always sends Origin (or Sec-Fetch-Site) on a POST.
 * X-Forwarded-Host is set by nginx and keeps the public port, unlike Host.
 */
export const isSameOrigin = (request: Request): boolean => {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).host === host
    } catch {
      return false
    }
  }
  const fetchSite = request.headers.get('sec-fetch-site')
  return fetchSite === 'same-origin' || fetchSite === 'none'
}

const toStringRecord = (entries: Iterable<[string, unknown]>): RawForm => {
  const record: RawForm = {}
  for (const [key, value] of entries) {
    if (typeof value === 'string') record[key] = value
  }
  return record
}

export const wantsJson = (request: Request): boolean =>
  (request.headers.get('accept') ?? '').includes('application/json')

export const readSubmission = async (request: Request): Promise<Submission> => {
  if (!isSameOrigin(request)) return { ok: false, status: 403, message: 'Requête refusée.' }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, message: 'Message trop volumineux.' }
  }

  const contentType = request.headers.get('content-type') ?? ''
  try {
    if (contentType.includes('application/json')) {
      const text = await request.text()
      if (text.length > MAX_BODY_BYTES) return { ok: false, status: 413, message: 'Message trop volumineux.' }
      const body: unknown = JSON.parse(text)
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return { ok: false, status: 400, message: 'Requête invalide.' }
      }
      return { ok: true, raw: toStringRecord(Object.entries(body)) }
    }
    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const form = await request.formData()
      return { ok: true, raw: toStringRecord(form.entries()) }
    }
  } catch {
    return { ok: false, status: 400, message: 'Requête invalide.' }
  }
  return { ok: false, status: 415, message: 'Format non pris en charge.' }
}
