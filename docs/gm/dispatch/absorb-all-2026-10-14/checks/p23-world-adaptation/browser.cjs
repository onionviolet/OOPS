// Baseline-only native smoke. P00 is required for the changed gameplay journey.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const http = require('http');
const routes = require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = 'http://127.0.0.1:18831/';
const out = __dirname;
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const context = await browser.newContext({viewport: {width: 1366, height: 768}});
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    await routes.startFresh(page);
    const baseline = await page.locator('#location_name_span').innerText();
    const methodVisible = await page.getByText('Learn the conservatory method', {exact: true}).count();
    const body = await new Promise((resolve, reject) => {
      http.get(url + 'dist/bundle.js', {agent: false}, r => {
        const chunks = []; r.on('data', c => chunks.push(c)); r.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    });
    const servedHash = crypto.createHash('sha256').update(body).digest('hex');
    const localHash = crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex');
    const result = {viewport: {width: 1366, height: 768}, origin: url, freshContext: true,
      baselineLocation: baseline.trim(), methodVisible, errors, servedHash, localHash,
      hashMatches: servedHash === localHash, changedNativeLoop: 'OPEN: no P00 registration or host import',
      nativeSaveReloadExportLiteralImport: 'OPEN: pending/settled family is not connected to save envelope'};
    await page.screenshot({path: path.join(out, 'baseline-desktop.png')});
    fs.writeFileSync(path.join(out, 'browser.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result));
    if (errors.length || servedHash !== localHash || !baseline.startsWith('Village')) process.exitCode = 1;
  } finally {await browser.close();}
})().catch(e => {console.error(e); process.exitCode = 1;});
