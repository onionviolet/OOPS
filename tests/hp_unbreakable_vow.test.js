import assert from 'node:assert/strict';
import test from 'node:test';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {coverageCase} from '../src/world_packs/hp_unbreakable_vow.js';

test('a refused clause leaves no duty, a kept clause is harmless, and a missed clause ends casting after restore', async () => {
    const data = coverageCase('vow');
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
    const early = structuredClone(data);
    early.timeline.find(step => step.id === 'refuse').sealVowClause.assent.accepted = true;
    assert.equal((await runCaseData(early)).state, 'blocked:runner-expect-mismatch');
});

test('a distant or unarmed Bonder cannot seal an accepted clause or spend effort', async () => {
    for (const [ops, refusal] of [
        [[{op: 'move', holder: 'bonder', to: 'hall'}], 'participants-unavailable'],
        [[{op: 'property', holder: 'wand', property: 'marks', value: []}], 'bonder-wand-unavailable'],
    ]) {
        const data = coverageCase('vow');
        data.world.holders.push({id: 'hall', kind: 'place'});
        const correct = data.timeline.find(step => step.id === 'agree');
        data.timeline.unshift({id: 'lose-means', ops}, {id: 'refused-seal', sealVowClause: correct.sealVowClause,
            refusal, expect: [{holder: 'bonder', quantity: 'stamina', direction: 'unchanged', to: 6}]},
        {id: 'recover-means', ops: [{op: 'move', holder: 'bonder', to: 'room'},
            {op: 'property', holder: 'wand', property: 'marks', value: ['grip:bonder']}]});
        assert.equal((await runCaseData(data)).state, 'expressed-authored', refusal);
    }
});

test('changing an assented deadline without asking again leaves the clause unbound', async () => {
    const data = coverageCase('vow');
    const agreed = data.timeline.find(step => step.id === 'agree');
    data.timeline.unshift({id: 'changed-clause',
        sealVowClause: {...agreed.sealVowClause, clause: {...agreed.sealVowClause.clause, by: 2}},
        refusal: 'clause-not-assented'});
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('a working that finishes at the second deadline keeps the clause after restore', async () => {
    const data = coverageCase('vow');
    const light = data.timeline.find(step => step.id === 'light').working;
    const due = data.timeline.findIndex(step => step.id === 'missed-duty');
    data.timeline.splice(due, data.timeline.length - due,
        {id: 'start-second-duty', working: {...light, id: 'second-light', method: 'vow.second',
            spells: light.spells.map(spell => ({...spell, minutes: 2}))}},
        {id: 'restore-pending-duty', restore: true},
        {id: 'deadline', advanceTo: 5, expect: [
            {holder: 'vower', quantity: 'vitality', direction: 'unchanged', to: 10},
            {holder: 'vower', quantity: 'stamina', direction: 'down', to: 4},
        ]},
        {id: 'after-deadline', advanceTo: 9});
    data.expect = data.expect.filter(row => row.holder !== 'vower');
    data.expect.find(row => row.quantity === 'light:wand').to = 40;
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});
