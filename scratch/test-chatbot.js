const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow hydration

    console.log('Clicking chatbot button via DOM click...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="chatbot" i]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(1000); // Wait for transition

    console.log('Taking screenshot of open chatbot...');
    await page.screenshot({ path: 'scratch/chatbot-open-screenshot.png' });
    console.log('Screenshot saved to scratch/chatbot-open-screenshot.png');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
