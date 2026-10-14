const fs = require('fs'), path = require('path'), crypto = require('crypto');
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const R = require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const base = 'http://127.0.0.1:18827/';
(async () => {
    const browser = await chromium.launch({headless: true, channel: 'chrome'});
    try {
        const context = await browser.newContext({viewport: {width: 1366, height: 768}});
        const page = await context.newPage(); page.setDefaultTimeout(30000);
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        const responseBytes = new Promise(resolve => page.on('response', async r => {
            if (new URL(r.url()).pathname === '/dist/bundle.js') resolve(await r.body());
        }));
        await page.goto(base, {waitUntil: 'domcontentloaded', timeout: 90000});
        await R.startFresh(page);
        await page.screenshot({path: path.join(__dirname, 'desktop-base-smoke.png')});
        const served = await responseBytes;
        const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
        const local = fs.readFileSync('dist/bundle.js');
        const map = JSON.parse(fs.readFileSync('dist/bundle.js.map'));
        const result = {kind: 'fresh-origin base smoke only; changed native salvage loop OPEN', viewport: [1366, 768],
            origin: base, servedBundleSha256: hash(served), localBundleSha256: hash(local),
            servedBytesMatch: hash(served) === hash(local), errors,
            salvageInNativeBundle: map.sources.some(s => s.includes('absorb_p23/salvage/salvage.js')),
            nativeSaveReloadExportLiteralImport: 'OPEN: P00 host connection absent'};
        fs.writeFileSync(path.join(__dirname, 'browser.json'), JSON.stringify(result, null, 2) + '\n');
        console.log(JSON.stringify(result));
        if (!result.servedBytesMatch || errors.length) process.exitCode = 1;
        await context.close();
    } finally {await browser.close();}
})().catch(e => {console.error(e); process.exitCode = 1;});
