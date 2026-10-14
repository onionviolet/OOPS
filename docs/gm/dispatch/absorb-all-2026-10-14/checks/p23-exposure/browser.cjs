const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),http=require('http'),crypto=require('crypto'),assert=require('assert/strict');
const base='http://127.0.0.1:18821/',dir=__dirname;
const fetchBytes=url=>new Promise((resolve,reject)=>http.get(url,{agent:false},r=>{const chunks=[];r.on('data',c=>chunks.push(c));r.on('end',()=>resolve(Buffer.concat(chunks)));}).on('error',reject));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"chrome"});const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const fixture=base+'docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-exposure/fixture.html';
 try {
  await page.goto(fixture);await page.waitForFunction(()=>!!window.fixture);
  await page.locator('[data-exposure-hazardous]').check();
  const first=await page.evaluate(()=>fixture.step(0.25));assert.equal(first.state.remaining,5.75);assert.equal(first.state.famineRemainder,0.0025);
  await page.locator('#save').click();await page.reload();await page.waitForFunction(()=>!!window.fixture);assert.deepEqual(await page.evaluate(()=>fixture.get()),first.state);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;await download.saveAs(dir+'/pending-fixture.json');
  await page.evaluate(()=>fixture.step(20));await page.locator('#import').setInputFiles(dir+'/pending-fixture.json');await page.waitForFunction(()=>document.querySelector('#notice').textContent==='Imported');
  assert.deepEqual(await page.evaluate(()=>fixture.get()),first.state);
  const before=await page.evaluate(()=>fixture.get());await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...before,schema:2}))});
  await page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('Unsupported'));assert.deepEqual(await page.evaluate(()=>fixture.get()),before);
  await page.screenshot({path:dir+'/module-desktop.png'});
  const resumed=await page.evaluate(()=>fixture.step(18));assert.equal(resumed.state.phase,'gust');assert.equal(resumed.skillXp.Famine,0.18);
  await page.locator('[data-exposure-hazardous]').uncheck();assert.equal((await page.evaluate(()=>fixture.step(30))).staminaCost,0);
  const native=await context.newPage();native.on('pageerror',e=>errors.push(e.message));await native.goto(base);
  const R=require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');await R.startFresh(native);
  assert.equal(await native.locator('[data-exposure-panel]').count(),0);
  const bundleUrl=await native.locator('script[src*="dist/bundle.js"]').getAttribute('src');
  const served=await fetchBytes(base+bundleUrl),local=fs.readFileSync('dist/bundle.js');assert.deepEqual(served,local);
  await native.screenshot({path:dir+'/native-desktop-smoke.png'});assert.deepEqual(errors,[]);
  const evidence={viewport:[1366,768],bundleSha256:crypto.createHash('sha256').update(served).digest('hex'),servedBytes:served.length,
    fixture:'PASS: module controls, pending Save/reload, export/literal-file import, future-schema rejection, resumed awards, mode off',
    native:'BASE SMOKE ONLY: fresh native start, no exposure panel. P00 changed-loop and native persistence gates OPEN',errors};
  fs.writeFileSync(dir+'/browser.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
