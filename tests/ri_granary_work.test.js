import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createContentRegistry,createExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,advanceSimulationBoundary,cancelSimulationJob} from '../src/simulation.js';
import {applyEnergyEffect} from '../src/energy_resources.js';
import {jsonData,validateSimulationState} from '../src/simulation_contracts.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {guLeadLife} from '../src/world_packs/book_gu_lead_life.js';
import {guLeadDorm} from '../src/world_packs/book_gu_lead_dorm.js';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadGranaryWork as raw} from '../src/world_packs/book_gu_lead_granary_work.js';
import {RI_DAY_ITEMS as IT,RI_LEAD_DAY as DAY,RI_ACADEMY_ELDER as ELDER,riLeadDayFacts} from '../src/ri_lead_day_facts.js';
import {RI_GRANARY as ID,RI_EAR_GRASS,RI_EAR_ATTACHMENT,RI_GRANARY_FOUND,RI_GRANARY_PATCHED,RI_GRANARY_PAID,RI_GRANARY_ESSENCE,riGranaryWorking} from '../src/ri_granary_work.js';
const world='book.ri.lead.world',academy='book.ri.lead.academy',sea='book.ri.lead.primeval',key=id=>JSON.stringify({id});
function setup({parts=3,attached=true,held=true}={}){
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'},{id:world,label:'Qing Mao'}],simulation:{commands:[...raw.commands,guLeadDay.commands.find(d=>d.id===`${DAY}.feed_moonglow`)],
  energies:[{revision:1,...guLeadLife.simulation.energies[0]}],people:[{id:ELDER,revision:1,label:'Academy elder',worldId:world,inventory:'simulation',location:academy}]}});
 const state=createExpansionState(1);state.actors.player.worldId=world;
 if(attached)state.actors.player.facts[RI_EAR_ATTACHMENT]='right_ear_adapted';
 state.actors[ELDER]={worldId:world,facts:{},resources:{},completed:{},sources:{},techniques:{}};
 state.worlds[world]={facts:{},resources:{},completed:{}};
 const context={actorId:'player',nativeAlive:true,facts:{location:academy,'native.ready':true,'native.alive':true,'body.ownerId':'player','body.controllerId':'player','body.mobile':true,
  ...Object.fromEntries([ID,DAY].map(id=>[`structured.extension.${id}.admitted`,true]))},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},gameplay:{player:{inventory:{[key(IT.pelt)]:1,[key(IT.moonglow)]:1,...(held?{[key(RI_EAR_GRASS)]:1}:{})},skills:{},reputation:{}}}};
 let live=enrollSimulation(state,registry,context);
 applyEnergyEffect(live.state,'player',{energyId:sea,operation:'learn'},registry.simulation);
 applyEnergyEffect(live.state,'player',{energyId:sea,operation:'recover',amount:parts},registry.simulation);
 const current=()=>({...context,...live,targetId:ELDER,facts:{...context.facts,...riLeadDayFacts(live.state)}});
 const preview=op=>previewSimulationCommand(live.state,registry,op.includes('.')?op:`${ID}.${op}`,current());
 const act=op=>{const id=op.includes('.')?op:`${ID}.${op}`,q=preview(id);assert.equal(q.eligible,true,JSON.stringify(q.reasons));live=commitSimulationCommand(live.state,registry,{id},current());};
 return {get live(){return live;},registry,current,preview,act,
  finish(){live.state.clock=live.state.simulation.jobs[0].due;advanceSimulationBoundary(live,registry,{player:current()});},
  cancel(){live=cancelSimulationJob(live.state,registry,live.state.simulation.jobs[0].id,current());},
  restore(){live=JSON.parse(JSON.stringify(live));validateSimulationState(live.state.simulation,live.state,registry.simulation);},
  count:id=>live.gameplay.player.inventory[key(id)]||0,parts:()=>live.state.simulation.energies.player[sea].reserve};
}
test('grounded catalogue hearing funds the same repair as physical inspection, then food feeds a held Gu',()=>{
 const working=riGranaryWorking();assert.equal(working.cost,RI_GRANARY_ESSENCE);assert.ok(working.effects.some(e=>e.kind==='ground-hearing'&&e.range>=8));
 const clocks=[];
 for(const method of ['listen','search']){
  const f=setup({parts:method==='search'?0:3}),before=JSON.stringify(f.live);
  assert.equal(f.preview(method).eligible,true);assert.equal(JSON.stringify(f.live),before,'quote does not mutate');
  f.act(method);assert.equal(f.parts(),method==='listen'?2:0);assert.equal(f.live.state.simulation.knowledge.player?.[RI_GRANARY_FOUND],undefined);
  f.restore();f.finish();assert.equal(f.preview('patch').eligible,true);assert.equal(f.preview('listen').eligible,false);
  f.act('patch');assert.equal(f.count(IT.pelt),0);assert.equal(f.count(IT.petals),0);f.restore();f.finish();
  assert.ok(f.live.state.simulation.knowledge.player[RI_GRANARY_PATCHED]);f.act('collect');
  assert.equal(f.count(IT.petals),20);assert.ok(f.live.state.simulation.knowledge[ELDER][RI_GRANARY_PAID]);
  assert.equal(f.preview('collect').eligible,false);assert.throws(()=>f.act('collect'));f.restore();
  f.act(`${DAY}.feed_moonglow`);assert.equal(f.count(IT.petals),18);assert.equal(f.preview(`${DAY}.feed_moonglow`).eligible,false);
  clocks.push(f.live.state.clock);
  const at=f.live.state.simulation.knowledge.player[RI_GRANARY_PAID].at;f.live.state.clock=at+1439;assert.equal(f.preview('search').eligible,false);
  f.live.state.clock++;assert.equal(f.preview('search').eligible,true);
 }
 assert.deepEqual(clocks,[25,65]);
});
test('real means and ongoing support matter; interrupted hearing spends essence without producing evidence',()=>{
 assert.equal(setup({attached:false}).preview('listen').eligible,false);
 assert.equal(setup({held:false}).preview('listen').eligible,false);
 const empty=setup({parts:0});assert.equal(empty.preview('listen').eligible,false);assert.equal(empty.preview('search').eligible,true);
 const cancel=setup();cancel.act('listen');cancel.cancel();assert.equal(cancel.parts(),2);assert.equal(cancel.live.state.simulation.knowledge.player?.[RI_GRANARY_FOUND],undefined);
 const lost=setup();lost.act('listen');delete lost.live.gameplay.player.inventory[key(RI_EAR_GRASS)];lost.finish();
 assert.equal(lost.parts(),2);assert.equal(lost.live.state.simulation.knowledge.player?.[RI_GRANARY_FOUND],undefined);
 const f=setup();f.act('search');f.finish();f.act('patch');f.cancel();assert.equal(f.count(IT.pelt),1);assert.equal(f.count(IT.petals),0);
 f.act('patch');f.finish();f.live.state.simulation.people[ELDER].location='book.ri.lead.spring';assert.equal(f.preview('collect').eligible,false);
 f.live.state.simulation.people[ELDER].location=academy;f.act('collect');assert.equal(f.count(IT.petals),20);
});
test('the optional extension is admitted against the unchanged existing day, without new runtime owners',()=>{
 const hash=raw=>'sha256:'+createHash('sha256').update(JSON.stringify(raw)).digest('hex');
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});const compiled=compileStructuredPack(guLeadLife,registry);mergeStructuredPack(compiled,registry);
 const base={...compiled.definition,contentHash:hash(guLeadLife),extensions:[guLeadDorm,guLeadDay]};
 assert.doesNotThrow(()=>jsonData(raw));registerStructuredCommandExtension(raw,hash(raw),base,registry,undefined,{bundledInstant:true});
 assert.equal(raw.items,undefined);assert.equal(raw.people,undefined);assert.ok(registry.simulation.commands.has(`${ID}.collect`));
 assert.equal(hash(guLeadDay),'sha256:2e57df6181879c0e92a4f76b5dc37267e28f329811dbbca170839db9ca8cadf6');
});
test('spent attempts remain curated player commands with unchanged effect/source restrictions',()=>{
 const hash=raw=>'sha256:'+createHash('sha256').update(JSON.stringify(raw)).digest('hex');
 function install(change=()=>{},bundledInstant=true){
  const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});const compiled=compileStructuredPack(guLeadLife,registry);mergeStructuredPack(compiled,registry);
  const base={...compiled.definition,contentHash:hash(guLeadLife),extensions:[guLeadDorm,guLeadDay]};
  const variant=structuredClone(raw);variant.commands=[variant.commands[0]];variant.status=undefined;delete variant.status;change(variant.commands[0]);
  return registerStructuredCommandExtension(variant,hash(variant),base,registry,undefined,{bundledInstant});
 }
 assert.ok(install());
 assert.throws(()=>install(()=>{},false),/Unsupported or colliding/);
 assert.throws(()=>install(c=>c.actorId=ELDER),/Unsupported or colliding/);
 assert.throws(()=>install(c=>c.reservationReturns=1),/Unsupported or colliding/);
 assert.throws(()=>install(c=>c.outcomes=[]),/Unsupported or colliding/);
 assert.throws(()=>install(c=>c.costs[0].energyId='foreign.pool'),/cannot provision/);
 assert.throws(()=>install(c=>c.effects.push({type:'fact',scope:'actor',actor:'player',key:'foreign.owner',value:true})),/cannot provision/);
});
