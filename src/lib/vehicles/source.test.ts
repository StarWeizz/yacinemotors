import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseCatalog } from './source'

const readJson = (): unknown =>
  JSON.parse(readFileSync(new URL('../../../sujet/vehicles.json', import.meta.url), 'utf-8'))

describe('parseCatalog', () => {
  it('accepts the provided vehicles.json', () => {
    const catalog = parseCatalog(readJson())
    expect(catalog.agence.nom).toBe('Yacine Motors')
    expect(catalog.vehicules).toHaveLength(10)
  })

  it('has unique slugs', () => {
    const slugs = parseCatalog(readJson()).vehicules.map((vehicle) => vehicle.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('rejects a vehicle with a wrong field type', () => {
    expect(() =>
      parseCatalog({
        agence: { nom: 'A', ville: 'B', devise: 'EUR' },
        vehicules: [{ id: 'not-a-number' }],
      }),
    ).toThrow('Invalid vehicle at index 0')
  })

  it('rejects a non-object payload', () => {
    expect(() => parseCatalog(null)).toThrow('Catalog must be an object')
  })
})
