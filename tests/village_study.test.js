import test from 'node:test';
import assert from 'node:assert/strict';
import {createVillageCareer,migrateVillageCareer,beginVillageShift,finishVillageShift,resolveVillageKit,promoteVillageCareer,issueWatchcraft,practiceWatchcraft,watchcraftPresentation,villageShiftBonus,WATCHCRAFT_BOOK} from '../src/village_career.js';
import {validateSaveEnvelope} from '../src/save_files.js';
const round=s=>resolveVillageKit(finishVillageShift(beginVillageShift(s),true),'return');
const dependable=()=>promoteVillageCareer(round(round(createVillageCareer())));
const practice=(s,extra={})=>practiceWatchcraft(s,{known:true,location:'Village',activity:'meditating',worldId:'base.frontier',...extra});
test('schema-1 migration preserves earned career and custody but invents no method',()=>{
 const original={...dependable(),schema:1};delete original.watchcraft;
 const before=structuredClone(original),s=migrateVillageCareer({village_career:original});
 assert.equal(s.schema,4);assert.deepEqual(s.watchcraft,{issued:false,practiceMinutes:0,used:false,notesIssued:false,tutorMinutes:0,tutoring:false});
 assert.equal(s.rank,1);assert.equal(s.completed,2);assert.deepEqual(original,before);
});
test('knowledge, personal rehearsal and current loan custody are separate execution gates',()=>{
 assert.throws(()=>issueWatchcraft(createVillageCareer()),/Dependable/);
 let s=issueWatchcraft(dependable());assert.throws(()=>issueWatchcraft(s),/already/);
 for(const extra of [{known:false},{location:'Shack'},{activity:'patrolling'},{worldId:'other.world'},{alive:false}])assert.deepEqual(practice(s,extra),s);
 assert.equal(watchcraftPresentation(s,true).known,true);assert.equal(watchcraftPresentation(s,true).practiced,false);
 const unpracticed=beginVillageShift(s,true);assert.equal(villageShiftBonus(unpracticed,true),0);
 for(let i=0;i<5;i++)s=practice(s);
 assert.equal(watchcraftPresentation(s,true).practiced,true);assert.equal(watchcraftPresentation(s,true).executable,false);
 const noKnowledge=beginVillageShift(s,false);assert.equal(villageShiftBonus(noKnowledge,true),0);
 const active=beginVillageShift(s,true);assert.equal(watchcraftPresentation(active,true).executable,true);assert.equal(villageShiftBonus(active,false),0);assert.equal(villageShiftBonus(active,true),10);
 const cancelled=finishVillageShift(active,false);assert.equal(cancelled.watchcraft.used,false);assert.equal(watchcraftPresentation(cancelled,true).executable,false);
 const done=finishVillageShift(active,true);assert.equal(done.watchcraft.used,true);assert.equal(villageShiftBonus(done,true),0);
 const debt=resolveVillageKit(done,'keep');assert.throws(()=>beginVillageShift(debt,true),/settle/);assert.equal(watchcraftPresentation(debt,true).executable,false);
});
test('import rejects fabricated practice without native book completion',()=>{
 let s=issueWatchcraft(dependable());s=practice(s);
 const envelope={'game version':'v0.5.5.30','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Hero',money:102,xp:{total_xp:0},inventory:{},equipment:{}},skills:{Literacy:{total_xp:6}},locations:{},activities:{},dialogues:{},traders:{},village_career:s};
 assert.throws(()=>validateSaveEnvelope(envelope,'v0.5.5.30'),/completed native reading/);
 envelope.books={[WATCHCRAFT_BOOK]:{accumulated_time:6}};assert.doesNotThrow(()=>validateSaveEnvelope(envelope,'v0.5.5.30'));
});
