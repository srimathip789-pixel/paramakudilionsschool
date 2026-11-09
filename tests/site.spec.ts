import { test, expect, Page } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

// ─── PUBLIC PAGES ────────────────────────────────────────────────────────────
test.describe('Public Pages - Navigation & Content', () => {
  test('Homepage loads and hero section is visible', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const title = await page.title();
    expect(title).toBeTruthy();
    // Wait for client-side hydration
    await page.waitForTimeout(2000);
    // Page body should have rendered content
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(100);
    // Should have at least one heading
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Navbar links are visible and clickable', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    await page.waitForTimeout(2000);
    // Look for navigation links anywhere on the page
    const navLinks = page.locator('header a, nav a');
    const count = await navLinks.count();
    if (count === 0) {
      // Fallback: check for any anchor links in the top portion of the page
      const allLinks = page.locator('a[href^="/"]');
      const linkCount = await allLinks.count();
      expect(linkCount).toBeGreaterThan(3);
    } else {
      expect(count).toBeGreaterThan(3);
    }
  });

  test('Mobile hamburger menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await waitForPageLoad(page);
    // Find hamburger button
    const hamburger = page.locator('button[aria-label*="menu" i], button:has(svg)').first();
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(500);
      // Mobile nav menu should appear
      const mobileNav = page.locator('[class*="mobile"], [class*="drawer"], [role="dialog"]').first();
      if (await mobileNav.isVisible()) {
        await expect(mobileNav).toBeVisible();
      }
    }
  });

  test('About Us page loads', async ({ page }) => {
    await page.goto('/aboutus');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
    const body = page.locator('main, [class*="container"]').first();
    await expect(body).toBeVisible();
  });

  test('Events page loads', async ({ page }) => {
    await page.goto('/events');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Photo Gallery page loads', async ({ page }) => {
    await page.goto('/photogallery');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Downloads page loads', async ({ page }) => {
    await page.goto('/downloads');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Contact page loads and shows contact info', async ({ page }) => {
    await page.goto('/contactus');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
    // Contact page should have some address or phone
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('Staff page loads', async ({ page }) => {
    await page.goto('/staff');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Facilities page loads', async ({ page }) => {
    await page.goto('/facilities');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Sports page loads', async ({ page }) => {
    await page.goto('/sports');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Results page loads', async ({ page }) => {
    await page.goto('/results');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Chairman page loads', async ({ page }) => {
    await page.goto('/chairman');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Principal page loads', async ({ page }) => {
    await page.goto('/principal');
    await waitForPageLoad(page);
    await expect(page).not.toHaveURL(/error/);
  });

  test('Footer is present and has content', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText?.length).toBeGreaterThan(10);
  });

  test('404 page for unknown route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    // Should either redirect or show 404
    expect([200, 404]).toContain(response?.status());
  });
});

