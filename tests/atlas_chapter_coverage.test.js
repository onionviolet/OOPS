import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
import {readChapterCoverage} from '../prototypes/world-atlas/chapter-coverage.mjs';

test('chapter coverage separates matched, withheld, empty, invalid, missing and unindexed without private text',t=>{
    const directory=mkdtempSync(join(tmpdir(),'atlas-chapter-'));
    t.after(()=>rmSync(directory,{recursive:true,force:true}));
    const write=(name,text)=>writeFileSync(join(directory,name),text);
    write('shard_x_ch001-001.txt','');
    write('xc001m_census.jsonl',[{id:'w.item.public',kind:'item',label:'Public'},
        {id:'w.item.secret',kind:'item',label:'SECRET NAME',sealed:['S1']},
        {id:'w.item.unknown',kind:'item',label:'PRIVATE UNINDEXED'}].map(JSON.stringify).join('\n'));
    write('xc001m_fills.jsonl','');
    write('xc001_rules.jsonl','BROKEN PRIVATE CONTENT');
    write('xc002_rules.jsonl','DO NOT READ OTHER CHAPTER');
    const book={key:'x',world:'w',dir:pathToFileURL(directory).href};
    const digest=digestWorld({world:'w',shards:[{prefix:'xc001',census:[{id:'w.item.public',kind:'item',label:'Public'}]}]});
    const reads=[];
    const result=readChapterCoverage(book,'xc001',{digest,registry:[book],readFile:path=>{reads.push(path);return readFileSync(path);}});
    assert.equal(result.expected,12);
    assert.equal(result.examined,3);
    assert.equal(result.empty,1);
    assert.deepEqual([result.counts.fileRows,result.counts.matchedRows,result.counts.noPublicMatch,result.counts.unindexed,result.counts.parseFailures],[3,1,1,1,1]);
    assert.equal(result.outputs.find(o=>o.kind==='rules').status,'invalid');
    assert.equal(result.outputs.find(o=>o.kind==='scenes').status,'missing');
    assert.equal(reads.length,3);
    assert.equal(new Set(reads).size,3);
    assert.doesNotMatch(JSON.stringify(result),/SECRET|PRIVATE|\.jsonl|w\.item/);
    const limited=readChapterCoverage(book,'xc001',{digest,registry:[book],byteLimit:1});
    assert.equal(limited.status,'limit');
    assert.equal(limited.counts,undefined);
    const completeReads=[];
    const complete=readChapterCoverage(book,'xc001',{digest,registry:[book],byteLimit:1,complete:true,
        readFile:path=>{completeReads.push(path);return readFileSync(path);}});
    assert.equal(complete.measurement,'serial-complete');
    assert.deepEqual(complete.counts,result.counts);
    assert.equal(completeReads.length,3);
    assert.equal(readChapterCoverage(book,'../xc001',{digest}),null);
});
