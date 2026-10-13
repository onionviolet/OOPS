import test from 'node:test';
import assert from 'node:assert/strict';
import {createFieldFixture,joinField,completeFieldProject} from '../../../../../../scripts/field_fixtures.mjs';
import {expeditionRegistry as registry} from '../../../../../../src/expedition_content.js';
import {advanceSimulationBoundary} from '../../../../../../src/simulation.js';
import {commitHomeFurnishingCommand as commit} from '../../../../../../src/home_furnishing_host.js';
import {homeFurnishingFacts,validateHomeFurnishings} from '../../../../../../src/home_furnishing_facts.js';
import {HOME_FURNISHING_IDS as I,HOME_FURNISHING_KEYS as K,homeFurnishingDefinitions as D} from '../../../../../../src/home_furnishing_content.js';
import {cancelSimulationJob,previewSimulationCommand} from '../../../../../../src/simulation.js';
import {MOL_IDS as M,MOL_SOURCE_HASH,MOL_SOURCE_SNAPSHOT} from '../../../../../../src/book_world_mol_ids.js';
import {applySimulationEffects} from '../../../../../../src/simulation_effects.js';
import {molCommands} from '../../../../../../src/book_world_mol_actions.js';
// Controlled SOURCE fixtures only. No natural acquisition, native save/import,
// browser proof or director acceptance is represented by this file. The
// exact furnishing host/validator and shared scheduler boundary are exercised;
// synthetic campaign receipts are not passed off as full-root save validation.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:{player:{}},nativeAlive:true,nativeBody:body,facts:{location:'Shack','native.zone.Shack.accessible':true},...extra});
const start=(p,id,extra={},seq=p.state.sequence)=>commit(p.state,registry,{type:I.group,id},ctx(p,extra),seq);
const advance=(p,n,extra={})=>{const c=ctx(p,extra),out=structuredClone(p);out.vitals=structuredClone(c.vitals);out.equipment=structuredClone(c.equipment);for(let i=0;i<n;i++){out.state.clock++;advanceSimulationBoundary(out,registry,{player:{...c,vitals:c.vitals.player}});}return out;};
const job=p=>p.state.simulation.jobs.find(j=>j.commandId.startsWith(I.prefix));
const slots=p=>Object.keys(p.state.simulation.sites[I.site].reservations);
const stock=(p,k)=>p.gameplay.player.inventory[k]||0;
const roundtrip=p=>{const out=JSON.parse(JSON.stringify(p));validateHomeFurnishings(out.state,registry);return out;};
function supplied(){let p=completeFieldProject(joinField(createFieldFixture()));
 const s=p.state,a=s.actors.player;s.schema=11;s.auditRemainder={schema:1,definitionRevision:1,modules:{}};s.referenceGameplay={schema:1};a.facts['audit_remainder.enrolled']=true;a.completed['audit_remainder.enroll']=1;
 s.simulation.schema=4;s.simulation.situations||={};s.simulation.sites[I.site].owner='player';s.simulation.people.player.body=structuredClone(body);s.simulation.people.player.location='Shack';
 p.gameplay.player.inventory={[K.log]:20,[K.kit]:2,[K.sap]:5,[K.green]:8,[K.sharp]:1};return p;}
function rack(){let p=supplied();for(const id of [I.survey,I.rack+'.frame',I.rack+'.finish',I.dryFirst]){p=start(p,id);p=advance(p,D.commands.find(d=>d.id===id).duration);}validateHomeFurnishings(p.state,registry);return p;}
function both(){let p=rack(),s=p.state,a=s.actors.player;
 // Supplied source-bound campaign receipts are synthetic prerequisites, never a native acquisition substitute.
 s.clock+=40;s.sequence+=40;for(const c of Object.values(s.simulation.controllers))c.due+=40;s.motherOfLearning={schema:1,definitionRevision:1,bodyPolicy:'same_native_body',sourceSnapshot:MOL_SOURCE_SNAPSHOT,sourceHash:MOL_SOURCE_HASH,activeVisitId:null};s.worlds[M.world]||={facts:{}};
 Object.assign(a.facts,{'book.mol.matureResearch':true,'book.mol.researchStanding':true,'book.mol.lampTested':true});Object.assign(s.worlds[M.world].facts,{'book.mol.arcClosed':true,'book.mol.researchDeposited':true});
 for(const [id,key,actor,offset] of [['book.mol.lamp_test','book.mol.lampTest','player',30],['book.mol.deposit_research','book.mol.researchDeposit','player',20],['book.mol.deposit_research','book.mol.receivedResearch',M.ibery,20],['book.mol.close_service_arc','book.mol.closure','player',10],['book.mol.compile_notebook','book.mol.notebook','player',0]]){
 const e=molCommands.find(d=>d.id===id).effects.find(e=>e.type==='knowledge'&&e.key===key&&e.actor===actor);assert(e);a.completed[id]=1;s.actors[actor]||={worldId:M.world,facts:{},resources:{},completed:{},sources:{},techniques:{}};s.simulation.knowledge[actor]||={};s.simulation.knowledge[actor][key]={stage:e.stage,value:e.value,basis:structuredClone(e.basis),at:s.clock-offset,cause:'simulation:'+(s.sequence-offset)};}
 for(const d of registry.simulation.people.values())if(d.worldId===M.world&&!s.simulation.people[d.id]){s.actors[d.id]||={worldId:M.world,facts:{},resources:{...d.resources},completed:{},sources:{},techniques:{}};s.simulation.people[d.id]={life:'alive',inventory:d.inventory,location:d.location,bornAt:s.clock,definitionId:d.id,definitionRevision:d.revision,...(d.vitals?{vitals:structuredClone(d.vitals)}:{}),...(d.body?{body:structuredClone(d.body)}:{})};if(d.inventory==='simulation')s.simulation.owners[d.id]={};}for(const rows of Object.values(s.simulation.knowledge))for(const r of Object.values(rows)){const id=r.basis?.situationId;if(id&&!s.simulation.situations[id])applySimulationEffects(p,[{type:'situation',operation:'begin',situationId:id}],ctx(p),registry,'fixture:context');}p.gameplay.player.inventory[K.notebook]=1;p.gameplay.player.inventory[K.sound]=2;
 for(const id of [I.bench+'.frame',I.bench+'.finish',I.adapt]){p=start(p,id);p=advance(p,D.commands.find(d=>d.id===id).duration);}p=advance(start(p,I.dry),4);validateHomeFurnishings(p.state,registry);return p;}
