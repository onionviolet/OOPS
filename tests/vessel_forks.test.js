import test from 'node:test';
import assert from 'node:assert/strict';
import {freshDiscipline,changeDiscipline,validateDiscipline,disciplineView} from '../src/absorb_p23/world_adaptation/discipline.js';
import {advanceCultivation,cultivationView} from '../src/absorb_p23/world_adaptation/techniques.js';
import {forkAllocation,forkWeights} from '../src/vessel_forks.js';
const learned=()=>({schema:1,selected:'breath',minutes:{breath:48,settling:48},discipline:{...freshDiscipline(),bodyMinutes:120,depth:{flow:1,still:0},nodes:{flow:0,still:0,bridge:4}}});
const action=(t,id)=>changeDiscipline(t,'fork:'+id,10000).next;
test('earned attention patterns consume actual bridge stock and retain bounded independent allocations',()=>{
 const t=learned(),before=structuredClone(t),one=changeDiscipline(t,'fork:add',1000);assert.equal(one.cost,1000);assert.equal(one.next.discipline.nodes.bridge,2);assert.deepEqual(t,before);assert.throws(()=>changeDiscipline(t,'fork:add',999),/Needs 1/);
 const two=action(one.next,'add');assert.equal(two.discipline.nodes.bridge,0);assert.throws(()=>action(two,'add'),/two actual/);
 let n=action(two,'weight:0:50');n=action(n,'weight:1:25');assert.deepEqual(forkWeights(n.discipline.forks),[25,50,25]);assert.throws(()=>action(n,'weight:1:75'),/available attention/);assert.equal(n.discipline.forks.slots[1].weight,25);
 const alloc=forkAllocation(n.discipline.forks,12345);assert.equal(alloc.counts.reduce((a,b)=>a+b,0),12345);validateDiscipline(n.discipline);const bad=structuredClone(n.discipline);bad.paired=true;assert.throws(()=>validateDiscipline(bad),/paired attention/);
 const unearned=learned();unearned.minutes.settling=16;assert.throws(()=>action(unearned,'add'),/Integrate/);
});
test('parallel saved tracks divide real minutes exactly, change actual learned work/purification and remain partition independent',()=>{
 let n=action(action(learned(),'add'),'add');n=action(n,'weight:0:50');n=action(n,'weight:1:50');const before=disciplineView(n.discipline),whole=advanceCultivation(n,200);let fine=structuredClone(n),earned=0n;
 for(let i=0;i<200;i++){const r=advanceCultivation(fine,1);fine=r.next;earned+=r.earned;}
 assert.deepEqual(whole.next,fine);assert.equal(whole.earned,earned);const f=fine.discipline.forks;assert.equal(f.slots[0].minutes.breath,48);assert.equal(f.slots[0].minutes.settling,0);assert.equal(f.slots[1].minutes.settling,48);assert.deepEqual(fine.minutes,{breath:48,settling:48});
 const after=disciplineView(fine.discipline);assert.ok(after.oddsBonus>before.oddsBonus);assert.ok(after.workPermille<before.workPermille);const large=advanceCultivation(fine,1000000);assert.equal(typeof large.earned,'bigint');validateDiscipline(large.next.discipline);
 const paired=changeDiscipline(fine,'pair',10000).next;assert.deepEqual(forkWeights(paired.discipline.forks),[100,0,0]);assert.equal(cultivationView(paired).rate,cultivationView({...paired,discipline:{...paired.discipline,forks:undefined}}).rate);
});
