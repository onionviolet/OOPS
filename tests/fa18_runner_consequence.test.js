import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeLocalLife,localLifeAction,localLifeView,advanceLocalLife} from '../src/absorb_c2/local_life.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
const c={worldId:'base.frontier',location:'Village',alive:true,idle:true,clock:15,calendarMinute:735,money:10,perception:0};
const contact=()=>({...normalizeLocalLife(),encounter:'runner',hubDay:0});
const paid=()=>localLifeAction(contact(),c,'help');
test('FA18 new paid cause and finite later coin/bread conservation',()=>{
 const p=paid();assert.equal(p.native.money,-5);assert.equal(p.native.skillXp.Perception,2);assert.equal(p.state.runnerMealsIssued,1);
 const use=localLifeAction(p.state,{...c,money:5},'runner_meal');assert.equal(use.native.money,-1);assert.deepEqual(use.native.items,[{item_id:'Stale bread',count:1}]);assert.equal(use.state.runnerMealsUsed,1);
 assert.equal(localLifeAction(use.state,c,'runner_meal').ok,false);assert.equal(localLifeAction(p.state,c,'help').ok,false);
});
test('FA18 refusal and insufficient funds never issue or settle',()=>{
 for(const p of [localLifeAction(contact(),c,'decline'),localLifeAction(contact(),{...c,money:4},'help')])assert.equal(p.state.runnerMealsIssued,0);
 const s=paid().state;for(const money of [0,NaN,-1])assert.equal(localLifeAction(s,{...c,money},'runner_meal').ok,false);
 assert.equal(s.runnerMealsUsed,0);
});
test('FA18 actual current body/world/location/work requirements retain means',()=>{
 const s=paid().state;for(const change of [{alive:false},{worldId:'other'},{idle:false},{location:'Shack'},{clock:NaN}]){
 const p=localLifeAction(s,{...c,...change},'runner_meal');assert.equal(p.ok,false);assert.deepEqual(p.native.items,[]);assert.equal(p.state.runnerMealsUsed,0);
 }
 assert.equal(localLifeAction(s,c,'runner_meal').ok,true);
});
test('FA18 old help history never retroactively mints meal stock',()=>{
 for(const schema of [undefined,1]){const s=normalizeLocalLife({schema,helped:40,encounter:'runner'});assert.equal(s.helped,40);assert.equal(s.runnerMealsIssued,0);assert.equal(localLifeAction(s,c,'runner_meal').ok,false);assert.equal(localLifeAction(s,c,'help').state.runnerMealsIssued,1);}
 assert.equal(normalizeLocalLife().runnerMealsUsed,0);
});
test('FA18 persisted account invariants fail closed',()=>{
 for(const change of [{runnerMealsUsed:2},{runnerMealsIssued:2},{runnerMealsIssued:-1},{runnerMealsUsed:undefined}])assert.throws(()=>normalizeLocalLife({...paid().state,...change}),/runner meal/);
 assert.throws(()=>normalizeLocalLife({...paid().state,schema:4}),/Unsupported/);
});
test('FA18 load/view/re-entry/ticks neither refill nor replay paid result',()=>{
 const s=paid().state;s.lastClock=15;const before=structuredClone(s);
 for(let i=0;i<3;i++){localLifeView(s,c);const p=advanceLocalLife(s,c,()=>{throw Error('no roll');});assert.deepEqual(p.native.items,[]);assert.equal(p.native.money,0);assert.equal(p.state.runnerMealsIssued,1);}
 assert.deepEqual(s,before);const used=localLifeAction(s,c,'runner_meal').state;
 assert.equal(localLifeAction(normalizeLocalLife(JSON.parse(JSON.stringify(used))),c,'runner_meal').ok,false);
 assert.match(localLifeView(s,c).rows.find(r=>r.id==='runner_meal').label,/1 coin.*1 Stale bread/);
});
test('FA18 failing real publisher retains ticket, money and bread then successful envelope joins all',()=>{
 const prior=paid().state,p=localLifeAction(prior,c,'runner_meal'),key=JSON.stringify({id:'Stale bread'});
 const plan={state:createExpansionState(3),external:{money:9},nativePatch:{absorb_local_life:p.state},gameplay:{player:{inventory:{[key]:1},skills:{},reputation:{}}}};
 let disk=JSON.stringify({character:{money:10},inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}},absorb_local_life:prior});
 const original=disk,opts={createSave:()=>disk,key:'source',bindings:{player:{category:'person',id:'main_character'}}};
 assert.throws(()=>persistExpansionPlan(plan,{...opts,storage:{setItem(){throw Error('quota');}}}),/quota/);assert.equal(disk,original);assert.equal(prior.runnerMealsUsed,0);
 persistExpansionPlan(plan,{...opts,storage:{setItem(_k,v){disk=v;}}});const saved=JSON.parse(disk);assert.equal(saved.character.money,9);assert.equal(saved.absorb_local_life.runnerMealsUsed,1);assert.equal(saved.inventories.person.main_character[key].count,1);
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');assert.ok(main.indexOf('persistExpansionPlan(plan,')<main.indexOf('if(plan.localLifeResult){localLife='));assert.match(main,/act:id=>dispatchLocalLifePlan\(localLifeAction\(localLife,localLifeContext\(\),id\)\)/);
});
