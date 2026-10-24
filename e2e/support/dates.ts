/** An ISO date (YYYY-MM-DD) `offsetDays` after today, in the agency's timezone. */
export const inDays = (offsetDays: number): string => {
  const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(date)
}
