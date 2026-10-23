const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('fr-FR')

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })

export const formatPrice = (euros: number): string => priceFormatter.format(euros)

export const formatKilometers = (km: number): string => `${numberFormatter.format(km)} km`

/** Formats an ISO date (e.g. "2026-11-04") as "4 novembre 2026". */
export const formatDate = (isoDate: string): string => dateFormatter.format(new Date(isoDate))
