import { describe, expect, it } from 'vitest'
import { validateContact, validateReservation, type ReservationVehicle } from './validation'

const validContact = {
  name: 'Karim Benali',
  email: 'karim@example.com',
  phone: '06 12 34 56 78',
  message: "Bonjour, avez-vous une compacte pour ce week-end ?",
}

describe('validateContact', () => {
  it('accepts a valid message', () => {
    expect(validateContact(validContact).ok).toBe(true)
  })

  it('accepts a missing phone number', () => {
    expect(validateContact({ ...validContact, phone: '' }).ok).toBe(true)
  })

  it('reports each invalid field', () => {
    const result = validateContact({ name: 'K', email: 'nope', phone: 'abc', message: 'court' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name', 'phone'])
  })

  it('removes control characters and trims', () => {
    const result = validateContact({ ...validContact, name: '  Karim\u0000 Benali  ' })
    expect(result.ok && result.data.name).toBe('Karim Benali')
  })
})

const vehicle: ReservationVehicle = {
  available: true,
  pricePerDay: 100,
  includedKmPerDay: 250,
  deposit: 1500,
  minimumAge: null,
  minimumLicenseYears: null,
}

const reservation = {
  vehicleSlug: 'audi-a3',
  name: 'Karim Benali',
  email: 'karim@example.com',
  phone: '0612345678',
  startDate: '2026-11-10',
  endDate: '2026-11-13',
  driverAge: '30',
  licenseYears: '8',
  message: '',
}

const TODAY = '2026-11-01'

describe('validateReservation', () => {
  it('computes the quote from the database values', () => {
    const result = validateReservation(reservation, vehicle, TODAY)
    expect(result.ok && result.data.quote).toEqual({
      days: 3,
      pricePerDay: 100,
      total: 300,
      includedKm: 750,
      deposit: 1500,
    })
  })

  it('counts a same-day rental as one day', () => {
    const result = validateReservation({ ...reservation, endDate: '2026-11-10' }, vehicle, TODAY)
    expect(result.ok && result.data.quote.days).toBe(1)
  })

  it('rejects dates in the past, reversed or impossible', () => {
    const past = validateReservation({ ...reservation, startDate: '2026-10-01' }, vehicle, TODAY)
    const reversed = validateReservation({ ...reservation, endDate: '2026-11-05' }, vehicle, TODAY)
    const impossible = validateReservation({ ...reservation, startDate: '2026-02-31' }, vehicle, TODAY)
    expect(!past.ok && past.errors.startDate).toBeTruthy()
    expect(!reversed.ok && reversed.errors.endDate).toBeTruthy()
    expect(!impossible.ok && impossible.errors.startDate).toBeTruthy()
  })

  it('rejects rentals longer than the maximum', () => {
    const result = validateReservation({ ...reservation, endDate: '2027-03-01' }, vehicle, TODAY)
    expect(!result.ok && result.errors.endDate).toContain('Durée maximale')
  })

  it('enforces the minimum age and license years of the vehicle', () => {
    const sports: ReservationVehicle = { ...vehicle, minimumAge: 25, minimumLicenseYears: 5 }
    const result = validateReservation({ ...reservation, driverAge: '23', licenseYears: '3' }, sports, TODAY)
    expect(!result.ok && result.errors.driverAge).toContain('25 ans minimum')
    expect(!result.ok && result.errors.licenseYears).toContain('5 ans de permis')
  })

  it('does not allow starting before an unavailable vehicle returns', () => {
    const busy: ReservationVehicle = { ...vehicle, available: false, unavailableUntil: '2026-11-20T00:00:00.000Z' }
    const early = validateReservation(reservation, busy, TODAY)
    const later = validateReservation(
      { ...reservation, startDate: '2026-11-20', endDate: '2026-11-22' },
      busy,
      TODAY,
    )
    expect(!early.ok && early.errors.startDate).toContain('20 novembre 2026')
    expect(later.ok).toBe(true)
  })

  it('ignores any price sent by the client', () => {
    const result = validateReservation({ ...reservation, pricePerDay: '1', total: '1' }, vehicle, TODAY)
    expect(result.ok && result.data.quote.total).toBe(300)
  })
})
