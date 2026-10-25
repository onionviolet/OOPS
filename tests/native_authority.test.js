// SOURCE contract checks only. Injected preflight instruments async host calls;
// it does not prove the isolated native loader, browser or gameplay acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createNativeAuthority, nativeAuthorityKey} from '../src/absorb_p23/save_time_options/native_authority.js';
import {writeGuardedSave} from '../src/save_files.js';

const VERSION = 'v0.5.5.30';
const fixture = name => JSON.stringify({'game version': VERSION, 'current time':
    {year:999,month:4,day:1,hour:8,minute:0}, 'current location':'Village',
    character:{name,money:102,xp:{total_xp:0},inventory:{},equipment:{}},
    skills:{Literacy:{total_xp:0}},locations:{},activities:{},dialogues:{},traders:{}});
function storage() {
    const data = new Map([['save data','legacy live bytes'],['dev save data','legacy dev bytes'],
        ['backup save','legacy backup bytes'],['dev backup save','legacy dev backup bytes'],
        ['save data:ended-life:old','immutable old archive'],['appearance','unrelated']]);
    return {data, writes:[], get length(){return data.size;}, key(i){return [...data.keys()][i] ?? null;},
        getItem(k){return data.get(k) ?? null;}, setItem(k,v){this.writes.push([k,v]);data.set(k,v);}};
}
function setup(options={}) {
    const s=storage(); let owned=true; const calls=[];
    const authority=createNativeAuthority({storage:s,release:'live',currentVersion:VERSION,
        ownsSave:()=>owned,preflight:async save=>{calls.push(save.character.name);},...options});
    return {s,authority,calls,setOwned:value=>{owned=value;}};
}
const hashes = data => [...data].map(([key,value])=>[key,createHash('sha256').update(value,'utf8').digest('hex')]);

