import { describe, expect, it } from 'vitest'
import type { VehicleSource } from './source'
import { toVehicleData } from './seed'

const source: VehicleSource = {
  id: 3,
  slug: 'audi-rs3-sportback',
  marque: 'Audi',
  modele: 'RS 3 Sportback',
  version: 'S tronic',
  annee: 2025,
  categorie: 'Sportive',
  carburant: 'Essence',
  boite: 'Automatique',
  puissance_ch: 400,
  transmission: 'Intégrale',
  kilometrage: 5000,
  places: 5,
  portes: 5,
  couleur: 'Gris',
  crit_air: 1,
  prix_jour: 230,
  caution: 3000,
  km_inclus_jour: 200,
  disponible: true,
  equipements: ['GPS', 'Caméra de recul'],
  images: ['/images/vehicles/audi-rs3-1.jpg'],
  description: 'Compacte sportive.',
  age_minimum: 25,
  permis_minimum_annees: 5,
}

describe('toVehicleData', () => {
  it('maps French source keys to the collection fields', () => {
    const data = toVehicleData(source)
    expect(data).toMatchObject({
      slug: 'audi-rs3-sportback',
      sourceId: 3,
      brand: 'Audi',
      model: 'RS 3 Sportback',
      pricePerDay: 230,
      deposit: 3000,
      includedKmPerDay: 200,
      minimumAge: 25,
      minimumLicenseYears: 5,
      category: 'Sportive',
    })
  })

  it('turns equipment and images into array rows', () => {
    const data = toVehicleData(source)
    expect(data.equipment).toEqual([{ name: 'GPS' }, { name: 'Caméra de recul' }])
    expect(data.images).toEqual([{ path: '/images/vehicles/audi-rs3-1.jpg' }])
  })

  it('uses null for optional conditions that are absent', () => {
    const data = toVehicleData({ ...source, age_minimum: undefined, permis_minimum_annees: null })
    expect(data.minimumAge).toBeNull()
    expect(data.minimumLicenseYears).toBeNull()
    expect(data.unavailableUntil).toBeNull()
  })

  it('keeps the return date of an unavailable vehicle', () => {
    const data = toVehicleData({ ...source, disponible: false, indisponible_jusqu_au: '2026-11-04' })
    expect(data.available).toBe(false)
    expect(data.unavailableUntil).toBe('2026-11-04')
  })
})
