// Headless web smoke: serves the exported web build (apps/mobile/dist) with the
// cross-origin-isolation headers expo-sqlite's WASM/OPFS engine needs, then drives
// the real app through onboarding -> tick every task -> celebration -> reload,
// asserting the SQLite data survives the reload.
//
// Prereq: `expo export --platform web --output-dir dist` in apps/mobile.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const DIST = fileURLToPath(new URL('../apps/mobile/dist', import.meta.url));
const PORT = 8091;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`✗ ${DIST}/index.html missing — run \`expo export --platform web\` first`);
  process.exit(1);
}

const server = createServer((req, res) => {
  // Cross-origin isolation: required for SharedArrayBuffer / OPFS (expo-sqlite web).
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let filePath = normalize(join(DIST, urlPath));
  if (!filePath.startsWith(DIST)) {
    res.statusCode = 403;
    return res.end('forbidden');
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(DIST, 'index.html'); // SPA fallback
  }
  res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream');
  createReadStream(filePath).pipe(res);
});

await new Promise((r) => server.listen(PORT, r));
const URL_BASE = `http://localhost:${PORT}`;
const step = (m) => {
  console.log(`▶ ${m}`);
};

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => {
  console.log('  [pageerror]', e.message);
});
page.on('console', (m) => {
  if (m.type() === 'error') {
    console.log('  [console.error]', m.text());
  }
});

let failed = false;
try {
  step(`serving ${DIST} at ${URL_BASE}`);
  await page.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  step('cross-origin isolated');
  const isolated = await page.evaluate(() => globalThis.crossOriginIsolated === true);
  if (!isolated) {
    throw new Error('page is not crossOriginIsolated');
  }

  step('onboarding renders');
  await page.getByText('ようこそ').waitFor({ timeout: 60_000 });

  step('start -> Today');
  await page.getByText(/で始める$/).click();
  await page.getByText(/^おはよう/).waitFor({ timeout: 30_000 });

  step('reload keeps us on Today (onboarding flag persisted)');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText(/^おはよう/).waitFor({ timeout: 30_000 });

  step('tick every task');
  const boxes = page.getByRole('checkbox');
  const total = await boxes.count();
  if (total === 0) {
    throw new Error('no task checkboxes found');
  }
  for (let i = 0; i < total; i += 1) {
    const box = boxes.nth(i);
    if ((await box.getAttribute('aria-checked')) !== 'true') {
      await box.click();
    }
  }

  step('celebration overlay fires');
  await page.getByText('ループが閉じました').waitFor({ timeout: 15_000 });
  await page.getByText('閉じる').click();

  step('reload keeps completions (OPFS persisted)');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText(/^おはよう/).waitFor({ timeout: 30_000 });
  const checked = await page
    .getByRole('checkbox')
    .evaluateAll((els) => els.filter((e) => e.getAttribute('aria-checked') === 'true').length);
  if (checked < total) {
    throw new Error(`expected ${total} tasks still done after reload, got ${checked}`);
  }

  step(`PASS — ${total} tasks persisted across reload`);
} catch (err) {
  failed = true;
  console.error('✗ FAIL:', err.message);
} finally {
  await browser.close();
  server.close();
}
process.exit(failed ? 1 : 0);
