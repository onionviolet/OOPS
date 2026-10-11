import test from 'node:test';
import assert from 'node:assert/strict';
import {createVillageCareer,migrateVillageCareer,validateVillageCareer,assignVillageRecruit,beginVillageTeaching,beginRecruitSolo,advanceVillageMentor,beginVillageShift,finishVillageShift,resolveVillageKit,promoteVillageCareer,issueWatchcraft,practiceWatchcraft,villageTeachingCost,recruitMemory} from '../src/village_career.js';
import {addVillageRecruit,validateVillageLives} from '../src/npc_lives.js';
const round=s=>resolveVillageKit(finishVillageShift(beginVillageShift(s),true),'return');
function mentor(){let s=round(round(createVillageCareer()));s=promoteVillageCareer(s);s=promoteVillageCareer(round(round(round(s))));s=issueWatchcraft(s);for(let i=0;i<5;i++)s=practiceWatchcraft(s,{known:true,location:'Village',worldId:'base.frontier',activity:'meditating'});return s;}
const tick=(s,extra={})=>advanceVillageMentor(s,{inVillage:true,alive:true,patrolling:true,...extra});
test('schema 2 migration preserves study, history and custody without inventing a recruit',()=>{
 const old=beginVillageShift(mentor(),true);old.schema=2;delete old.recruit;const copy=structuredClone(old),s=migrateVillageCareer({village_career:old});assert.equal(s.schema,4);assert.equal(s.recruit,null);assert.deepEqual(s.loan,old.loan);assert.deepEqual(s.watchcraft,{...old.watchcraft,notesIssued:old.watchcraft.issued,tutorMinutes:0,tutoring:false});assert.deepEqual(old,copy);
});
test('teaching requires Mentor, recruit, native knowledge and practiced loan; partial lessons and visible pay cost persist',()=>{
 assert.throws(()=>assignVillageRecruit(createVillageCareer()),/Mentor/);let s=assignVillageRecruit(mentor());assert.throws(()=>assignVillageRecruit(s),/already/);assert.throws(()=>beginVillageTeaching(s,true,'Hero','pay'),/patrol/);s=beginVillageShift(s,true);assert.throws(()=>beginVillageTeaching(s,false,'Hero'),/patrol/);s=beginVillageTeaching(s,true,'Hero','pay');assert.throws(()=>beginVillageTeaching(s,true,'Hero','pay'),/already/);assert.equal(s.recruit.known,true);
 for(const extra of [{alive:false},{inVillage:false},{patrolling:false}])assert.equal(tick(s,extra).recruit.practiceMinutes,0);
 s=tick(tick(s));assert.equal(s.recruit.practiceMinutes,2);assert.equal(villageTeachingCost(s,false),0);assert.equal(villageTeachingCost(s,true),10);s=finishVillageShift(s,false);assert.equal(s.recruit.practiceMinutes,2);assert.throws(()=>beginRecruitSolo(s),/practice/);
 s=resolveVillageKit(s,'return');s=beginVillageTeaching(beginVillageShift(s,true),true,'Hero','pay');for(let i=0;i<5;i++)s=tick(s);assert.equal(s.recruit.practiceMinutes,5);assert.match(recruitMemory(s),/Hero/);
});
test('solo patrol counts common played Village minutes, completes once and retains teacher',()=>{
 let s=beginVillageTeaching(beginVillageShift(assignVillageRecruit(mentor()),true),true,'Hero','pay');for(let i=0;i<5;i++)s=tick(s);s=resolveVillageKit(finishVillageShift(s,true),'return');s=beginRecruitSolo(s);assert.throws(()=>beginRecruitSolo(s),/already/);assert.equal(tick(s,{inVillage:false}).recruit.soloRemaining,120);assert.equal(tick(s,{alive:false}).recruit.soloRemaining,120);for(let i=0;i<120;i++)s=tick(s,{patrolling:false});assert.equal(s.recruit.soloRemaining,null);assert.equal(s.recruit.soloPatrols,1);assert.equal(tick(s).recruit.soloPatrols,1);assert.match(recruitMemory(s),/Hero taught me.*1 solo patrol/);assert.throws(()=>validateVillageCareer({...s,recruit:{...s.recruit,practiceMinutes:0}}),/solo patrol/);
 const lives=addVillageRecruit(null,999,1);assert.doesNotThrow(()=>validateVillageLives(lives));assert.deepEqual(addVillageRecruit(lives,999,1),lives);assert.equal(lives.people.filter(p=>p.id==='iona').length,1);
});
test('imports bind recruit to public life and native teacher reading, and reject fabricated practice',async()=>{
 const {validateSaveEnvelope}=await import('../src/save_files.js');
 let career=beginVillageTeaching(beginVillageShift(assignVillageRecruit(mentor()),true),true,'Hero','pay');
 const save={'game version':'v0.5.5.30','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Hero',money:102,xp:{total_xp:0},inventory:{},equipment:{}},skills:{Literacy:{total_xp:6}},locations:{},activities:{},dialogues:{},traders:{},current_activity:{activity_id:'patrolling'},village_career:career};
 assert.throws(()=>validateSaveEnvelope(save,'v0.5.5.30'),/public life/);save.npc_lives=addVillageRecruit(null,999,1);
 assert.throws(()=>validateSaveEnvelope(save,'v0.5.5.30'),/completed native reading/);save.books={'Tessa’s watchcraft notes':{accumulated_time:6}};assert.doesNotThrow(()=>validateSaveEnvelope(save,'v0.5.5.30'));
 career=structuredClone(career);career.recruit.known=false;career.recruit.practiceMinutes=1;assert.throws(()=>validateVillageCareer(career),/remembered teacher/);
});
