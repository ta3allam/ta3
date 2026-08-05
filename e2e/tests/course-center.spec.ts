import { test, expect } from '@playwright/test';

test.describe('Course Center & Material Viewer E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.fill('input[placeholder*="المستخدم"]', 'student');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*student/);
    await page.goto('http://localhost:8080/student/courses/1');
  });

  test('Renders Course Center header and tabs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('مبادئ البرمجة');
    await expect(page.locator('text=الرئيسية')).toBeVisible();
    await expect(page.locator('text=المحتوى والمحاضرات')).toBeVisible();
    await expect(page.locator('text=الواجبات والتكليفات')).toBeVisible();
  });

  test('Filters lectures by search query', async ({ page }) => {
    await page.click('text=المحتوى والمحاضرات');
    const searchInput = page.locator('input[placeholder*="بحث في المحاضرات"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('مقدمة');
    await expect(page.locator('text=مقدمة في البرمجة')).toBeVisible();
  });
});
