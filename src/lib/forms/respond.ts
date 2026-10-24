import { wantsJson } from './request'
import type { FieldErrors } from './validation'

const MAX_REDIRECT_MESSAGE = 300

/**
 * Forms work without JavaScript: the browser posts natively and gets a 303 redirect back to the
 * page with a status in the query string. With JavaScript, the client asks for JSON instead.
 */
const redirect = (location: string): Response =>
  new Response(null, { status: 303, headers: { Location: location } })

export const respondSent = (request: Request, page: string): Response =>
  wantsJson(request) ? Response.json({ ok: true }) : redirect(`${page}?envoye=1`)

export const respondInvalid = (request: Request, page: string, errors: FieldErrors): Response => {
  if (wantsJson(request)) return Response.json({ ok: false, errors }, { status: 422 })
  const message = Object.values(errors).join(' ').slice(0, MAX_REDIRECT_MESSAGE)
  return redirect(`${page}?erreur=${encodeURIComponent(message)}`)
}

export const respondFailure = (
  request: Request,
  page: string,
  status: number,
  message: string,
): Response =>
  wantsJson(request)
    ? Response.json({ ok: false, message }, { status })
    : redirect(`${page}?erreur=${encodeURIComponent(message)}`)
