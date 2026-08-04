import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Accueil/)

    const heading = page.locator('h1').first()

    await expect(heading).toContainText(
      'équipe économique France en Tunisie accompagne tous vos projets',
    )
  })
})