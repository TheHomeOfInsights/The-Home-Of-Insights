import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

// Auto-increment filename
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
const filename = `screenshot-${n}${label ? '-' + label : ''}.png`;
const outPath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/wnukm/.cache/puppeteer/chrome/win64-147.0.7727.56/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 800));

// Scroll through page to trigger IntersectionObserver reveals
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 600;
for (let y = 0; y <= pageHeight; y += step) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 120));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 2500)); // let final animations (counters etc) settle

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
