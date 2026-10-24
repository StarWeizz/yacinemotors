import { expect, test } from '@playwright/test'

test.describe('catalog', () => {
  test('lists the 10 vehicles of the provided catalog', async ({ page }) => {
    await page.goto('/vehicules')
    await expect(page.getByRole('article')).toHaveCount(10)
  })

  test('shows price, deposit and included kilometers', async ({ page }) => {
    await page.goto('/vehicules')
    const clio = page.getByRole('article').filter({ hasText: 'Renault Clio' })
    await expect(clio).toContainText('45')
    await expect(clio).toContainText('Caution')
    await expect(clio).toContainText('250 km')
  })

  test('shows the return date of an unavailable vehicle', async ({ page }) => {
    await page.goto('/vehicules')
    const x3 = page.getByRole('article').filter({ hasText: 'BMW X3' })
    await expect(x3).toContainText("Indisponible jusqu'au 4 novembre 2026")
  })

  test('shows driver conditions for sports cars', async ({ page }) => {
    await page.goto('/vehicules')
    const m4 = page.getByRole('article').filter({ hasText: 'BMW M4' })
    await expect(m4).toContainText('Conducteur de 25 ans minimum')
    await expect(m4).toContainText('5 ans de permis minimum')
  })

  test('shows a placeholder instead of broken images', async ({ page }) => {
    await page.goto('/vehicules')
    await expect(page.locator('article img')).toHaveCount(0)
    await expect(page.getByRole('img', { name: /Visuel à venir/ })).toHaveCount(10)
  })
})

test.describe('progressive enhancement', () => {
  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the catalog is fully readable', async ({ page }) => {
      await page.goto('/vehicules')
      await expect(page.getByRole('article')).toHaveCount(10)
      await expect(page.getByRole('article').first()).toBeVisible()
    })
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('cards are visible immediately', async ({ page }) => {
      await page.goto('/vehicules')
      await expect(page.getByRole('article').first()).toHaveCSS('opacity', '1')
    })
  })
})
