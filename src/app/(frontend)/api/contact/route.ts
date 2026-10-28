import { HONEYPOT_FIELD, readSubmission } from '@/lib/forms/request'
import { respondFailure, respondInvalid, respondSent } from '@/lib/forms/respond'
import { validateContact } from '@/lib/forms/validation'
import { sendTelegramMessage } from '@/lib/telegram/client'
import { formatContactMessage } from '@/lib/telegram/messages'

const PAGE = '/contact'

export async function POST(request: Request): Promise<Response> {
  const submission = await readSubmission(request)
  if (!submission.ok) return respondFailure(request, PAGE, submission.status, submission.message)

  // Honeypot: a bot filled the invisible field. Pretend it worked, send nothing.
  if (submission.raw[HONEYPOT_FIELD]) return respondSent(request, PAGE)

  const result = validateContact(submission.raw)
  if (!result.ok) return respondInvalid(request, PAGE, result.errors)

  const sent = await sendTelegramMessage(formatContactMessage(result.data))
  if (sent.ok) return respondSent(request, PAGE)

  return sent.reason === 'rate-limited'
    ? respondFailure(request, PAGE, 429, 'Trop de demandes en ce moment, réessayez dans une minute.')
    : respondFailure(
        request,
        PAGE,
        503,
        "Le message n'a pas pu être envoyé. Réessayez dans quelques minutes.",
      )
}
