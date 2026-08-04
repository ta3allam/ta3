import { test, expect } from '@playwright/test';

test.describe('Student Dashboard Features & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.fill('input[placeholder*="المستخدم"]', 'student');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*student/);
  });

  test('Displays welcome banner and student KPI metrics cards', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('أهلاً، سامي الطالب');
    await expect(page.locator('text=المقررات المسجلة')).toBeVisible();
    await expect(page.locator('text=إجمالي الواجبات')).toBeVisible();
    await expect(page.locator('text=المحاضرات المتاحة')).toBeVisible();
  });

  test('Displays course cards and navigates on click', async ({ page }) => {
    const courseCard = page.locator('text=مبادئ البرمجة').first();
    await expect(courseCard).toBeVisible();
    await courseCard.click();
    await expect(page).toHaveURL(/.*student\/courses\/1/);
  });
});
