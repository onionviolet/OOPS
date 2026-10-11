import test from 'node:test';
import assert from 'node:assert/strict';
import {createVillageCareer,migrateVillageCareer,validateVillageCareer,beginVillageShift,finishVillageShift,resolveVillageKit,promoteVillageCareer,villagePromotionRequirements,villageColleagueMemory} from '../src/village_career.js';
import {validateSaveEnvelope} from '../src/save_files.js';
const round=s=>resolveVillageKit(finishVillageShift(beginVillageShift(s),true),'return');
test('old saves start without invented career history or loan; migration copies state',()=>{
    assert.deepEqual(migrateVillageCareer({}),createVillageCareer());
    const source={village_career:round(createVillageCareer())};const s=migrateVillageCareer(source);s.completed=0;assert.equal(source.village_career.completed,1);
});
test('cancelled shift has no promotion credit, remembers colleague and retains kit obligation',()=>{
    const active=beginVillageShift(createVillageCareer());assert.throws(()=>beginVillageShift(active),/return/);
    assert.throws(()=>resolveVillageKit(active,'return'),/finish/);
    const stopped=finishVillageShift(active,false);assert.match(villageColleagueMemory(stopped),/left before/);
    const returned=resolveVillageKit(stopped,'return');assert.equal(returned.returned,0);assert.equal(returned.completed,0);
    assert.throws(()=>promoteVillageCareer(returned),/Complete 2 full shifts/);
});
test('kept kit records debt, blocks another loan and promotion; returned kit clears debt',()=>{
    const due=finishVillageShift(beginVillageShift(createVillageCareer()),true);
    const debt=resolveVillageKit(due,'keep');assert.equal(debt.debt,50);assert.match(villageColleagueMemory(debt),/debt/);
    assert.throws(()=>beginVillageShift(debt),/settle/);assert.throws(()=>resolveVillageKit(debt,'keep'),/already/);
    const returned=resolveVillageKit(debt,'return');assert.equal(returned.debt,0);assert.equal(returned.returned,1);
    const paid=resolveVillageKit(debt,'pay');assert.equal(paid.loan,null);assert.equal(paid.returned,0);
});
test('three native-work ranks have exact gates; promotion and kit return cannot repeat',()=>{
    let s=createVillageCareer();assert.deepEqual(villagePromotionRequirements(s),['Complete 2 full shifts (0/2).','Return 2 completed-shift kits (0/2).']);
    s=round(round(s));s=promoteVillageCareer(s);assert.equal(s.rank,1);assert.throws(()=>promoteVillageCareer(s),/5 full/);
    s=round(round(round(s)));s=promoteVillageCareer(s);assert.equal(s.rank,2);assert.throws(()=>promoteVillageCareer(s),/already mentor/);
    assert.throws(()=>resolveVillageKit(s,'return'),/finish/);assert.equal(createVillageCareer().completed,0);
});
test('import rejects impossible custody, debt, ranks and active patrol mismatch',()=>{
    for(const s of [{...createVillageCareer(),rank:2},{...createVillageCareer(),debt:50},{...createVillageCareer(),completed:1},{...createVillageCareer(),loan:{status:'active',completed:true}}])assert.throws(()=>validateVillageCareer(s));
    const original={'game version':'v0.5.5.30','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Hero',money:102,xp:{total_xp:0},inventory:{},equipment:{}},skills:{},locations:{},activities:{},dialogues:{},traders:{},village_career:beginVillageShift(createVillageCareer())};
    assert.throws(()=>validateSaveEnvelope(original,'v0.5.5.30'),/native patrol/);
    original.current_activity={activity_id:'patrolling'};assert.doesNotThrow(()=>validateSaveEnvelope(original,'v0.5.5.30'));
});
