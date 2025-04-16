import { test, expect } from '@playwright/test';

test.describe('User Onboarding', () => {
  test('New user completes onboarding flow', async ({ page }) => {
    await page.goto('/auth/sign-up');
    await page.fill('input[name="email"]', 'onboard+' + Date.now() + '@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/onboarding', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(['Onboarding', 'Welcome']);
    await page.click('button:has-text("Continue")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(['Dashboard', 'Home']);
  });
});
