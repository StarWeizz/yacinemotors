import { expect, type APIRequestContext } from '@playwright/test'

export const TELEGRAM_MOCK_URL = `http://localhost:${process.env.TELEGRAM_MOCK_PORT ?? 4010}`

type RecordedMessage = { chat_id: string; text: string; parse_mode: string }

const fetchMessages = async (request: APIRequestContext): Promise<RecordedMessage[]> => {
  const response = await request.get(`${TELEGRAM_MOCK_URL}/__messages`)
  return (await response.json()) as RecordedMessage[]
}

/** Waits for the message containing `marker` (tests share one mock, so each uses a unique marker). */
export const waitForMessage = async (request: APIRequestContext, marker: string): Promise<RecordedMessage> => {
  let found: RecordedMessage | undefined
  await expect
    .poll(async () => {
      found = (await fetchMessages(request)).find((message) => message.text.includes(marker))
      return Boolean(found)
    })
    .toBe(true)
  return found as RecordedMessage
}

export const messageCount = async (request: APIRequestContext, marker: string): Promise<number> =>
  (await fetchMessages(request)).filter((message) => message.text.includes(marker)).length

export const uniqueMarker = (label: string): string =>
  `${label}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
