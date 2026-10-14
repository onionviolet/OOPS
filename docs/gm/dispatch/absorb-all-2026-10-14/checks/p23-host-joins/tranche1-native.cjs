const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const R=require(path.resolve('docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const base='http://127.0.0.1:18834/',out=__dirname,finish=process.argv.includes('--finish-controls'),resume=process.argv.includes('--resume')||finish,results=resume?JSON.parse(fs.readFileSync(path.join(__dirname,'tranche1-native-failure.json'))).results:[];
const resumeCheckpoint=finish?JSON.parse(fs.readFileSync(path.join(__dirname,'tranche1-working.json'),'utf8')):resume?JSON.parse(Buffer.from(fs.readFileSync(path.join(__dirname,'tranche1-settled.save.txt'),'utf8').replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8')):null;
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});
const ctx=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});const p=await ctx.newPage();p.setDefaultTimeout(12000);const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')console.log('browser-error',m.text().slice(0,400));});
const save=async()=>{await p.locator('#save_button').click();const s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));fs.writeFileSync(path.join(out,'tranche1-working.json'),JSON.stringify(s));return s;};
const played=async n=>{const start=(await save()).expansion.clock;for(let i=0;i<n*4+4;i++){await p.waitForTimeout(1100);const tick=await save();if(tick.expansion.clock>=start+n)return;}console.log('stopped',await p.locator('#message_log').innerText().catch(()=>''),await p.locator('#p23_household_panel').innerText().catch(()=>''));await p.screenshot({path:path.join(out,'tranche1-stopped.png')});throw Error('Native played clock did not advance');};
const play=async()=>{await p.locator('#loading_screen_play_button:not(.none_display)').click();};
const families=s=>({exposure:s.p23_exposure,household:s.household,clock:s.expansion.clock,xp:s.levels.person.main_character.skill_xp,items:s.inventories.person.main_character,money:s.character.money,effects:s.active_effects});
async function roundtrip(tag){const before=await save();await p.reload();assert.deepEqual(families(await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),families(before));await play();
 const downloadP=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const d=await downloadP;const file=path.join(out,`tranche1-${tag}.save.txt`);await d.saveAs(file);
 const encoded=fs.readFileSync(file,'utf8').trim(),downloaded=JSON.parse(Buffer.from(encoded.replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8'));
 await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles(file)]);
 assert.deepEqual(families(await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),families(downloaded));await play();
 results.push({gate:tag+' native Save/reload/Export/literal-file Import exact stored envelope before resumed played callbacks',status:'PASS'});return downloaded;}

