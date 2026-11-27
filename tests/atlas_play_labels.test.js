import test from 'node:test';
import assert from 'node:assert/strict';
import {checkPlayLabels} from '../scripts/check_atlas_play_labels.mjs';
import {PLAYABLE,PARTIAL,READING,routeEvidence} from '../prototypes/world-atlas/play-status.mjs';

const receipt={id:'native-proof',life:'Fang Yuan',action:'Wake in the paid room',build:'a'.repeat(64)};
const row=(id,playStatus,{expected=playStatus,proof,gap}={})=>({
    surface:'Fixture',id,record:{playStatus,playGap:gap},expected,receipt:proof,
});

test('the checker accepts scoped exercise, named missing work and reading records',()=>{
    const result=checkPlayLabels([
        row('played',PLAYABLE,{proof:receipt}),
        row('pending',PARTIAL,{gap:'The earned route back to the inn still needs a replay.'}),
        row('source',READING),
    ]);
    assert.equal(result.checked,3);
    assert.deepEqual(result.mismatches,[]);
});

test('the checker rejects missing or malformed evidence, unnamed gaps and label drift',()=>{
    const result=checkPlayLabels([
        row('missing',PLAYABLE),
        row('life',PLAYABLE,{proof:{...receipt,life:''}}),
        row('action',PLAYABLE,{proof:{...receipt,action:''}}),
        row('build',PLAYABLE,{proof:{...receipt,build:'latest'}}),
        row('gap',PARTIAL,{gap:' '}),
        row('mirror',READING,{expected:PLAYABLE,proof:receipt}),
        row('false-negative',READING,{proof:receipt}),
    ]);
    assert.deepEqual(result.mismatches.map(x=>x.id),['missing','life','action','build','gap','mirror','false-negative']);
});

test('only the exact card with exercised scope can qualify a linked result',()=>{
    const report={entries:[{id:'paid-inn',playReceipt:receipt},{id:'other',status:'verified'}]};
    assert.equal(routeEvidence(report,'#workbench/play-evidence/paid-inn'),receipt);
    assert.equal(routeEvidence(report,'#workbench/play-evidence/paid-inn/unverified-branch'),undefined);
    assert.equal(routeEvidence(report,'#workbench/play-evidence/other'),undefined);
});
