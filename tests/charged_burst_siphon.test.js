import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';
const strip=mode=>P.carveCharged(P.fresh(),['ember','gale'],mode,30,'body-A');
test('burst spends the remaining physical strip once for combined ordinary attack power',()=>{
 const s=strip('burst'),t=s.charged;const r=P.useCharged(s,{direction:'outgoing',binding:'body-A'});assert.equal(r.multiplier,1+t.power*t.charges/100);assert.equal(r.state.charged.charges,0);assert.equal(r.state.charged.uses,t.maxCharges);assert.equal(s.charged.charges,t.maxCharges);assert.equal(P.useCharged(r.state,{direction:'outgoing',binding:'body-A'}).multiplier,1);
 for(const args of [{direction:'incoming',binding:'body-A'},{direction:'outgoing',binding:'body-B'}])assert.equal(P.useCharged(s,args).state,s);
 const partial={...s,charged:{...t,charges:t.maxCharges-1,uses:1}};P.validate(partial);const last=P.useCharged(partial,{direction:'outgoing',binding:'body-A'});assert.equal(last.multiplier,1+t.power*(t.maxCharges-1)/100);P.validate(last.state);assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(last.state))),last.state);
});
test('siphon waits for actual target loss and clamps actual recovery before spending',()=>{
 const s=strip('siphon'),args={direction:'outgoing',binding:'body-A',health:10,maxHealth:20};
 for(const damage of [undefined,0,-1,NaN,Infinity])assert.equal(P.useCharged(s,{...args,damage}).state,s);
 const r=P.useCharged(s,{...args,damage:4});assert.equal(r.multiplier,1);assert.equal(r.heal,4*Math.min(.5,s.charged.power/100));assert.equal(r.state.charged.charges,s.charged.charges-1);assert.equal(r.state.charged.uses,1);
 const clamp=P.useCharged(s,{...args,health:19.99,damage:1000});assert.equal(clamp.heal,20-19.99);assert.equal(P.useCharged(s,{...args,health:20,damage:4}).state,s);assert.equal(P.useCharged(s,{...args,binding:'body-B',damage:4}).state,s);assert.equal(P.useCharged(s,{...args,direction:'incoming',damage:4}).state,s);assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(r.state))),r.state);
});
test('older attack, guard and mend laws remain exactly single-charge and independently clamped',()=>{
 const args={direction:'outgoing',binding:'body-A',health:19,maxHealth:20};for(const mode of ['attack','guard','mend']){
  const s=strip(mode),r=P.useCharged(s,{...args,direction:mode==='guard'?'incoming':'outgoing'});assert.equal(r.state.charged.uses,1);assert.equal(r.state.charged.charges,s.charged.charges-1);assert.equal(r.heal,mode==='mend'?Math.min(1,s.charged.power/2):0);assert.equal(r.multiplier,mode==='attack'?1+s.charged.power/100:mode==='guard'?Math.max(.5,1-s.charged.power/100):1);
 }
});

import {configurePledges,commands,pledgesState} from '../src/pledges_domain.js';
import '../src/combat_review_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {freshCombatReview,startReview} from '../src/combat_review.js';
test('replacing a used strip in the same minute records both real recoveries exactly once',()=>{
 const full={health:1,max_health:20},hero={is_alive:true,getFullStats:()=>full};configurePledges({actor:()=>hero});const d=domainRegistry.list().find(d=>d.id==='pledges'),review=domainRegistry.list().find(d=>d.id==='combatReview'),binding=JSON.stringify(['native.player.body',null,'human']);
 review.load(startReview(freshCombatReview(),{id:'actual-exchange',place:'Village',heroHP:1,foeHP:100,foes:['rat']}));d.load(P.carveCharged(P.fresh(),['ember','gale'],'siphon',30,binding));
 const hit={fighter:{tags:{main_character:true}},target:{tags:{}},damage:10};const a=commands.resolvedSiphon(hit);d.load(P.carveCharged(pledgesState(),['ember','gale'],'siphon',30,binding));const b=commands.resolvedSiphon(hit);
 assert.equal(full.health,1+a.heal+b.heal);assert.equal(review.save().current.recovered,a.heal+b.heal,'the observed account includes both already delivered recoveries');
 const prior={health:full.health,strip:pledgesState(),review:review.save()},tx=beginNativeCraftTransaction({owners:[full],bindings:[...commands.combatBindings(),...domainRegistry.command('combatReview','combatBindings')()]});commands.resolvedSiphon(hit);assert.ok(full.health>prior.health);tx.rollback();assert.equal(full.health,prior.health);assert.deepEqual(pledgesState(),prior.strip);assert.deepEqual(review.save(),prior.review,'native pending-writer rollback restores the observed recovery as well');
 const old=P.carveCharged(P.fresh(),['ember','gale'],'mend',1,binding);delete old.charged.serial;P.validate(old);assert.equal(P.migrate(old).charged.serial,undefined);const invalid=structuredClone(old);invalid.charged.serial=0;assert.throws(()=>P.validate(invalid),/strip serial/);
});