test('absent authority is a boot no-op; ordinary publication and capture cannot enroll', async()=>{
    const {s,authority}=setup(),before=[...s.data];
    assert.equal(authority.read(),null);assert.equal(await authority.boot(),null);
    assert.throws(()=>authority.commitPreparedSave(fixture('A')),/enrollment/);
    await assert.rejects(authority.capture(fixture('A')),/enrollment/);
    await assert.rejects(authority.importSnapshot(fixture('A')),/enrollment/);
    assert.deepEqual([...s.data],before);assert.equal(s.writes.length,0);
});
test('explicit enrollment performs one guarded durable write and preserves all original hashes',async()=>{
    const {s,authority,calls}=setup(),before=hashes(s.data),a=fixture('魏宝 🐉');
    const root=await authority.enroll(a);
    assert.equal(root.current,a);assert.equal(root.previous,null);assert.equal(root.revision,1);
    assert.deepEqual(calls,['魏宝 🐉']);assert.equal(s.writes.length,1);
    assert.equal(s.writes[0][0],authority.key);
    assert.deepEqual(hashes(new Map([...s.data].filter(([key])=>key!==authority.key))),before);
});
test('capture A, save B and repeated exact undo use one publication each',async()=>{
    const {s,authority,calls}=setup(),a=fixture('A'),b=fixture('B');
    await authority.enroll(a);await authority.capture(a);
    authority.commitPreparedSave(b);const count=s.writes.length;calls.length=0;
    const first=await authority.undo();assert.equal(first.current,a);assert.equal(first.previous,b);
    assert.deepEqual(calls,['A','B']);assert.equal(s.writes.length,count+1);
    const second=await authority.undo();assert.equal(second.current,b);assert.equal(second.previous,a);
    assert.equal(second.revision,5);assert.equal(s.writes.length,count+2);
});
test('native import preflights candidate and retained backup before one write',async()=>{
    const {s,authority,calls}=setup(),a=fixture('A'),b=fixture('B');
    await authority.enroll(a);await authority.capture(a);const count=s.writes.length;calls.length=0;
    const imported=await authority.importSnapshot(b);
    assert.equal(imported.current,b);assert.equal(imported.previous,a);
    assert.deepEqual(calls,['B','A']);assert.equal(s.writes.length,count+1);
});
test('present invalid roots reject boot, enrollment and normal saves without fallback or mutation',async()=>{
    const {s,authority,calls}=setup();
    const good={schema:1,release:'live',revision:1,current:fixture('A'),previous:null};
    for(const raw of ['', '{', 'null', JSON.stringify({...good,schema:99}),
        JSON.stringify({...good,release:'dev'}),JSON.stringify({...good,previous:'{}'}),
        JSON.stringify({...good,revision:0}),JSON.stringify({...good,extra:true})]){
        s.data.set(authority.key,raw);const before=[...s.data];
        await assert.rejects(authority.boot(),e=>e.code==='SAVE_AUTHORITY_INVALID');
        await assert.rejects(authority.enroll(fixture('B')),e=>e.code==='SAVE_AUTHORITY_INVALID');
        assert.throws(()=>authority.commitPreparedSave(fixture('B')),e=>e.code==='SAVE_AUTHORITY_INVALID');
        assert.deepEqual([...s.data],before);
    }
    assert.equal(s.writes.length,0);assert.equal(calls.length,0);
});
test('real native structural validation rejects unsupported candidate before preflight or write',async()=>{
    const {s,authority,calls}=setup(),save=JSON.parse(fixture('A'));save.fork_schema=999;
    const before=[...s.data];await assert.rejects(authority.enroll(JSON.stringify(save)),/schema/);
    assert.equal(calls.length,0);assert.equal(s.writes.length,0);assert.deepEqual([...s.data],before);
});
test('recursive authority metadata in snapshots is refused rather than rewritten',async()=>{
    const {s,authority}=setup(),save=JSON.parse(fixture('A'));
    save.expansionExtras={p23_backup_undo:{current:fixture('A')}};
    await assert.rejects(authority.enroll(JSON.stringify(save)),/metadata/);assert.equal(s.writes.length,0);
});
test('host preflight failure preserves root and legacy data; boot failure is loud',async()=>{
    const {s,authority}=setup({preflight:async()=>{throw Error('host loader rejects');}});
    s.data.set(authority.key,JSON.stringify({schema:1,release:'live',revision:1,current:fixture('A'),previous:null}));
    const before=[...s.data];
    await assert.rejects(authority.boot(),e=>e.code==='SAVE_AUTHORITY_INVALID');
    await assert.rejects(authority.importSnapshot(fixture('B')),e=>e.code==='SAVE_AUTHORITY_INVALID'&&e.cause.message==='host loader rejects');
    assert.deepEqual([...s.data],before);assert.equal(s.writes.length,0);
});
test('shared-lock ownership is checked before and after async validation',async()=>{
    let writable=false;const {s,authority}=setup({ownsSave:()=>writable,preflight:async()=>{writable=false;}});
    await assert.rejects(authority.enroll(fixture('A')),e=>e.code==='SAVE_READ_ONLY');
    writable=true;await assert.rejects(authority.enroll(fixture('A')),e=>e.code==='SAVE_READ_ONLY');
    assert.equal(s.writes.length,0);assert.equal(authority.busy,false);
});
test('async operation blocks same-tab normal writes and rejects changed root after preflight',async()=>{
    let resume;const {s,authority}=setup({preflight:()=>new Promise(resolve=>{resume=resolve;})});
    const pending=authority.enroll(fixture('A'));
    assert.throws(()=>authority.commitPreparedSave(fixture('B')),e=>e.code==='SAVE_AUTHORITY_BUSY');
    await assert.rejects(authority.capture(fixture('B')),e=>e.code==='SAVE_AUTHORITY_BUSY');
    const competing=JSON.stringify({schema:1,release:'live',revision:1,current:fixture('C'),previous:null});
    s.data.set(authority.key,competing);resume();
    await assert.rejects(pending,e=>e.code==='SAVE_AUTHORITY_CHANGED');
    assert.equal(s.getItem(authority.key),competing);assert.equal(s.writes.length,0);assert.equal(authority.busy,false);
});
test('stale expected bytes refuse prepared native commit',async()=>{
    const {s,authority}=setup();await authority.enroll(fixture('A'));const before=[...s.data];
    assert.throws(()=>authority.commitPreparedSave(fixture('B'),{expected:'stale'}),e=>e.code==='SAVE_AUTHORITY_CHANGED');
    assert.deepEqual([...s.data],before);assert.equal(s.writes.length,1);
});
test('changed valid-looking root requires full existing-root preflight before replacement',async()=>{
    const {s,authority}=setup({preflight:async save=>{if(save.character.name==='unloadable')throw Error('native reference rejected');}});
    await authority.enroll(fixture('A'));
    s.data.set(authority.key,JSON.stringify({schema:1,release:'live',revision:2,current:fixture('unloadable'),previous:null}));
    const before=[...s.data];
    assert.throws(()=>authority.commitPreparedSave(fixture('B')),e=>e.code==='SAVE_AUTHORITY_CHANGED');
    await assert.rejects(authority.importSnapshot(fixture('B')),e=>e.code==='SAVE_AUTHORITY_INVALID');
    assert.deepEqual([...s.data],before);assert.equal(s.writes.length,1);
});
test('full-origin budget includes legacy and archives and preserves all bytes',async()=>{
    const {s,authority}=setup();await authority.enroll(fixture('A'));await authority.capture(fixture('A'));
    s.data.set('unrelated large','x'.repeat(2*1024*1024));const before=[...s.data];
    await assert.rejects(authority.undo(),e=>e.code==='SAVE_STORAGE_FULL');
    assert.deepEqual([...s.data],before);assert.equal(s.writes.length,2);
});
test('actual setItem quota failure leaves prior complete authority byte-identical',async()=>{
    const {s,authority}=setup();await authority.enroll(fixture('A'));await authority.capture(fixture('A'));
    authority.commitPreparedSave(fixture('B'));const before=[...s.data];
    s.setItem=()=>{throw Object.assign(Error('full'),{name:'QuotaExceededError'});};
    await assert.rejects(authority.undo(),e=>e.code==='SAVE_STORAGE_FULL');
    await assert.rejects(authority.importSnapshot(fixture('C')),e=>e.code==='SAVE_STORAGE_FULL');
    assert.deepEqual([...s.data],before);
});
test('injected native durable owner receives exactly one complete root publication',async()=>{
    const s=storage(),seen=[];const authority=createNativeAuthority({storage:s,release:'dev',currentVersion:VERSION,
        ownsSave:()=>true,preflight:async()=>{},writeRoot:(key,bytes)=>{seen.push([key,bytes]);writeGuardedSave(s,key,bytes);}});
    await authority.enroll(fixture('A'));authority.commitPreparedSave(fixture('B'));
    assert.equal(seen.length,2);assert.equal(s.writes.length,2);
    assert.notEqual(nativeAuthorityKey('dev'),nativeAuthorityKey('live'));
    assert.throws(()=>nativeAuthorityKey('save data'));
    assert.equal(JSON.parse(seen[1][1]).current,fixture('B'));
});
test('explicit reset clears recovery in one authority publication without deleting legacy data',async()=>{
    const {s,authority}=setup(),original=hashes(s.data);
    await authority.enroll(fixture('A'));await authority.capture(fixture('A'));
    const count=s.writes.length,root=await authority.resetSnapshot(fixture('fresh host candidate'));
    assert.equal(root.current,fixture('fresh host candidate'));assert.equal(root.previous,null);
    assert.equal(s.writes.length,count+1);assert.equal(root.revision,3);
    assert.deepEqual(hashes(new Map([...s.data].filter(([key])=>key!==authority.key))),original);
    await assert.rejects(authority.undo(),/Keep a backup/);
});

test('enrolled export imports both snapshots with one write and preserved legacy hashes',async()=>{
    const {s,authority,calls}=setup(),before=hashes(s.data);await authority.enroll(fixture('A'));
    const count=s.writes.length;calls.length=0;
    const imported=await authority.importAuthority({p23_native_authority_export:1,release:'live',current:fixture('B'),previous:fixture('C')});
    assert.equal(imported.current,fixture('B'));assert.equal(imported.previous,fixture('C'));assert.deepEqual(calls,['B','C']);assert.equal(s.writes.length,count+1);
    assert.deepEqual(hashes(new Map([...s.data].filter(([key])=>key!==authority.key))),before);
    const root=s.getItem(authority.key);assert.throws(()=>authority.importAuthority({release:'live',current:fixture('B'),previous:{}}),/Unsupported/);assert.equal(s.getItem(authority.key),root);
});
