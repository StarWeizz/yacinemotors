import { describe, expect, it } from 'vitest'
import type { Vehicle } from '@/payload-types'
import {
  getAvailabilityLabel,
  getConditions,
  getRentalTerms,
  getVehicleName,
  pickFeatured,
} from './presentation'

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

describe('pickFeatured', () => {
  const make = (id: number, category: Vehicle['category'], available: boolean): Vehicle =>
    ({ id, category, available }) as Vehicle

  it('keeps one available vehicle per category, in order', () => {
    const vehicles = [
      make(1, 'Compacte', true),
      make(2, 'Compacte', true),
      make(3, 'SUV', false),
      make(4, 'SUV', true),
      make(5, 'Sportive', true),
    ]
    expect(pickFeatured(vehicles, 3).map((vehicle) => vehicle.id)).toEqual([1, 4, 5])
  })

  it('respects the limit', () => {
    const vehicles = [make(1, 'Compacte', true), make(2, 'SUV', true), make(3, 'Sportive', true)]
    expect(pickFeatured(vehicles, 2)).toHaveLength(2)
  })
})

describe('getRentalTerms', () => {
  const vehicle = (overrides: Partial<Vehicle>): Vehicle =>
    ({ deposit: 1000, includedKmPerDay: 250, minimumAge: null, minimumLicenseYears: null, ...overrides }) as Vehicle

  it('returns null without vehicles', () => {
    expect(getRentalTerms([])).toBeNull()
  })

  it('summarises deposit, kilometers and driver requirements across the fleet', () => {
    const terms = getRentalTerms([
      vehicle({ deposit: 800, includedKmPerDay: 200 }),
      vehicle({ deposit: 6000, includedKmPerDay: 300, minimumAge: 25, minimumLicenseYears: 5 }),
      vehicle({ deposit: 2000, minimumAge: 21 }),
    ])
    expect(terms).toEqual({
      depositRange: [800, 6000],
      kmRange: [200, 300],
      maxMinimumAge: 25,
      maxMinimumLicenseYears: 5,
    })
  })

  it('leaves requirements empty when no vehicle sets one', () => {
    const terms = getRentalTerms([vehicle({})])
    expect(terms?.maxMinimumAge).toBeNull()
    expect(terms?.maxMinimumLicenseYears).toBeNull()
  })
})
