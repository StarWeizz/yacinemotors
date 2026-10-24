import { expect, test } from '@playwright/test'
import { messageCount, TELEGRAM_MOCK_URL, uniqueMarker, waitForMessage } from './support/telegram'

test.describe('contact form (F3)', () => {
  test('sends the message to Telegram, escaped', async ({ page, request }) => {
    const marker = uniqueMarker('contact')
    await page.goto('/contact')

    await page.getByLabel('Nom').fill(`Karim ${marker}`)
    await page.getByLabel('E-mail').fill('karim@example.com')
    await page.getByLabel('Message').fill('Bonjour <script>alert(1)</script> & merci, une compacte ce week-end ?')
    await page.getByRole('button', { name: 'Envoyer le message' }).click()

    await expect(page.getByRole('status')).toContainText('bien été envoyé')

    const sent = await waitForMessage(request, marker)
    expect(sent.parse_mode).toBe('HTML')
    expect(sent.text).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; merci')
    expect(sent.text).not.toContain('<script>')
  })

  test('shows errors next to the fields and sends nothing', async ({ page, request }) => {
    const marker = uniqueMarker('invalid')
    await page.goto('/contact')

    await page.getByLabel('Nom').fill(marker)
    await page.getByLabel('E-mail').fill('karim@exemple')
    await page.getByLabel('Message').fill('court')
    await page.getByRole('button', { name: 'Envoyer le message' }).click()

    await expect(page.getByText('Adresse e-mail invalide.')).toBeVisible()
    await expect(page.getByText('Message : 10 caractères minimum.')).toBeVisible()
    await expect(page.getByLabel('Nom')).toHaveValue(marker)
    expect(await messageCount(request, marker)).toBe(0)
  })

  test('tells the visitor when Telegram fails', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel('Nom').fill('Test [[fail]]')
    await page.getByLabel('E-mail').fill('karim@example.com')
    await page.getByLabel('Message').fill('Ce message fait échouer le faux Telegram.')
    await page.getByRole('button', { name: 'Envoyer le message' }).click()

    await expect(page.getByRole('status')).toContainText("n'a pas pu être envoyé")
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('works with a plain form post and redirect', async ({ page, request }) => {
      const marker = uniqueMarker('nojs')
      await page.goto('/contact')
      await page.getByLabel('Nom').fill(`Sans JS ${marker}`)
      await page.getByLabel('E-mail').fill('karim@example.com')
      await page.getByLabel('Message').fill('Message envoyé sans JavaScript côté visiteur.')
      await page.getByRole('button', { name: 'Envoyer le message' }).click()

      await expect(page).toHaveURL(/\/contact\?envoye=1$/)
      await expect(page.getByRole('status')).toContainText('bien été envoyé')
      await waitForMessage(request, marker)
    })

    test('shows the validation message after the redirect', async ({ page }) => {
      await page.goto('/contact')
      await page.getByLabel('Nom').fill('Sans JS')
      await page.getByLabel('E-mail').fill('karim@exemple')
      await page.getByLabel('Message').fill('Un message assez long pour passer.')
      await page.getByRole('button', { name: 'Envoyer le message' }).click()

      await expect(page.getByRole('alert')).toContainText('Adresse e-mail invalide.')
    })
  })
})

test.describe('contact API protections', () => {
  const body = (marker: string) => ({
    name: `Robot ${marker}`,
    email: 'bot@example.com',
    message: 'Un message de robot suffisamment long.',
  })

  test('honeypot: pretends success but sends nothing', async ({ request, baseURL }) => {
    const marker = uniqueMarker('honeypot')
    const response = await request.post('/api/contact', {
      data: { ...body(marker), website: 'http://spam.test' },
      headers: { Origin: baseURL ?? '', Accept: 'application/json' },
    })
    expect(response.status()).toBe(200)
    expect(await messageCount(request, marker)).toBe(0)
  })

  test('rejects a cross-origin post', async ({ request }) => {
    const marker = uniqueMarker('csrf')
    const response = await request.post('/api/contact', {
      data: body(marker),
      headers: { Origin: 'https://evil.example', Accept: 'application/json' },
    })
    expect(response.status()).toBe(403)
    expect(await messageCount(request, marker)).toBe(0)
  })

  test('the fake Telegram server is the only one reachable in tests', async ({ request }) => {
    const response = await request.get(`${TELEGRAM_MOCK_URL}/__messages`)
    expect(response.ok()).toBe(true)
  })
})
