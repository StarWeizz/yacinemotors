import { describe, expect, it } from 'vitest'
import type { Vehicle } from '@/payload-types'
import { getAvailabilityLabel, getConditions, getVehicleName, pickFeatured } from './presentation'

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
