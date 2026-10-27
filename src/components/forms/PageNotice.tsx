import { isValidNotice } from '@/lib/forms/notice'

type PageNoticeProps = {
  sent?: string
  error?: string
  /** Signature of `error`: a message without a valid one is ignored (see lib/forms/notice.ts). */
  signature?: string
  successMessage: string
}

/** Status shown after a form submitted without JavaScript (the server redirects with ?envoye or ?erreur). */
export function PageNotice({ sent, error, signature, successMessage }: PageNoticeProps) {
  if (sent) return <p className="notice" role="status">{successMessage}</p>
  if (error && isValidNotice(error, signature)) return <p className="notice notice-error" role="alert">{error}</p>
  return null
}
