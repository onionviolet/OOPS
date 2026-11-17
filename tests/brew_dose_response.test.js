import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {DOSE_CASE_MODULE, DOSE_TERMS, canRunDose, doseResponseCase, doseRouteOf} from '../src/brew_dose_response.js';

const rows = readFileSync(new URL('../docs/coverage/hp_potions.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l))
    .filter(r => r.case?.module === DOSE_CASE_MODULE);

test('every ledger row on the dose-response law runs: account moves, body changes, timed mind effects recover', async () => {
    assert.ok(rows.length >= 30, `rows on the law: ${rows.length}`);
    for (const id of new Set(rows.map(r => r.case.id))) {
        const out = await runCaseData(doseResponseCase(id), {id});
        assert.match(out.state, /^(expressed|runs)-authored$/, `${id}: ${out.state} ${out.detail}`);
    }
});

test('a wrong expectation fails: a remove sentence does not raise vitality', async () => {
    const data = doseResponseCase('dose:remove.vitality.instant.oral');
    data.timeline[1].expect = data.timeline[1].expect.map(e => e.quantity === 'vitality' ? {...e, direction: 'up'} : e);
    assert.equal((await runCaseData(data, {id: 'neg'})).state, 'blocked:runner-expect-mismatch');
});

test('sentences without a body account stay blocked rather than running', () => {
    for (const s of [{verb: 'add', object: 'force'}, {verb: 'add', object: 'lifespan'}, {verb: 'end', object: 'working'}]) assert.equal(canRunDose(s), false);
    assert.throws(() => doseResponseCase('dose:add.force.instant.oral'));
    assert.deepEqual(Object.keys(DOSE_TERMS).sort(), ['add.vitality', 'remove.vitality', 'transform.form', 'transform.mind']);
    assert.deepEqual(doseRouteOf(['inhaled'], undefined), null);
    assert.deepEqual(doseRouteOf(['topical'], 'potion'), {route: 'surface', defaulted: false});
});
