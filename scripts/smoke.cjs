// Install playwright-core in the test environment, or set PLAYWRIGHT_MODULE to its path.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    await page.getByRole('button', { name: 'Switch to Russian' }).click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    await page.locator('[data-step="2"]').click();
    assert.match(await page.locator('#step-description').textContent(), /скриншоты/);
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    await page.locator('[data-step="2"]').click();
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}`);
    }
    await page.getByRole('button', { name: 'Switch to English' }).click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.match(await page.locator('#step-description').textContent(), /screenshots/);
    assert.deepEqual(errors, []);
    console.log('PASS: languages, workflow, persistence, viewport widths and page errors');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
