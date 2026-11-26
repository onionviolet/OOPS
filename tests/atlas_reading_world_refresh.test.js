import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld,findingsMatrix} from '../prototypes/world-atlas/reader-findings.mjs';
import {replaceWorldFindings} from '../prototypes/world-atlas/refresh-reading-world.mjs';

test('refresh replaces just the selected findings and requires a full build when columns change',()=>{
    const a=digestWorld({world:'a',shards:[]}),b=digestWorld({world:'b',shards:[]});
    const base={builtAt:'old',books:{},findings:findingsMatrix([a,b])};
    const fresh={...a,planned:3};
    const result=replaceWorldFindings(base,fresh);
    assert.equal(result.findings.worlds[0].planned,3);
    assert.deepEqual(base.findings.worlds[0],findingsMatrix([a]).worlds[0]);
    assert.equal(result.findings.worlds[1],base.findings.worlds[1]);
    assert.equal(result.books,base.books);
    assert.throws(()=>replaceWorldFindings({...base,findings:{...base.findings,columns:[]}},fresh),/full Atlas build/);
    assert.throws(()=>replaceWorldFindings(base,{...a,world:'new'}),/already present/);
});
