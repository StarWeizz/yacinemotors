import { formatDate } from '@/lib/format'

export type FieldErrors = Record<string, string>

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors }

export type RawForm = Record<string, string>

export type ContactInput = {
  name: string
  email: string
  phone: string
  message: string
}

export type ReservationInput = {
  vehicleSlug: string
  name: string
  email: string
  phone: string
  startDate: string
  endDate: string
  driverAge: number
  licenseYears: number
  message: string
}

/** What the customer is told about the cost. Always an estimate, computed from the database. */
export type ReservationQuote = {
  days: number
  pricePerDay: number
  total: number
  includedKm: number
  deposit: number
}

/** Vehicle facts needed to validate a request, read from the database (never from the form). */
export type ReservationVehicle = {
  minimumAge?: number | null
  minimumLicenseYears?: number | null
  available?: boolean | null
  unavailableUntil?: string | null
  pricePerDay: number
  includedKmPerDay: number
  deposit: number
}

export const MAX_RENTAL_DAYS = 90
const MAX_DAYS_AHEAD = 365
const DAY_MS = 24 * 60 * 60 * 1000

const isControlCharacter = (char: string): boolean => {
  const code = char.charCodeAt(0)
  const isAllowedWhitespace = code === 9 || code === 10 || code === 13
  return !isAllowedWhitespace && (code < 32 || code === 127)
}

/** Trims and removes control characters (keeps tabs and line breaks). */
export const clean = (value: string | undefined): string =>
  [...(value ?? '')].filter((char) => !isControlCharacter(char)).join('').trim()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[0-9 ().-]{6,20}$/
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const isValidEmail = (email: string): boolean => email.length <= 254 && EMAIL_PATTERN.test(email)

const isValidPhone = (phone: string): boolean =>
  PHONE_PATTERN.test(phone) && phone.replace(/\D/g, '').length >= 6

const parseIsoDate = (value: string): number | null => {
  if (!ISO_DATE_PATTERN.test(value)) return null
  const time = Date.parse(`${value}T00:00:00Z`)
  if (Number.isNaN(time)) return null
  // Rejects impossible dates such as 2026-02-31 that Date.parse would roll over.
  return new Date(time).toISOString().slice(0, 10) === value ? time : null
}

const parseWholeNumber = (value: string): number | null =>
  /^\d{1,3}$/.test(value) ? Number(value) : null

const requireLength = (
  errors: FieldErrors,
  field: string,
  value: string,
  min: number,
  max: number,
  label: string,
): void => {
  if (value.length < min) errors[field] = `${label} : ${min} caractères minimum.`
  else if (value.length > max) errors[field] = `${label} : ${max} caractères maximum.`
}

export const validateContact = (raw: RawForm): ValidationResult<ContactInput> => {
  const data: ContactInput = {
    name: clean(raw.name),
    email: clean(raw.email),
    phone: clean(raw.phone),
    message: clean(raw.message),
  }
  const errors: FieldErrors = {}

  requireLength(errors, 'name', data.name, 2, 100, 'Nom')
  if (!isValidEmail(data.email)) errors.email = 'Adresse e-mail invalide.'
  if (data.phone && !isValidPhone(data.phone)) errors.phone = 'Numéro de téléphone invalide.'
  requireLength(errors, 'message', data.message, 10, 2000, 'Message')

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data }
}

export type ReservationValidation = ValidationResult<{
  input: ReservationInput
  quote: ReservationQuote
}>

/** `today` is an ISO date (YYYY-MM-DD) in the agency's timezone. */
export const validateReservation = (
  raw: RawForm,
  vehicle: ReservationVehicle,
  today: string,
): ReservationValidation => {
  const errors: FieldErrors = {}
  const message = clean(raw.message)
  const driverAge = parseWholeNumber(clean(raw.driverAge))
  const licenseYears = parseWholeNumber(clean(raw.licenseYears))
  const input = {
    vehicleSlug: clean(raw.vehicleSlug),
    name: clean(raw.name),
    email: clean(raw.email),
    phone: clean(raw.phone),
    startDate: clean(raw.startDate),
    endDate: clean(raw.endDate),
    message,
  }

  requireLength(errors, 'name', input.name, 2, 100, 'Nom')
  if (!isValidEmail(input.email)) errors.email = 'Adresse e-mail invalide.'
  if (!isValidPhone(input.phone)) errors.phone = 'Numéro de téléphone invalide.'
  if (message.length > 1000) errors.message = 'Message : 1000 caractères maximum.'

  if (driverAge === null || driverAge < 18 || driverAge > 99) {
    errors.driverAge = 'Indiquez votre âge (18 ans minimum).'
  } else if (vehicle.minimumAge && driverAge < vehicle.minimumAge) {
    errors.driverAge = `Ce véhicule est réservé aux conducteurs de ${vehicle.minimumAge} ans minimum.`
  }

  if (licenseYears === null || licenseYears > 80) {
    errors.licenseYears = 'Indiquez vos années de permis.'
  } else if (vehicle.minimumLicenseYears && licenseYears < vehicle.minimumLicenseYears) {
    errors.licenseYears = `Ce véhicule exige ${vehicle.minimumLicenseYears} ans de permis minimum.`
  }

  const start = parseIsoDate(input.startDate)
  const end = parseIsoDate(input.endDate)
  const todayTime = parseIsoDate(today) ?? 0
  const isAvailable = vehicle.available !== false
  const earliest = isAvailable || !vehicle.unavailableUntil
    ? todayTime
    : Math.max(todayTime, parseIsoDate(vehicle.unavailableUntil.slice(0, 10)) ?? 0)

  if (!isAvailable && !vehicle.unavailableUntil) {
    errors.startDate = "Ce véhicule n'est pas disponible actuellement."
  } else if (start === null) errors.startDate = 'Date de départ invalide.'
  else if (start < todayTime) errors.startDate = 'La date de départ ne peut pas être passée.'
  else if (start < earliest) {
    errors.startDate = `Ce véhicule n'est pas disponible avant le ${formatDate(new Date(earliest).toISOString().slice(0, 10))}.`
  } else if (start > todayTime + MAX_DAYS_AHEAD * DAY_MS) {
    errors.startDate = 'Date de départ trop lointaine.'
  }

  if (end === null) errors.endDate = 'Date de retour invalide.'
  else if (start !== null && end < start) {
    errors.endDate = 'La date de retour doit être après le départ.'
  } else if (start !== null && (end - start) / DAY_MS > MAX_RENTAL_DAYS) {
    errors.endDate = `Durée maximale : ${MAX_RENTAL_DAYS} jours. Contactez-nous pour une longue durée.`
  }

  if (Object.keys(errors).length > 0 || start === null || end === null) {
    return { ok: false, errors }
  }

  // Assumption (ADR-0019): days = return date - start date, at least 1.
  const days = Math.max(1, Math.round((end - start) / DAY_MS))
  return {
    ok: true,
    data: {
      input: { ...input, driverAge: driverAge ?? 0, licenseYears: licenseYears ?? 0 },
      quote: {
        days,
        pricePerDay: vehicle.pricePerDay,
        total: days * vehicle.pricePerDay,
        includedKm: days * vehicle.includedKmPerDay,
        deposit: vehicle.deposit,
      },
    },
  }
}
