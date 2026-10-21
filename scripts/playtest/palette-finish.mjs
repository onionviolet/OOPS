// Finite routine + retained intent + native custody/navigation, on rebuilt disposable inputs.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {ROUTE,PATCHES} from '../headless/village_route.mjs';
import {createHarvest,drawSpecimen,addCarcass} from '../../src/harvest.js';
import {calendarMinutes} from '../../src/world_rhythm.js';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]||'/tmp/oops-palette-finish-journey');await mkdir(out,{recursive:true});
const server=await serve(root),missing=[],s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:15000,hooks:{beforeOpen:async c=>{c.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);});}}});
const checks=[],saves={},key=id=>JSON.stringify({id});let p;
const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
async function play(){await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(300);}
async function routePanel(id){await p.locator('#workspace_navigation select').first().selectOption(id);await p.waitForTimeout(250);}
async function roundtrip(label){const before=await s.save();await p.reload();await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(before)),[]);const literal=await p.evaluate(()=>save_to_file()),exported=await s.save();await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(exported)),[]);checks.push(label+' exact Save/reload/Export/literal Import');}
try{
 await s.start();const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8')),clock=calendarMinutes(seed['current time']);seed.harvest=createHarvest();seed.availabilities.skill.Butchering=1;seed.levels.person.main_character.skill_xp.Butchering=99;
 for(let i=0;i<3;i++)addCarcass(seed.harvest,drawSpecimen({species:'Wolf rat',key:`palette:finite:${i}`,clock},()=>.5),{clock,skill:0,tool:0});
 await s.open(seed);p=s.page;await s.save();await p.reload();await play();
 await routePanel('carcass-processing');await p.locator('#harvest_panel').evaluate(el=>el.open=true);
 await p.locator('[data-harvest-target]').fill('2');await p.locator('[data-harvest="routine"]').click();await s.step(1);await s.step(1);await p.waitForTimeout(600);
 assert.equal((await snap()).harvest.routine.target,2);assert.equal(await p.locator('.work-stage-track span').count(),3);assert.match(await p.locator('#harvest_panel .work-stage-track').innerText(),/pelt work: 4/);
 await p.locator('[data-harvest="pause-routine"]').click();await roundtrip('Paused finite target and current work');
 await s.step((await snap()).harvest.job.remaining);await p.waitForTimeout(600);assert.equal((await snap()).harvest.routine.completed,1);assert.equal(await p.locator('#shell_condition .palette-body-pose[data-pose="steady-hands"]').isVisible(),true,'actual native Butchering level gain causes the authored pose');await p.screenshot({path:join(out,'known-competence.png')});checks.push('Known native Butchering level increase produces its authored steady-hands response');assert.equal((await snap()).harvest.job,null);
 await routePanel('carcass-processing');await p.locator('#harvest_panel').evaluate(el=>el.open=true);await p.locator('[data-harvest="resume-routine"]').click();await s.step(1);await s.step((await snap()).harvest.job.remaining);await p.waitForTimeout(600);
 const finished=await snap();assert.equal(finished.harvest.routine.status,'complete');assert.equal(finished.harvest.routine.completed,2);assert.equal(finished.harvest.auto,false);assert.equal(Object.values(finished.harvest.routine.outputs).reduce((a,b)=>a+b,0),8);assert.equal(finished.harvest.lots['Wolf rat'].length,1);
 assert.match(await p.locator('[data-harvest-routine]').innerText(),/2\/2/);await p.screenshot({path:join(out,'finite-routine.png')});await roundtrip('Completed finite target and actual cross-cycle output tally');checks.push('Unequal native work allocation and discrete finite target use actual native completions; exact target stops with a carcass left');
 // The recorded village route acquires tools through dialogue, earns gathering XP,
 // trades and crafts natively. Its one access/ore patch is explicit fixture setup.
 await s.open();p=s.page;
 for(const op of ROUTE){if(op.op==='click')await p.locator(op.sel).click();else if(op.op==='step')await s.step(op.minutes);else if(op.op==='save')saves[op.name]=await s.save();else if(op.op==='load'){await s.open(PATCHES[op.patch](saves[op.from]));p=s.page;}}
 const worked=saves.worked,final=saves.final;assert.ok(worked.levels.person.main_character.skill_xp.Woodcutting>saves.talked.levels.person.main_character.skill_xp.Woodcutting);assert.ok(final.total_crafting_attempts>saves.bought.total_crafting_attempts);checks.push('Native dialogue tool acquisition, gathering learning, market purchase and craft succeed in the shared village route; access and ore are fixture patches');
 // Two real holders: exact-key deposit/withdraw follows actual chest UI ordering.
 const home=await s.save();home['current location']='Shack';home.availabilities.location.Shack=1;home.locations.Shack={...home.locations.Shack,housing_unlocked:true};home.character.hp_to_full=3;home.inventories.person.main_character[key('Stale bread')]={count:3};
 await s.open(home);p=s.page;await p.locator('button[data-place-tab="options"]').click();await p.locator('#p23_household_panel').evaluate(el=>el.open=true);
 assert.equal(await p.locator('[data-household-action="meet"]').isEnabled(),true,'home controls are ready without any native tick');
 await p.locator('button[data-place-tab="actions"]').click();await p.locator('#open_storage_div').click();const bread=p.locator(`#inventory_content_div > [data-character_item='${key('Stale bread')}']`);await bread.click();assert.equal((await snap()).inventories.storage.player[key('Stale bread')].count,1);assert.equal((await snap()).inventories.person.main_character[key('Stale bread')].count,2);
 await p.locator(`#storage_inventory_div > [data-storage_item='${key('Stale bread')}']`).click();assert.equal((await snap()).inventories.person.main_character[key('Stale bread')].count,3);await p.locator('#center_mode_back').click();
 await p.screenshot({path:join(out,'native-chest.png')});
 await p.locator('#start_sleeping_div').click();await s.step(1);await p.waitForTimeout(250);await p.locator('#center_mode_back').click();
 // Return to Village to show the existing body response host; recovery itself is
 // verified against actual native hp, and remains text when its scene is hidden.
 assert.ok((await snap()).character.hp_to_full<3);assert.match(await p.locator('.body-expression').innerText(),/Health \+3/);assert.equal(await p.locator('#shell_condition .palette-body-pose[data-pose="recovery"]').isVisible(),true);await p.locator('#shell_condition > details > summary').click();assert.match(await p.locator('.body-expression-detail').innerText(),/Health recovered by 3/);await p.locator('#shell_condition > details > summary').click();await p.screenshot({path:join(out,'body-recovery.png')});checks.push('Actual native rest restores missing health with no capacity-growth inference');checks.push('Native two-holder chest deposit and withdraw conserve the exact key; paused-load household controls are immediately enabled');
 // A real departure and return yields explicitly remembered, non-live health.
 await p.evaluate(()=>change_location({location_id:'Village',skip_travel_time:true}));await p.waitForTimeout(200);await p.evaluate(()=>change_location({location_id:'Shack',skip_travel_time:true}));await p.waitForTimeout(200);await p.evaluate(()=>change_location({location_id:'Village',skip_travel_time:true}));await p.waitForTimeout(250);await routePanel('around-place');
 const details=p.locator('#palette_feedback_panel details');await details.evaluate(el=>el.open=true);assert.ok(await p.locator('[data-stale="true"]').count());assert.match(await p.locator('[data-stale="true"]').first().innerText(),/Remembered during previous visit/);await p.screenshot({path:join(out,'remembered-reading.png')});checks.push('Actual departure/return renders a stale health observation with previous-visit provenance');
 const combat=await s.save();combat['current location']='Infested field';combat.availabilities.location['Infested field']=1;await s.open(combat);p=s.page;
 await p.locator('[data-inspect-enemy]').first().waitFor({state:'visible'});const inspected=await p.locator('[data-inspect-enemy]').first().getAttribute('data-inspect-enemy');await p.locator('[data-inspect-enemy]').first().click();
 await p.evaluate(()=>change_location({location_id:'Village'}));await p.waitForTimeout(250);assert.equal(await p.locator(`[data-inspect-enemy="${inspected}"]:visible`).count(),0);assert.equal(await p.locator('.enemy-card:visible').count(),0);checks.push('Native combat inspection binds an occurrence; departure removes its live opponent controls');
 for(const size of [14,21]){const view=await s.save();view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);p=s.page;for(const [width,height]of [[1920,1080],[1536,864]]){await p.setViewportSize({width,height});await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`reading-${size}-${width}.png`)});}}checks.push('Actual 14px and 21px desktop interactions retain document width at 1920 and 1536');
 const optional='Failed to load resource: the server responded with a status of 404 (Not Found)';assert.deepEqual(missing.filter(x=>x!=='/private_packs/manifest.json'),[]);assert.deepEqual(s.errors.filter(e=>e.kind!=='console'||e.text!==optional),[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,setup:'Disposable fixtures only; finite body/skill/access inputs are explicitly seeded. Native UI actions and shared village route; natural whole-campaign progression and human acceptance not claimed.',missing,errors:s.errors},null,2));console.log(JSON.stringify({checks:checks.length,out}));
}catch(e){await writeFile(join(out,'failure.txt'),e.stack||String(e));await writeFile(join(out,'errors.json'),JSON.stringify(s.errors,null,2));await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}finally{await s.close();await server.close();}
