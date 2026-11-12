import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createHpLifeContent} from '../src/book_world_hp_content.js';
import {installedWorldPack,worldPackRegistry,leadLifePackRegistry,packNative} from '../src/world_pack_registry.js';
import {createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {createDomainRegistry} from '../src/domain_registry.js';
import {resolveWorldCalendar,formatCalendar} from '../src/world_calendar.js';
import {ownHoldings} from '../src/own_holdings.js';
import {hpLeadProjection,registerHpLeadDomain} from '../src/book_world_hp_lead_domain.js';
import {hpLeadHouseholdActs,hpLeadCastTiers} from '../src/world_packs/book_hp_lead_life_data.js';
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hash=v=>'sha256:'+sha(v);
const P='book.hp.lead';
function leadSetup(){
 const raw=packNative(P),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);
 mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 const state=createExpansionState(123),context={registry,actorId:'player',worldId:'base.frontier',external:{money:42},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
 const selection=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(selection.plan.state,d,context,null,selection.selection);
 return {d,registry,state,context,selection,...begun};
}
test('the lead pack loads in its own list and does not touch book.hp or the school and trade hashes',()=>{
 assert.equal(leadLifePackRegistry.dormantPacks.size,0);
 assert.deepEqual(leadLifePackRegistry.diagnostics.filter(x=>x.severity==='error'),[]);
 assert.equal(installedWorldPack(P).id,P);
 assert.ok(!worldPackRegistry.packs.has(P),'main bundled list is unchanged');
 assert.equal(sha(createHpLifeContent('school')),'60f98887abca007da8c704d5d4ecc4dd4cfc4f3da7575c667b999737ac543017');
 assert.equal(sha(createHpLifeContent('trade')),'75d141fba477539271646133d1c1190759efcd07fb7963eb587dd8c703b0eb6b');
 // Re-pinned 2026-11-11: the potion lane added the fluxweed bed and bonemeal to book_hp_pack.js; the lead pack still does not touch book.hp.
 assert.equal(installedWorldPack('book.hp').fingerprint,'wp1:a851c410e5cdcce6');
});
test('a start produces a child body in guardian custody with no wand, money or learned method',()=>{
 const f=leadSetup(),s=f.plan.state,p=s.simulation.people.player;
 assert.equal(p.body.lifeStage,'child');assert.equal(p.location,P+'.cupboard');
 assert.equal(s.simulation.relationships[P+'.vernon']?.player?.axes[P+'.guardian_of'],1000);
 assert.equal(s.simulation.relationships[P+'.petunia']?.player?.axes[P+'.guardian_of'],1000);
 assert.deepEqual(f.plan.gameplay.player.inventory,{},'no wand and no items');
 assert.deepEqual(s.actors.player.resources??{},{},'no money of his own');
 assert.equal(f.plan.external.money,42,'no mint or conversion of native money');
 assert.equal(s.simulation.faculties.player[P+'.magic'].awakened,true);
 assert.deepEqual(s.simulation.powers.player??{},{},'faculty without a learned method');
 const known=s.simulation.knowledge.player;
 assert.ok(known[P+'.opening']&&known[P+'.custody']);
 assert.ok(!JSON.stringify(known).match(/wizard|Hogwarts|prologue|Potter/i),'chapter 1 and the wider world stay out of his knowledge');
 assert.deepEqual(hpLeadCastTiers.full.length,3);
 const old=JSON.parse(JSON.stringify(f.state));assert.deepEqual(loadExpansionState(old,f.registry),f.state);
});
test('project("hp") returns arc.next and arc.done, zero acts is a legal start, and doing the act advances it',()=>{
 const f=leadSetup(),state=()=>cur;let cur=f.plan.state;
 const reg=createDomainRegistry();registerHpLeadDomain(reg.registerDomain,state);
 const v=reg.project('hp');assert.equal(v.enrolled,true);
 assert.equal(v.arc.next.id,P+'.dress');assert.equal(v.arc.done,false);assert.equal(v.arc.total,1);
 const none=hpLeadProjection(f.plan.state,{});assert.equal(none.arc.next,null);assert.equal(none.arc.done,false);
 const ctx={...f.context,worldId:P+'.world',gameplay:f.plan.gameplay,external:f.plan.external,vitals:f.plan.vitals,structuredNative:{...f.record,bound:true},facts:{location:f.plan.state.simulation.people.player.location}};
 const started=commitSimulationCommand(f.plan.state,f.registry,{id:P+'.dress'},ctx);
 assert.equal(hpLeadProjection(started.state).jobs.length,1);
 assert.equal(createDomainRegistry().project('hp'),undefined);
});

test('the shell reads the lead life\'s own calendar (Saturday, no year) and own holdings, not the native hero\'s',()=>{
 const f=leadSetup(),s=f.plan.state,at=minutes=>resolveWorldCalendar({...s,clock:s.clock+minutes},null);
 assert.equal(formatCalendar(at(0),{time:true}),'Sat, day 1 08:00','the authored Saturday morning');
 assert.equal(formatCalendar(at(1440+30),{time:true}),'Sun, day 2 08:30');
 assert.equal(at(0).year,1,'no year is invented or shown');assert.doesNotMatch(formatCalendar(at(0)),/\d{2}\/\d{2}|Summer|Shift/);
 assert.equal(ownHoldings(P+'.world'),null,'not registered until the domain is wired with ports');
 registerHpLeadDomain(createDomainRegistry().registerDomain,()=>s,{read:()=>null,command:()=>null,state:()=>s});
 assert.match(ownHoldings(P+'.world').purse,/no money/);assert.equal(ownHoldings('base.frontier'),null,'the native Village is unchanged');
 assert.equal(ownHoldings('book.hp.school.world'),null,'the school life is unchanged');
});

test('registerBookBeginnings can run twice without a duplicate-domain crash',async()=>{
 const {registerBookBeginnings}=await import('../src/book_world_beginning_registration.js');
 const register=async p=>({id:p.id}),choices={register(){}};
 await registerBookBeginnings(register,choices);
 await registerBookBeginnings(register,choices);
});
test('a rejected lead cast warns once with its reasons and still returns null',async()=>{
 const {loadHpLeadCast}=await import('../src/book_world_hp_lead_pack.js');
 const warns=[],orig=console.warn;console.warn=(...a)=>warns.push(a.join(' '));
 try{
  const json=b=>({ok:true,json:async()=>b});
  const f=async u=>u.endsWith('manifest.json')?json({schema:1,supplements:['hp-cast/cast.json']}):json({schema:'bad'});
  assert.equal(await loadHpLeadCast(f),null);
  assert.equal(await loadHpLeadCast(async()=>{throw new Error('boom');}),null);
 }finally{console.warn=orig;}
 assert.equal(warns.length,2);assert.match(warns[0],/schema/);assert.match(warns[1],/boom/);
});

test('the bundled Charms bench leaves base identity intact and requires a separate content pin',async()=>{
 const {hpLeadPracticeExtension}=await import('../src/hp_lead_spells.js');
 const {createStructuredNativeRegistration}=await import('../src/structured_native_registration.js');
 const {requireStructuredContent}=await import('../src/structured_pack_state.js');
 const f=leadSetup(),raw=hpLeadPracticeExtension(f.d);
 const register=createStructuredNativeRegistration({
  registry:f.registry,locations:{},items:{},inventories:{},availabilities:{},definitions:new Map(),
  makeLocation:row=>row,makeItem:row=>row,makeInventory:row=>row,
 });
 await assert.rejects(register.extension(raw,f.d),/Unsupported or colliding extension command/);
 const extension=await register.bundledInstantExtension(raw,f.d);
 const definitions=new Map([[f.d.id,f.d]]);
 requireStructuredContent(f.record,definitions,f.plan.state);
 const lifted=structuredClone(f.plan.state);
 const effect=extension.commands.find(c=>c.outcomes).outcomes[0].effects.find(e=>e.type==='knowledge');
 lifted.simulation.knowledge.player[effect.key]={stage:effect.stage,value:effect.value};
 assert.throws(()=>requireStructuredContent(f.record,definitions,lifted),/saved content pin/);
 const {id,revision,contentHash}=extension;
 requireStructuredContent({...f.record,extensions:[{id,revision,contentHash}]},definitions,lifted);
});
