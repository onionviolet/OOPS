import test from 'node:test';
import assert from 'node:assert/strict';
import {freshTower,validateTower,beginTower,settleTower,planTowerInsight} from '../src/dojo_tower.js';
import {towerInsightEffect,validateTowerInsight} from '../src/dojo_insight.js';
const body={ownerId:'player',controllerId:'player',form:'human',hands:2,mobile:true};
const c={world:'reference.proto23.village',location:'Proto23 Dojo lobby',ready:true,money:100};
const here={...c,location:'Proto23 reed-circle training',body};
function earned(floors){let t=freshTower();t.fund=200;for(let floor=1;floor<=floors;floor++){t=beginTower(t,{floor,stake:0,money:100,attempt:floor}).state;t=settleTower(t,{attempt:floor,outcome:'won'}).state;}return t;}
test('actual won floors qualify a finite paid lesson; quotes preserve earlier tower state',()=>{
 const t=earned(1),before=JSON.stringify(t);assert.equal(t.insight,undefined);const q=planTowerInsight(t,{...c,action:'learn',id:'timing'});assert.equal(q.cost,5);assert.equal(q.minutes,5);assert.equal(q.state.fund,t.fund+5);assert.deepEqual(q.state.insight,{learned:['timing'],active:'timing'});assert.equal(JSON.stringify(t),before);assert.deepEqual(towerInsightEffect(q.state,here),{attack_points:1.02});validateTower(JSON.parse(JSON.stringify(q.state)));
 assert.throws(()=>planTowerInsight(t,{...c,action:'learn',id:'economy'}),/floor 6/);assert.throws(()=>planTowerInsight(t,{...c,money:4,action:'learn',id:'timing'}),/five-coin/);assert.throws(()=>planTowerInsight(freshTower(),{...c,action:'learn',id:'timing'}),/floor 1/);assert.throws(()=>planTowerInsight(q.state,{...c,action:'learn',id:'timing'}),/already/);
});
test('one earned lesson supplies the actual scoped stat, rather than stacking every learned option',()=>{
 let t=earned(6);for(const id of ['timing','footing','economy'])t=planTowerInsight(t,{...c,action:'learn',id}).state;
 assert.deepEqual(towerInsightEffect(t,here),{stamina_efficiency:1.12});t=planTowerInsight(t,{...c,action:'choose',id:'footing'}).state;assert.deepEqual(towerInsightEffect(t,here),{agility:1.12});t=planTowerInsight(t,{...c,action:'off'}).state;assert.deepEqual(towerInsightEffect(t,here),{});
 for(const changed of [{world:'base.frontier'},{location:'Proto23 Dojo lobby'},{body:{...body,ownerId:'other'}},{body:{...body,controllerId:'other'}},{body:{...body,hands:0}},{body:{...body,mobile:false}}]){const trained=planTowerInsight(t,{...c,action:'choose',id:'timing'}).state;assert.deepEqual(towerInsightEffect(trained,{...here,...changed}),{});}
 const bad=earned(1);bad.insight={learned:['economy'],active:'economy'};assert.throws(()=>validateTower(bad),/earned floor/);assert.throws(()=>validateTowerInsight({learned:['timing','timing'],active:'timing'}),/insight/);
});
import {configureDojoTower} from '../src/dojo_tower_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
test('failed native publication preserves purse, fund, lesson and real stat owner; refresh never fills vitals',()=>{
 let state={clock:10,dojoTower:earned(1),actors:{player:{worldId:c.world}}},where=c.location,reject=true;const full={health:7,stamina:3,max_health:20,max_stamina:12,attack_points:100},stats={multiplier:{}},actor={money:100,getLevelableComponent:()=>({stats}),getFullStats:()=>full,updateStatsAndDisplay:()=>{full.attack_points=100*(stats.multiplier.dojo_insight?.attack_points||1);full.health=20;full.stamina=12;}};
 configureDojoTower({root:()=>state,actor:()=>actor,world:()=>c.world,location:()=>where,body:()=>body,idle:()=>true,tradeWritable:()=>true,worldWorkBlocked:()=>false,continuation:()=>null,plan:minutes=>({state:{...structuredClone(state),clock:state.clock+minutes},external:{money:actor.money}}),commit:plan=>{if(reject)throw Error('quota');state=plan.state;actor.money=plan.external.money;}});
 const d=domainRegistry.list().find(d=>d.id==='dojoTower'),act=domainRegistry.command('dojoTower','act');d.refresh();const before=structuredClone({state,money:actor.money,full});assert.throws(()=>act('tower:insight:learn:timing'),/quota/);assert.deepEqual({state,money:actor.money,full},before);
 reject=false;act('tower:insight:learn:timing');assert.equal(state.clock,15);assert.equal(actor.money,95);assert.equal(state.dojoTower.fund,before.state.dojoTower.fund+5);assert.equal(full.attack_points,100);where=here.location;d.refresh();assert.equal(full.attack_points,102);assert.equal(full.health,7);assert.equal(full.stamina,3);where=c.location;d.refresh();assert.equal(full.attack_points,100);assert.equal(full.health,7);assert.equal(full.stamina,3);
});
