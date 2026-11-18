import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {AREA_ANCHORS, AREA_TERMS, AREA_TIMES, AREA_WHO, areaCase, areaCaseId, canRunArea} from '../src/area_field_law.js';

test('every term runs under every time, anchor and who', async () => {
    for (const term of Object.keys(AREA_TERMS)) for (const time of AREA_TIMES) for (const anchor of AREA_ANCHORS) for (const who of AREA_WHO) {
        const [verb, object] = term.split('.'), id = areaCaseId({verb, object, time}, anchor, who);
        assert.match((await runCaseData(areaCase(id), {id})).state, /^expressed-authored$/, id);
    }
});

test('a wrong expectation fails: an aura follows its holder, a marked field skips the unmarked, a spent field stays quiet', async () => {
    const aura = areaCase('area:remove.vitality.instant.holder.everyone');
    aura.timeline.find(s => s.id === 'cast').expect = [{holder: 'outside', quantity: 'vitality', direction: 'down'}];
    assert.equal((await runCaseData(aura, {id: 'neg1'})).state, 'blocked:runner-expect-mismatch');
    const marked = areaCase('area:remove.vitality.instant.place.marked');
    marked.timeline.find(s => s.id === 'cast').expect = [{holder: 'bystander', quantity: 'vitality', direction: 'down'}];
    assert.equal((await runCaseData(marked, {id: 'neg2'})).state, 'blocked:runner-expect-mismatch');
    const spent = areaCase('area:add.heat.instant.place.everyone');
    spent.timeline.find(s => s.id === 'again').expect = [{holder: 'inside', quantity: 'temperature', direction: 'up'}];
    assert.equal((await runCaseData(spent, {id: 'neg3'})).state, 'blocked:runner-expect-mismatch');
});

test('sentences with no world account and times with no pulse model stay unrun', () => {
    for (const s of [{verb: 'add', object: 'force'}, {verb: 'alter', object: 'mind'}, {verb: 'remove', object: 'vitality', time: 'triggered'}]) assert.equal(canRunArea(s), false);
    assert.equal(canRunArea({verb: 'remove', object: 'vitality', time: 'sustained'}), true);
    assert.throws(() => areaCase('area:add.force.instant.place.everyone'));
});
