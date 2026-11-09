const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const buttonHTML = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="chatbot" i]');
      return btn ? btn.outerHTML : 'Button not found';
    });
    console.log('Target Button HTML:', buttonHTML);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
