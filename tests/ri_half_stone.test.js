import test from 'node:test';
import assert from 'node:assert/strict';
import {earned,id,stone} from './helpers/ri_lead_fixture.mjs';
import {GU_HALF_STONE_PARTS as PARTS,guHalfStoneKey as key,guLeadHalfStone} from '../src/world_packs/book_gu_lead_half_stone.js';
function breakfast(modern=false){const l=earned();l.act('refinement.draw_stone');l.step(30);l.admit(2);
 for(const [n,t] of [['leave',20],['buy_wine',5],['lure',180],['follow',35],['take_worm',3],['search_crevice',12],['return_inn',45],['first_night',360]]){l.act('vital.'+n);l.step(t);}
 if(modern){l.setNativeMinute(1440+8*60);l.installBreakfast();l.admitBreakfast();l.act('breakfast.join');l.step(10);l.act('breakfast.accept');}
 else{l.act('vital.brother');l.step(15);}l.installHalfStone();return l;}
const draw=(l,n)=>{l.act('half_stone_use.draw_'+n);l.step(1);};
for(const modern of [false,true])test(`${modern?'new accepted':'legacy'} payout can be kept, interrupted and drawn without touching whole stones`,()=>{
 const l=breakfast(modern),whole=l.stock[stone],before=l.energy.reserve,pins=structuredClone(l.record.extensions);l.admitHalfStone();assert.deepEqual(l.record.extensions.slice(0,-1),pins);assert.equal(l.stock[key(PARTS)],1);
 l.act('half_stone_use.draw_15');assert.equal(l.stock[key(PARTS)],undefined);l.roundTrip();l.cancel();assert.equal(l.stock[key(PARTS)],1);assert.equal(l.energy.reserve,before);
 draw(l,15);assert.equal(l.stock[key(15)],undefined);assert.equal(l.stock[key(14)],1);assert.equal(l.energy.reserve,before+1);assert.equal(l.stock[stone],whole);l.roundTrip();
 const actions=l.view().actions.filter(a=>a.id.startsWith(id('half_stone_use.draw_')));assert.equal(actions.filter(a=>a.eligible).length,1);
 draw(l,14);assert.equal(l.stock[key(13)],1);assert.equal(l.energy.reserve,before+2);l.roundTrip();assert.equal(l.stock[stone],whole);
});
test('finite estimated carrier exhausts once and cannot mint another half stone',()=>{
 const l=breakfast();l.admitHalfStone();const before=l.energy.reserve,whole=l.stock[stone];for(let n=PARTS;n>0;n--)draw(l,n);
 assert.equal(l.energy.reserve,before+PARTS);assert.equal(l.stock[key(0)],1);for(let n=1;n<=PARTS;n++)assert.equal(l.stock[key(n)],undefined);assert.equal(l.stock[stone],whole);assert.equal(l.view().actions.some(a=>a.id.startsWith(id('half_stone_use.draw_'))&&a.eligible),false);l.roundTrip();
});
test('full reserve keeps the remainder and stale or failed work refunds the exact carrier',()=>{
 const l=breakfast();l.admitHalfStone();l.energy.reserve=43;draw(l,15);assert.equal(l.energy.reserve,44);assert.equal(l.stock[key(14)],1);assert.equal(l.quote('half_stone_use.draw_14').eligible,false);assert.match(JSON.stringify(l.quote('half_stone_use.draw_14').reasons),/room in your sea/);
 l.energy.reserve=43;l.act('half_stone_use.draw_14');l.energy.reserve=44;l.step(1);assert.equal(l.stock[key(14)],1);assert.equal(l.stock[key(13)],undefined);l.roundTrip();
});
test('installation preserves old pending work and admission requires actual custody',()=>{
 const l=earned();l.act('refinement.draw_stone');l.step(3);const old=l.roundTrip();l.installHalfStone();assert.deepEqual(l.roundTrip(),old);l.cancel();assert.throws(()=>l.admitHalfStone(),/Carry the half stone/);
 assert.equal(guLeadHalfStone.commands.every(c=>c.queueRepeatable===false),true);assert.equal(guLeadHalfStone.description.includes('reckon'),true);
});

