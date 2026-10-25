import test from 'node:test';
import assert from 'node:assert/strict';
import {freshBrood,stockClutch,advanceBrood,validateBrood,broodPracticeBonus,broodView} from '../src/household_brood.js';
import {memberView} from '../src/lineage_traits.js';
test('paid clutch has no grown creature; field-gated incubation and ordinary maturation agree across clock partitions',()=>{
 const a=freshBrood('brood',0);stockClutch(a);const b=structuredClone(a);advanceBrood(a,200,[0,240]);for(let t=1;t<=200;t++)advanceBrood(b,t,[0,240]);assert.deepEqual(a,b);assert.equal(a.roster.length,2);assert.ok(a.roster.every(r=>r.stage==='adult'));
 const paused=freshBrood('brood',0);stockClutch(paused);advanceBrood(paused,120,null);assert.ok(paused.roster.every(r=>r.stage==='egg'&&r.incubation===0));advanceBrood(paused,180,[120,360]);assert.ok(paused.roster.every(r=>r.stage==='juvenile'));validateBrood(JSON.parse(JSON.stringify(a)),200);
 assert.equal(broodPracticeBonus({brood:a},1),1,'no assigned companion, no benefit');a.active=a.roster[0].member.id;advanceBrood(a,240,[0,240]);assert.ok(broodPracticeBonus({brood:a},1)>=1);assert.equal(broodPracticeBonus({brood:a},0),1,'a dry ring supplies no cultivation benefit');
});
test('opted breeding spends finite allocated food and actual parental energy/rest and retains both parents and mutated genes',()=>{
 const a=freshBrood('family-brood',0);stockClutch(a);a.food=3;a.breeding=true;const b=structuredClone(a);advanceBrood(a,600,[0,600]);for(let t=1;t<=600;t++)advanceBrood(b,t,[0,600]);assert.deepEqual(a,b);assert.equal(a.births,3);assert.equal(a.food,0);assert.equal(a.roster.length,5);assert.ok(a.roster.slice(2).every(r=>r.member.sire&&r.member.dam));assert.ok(a.roster.every(r=>r.energy>=0));validateBrood(a,600);
 const saved=structuredClone(a);advanceBrood(a,1000000,null);assert.equal(a.roster.length,saved.roster.length);assert.equal(a.births,saved.births);assert.equal(a.food,0);
 const stopped=freshBrood('stopped',0);stockClutch(stopped);stopped.food=9;advanceBrood(stopped,1000,[0,1000]);assert.equal(stopped.births,0);assert.equal(stopped.food,9);
 const bad=structuredClone(a);bad.roster[0].member.genes.wind=['bad','w'];assert.throws(()=>validateBrood(bad,1000000),/genes/);
});
test('eggs disclose no inherited phenotype before hatching and room/food stops are observable',()=>{
 const b=freshBrood('latent',0);stockClutch(b);const c={clock:0},h={fixtures:{}};const v=broodView(b,c,h);assert.ok(v.roster.every(r=>r.traits.length===0&&r.capacity===null));assert.match(v.stop,/grain/);b.food=1;assert.match(broodView(b,c,h).stop,/field/);
 advanceBrood(b,60,[0,240]);assert.deepEqual(broodView(b,{clock:60},h).roster[0].traits,memberView(b.roster[0].member));
});
