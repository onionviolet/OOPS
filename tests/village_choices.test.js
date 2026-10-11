import test from 'node:test';
import assert from 'node:assert/strict';
import {createVillageCareer,migrateVillageCareer,beginVillageShift,finishVillageShift,resolveVillageKit,promoteVillageCareer,issueWatchcraft,practiceWatchcraft,assignVillageRecruit,beginVillageTeaching,advanceVillageMentor,villageTeachingCost,villageTeachingStipend,villageTeachingBusy,beginRecruitSolo,resolveIonaTuition,beginTessaInstruction,advanceTessaInstruction,validateVillageCareer,recruitMemory} from '../src/village_career.js';
const round=s=>resolveVillageKit(finishVillageShift(beginVillageShift(s),true),'return');
function ready(){let s=createVillageCareer();for(let i=0;i<5;i++)s=round(s);s=promoteVillageCareer(promoteVillageCareer(s));s=issueWatchcraft(s);for(let i=0;i<5;i++)s=practiceWatchcraft(s,{known:true,location:'Village',activity:'meditating',worldId:'base.frontier'});return assignVillageRecruit(s);}
const tick=s=>advanceVillageMentor(s,{inVillage:true,alive:true,patrolling:true});
test('all teaching contracts preview distinct payouts, block agreed minutes, and default to paid mentor',()=>{
 for(const [term,payout] of [['paid',70],['pay',50],['time',0],['favor',60],['free',60]]){
  let s=beginVillageTeaching(beginVillageShift(ready(),true),true,'Hero',term);
  assert.equal(villageTeachingBusy(s),true);assert.equal(villageTeachingCost(s,false),0);assert.equal(villageTeachingStipend(s,false),0);
  for(let i=0;i<5;i++)s=tick(s);
  assert.equal(s.recruit.practiceMinutes,5);assert.equal(s.recruit.favors,term==='favor'?1:0);assert.equal(villageTeachingBusy(s),term==='time');
  for(let i=5;i<120;i++)s=tick(s);
  assert.equal(villageTeachingBusy(s),false);assert.equal(60-villageTeachingCost(s,true)+villageTeachingStipend(s,true),payout);
  assert.match(recruitMemory(s),term==='pay'?/taught on your shift/:new RegExp(term==='paid'?'paid mentor':term));
 }
 assert.equal(beginVillageTeaching(beginVillageShift(ready(),true),true,'Hero').loan.teachingTerm,'paid');
});
test('favor granted once, consumed once, covered shift finishes once; tuition accepts or declines once',()=>{
 let s=beginVillageTeaching(beginVillageShift(ready(),true),true,'Hero','favor');for(let i=0;i<8;i++)s=tick(s);assert.equal(s.recruit.favors,1);
 s=resolveVillageKit(finishVillageShift(s,false),'return');s=beginRecruitSolo(s,true);assert.equal(s.recruit.favors,0);assert.equal(s.recruit.covering,true);
 for(let i=0;i<120;i++)s=tick(s);assert.equal(s.recruit.soloPatrols,1);assert.equal(s.recruit.covering,false);assert.equal(s.recruit.tuition,'offered');assert.throws(()=>beginRecruitSolo(s,true),/no favor/);
 for(const choice of ['accepted','declined']){const t=resolveIonaTuition(s,choice);assert.equal(t.recruit.tuition,choice);assert.throws(()=>resolveIonaTuition(t,choice),/no tuition/);}
});
test('schema 3 lesson retains withheld wages and historic teacher without inventing favors or tuition',()=>{
 const old=beginVillageTeaching(beginVillageShift(ready(),true),true,'Hero','pay');old.schema=3;delete old.recruit.favors;delete old.recruit.teachingTerms;delete old.recruit.covering;delete old.recruit.tuition;delete old.watchcraft.tutorMinutes;delete old.watchcraft.tutoring;delete old.loan.teachingTerm;delete old.loan.teachingMinutes;
 const copy=structuredClone(old),s=migrateVillageCareer({village_career:old});assert.deepEqual(old,copy);assert.equal(s.schema,4);assert.equal(s.loan.teachingTerm,'pay');assert.equal(s.recruit.favors,0);assert.match(recruitMemory(s),/taught on your shift/);
 assert.throws(()=>validateVillageCareer({...s,recruit:{...s.recruit,favors:1}}),/unearned favor/);
});
test('Tessa instruction counts only native meditation minutes; no book or invented practice',()=>{
 let s=ready();s.recruit=null;s.watchcraft={issued:false,practiceMinutes:0,used:false,notesIssued:false,tutorMinutes:0,tutoring:false};s=beginTessaInstruction(s);
 const context={inVillage:true,alive:true,meditating:true};
 for(const patch of [{inVillage:false},{alive:false},{meditating:false}])assert.equal(advanceTessaInstruction(s,{...context,...patch}).watchcraft.tutorMinutes,0);
 for(let i=0;i<6;i++)s=advanceTessaInstruction(s,context);assert.equal(s.watchcraft.tutorMinutes,6);assert.equal(s.watchcraft.tutoring,false);assert.equal(s.watchcraft.practiceMinutes,0);assert.throws(()=>beginTessaInstruction(s),/completed/);
});
