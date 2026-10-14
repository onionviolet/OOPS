const fs = require('node:fs');
const crypto = require('node:crypto');
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const evidence = __dirname;
(async () => {
 const browser = await chromium.launch({headless:true, channel:"chrome"});
 const context = await browser.newContext({viewport:{width:1366,height:768}});
 const page = await context.newPage(), errors=[];
 page.on('pageerror', e => errors.push(e.message));
 const response = await page.goto('http://127.0.0.1:18836/', {waitUntil:'networkidle'});
 const bundle = await context.request.get('http://127.0.0.1:18836/dist/bundle.js');
 const servedHash = crypto.createHash('sha256').update(await bundle.body()).digest('hex');
 const localHash = crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex');
 const visible = await page.locator('body').innerText();
 const result = {origin:'http://127.0.0.1:18836',freshContext:true,viewport:{width:1366,height:768},
  httpStatus:response.status(),servedBundleSha256:servedHash,localBundleSha256:localHash,
  matched:servedHash===localHash,pageErrors:errors,nativeEntryRendered:visible.includes('Yet Another Idle RPG') && visible.includes('PLAY'),
  changedNativeLoop:'OPEN: module is intentionally unregistered; P00 owns native joins',
  nativePersistence:'OPEN: native pending/completed state cannot be created without P00 joins',
  p18ControlsAbsent:!visible.includes('Visitor fortifying tonic') && !visible.includes('Study conditioning')};
 fs.writeFileSync(evidence+'/browser.json',JSON.stringify(result,null,2)+'\n');
 await page.screenshot({path:evidence+'/desktop.png'});
 console.log(JSON.stringify(result));
 await browser.close();
 if(!result.matched || result.httpStatus!==200 || !result.nativeEntryRendered || errors.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
