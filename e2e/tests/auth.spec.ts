import { test, expect } from '@playwright/test';

test.describe('Authentication & Navigation Smoke Tests', () => {

  test('Student login redirects to Student Dashboard', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    // Select Student Role or enter credentials
    await page.fill('input[placeholder*="المستخدم"]', 'student');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');

    // Expect navigation to /student dashboard
    await expect(page).toHaveURL(/.*student/);
  });

  test('Teacher login redirects to Teacher Dashboard', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.fill('input[placeholder*="المستخدم"]', 'teacher');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*teacher/);
  });

  test('Unauthenticated user cannot access protected dashboard', async ({ page }) => {
    await page.goto('http://localhost:8080/admin');
    // Expect redirect back to login
    await expect(page).toHaveURL('http://localhost:8080/');
  });

});
