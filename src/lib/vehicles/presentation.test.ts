import { describe, expect, it } from 'vitest'
import { getAvailabilityLabel, getConditions, getVehicleName } from './presentation'

describe('getConditions', () => {
  it('returns nothing when there is no restriction', () => {
    expect(getConditions({ minimumAge: null, minimumLicenseYears: null })).toEqual([])
  })

  it('lists age and license requirements', () => {
    expect(getConditions({ minimumAge: 25, minimumLicenseYears: 5 })).toEqual([
      'Conducteur de 25 ans minimum',
      '5 ans de permis minimum',
    ])
  })
})

describe('getAvailabilityLabel', () => {
  it('says available', () => {
    expect(getAvailabilityLabel({ available: true, unavailableUntil: null })).toBe('Disponible')
  })

  it('gives the return date when unavailable', () => {
    expect(getAvailabilityLabel({ available: false, unavailableUntil: '2026-11-04' })).toBe(
      "Indisponible jusqu'au 4 novembre 2026",
    )
  })

  it('handles an unavailable vehicle without a date', () => {
    expect(getAvailabilityLabel({ available: false, unavailableUntil: null })).toBe('Indisponible')
  })
})

describe('getVehicleName', () => {
  it('joins brand and model', () => {
    expect(getVehicleName({ brand: 'Audi', model: 'Q5' })).toBe('Audi Q5')
  })
})
