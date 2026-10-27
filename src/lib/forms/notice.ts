import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Messages shown after a no-JavaScript form post travel in the URL (`?erreur=…`). Without a check,
 * anyone could craft a link that makes the site display any text they like (content spoofing:
 * "call this number to confirm your booking"). The server signs the messages it redirects with,
 * and the page only displays a message whose signature is valid.
 */
const sign = (message: string): string =>
  createHmac('sha256', process.env.PAYLOAD_SECRET ?? '')
    .update(`notice:${message}`)
    .digest('base64url')

export const signNotice = sign

export const isValidNotice = (message: string | undefined, signature: string | undefined): boolean => {
  if (!message || !signature) return false
  const expected = Buffer.from(sign(message))
  const received = Buffer.from(signature)
  return expected.length === received.length && timingSafeEqual(expected, received)
}
