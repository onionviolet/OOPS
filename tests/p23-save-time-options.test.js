import test from 'node:test';
import assert from 'node:assert/strict';
import {createBackupUndo, backupJournalKey} from '../src/absorb_p23/save_time_options/backup_undo.js';
const VERSION = 'v0.5.5.30';
const fixture = name => JSON.stringify({'game version': VERSION, 'current time':
    {year:999,month:4,day:1,hour:8,minute:0}, 'current location':'Village',
    character:{name,money:102,xp:{total_xp:0},inventory:{},equipment:{}},
    skills:{Literacy:{total_xp:0}},locations:{},activities:{},dialogues:{},traders:{}});
function storage() {
    const data = new Map([['save data','legacy live bytes'],['backup save','legacy backup bytes'],
        ['dev save data','dev bytes'],['heir request','request bytes'],['appearance','unrelated']]);
    return {data, writes:0, get length(){return data.size;}, key(i){return [...data.keys()][i] ?? null;},
        getItem(k){return data.get(k) ?? null;}, setItem(k,v){this.writes++; data.set(k,v);}};
}
const setup = (s=storage(), options={}) => ({s, store:createBackupUndo({storage:s,release:'live',
    currentVersion:VERSION,ownsSave:()=>true,preflight:async()=>{},...options})});

test('P15 optional journal is absent on old origins and release keys are disjoint', () => {
    const {s,store}=setup(); assert.equal(store.read(),null); assert.equal(s.writes,0);
    assert.notEqual(backupJournalKey('live'),backupJournalKey('dev'));
    assert.throws(()=>backupJournalKey('save data'));
});
test('P15 capture and repeated undo preserve valid exact snapshots and all legacy keys', async () => {
    const {s,store}=setup(), original=new Map(s.data), a=fixture('魏宝 🐉'), b=fixture('Second');
    await store.capture(a); await store.capture(b);
    assert.equal((await store.undo()).current,a);
    assert.equal((await store.undo()).current,b);
    assert.equal((await store.undo()).current,a);
    assert.equal(store.read().revision,5);
    for(const [k,v] of original) assert.equal(s.getItem(k),v);
});
test('P15 quota setItem abort preserves the complete previous origin', async () => {
    const {s,store}=setup(); await store.capture(fixture('A')); await store.capture(fixture('B'));
    const before=[...s.data]; s.setItem=()=>{throw Object.assign(new Error('full'),{name:'QuotaExceededError'});};
    await assert.rejects(store.undo(),e=>e.code==='SAVE_STORAGE_FULL');
    assert.deepEqual([...s.data],before);
});
test('P15 budget accounts for unrelated keys without eviction', async () => {
    const {s,store}=setup(); s.data.set('unrelated large','x'.repeat(2*1024*1024));
    const before=[...s.data]; await assert.rejects(store.capture(fixture('A')),e=>e.code==='SAVE_STORAGE_FULL');
    assert.equal(s.writes,0); assert.deepEqual([...s.data],before);
});
test('P15 unsupported native schemas reject before loader and storage mutation', async () => {
    let calls=0; const {s,store}=setup(storage(),{preflight:()=>{calls++;}});
    const f=JSON.parse(fixture('A')); f.fork_schema=999;
    await assert.rejects(store.capture(JSON.stringify(f)),/schema/);
    assert.equal(calls,0); assert.equal(s.writes,0);
});
test('P15 unsupported or malformed journal cannot be overwritten', async () => {
    const {s,store}=setup();
    for(const raw of ['{','null',JSON.stringify({schema:2,revision:1,current:fixture('A'),previous:null}),
        JSON.stringify({schema:1,revision:1,current:fixture('A'),previous:'{}'})]) {
        s.data.set(store.key,raw); const before=[...s.data];
        await assert.rejects(store.capture(fixture('B'))); assert.deepEqual([...s.data],before);
    }
    assert.equal(s.writes,0);
});
test('P15 real-loader rejection preserves every key', async () => {
    const {s,store}=setup(storage(),{preflight:()=>{throw new Error('unknown native reference');}});
    const before=[...s.data]; await assert.rejects(store.capture(fixture('A')),/native reference/);
    assert.deepEqual([...s.data],before); assert.equal(s.writes,0);
});
test('P15 writable ownership is required both before and after asynchronous preflight', async () => {
    let owned=false; const {s,store}=setup(storage(),{ownsSave:()=>owned,preflight:()=>{owned=false;}});
    await assert.rejects(store.capture(fixture('A')),/writable/);
    owned=true; await assert.rejects(store.capture(fixture('A')),/writable/); assert.equal(s.writes,0);
});
test('P15 overlapping async captures cannot lose the winning undo snapshot', async () => {
    const gates=[]; const {store}=setup(storage(),{preflight:()=>new Promise(r=>gates.push(r))});
    const a=store.capture(fixture('A')), b=store.capture(fixture('B'));
    gates[1](); await b; gates[0](); await assert.rejects(a,/changed during preflight/);
    assert.equal(store.read().current,fixture('B')); assert.equal(store.read().previous,null);
});
test('P15 undo requires a valid previous snapshot and preflights both retained saves', async () => {
    let calls=0; const {s,store}=setup(storage(),{preflight:()=>{calls++;}});
    await assert.rejects(store.undo(),/No previous/); await store.capture(fixture('A'));
    await assert.rejects(store.undo(),/No previous/); await store.capture(fixture('B'));
    calls=0; await store.undo(); assert.equal(calls,2); assert.equal(s.writes,3);
});
