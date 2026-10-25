import test from 'node:test';
import assert from 'node:assert/strict';
import {createLifeRecord,observeLifeSave,lifeCalendarMinute,appendLifeMilestone,compactLifeRecord,lifeRecordView,validateLifeRecord,migrateLifeRecord,LIFE_YEAR_MINUTES as YEAR} from '../src/life_record.js';
import {checkSaveSize,writeGuardedSave,measureSaveSize,SAVE_STORAGE_BUDGET,encodeSaveFile,decodeSaveFile} from '../src/save_files.js';
const event=(year,n=0)=>({year,at:year*YEAR+n,worldId:n%2?'book.cyoria':'base.frontier',kind:'memory',text:`A day worth remembering ${n}.`});
test('whole lives preserve counts while bounding prose and year summaries',()=>{
    let r=createLifeRecord();for(let y=999;y<1249;y++)for(let i=0;i<2;i++)r=appendLifeMilestone(r,event(y,i));
    validateLifeRecord(r);assert.equal(lifeRecordView(r).count,500);assert.ok(r.recent.length<=64);assert.equal(r.years.length,200);assert.ok(r.earlier.count>0);
    assert.ok(measureSaveSize(JSON.stringify(r)).storageBytes<250000);
    assert.deepEqual(compactLifeRecord(r,1248),r);
});
test('recent wording, worlds and counts survive summary and export round trips',()=>{
    let r=createLifeRecord();r=appendLifeMilestone(r,event(1000));r=appendLifeMilestone(r,event(1000,1));
    assert.equal(r.recent[1].worldId,'book.cyoria');
    const compact=compactLifeRecord(r,1003);assert.equal(compact.years[0].count,2);assert.equal(compact.years[0].kinds.memory,2);assert.equal(r.recent.length,2);
    const copy=JSON.parse(JSON.stringify(compact));assert.deepEqual(validateLifeRecord(copy),compact);
    assert.throws(()=>appendLifeMilestone(r,{...event(1000),text:'x'.repeat(241)}));
    assert.throws(()=>validateLifeRecord({...compact,schema:99}));
    assert.throws(()=>validateLifeRecord({...compact,years:[{...compact.years[0],count:9}]}));
});
test('schema 11 absence migrates without inventing historical milestones',()=>{
    const save={expansion:{schema:11,actors:{player:{worldId:'base.frontier'}}},'current time':{year:1042,month:4,day:1,hour:8,minute:0}};
    const r=migrateLifeRecord(save);assert.equal(r.recent.length,1);assert.equal(r.recent[0].year,1042);assert.equal(r.recent[0].kind,'beginning');
    assert.deepEqual(migrateLifeRecord({...save,life_record:r}),r);assert.equal(save.life_record,undefined);
});
test('shared origin budget counts other saves and replaces current key atomically',()=>{
    const map=new Map([['save','old'],['backup','x'.repeat(100)]]);const storage={get length(){return map.size;},key:i=>[...map.keys()][i],getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
    assert.equal(checkSaveSize('abc',{storage,key:'save',budget:240}).originStorageBytes,226);
    assert.throws(()=>checkSaveSize('x'.repeat(20),{storage,key:'save',budget:240}));assert.equal(map.get('save'),'old');
    assert.throws(()=>writeGuardedSave(storage,'save','x'.repeat(SAVE_STORAGE_BUDGET)));assert.equal(map.get('save'),'old');
    const quota={setItem(){throw Object.assign(new Error('quota'),{name:'QuotaExceededError'});}};
    assert.throws(()=>writeGuardedSave(quota,'save','{}'),/Export your save/);
});
test('UTF-8 export remains independent of browser storage budget',()=>{
    assert.equal(measureSaveSize('魏').storageBytes,2);assert.equal(measureSaveSize('魏').utf8Bytes,3);
    const large=JSON.stringify({padding:'a'.repeat(1000)});
    assert.throws(()=>checkSaveSize(large,{budget:1000}));assert.ok(encodeSaveFile(large).startsWith('YAIR-UTF8-1:'));
});
test('busy years fold overflow without dropping the last sixty-four memories',()=>{
    let r=createLifeRecord();for(let i=0;i<70;i++)r=appendLifeMilestone(r,event(1000,i));
    assert.equal(r.recent.length,64);assert.equal(r.recent[0].id,7);assert.equal(r.years[0].count,6);assert.equal(lifeRecordView(r).count,70);
});

import {reflectionMessage} from '../src/life_record.js';
test('semantic memory re-renders after a language change and year folding without rewriting facts; reflection avoids its last two lines',()=>{
 const save={pledges:{trial:{quality:3}},life_record:createLifeRecord()},messages=[];
 for(let i=0;i<4;i++){const m=reflectionMessage(save,'Village');messages.push(m);save.life_record=appendLifeMilestone(save.life_record,{...event(1000,i),...m});}
 assert.deepEqual(messages.map(m=>m.payload.variant),[0,1,2,0]);const original=JSON.stringify(save.life_record),en=lifeRecordView(save.life_record,'english'),zh=lifeRecordView(save.life_record,'chinese');assert.notEqual(en.recent[0].text,zh.recent[0].text);assert.match(en.recent[0].text,/3 trial quality/);assert.equal(JSON.stringify(save.life_record),original);
 const folded=compactLifeRecord(save.life_record,1003);assert.match(lifeRecordView(folded,'chinese').years[0].highlights[0],/试炼品质/);validateLifeRecord(JSON.parse(JSON.stringify(folded)));
 const bad=structuredClone(save.life_record);bad.recent[0].payload.variant=9;assert.throws(()=>validateLifeRecord(bad),/reflection/);
});

import {stageRootRetuningMemory} from '../src/root_retuning_record.js';
test('measured retuning records the staged calendar and conserved expression, localizes after folding, and leaves the live record untouched',()=>{
 const record=createLifeRecord(),plan={calendar:{year:1000,month:1,day:1,hour:9,minute:15},nativePatch:{other:'retained'}};
 stageRootRetuningMemory(plan,record,{flow:1,still:3,tested:true},{flow:2,still:2,tested:true},'flow');assert.equal(record.recent.length,0);assert.equal(plan.nativePatch.other,'retained');const r=plan.nativePatch.life_record;assert.equal(r.recent.length,1);assert.equal(r.recent[0].at,lifeCalendarMinute(plan.calendar));assert.match(lifeRecordView(r).recent[0].text,/flow 1 → 2/);assert.match(lifeRecordView(r,'chinese').recent[0].text,/药物残留/);assert.deepEqual(Object.keys(r.recent[0].payload).sort(),['afterFlow','afterStill','beforeFlow','beforeStill','direction']);const folded=compactLifeRecord(r,1003);assert.match(lifeRecordView(JSON.parse(JSON.stringify(folded)),'chinese').years[0].highlights[0],/流动 1 → 2/);const invalid=structuredClone(r);invalid.recent[0].payload.afterStill=3;assert.throws(()=>validateLifeRecord(invalid),/retuning/);
});

test('crossings count only durably observed changes, retain exact counts after biography folding, and never invent a legacy past',()=>{
 const save={'current time':{year:1000,month:1,day:1,hour:8,minute:0},expansion:{actors:{player:{worldId:'base.frontier'}}}};let r=observeLifeSave(createLifeRecord(),save);assert.deepEqual(lifeRecordView(r).crossings,{'base.frontier':0});const original=JSON.stringify(r);assert.deepEqual(observeLifeSave(r,save),r);save.expansion.actors.player.worldId='p23.mistglass';r=observeLifeSave(r,save);assert.deepEqual(lifeRecordView(r).crossings,{'base.frontier':0,'p23.mistglass':1});assert.equal(JSON.parse(original).observed.crossings['base.frontier'],0);assert.deepEqual(observeLifeSave(r,save),r);save.expansion.actors.player.worldId='base.frontier';r=observeLifeSave(r,save);assert.deepEqual(lifeRecordView(r).crossings,{'base.frontier':1,'p23.mistglass':1});const folded=compactLifeRecord(r,1003);assert.deepEqual(lifeRecordView(JSON.parse(JSON.stringify(folded))).crossings,lifeRecordView(r).crossings);
 const legacy=structuredClone(r);delete legacy.observed.crossings;assert.deepEqual(lifeRecordView(observeLifeSave(legacy,save)).crossings,{'base.frontier':0});assert.equal(legacy.observed.crossings,undefined);const bad=structuredClone(r);bad.observed.crossings['unvisited world']=-1;assert.throws(()=>validateLifeRecord(bad),/crossings/);
});
