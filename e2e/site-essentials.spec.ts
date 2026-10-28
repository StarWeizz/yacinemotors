import { expect, test } from '@playwright/test'

test.describe('icon, robots and sitemap', () => {
  test('the site has an icon in every format and declares it', async ({ page, request }) => {
    const svg = await request.get('/icon.svg')
    expect(svg.status()).toBe(200)
    expect(svg.headers()['content-type']).toContain('image/svg+xml')
    expect((await request.get('/apple-icon.png')).headers()['content-type']).toContain('image/png')
    expect((await request.get('/favicon.ico')).status()).toBe(200)

    await page.goto('/')
    await expect(page.locator('head link[rel~="icon"]').first()).toHaveAttribute('href', /icon|favicon/)
    await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveCount(1)
  })

  test('robots.txt keeps crawlers out of the back office and points to the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toMatch(/User-Agent: \*/i)
    expect(text).toContain('Allow: /')
    expect(text).toContain('Disallow: /admin')
    expect(text).toContain('Disallow: /api/')
    expect(text).toContain('Disallow: /vehicules/*/reservation')
    expect(text).toMatch(/Sitemap: https?:\/\/[^/\s]+\/sitemap\.xml/)
  })

  test('sitemap.xml lists the pages and one sheet per vehicle, but no reservation form', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    const xml = await response.text()
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '')

    expect(locations.filter((url) => /\/vehicules\/[^/]+$/.test(url))).toHaveLength(10)
    for (const path of ['/vehicules', '/contact', '/mentions-legales', '/confidentialite', '/credits-photos']) {
      expect(locations.some((url) => url.endsWith(path))).toBe(true)
    }
    expect(locations.some((url) => url.includes('/reservation'))).toBe(false)
    expect(xml).toContain('<lastmod>')
  })

  test('every sitemap address answers 200', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1] || '/')
    expect(paths.length).toBeGreaterThan(10)
    for (const path of paths) expect((await request.get(path)).status(), path).toBe(200)
  })
})

test.describe('legal pages', () => {
  test('the footer links to both pages and says the agency is fictional', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toContainText('Site de démonstration : agence fictive')
    await footer.getByRole('link', { name: 'Mentions légales' }).click()
    await expect(page).toHaveURL(/\/mentions-legales$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeVisible()
  })

  test('the legal notice says it is a demonstration and credits third-party material', async ({ page }) => {
    await page.goto('/mentions-legales')
    const main = page.getByRole('main')
    await expect(main).toContainText("l'agence qu'il présente n'existe pas")
    await expect(main.getByRole('heading', { level: 2, name: 'Éditeur et responsable de la publication' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 2, name: 'Hébergement' })).toBeVisible()
    await expect(main).toContainText('Tabler Icons')
    await expect(main).toContainText('Wikimedia Commons')
    await expect(main.getByRole('link', { name: 'Crédits photos' })).toHaveAttribute('href', '/credits-photos')
  })

  test('the privacy policy describes what the forms really do', async ({ page }) => {
    await page.goto('/confidentialite')
    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { level: 1, name: 'Politique de confidentialité' })).toBeVisible()
    await expect(main).toContainText('Telegram')
    await expect(main).toContainText("n'enregistre votre message dans aucune base de données")
    await expect(main).toContainText('aucun cookie')
    await expect(main).toContainText("n'est chargée qu'après un clic")
    await expect(main.getByRole('link', { name: 'CNIL' })).toHaveAttribute('href', 'https://www.cnil.fr')
  })

  test('both forms point to the privacy policy', async ({ page }) => {
    for (const path of ['/contact', '/vehicules/renault-clio-tce-90/reservation']) {
      await page.goto(path)
      await expect(page.getByRole('link', { name: 'Politique de confidentialité' })).toHaveAttribute('href', '/confidentialite')
    }
  })

  test('the credits page also credits the icon and the fonts', async ({ page }) => {
    await page.goto('/credits-photos')
    await expect(page.getByRole('heading', { level: 2, name: 'Autres crédits' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Tabler Icons' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'SIL Open Font License 1.1' })).toBeVisible()
  })
})
