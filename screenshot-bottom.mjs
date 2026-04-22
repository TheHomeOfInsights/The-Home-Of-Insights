import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/wnukm/.cache/puppeteer/chrome/win64-147.0.7727.56/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));

const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 600;
for (let y = 0; y <= pageHeight; y += step) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 150));
}
await new Promise(r => setTimeout(r, 1200));

// Screenshot bottom portion
await page.screenshot({ path: './temporary screenshots/bottom.png', clip: { x: 0, y: pageHeight - 1800, width: 1440, height: 1800 } });
await browser.close();
console.log('done');
