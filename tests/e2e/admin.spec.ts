import { test, expect } from '@playwright/test';

test.describe('Admin Actions', () => {
  test('Admin can moderate and view audit logs', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(['Admin', 'Moderation']);
    await page.click('button:has-text("Approve")');
    await expect(page.locator('.status')).toContainText(['Approved']);
    await page.click('nav >> text=Audit Logs');
    await expect(page.locator('h2')).toContainText(['Audit Logs']);
  });
});
