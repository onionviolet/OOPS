// Authentic restored cast, late-response prerequisite setup only. Feature steps use rendered controls.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';import {tmpdir} from 'node:os';import {createHash} from 'node:crypto';
import {serve,Session} from '../scripts/playtest/lib.mjs';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {BE_SEER_ENERGY,beSeerSources,beSeerDrinkEffects,beSeerSteadyEffects} from '../src/book_world_lotm_be_seer.js';
import {CHARM_MENTOR_ID as neil} from '../src/lotm_charm_upkeep.js';
import {RESPONSE_LOAN_ID,RESPONSE_CHARM,NEIL_RESPONSE_CHARM,RESPONSE_SCALAR,RESPONSE_BORROW,RESPONSE_NEIL_USE,RESPONSE_USE,RESPONSE_HOME,RESPONSE_KEEP,RESPONSE_RELEASE,RESPONSE_RETURN,RESPONSE_REBORROW,RESPONSE_INTENT} from '../src/lotm_charm_response.js';
import {placeActStages} from '../src/place_act_sequence.js';
const swain='lotm.person.cast-bee85a570706987a115c',dock='lotm.place.kj3ba.river-dock',deck='lotm.place.kj3ba.cargo-deck';
const evidence=join(process.cwd(),'docs/representations/evidence/lotm-lender-release-reviewed-2026-11-25');
const expectedBundle='9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1';
const scratch=await mkdtemp(join(tmpdir(),'oops-response-'));
const server=await serve(join(process.cwd(),'dist'));
const session=new Session({url:server.url,seed:79,wall:Date.UTC(2026,10,25,18),opTimeout:30000});
const snap=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const panel=()=>session.page.locator('#lotm_panel');
const open=()=>panel().evaluate(n=>n.querySelectorAll('details').forEach(d=>{d.open=true;}));
const show=async()=>{await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await panel().locator('[data-tab="here"]').click({force:true});await open();};
const step=async m=>{await session.page.evaluate(m=>window.advanceTicks(m,{render:true}),m);await open();};
const click=async id=>{console.log('UI action',id);await open();const b=session.page.locator(`[data-lotm="${id}"]`).first();assert.equal(await b.isEnabled(),true,`${id}: ${await b.getAttribute('title')}`);await b.click({force:true});};
const count=(s,k)=>s.inventories.person.main_character[k]?.count||0;
const read=s=>({cash:s.character.money,held:count(s,RESPONSE_CHARM),neilOwn:s.expansion.simulation.owners[neil]?.[NEIL_RESPONSE_CHARM]||0,neilReturned:s.expansion.simulation.owners[neil]?.[RESPONSE_CHARM]||0,loan:s.expansion.simulation.custody[RESPONSE_LOAN_ID]||null,choice:s.expansion.actors.player.facts['lotm.charm.response.choice']||'',state:s.expansion.actors.player.facts['book.lotm.kj3ba.charm-loan']||'',intent:s.expansion.actors[neil].facts[RESPONSE_INTENT]||'',jobs:s.expansion.simulation.jobs.map(j=>({commandId:j.commandId,costs:j.costs,due:j.due}))});
const boot=async()=>{const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);await p.evaluate(()=>window.simulationTestHooks.pause());await p.waitForFunction(()=>document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden');if(await p.locator('#loading_screen_play_button').isVisible())await p.locator('#loading_screen_play_button').click({force:true});await p.waitForFunction(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');};
async function roundTrip(label){const p=session.page,before=read(await snap());await p.locator('#save_button').click();await p.reload();await boot();await show();assert.deepEqual(read(await snap()),before);
 const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=join(scratch,label+'.txt');await(await download).saveAs(file);await p.evaluate(()=>localStorage.clear());await p.reload();await boot();const imported=p.waitForEvent('domcontentloaded');await p.locator('#saved_file_input').setInputFiles(file);await imported;await boot();await show();assert.deepEqual(read(await snap()),before);}
try{
 assert.equal(createHash('sha256').update(await readFile('dist/bundle.js')).digest('hex'),expectedBundle);
 await session.start();await session.open();await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
 await panel().locator('[data-lotm="pick_be"]').waitFor();await session.page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();
 const initial=await snap();assert.equal(count(initial,RESPONSE_CHARM),0);assert.equal(initial.expansion.simulation.owners[neil]?.[RESPONSE_CHARM]||0,0);
 const ready=structuredClone(initial),s=ready.expansion;
 const authentic=JSON.parse(await readFile('private_packs/lotm-cast/cast.json','utf8'));
 for(const stage of placeActStages(authentic.householdActs)){if(stage.commandId===RESPONSE_BORROW)break;s.actors.player.completed[stage.commandId]=1;}
 for(const actor of ['player',neil,swain])s.simulation.people[actor].location=dock;
 ready['current location']=dock;s.actors.player.facts['book.lotm.kj3ba.support-order']='slow the Rampager';
 s.worlds['book.lotm.tingen'].facts['household.opening.revolver.holder']='player';s.worlds['book.lotm.tingen'].facts['book.lotm.kj3at.cane-holder']='player';s.worlds['book.lotm.tingen'].facts['household.opening.revolver.rounds']=3;
 const plan={state:s,gameplay:{player:{inventory:{}}},acquisitions:[],external:{}};
 applySimulationEffects(plan,[...beSeerDrinkEffects(),...beSeerSteadyEffects()],{actorId:'player'},{sources:new Map(beSeerSources.map(row=>[row.id,row])),simulation:createSimulationRegistry({energies:[BE_SEER_ENERGY]})},'test.response-prerequisites');
 console.log('Native start created, late response prerequisites prepared',JSON.stringify({people:Object.keys(s.simulation.people).length,actorLocation:s.simulation.people.player.location,cash:ready.character.money}));
 const absent=structuredClone(ready);absent.expansion.simulation.people[swain].location='lotm.place.cast-266d12fc010442f95bac';await session.open(absent);await show();
 const unavailable=panel().locator(`[data-lotm="${RESPONSE_BORROW}"]`).first();assert.equal(await unavailable.isDisabled(),true);assert.equal(count(await snap(),RESPONSE_CHARM),0);assert.equal((await snap()).expansion.simulation.custody[RESPONSE_LOAN_ID],undefined);await mkdir(evidence,{recursive:true});await unavailable.locator('..').screenshot({path:join(evidence,'source-party-unmet-1920.png')});console.log('Absent source colleague correctly blocks the opportunity without stock');
 await session.open(ready);await show();console.log('Prepared body',JSON.stringify(await session.page.evaluate(()=>{const s=window.simulationTestHooks.snapshot(),v=window.simulationTestHooks.project('lotm');return {at:s['current location'],body:s.expansion.simulation.people.player.location,viewAt:v.atId,objects:v.objectActs?.map(a=>({id:a.id,eligible:a.eligible,reasons:a.reasons})),notice:document.querySelector('#lotm_panel')?.innerText.slice(0,400)};})));await click(RESPONSE_BORROW);await step(1);let after=await snap();assert.equal(count(after,RESPONSE_CHARM),1);assert.equal(after.expansion.simulation.owners[neil][NEIL_RESPONSE_CHARM],1);assert.ok(after.expansion.simulation.custody[RESPONSE_LOAN_ID]);
 await click(RESPONSE_RETURN+'.agree');await step(1);assert.equal(read(await snap()).neilReturned,1);await click(RESPONSE_REBORROW+'.agree');await step(1);assert.equal(read(await snap()).held,1);assert.equal(read(await snap()).neilOwn,1);
 await click('book.lotm.kj3ba.see-rampager');await step(1);await click('book.lotm.kj3ba.fire-and-roll');await step(1);await click(RESPONSE_NEIL_USE);await step(1);assert.equal(read(await snap()).neilOwn,0);
 await click(RESPONSE_USE);await roundTrip('response-use-pending');await step(1);assert.equal(read(await snap()).held,0);assert.ok(read(await snap()).loan);
 await click('book.lotm.kj3ba.see-swain-stop-it');await step(1);await click('book.lotm.kj3ba.hear-neil-reflect');await step(1);
 await mkdir(evidence,{recursive:true});await panel().locator('[data-lotm-charm-loan]').screenshot({path:join(evidence,'response-still-owed-1920.png')});
 const consumed=await snap();await click(RESPONSE_KEEP+'.agree');await step(1);assert.equal(read(await snap()).choice,'continue');assert.ok(read(await snap()).loan);await roundTrip('promise-continued');
 await click('book.lotm.kj3bb.recover-cane');await step(2);await click(RESPONSE_HOME);await step(19);assert.ok(read(await snap()).loan);assert.equal(read(await snap()).choice,'continue');
 await session.open(consumed);await show();const cash=read(await snap()).cash;await click(RESPONSE_RELEASE+'.agree');await roundTrip('release-pending');await step(1);const released=read(await snap());assert.equal(released.loan,null);assert.equal(released.choice,'released');assert.equal(released.cash,cash);assert.match(released.intent,/no agreement, amount or collection/);assert.equal(released.held+released.neilOwn+released.neilReturned,0);
 await roundTrip('creditor-released');await panel().locator('[data-lotm-charm-loan]').screenshot({path:join(evidence,'creditor-released-1920.png')});
 assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
 const bundleHash=createHash('sha256').update(await readFile('dist/bundle.js')).digest('hex');assert.equal(bundleHash,expectedBundle);const servedBundle=await session.page.locator('script[src*="dist/bundle.js"]').getAttribute('src');assert.ok(servedBundle.includes(expectedBundle.slice(0,12)));const proof={proposalId:'4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03',bundleHash,servedBundle,viewport:'1920x1080',route:'Native Klein entry with genuine restored LOTM cast, late response prerequisites fixture; rendered source response and creditor choices',setup:'Actual source cast and native entry, zero starting charm units; prior ordered receipts and late response/Seer prerequisites are fixture setup, with no claim of an earned full journey. No synthetic cast or reader rows.',sourceColleagueAbsentBlockedWithoutStock:true,initialSourceStock:0,borrowed:1,lenderOwn:1,unusedReturnAndReborrow:true,bothActuallyConsumed:true,continuedPromiseSurvivesHome:true,creditorRelease:true,compensation:'Intent only; no third-party agreement or payment',cashBeforeAndAfter:cash,persistence:'Save/reload/Export/Import during response use and release, and after continuation and release',errors:session.errors.filter(e=>e.kind==='pageerror'),status:'agent-verified, not human-reviewed'};
 await writeFile(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}catch(error){console.error(error.stack);console.error(session.errors.slice(-5));throw error;}
finally{await session.browser?.close().catch(()=>{});server.close();await rm(scratch,{recursive:true,force:true});}