try{
 await p.goto(base);await R.startFresh(p);const served=await p.request.get(base+'dist/bundle.js');const local=fs.readFileSync('dist/bundle.js');assert.equal(hash(await served.body()),hash(local));
 const baseline=await save();
 if(!resume){assert.equal(baseline.household,undefined);assert.equal(baseline.p23_exposure,undefined);results.push({gate:'old optional absence in fresh native envelope',status:'PASS'});
 // Only baseline prerequisites are configured. No feature state, clocks, event
 // cursors, new-skill XP or module outcomes are seeded. All changed operations
 // below use production native controls/played timers and literal native saves.
 const f=structuredClone(baseline);f.availabilities.location.Shack=1;f['current location']='Shack';f.character.money=200;f.character.hp_to_full=45;
 f.inventories.person.main_character['{"id":"Rough wood log"}']={count:5};
 f.active_effects.Wet={name:'Wet',duration:30,effects:{stats:{cold_tolerance:{flat:-5}}},tags:{debuff:true,effect:true}};
 f.pacing_e1={schema:1,hungerEnabled:true,weatherEnabled:true,fullness:20,weather:{phase:0,remaining:120}};
 f.item_log['Rat tail']={id:'Rat tail',number:1,quality_highest:0,quality_lowest:0};
 const fixture=path.join(out,'tranche1-prerequisites.json');fs.writeFileSync(fixture,JSON.stringify(f,null,2));
 // Import the supported baseline through the actual native literal-file loader.
 const encoded='YAIR-UTF8-1:'+Buffer.from(JSON.stringify(f)).toString('base64');
 const fixtureFile=path.join(out,'tranche1-prerequisites.save.txt');fs.writeFileSync(fixtureFile,encoded);
 await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles(fixtureFile)]);await play();
 await p.locator('#p23_household_panel summary').click();
 const act=async id=>{await p.locator(`[data-household-action="${id}"]`).click();};
 await act('meet');await act('install_hearth');let s=await save();assert.equal(s.character.money,195);assert.equal(s.inventories.person.main_character['{"id":"Rough wood log"}'].count,2);assert.equal(s.household.animal.bond,10);
 fs.writeFileSync(path.join(out,'tranche1-prelight.json'),JSON.stringify(await save()));await act('light');const lit=await save();await act('smoke_on');await act('close_vent');s=await save();assert.equal(s.household.hearth.fuelMinutes,20-(s.expansion.clock-lit.expansion.clock));assert.equal(s.inventories.person.main_character['{"id":"Rough wood log"}'].count,1);
 await roundtrip('pending');
 await played(3);s=await save();assert.equal(s.active_effects.Wet,undefined);assert.ok(s.household.hearth.smoke>0);assert.ok(s.active_effects['Household smoke']);assert.ok(s.levels.person.main_character.skill_xp.Famine>0);
 results.push({gate:'played underfed passive XP, paid fuel, Wet drying and opted-in smoke',status:'PASS'});
 await p.locator('#p23_household_panel summary').click();await act('ventilate');s=await save();assert.equal(s.active_effects['Household smoke'],undefined);
 await played(3);await act('pet');await played(5);await act('pet');s=await save();assert.equal(s.household.animal.bond,30);
 await p.evaluate(()=>window.start_sleeping());const sleepingStart=await save();await played(5);const sleepingEnd=await save();await p.evaluate(()=>window.end_sleeping());
 const sleepSpeed=Number(fs.readFileSync('src/config.js','utf8').match(/time_speedup_when_sleeping:\s*(\d+)/)[1]);const sleepTicks=(sleepingEnd.expansion.clock-sleepingStart.expansion.clock)/sleepSpeed;
 assert.ok(Number.isInteger(sleepTicks)&&sleepTicks>0);assert.ok(Math.abs((sleepingStart.character.hp_to_full-sleepingEnd.character.hp_to_full)-5.46*sleepTicks)<.001);
 results.push({gate:'actual sleeping multiplies native recovery once by adopted household and owned furnishing comfort',status:'PASS'});
 await played(60);await act('pet');s=await save();assert.equal(s.household.animal.gifts,1);assert.equal(s.inventories.person.main_character['{"id":"Rat tail"}'].count,1);
 await roundtrip('settled');
 await p.locator('#options_button').click();await p.locator('[data-pacing-option="weatherEnabled"]').uncheck();await p.locator('#options_button').click();
 await p.evaluate(()=>window.start_sleeping());
 for(let i=0;i<240;i++){await p.waitForTimeout(1100);const earned=await save();if((earned.levels.person.main_character.skill_xp.Famine||0)>=10)break;if(i%40===0)console.log('native passive sleep progress',i,earned.levels.person.main_character.skill_xp.Famine);}
 await p.evaluate(()=>window.end_sleeping());const earned=await save();assert.ok(earned.levels.person.main_character.skill_xp.Famine>=10);
 await p.locator('#pacing_status_panel summary').click();assert.match(await p.locator('#pacing_status_panel').innerText(),/Native XP ×0\.80125/);
 results.push({gate:'real underfed played sleep earns Famine level 1 and useful native hunger efficiency reduction',status:'PASS'});
 await p.locator('#options_button').click();await p.locator('[data-pacing-option="weatherEnabled"]').check();await p.locator('#options_button').click();
 await p.locator('#p23_household_panel summary').click();await act('light');await act('close_vent');await played(1);
 }else{
 const checkpoint=resumeCheckpoint;const file=path.join(out,'tranche1-resume.save.txt');fs.writeFileSync(file,'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(checkpoint)).toString('base64'));
 await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles(file)]);await play();
 if(!finish){
 await p.locator('#options_button').click();await p.locator('[data-pacing-option="weatherEnabled"]').uncheck();await p.locator('#options_button').click();await p.evaluate(()=>window.start_sleeping());
 for(let i=0;i<240;i++){await p.waitForTimeout(1100);if(((await save()).levels.person.main_character.skill_xp.Famine||0)>=10)break;}
 await p.evaluate(()=>window.end_sleeping());assert.ok((await save()).levels.person.main_character.skill_xp.Famine>=10);await p.locator('#pacing_status_panel summary').click();assert.match(await p.locator('#pacing_status_panel').innerText(),/Native XP ×0\.80125/);
 await p.locator('#options_button').click();await p.locator('[data-pacing-option="weatherEnabled"]').check();await p.locator('#options_button').click();
 await p.locator('#p23_household_panel summary').click();await p.locator('[data-household-action="light"]').click();await p.locator('[data-household-action="close_vent"]').click();await played(1);
 }
 }
 const act=async id=>{await p.locator(`[data-household-action="${id}"]`).click();};
 let s;
