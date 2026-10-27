import { expect, test } from '@playwright/test'

test.describe('vehicle detail page', () => {
  test('opens from the catalog and shows the full sheet', async ({ page }) => {
    await page.goto('/vehicules')
    await page.getByRole('article').filter({ hasText: 'BMW M4' }).getByRole('link', { name: 'BMW M4 Coupé', exact: true }).click()

    await expect(page).toHaveURL(/\/vehicules\/bmw-m4-competition$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('BMW M4')
    await expect(page.getByText('Coupé de 530 ch à propulsion')).toBeVisible()
    await expect(page.getByRole('term').filter({ hasText: 'Puissance' })).toBeVisible()
    await expect(page.getByText('530 ch', { exact: true })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'Head-up display' })).toBeVisible()
    await expect(page.getByText('Conducteur de 25 ans minimum')).toBeVisible()
    await expect(page.getByText('5 ans de permis minimum')).toBeVisible()
  })

  test('gives example rental lengths computed from the daily price', async ({ page }) => {
    await page.goto('/vehicules/bmw-m4-competition')
    const examples = page.getByRole('table')
    await expect(examples.getByRole('row').filter({ hasText: '1 jour' })).toContainText('300')
    await expect(examples.getByRole('row').filter({ hasText: '3 jours' })).toContainText('900')
    await expect(examples.getByRole('row').filter({ hasText: '7 jours' })).toContainText('2 100')
  })

  test('leads to the reservation form of that vehicle', async ({ page }) => {
    await page.goto('/vehicules/renault-clio-tce-90')
    await page.getByRole('link', { name: /Demander une réservation : Renault Clio/ }).click()
    await expect(page).toHaveURL(/\/vehicules\/renault-clio-tce-90\/reservation$/)
    await expect(page.getByRole('link', { name: 'Voir la fiche du véhicule' })).toBeVisible()
  })

  test('shows the return date of an unavailable vehicle', async ({ page }) => {
    await page.goto('/vehicules/bmw-x3-20d-xdrive')
    await expect(page.getByText("Indisponible jusqu'au 4 novembre 2026")).toBeVisible()
  })

  test('suggests other vehicles of the same category', async ({ page }) => {
    await page.goto('/vehicules/bmw-m4-competition')
    const similar = page.getByRole('region', { name: /Autres véhicules : Sportive/ })
    await expect(similar.getByRole('link')).toHaveCount(2)
  })

  test('answers 404 for an unknown vehicle', async ({ page }) => {
    const response = await page.goto('/vehicules/does-not-exist')
    expect(response?.status()).toBe(404)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the sheet is fully readable', async ({ page }) => {
      await page.goto('/vehicules/audi-q5-tdi-quattro')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Audi Q5')
      await expect(page.getByRole('heading', { name: 'Caractéristiques' })).toBeVisible()
    })
  })
})
