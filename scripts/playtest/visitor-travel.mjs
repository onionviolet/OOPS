// Rebuilt native visitor journey on a fresh disposable origin, desktop 1920x1080.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve,Session} from './lib.mjs';
import {resumeElectronGame} from './electron_ready.mjs';
const out=resolve(process.argv[2]||'docs/reviews/corc_ui_2026-10-21/visitor-travel');await mkdir(out,{recursive:true});
const fixture='docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-control-pending.txt';
const seed=JSON.parse(Buffer.from((await readFile(fixture,'utf8')).split(':')[1],'base64'));
delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
const server=await serve(resolve('dist')),s=new Session({url:server.url,seed:71,wall:Date.UTC(2026,9,21),opTimeout:12000});
const checks=[];let phase='open';
try {
 await s.start();s.context=await s.browser.newContext({viewport:{width:1920,height:1080}});
 await s.context.addInitScript(data=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',data);sessionStorage.setItem('seeded','1');}},JSON.stringify(seed));
 const p=s.page=await s.context.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>s.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')s.errors.push(m.text());});
 await p.goto(server.url);await resumeElectronGame(p);await p.evaluate(()=>simulationTestHooks.pause());
 await p.locator('#workspace_navigation select').first().selectOption('notebook');await p.locator('#notebook_tab_here').click();
 await p.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});
 const local=p.locator('#feature_expansion_panel');
 const openControls=async()=>{await p.locator('#workspace_navigation select').first().selectOption('notebook');await p.locator('#notebook_tab_here').click();await local.evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});};
 const click=async(label)=>{await openControls();await local.getByRole('button',{name:label}).click();};
 const header=async()=>({date:await p.locator('.scene-calendar').innerText(),conditions:await p.locator('.scene-conditions').innerText(),place:await p.locator('.scene-location-header strong').innerText()});
 const visitor=async()=>{const h=await header();assert.match(h.date,/Cyoria visitor/);assert.doesNotMatch(h.date,/999/);assert.doesNotMatch(h.conditions,/Summer|comfortable/);assert.match(h.conditions,/climate proposal/);assert.equal((await s.save()).expansion.actors.player.worldId,'book.mol.cyoria');return h;};
 phase='visitor restore';await visitor();
 phase='cancel actual held work';await click(/^Do this: Cancel Practice manual brightness/);assert.equal((await s.save()).expansion.simulation.jobs.filter(j=>j.actorId==='player').length,0);
 phase='walk to native arrival';await click(/^Do this: Walk to Cyoria visitor arrival$/);assert.equal((await s.save())['current location'],'Cyoria visitor arrival');
 phase='native return home';await click(/^Do this: Return to Village in your own body and cargo$/);let home=await header();assert.doesNotMatch(home.date,/Cyoria/);assert.match(home.date,/999/);assert.match(home.conditions,/Summer/);assert.equal((await s.save()).expansion.actors.player.worldId,'base.frontier');checks.push('Native cancel, walk to arrival and return restore Home calendar, season and location');await p.screenshot({path:join(out,'returned-home.png')});
 phase='native reentry';await click(/^Do this: Enter your retained Cyoria visitor instance$/);const entered=await visitor();checks.push('Native retained-world entry binds the local visitor date and qualified climate without Home season');await p.locator('#center_mode_back').click();await p.screenshot({path:join(out,'entered-visitor.png')});
 const before=await s.save(),visit=before.expansion.motherOfLearning.activeVisitId;
 phase='visitor save reload';await p.reload();await resumeElectronGame(p);await p.evaluate(()=>simulationTestHooks.pause());await visitor();assert.equal((await s.save()).expansion.motherOfLearning.activeVisitId,visit);
 phase='visitor export import';const literal=await p.evaluate(()=>save_to_file());assert.equal(typeof literal,'string');await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await resumeElectronGame(p);await p.evaluate(()=>simulationTestHooks.pause());await visitor();assert.equal((await s.save()).expansion.motherOfLearning.activeVisitId,visit);checks.push('Same native visitor instance and local header survive Save, reload, Export and literal Import');await p.screenshot({path:join(out,'visitor-import.png')});
 phase='final native return';await click(/^Do this: Return to Village in your own body and cargo$/);home=await header();assert.doesNotMatch(home.date,/Cyoria/);assert.match(home.conditions,/Summer/);checks.push('Native return remains usable after visitor persistence roundtrip');
 assert.deepEqual(s.errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({viewport:{width:1920,height:1080},fixture,setup:'Existing disposable retained-visit fixture; removed two legacy undefined recipe availability keys. Native UI cancels pending work, walks, returns, re-enters and persists. Natural onboarding/acquisition pacing not asserted.',checks,entered,home,errors:s.errors},null,2));console.log(JSON.stringify({checks:checks.length,errors:s.errors,out}));
} catch(e) {await s.page?.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.json'),JSON.stringify({phase,error:e.stack,errors:s.errors},null,2));throw e;}finally{await s.browser?.close();server.close();}
