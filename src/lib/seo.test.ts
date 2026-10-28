import { afterEach, describe, expect, it } from 'vitest'
import { buildSitemap, getSiteUrl } from './seo'

describe('getSiteUrl', () => {
  const original = process.env.SITE_URL
  afterEach(() => {
    process.env.SITE_URL = original
  })

  it('falls back to localhost when SITE_URL is not set', () => {
    delete process.env.SITE_URL
    expect(getSiteUrl()).toBe('http://localhost:3000')
  })

  it('drops trailing slashes', () => {
    process.env.SITE_URL = 'https://example.test//'
    expect(getSiteUrl()).toBe('https://example.test')
  })
})

describe('buildSitemap', () => {
  const entries = buildSitemap(
    [
      { slug: 'bmw-m4-competition', updatedAt: '2026-10-20T10:00:00.000Z' },
      { slug: 'a b', updatedAt: '2026-10-21T10:00:00.000Z' },
    ],
    'https://example.test',
  )
  const urls = entries.map((entry) => entry.url)

  it('lists the home page without a trailing slash and the static pages', () => {
    expect(urls).toContain('https://example.test')
    expect(urls).toContain('https://example.test/vehicules')
    expect(urls).toContain('https://example.test/mentions-legales')
    expect(urls).toContain('https://example.test/confidentialite')
  })

  it('lists one sheet per vehicle with its last modification date, slug encoded', () => {
    expect(urls).toContain('https://example.test/vehicules/bmw-m4-competition')
    expect(urls).toContain('https://example.test/vehicules/a%20b')
    expect(entries.find((entry) => entry.url.endsWith('bmw-m4-competition'))?.lastModified).toBe('2026-10-20T10:00:00.000Z')
  })

  it('does not list the reservation forms', () => {
    expect(urls.some((url) => url.includes('/reservation'))).toBe(false)
  })
})
