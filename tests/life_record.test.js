import test from 'node:test';
import assert from 'node:assert/strict';
import {createLifeRecord,appendLifeMilestone,compactLifeRecord,lifeRecordView,validateLifeRecord,migrateLifeRecord,LIFE_YEAR_MINUTES as YEAR} from '../src/life_record.js';
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
