import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sendTelegramMessage } from './client'

const TOKEN = '123456:SECRET-TOKEN'

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('sendTelegramMessage', () => {
  beforeEach(() => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', TOKEN)
    vi.stubEnv('TELEGRAM_CHAT_ID', '42')
    vi.stubEnv('TELEGRAM_API_URL', 'https://telegram.test')
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('posts the message with the documented sendMessage parameters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, result: {} }))
    vi.stubGlobal('fetch', fetchMock)

    expect(await sendTelegramMessage('<b>Salut</b>')).toEqual({ ok: true })

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`https://telegram.test/bot${TOKEN}/sendMessage`)
    expect(JSON.parse(String(init.body))).toMatchObject({
      chat_id: '42',
      text: '<b>Salut</b>',
      parse_mode: 'HTML',
    })
  })

  it('does not call Telegram when it is not configured', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    expect(await sendTelegramMessage('hello')).toEqual({ ok: false, reason: 'not-configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports flood control as rate-limited', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ ok: false, description: 'Too Many Requests', parameters: { retry_after: 5 } }, 429),
      ),
    )
    expect(await sendTelegramMessage('hello')).toEqual({ ok: false, reason: 'rate-limited' })
  })

  it('reports other API errors as failed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ ok: false, description: 'Bad Request' }, 400)))
    expect(await sendTelegramMessage('hello')).toEqual({ ok: false, reason: 'failed' })
  })

  it('never logs the bot token, even when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(`connect failed for /bot${TOKEN}/sendMessage`)))
    const errorLog = vi.spyOn(console, 'error')

    expect(await sendTelegramMessage('hello')).toEqual({ ok: false, reason: 'failed' })
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain('SECRET-TOKEN')
  })
})
