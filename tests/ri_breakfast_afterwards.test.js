import test from 'node:test';
import assert from 'node:assert/strict';
import {earned,id,stone} from './helpers/ri_lead_fixture.mjs';
import {RI_BREAKFAST as B,RI_FANG_ZHENG as FZ} from '../src/ri_breakfast.js';
import {guLeadBreakfastAfterwards as raw,RI_BREAKFAST_AFTERWARDS as E} from '../src/world_packs/book_gu_lead_breakfast_afterwards.js';
const HALF=JSON.stringify({id:id('vital.half_stone')}),HOME=id('home'),W=E+'.worker',AWAY=E+'.out_of_sight';
function offered(){const l=earned();l.act('refinement.draw_stone');l.step(30);l.admit(2);l.act('vital.leave');l.step(20);l.setNativeMinute(18*60+39);l.installBreakfast();l.step(760);l.admitBreakfast();l.act('breakfast.join');l.step(10);return l;}
function settled(choice='accept'){const l=offered();l.act('breakfast.'+choice);l.installBreakfastAfterwards();l.admitBreakfastAfterwards();return l;}
const meal=l=>l.state.actors.player.facts[E+'.meal'];
test('settled old breakfast leaves the table physically once without moving player or replaying payout',()=>{
 const l=settled(),before=structuredClone(l.stock),body=structuredClone(l.state.simulation.people.player.body),pins=structuredClone(l.record.extensions);
 assert.equal(l.state.simulation.people[FZ].location,HOME);l.roundTrip();l.act('breakfast_afterwards.leave_table');
 assert.equal(l.state.simulation.people[FZ].location,AWAY);assert.equal(l.state.simulation.people.player.location,HOME);
 assert.equal(l.state.simulation.people[W].location,HOME);assert.equal(meal(l),'cold');assert.deepEqual(l.stock,before);
 assert.notEqual(l.view().people.find(p=>p.name==='Fang Zheng').location,HOME);assert.equal(l.view().people.some(p=>p.name==='Inn worker'),true);
 assert.deepEqual(l.state.simulation.people.player.body,body);l.roundTrip();assert.deepEqual(l.record.extensions,pins);
 assert.equal(l.quote('breakfast_afterwards.leave_table').eligible,false);assert.equal(l.quote('breakfast.accept').eligible,false);
 assert.match(l.known[E+'.departure'].value,/do not know where/);
});
test('warming and finishing pays elapsed time without currency or nutrition reward; pending can cancel and restore',()=>{
 const l=settled();l.act('breakfast_afterwards.leave_table');const stock=structuredClone(l.stock),vitals=structuredClone(l.state.simulation.people.player.vitals),clock=l.state.clock;
 l.act('breakfast_afterwards.warm');l.step(2);l.roundTrip();assert.equal(meal(l),'cold');l.cancel();assert.equal(meal(l),'cold');
 l.act('breakfast_afterwards.warm');l.step(5);assert.equal(l.state.clock,clock+7);assert.equal(meal(l),'finished_after_warming');
 assert.deepEqual(l.stock,stock);assert.deepEqual(l.state.simulation.people.player.vitals,vitals);l.roundTrip();
 assert.equal(l.quote('breakfast_afterwards.skip').eligible,false);assert.equal(l.quote('vital.buy_wine').eligible,true);
});
test('refusal carries the same pouch out of sight, skipping remains a real unfinished meal',()=>{
 const l=settled('refuse'),stock=structuredClone(l.stock),pouch=structuredClone(l.pocket),clock=l.state.clock;
 assert.equal(pouch[stone],5);assert.equal(pouch[HALF],1);l.act('breakfast_afterwards.leave_table');l.act('breakfast_afterwards.skip');l.roundTrip();
 assert.equal(meal(l),'skipped_cold');assert.equal(l.state.clock,clock);assert.deepEqual(l.stock,stock);assert.deepEqual(l.pocket,pouch);
 assert.equal(l.state.simulation.people[FZ].location,AWAY);assert.equal(l.quote('vital.buy_wine').eligible,true);
 assert.equal(l.quote('vital.press_again').eligible,false);assert.equal(l.quote('breakfast_afterwards.warm').eligible,false);
 assert.equal(Object.keys(l.known).some(k=>/guardian.*discussion|private_discussion/.test(k)),false);
});
test('unresolved offer and legacy one-time payout do not admit or provision the new aftermath',()=>{
 const l=offered();l.installBreakfastAfterwards();assert.throws(()=>l.admitBreakfastAfterwards(),/pouch/);assert.equal(l.state.simulation.people[W],undefined);
 // A pre-new-breakfast payout has no new visit or accept/refuse receipt.
 const legacy=earned();legacy.act('refinement.draw_stone');legacy.step(30);legacy.admit(2);legacy.installBreakfast();legacy.installBreakfastAfterwards();
 assert.throws(()=>legacy.admitBreakfastAfterwards(),/pouch/);assert.equal(legacy.state.simulation.people[FZ],undefined);
});
test('dependency departure rejects unrelated roles, cross-world roles, remote targeting and arbitrary destinations',()=>{
 for(const mutate of [r=>{r.dependsOn=[];},r=>{r.commands[0].coLocated=false;},r=>{r.commands[0].effects[0].actor='book.unrelated.person';},r=>{r.commands[0].effects[0].location=HOME;},r=>{r.commands[0].targetId=id('elder');r.commands[0].effects[0].actor=id('elder');},r=>{r.roles[0].worldId='another.world';}]){
  const l=offered(),bad=structuredClone(raw);mutate(bad);assert.throws(()=>l.installBreakfastAfterwards(bad),/dependencies|Command-only|Optional people/);
 }
 const l=settled();l.state.simulation.people[FZ].location=id('academy');assert.equal(l.quote('breakfast_afterwards.leave_table').eligible,false);
});
