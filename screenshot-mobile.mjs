import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/G.Berbenkov/Desktop/Agros.net/node_modules/puppeteer-core');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

function getNextFilename(label) {
  const files = fs.existsSync(screenshotDir) ? fs.readdirSync(screenshotDir).filter(f => f.startsWith('screenshot-')) : [];
  let max = 0;
  files.forEach(f => { const m = f.match(/screenshot-(\d+)/); if (m) max = Math.max(max, parseInt(m[1])); });
  const n = max + 1;
  return label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
}

const url = process.argv[2] || 'http://localhost:3001';
const label = process.argv[3] || 'mobile';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const filename = getNextFilename(label);
const filepath = path.join(screenshotDir, filename);
await page.screenshot({ path: filepath, fullPage: true });
console.log(`Screenshot saved: temporary screenshots/${filename}`);
await browser.close();
