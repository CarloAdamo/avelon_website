// Screenshot a 1920×1080 start frame for a film clip from the dev-only /capture route.
// Usage: npm run dev   (in another shell), then
//        node scripts/film/frame.mjs build frame-build.png   (scene: title | build)
// Needs puppeteer-core (npx -y -p puppeteer-core node ..., or a scratch install) and Google Chrome.
import puppeteer from 'puppeteer-core';

const [, , scene = 'build', out = `frame-${scene}.png`] = process.argv;
const BASE = process.env.CAPTURE_URL || 'http://localhost:5173';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(`${BASE}/capture?scene=${scene}`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));
const stage = await page.$('#capture-stage');
if (!stage) throw new Error('No #capture-stage: the /capture route exists only under `npm run dev`.');
await stage.screenshot({ path: out });
await browser.close();
console.log(out);
