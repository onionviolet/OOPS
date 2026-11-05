import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {conversationKnowledgeFixture} from './helpers/conversation_knowledge_fixture.mjs';
import {annaSessionFixture,ANNA_ENTRY,ANNA_ROUTE} from './helpers/anna_session_fixture.mjs';
import {applyAnnaSessionContract} from '../scripts/lead_run/anna_session_contract.mjs';
import {ANNA_ID,ANNA_DETAILS_KEY,ANNA_ADVICE_KEY,ANNA_MEMORY_KEY,ANNA_DETAILS_ID,lotmDivinationItems} from '../src/lotm_anna_session_items.js';
import {beDivMethodFacts,beDivMethodKey} from '../src/book_world_lotm_divination_method.js';
import {BE_SEER_SOURCE} from '../src/book_world_lotm_be_seer.js';
import {restoreOptionalItems} from '../src/optional_item_catalogue.js';
const sourcePath=new URL('../private_packs/lotm-cast/cast.json',import.meta.url);
const source=existsSync(sourcePath)?JSON.parse(readFileSync(sourcePath,'utf8')):null;
const pack=source?annaSessionFixture(source):conversationKnowledgeFixture();
const canonicalTest=(name,fn)=>test(name,{skip:source?false:'Requires the local canonical pack; public method/catalogue checks still run.'},fn);
const actualFetch=globalThis.fetch;globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(pack)});
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');await whenCastLoaded();
const {bare,hostOver,registry,ctx,wait}=await import('./lotm_helpers.js');
const {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob}=await import('../src/simulation.js');
const {loadExpansionState}=await import('../src/expansion_engine.js');
await import('../src/book_world_lotm_domain.js');
globalThis.fetch=actualFetch;
function setup(){const o=hostOver(bare());o.host.enroll('be',{independent:true});return structuredClone(o.box.p);}
const command=(p,k)=>registry.simulation.commands.get(k===ANNA_ENTRY?k:'book.lotm.kj3aa.'+k);
const quote=(p,k)=>previewSimulationCommand(p.state,registry,command(p,k).id,ctx(p,command(p,k).targetId));
function start(p,k){const d=command(p,k);return {...p,...commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,d.targetId))};}
function doAct(p,k){const d=command(p,k);return wait(start(p,k),d.duration);}
function through(k){let p=doAct(setup(),ANNA_ENTRY);for(const key of ANNA_ROUTE){p=doAct(p,key);if(key===k)break;}return p;}
canonicalTest('observing a method name is not competence; study survives suppression while current execution does not',()=>{
 let p=doAct(setup(),ANNA_ENTRY);const f=()=>beDivMethodFacts(p.state,{}, {enrolled:true});
 assert.equal(f()['actor.lotm.div.method.astrolabe.learned'],false);assert.equal(quote(p,'method').eligible,false);
 p=doAct(p,'study');assert.equal(f()['actor.lotm.div.method.astrolabe.real'],true);assert.equal(quote(p,'method').eligible,true);
 p.state.simulation.faculties.player[BE_SEER_SOURCE].suppressed=true;
 assert.equal(f()['actor.lotm.div.method.astrolabe.learned'],true);assert.equal(f()['actor.lotm.div.method.astrolabe.real'],false);assert.equal(quote(p,'method').eligible,false);
 assert.equal(p.state.simulation.knowledge.player[beDivMethodKey('astrolabe')].stage,'understood');
 p.state.simulation.faculties.player[BE_SEER_SOURCE].suppressed=false;assert.equal(quote(p,'method').eligible,true);
});
canonicalTest('actual paper gates memorization, unrelated stock cannot substitute, remembered details survive its departure',()=>{
 let p=through('astrolabe');assert.equal(p.gameplay.player.inventory[ANNA_DETAILS_KEY],1);
 delete p.gameplay.player.inventory[ANNA_DETAILS_KEY];p.gameplay.player.inventory[JSON.stringify({id:'Rough wood log'})]=1;assert.equal(quote(p,'hermes').eligible,false);
 p.gameplay.player.inventory[ANNA_DETAILS_KEY]=1;p=doAct(p,'hermes');assert.equal(p.gameplay.player.inventory[ANNA_DETAILS_KEY],1);
 delete p.gameplay.player.inventory[ANNA_DETAILS_KEY];assert.equal(p.state.simulation.knowledge.player[ANNA_MEMORY_KEY].stage,'understood');assert.equal(quote(p,'cogitate').eligible,true);
});
canonicalTest('recipient gets disclosed advice at completion, cancellation teaches nothing and payment stays separate',()=>{
 let p=through('omens');const before=p.external.money;p=start(p,'reveal');assert.equal(p.state.simulation.knowledge[ANNA_ID]?.[ANNA_ADVICE_KEY],undefined);
 const saved=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);assert.equal(saved.simulation.jobs.length,p.state.simulation.jobs.length);
 let cancelled={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p))};assert.equal(cancelled.state.simulation.knowledge[ANNA_ID]?.[ANNA_ADVICE_KEY],undefined);assert.equal(quote(cancelled,'paid').eligible,false);
 cancelled=doAct(cancelled,'reveal');assert.ok(cancelled.state.simulation.knowledge[ANNA_ID][ANNA_ADVICE_KEY]);assert.equal(cancelled.external.money,before);
 assert.equal(cancelled.state.simulation.knowledge[ANNA_ID]['book.lotm.kj3aa.dream.signs'],undefined);
 cancelled=doAct(cancelled,'paid');assert.equal(cancelled.external.money,before+12);assert.equal(quote(cancelled,'paid').eligible,false);
});
test('authoring contract is idempotent and preserves all unrelated rows and editorial strings',()=>{
 const input=source?.householdActs.acts||ANNA_ROUTE.map(id=>({id:'book.lotm.kj3aa.'+id,place:'fixture.place.session',requires:{all:[]},effects:[],locator:'synthetic contract',report:'Fixture result.',description:'Fixture operation.'}));
 const a=applyAnnaSessionContract(input),b=applyAnnaSessionContract(a);assert.deepEqual(b,a);
 assert.deepEqual(applyAnnaSessionContract([{id:'unrelated',description:'Keep this prose.'}]),[{id:'unrelated',description:'Keep this prose.'}]);
 for(const id of ANNA_ROUTE){const r=a.find(r=>r.id==='book.lotm.kj3aa.'+id);assert.ok(r.locator&&r.report&&r.description);}
});

