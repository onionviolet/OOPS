import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {boundedCache} from '../prototypes/world-atlas/bounded-cache.mjs';
import {readKey,readLibrary} from '../prototypes/world-atlas/library-reading.mjs';
import {readFindings,findingsMatrix,buildReaderDigests} from '../prototypes/world-atlas/reader-findings.mjs';

test('metadata cache retains bounded LRU entries and weights, expires and does not retain oversized results',()=>{
    let time=0;const cache=boundedCache({maxEntries:2,maxWeight:10,ttlMs:5,now:()=>time});
    cache.set('a','aa');cache.set('b','bb');assert.equal(cache.get('a'),'aa');cache.set('c','cc');
    assert.equal(cache.get('b'),undefined);assert.deepEqual(cache.stats(),{entries:2,weight:8,maxEntries:2,maxWeight:10});
    assert.equal(cache.set('huge','x'.repeat(100)),'x'.repeat(100));assert.equal(cache.get('huge'),undefined);
    time=5;assert.equal(cache.get('a'),undefined);assert.equal(cache.get('c'),undefined);assert.equal(cache.stats().weight,0);
    assert.throws(()=>cache.set('invalid','x',Infinity));
    for(let n=0;n<100;n++)cache.set(String(n),'x');
    assert.equal(cache.stats().entries,2);assert.ok(cache.stats().weight<=10);
});

function workspace(t){const dir=mkdtempSync(join(tmpdir(),'atlas-archive-scale-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));return dir;}

test('output-only metadata is visible while held source, prepared ranges and pass completion stay absent',t=>{
    const dir=workspace(t),book={key:'x',world:'one',dir:pathToFileURL(dir).href,source:join(dir,'absent.epub')};
    writeFileSync(join(dir,'xc001m_census.jsonl'),'{"id":"one.item.a","kind":"item","label":"Observed","note":"PRIVATE PROSE"}\n');
    writeFileSync(join(dir,'xc001_rules.jsonl'),'{}\n');writeFileSync(join(dir,'xc001_rules.partial'),'PRIVATE MARKER');
    writeFileSync(join(dir,'b4s1m_census.jsonl'),'{}\n');
    const other={...book,key:'y'};
    const library=readLibrary([book,other]),row=library.keys[0];
    assert.equal(row.held,false);assert.equal(row.shards,0);assert.equal(row.complete,false);assert.equal(row.rows,0);
    assert.equal(row.observedOutputFiles,3);assert.equal(row.outputOnly,true);
    assert.equal(library.keys[1].observedOutputFiles,0,'historic directory ownership is not duplicated');
    assert.ok(Object.values(row.passes).every(n=>n===0));
    assert.doesNotMatch(JSON.stringify(library),/PRIVATE|absent\.epub|\.jsonl|atlas-archive-scale-/);
    assert.equal(readKey(book).observedOutputFiles,3);
});

test('isolated-world builder preserves digest bytes, identities and privacy versus the in-process fold',t=>{
    const dir=workspace(t),inputs=join(dir,'input'),output=join(dir,'readers');mkdirSync(inputs);
    const books=[{key:'x',world:'one',dir:pathToFileURL(inputs).href},{key:'y',world:'two',dir:pathToFileURL(inputs).href}];
    const rows={
        'xc001m_census.jsonl':[{id:'one.item.public',kind:'item',label:'Public item'},{id:'one.item.hidden',kind:'item',label:'EARLY HIDDEN'}],
        'xc002m_census.jsonl':[{id:'one.item.hidden',kind:'item',label:'PRIVATE LATE',private:true}],
        'yc001m_census.jsonl':[{id:'two.place.library',kind:'place',label:'Library'}],
    };
    for(const [name,values]of Object.entries(rows))writeFileSync(join(inputs,name),values.map(v=>JSON.stringify(v)).join('\n')+'\n');
    const registry=join(dir,'registry.json');writeFileSync(registry,JSON.stringify({books}));
    const expected=readFindings({registry}),matrix=buildReaderDigests({registry,outDir:output});
    const {buildStats,...counts}=matrix;assert.deepEqual(counts,findingsMatrix(expected));
    assert.equal(buildStats.isolatedWorlds,2);assert.ok(buildStats.maxRssKiB>0);
    for(const digest of expected)assert.equal(readFileSync(join(output,digest.world+'.json'),'utf8'),JSON.stringify(digest));
    assert.deepEqual(readFindings({registry,world:'two'}),expected.filter(d=>d.world==='two'));
    assert.doesNotMatch(JSON.stringify(expected),/EARLY HIDDEN|PRIVATE LATE/,'later private identity stays hidden across the complete world');
});
