import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateTrancheFourEnvelope,stageTrancheFourReward,stageLeisureMemory,nativeMarketPreview} from '../src/absorb_p23/host_joins/tranche_four.js';
import {createLeisureMemory,LEISURE_PERSON} from '../src/absorb_p23/leisure_memory/index.js';
const fixture=()=>JSON.parse(readFileSync(new URL('../docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-host-joins/fixtures/tranche1-prelight.json',import.meta.url)));
test('old native envelope stays absent; optional schema rejection does not mutate it',()=>{
 const s=fixture(),before=structuredClone(s);validateTrancheFourEnvelope(s);assert.deepEqual(s,before);
 for(const key of ['field_familiarity_p07','p23_market_life','p23_leisure_memory','absorb_repeat_search']){
  const candidate={...s,[key]:{schema:99}},copy=structuredClone(candidate);assert.throws(()=>validateTrancheFourEnvelope(candidate));assert.deepEqual(candidate,copy);
 }
});
test('paid-round owner must agree with the native reservation',()=>{
 const s=fixture();s.p23_leisure_memory=createLeisureMemory(s.total_deaths);s.expansion.actors.player.facts['p23.leisure.pendingRound']='invented';assert.throws(()=>validateTrancheFourEnvelope(s),/reservation/);
});
test('field output uses the native bag without supplying passive XP or money',()=>{
 const plan={state:fixture().expansion,gameplay:{player:{inventory:{},skills:{}}}};
 stageTrancheFourReward(plan,{state:{},native:{money:0,skillXp:{},items:[{item_id:'Cooking herbs',count:1}]},messages:[]},{keyFor:id=>JSON.stringify({id})});
 assert.equal(plan.gameplay.player.inventory['{"id":"Cooking herbs"}'],1);
 assert.throws(()=>stageTrancheFourReward(plan,{native:{money:1,skillXp:{},items:[]},messages:[]},{keyFor:x=>x}),/passive/);
});
test('Eda aid transfers the actual finite donor purse to native money',()=>{
 const state=fixture().expansion;state.simulation={people:{[LEISURE_PERSON]:{}},relationships:{},causes:{}};state.actors[LEISURE_PERSON]={resources:{coins:7}};
 const plan={state,external:{money:10}};
 const result={state:createLeisureMemory(0),minutes:0,effects:[{type:'nativeMoney',amount:7},{type:'personMoney',personId:LEISURE_PERSON,amount:-7}]};
 stageLeisureMemory(plan,result,{calendar:fixture()['current time'],worldId:'base.frontier',maxStamina:10,stamina:10,lifeRecord:fixture().life_record});
 assert.equal(plan.external.money,17);assert.equal(plan.state.actors[LEISURE_PERSON].resources.coins,0);
});
test('market quote consumes native rounded subtotals and leaves coupon off by default',()=>{
 const c={worldId:'base.frontier',location:'Village',alive:true,clock:4,calendarMinute:1444,traderId:'village trader'},b={buySubtotal:101,breadSubtotal:21,buyUnits:2,useCoupon:false};
 const q=nativeMarketPreview(undefined,c,b);assert.equal(q.quote.total,101);assert.equal(q.quote.couponDiscount,0);assert.deepEqual(q.basket,b);
});
