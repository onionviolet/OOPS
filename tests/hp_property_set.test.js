import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {HP_PROPERTY_MODULE, hpMaterialRow, materialCase} from '../src/hp_property_set.js';

const rows = readFileSync(new URL('../docs/coverage/hp_ingredients.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l))
    .filter(r => r.case?.module === HP_PROPERTY_MODULE);

test('every material row in the Hogwarts property set runs: stated axes reach the flask in proportion to level', async () => {
    assert.ok(rows.length >= 90, `rows: ${rows.length}`);
    for (const id of new Set(rows.map(r => r.case.id))) {
        const out = await runCaseData(materialCase(id), {id});
        assert.match(out.state, /^(expressed|runs)-authored$/, `${id}: ${out.state} ${out.detail}`);
    }
});

test('an axis or level outside the set is not a material row; shares never exceed the whole', () => {
    assert.equal(hpMaterialRow([{axis: 'sparkle', level: 'strong'}]), null);
    assert.equal(hpMaterialRow([{axis: 'venom', level: 'huge'}]), null);
    const all = hpMaterialRow([{axis: 'venom', level: 'strong'}, {axis: 'mend', level: 'strong'}, {axis: 'ward', level: 'strong'}]);
    assert.ok(Object.values(all).reduce((a, b) => a + b, 0) <= 1000);
});

test('a wrong expectation fails: a strong axis is not absent from the flask', async () => {
    const data = materialCase('material:venom.strong');
    data.timeline[1].expect = data.timeline[1].expect.map(e => e.holder === 'flask' ? {...e, direction: 'unchanged', to: 0} : e);
    assert.equal((await runCaseData(data, {id: 'neg'})).state, 'blocked:runner-expect-mismatch');
});
