import { test, expect } from '@playwright/test';
// This test assumes a real Supabase backend and real user flows.
test.describe('Authentication Flows', () => {
    test('User can sign up, log in, and see dashboard', async ({ page }) => {
        await page.goto('/auth/sign-up');
        await page.fill('input[name="email"]', 'e2euser+' + Date.now() + '@example.com');
        await page.fill('input[name="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        // Wait for redirect or dashboard
        await page.waitForURL('**/dashboard', { timeout: 15000 });
        await expect(page.locator('h1')).toContainText(['Dashboard', 'Welcome']);
    });
    test('User can log out and is redirected to login', async ({ page }) => {
        await page.goto('/dashboard');
        await page.click('button:has-text("Log Out")');
        await page.waitForURL('**/auth/login', { timeout: 10000 });
        await expect(page.locator('h1')).toContainText(['Sign In', 'Login']);
    });
});
//# sourceMappingURL=auth.spec.js.map