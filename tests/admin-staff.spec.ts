import { test, expect } from '@playwright/test';

test.describe('Admin Staff Management', () => {
  // Replace this with any login process or setting local storage if needed.
  // Assuming the page is accessible directly for test purposes or already has auth logic configured in the playwright setup.
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the staff admin page
    // Note: If auth is required, you may need a global setup or a login step here.
    await page.goto('/admin/staff');
    
    // Wait for the staff list to load (indicated by table or empty state)
    await page.waitForSelector('table, .lucide-user'); 
  });

  test('should create, edit, filter, and delete a staff member', async ({ page }) => {
    const testName = `Test Staff ${Date.now()}`;
    const newDepartment = 'Main Block Teachers';
    const updatedDepartment = 'K G Block Teachers';
    const testSubject = 'Playwright Automation';

    // 1. Create a new staff member
    await test.step('Create Staff', async () => {
      await page.getByRole('button', { name: /Add Staff Member/i }).click();
      await expect(page.getByRole('heading', { name: 'Add Staff Member' })).toBeVisible();

      await page.getByLabel(/Full Name/i).fill(testName);
      await page.getByLabel(/Department/i).selectOption(newDepartment);
      await page.getByLabel(/Subject Taught/i).fill(testSubject);
      await page.getByLabel(/Qualifications/i).fill('M.Sc Automation');
      await page.getByLabel(/Experience/i).fill('5 Years');
      
      await page.getByRole('button', { name: 'Add Staff Member', exact: true }).click();
      
      // Check for success toast
      await expect(page.getByText('Staff added successfully!')).toBeVisible();
      
      // Wait for modal to close
      await expect(page.getByRole('heading', { name: 'Add Staff Member' })).toBeHidden();
      
      // Verify new staff is in the list
      await expect(page.getByText(testName)).toBeVisible();
    });

    // 2. Test Filtering
    await test.step('Filter Staff by Department', async () => {
      const filterSelect = page.getByRole('combobox').nth(0); // Assuming it's the first select, or use a better selector if needed
      // Actually we can find it by its value or nearby text if necessary.
      // Let's use getByRole for combobox
      await filterSelect.selectOption(newDepartment);
      
      // Verify the new staff member is visible in this department
      await expect(page.getByText(testName)).toBeVisible();

      // Switch to a different department and verify they are NOT visible
      await filterSelect.selectOption('Principal');
      await expect(page.getByText(testName)).toBeHidden();

      // Switch back to "All Departments"
      await filterSelect.selectOption('all');
      await expect(page.getByText(testName)).toBeVisible();
    });

    // 3. Edit the staff member
    await test.step('Edit Staff', async () => {
      // Find the row containing our test staff member and click Edit
      const row = page.locator('tr').filter({ hasText: testName });
      await row.getByRole('button', { name: /Edit/i }).click();
      
      await expect(page.getByRole('heading', { name: 'Edit Staff Member' })).toBeVisible();

      // Change department
      await page.getByLabel(/Department/i).selectOption(updatedDepartment);
      
      await page.getByRole('button', { name: 'Update Staff' }).click();
      
      // Check for success toast
      await expect(page.getByText('Staff updated successfully!')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Edit Staff Member' })).toBeHidden();
      
      // Verify the change in the UI
      const updatedRow = page.locator('tr').filter({ hasText: testName });
      await expect(updatedRow.getByText(updatedDepartment)).toBeVisible();
    });

    // 4. Delete the staff member
    await test.step('Delete Staff', async () => {
      const row = page.locator('tr').filter({ hasText: testName });
      await row.getByRole('button', { name: /Delete/i }).click();
      
      // Click the confirmation check button
      await row.getByRole('button').filter({ has: page.locator('svg.lucide-check-circle') }).click();
      
      // Check for success toast
      await expect(page.getByText('Staff member deleted.')).toBeVisible();
      
      // Verify staff is no longer in the list
      await expect(page.getByText(testName)).toBeHidden();
    });
  });
});
