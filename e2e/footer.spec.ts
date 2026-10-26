import { expect, test } from '@playwright/test'

test.describe('footer and photo credits', () => {
  test('shows navigation and the rental conditions of the fleet', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('link', { name: 'Catalogue' })).toBeVisible()
    await expect(footer.getByText('Conditions de location')).toBeVisible()
    await expect(footer).toContainText('Caution de 800')
    await expect(footer).toContainText('inclus par jour')
    await expect(footer.getByRole('link', { name: "Écrire à l'agence" })).toHaveAttribute('href', '/contact')
  })

  test('does not invent contact details the agency has not provided', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer.locator('a[href^="tel:"]')).toHaveCount(0)
    await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(0)
  })

  test('credits the author and licence of every photo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('contentinfo').getByRole('link', { name: 'Crédits photos' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Crédits photos' })).toBeVisible()
    await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(11)
    await expect(page.getByRole('main').getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveCount(11)
  })
})
