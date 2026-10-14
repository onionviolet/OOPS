const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const crypto=require('node:crypto');const assert=require('node:assert/strict');
(async()=>{
 const dir=__dirname,origin='http://127.0.0.1:18822';const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const context=await browser.newContext({viewport:{width:1366,height:768}});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'load'});await page.waitForTimeout(1200);
 await page.screenshot({path:dir+'/native-baseline.png'});
 const servedHash=await page.evaluate(async()=>{const b=await(await fetch('/dist/bundle.js')).arrayBuffer();return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b))).map(v=>v.toString(16).padStart(2,'0')).join('');});
 const localHash=crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex');assert.equal(servedHash,localHash);
 await page.goto(origin+'/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-household/fixture.html');await page.waitForFunction(()=>window.ready);
 const result=await page.evaluate(()=>{act('meet');act('tick',5);act('pet');act('tick',5);act('pet');act('tick',50);act('pet');act('light');fixture.context.wet=true;act('smoke_on');act('close_vent');const dry=act('tick',3);const smoky=fixture.household.hearth.smoke;act('ventilate');return{bond:fixture.household.animal.bond,gifts:fixture.household.animal.gifts,fuel:fixture.household.hearth.fuelMinutes,wet:fixture.context.wet,smoky,cleared:fixture.household.hearth.smoke,dry:dry.effects};});
 assert.equal(result.bond,40);assert.equal(result.gifts,1);assert.equal(result.fuel,17);assert.equal(result.wet,false);assert.equal(result.smoky,3);assert.equal(result.cleared,0);
 await page.screenshot({path:dir+'/module-fixture-desktop.png'});
 const saved=await page.evaluate(()=>JSON.stringify(fixture));
 await page.locator('#save').click();await page.reload();await page.waitForFunction(()=>window.ready);
 assert.equal(await page.evaluate(()=>JSON.stringify(fixture)),saved);
 fs.writeFileSync(dir+'/fixture-export.json',saved);
 await page.evaluate(()=>{act('tick',5);act('pet');});
 await page.locator('#import').setInputFiles(dir+'/fixture-export.json');
 await page.waitForFunction(()=>JSON.stringify(fixture)===localStorage.getItem('p03-fixture'));
 assert.equal(await page.evaluate(()=>JSON.stringify(fixture)),saved);
 const noDup=await page.evaluate(()=>{act('tick',5);act('pet');return fixture.household.animal.gifts;});assert.equal(noDup,1);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(dir+'/browser-result.json',JSON.stringify({viewport:[1366,768],origin,servedBundleSha256:servedHash,localBundleSha256:localHash,nativeEvidence:'baseline loads only; changed native loop NOT integrated',moduleEvidence:'uncoupled direct ES modules; mock inventory/clock/localStorage/literal-file import',result,reloadExact:true,literalFileImportExact:true,noDuplicateGift:true,pageErrors:errors},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
