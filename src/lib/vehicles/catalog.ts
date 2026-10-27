import type { Vehicle } from '@/payload-types'
import { isAvailable } from './presentation'

export const SORT_OPTIONS = [
  { value: 'defaut', label: 'Ordre du catalogue' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'puissance-desc', label: 'Puissance décroissante' },
  { value: 'annee-desc', label: 'Plus récents' },
] as const

export type SortKey = (typeof SORT_OPTIONS)[number]['value']

export type CatalogFilters = {
  category: string | null
  fuel: string | null
  gearbox: string | null
  maxPrice: number | null
  availableOnly: boolean
  sort: SortKey
}

export type SearchParams = Record<string, string | string[] | undefined>

export type CatalogChoices = {
  categories: string[]
  fuels: string[]
  gearboxes: string[]
  maxPrice: number
}

const first = (value: string | string[] | undefined): string | null => {
  const single = Array.isArray(value) ? value[0] : value
  const trimmed = single?.trim()
  return trimmed ? trimmed : null
}

/** "Essence (micro-hybride)" → "Essence" : one family per fuel/gearbox. */
export const getFamily = (label: string): string => label.split('(')[0].trim()

const unique = (values: string[]): string[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, 'fr'))

export const getChoices = (vehicles: readonly Vehicle[]): CatalogChoices => ({
  categories: unique(vehicles.map((vehicle) => vehicle.category)),
  fuels: unique(vehicles.map((vehicle) => getFamily(vehicle.fuel))),
  gearboxes: unique(vehicles.map((vehicle) => getFamily(vehicle.gearbox))),
  maxPrice: Math.max(0, ...vehicles.map((vehicle) => vehicle.pricePerDay)),
})

/** Reads filters from the URL; anything unknown or malformed is ignored, never an error. */
export const parseFilters = (params: SearchParams, choices: CatalogChoices): CatalogFilters => {
  const pick = (name: string, allowed: string[]): string | null => {
    const value = first(params[name])
    return value !== null && allowed.includes(value) ? value : null
  }
  const price = Number(first(params.prixMax))
  const sort = SORT_OPTIONS.find((option) => option.value === first(params.tri))

  return {
    category: pick('categorie', choices.categories),
    fuel: pick('carburant', choices.fuels),
    gearbox: pick('boite', choices.gearboxes),
    maxPrice: Number.isFinite(price) && price > 0 ? Math.floor(price) : null,
    availableOnly: first(params.disponibles) === '1',
    sort: sort?.value ?? 'defaut',
  }
}

export const hasActiveFilters = (filters: CatalogFilters): boolean =>
  filters.category !== null ||
  filters.fuel !== null ||
  filters.gearbox !== null ||
  filters.maxPrice !== null ||
  filters.availableOnly

const comparators: Record<SortKey, ((a: Vehicle, b: Vehicle) => number) | null> = {
  defaut: null,
  'prix-asc': (a, b) => a.pricePerDay - b.pricePerDay,
  'prix-desc': (a, b) => b.pricePerDay - a.pricePerDay,
  'puissance-desc': (a, b) => b.powerHp - a.powerHp,
  'annee-desc': (a, b) => b.year - a.year,
}

/** Filters then sorts without mutating the input. Array.sort is stable, so ties keep catalog order. */
export const applyFilters = (vehicles: readonly Vehicle[], filters: CatalogFilters): Vehicle[] => {
  const kept = vehicles.filter(
    (vehicle) =>
      (filters.category === null || vehicle.category === filters.category) &&
      (filters.fuel === null || getFamily(vehicle.fuel) === filters.fuel) &&
      (filters.gearbox === null || getFamily(vehicle.gearbox) === filters.gearbox) &&
      (filters.maxPrice === null || vehicle.pricePerDay <= filters.maxPrice) &&
      (!filters.availableOnly || isAvailable(vehicle)),
  )
  const compare = comparators[filters.sort]
  return compare ? kept.sort(compare) : kept
}
