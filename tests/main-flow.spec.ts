import { test, expect } from '@playwright/test';

test.describe('Main Flow Scenarios', () => {
  
  test('Homepage loads correctly and has correct Navigation items', async ({ page }) => {
    await page.goto('/');
    
    // Check main logo is visible
    const logo = page.locator('img[alt="Paramakudi Lions School Logo"]');
    await expect(logo).toBeVisible();

    // Check navbar contains specific items
    const nav = page.locator('nav'); // Assuming there's a nav tag, or we just check the body text
    await expect(page.getByText('Videos', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Photos', { exact: true }).first()).toBeVisible();

    // Verify Admin link is hidden from public navigation
    await expect(page.getByText('Admin', { exact: true })).not.toBeVisible();
  });

  test('Footer contains correct links and no Admin link', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Ensure Videos is in footer
    await expect(footer.getByRole('link', { name: 'Videos' })).toBeVisible();
    
    // Ensure Admin Login is NOT in footer
    await expect(footer.getByRole('link', { name: 'Admin Login' })).not.toBeVisible();
  });

  test('Videos page loads', async ({ page }) => {
    await page.goto('/videos');
    await expect(page.locator('h1').first()).toContainText('Videos');
  });

  test('Admin dashboard is protected and redirects to login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    // Should redirect to login
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
