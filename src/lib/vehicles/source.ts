/** Shape of sujet/vehicles.json (French keys, read-only source data). */
export type AgencySource = {
  nom: string
  ville: string
  devise: string
}

export type VehicleSource = {
  id: number
  slug: string
  marque: string
  modele: string
  version: string
  annee: number
  categorie: string
  carburant: string
  boite: string
  puissance_ch: number
  transmission: string
  kilometrage: number
  places: number
  portes: number
  couleur: string
  crit_air: number
  prix_jour: number
  caution: number
  km_inclus_jour: number
  disponible: boolean
  equipements: string[]
  images: string[]
  description: string
  age_minimum?: number | null
  permis_minimum_annees?: number | null
  indisponible_jusqu_au?: string | null
}

export type CatalogSource = {
  agence: AgencySource
  vehicules: VehicleSource[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isOptional = (value: unknown, type: 'number' | 'string'): boolean =>
  value === undefined || value === null || typeof value === type

const REQUIRED_STRINGS = [
  'slug', 'marque', 'modele', 'version', 'categorie', 'carburant',
  'boite', 'transmission', 'couleur', 'description',
] as const

const REQUIRED_NUMBERS = [
  'id', 'annee', 'puissance_ch', 'kilometrage', 'places', 'portes',
  'crit_air', 'prix_jour', 'caution', 'km_inclus_jour',
] as const

const isVehicleSource = (value: unknown): value is VehicleSource => {
  if (!isRecord(value)) return false
  return (
    REQUIRED_STRINGS.every((key) => typeof value[key] === 'string') &&
    REQUIRED_NUMBERS.every((key) => typeof value[key] === 'number') &&
    typeof value.disponible === 'boolean' &&
    isStringArray(value.equipements) &&
    isStringArray(value.images) &&
    isOptional(value.age_minimum, 'number') &&
    isOptional(value.permis_minimum_annees, 'number') &&
    isOptional(value.indisponible_jusqu_au, 'string')
  )
}

const isAgencySource = (value: unknown): value is AgencySource =>
  isRecord(value) &&
  typeof value.nom === 'string' &&
  typeof value.ville === 'string' &&
  typeof value.devise === 'string'

/** Validates untrusted JSON at runtime and returns it typed, or throws a descriptive error. */
export const parseCatalog = (raw: unknown): CatalogSource => {
  if (!isRecord(raw)) throw new Error('Catalog must be an object')
  if (!isAgencySource(raw.agence)) throw new Error('Invalid or missing "agence"')
  if (!Array.isArray(raw.vehicules)) throw new Error('"vehicules" must be an array')

  const vehicules = raw.vehicules.map((item, index): VehicleSource => {
    if (!isVehicleSource(item)) throw new Error(`Invalid vehicle at index ${index}`)
    return item
  })
  return { agence: raw.agence, vehicules }
}
