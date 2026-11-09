const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Clicking button...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="chatbot" i]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(1000);

    const info = await page.evaluate(() => {
      const container = document.querySelector('.fixed.z-50.flex.flex-col');
      const windowEl = document.querySelector('.chatbot-window-in');
      
      const getBox = (el) => {
        if (!el) return 'Not found';
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          rect: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
          },
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          zIndex: style.zIndex,
          position: style.position
        };
      };

      return {
        container: getBox(container),
        window: getBox(windowEl)
      };
    });

    console.log('Element geometry info:');
    console.log(JSON.stringify(info, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