test('SOURCE actual rack and bench outputs allocate the same single owned slot, repeat and downstream kit conserve stock',()=>{
 let p=both();for(const id of [I.dry,I.salvage,I.pack]){const before=structuredClone(p),pending=start(p,id);assert.equal(slots(pending).length,1);assert.equal(pending.state.simulation.sites[I.site].reservations[job(pending).id],'player');assert.equal(slots(before).length,0);
 assert.throws(()=>start(pending,id));assert.equal(stock(pending,K.notebook),id===I.dry?1:0);p=advance(roundtrip(pending),D.commands.find(d=>d.id===id).duration);assert.equal(slots(p).length,0);assert.equal(stock(p,K.notebook),1);assert.equal(p.state.actors.player.completed[id],(before.state.actors.player.completed[id]||0)+1);const again=advance(roundtrip(p),1);assert.deepEqual(again.gameplay,p.gameplay);}
 assert.equal(stock(p,K.dull),1);assert.equal(stock(p,K.sharp),0);assert.equal(stock(p,K.kit),3);
});
test('SOURCE pending A excludes B by actual capacity and actor; cancel before switch refunds exactly once',()=>{
 const p=both(),pending=start(p,I.dry),before=structuredClone(pending);const quote=previewSimulationCommand(pending.state,registry,I.salvage,ctx(pending));assert(quote.reasons.some(r=>r.includes('capacity')));assert.throws(()=>start(pending,I.salvage));assert.deepEqual(pending,before);
 const cancelled=cancelSimulationJob(roundtrip(pending).state,registry,job(pending).id,ctx(pending));assert.deepEqual(cancelled.gameplay,p.gameplay);assert.equal(slots(cancelled).length,0);assert.throws(()=>cancelSimulationJob(cancelled.state,registry,job(pending).id,ctx(cancelled)));
 assert.throws(()=>start(cancelled,I.salvage,{},pending.state.sequence),/stale/);const switched=start(cancelled,I.salvage);assert.equal(slots(switched).length,1);assert.equal(stock(switched,K.notebook),0);assert.equal(stock(switched,K.green),stock(p,K.green));assert.equal(stock(switched,K.offcut),stock(p,K.offcut)-2);
});
test('SOURCE A and B refuse missing stock/location/body/rights/owner and loss at completion refunds no output',()=>{
 for(const id of [I.dry,I.salvage]){for(const mutate of [p=>p.gameplay.player.inventory={},p=>p.state.simulation.sites[I.site].owner='other',p=>delete p.state.actors.player.facts[I.prefix+'right']]){const p=both();mutate(p);const before=structuredClone(p);assert.throws(()=>start(p,id));assert.deepEqual(p,before);}
 for(const extra of [{facts:{location:'Village'}},{nativeAlive:false},{nativeBody:{...body,hands:0}}])assert.throws(()=>start(both(),id,extra));
 const p=both(),pending=start(p,id),stopped=advance(roundtrip(pending),D.commands.find(d=>d.id===id).duration,{nativeAlive:false});assert.deepEqual(stopped.gameplay,p.gameplay);assert.equal(slots(stopped).length,0);assert.equal(stopped.state.actors.player.completed[id],p.state.actors.player.completed[id]);validateHomeFurnishings(stopped.state,registry);}
});
test('SOURCE exact held notebook, re-entry pending roundtrip and second useful bench use retain single owner',()=>{
 const p=both(),pending=start(p,I.pack),j=job(pending);assert.equal(homeFurnishingFacts(pending.state,ctx(pending))['homeFurnishings.matureNotebook'],true);assert.equal(j.siteId,I.site);assert.equal(j.reservationReturns,1);assert.deepEqual(roundtrip(pending),pending);
 const forged=structuredClone(pending);forged.state.simulation.sites[I.site].reservations[j.id]='other';assert(!homeFurnishingFacts(forged.state,ctx(forged))['homeFurnishings.matureNotebook']);assert.throws(()=>validateHomeFurnishings(forged.state,registry));
 const lost=structuredClone(pending);lost.state.actors.player.facts[I.prefix+'right']=false;const stopped=advance(lost,3);assert.deepEqual(stopped.gameplay,p.gameplay);assert.equal(slots(stopped).length,0);assert.equal(stopped.state.actors.player.completed[I.pack],undefined);
});
test('SOURCE absent furnishing state stays inert; flags or notebook counts cannot grant assignment',()=>{
 const p=supplied();assert(validateHomeFurnishings(p.state,registry));assert.equal(homeFurnishingFacts(p.state,ctx(p))['homeFurnishings.rackBuilt'],false);p.gameplay.player.inventory[K.notebook]=1;assert.equal(homeFurnishingFacts(p.state,ctx(p))['homeFurnishings.matureNotebook'],false);assert.throws(()=>start(p,I.salvage));
});
