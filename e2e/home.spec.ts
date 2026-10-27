import { expect, test } from '@playwright/test'

test.describe('home page', () => {
  test('presents the agency and links to the catalog', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Marseille')
    await expect(page.getByRole('heading', { name: 'Notre sélection' })).toBeVisible()

    await page.getByRole('link', { name: 'Parcourir le catalogue' }).click()
    await expect(page).toHaveURL(/\/vehicules$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Catalogue' })).toBeVisible()
  })

  test('has a skip link and a main landmark', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeAttached()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('marks the current page in the navigation and keeps the header actions', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Navigation principale' })
    await expect(nav.getByRole('link', { name: 'Accueil' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Catalogue' })).not.toHaveAttribute('aria-current', 'page')

    await nav.getByRole('link', { name: 'Catalogue' }).click()
    await expect(nav.getByRole('link', { name: 'Catalogue' })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('banner').getByRole('link', { name: 'Voir les véhicules disponibles' })).toBeVisible()
  })

  test('the hero background is decorative and does not hide the title', async ({ page }) => {
    await page.goto('/')
    const background = page.locator('section img[src*="hero-route-des-cretes"]')
    await expect(background).toHaveAttribute('alt', '')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('the hero title unmasks itself even when the scripts fail to load', async ({ page }) => {
    await page.route('**/_next/static/**/*.js', (route) => route.abort())
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // How far the word sits below its mask, measured on screen (works whichever CSS property moves it).
    const word = page.locator('h1 .hero-word__inner').first()
    const offset = () =>
      word.evaluate((element) => {
        const mask = element.parentElement
        return mask ? Math.round(element.getBoundingClientRect().top - mask.getBoundingClientRect().top) : -1
      })

    // Masked at first (proves the scripts really are blocked), then the CSS fail-safe reveals it.
    expect(await offset()).toBeGreaterThan(0)
    await expect.poll(offset, { timeout: 6000 }).toBe(0)
  })
})
