// Verify the other changed Nighthawk consumer on the same frozen candidate.
const {server,fixture,dir,sha}=require('./browser.cjs'),fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{await new Promise(r=>server.listen(5111,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const r=JSON.parse(fs.readFileSync(dir+'/result.json'));assert.equal(sha(fs.readFileSync('dist/bundle.js')),r.bundleSha256);const f=await fixture(browser);
 const ticks=n=>f.p.evaluate(n=>advanceTicks(n,{render:false}),n),click=f.click;
 await click('enroll');await click('book.lotm.report_in');await click('book.lotm.accept_allocation');await click('book.lotm.ingest');await click('book.lotm.lesson');await ticks(5);
 for(let i=0;i<2;i++){await click('book.lotm.act_reading');await ticks(10);}
 await click('lotm.move.lodging');await ticks(10);await click('book.lotm.sleep');await ticks(120);await click('lotm.move.workroom');await ticks(10);
 for(let i=0;i<3;i++){await click('book.lotm.act_reading');await ticks(10);}await click('book.lotm.act_refusal');await click('book.lotm.request_assessment');
 const key=JSON.stringify({id:'Tingen prepared Clown dose'}),held=s=>s.inventories.person.main_character?.[key]?.count||0;assert.equal(held(await f.snap()),0);await click('book.lotm.request_exam_seer');await ticks(60);assert.equal(held(await f.snap()),1);await click('book.lotm.ingest_clown');assert.equal(held(await f.snap()),0);assert.match(await f.p.locator('#lotm_panel').innerText(),/Sequence 8 · Clown/);
 const persistence=await f.roundtrip(async()=>{await click('lotm.move.lodging');await ticks(10);});await f.p.screenshot({path:dir+'/seer-promoted.png'});assert.deepEqual(f.errors,[]);
 r.seer={...persistence,screenshot:'evidence/seer-promoted.png',screenshotSha256:sha(fs.readFileSync(dir+'/seer-promoted.png')),steps:'fresh native Seer entry, control lesson, two readings, real sleep/recovery, three readings, one refusal, pre-screen without dose, senior-deacon exam, Clown ingestion, Save/reload/Export/perturb/literal Import',errors:f.errors};fs.writeFileSync(dir+'/result.json',JSON.stringify(r,null,2)+'\n');console.log('Seer native correction PASS');
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
