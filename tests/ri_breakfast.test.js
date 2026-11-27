import test from 'node:test';
import assert from 'node:assert/strict';
import {earned,id,stone} from './helpers/ri_lead_fixture.mjs';
import {RI_BREAKFAST as B,RI_FANG_ZHENG as FZ,riBreakfastFacts} from '../src/ri_breakfast.js';
const half=JSON.stringify({id:id('vital.half_stone')});
function room(){const l=earned();l.act('refinement.draw_stone');l.step(30);l.admit(2);l.act('vital.leave');l.step(20);l.setNativeMinute(18*60+39);l.installBreakfast();return l;}
function morning(l){l.step(760);assert.equal(l.quote('breakfast.join').eligible,false);l.admitBreakfast();return l;}
function join(l){l.act('breakfast.join');l.step(10);}
test('paid awake night admits a morning visit, real pouch transfer and introduced person',()=>{
 const l=morning(room()),before=l.stock[stone];assert.equal(l.state.simulation.people[FZ],undefined);assert.equal(l.view().people.some(p=>p.name==='Fang Zheng'),false);
 join(l);assert.equal(l.stock[stone],before);assert.equal(l.pocket[stone],5);assert.equal(l.pocket[half],1);assert.equal(l.view().people.some(p=>p.name==='Fang Zheng'),true);
 l.roundTrip();l.act('breakfast.accept');assert.equal(l.stock[stone],before+5);assert.equal(l.stock[half],1);assert.equal(l.pocket[stone]||0,0);assert.equal(l.quote('breakfast.accept').eligible,false);l.roundTrip();assert.equal(l.quote('vital.brother').eligible,false);assert.equal(l.quote('vital.press_again').eligible,false);
});
test('refusal leaves actual custody with Fang Zheng and cannot replace missing refinement work',()=>{
 const l=morning(room()),before=l.stock[stone];join(l);l.act('breakfast.refuse');assert.equal(l.stock[stone],before);assert.equal(l.pocket[stone],5);assert.equal(l.pocket[half],1);assert.equal(l.quote('vital.brother').eligible,false);assert.equal(l.quote('vital.press_again').eligible,false);l.roundTrip();assert.equal(l.quote('breakfast.accept').eligible,false);
});
test('cancelled visit creates neither person nor money and can resume',()=>{
 const l=morning(room());l.act('breakfast.join');l.step(3);l.roundTrip();l.cancel();assert.equal(l.state.simulation.people[FZ],undefined);assert.equal(l.known[B+'.visit'],undefined);join(l);assert.equal(l.pocket[stone],5);
});
test('display calendar governs morning and absent body time is not credited',()=>{
 const l=room(),actor=l.state.actors.player,world=actor.worldId;l.setNativeMinute(19*60);actor.worldId='base.frontier';l.observe();l.setNativeMinute(1440+7*60);actor.worldId=world;l.observe();assert.equal(riBreakfastFacts(l.state,{facts:{calendarMinute:1860}})[B+'.available'],false);
 l.setNativeMinute(1440+19*60);l.observe();l.step(720);assert.equal(riBreakfastFacts(l.state,{facts:{calendarMinute:3300}})[B+'.available'],true);assert.equal(riBreakfastFacts(l.state,{facts:{calendarMinute:3540}})[B+'.available'],false);
});

test('new social resolution preserves genuine worm work and original later costs',()=>{
 const l=room();for(const [n,t] of [['buy_wine',5],['lure',180],['follow',35],['take_worm',3],['search_crevice',12],['return_inn',45],['first_night',360]]){l.act('vital.'+n);l.step(t);}
 l.setNativeMinute(1440+7*60);l.admitBreakfast();join(l);l.act('breakfast.refuse');assert.equal(l.state.actors.player.completed[id('vital.brother')],undefined);assert.equal(l.quote('vital.press_again').eligible,true);
 const before=l.stock[stone];l.act('vital.press_again');assert.equal(l.stock[stone],before-10);l.step(3);l.roundTrip();l.cancel();assert.equal(l.stock[stone],before);l.act('vital.press_again');l.step(2880);l.roundTrip();assert.equal(l.state.actors.player.completed[id('vital.press_again')],1);
});
test('legacy settled breakfast never creates a second person or purse',()=>{
 const l=room();for(const [n,t] of [['buy_wine',5],['lure',180],['follow',35],['take_worm',3],['search_crevice',12],['return_inn',45],['first_night',360],['brother',15]]){l.act('vital.'+n);l.step(t);}
 const before=l.stock[stone];l.setNativeMinute(1440+8*60);assert.throws(()=>l.admitBreakfast(),/paid night/);assert.equal(l.state.simulation.people[FZ],undefined);assert.equal(l.stock[stone],before);assert.equal(l.quote('vital.press_again').eligible,true);l.roundTrip();
});
test('pending spawn receipt cannot change the pinned person template',()=>{
 const l=morning(room());l.act('breakfast.join');l.step(2);const bad=structuredClone(l.state);bad.simulation.jobs[0].effects[0].template.label='Someone else';assert.throws(()=>l.validateState(bad),/exact pending/);l.roundTrip();
});
