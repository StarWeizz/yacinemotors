import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const PAGES = [
  '/',
  '/vehicules',
  '/vehicules?categorie=SUV&tri=prix-asc',
  '/vehicules?categorie=Citadine&prixMax=10',
  '/vehicules/bmw-m4-competition',
  '/vehicules/bmw-x3-20d-xdrive',
  '/vehicules/renault-clio-tce-90/reservation',
  '/contact',
  '/credits-photos',
  '/mentions-legales',
  '/confidentialite',
  '/adresse-inconnue',
]

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

const scan = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  return violations.map(
    (violation) => `${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes[0]?.target.join(' ')}`,
  )
}

test.describe('automated checks (axe-core, WCAG 2.2 AA)', () => {
  // Animations are off here so the scan never reads a half-faded element; the reduced-motion path is
  // part of what is checked. Start states under animation are covered by the dedicated home test below.
  test.use({ reducedMotion: 'reduce' })

  for (const path of PAGES) {
    test(`no violation on ${path}`, async ({ page }) => {
      await page.goto(path)
      expect(await scan(page)).toEqual([])
    })

    test(`no violation on ${path} on a phone`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(path)
      expect(await scan(page)).toEqual([])
    })
  }
})

test('the home page has no violation once its animations have finished', async ({ page }) => {
  await page.goto('/')
  const word = page.locator('h1 .hero-word__inner').last()
  await expect
    .poll(() => word.evaluate((element) => Math.round(element.getBoundingClientRect().top - (element.parentElement?.getBoundingClientRect().top ?? 0))))
    .toBe(0)
  expect(await scan(page)).toEqual([])
})

test.describe('what automated tools do not check', () => {
  for (const path of PAGES.filter((page) => page !== '/adresse-inconnue')) {
    test(`reflows at 320 px without horizontal scroll: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 })
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }

  test('unknown addresses use the site layout: language, main landmark and a way back', async ({ page }) => {
    const response = await page.goto('/adresse-inconnue')
    expect(response?.status()).toBe(404)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.getByRole('main').getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Voir le catalogue' })).toBeVisible()
  })

  test('the skip link is the first stop and moves focus to the main content', async ({ page }) => {
    await page.goto('/vehicules')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Aller au contenu' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('main')).toBeFocused()
  })

  test('every keyboard stop on the home page shows a focus indicator', async ({ page }) => {
    await page.goto('/')
    for (let stop = 0; stop < 12; stop += 1) {
      await page.keyboard.press('Tab')
      const outline = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement ?? document.body)
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
      })
      expect(outline.style).not.toBe('none')
      expect(outline.width).toBeGreaterThanOrEqual(2)
    }
  })

  test('placeholder text keeps enough contrast', async ({ page }) => {
    await page.goto('/vehicules')
    const color = await page.locator('input[name="prixMax"]').evaluate((input) => getComputedStyle(input, '::placeholder').color)
    // Solid steel grey (#6a7077), not the browser's 50 % transparent default.
    expect(color).toBe('rgb(106, 112, 119)')
  })

  test('server-side form errors move focus to the first field in error', async ({ page }) => {
    await page.goto('/contact')
    await page.locator('form').evaluate((form) => form.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: 'Envoyer le message' }).click()
    const name = page.getByLabel(/^Nom/)
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toBeFocused()
  })

  test('small targets: the availability checkbox row is at least 24 px tall', async ({ page }) => {
    await page.goto('/vehicules')
    const box = await page.getByLabel('Disponibles uniquement').locator('xpath=ancestor::label').boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24)
  })
})
