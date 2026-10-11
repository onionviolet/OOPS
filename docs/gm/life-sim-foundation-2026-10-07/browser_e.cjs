const fs=require('node:fs');const assert=require('node:assert/strict');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
const out='/tmp/yairpg-life-foundation-proof';fs.mkdirSync(out,{recursive:true});
const url='http://127.0.0.1:18317';
let browser;
(async()=>{
browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const errors=[]; const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
const start=async()=>{await page.goto(url);await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();await page.locator('#life_remember_day').waitFor();};
await start();await page.locator('#life_remember_day').click();
const fresh=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(fresh.life_record.recent.filter(e=>e.kind==='memory').length,1);
fs.writeFileSync(out+'/fresh.json',JSON.stringify(fresh));await page.screenshot({path:out+'/remembered-day.png',fullPage:true});
const export1=await page.evaluate(()=>window.save_to_file());assert.ok(export1?.startsWith('YAIR-UTF8-1:'));
await start();const reloaded=await page.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});assert.equal(reloaded.life_record.recent.filter(e=>e.kind==='memory').length,1);
await page.evaluate(encoded=>window.load_progress(encoded),export1);await page.waitForTimeout(1500);if(await page.getByText('PLAY',{exact:true}).isVisible())await page.getByText('PLAY',{exact:true}).click();await page.locator('#life_remember_day').waitFor();
const imported=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(imported.life_record.recent.filter(e=>e.kind==='memory').length,1);
// Generated old expansion-schema-11 save, not a private player save.
const old=JSON.parse(fs.readFileSync('docs/gm/story-life-2026-10-07/generated-enrolled.json','utf8'));delete old.life_record;assert.equal(old.expansion.schema,11);
await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),old);await start();await page.evaluate(()=>window.saveProgress());const migrated=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(migrated.life_record.recent.length,1);
// Generated progress fixture using the actual saved native level model.
const mid=structuredClone(fresh);mid.character.money=5000;mid.levels.person.main_character.skill_xp.Running=1000;mid['current time'].year+=10;
await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),mid);await start();await page.locator('#life_remember_day').click();const midSaved=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
// Long span: real save envelope advanced through 120 calendar years with 2
// milestones/year using the record module. No claim of world/quest simulation.
const longSaved=await page.evaluate(async save=>{const {appendLifeMilestone,compactLifeRecord,LIFE_YEAR_MINUTES}=await import('/src/life_record.js');let r=save.life_record;const startYear=save['current time'].year+1;
for(let y=startYear;y<startYear+120;y++)for(let n=0;n<2;n++)r=appendLifeMilestone(r,{year:y,at:y*LIFE_YEAR_MINUTES+n*1440,worldId:'base.frontier',kind:'memory',text:`You tended your home through month ${n+1}.`});
save.life_record=compactLifeRecord(r,startYear+120);save['current time'].year=startYear+120;return save;},midSaved);
await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),longSaved);await start();await page.evaluate(()=>window.saveProgress());const long=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.ok(long.life_record.years.length>=120);assert.ok(long.life_record.recent.length<=64);
const encodedLong=await page.evaluate(()=>window.save_to_file());await page.evaluate(s=>window.load_progress(s),encodedLong);await page.waitForTimeout(1500);if(await page.getByText('PLAY',{exact:true}).isVisible())await page.getByText('PLAY',{exact:true}).click();await page.locator('#life_remember_day').waitFor();
// Conservative guard rejection must not overwrite the previous save. Export still succeeds.
const quotaProof=await page.evaluate(()=>{const before=localStorage.getItem('save data');localStorage.setItem('foundation-test-pressure','x'.repeat(2100000));window.saveProgress();const unchanged=before===localStorage.getItem('save data');const exported=window.save_to_file();localStorage.removeItem('foundation-test-pressure');return {unchanged,exported:!!exported,text:document.getElementById('message_box_div').innerText};});assert.ok(quotaProof.unchanged);assert.ok(quotaProof.exported);assert.match(quotaProof.text,/no room|room to safely/);
await page.screenshot({path:out+'/long-life.png',fullPage:true});
const measure=s=>({utf8Bytes:Buffer.byteLength(JSON.stringify(s),'utf8'),storageBytes:JSON.stringify(s).length*2});
const evidence={origin:url,errors,sizes:{fresh:measure(fresh),midGameGenerated:measure(midSaved),longSpanGenerated:measure(long)},scope:'Native save envelopes; mid-game generated money/skill progress; 120-year record simulation, not full world simulation.',checks:['remember day','save','reload','export','import','schema 11 migration','long life reload/import','storage guard keeps prior save','export under pressure'],quotaProof:{unchanged:quotaProof.unchanged,exported:quotaProof.exported}};
fs.writeFileSync(out+'/E_BROWSER.json',JSON.stringify(evidence,null,2));fs.writeFileSync(out+'/long-generated.json',JSON.stringify(long));await browser.close();console.log(JSON.stringify(evidence,null,2));
})().catch(async e=>{console.error(e);await browser?.close();process.exit(1)});
