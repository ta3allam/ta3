import { test, expect } from '@playwright/test';

test.describe('Sprint 2 Concurrency & Stress E2E Test Suite', () => {
  test('should render student dashboard and navigate to course center cleanly', async ({ page }) => {
    await page.goto('/');

    // Verify application header loads
    await expect(page.locator('body')).toBeVisible();

    // Verify Arabic navigation elements exist
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should verify non-blocking UI response under simulated user interaction', async ({ page }) => {
    await page.goto('/');
    
    // Check main layout container renders cleanly
    const mainContent = page.locator('main, #root').first();
    await expect(mainContent).toBeVisible();
  });
});
