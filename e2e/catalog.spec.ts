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

test.describe('filters and sort', () => {
  test('filters by category through the URL', async ({ page }) => {
    await page.goto('/vehicules')
    await page.getByLabel('Catégorie').selectOption('SUV')
    await page.getByRole('button', { name: 'Appliquer' }).click()
    await expect(page).toHaveURL(/categorie=SUV/)
    await expect(page.getByRole('article')).toHaveCount(3)
    await expect(page.getByRole('status')).toHaveText('3 véhicules sur 10')
  })

  test('keeps only available vehicles', async ({ page }) => {
    await page.goto('/vehicules?disponibles=1')
    await expect(page.getByRole('article')).toHaveCount(9)
    await expect(page.getByRole('article').filter({ hasText: 'BMW X3' })).toHaveCount(0)
  })

  test('combines a maximum price and a gearbox', async ({ page }) => {
    await page.goto('/vehicules?prixMax=100&boite=Manuelle')
    await expect(page.getByRole('article')).toHaveCount(1)
    await expect(page.getByRole('article')).toContainText('Renault Clio')
  })

  test('sorts by descending price', async ({ page }) => {
    await page.goto('/vehicules?tri=prix-desc')
    await expect(page.getByRole('article').first()).toContainText('BMW M4')
    await expect(page.getByRole('article').last()).toContainText('Renault Clio')
  })

  test('explains an empty result and lets the visitor reset', async ({ page }) => {
    await page.goto('/vehicules?categorie=Citadine&prixMax=10')
    await expect(page.getByRole('article')).toHaveCount(0)
    await expect(page.getByText('Aucun véhicule ne correspond')).toBeVisible()
    await page.getByRole('link', { name: 'Réinitialiser' }).click()
    await expect(page.getByRole('article')).toHaveCount(10)
  })

  test('ignores invalid parameters instead of failing', async ({ page }) => {
    const response = await page.goto('/vehicules?categorie=Tank&prixMax=abc&tri=hack')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('article')).toHaveCount(10)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the form still filters', async ({ page }) => {
      await page.goto('/vehicules')
      await page.getByLabel('Catégorie').selectOption('Sportive')
      await page.getByRole('button', { name: 'Appliquer' }).click()
      await expect(page.getByRole('article')).toHaveCount(3)
    })
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
