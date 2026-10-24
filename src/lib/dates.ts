/** Today's date (YYYY-MM-DD) in the agency's timezone (Marseille). */
export const todayInMarseille = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())
