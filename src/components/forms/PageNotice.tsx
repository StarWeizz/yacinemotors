type PageNoticeProps = {
  sent?: string
  error?: string
  successMessage: string
}

/** Status shown after a form submitted without JavaScript (the server redirects with ?envoye or ?erreur). */
export function PageNotice({ sent, error, successMessage }: PageNoticeProps) {
  if (sent) return <p className="notice notice--ok" role="status">{successMessage}</p>
  if (error) return <p className="notice notice--error" role="alert">{error}</p>
  return null
}
