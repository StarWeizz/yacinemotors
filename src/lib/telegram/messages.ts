import { formatPrice } from '@/lib/format'
import type { ContactInput, ReservationInput, ReservationQuote } from '@/lib/forms/validation'

/** Telegram limit for the text of a message, after entity parsing. */
export const TELEGRAM_MAX_LENGTH = 4096

/** Telegram's HTML mode requires <, > and & to be replaced by entities. */
export const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Cuts a message under the limit without leaving a half-escaped entity at the end. */
export const truncateMessage = (text: string, max: number = TELEGRAM_MAX_LENGTH): string => {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastAmpersand = cut.lastIndexOf('&')
  const safe = lastAmpersand > cut.length - 6 && !cut.slice(lastAmpersand).includes(';')
    ? cut.slice(0, lastAmpersand)
    : cut
  return `${safe}…`
}

const line = (label: string, value: string): string => `<b>${label}</b> ${escapeHtml(value)}`

export const formatContactMessage = (input: ContactInput): string =>
  truncateMessage(
    [
      '📩 <b>Nouveau message de contact</b>',
      '',
      line('Nom :', input.name),
      line('E-mail :', input.email),
      line('Téléphone :', input.phone || 'non renseigné'),
      '',
      escapeHtml(input.message),
    ].join('\n'),
  )

type ReservationVehicle = {
  name: string
  version: string
}

export const formatReservationMessage = (
  input: ReservationInput,
  vehicle: ReservationVehicle,
  quote: ReservationQuote,
): string =>
  truncateMessage(
    [
      '🚗 <b>Demande de réservation</b>',
      '',
      line('Véhicule :', `${vehicle.name} (${vehicle.version})`),
      line('Du :', input.startDate),
      line('Au :', input.endDate),
      line('Durée :', `${quote.days} jour${quote.days > 1 ? 's' : ''}`),
      line('Estimation :', `${formatPrice(quote.total)} (${formatPrice(quote.pricePerDay)} / jour, indicatif)`),
      line('Km inclus :', `${quote.includedKm} km`),
      line('Caution :', formatPrice(quote.deposit)),
      '',
      line('Nom :', input.name),
      line('E-mail :', input.email),
      line('Téléphone :', input.phone),
      line('Âge du conducteur :', `${input.driverAge} ans`),
      line('Années de permis :', String(input.licenseYears)),
      ...(input.message ? ['', escapeHtml(input.message)] : []),
    ].join('\n'),
  )
