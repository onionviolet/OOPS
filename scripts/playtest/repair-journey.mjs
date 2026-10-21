// P4: real native repair/UI commands on a rebuilt, disposable localhost origin.
// Run from an isolated candidate: node scripts/playtest/repair-journey.mjs OUT
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {resumeElectronGame} from './electron_ready.mjs';
import {createScenarioFacade} from '../../src/scenario_facade.js';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const out=resolve(process.argv[2]||'/tmp/oops-p4-browser');await mkdir(out,{recursive:true});
const root=resolve('.'),server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:83,wall:Date.UTC(2026,9,21),opTimeout:15000});
const key=id=>JSON.stringify({id}),checks=[],receipts=[];let p,phase='startup',toolKey;
const snapshot=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const stock=save=>save.inventories.person.main_character[key('Low quality iron ingot')]?.count||0;
async function tools(){await p.locator('#workspace_navigation select').first().selectOption('tools');await p.locator('#tools_panel').waitFor({state:'visible'});}
async function ready(){await resumeElectronGame(p);await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await tools();}
const state=async()=>{const save=await snapshot();return {tools:save.tools??{schema:1,instances:{},job:null},durability:save.equipment_durability,ingots:stock(save),draws:(save.expansion.streams.log||[]).filter(r=>r.k.startsWith('tools.repair:'))};};
async function roundtrip(label){
 const saved=await s.save(),before=await state();await p.reload();await ready();assert.deepEqual(await state(),before);
 const literal=await p.evaluate(()=>save_to_file());assert.equal(typeof literal,'string');
 await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await ready();assert.deepEqual(await state(),before);
 await writeFile(join(out,label+'-state.json'),JSON.stringify({tools:saved.tools,durability:saved.equipment_durability,ingots:stock(saved)},null,2));
 checks.push(label+': native Save/reload/Export/literal Import retains job, exact tool, condition, history, stock and repair draws');
}
try{
 await s.start();const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
 seed.options.skip_play_button=false;seed.character.money=5000;seed.equipment_durability.enabled=true;
 seed.availabilities.trader.villageTrader=1;seed.availabilities.location['Nearby cave']=1;seed.availabilities.location.Shack=1;
 seed.availabilities.activity['Nearby cave:mining']=1;seed.global_flags.is_gathering_unlocked=true;seed.global_flags.is_crafting_unlocked=true;
 seed.inventories.person.main_character[key('Low quality iron ingot')]={count:3};
 delete seed.inventories.person.main_character[key('Old pickaxe')];
 await s.open(seed);p=s.page;
 phase='native tool acquisition';console.log(phase);await p.evaluate(()=>startTrade('villageTrader'));
 await p.locator('#trader_inventory_div > [data-trader_item]').filter({hasText:'Old pickaxe'}).first().click();
 await p.locator('#accept_trade_button').click();await p.locator('#center_mode_back').click();
 assert.ok(Object.keys((await s.save()).inventories.person.main_character).some(k=>JSON.parse(k).id==='Old pickaxe'));
 const row=p.locator('#inventory_content_div > [data-character_item]').filter({hasText:'Old pickaxe'}).first();
 await row.click({button:'right'});await p.getByRole('menuitem',{name:'Equip',exact:true}).click();
 toolKey=(await s.save()).character.equipment.pickaxe.inventory_key;assert.ok(JSON.parse(toolKey).e2_instance);
 phase='native tool wear';console.log(phase);await p.evaluate(()=>change_location({location_id:'Nearby cave'}));await p.evaluate(()=>start_activity('mining'));
 for(let i=0;i<3 && (await snapshot()).equipment_durability.condition[toolKey]>=100;i++)await s.step(40);
 await p.evaluate(()=>end_activity());assert.ok((await snapshot()).equipment_durability.condition[toolKey]<100);
 await p.evaluate(()=>change_location({location_id:'Village'}));await tools();
 checks.push('Actual merchant purchase, native equip, cave mining wear and native return supply the exact damaged repair subject');
 const scenario=createScenarioFacade({identity:{fixture:'mid.json with funds/materials/access; tool bought and worn through native commands',viewport:{width:1920,height:1080}},
  inspect:async()=>{const save=await snapshot(),view=await p.evaluate(()=>simulationTestHooks.project('tools'));return {minute:save['current time'].day_count*1440+save['current time'].hour*60+save['current time'].minute,location:view.location,job:view.job,condition:view.rows.find(r=>r.key===toolKey)?.condition,ingots:stock(save)};},
  quote:async command=>{await tools();if(command.type==='repair.start'){await p.locator('[data-tools-quote-for]:visible').first().click();return {key:toolKey,text:await p.locator('[data-tools-quote]').innerText()};}if(command.type==='repair.cancel')return {key:toolKey};throw Error('Unsupported repair scenario command.');},
  execute:async(command,q)=>{assert.equal(q.key,toolKey);await tools();await p.locator(command.type==='repair.start'?'[data-tools-execute]':'[data-tools-cancel]').press('Enter');},
  advance:minutes=>s.step(minutes),persistence:{save:()=>s.save(),load:async save=>{await s.open(save);p=s.page;await tools();},reload:async()=>{await p.reload();await ready();},exportFile:()=>p.evaluate(()=>save_to_file()),importFile:async bytes=>{await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),bytes)]);await ready();}}});
 phase='quote/start';console.log(phase);let before=await state(),ticket=await scenario.quote({type:'repair.start'});assert.deepEqual(await state(),before);
 receipts.push(await scenario.execute(ticket));let pending=await state();assert.equal(pending.ingots,before.ingots-1);assert.equal(pending.tools.job.key,toolKey);assert.equal(pending.durability.condition[toolKey],before.durability.condition[toolKey]);
 receipts.push(await scenario.advance(2));assert.equal((await state()).tools.job.minutesLeft,pending.tools.job.total-2);
 const durable=JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));assert.equal(durable.tools.job.minutesLeft,pending.tools.job.total-2);
 checks.push('Read-only native quote, one input reservation and two actual played minutes durably retain pending work');
 await p.screenshot({path:join(out,'pending-1920.png')});await roundtrip('pending');
 phase='travel guard';console.log(phase);const remaining=(await state()).tools.job.minutesLeft;
 await p.evaluate(()=>change_location({location_id:'Shack'}));assert.equal((await snapshot())['current location'],'Village');assert.equal((await state()).tools.job.minutesLeft,remaining);
 checks.push('Existing native travel guard refuses departure during repair without changing job or spending');
 phase='restored interruption';console.log(phase);const returnSave=await s.save(),away=structuredClone(returnSave);away['current location']='Shack';away.expansion.simulation.people.player.location='Shack';
 await s.open(away);p=s.page;await tools();receipts.push(await scenario.advance(3));assert.equal((await state()).tools.job.minutesLeft,remaining);assert.match(await p.locator('#tools_panel').innerText(),/Repair paused.*away/);
 await p.screenshot({path:join(out,'paused-1920.png')});await roundtrip('paused');
 await s.open(returnSave);p=s.page;await tools();assert.equal((await state()).tools.job.minutesLeft,remaining);
 checks.push('Disposable restored-away fixture pauses actual clock work, survives persistence, and retains the native return-state job; ordinary travel remains guarded');
 phase='cancel';console.log(phase);receipts.push(await scenario.execute(await scenario.quote({type:'repair.cancel'})));assert.equal((await state()).ingots,before.ingots);assert.equal((await state()).tools.job,null);
 await roundtrip('cancelled');
 phase='complete';console.log(phase);ticket=await scenario.quote({type:'repair.start'});receipts.push(await scenario.execute(ticket));pending=await state();
 const pendingNativeSave=await s.save(),total=pending.tools.job.minutesLeft;receipts.push(await scenario.advance(total));const completed=await state();
 assert.equal(completed.tools.job,null);assert.equal(completed.draws.length,1);assert.equal(completed.ingots,before.ingots-1);
 assert.equal(completed.tools.instances[toolKey].repairs+completed.tools.instances[toolKey].failures,1);
 const stored=JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));assert.deepEqual(stored.tools,completed.tools);assert.deepEqual(stored.equipment_durability,completed.durability);
 await p.screenshot({path:join(out,'completed-1920.png')});await roundtrip('completed');await s.step(3);assert.deepEqual(await state(),completed);
 checks.push('Completion durably settles exactly one native outcome/draw; later time and persistence do not repeat it');
 phase='segmented interval';console.log(phase);await s.open(pendingNativeSave);p=s.page;await tools();
 receipts.push(await scenario.advance(Math.floor(total/2)));receipts.push(await scenario.advance(total-Math.floor(total/2)));
 assert.deepEqual(await state(),completed);checks.push('One whole interval and two boundary-aligned requests through the native clock settle the same exact repair state');
 phase='21px retained UI';console.log(phase);const large=await s.save();large.customization=defaultCustomizationState();large.customization.profiles.Default.settings.typography.size=21;
 await s.open(large);p=s.page;await tools();assert.equal(await p.locator('#tools_panel').evaluate(n=>getComputedStyle(n).fontSize),'21px');
 await p.screenshot({path:join(out,'completed-1920-21.png')});checks.push('Native Tools at1920×1080 retains readable completion/condition controls at actual21px');
 phase='changed-target pause';console.log(phase);const changed=structuredClone(pendingNativeSave);changed.customization=large.customization;changed.equipment_durability.condition[toolKey]+=.1;
 await s.open(changed);p=s.page;await tools();const changedBefore=await state();await s.step(1);const changedAfter=await state();
 assert.equal(changedAfter.tools.job.minutesLeft,changedBefore.tools.job.minutesLeft);assert.equal(changedAfter.draws.length,changedBefore.draws.length);
 assert.match(await p.locator('#tools_panel').innerText(),/tool changed; cancel and review a fresh quote/);await p.screenshot({path:join(out,'changed-target-1920-21.png')});
 await p.locator('[data-tools-cancel]').press('Enter');assert.equal((await state()).ingots,changedBefore.ingots+1);assert.equal((await state()).tools.job,null);
 checks.push('At actual21px, a changed restored target visibly pauses, consumes no work/draw and allows one native cancellation refund');
 await writeFile(join(out,'scenario-receipts.json'),JSON.stringify(receipts,null,2));
 for(const receipt of receipts)assert.equal(receipt.status,'applied',JSON.stringify(receipt.error));
 assert.deepEqual(s.errors.filter(e=>!(/404/.test(e.text)&&e.kind==='console')),[]);
 const receipt={status:'passed',setup:scenario.identity(),checks,inputMethod:'Native pointer purchase/equip/quote; keyboard Enter on Start/Cancel preserves the existing accessible control route where a saved divider crosses the button center.',repairResult:completed.tools.instances[toolKey],bundleSha256:createHash('sha256').update(await readFile('dist/bundle.js')).digest('hex'),errors:s.errors};
 await writeFile(join(out,'browser-receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}catch(error){await writeFile(join(out,'diagnostic-scenario.json'),JSON.stringify({receipts,state:await state().catch(()=>null),text:await p?.locator('#tools_panel').innerText().catch(()=>null)},null,2));await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.json'),JSON.stringify({phase,error:error.stack,errors:s.errors},null,2));throw error;}
finally{await s.close();await server.close();}
