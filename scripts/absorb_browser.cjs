// Disposable browser contexts and generated saves only. Rebuild before running.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const url=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18511/';
const out='docs/gm/dispatch/absorb-2026-10-11/evidence';
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],findings=[];
const open=async fixture=>{const context=await browser.newContext({viewport:{width:1550,height:1050}});if(fixture)await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('console',m.text());});await page.goto(url);try{await page.getByText('PLAY',{exact:true}).click();}catch(e){console.error(await page.locator('body').innerText(),errors);throw e;}if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();return {page,context};};
const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
const reload=async p=>{await p.reload();await p.getByText('PLAY',{exact:true}).click();};
try{
let {page,context}=await open();const fingerprint=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name);assert.ok(fingerprint.endsWith(fs.readFileSync('index.html','utf8').match(/dist\/bundle\.js\?version=[^&"]+/)[0]));console.log('opening');const seed=await save(page);await context.close();
// A synthetic pre-merge hero: no new location entries, with existing fork state.
const old=structuredClone(seed);for(const id of ['Motherwood','Primeval forest','Bramble path']){delete old.locations[id];delete old.availabilities.location[id];}old['current location']="Adventurer's guild";
console.log('old guild');({page,context}=await open(old));assert.equal((await save(page))['current location'],"Adventurer's guild");findings.push('Generated pre-merge fork save loads at the retained guild ID with fork state intact.');await context.close();
const progressed=structuredClone(seed);progressed['current location']='Forest lake';
// Level XP lives in xp rather than total_xp; use native model's saved shape.

progressed.availabilities.location['Forest lake']=1;progressed.availabilities.location.Motherwood=1;
console.log('progressed');({page,context}=await open(progressed));await page.evaluate(()=>window.change_location({location_id:'Motherwood',skip_travel_time:true}));await page.getByText('Take an action',{exact:false}).click(); assert.ok((await page.locator('body').innerText()).includes('Search for useful plants'));
await page.evaluate(()=>window.start_game_action('search for plants'));await page.waitForTimeout(1200);await page.evaluate(()=>window.end_game_action());
await page.evaluate(()=>window.change_location({location_id:'Primeval forest',skip_travel_time:true}));await page.waitForTimeout(100);assert.ok(/Grizzly|Bandersnatch/.test(await page.locator('body').innerText()));await page.evaluate(()=>window.change_location({location_id:'Motherwood',skip_travel_time:true}));
console.log('persist');const saved=await save(page);await reload(page);assert.equal((await save(page))['current location'],'Motherwood');console.log('export');const encoded=await page.evaluate(()=>window.save_to_file());await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:'generated-absorb.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await page.getByText('PLAY',{exact:true}).click();assert.equal((await save(page))['current location'],'Motherwood');assert.deepEqual((await save(page)).content_packs,saved.content_packs);
await page.screenshot({path:out+'/A-motherwood.png',fullPage:true});findings.push('Motherwood native menu/action, Primeval forest encounter, save/reload and encoded file import exercised. Late-game access is generated, not natural progression.');await context.close();assert.deepEqual(errors,[]);fs.writeFileSync(out+'/A-browser.json',JSON.stringify({url,fingerprint,findings,errors,generatedSavesOnly:true},null,2));console.log(findings);
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
