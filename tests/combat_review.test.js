import test from 'node:test';
import assert from 'node:assert/strict';
import {freshCombatReview,startReview,observeReview,finishReview,diagnoseCombat,publicCombatForecast,validateCombatReview} from '../src/combat_review.js';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/combat_review_domain.js';
const start=()=>startReview(freshCombatReview(),{id:'native:1',place:'Practice yard',heroHP:30,foeHP:40,foes:['Observed rival']});
test('observed hit/miss/block outcomes diagnose accuracy and survival without awarding an outcome or replaying a swing',()=>{
 let s=start();for(let i=0;i<5;i++)s=observeReview(s,'native:1',String(i),{direction:'dealt',outcome:i<3?'miss':'hit',amount:4});s=observeReview(s,'native:1','taken',{direction:'taken',outcome:'hit',amount:12});assert.equal(diagnoseCombat(s.current).cause,'accuracy');const same=observeReview(s,'native:1','taken',{direction:'taken',outcome:'hit',amount:12});assert.deepEqual(same,s);
 s=finishReview(s,'native:1','lost');assert.equal(s.current,null);assert.equal(s.recent[0].outcome,'lost');assert.equal(s.recent[0].outgoing,5);validateCombatReview(JSON.parse(JSON.stringify(s)));assert.deepEqual(finishReview(s,'native:1','lost'),s);assert.deepEqual(startReview(s,{id:'native:1'}),s);
 let other=start();other=observeReview(other,'native:1','out',{direction:'dealt',outcome:'hit',amount:2});other=observeReview(other,'native:1','in',{direction:'taken',outcome:'hit',amount:10});assert.equal(diagnoseCombat(other.current).cause,'endurance');
});
test('native combat binding rolls a failed exchange observation back with the same transaction',()=>{
 const d=domainRegistry.list().find(d=>d.id==='combatReview');d.load(start());const before=domainRegistry.save({}),tx=beginNativeCraftTransaction({bindings:d.commands.combatBindings()});d.commands.observe({id:'native:1',key:'actual-resolved',event:{direction:'dealt',outcome:'hit',amount:7}});assert.equal(d.projection().current.dealt,7);tx.rollback();assert.deepEqual(domainRegistry.save({}),before);d.load(null);
});
test('forecast uses disclosed physical terms, keeps shields uncertain and changes with real displayed protection',()=>{
 const hero={health:{current:30},attack:{power:10,count:1},speed:1,defense:2,shield:false},foe={name:'Known opponent',health:{current:20},attack:{power:5,count:1},speed:1,defense:1,hitPct:100,youHitPct:100,shield:false,hiddenTruth:'SEALED'};
 const bare=publicCombatForecast(hero,[foe]),armored=publicCombatForecast({...hero,defense:4},[foe]);assert.ok(armored.secondsToFall>bare.secondsToFall);assert.equal(armored.secondsToKill,bare.secondsToKill);assert.equal(publicCombatForecast(hero,[{...foe,shield:true}]).pairs[0].uncertain,true);assert.doesNotMatch(JSON.stringify(bare),/SEALED|hiddenTruth/);assert.match(bare.assumptions,/Crits, shields, tactics/);
});

test('already delivered native recovery has one observed receipt and shares the failed-exchange rollback boundary',async()=>{
 const {observeRecovery}=await import('../src/combat_review.js');let s=start();s=observeRecovery(s,'charged-mend:1:1',3);assert.equal(s.current.recovered,3);assert.deepEqual(observeRecovery(s,'charged-mend:1:1',3),s);const old=structuredClone(s);delete old.current.recovered;validateCombatReview(old);assert.throws(()=>observeRecovery(s,'bad',-1),/recovery/);
 const d=domainRegistry.list().find(d=>d.id==='combatReview');d.load(start());const tx=beginNativeCraftTransaction({bindings:d.commands.combatBindings()});d.commands.recovered({key:'actual-mend',amount:4});assert.equal(d.projection().current.recovered,4);tx.rollback();assert.equal(d.projection().current.recovered,0);
});

import {ownDefenseRows} from '../src/combat_review.js';
test('own disclosed defensive layers improve the live incoming estimate without exposing enemy private modifiers',()=>{
 const hero={main:true,health:{current:30},attack:{power:10,count:1},speed:1,defense:2,shield:false,armorPenetration:3,protection:{damageTaken:.7,minDamageShare:.03,critResistance:.5,blockChance:.25}},foe={name:'Observed foe',health:{current:20},attack:{power:10,count:1},speed:1,defense:4,hitPct:100,youHitPct:100,shield:false,protection:{damageTaken:.01,secret:'SEALED'}};
 const plain=publicCombatForecast({...hero,protection:undefined},[foe]),protectedFight=publicCombatForecast(hero,[foe]);assert.ok(protectedFight.secondsToFall>plain.secondsToFall);assert.equal(protectedFight.secondsToKill,plain.secondsToKill);assert.equal(protectedFight.protection.find(r=>r.layer==='Critical chance remaining').value,.5);assert.equal(protectedFight.protection.find(r=>r.layer==='Physical chip share').value,3);assert.equal(protectedFight.protection.find(r=>r.layer==='Your outgoing penetration').value,3);assert.equal(ownDefenseRows(hero).some(r=>r.layer==='Shield strength'),false);assert.equal(ownDefenseRows({...hero,shield:true,block:7}).find(r=>r.layer==='Shield strength').value,7);assert.doesNotMatch(JSON.stringify(protectedFight),/SEALED|secret/);const capped=ownDefenseRows({...hero,protection:{...hero.protection,damageTaken:.01,critResistance:10}});assert.equal(capped.find(r=>r.layer==='Damage after armor').value,.5);assert.equal(capped.find(r=>r.layer==='Critical chance remaining').value,.25);
});
