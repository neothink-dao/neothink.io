import { test, expect } from '@playwright/test';
test.describe('Dashboard Navigation', () => {
    test('User can navigate main dashboard sections', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[name="email"]', 'existinguser@example.com');
        await page.fill('input[name="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard', { timeout: 10000 });
        await expect(page.locator('h1')).toContainText(['Dashboard', 'Home']);
        await page.click('nav >> text=Profile');
        await expect(page.locator('h2')).toContainText(['Profile']);
        await page.click('nav >> text=Settings');
        await expect(page.locator('h2')).toContainText(['Settings']);
    });
});
//# sourceMappingURL=dashboard.spec.js.map