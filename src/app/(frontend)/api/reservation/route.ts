import { HONEYPOT_FIELD, readSubmission } from '@/lib/forms/request'
import { respondFailure, respondInvalid, respondSent } from '@/lib/forms/respond'
import { validateReservation } from '@/lib/forms/validation'
import { sendTelegramMessage } from '@/lib/telegram/client'
import { formatReservationMessage } from '@/lib/telegram/messages'
import { getVehicleName } from '@/lib/vehicles/presentation'
import { getVehicleBySlug } from '@/lib/vehicles/queries'

/** Today's date (YYYY-MM-DD) in the agency's timezone. */
const todayInMarseille = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())

export async function POST(request: Request): Promise<Response> {
  const submission = await readSubmission(request)
  const slug = submission.ok ? (submission.raw.vehicleSlug ?? '') : ''
  const page = slug ? `/vehicules/${encodeURIComponent(slug)}/reservation` : '/vehicules'

  if (!submission.ok) return respondFailure(request, page, submission.status, submission.message)
  if (submission.raw[HONEYPOT_FIELD]) return respondSent(request, page)

  // Price, conditions and availability always come from the database, never from the form.
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) return respondFailure(request, '/vehicules', 404, 'Véhicule introuvable.')

  const result = validateReservation(submission.raw, vehicle, todayInMarseille())
  if (!result.ok) return respondInvalid(request, page, result.errors)

  const message = formatReservationMessage(
    result.data.input,
    { name: getVehicleName(vehicle), version: vehicle.version },
    result.data.quote,
  )
  const sent = await sendTelegramMessage(message)
  if (sent.ok) return respondSent(request, page)

  return sent.reason === 'rate-limited'
    ? respondFailure(request, page, 429, 'Trop de demandes en ce moment, réessayez dans une minute.')
    : respondFailure(
        request,
        page,
        503,
        "La demande n'a pas pu être envoyée. Réessayez plus tard ou contactez-nous par téléphone.",
      )
}
