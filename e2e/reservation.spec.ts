import { expect, test } from '@playwright/test'
import { inDays } from './support/dates'
import { messageCount, uniqueMarker, waitForMessage } from './support/telegram'

test.describe('reservation request (F4)', () => {
  test('the button on a vehicle opens its reservation form', async ({ page }) => {
    await page.goto('/vehicules')
    await page.getByRole('link', { name: 'Demander une réservation : Renault Clio' }).click()

    await expect(page).toHaveURL(/\/vehicules\/renault-clio-tce-90\/reservation$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Demander une réservation' })).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'Véhicule demandé' })).toContainText('Renault Clio')
  })

  test('sends the request with an estimate computed from the database', async ({ page, request }) => {
    const marker = uniqueMarker('resa')
    await page.goto('/vehicules/renault-clio-tce-90/reservation')

    await page.getByLabel('Départ').fill(inDays(10))
    await page.getByLabel('Retour').fill(inDays(13))
    await page.getByLabel('Nom').fill(`Karim ${marker}`)
    await page.getByLabel('E-mail').fill('karim@example.com')
    await page.getByLabel('Téléphone').fill('06 12 34 56 78')
    await page.getByLabel('Âge du conducteur').fill('30')
    await page.getByLabel('Années de permis').fill('8')
    await page.getByRole('button', { name: 'Envoyer la demande' }).click()

    await expect(page.getByRole('status')).toContainText('demande de réservation a bien été envoyée')

    const sent = await waitForMessage(request, marker)
    expect(sent.text).toContain('Renault Clio')
    expect(sent.text).toContain('3 jours')
    expect(sent.text).toContain('135') // 3 days x 45 EUR, from the database
    expect(sent.text).toContain('indicatif')
  })

  test('refuses a driver younger than the vehicle requires', async ({ page, request }) => {
    const marker = uniqueMarker('young')
    await page.goto('/vehicules/audi-rs3-sportback/reservation')

    await page.getByLabel('Départ').fill(inDays(10))
    await page.getByLabel('Retour').fill(inDays(12))
    await page.getByLabel('Nom').fill(marker)
    await page.getByLabel('E-mail').fill('jeune@example.com')
    await page.getByLabel('Téléphone').fill('0612345678')
    await page.getByLabel('Âge du conducteur').fill('22')
    await page.getByLabel('Années de permis').fill('2')
    await page.getByRole('button', { name: 'Envoyer la demande' }).click()

    const form = page.getByRole('region', { name: 'Formulaire de réservation' })
    await expect(form.getByText('conducteurs de 25 ans minimum')).toBeVisible()
    await expect(form.getByText('exige 5 ans de permis minimum')).toBeVisible()
    expect(await messageCount(request, marker)).toBe(0)
  })

  test('ignores a price sent by the client', async ({ request, baseURL }) => {
    const marker = uniqueMarker('price')
    const response = await request.post('/api/reservation', {
      headers: { Origin: baseURL ?? '', Accept: 'application/json' },
      data: {
        vehicleSlug: 'renault-clio-tce-90',
        name: marker,
        email: 'karim@example.com',
        phone: '0612345678',
        startDate: inDays(10),
        endDate: inDays(11),
        driverAge: '30',
        licenseYears: '8',
        pricePerDay: '1',
        total: '1',
      },
    })
    expect(response.status()).toBe(200)
    const sent = await waitForMessage(request, marker)
    expect(sent.text).toContain('45')
  })

  test('answers 404 for an unknown vehicle', async ({ page }) => {
    const response = await page.goto('/vehicules/does-not-exist/reservation')
    expect(response?.status()).toBe(404)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the request can be sent with a plain form post', async ({ page, request }) => {
      const marker = uniqueMarker('resa-nojs')
      await page.goto('/vehicules/renault-clio-tce-90/reservation')
      await page.getByLabel('Départ').fill(inDays(20))
      await page.getByLabel('Retour').fill(inDays(22))
      await page.getByLabel('Nom').fill(marker)
      await page.getByLabel('E-mail').fill('karim@example.com')
      await page.getByLabel('Téléphone').fill('0612345678')
      await page.getByLabel('Âge du conducteur').fill('35')
      await page.getByLabel('Années de permis').fill('10')
      await page.getByRole('button', { name: 'Envoyer la demande' }).click()

      await expect(page).toHaveURL(/reservation\?envoye=1$/)
      await expect(page.getByRole('status')).toContainText('a bien été envoyée')
      await waitForMessage(request, marker)
    })
  })
})
