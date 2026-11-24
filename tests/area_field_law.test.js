import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {AREA_ANCHORS, AREA_TERMS, AREA_TIMES, AREA_WHO, areaCase, areaCaseId, canRunArea} from '../src/area_field_law.js';

test('every term runs under every time, anchor and who', async () => {
    for (const term of Object.keys(AREA_TERMS)) for (const time of AREA_TIMES) for (const anchor of AREA_ANCHORS) for (const who of AREA_WHO) {
        const [verb, object] = term.split('.'), id = areaCaseId({verb, object, time}, anchor, who);
        if (term === 'add.thing' && time === 'sustained') {
            assert.throws(() => areaCase(id));
            continue;
        }
        const out = await runCaseData(areaCase(id), {id});
        assert.equal(out.state, 'expressed-authored', `${id}: ${out.detail}`);
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
    for (const s of [{verb: 'add', object: 'force'}, {verb: 'alter', object: 'mind'}, {verb: 'remove', object: 'vitality', time: 'none'}]) assert.equal(canRunArea(s), false);
    assert.equal(canRunArea({verb: 'remove', object: 'vitality', time: 'sustained'}), true);
    assert.throws(() => areaCase('area:add.force.instant.place.everyone'));
});

test('a delayed pulse counts from storage and still fires once after restore', async () => {
    const id = 'area:add.heat.delayed.place.everyone', data = areaCase(id);
    data.world.clock = 51;
    for (const step of data.timeline) if (step.advanceTo != null) step.advanceTo += data.world.clock;
    const result = await runCaseData(data, {id});
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('a triggered field accepts its chosen word once', async () => {
    const id = 'area:add.heat.triggered.holder.marked';
    const data = areaCase(id, {trigger: {kind: 'word', word: 'open'}});
    const result = await runCaseData(data, {id});
    assert.equal(result.state, 'expressed-authored', result.detail);
});
