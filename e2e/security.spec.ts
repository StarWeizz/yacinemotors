import { expect, test } from '@playwright/test'

test.describe('Content Security Policy', () => {
  test('the public pages send a nonce-based policy and the nonce is applied', async ({ page }) => {
    const response = await page.goto('/')
    const csp = response?.headers()['content-security-policy'] ?? ''
    const html = (await response?.text()) ?? ''
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).not.toContain("'unsafe-inline'")

    const nonce = /'nonce-([^']+)'/.exec(csp)?.[1]
    expect(nonce).toBeTruthy()
    // Browsers blank the nonce attribute in the DOM, so read it from the HTML that was sent.
    expect(html).toContain(`nonce="${nonce}"`)
  })

  test('a new nonce is generated for every request', async ({ request }) => {
    const nonceOf = async () =>
      /'nonce-([^']+)'/.exec((await request.get('/')).headers()['content-security-policy'] ?? '')?.[1]
    const [first, second] = [await nonceOf(), await nonceOf()]
    expect(first).toBeTruthy()
    expect(first).not.toBe(second)
  })

  for (const path of ['/', '/vehicules', '/vehicules/bmw-m4-competition', '/contact', '/credits-photos', '/mentions-legales', '/confidentialite']) {
    test(`no policy violation and the page still works: ${path}`, async ({ page }) => {
      const violations: string[] = []
      page.on('console', (message) => {
        if (/content security policy|refused to (load|execute|apply)/i.test(message.text())) violations.push(message.text())
      })
      page.on('pageerror', (error) => violations.push(error.message))
      await page.goto(path)
      await page.waitForTimeout(1500)
      expect(violations).toEqual([])
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })
  }

  test('GSAP still runs under the policy (it writes inline styles on the hero words)', async ({ page }) => {
    await page.goto('/')
    const word = page.locator('h1 .hero-word__inner').last()
    // Only GSAP writes an inline `transform`; the CSS fail-safe would not, so this proves the script ran.
    await expect.poll(() => word.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe('')
  })
})

test.describe('admin', () => {
  test('the back office still loads and keeps its own policy', async ({ request }) => {
    const response = await request.get('/admin/login', { maxRedirects: 0 })
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('payload')
    // Not matched by src/proxy.ts on purpose (ADR-0028).
    expect(response.headers()['content-security-policy']).toBeUndefined()
  })
})

test.describe('response headers', () => {
  test('the framework is not advertised', async ({ request }) => {
    const headers = (await request.get('/')).headers()
    expect(headers['x-powered-by']).toBeUndefined()
  })
})

test.describe('forged notices', () => {
  test('a message in the URL without a valid signature is never displayed', async ({ page }) => {
    await page.goto('/contact?erreur=' + encodeURIComponent('Appelez le 06 00 00 00 00 pour confirmer'))
    await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible()
    await expect(page.getByText('Appelez le 06')).toHaveCount(0)
    await expect(page.locator('.notice')).toHaveCount(0)
  })

  test('a signature copied from another message does not validate this one', async ({ page, request }) => {
    const redirect = await request.post('/api/contact', {
      form: { name: '', email: 'x', message: '' },
      headers: { origin: 'http://localhost:3000' },
      maxRedirects: 0,
    })
    const location = redirect.headers()['location'] ?? ''
    const signature = new URL(location, 'http://localhost').searchParams.get('sig') ?? ''
    expect(signature).not.toBe('')
    await page.goto('/contact?erreur=' + encodeURIComponent('Autre message') + '&sig=' + signature)
    await expect(page.getByText('Autre message')).toHaveCount(0)
  })
})

test.describe('access control on the content API', () => {
  const vehicle = { slug: 'x', brand: 'X' }

  test('visitors cannot create, change or delete vehicles', async ({ request }) => {
    expect((await request.post('/api/vehicles', { data: vehicle })).status()).toBe(403)
    expect((await request.patch('/api/vehicles/1', { data: { pricePerDay: 1 } })).status()).toBe(403)
    expect((await request.delete('/api/vehicles/1')).status()).toBe(403)
  })

  test('visitors cannot change the agency or read the users', async ({ request }) => {
    expect((await request.post('/api/globals/agency', { data: { name: 'Hacked' } })).status()).toBe(403)
    expect((await request.get('/api/users')).status()).toBe(403)
  })

  test('the public catalog stays readable', async ({ request }) => {
    const response = await request.get('/api/vehicles?limit=1')
    expect(response.status()).toBe(200)
  })

  test('GraphQL is not reachable', async ({ request }) => {
    const response = await request.post('/api/graphql', { data: { query: '{ __schema { types { name } } }' } })
    expect(response.status()).toBe(404)
  })
})
