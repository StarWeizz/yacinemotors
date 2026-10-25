import { describe, expect, it } from 'vitest'
import type { Vehicle } from '@/payload-types'
import { applyFilters, getChoices, getFamily, hasActiveFilters, parseFilters } from './catalog'

const make = (overrides: Partial<Vehicle> & Pick<Vehicle, 'id'>): Vehicle => ({
  slug: `v-${overrides.id}`,
  brand: 'Marque',
  model: 'Modèle',
  version: 'V',
  year: 2024,
  category: 'Compacte',
  fuel: 'Essence',
  gearbox: 'Automatique (7 rapports)',
  powerHp: 150,
  drivetrain: 'Traction',
  pricePerDay: 80,
  available: true,
  updatedAt: '',
  createdAt: '',
  ...overrides,
}) as Vehicle

const fleet = [
  make({ id: 1, category: 'Citadine', gearbox: 'Manuelle (6 rapports)', pricePerDay: 45, powerHp: 90, year: 2023 }),
  make({ id: 2, category: 'SUV', fuel: 'Diesel (micro-hybride)', pricePerDay: 125, powerHp: 190, available: false }),
  make({ id: 3, category: 'Sportive', pricePerDay: 300, powerHp: 510, year: 2025 }),
  make({ id: 4, category: 'SUV', fuel: 'Hybride (essence/électrique)', pricePerDay: 95, powerHp: 200 }),
]
const choices = getChoices(fleet)
const noFilter = parseFilters({}, choices)
const ids = (list: Vehicle[]): number[] => list.map((vehicle) => vehicle.id)

describe('getFamily', () => {
  it('drops the parenthesised detail', () => {
    expect(getFamily('Essence (micro-hybride)')).toBe('Essence')
    expect(getFamily('Manuelle (6 rapports)')).toBe('Manuelle')
    expect(getFamily('Essence')).toBe('Essence')
  })
})

describe('getChoices', () => {
  it('lists distinct sorted values and the highest price', () => {
    expect(choices.categories).toEqual(['Citadine', 'Sportive', 'SUV'])
    expect(choices.fuels).toEqual(['Diesel', 'Essence', 'Hybride'])
    expect(choices.gearboxes).toEqual(['Automatique', 'Manuelle'])
    expect(choices.maxPrice).toBe(300)
  })
})

describe('parseFilters', () => {
  it('defaults to no filter and catalog order', () => {
    expect(noFilter).toEqual({
      category: null, fuel: null, gearbox: null, maxPrice: null, availableOnly: false, sort: 'defaut',
    })
    expect(hasActiveFilters(noFilter)).toBe(false)
  })

  it('reads valid values', () => {
    const filters = parseFilters(
      { categorie: 'SUV', carburant: 'Diesel', boite: 'Automatique', prixMax: '100', disponibles: '1', tri: 'prix-asc' },
      choices,
    )
    expect(filters).toEqual({
      category: 'SUV', fuel: 'Diesel', gearbox: 'Automatique', maxPrice: 100, availableOnly: true, sort: 'prix-asc',
    })
    expect(hasActiveFilters(filters)).toBe(true)
  })

  it('ignores unknown or malformed values instead of failing', () => {
    const filters = parseFilters(
      { categorie: 'Tank', carburant: ['Diesel', 'x'], prixMax: 'abc', disponibles: 'oui', tri: 'hack' },
      choices,
    )
    expect(filters).toEqual({ ...noFilter, fuel: 'Diesel' })
  })

  it('rejects zero and negative prices', () => {
    expect(parseFilters({ prixMax: '0' }, choices).maxPrice).toBeNull()
    expect(parseFilters({ prixMax: '-5' }, choices).maxPrice).toBeNull()
  })
})

describe('applyFilters', () => {
  it('keeps everything without filter', () => {
    expect(ids(applyFilters(fleet, noFilter))).toEqual([1, 2, 3, 4])
  })

  it('filters by category, fuel family, gearbox family and price', () => {
    expect(ids(applyFilters(fleet, { ...noFilter, category: 'SUV' }))).toEqual([2, 4])
    expect(ids(applyFilters(fleet, { ...noFilter, fuel: 'Diesel' }))).toEqual([2])
    expect(ids(applyFilters(fleet, { ...noFilter, gearbox: 'Manuelle' }))).toEqual([1])
    expect(ids(applyFilters(fleet, { ...noFilter, maxPrice: 95 }))).toEqual([1, 4])
  })

  it('keeps only available vehicles on demand', () => {
    expect(ids(applyFilters(fleet, { ...noFilter, availableOnly: true }))).toEqual([1, 3, 4])
  })

  it('combines filters', () => {
    expect(ids(applyFilters(fleet, { ...noFilter, category: 'SUV', availableOnly: true }))).toEqual([4])
    expect(applyFilters(fleet, { ...noFilter, category: 'Citadine', maxPrice: 10 })).toEqual([])
  })

  it('sorts by price, power and year without mutating the input', () => {
    const snapshot = ids(fleet as Vehicle[])
    expect(ids(applyFilters(fleet, { ...noFilter, sort: 'prix-asc' }))).toEqual([1, 4, 2, 3])
    expect(ids(applyFilters(fleet, { ...noFilter, sort: 'prix-desc' }))).toEqual([3, 2, 4, 1])
    expect(ids(applyFilters(fleet, { ...noFilter, sort: 'puissance-desc' }))).toEqual([3, 4, 2, 1])
    expect(ids(applyFilters(fleet, { ...noFilter, sort: 'annee-desc' }))).toEqual([3, 2, 4, 1])
    expect(ids(fleet as Vehicle[])).toEqual(snapshot)
  })
})
