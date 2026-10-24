// Fake Telegram Bot API used by the E2E tests: the real API is never called.
// POST /bot<token>/sendMessage   records the message and answers like Telegram
// GET  /__messages               returns every recorded message
// A message containing "[[fail]]" is answered with an API error, to test the failure path.
import { createServer } from 'node:http'

const PORT = Number(process.env.TELEGRAM_MOCK_PORT ?? 4010)
const messages = []

const send = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(body))
}

createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/__messages') {
    return send(response, 200, messages)
  }
  if (request.method === 'POST' && /^\/bot[^/]+\/sendMessage$/.test(request.url ?? '')) {
    let raw = ''
    request.on('data', (chunk) => (raw += chunk))
    request.on('end', () => {
      const payload = JSON.parse(raw)
      if (String(payload.text).includes('[[fail]]')) {
        return send(response, 400, { ok: false, error_code: 400, description: 'Bad Request: simulated' })
      }
      messages.push(payload)
      send(response, 200, { ok: true, result: { message_id: messages.length } })
    })
    return
  }
  send(response, 404, { ok: false, description: 'Not Found' })
}).listen(PORT, () => console.log(`Telegram mock listening on ${PORT}`))