if(!finish){
 await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();await p.locator('.action_travel[data-travel="Village"]').click();s=await save();assert.equal(s['current location'],'Village');assert.equal(s.active_effects['Household smoke'],undefined);results.push({gate:'native travel clears smoke and keeps finite prepaid fuel',status:'PASS'});
 await p.locator('#options_button').click();await p.locator('[data-exposure-hazardous]').check();await p.locator('#options_button').click();
 const coldBefore=(await save()).levels.person.main_character.skill_xp['Cold resistance']||0;
 await played(2);s=await save();assert.ok(s.levels.person.main_character.skill_xp['Cold resistance']>coldBefore);
 await p.locator('#options_button').click();await p.locator('[data-exposure-hazardous]').uncheck();await p.locator('#options_button').click();const off=await save();await played(2);s=await save();assert.equal(s.levels.person.main_character.skill_xp['Cold resistance'],off.levels.person.main_character.skill_xp['Cold resistance']);
 await roundtrip('exposure-settled');await p.evaluate(()=>{window.use_item('{\"id\":\"Stale bread\"}');window.use_item('{\"id\":\"Stale bread\"}');});const fed=await save();assert.ok(fed.pacing_e1.fullness>20);await played(3);assert.equal((await save()).levels.person.main_character.skill_xp.Famine,fed.levels.person.main_character.skill_xp.Famine);results.push({gate:'actual two meals stop underfed passive XP without clearing earned progress',status:'PASS'});results.push({gate:'outdoor gust native resistance XP and mode-off control',status:'PASS'});

 }
 const original=await save();
 for(const field of ['p23_exposure','household']){
  const bad=structuredClone(original);bad[field].schema=99;
  const encoded='YAIR-UTF8-1:'+Buffer.from(JSON.stringify(bad)).toString('base64');
  fs.writeFileSync(path.join(out,`tranche1-unsupported-${field}.save.txt`),encoded);
  const unchanged=await p.evaluate(async text=>{const before=localStorage.getItem('save data');await window.load_progress(text);return localStorage.getItem('save data')===before;},encoded);
  assert.ok(unchanged,'Unsupported schema mutated native storage');
  results.push({gate:field+' unsupported optional schema rejects without native storage mutation in the actual native import handler',status:'PASS'});
 }
 await p.screenshot({path:path.join(out,'tranche1-desktop.png')});assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'tranche1-native.json'),JSON.stringify({status:'PASS',viewport:[1366,768],bundleSha256:hash(local),clock:'Actual worker-backed native played timers; no synthetic clock or engine/debug advancement',prerequisites:'explicit supported old-envelope fixture: native home access,5 logs,200 coins,Wet and underfed pacing; feature state/cursors/XP absent',results,pageErrors:errors},null,2));
}finally{await ctx.close();await browser.close();}})().catch(e=>{console.error(e);fs.writeFileSync(path.join(out,'tranche1-native-failure.json'),JSON.stringify({error:String(e),results},null,2));process.exitCode=1});
