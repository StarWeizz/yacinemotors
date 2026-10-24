import { describe, expect, it } from 'vitest'
import {
  escapeHtml,
  formatContactMessage,
  formatReservationMessage,
  TELEGRAM_MAX_LENGTH,
  truncateMessage,
} from './messages'

describe('escapeHtml', () => {
  it('escapes the three characters required by Telegram HTML mode', () => {
    expect(escapeHtml('<b>Tom & "Jerry"</b>')).toBe('&lt;b&gt;Tom &amp; "Jerry"&lt;/b&gt;')
  })
})

describe('truncateMessage', () => {
  it('keeps short messages unchanged', () => {
    expect(truncateMessage('hello')).toBe('hello')
  })

  it('stays under the Telegram limit', () => {
    expect(truncateMessage('a'.repeat(10_000)).length).toBeLessThanOrEqual(TELEGRAM_MAX_LENGTH)
  })

  it('does not cut an HTML entity in half', () => {
    const text = 'a'.repeat(8) + '&amp;' + 'b'.repeat(20)
    expect(truncateMessage(text, 11)).not.toMatch(/&a?m?p?…$/)
  })
})

describe('formatContactMessage', () => {
  it('escapes user content so it cannot inject Telegram markup', () => {
    const message = formatContactMessage({
      name: '<i>Eve</i>',
      email: 'eve@example.com',
      phone: '',
      message: '<a href="http://evil.test">cliquez</a> & plus',
    })
    expect(message).toContain('&lt;i&gt;Eve&lt;/i&gt;')
    expect(message).toContain('&lt;a href="http://evil.test"&gt;cliquez&lt;/a&gt; &amp; plus')
    expect(message).not.toContain('<a href')
    expect(message).toContain('non renseigné')
  })

  it('never exceeds the Telegram limit', () => {
    const message = formatContactMessage({ name: 'A B', email: 'a@b.cd', phone: '', message: '<'.repeat(5000) })
    expect(message.length).toBeLessThanOrEqual(TELEGRAM_MAX_LENGTH)
  })
})

describe('formatReservationMessage', () => {
  it('includes vehicle, dates, estimate and driver details', () => {
    const message = formatReservationMessage(
      {
        vehicleSlug: 'audi-a3',
        name: 'Karim Benali',
        email: 'karim@example.com',
        phone: '0612345678',
        startDate: '2026-11-10',
        endDate: '2026-11-13',
        driverAge: 30,
        licenseYears: 8,
        message: '',
      },
      { name: 'Audi A3 Sportback', version: '35 TFSI' },
      { days: 3, pricePerDay: 100, total: 300, includedKm: 750, deposit: 1500 },
    )
    expect(message).toContain('Audi A3 Sportback')
    expect(message).toContain('2026-11-10')
    expect(message).toContain('3 jours')
    expect(message).toContain('30 ans')
    expect(message).toContain('indicatif')
  })
})
