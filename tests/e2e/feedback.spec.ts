import { test, expect } from '@playwright/test';

test.describe('Feedback Submission', () => {
  test('User can submit feedback', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'existinguser@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.click('button:has-text("Feedback")');
    await page.fill('textarea[name="feedback"]', 'This is real E2E feedback at ' + Date.now());
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toContainText(['Thank you', 'Feedback received']);
  });
});
