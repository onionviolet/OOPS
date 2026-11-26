import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,readdirSync,unlinkSync,rmdirSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {readOutputRecords} from '../prototypes/world-atlas/output-records.mjs';
import {readMentionRange} from '../prototypes/world-atlas/output-mention-range.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(t){
    const directory=mkdtempSync(join(tmpdir(),'atlas-mentions-')),manifestDirectory=join(directory,'manifests');mkdirSync(manifestDirectory);
    t.after(()=>{for(const name of readdirSync(manifestDirectory))unlinkSync(join(manifestDirectory,name));rmdirSync(manifestDirectory);for(const name of readdirSync(directory))unlinkSync(join(directory,name));rmdirSync(directory);});
    const book={key:'x',world:'w',book:1,lang:'en',dir:pathToFileURL(directory).href},prefix='xc001',name='index_x_b1_ch001-002.json',indexPath=join(directory,name);
    const index=[{book:1,chapter:1,paragraphs:5},{book:1,chapter:2,paragraphs:8}],indexBytes=JSON.stringify(index);writeFileSync(indexPath,indexBytes);
    const manifest={schema:'atlas-archive-transfer/1',phase:'authentic-indexes',status:'verified',registeredDirs:[book.dir],files:[{name,status:'verified',bytes:Buffer.byteLength(indexBytes),sha256:sha(indexBytes),destinations:[{path:indexPath,sha256:sha(indexBytes),status:'restored'}]}]};
    const manifestPath=join(manifestDirectory,'INDEX_DIRECTORY_aa.json');writeFileSync(manifestPath,JSON.stringify(manifest));
    const raw={id:'w.ability.light',kind:'ability',label:'PRIVATE RAW LABEL',note:'PRIVATE RAW PROSE',firstMention:'en b1 c2 p8'};
    const rule={id:raw.id,kind:'ability',name:'Public light',sources:[{locator:'en b1 c3 p1'}]};
    const digest={world:'w',entities:[],rules:[rule],scenes:[],fills:[],orphanInputs:[]};
    const write=rows=>{const bytes=rows.map(r=>JSON.stringify(r)).join('\n');writeFileSync(join(directory,prefix+'m_census.jsonl'),bytes);digest.orphanInputs=[{key:book.key,prefix,pass:'census',kind:'census',source:'canonical',contentHash:'sha256:'+sha(bytes)}];};write([raw]);
    const run=(query={},override={})=>readOutputRecords(book,{prefix,pass:'census',kind:'census',...query},{directory,registry:[book],digest,mentionManifestDirectory:manifestDirectory,...override});
    return {directory,manifestDirectory,book,prefix,indexPath,indexBytes,manifest,manifestPath,raw,rule,digest,write,run};
}

test('verified restored range enables only on-demand mention references, independent of exact-match counts and field coverage',t=>{
    const f=fixture(t),plain=f.run(),page=f.run({mentions:true});
    assert.equal(plain.mentionReferences,undefined);assert.equal(f.run({mentions:'true'}).mentionReferences,undefined);
    assert.equal(page.mentionReferences.status,'available');assert.equal(page.mentionReferences.total,1);
    assert.deepEqual(page.counts,plain.counts);assert.deepEqual(page.records,plain.records);assert.deepEqual(page.fieldCoverage,plain.fieldCoverage);
    assert.equal(page.counts.unindexed,1);assert.equal(page.counts.matchedRows,0);
    const ref=page.mentionReferences.records[0];assert.equal(ref.label,'Public light');assert.equal(ref.href,'#world/w/things/w.ability.light');assert.deepEqual(ref.locators,['en b1 c2 p8']);assert.deepEqual(ref.fileLines,[[1,1]]);
    assert.doesNotMatch(JSON.stringify(page),/PRIVATE|atlas-mentions|INDEX_DIRECTORY|\.jsonl/);
    f.digest.rules[0].kind='spell';f.digest.rules[0].id='w.spell.light';f.write([{...f.raw,id:'w.spell.light',kind:'spell'}]);assert.equal(f.run({mentions:true}).mentionReferences.records[0].href,'#world/w/making/working%3Aw.spell.light');
});

