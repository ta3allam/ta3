import { test, expect } from '@playwright/test';

test.describe('Assignment PDF/ZIP Submissions & Teacher Grading E2E Flow', () => {
  test('Student can navigate to course assignment and view PDF/ZIP upload dropzone', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.fill('input[placeholder*="المستخدم"]', 'student');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*student/);
    await page.goto('http://localhost:8080/student/courses/1');

    await page.click('text=الواجبات والتكليفات');
    await expect(page.locator('text=تسليم الواجب وعرض التقييم')).toBeVisible();
    await page.click('text=تسليم الواجب وعرض التقييم');
    await expect(page.locator('text=رفع ملف الواجب')).toBeVisible();
    await expect(page.locator('text=PDF أو ZIP')).toBeVisible();
  });
});
