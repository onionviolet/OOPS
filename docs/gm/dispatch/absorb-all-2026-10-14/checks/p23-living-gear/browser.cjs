// Compatibility smoke only. Living gear is not wired into this native bundle.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs'), crypto = require('crypto'), http = require('http');
const R = require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const url = 'http://127.0.0.1:18823/';
const get = u => new Promise((resolve, reject) => {
    const req = http.get(u, {agent:false}, r => {const chunks=[];r.on('data', c=>chunks.push(c));r.on('end',()=>resolve(Buffer.concat(chunks)));});
    req.on('error', reject);
});
(async () => {
    const browser = await chromium.launch({headless:true,channel:'chrome'});
    try {
        const context = await browser.newContext({viewport:{width:1366,height:768}});
        const page = await context.newPage(), errors=[];
        page.on('pageerror', e=>errors.push(e.message));
        const loaded = page.waitForResponse(r=>r.url().includes('/dist/bundle.js') && !r.url().endsWith('.map'));
        await page.goto(url);
        const response = await loaded, served = await response.body();
        const disk = fs.readFileSync('dist/bundle.js');
        if (sha(disk)!==sha(served) || sha(disk)!==sha(await get(response.url()))) throw new Error('Bundle mismatch');
        await R.startFresh(page);
        const save = await R.saveText(page);
        await page.reload(); await R.startFresh(page);
        const retained = await page.evaluate(()=>localStorage.getItem('save data'));
        const exactSaveReload = !!save && retained===save;
        await page.screenshot({path:__dirname+'/desktop.png'});
        const evidence = {status:exactSaveReload && !errors.length ? 'PASS compatibility smoke only' : 'FAIL compatibility smoke', origin:url, viewport:{width:1366,height:768},
            servedBundleSha256:sha(served), errors, saveReload:exactSaveReload,
            saveBeforeSha256:sha(save || ''), saveAfterSha256:sha(retained || ''),
            changedNativeLoop:'OPEN: P00 host joins absent', exportLiteralImport:'OPEN: P00 host joins absent'};
        fs.writeFileSync(__dirname+'/browser.json', JSON.stringify(evidence,null,2)+'\n');
        console.log(JSON.stringify(evidence));
        if (errors.length) throw new Error('Browser page errors');
        if (!exactSaveReload) throw new Error('Compatibility save/reload mismatch');
        await context.close();
    } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
