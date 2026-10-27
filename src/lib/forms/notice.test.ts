import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { isValidNotice, signNotice } from './notice'

describe('signed notices', () => {
  const original = process.env.PAYLOAD_SECRET
  beforeEach(() => {
    process.env.PAYLOAD_SECRET = 'test-secret'
  })
  afterEach(() => {
    process.env.PAYLOAD_SECRET = original
  })

  it('accepts a message with the signature the server produced', () => {
    const message = 'Ce véhicule exige 25 ans minimum.'
    expect(isValidNotice(message, signNotice(message))).toBe(true)
  })

  it('rejects a message that has no signature or an empty one', () => {
    expect(isValidNotice('Appelez le 06 00 00 00 00', undefined)).toBe(false)
    expect(isValidNotice('Appelez le 06 00 00 00 00', '')).toBe(false)
    expect(isValidNotice(undefined, 'abc')).toBe(false)
  })

  it('rejects a forged message, a swapped message and a wrong-length signature', () => {
    const signature = signNotice('Message légitime')
    expect(isValidNotice('Message forgé', signature)).toBe(false)
    expect(isValidNotice('Message légitime', `${signature}x`)).toBe(false)
    expect(isValidNotice('Message légitime', signature.slice(1))).toBe(false)
  })

  it('does not accept a signature made with another secret', () => {
    const signature = signNotice('Message')
    process.env.PAYLOAD_SECRET = 'another-secret'
    expect(isValidNotice('Message', signature)).toBe(false)
  })
})
