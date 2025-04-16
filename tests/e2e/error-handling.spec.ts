import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('Displays error for invalid login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'invaliduser@example.com');
    await page.fill('input[name="password"]', 'WrongPassword!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toContainText(['Invalid', 'incorrect']);
  });

  test('Handles 404 for unknown routes', async ({ page }) => {
    await page.goto('/some/nonexistent/path');
    await expect(page.locator('h1')).toContainText(['404', 'Not Found']);
  });
});
