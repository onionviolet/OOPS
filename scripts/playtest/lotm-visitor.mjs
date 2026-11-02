// Bounded source-bound visit probe. Source text, actors and checkpoints remain private.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {Session} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';
import {serve} from '../perf/lib.mjs';
const root=resolve(process.argv[2]||'/tmp/lotm-kj3b-review');
const out=resolve(process.env.YAIRPG_EVIDENCE_DIR||'docs/research/novels/lord-of-mysteries/private/kj3-visitor-2026-11-02');
const start=JSON.parse(await fs.readFile('docs/research/novels/lord-of-mysteries/private/kj3-first-situation-2026-11-01/completed-checkpoint.json','utf8'));
const pack=JSON.parse(await fs.readFile(root+'/private_packs/lotm-cast/cast.json','utf8'));
const visit=pack.householdActs.visits.at(-1),rows=pack.householdActs.acts.filter(a=>a.id.startsWith('book.lotm.kj3b.'));
const prefix='book.lotm.kj3b.',world='book.lotm.tingen',room=rows[0].place,recipient=visit.participants[2];
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,2),opTimeout:20000}).start();
const route=new NativeContinuation(session,{stepLimit:200,ticksPerMinute:60});
let p,pending,preMemory,stale;const result={route:'earned KJ3A checkpoint, 18 native stages including explicit inferred custody bridge',steps:[],checks:[]};
const view=()=>route.view();
const snapshot=()=>route.snapshot();
const panel=()=>route.panel();
async function load(s){await route.load(s);p=route.page;}
const settle=()=>route.settle();
const current=async()=>(await route.startCurrent({exact:true})).id;
async function imported(encoded){await route.imported(encoded);p=route.page;}
const fact=(s,k)=>s.expansion.worlds[world].facts[k];
try{
 result.bundleSha256=createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex');result.packSha256=createHash('sha256').update(await fs.readFile(root+'/private_packs/lotm-cast/cast.json')).digest('hex');
 await load(start);assert.equal((await view()).arc.id,'tingen_first_visit');assert.equal((await view()).arc.completed,0);assert.equal(fact(await snapshot(),'household.opening.revolver.container'),'coat');
 const encoded=await p.evaluate(()=>save_to_file());await fs.writeFile(out+'/start-export.txt',encoded);await imported(encoded);assert.equal((await view()).arc.completed,0);result.checks.push('earned old checkpoint imports without resetting earlier stages or silently changing carried custody');
 while(!(await view()).arc.done){const command=(await view()).arc.next.id,stage=command.slice(prefix.length);console.log('Starting',stage);
  if(stage==='memory')preMemory=await session.save();
  await current();
  if(stage==='memory'){
   assert.equal((await view()).jobs.length,1);assert.equal((await snapshot()).expansion.simulation.knowledge[recipient]?.[prefix+'account.memory'],undefined);
   pending=await session.save();await fs.writeFile(out+'/pending-account.json',JSON.stringify(pending));
   const e=await p.evaluate(()=>save_to_file());await fs.writeFile(out+'/pending-export.txt',e);await imported(e);
   assert.equal((await view()).jobs.length,1);assert.equal((await snapshot()).expansion.simulation.knowledge[recipient]?.[prefix+'account.memory'],undefined);result.checks.push('pending account Export/Import preserves the live job and delivers no premature testimony');
   for(const size of[14,21]){const s=structuredClone(pending);s.customization.profiles.Default.settings.typography={font:'gothic',size};await load(s);assert.equal(await p.locator('[data-lotm-arc] p').first().evaluate(n=>getComputedStyle(n).fontSize),size+'px');assert(await p.locator('[data-lotm="cancel"]').first().isVisible());assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:out+`/pending-${size}.png`,timeout:10000});}
   result.checks.push('pending restored work and Stop visible at actual 14/21 px, 1920x1080');
  }
  await settle();await panel();result.steps.push(command);const s=await session.save();await fs.writeFile(out+'/earned-stage-'+result.steps.length+'.json',JSON.stringify(s));
  if(stage==='conceal'){assert.equal(fact(s,'household.opening.revolver.container'),'household.kj3b.stove');assert.equal(fact(s,'household.opening.revolver.rounds'),5);}
  if(stage==='open'){for(const id of visit.participants)assert.equal(s.expansion.simulation.people[id].location,room);stale=await p.locator(`[data-lotm="${command}"]`).first().elementHandle().catch(()=>null);}
  if(stage==='memory'){for(const id of visit.participants){assert.equal(s.expansion.simulation.people[id].location,room);assert(s.expansion.simulation.knowledge[id][prefix+'account.memory']);assert.equal(s.expansion.simulation.knowledge[id][prefix+'expert.seen'],undefined);}}
  if(stage==='search'){assert.equal(fact(s,'household.kj3b.notebook.holder'),'desk');assert.equal(fact(s,'household.opening.revolver.container'),'household.kj3b.stove');}
  if(result.steps.length>rows.length)throw Error('Exceeded visit boundary');
 }
 assert.equal(result.steps.length,18);const final=await session.save();await fs.writeFile(out+'/completed-checkpoint.json',JSON.stringify(final));
 assert.equal(fact(final,'household.opening.revolver.rounds'),5);assert.equal(fact(final,'household.opening.revolver.container'),'household.kj3b.stove');assert.equal(fact(final,'household.kj3b.notebook.holder'),'desk');
 for(const id of visit.participants)assert.notEqual(final.expansion.simulation.people[id].location,room);
 assert(final.expansion.simulation.knowledge.player[prefix+'stay_notice']);assert(final.expansion.simulation.knowledge.player[prefix+'review.seen']);
 assert.deepEqual(final.inventories,start.inventories,'visit creates or consumes no native items');result.checks.push('all 18 earned stages settle; exact gun/rounds and notebook custody survive search; actual visitors depart; received warning feeds review');
 await p.reload();await p.locator('#loading_screen_play_button').waitFor({timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await panel();assert.equal((await view()).arc.done,true);
 const e=await p.evaluate(()=>save_to_file());await fs.writeFile(out+'/completed-export.txt',e);await imported(e);assert.equal((await view()).arc.done,true);assert.equal(fact(await snapshot(),'household.opening.revolver.container'),'household.kj3b.stove');result.checks.push('settled save/reload/Export/Import retains departure, knowledge and physical custody without repeats');
 for(const size of[14,21]){const s=structuredClone(final);s.customization.profiles.Default.settings.typography={font:'gothic',size};await load(s);assert.equal(await p.locator('[data-lotm-arc] p').first().evaluate(n=>getComputedStyle(n).fontSize),size+'px');await p.screenshot({path:out+`/complete-${size}.png`,timeout:10000});}
 const before=await snapshot();await p.locator('#lotm_panel [data-tab="notebook"]').click();assert((await view()).records.some(r=>r.id===prefix+'warning.seen'));await p.screenshot({path:out+'/notebook-21.png',timeout:10000});await p.locator('#lotm_panel [data-tab="here"]').click();assert.deepEqual(await snapshot(),before);result.checks.push('retained visit observations are readable in Notebook; tabs neither advance work nor grant or spread knowledge');
 const forgotten=structuredClone(final);delete forgotten.expansion.simulation.knowledge.player[prefix+'expert.seen'];await load(forgotten);assert.equal((await view()).arc.done,true);assert.equal((await view()).records.some(r=>r.id===prefix+'expert.seen'),false);result.checks.push('completed visit history does not reconstruct an erased statement');
 // Counterfactuals are derived from named earned states, not director saves.
 const absent=structuredClone(preMemory);absent.expansion.simulation.people[recipient].location='Whereabouts unplaced';await load(absent);assert.equal((await view()).objectActs.find(a=>a.id===prefix+'memory').eligible,false);assert.match((await view()).objectActs.find(a=>a.id===prefix+'memory').reasons.join(' '),/participant|location|together/i);result.checks.push('a displaced actual recipient blocks a new account; itinerary hold does not recreate or teleport them');
 const lost=structuredClone(pending);lost.expansion.simulation.people[recipient].location='Whereabouts unplaced';await load(lost);await settle();assert.equal((await snapshot()).expansion.simulation.knowledge[recipient]?.[prefix+'account.memory'],undefined);assert.equal((await snapshot()).expansion.simulation.knowledge.player[prefix+'memory.seen'],undefined);assert.equal((await view()).arc.next.id,prefix+'memory');result.checks.push('recipient support lost during pending work stops settlement and grants no testimony or completion');
 await load(pending);await p.locator('[data-lotm="cancel"]').first().click();assert.equal((await view()).jobs.length,0);assert.equal((await snapshot()).expansion.simulation.knowledge[recipient]?.[prefix+'account.memory'],undefined);assert.equal((await view()).arc.next.id,prefix+'memory');result.checks.push('Stop cancels pending speech without giving listeners unfinished testimony');
 result.pageErrors=session.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(result.pageErrors,[]);result.review='agent-verified earned continuation and explicit counterfactuals; not human-reviewed or installed';console.log(JSON.stringify({steps:result.steps.length,checks:result.checks.length,pageErrors:result.pageErrors}));
}catch(e){result.error=e.stack;console.error(e.stack);process.exitCode=1;if(p)await p.screenshot({path:out+'/failure.png',timeout:10000}).catch(()=>{});}finally{result.timings=route.timings;await fs.writeFile(out+'/browser-result.json',JSON.stringify(result,null,2));await session.close();await server.close();}