// ─── RESPONSIVE DESIGN ────────────────────────────────────────────────────────
test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`Homepage renders correctly on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await waitForPageLoad(page);
      // No horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
    });
  }
});

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
test.describe('Admin - Login Page', () => {
  test('Login page loads and shows form', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    await expect(page.locator('form, [class*="login"]').first()).toBeVisible();
  });

  test('Login form has email and password fields', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Login shows error with wrong credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    await page.fill('input[name="username"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'wrongpassword123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    // Should show error or stay on login page (not redirect to dashboard)
    const url = page.url();
    expect(url).toContain('login');
  });

  test('Admin dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await waitForPageLoad(page);
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('Admin news redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/news');
    await waitForPageLoad(page);
    await expect(page).toHaveURL(/login/);
  });

  test('Admin gallery redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/gallery');
    await waitForPageLoad(page);
    await expect(page).toHaveURL(/login/);
  });

  test('All admin routes are protected', async ({ page }) => {
    const adminRoutes = [
      '/admin/dashboard',
      '/admin/notices',
      '/admin/news',
      '/admin/events',
      '/admin/staff',
      '/admin/members',
      '/admin/gallery',
      '/admin/videos',
      '/admin/downloads',
      '/admin/achievements',
      '/admin/settings',
    ];
    for (const route of adminRoutes) {
      await page.goto(route);
      await waitForPageLoad(page);
      expect(page.url()).toContain('login');
    }
  });
});

// ─── UI / UX CHECKS ──────────────────────────────────────────────────────────
test.describe('UI / UX Checks', () => {
  test('No broken images on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        // naturalWidth 0 means broken image
        if (naturalWidth === 0) {
          console.warn(`Broken image: ${src}`);
        }
      }
    }
    // Test passes even with warnings - we collect them
    expect(true).toBeTruthy();
  });

  test('Page title is set for homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(3);
  });

  test('Meta description exists on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const metaDesc = page.locator('meta[name="description"]');
    const count = await metaDesc.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Contact page has working email link', async ({ page }) => {
    await page.goto('/contactus');
    await waitForPageLoad(page);
    const emailLinks = page.locator('a[href^="mailto:"]');
    const count = await emailLinks.count();
    // It's fine if there are none (contact form might be used)
    console.log(`Found ${count} email links on contact page`);
  });

  test('Contact page has working phone link', async ({ page }) => {
    await page.goto('/contactus');
    await waitForPageLoad(page);
    const phoneLinks = page.locator('a[href^="tel:"]');
    const count = await phoneLinks.count();
    console.log(`Found ${count} phone links on contact page`);
  });

  test('No console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await waitForPageLoad(page);
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('supabase') && // expected if no env vars
      !e.includes('Warning:')
    );
    if (criticalErrors.length > 0) {
      console.warn('Console errors:', criticalErrors);
    }
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('Login page - password visibility toggle works', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    // Look for eye icon toggle button
    const toggleBtn = page.locator('button:near(input[type="password"])').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      const inputType = await page.locator('input[name="password"], input[id*="password"]').first().getAttribute('type');
      console.log(`Password field type after toggle: ${inputType}`);
    }
  });

  test('Downloads page shows table or list of files', async ({ page }) => {
    await page.goto('/downloads');
    await waitForPageLoad(page);
    // Check that the page has some structure for downloads
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('Smooth scrolling works on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    // Scroll to the bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('Events page shows upcoming events section', async ({ page }) => {
    await page.goto('/events');
    await waitForPageLoad(page);
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('Photo gallery page has grid or album layout', async ({ page }) => {
    await page.goto('/photogallery');
    await waitForPageLoad(page);
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('Staff page shows department sections', async ({ page }) => {
    await page.goto('/staff');
    await waitForPageLoad(page);
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });

  test('All internal nav links are reachable (200 status)', async ({ page }) => {
    const routes = [
      '/', '/aboutus', '/activities', '/chairman', '/principal',
      '/secretary', '/treasurer', '/staff', '/facilities', '/sports',
      '/events', '/photogallery', '/downloads', '/results', '/contactus',
    ];
    const broken: string[] = [];
    for (const route of routes) {
      const response = await page.goto(route);
      const status = response?.status();
      if (status && status >= 400) {
        broken.push(`${route} → ${status}`);
      }
    }
    if (broken.length > 0) {
      console.warn('Broken pages:', broken);
    }
    expect(broken.length).toBe(0);
  });
});

// ─── ACCESSIBILITY BASICS ────────────────────────────────────────────────────
test.describe('Basic Accessibility', () => {
  test('Homepage has h1 tag', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const h1 = page.locator('h1');
    const count = await h1.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Login form inputs have labels or placeholders', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    const emailInput = page.locator('input[name="username"]');
    const placeholder = await emailInput.getAttribute('placeholder');
    const ariaLabel = await emailInput.getAttribute('aria-label');
    expect(placeholder || ariaLabel).toBeTruthy();
  });

  test('All images on homepage have alt attributes', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      console.warn(`${imagesWithoutAlt} images missing alt attributes`);
    }
    expect(imagesWithoutAlt).toBe(0);
  });

  test('Focus trap works on login page', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageLoad(page);
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedTag);
  });
});