test('strict mention eligibility rejects privacy, kind/world/identity mismatches, ambiguous families and invalid locators',t=>{
    const f=fixture(t),base=structuredClone(f.digest),rejected=[
        {raw:{...f.raw,private:true}},{raw:{...f.raw,scope:'private'}},{raw:{...f.raw,sealed:['S1']}},
        {raw:{...f.raw,kind:'note'}},{raw:{...f.raw,firstMention:'en b1 c2 p9'}},{raw:{...f.raw,firstMention:'en b2 c2 p1'}},
        {raw:{...f.raw,firstMention:'en b1 c3 p1'}},{raw:{...f.raw,firstMention:'bad'}},
        {raw:{...f.raw,id:'w.ability.other'}},
        {rules:[{...f.rule,id:'w.note.light'}],raw:{...f.raw,id:'w.note.light'}},
        {rules:[{...f.rule,private:true}]},{rules:[{...f.rule,scope:'private'}]},{rules:[{...f.rule,sealed:['S1']}]},
        {rules:[f.rule,f.rule]},{rules:[{...f.rule,name:'file:///private/unsafe'}]},
        {rules:[{...f.rule,sources:[]}]},{rules:[{...f.rule,sources:[{locator:'en b1 c1 p1'}]}]},
        {rules:[{...f.rule,sources:[{locator:'en b1 c3 p1',private:true}]}]},
        {rules:[{...f.rule,id:'foreign.ability.light'}],raw:{...f.raw,id:'foreign.ability.light'}},
        {scenes:[{id:f.raw.id}]},{fills:[{id:f.raw.id}]},{entities:[{id:f.raw.id,kind:'item',col:'items',label:'Public collision'}]},
    ];
    for(const change of rejected){Object.assign(f.digest,structuredClone(base),Object.fromEntries(Object.entries(change).filter(([k])=>k!=='raw')));f.write([change.raw||f.raw]);const plain=f.run(),mentioned=f.run({mentions:true});assert.equal(mentioned.mentionReferences.total,0,JSON.stringify(change));assert.deepEqual(mentioned.counts,plain.counts);}
});

test('range metadata fails closed for byte drift, absent or duplicate ownership and unsupported scope',t=>{
    const f=fixture(t),range=()=>readMentionRange(f.book,f.prefix,{directory:f.directory,manifestDirectory:f.manifestDirectory});
    assert.equal(range().status,'verified');assert.equal(range().contains('en b1 c1 p1'),true);assert.equal(range().contains('en b1 c2 p8'),true);assert.equal(range().contains('en b1 c2 p9'),false);
    writeFileSync(f.indexPath,f.indexBytes+' ');assert.equal(f.run({mentions:true}).mentionReferences.status,'unavailable');writeFileSync(f.indexPath,f.indexBytes);
    const duplicate=structuredClone(f.manifest);duplicate.files.push(duplicate.files[0]);writeFileSync(f.manifestPath,JSON.stringify(duplicate));assert.equal(range().status,'unavailable');
    writeFileSync(f.manifestPath,JSON.stringify({...f.manifest,registeredDirs:[]}));assert.equal(range().status,'unavailable');
    const wrongDestination=structuredClone(f.manifest);wrongDestination.files[0].destinations[0].path=join(f.directory,'other.json');writeFileSync(f.manifestPath,JSON.stringify(wrongDestination));assert.equal(range().status,'unavailable');
    writeFileSync(f.manifestPath,JSON.stringify(f.manifest));f.book.lang='zh';assert.equal(range().status,'unavailable');f.book.lang='en';
    const duplicatePath=join(f.directory,'index_x_b1_ch001-003.json');writeFileSync(duplicatePath,'[]');assert.equal(range().status,'unavailable');unlinkSync(duplicatePath);
    writeFileSync(join(f.directory,'xc001m_census.jsonl'),'{}');assert.equal(f.run({mentions:true}).inspected,false);assert.equal(f.run({mentions:true}).mentionReferences,undefined);
});

test('mention pagination covers all eligible public targets once while source-row and match counts remain independent',t=>{
    const f=fixture(t),rows=Array.from({length:32},(_,i)=>({...f.raw,id:'w.ability.light'+i}));f.digest.rules=rows.map((r,i)=>({...f.rule,id:r.id,name:'Public '+String(i).padStart(2,'0')}));f.write([...rows,rows[0]]);
    const refs=[];for(const offset of [0,15,30]){const p=f.run({mentions:true,mentionOffset:offset});assert.equal(p.mentionReferences.total,32);assert.equal(p.mentionReferences.eligibleRows,33);assert.equal(p.counts.unindexed,33);refs.push(...p.mentionReferences.records);}
    assert.equal(refs.length,32);assert.equal(new Set(refs.map(r=>r.href)).size,32);assert.equal(refs[0].fileLines.length,2);
    assert.equal(f.run({mentions:true,mentionOffset:999}).mentionReferences.offset,30);
});
