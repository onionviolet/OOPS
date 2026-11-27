import test from 'node:test';
import assert from 'node:assert/strict';
import {officeFollowupFacts,officeFollowupView} from '../src/lotm_office_followup.js';
import {divinationCostText} from '../src/cast_divination_adapter.js';
const key='book.lotm.be.client.officecourier';
function state(status='paid',clock=24*60+9*60){return {clock,lotm:{initializedAt:0},actors:{player:{facts:{[key]:status,[`${key}.favor`]:1}}},
 simulation:{knowledge:{player:{[`${key}.session`]:{at:120,value:'A completed chart'}}}}};}
test('return availability reads the exact saved client and the existing relative calendar without changing state',()=>{
 const s=state(),before=JSON.stringify(s);assert.equal(officeFollowupView(s).window,true);assert.equal(JSON.stringify(s),before);
 s.actors.player.facts[`${key}.favor`]=0;s.actors.player.facts['book.lotm.be.client.anna.favor']=20;
 assert.equal(officeFollowupView(s).remembers,false);assert.equal(officeFollowupFacts(s)['lotm.be.office.followup.remembers'],false);
 assert.equal(officeFollowupView(state('paid',9*60)).afterDay,false,'later that morning is not tomorrow');
 assert.equal(officeFollowupView(state('paid',24*60+11*60)).window,false);
 assert.equal(officeFollowupView(state('paid',2*24*60+9*60)).afterDay,true);
});
test('old settled client records without a date keep the ledger route, while missing clients get no followup',()=>{
 const old=state();delete old.simulation.knowledge.player[`${key}.session`];
 const v=officeFollowupView(old);assert.equal(v.afterDay,true);assert.equal(v.window,false);assert.match(v.reason,/no visit date/);
 delete old.actors.player.facts[key];assert.equal(officeFollowupView(old),null);
});
test('host words override the generic native cost rendering while old callers keep their fallback',()=>{
 const costs=[{type:'resource',key:'money',amount:-2}];
 assert.equal(divinationCostText({}, {divination:{costText:'Two pence to the runner.'}},costs),'Two pence to the runner.');
 assert.equal(divinationCostText({}, {divination:{}},costs),'money: -2');
});
