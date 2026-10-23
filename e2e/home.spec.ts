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
})