test('optional document metadata restores before flags without minting an item or enriching absent saves',()=>{
 const availability={},component={fixture:true};let reads=0;
 const template={_getBasicAvailabilityComponent:()=>{reads++;return component;}};
 const absent={inventories:{person:{main_character:{}}}},before=structuredClone(absent);
 restoreOptionalItems(absent,lotmDivinationItems,{templates:{[ANNA_DETAILS_ID]:template},availability});assert.deepEqual(availability,{});assert.deepEqual(absent,before);assert.equal(reads,0);
 const saved={availabilities:{item:{[ANNA_DETAILS_ID]:{is_unlocked:true}}},inventories:{person:{main_character:{[ANNA_DETAILS_KEY]:{count:1}}}}},bytes=JSON.stringify(saved);
 restoreOptionalItems(saved,lotmDivinationItems,{templates:{[ANNA_DETAILS_ID]:template},availability});assert.equal(availability[ANNA_DETAILS_ID],component);assert.equal(JSON.stringify(saved),bytes);
 restoreOptionalItems(saved,lotmDivinationItems,{templates:{[ANNA_DETAILS_ID]:template},availability});assert.equal(reads,1,'idempotent catalog restoration');
});
canonicalTest('understood method is readiness, while interrupted execution awards no performed result',()=>{
 let p=through('details');p=start(p,'astrolabe');
 assert.equal(p.state.actors.player.completed['book.lotm.kj3aa.astrolabe'],undefined);
 assert.equal(p.state.simulation.knowledge.player['book.lotm.kj3aa.astrolabe.result'],undefined);
 p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p))};
 assert.equal(p.state.simulation.knowledge.player[beDivMethodKey('astrolabe')].stage,'understood');
 assert.equal(p.state.actors.player.completed['book.lotm.kj3aa.astrolabe'],undefined);
 p=doAct(p,'astrolabe');assert.equal(p.state.actors.player.completed['book.lotm.kj3aa.astrolabe'],1);assert.ok(p.state.simulation.knowledge.player['book.lotm.kj3aa.astrolabe.result']);
});

// Public regression: this state invariant does not depend on a local source pack.
test('method readiness requires understood knowledge and an enrolled life',()=>{
 const state=bare().state,key=beDivMethodKey('astrolabe'),fact='actor.lotm.div.method.astrolabe.learned';
 state.simulation.knowledge.player||={};
 for(const [stage,learned] of [['seen',false],['interpreted',false],['understood',true]]){
  state.simulation.knowledge.player[key]={stage,value:'Synthetic lesson',at:0};
  assert.equal(beDivMethodFacts(state,{}, {enrolled:true})[fact],learned);
  assert.equal(beDivMethodFacts(state,{}, {enrolled:false})[fact],false);
 }
});
