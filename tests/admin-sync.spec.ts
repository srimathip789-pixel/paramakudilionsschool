import { test, expect, Page } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

// ─── ADMIN SYNC END-TO-END TESTS ─────────────────────────────────────────────
test.describe('Admin to Public Sync Tests', () => {

  const TEST_PREFIX = '[TEST-E2E]';

  test.beforeEach(async ({ page }) => {
    // Skip if no credentials are provided
    if (!process.env.TEST_ADMIN_PASSWORD) {
      test.skip();
    }

    // 1. Log in as admin
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    
    const email = process.env.TEST_ADMIN_EMAIL || 'lionadmin';
    const password = process.env.TEST_ADMIN_PASSWORD || 'replace_with_actual_password';
    
    await page.fill('input[name="username"]', email);
    await page.fill('input[type="password"]', password); 
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
  });

  test('Create a Notice and verify it appears on the homepage', async ({ page }) => {
    const noticeTitle = `${TEST_PREFIX} Notice ${Date.now()}`;

    // 1. Create notice in admin
    await page.goto('/admin/notices');
    await waitForPageLoad(page);
    
    // Click Add Notice
    await page.click('button:has-text("Add Notice")');
    
    // Fill the form
    await page.fill('input[name="title"], input[placeholder*="title" i]', noticeTitle);
    await page.click('button[type="submit"]:has-text("Save")');
    
    // Wait for the success toast or the modal to close
    await expect(page.locator(`text=${noticeTitle}`).first()).toBeVisible();

    // 2. Verify on public homepage (Marquee or notice board)
    await page.goto('/');
    await waitForPageLoad(page);
    await expect(page.locator(`text=${noticeTitle}`).first()).toBeVisible();

    // 3. Cleanup: Delete the notice
    await page.goto('/admin/notices');
    await waitForPageLoad(page);
    // Find the row with our title and click its delete button
    const row = page.locator('tr, li').filter({ hasText: noticeTitle }).first();
    await row.locator('button:has(.lucide-trash2), button:has(.lucide-trash)').click();
    // Confirm delete if there's a modal
    const confirmBtn = page.locator('button:has-text("Delete"), button:has-text("Yes")').last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }
    
    // Ensure it's deleted
    await expect(page.locator(`text=${noticeTitle}`)).not.toBeVisible();
  });

  test('Create an Event and verify it appears on the events page', async ({ page }) => {
    const eventTitle = `${TEST_PREFIX} Event ${Date.now()}`;

    // 1. Create event in admin
    await page.goto('/admin/events');
    await waitForPageLoad(page);
    
    // Click Add Event
    await page.click('button:has-text("Add Event")');
    
    // Fill the form
    await page.fill('input[name="title"], input[placeholder*="title" i]', eventTitle);
    
    // Fill the date with today
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.isVisible()) {
      const today = new Date().toISOString().split('T')[0];
      await dateInput.fill(today);
    }

    await page.click('button[type="submit"]:has-text("Save")');
    await expect(page.locator(`text=${eventTitle}`).first()).toBeVisible();

    // 2. Verify on public events page
    await page.goto('/events');
    await waitForPageLoad(page);
    await expect(page.locator(`text=${eventTitle}`).first()).toBeVisible();

    // 3. Cleanup: Delete the event
    await page.goto('/admin/events');
    await waitForPageLoad(page);
    const row = page.locator('tr, li, div[class*="card"]').filter({ hasText: eventTitle }).first();
    await row.locator('button:has(.lucide-trash2), button:has(.lucide-trash)').click();
    
    const confirmBtn = page.locator('button:has-text("Delete"), button:has-text("Yes")').last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }
    
    await expect(page.locator(`text=${eventTitle}`)).not.toBeVisible();
  });

  test('Create a Staff member and verify they appear on the staff page', async ({ page }) => {
    const staffName = `${TEST_PREFIX} Staff ${Date.now()}`;
    const department = 'Office Staff';

    // 1. Create staff in admin
    await page.goto('/admin/staff');
    await waitForPageLoad(page);
    
    // Click Add Staff
    await page.click('button:has-text("Add Staff")');
    
    // Fill the form
    await page.fill('input[name="name"], input[placeholder*="name" i]', staffName);
    await page.fill('input[name="role"], input[placeholder*="role" i]', 'Test Coordinator');
    
    // Select department
    await page.selectOption('select[name="department"], select', { label: department });

    await page.click('button[type="submit"]:has-text("Save")');
    await expect(page.locator(`text=${staffName}`).first()).toBeVisible();

    // 2. Verify on public staff page
    await page.goto('/staff');
    await waitForPageLoad(page);
    await expect(page.locator(`text=${staffName}`).first()).toBeVisible();

    // 3. Cleanup: Delete the staff
    await page.goto('/admin/staff');
    await waitForPageLoad(page);
    const row = page.locator('tr, li').filter({ hasText: staffName }).first();
    await row.locator('button:has(.lucide-trash2), button:has(.lucide-trash)').click();
    
    const confirmBtn = page.locator('button:has-text("Delete"), button:has-text("Yes")').last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }
    
    await expect(page.locator(`text=${staffName}`)).not.toBeVisible();
  });

});
