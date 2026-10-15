// Distinguish a newer-client/base content mismatch from a performance regression.
global.fetch=undefined;
const fs=require('node:fs'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fixture=JSON.parse(fs.readFileSync(process.env.YAIRPG_LEGACY_FIXTURE||'/tmp/stepper-perf-final-gate/proof-workshop/old-client-save.json'));
const clock=fs.readFileSync('scripts/stepper_perf_browser.cjs','utf8').match(/const clockSource = `([\s\S]*?)`;/)[1];
const root='http://127.0.0.1:18980/';
const bundles=[fs.readFileSync(process.env.YAIRPG_REFERENCE_BUNDLE||'/tmp/stepper-perf-before.js','utf8'),fs.readFileSync('dist/bundle.js','utf8')];
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});try{
 const saves=[],errors=[];
 for(const bundle of bundles){
  const c=await b.newContext({viewport:{width:1366,height:768}});await c.addInitScript(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.route('**/dist/bundle.js*',r=>r.fulfill({contentType:'application/javascript',body:clock+bundle}));await p.goto(root+'?test_hooks=1');
  await p.locator('#loading_screen_play_button:not(.none_display)').waitFor({state:'visible'});
  await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('save data'));s.__waitingWriter=true;localStorage.setItem('save data',JSON.stringify(s));});
  await p.waitForFunction(()=>{saveProgress();return !JSON.parse(localStorage.getItem('save data')).__waitingWriter;},null,{polling:'raf'});
  const s=await p.evaluate(()=>{saveProgress();return JSON.parse(localStorage.getItem('save data'));});delete s.saved_at;delete s.last_rewarded_export;saves.push(s);await c.close();
 }
 assert.deepEqual(errors,[]);assert.equal(JSON.stringify(saves[0]),JSON.stringify(saves[1]));assert.equal(fixture.availabilities.item['Meadow hay'],1);assert.equal(saves[0].availabilities.item['Meadow hay'],undefined);
 fs.writeFileSync('docs/gm/dispatch/absorb-all-2026-10-14/checks/stepper-perf/legacy-base-comparison.json',JSON.stringify({viewport:[1366,768],oldClient:'27764108efb9eb30ea6aa98658753a639100746f',base:'9dd86b5a',oldClientMeadowHay:1,baseMeadowHayAbsent:true,candidateMeadowHayAbsent:true,canonicalBytesEqual:true,stateSha256:createHash('sha256').update(JSON.stringify(saves[0])).digest('hex'),errors},null,2)+'\n');
 console.log('PASS newer-client load is byte-identical between untouched base and candidate; Meadow hay absent in both');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
