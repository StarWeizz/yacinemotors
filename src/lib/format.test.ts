import { describe, expect, it } from 'vitest'
import { formatDate, formatKilometers, formatPrice } from './format'

// Intl uses narrow/no-break spaces; normalise them for readable assertions.
const plain = (text: string): string => text.replace(/[  ]/g, ' ')

describe('format', () => {
  it('formats a price in euros without decimals', () => {
    expect(plain(formatPrice(1200))).toBe('1 200 €')
  })

  it('formats kilometers with a French thousands separator', () => {
    expect(plain(formatKilometers(14200))).toBe('14 200 km')
  })

  it('formats an ISO date in French regardless of timezone', () => {
    expect(formatDate('2026-11-04')).toBe('4 novembre 2026')
  })
})
