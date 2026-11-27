import test from 'node:test';
import assert from 'node:assert/strict';
import {createUnindexedExplanation} from '../prototypes/world-atlas/output-unindexed.mjs';

test('unindexed diagnostics reconcile by fixed reason, kind and their intersection without source values',()=>{
    const targets=id=>id==='known'?['rules']:id==='collision'?['entities','rules']:[];
    const explanation=createUnindexedExplanation('census',targets);
    for(const row of [{id:'known',kind:'ability'},{id:'unknown',kind:'note'},{id:'collision',kind:'spell'},
        {kind:'private SOURCE TEXT'},{id:'absent',kind:{secret:'raw'}},{id:'untyped'}])explanation.observe(row);
    const result=explanation.snapshot();assert.equal(result.total,6);
    for(const rows of [result.reasons,result.kinds,result.groups])assert.equal(rows.reduce((n,r)=>n+r.rows,0),6);
    assert.deepEqual(result.reasons.map(r=>[r.id,r.rows]),[['identity-not-qualified',1],['missing-identity',1],['multiple-public-targets',1],['no-public-identity',3]]);
    assert.equal(result.kinds.find(r=>r.id==='unrecognized').rows,2);
    assert.doesNotMatch(JSON.stringify(result),/SOURCE TEXT|secret|unknown|collision|untyped/);
    const snapshot=explanation.snapshot();snapshot.groups[0].rows=999;assert.notEqual(explanation.snapshot().groups[0].rows,999);
});

test('non-ID contracts use qualified structured-match reasons and scenes use beat identity',()=>{
    for(const [kind,expected]of [['other','observation-not-qualified'],['services','life-not-qualified'],['news','life-not-qualified'],['customs','life-not-qualified']]){
        const exp=createUnindexedExplanation(kind,()=>{throw Error('not an identity contract');});exp.observe({what:'PRIVATE prose',kind:'note'});
        assert.equal(exp.snapshot().reasons[0].id,expected);assert.doesNotMatch(JSON.stringify(exp.snapshot()),/PRIVATE prose/);
    }
    const scene=createUnindexedExplanation('scenes',id=>id==='beat'?['entities']:[]);scene.observe({beat:'beat'});
    assert.equal(scene.snapshot().reasons[0].id,'different-family');
    assert.equal(createUnindexedExplanation('fills',()=>[]).snapshot().total,0);
});
