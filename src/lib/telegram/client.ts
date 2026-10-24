const DEFAULT_API_URL = 'https://api.telegram.org'
const TIMEOUT_MS = 8000

export type SendResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'rate-limited' | 'failed' }

type TelegramResponse = {
  ok: boolean
  description?: string
  parameters?: { retry_after?: number }
}

const isTelegramResponse = (value: unknown): value is TelegramResponse =>
  typeof value === 'object' && value !== null && typeof (value as { ok?: unknown }).ok === 'boolean'

/**
 * Sends an HTML-formatted text message with the Bot API `sendMessage` method.
 * Server-only: the token never leaves the server and is never logged.
 */
export const sendTelegramMessage = async (text: string): Promise<SendResult> => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set')
    return { ok: false, reason: 'not-configured' }
  }

  const baseUrl = process.env.TELEGRAM_API_URL || DEFAULT_API_URL
  try {
    const response = await fetch(`${baseUrl}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const body: unknown = await response.json().catch(() => null)

    if (response.ok && isTelegramResponse(body) && body.ok) return { ok: true }

    const retryAfter = isTelegramResponse(body) ? body.parameters?.retry_after : undefined
    console.error(
      `[telegram] sendMessage failed: HTTP ${response.status}`,
      isTelegramResponse(body) ? body.description : 'unreadable response',
    )
    return { ok: false, reason: response.status === 429 || retryAfter ? 'rate-limited' : 'failed' }
  } catch (error: unknown) {
    // Never log the error object itself: a fetch error can contain the request URL (and the token).
    console.error('[telegram] sendMessage request error:', error instanceof Error ? error.name : 'unknown')
    return { ok: false, reason: 'failed' }
  }
}
