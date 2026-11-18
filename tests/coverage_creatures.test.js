import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {guCatalogue} from '../src/gu_catalogue.js';
import {computeLedgers, readLedgers, runCaseData} from '../scripts/coverage_report.mjs';
import {coverageCase} from '../src/world_packs/meadow_lantern_coverage.js';
import {GU_DIET_DEFAULTS} from '../src/world_packs/gu_diet_defaults.js';

test('creatures ledger computes stated and authored diets and keeps the unresolved fields', async () => {
    const rows = readFileSync(new URL('../docs/coverage/creatures.jsonl', import.meta.url), 'utf8')
        .trimEnd().split('\n').map(line => JSON.parse(line));
    const gu = rows.filter(row => row.mechanisms.includes('G') && row.id !== 'insight-moth');
    assert.equal(rows.find(row => row.id === 'insight-moth').typed, 'runs-authored'); // PSA25: no case, so catalogued with the old label kept
    assert.equal(rows.length, 99);
    assert.equal(gu.length, 81);
    assert.equal(rows.filter(row => row.typed === 'runs-authored').length, 17);
    assert.deepEqual(gu.map(row => row.id).sort(), Object.keys(guCatalogue).sort());
    for (const row of gu) {
        const diet = guCatalogue[row.id].body.diet;
        const unknown = /^.*unknown fields: ([^;]+)/.exec(row.note)?.[1].split(', ') ?? [];
        assert.ok(unknown.includes('stageMinutes'), row.id);
        assert.ok(unknown.includes('lifespan'), row.id);
        // GKM440: a stated food wins; every other catalogue Gu runs on its authored mechanism default.
        const fallback = GU_DIET_DEFAULTS[row.id];
        assert.equal(Boolean(fallback), !diet, `${row.id} has exactly one diet source`);
        assert.equal(unknown.includes('diet'), false, row.id);
        assert.equal(row.state, 'expressed-authored', row.id);
        assert.equal(row.case?.id, row.id, row.id);
        if (diet) assert.ok(row.note.includes(`diet ch. ${diet.chapters.join(', ')}`), row.id);
        else assert.ok(row.note.includes(`diet authored (GKM440, ${fallback.basis}): ${fallback.food.join(' and ')}`), row.id);
    }
    assert.ok(Object.values(GU_DIET_DEFAULTS).every(row => row.reason && row.cost && row.food.length), 'each default has a reason and a cost');
    assert.ok(Object.values(GU_DIET_DEFAULTS).every(row => row.food.every(food => !/primeval (essence|stone)/i.test(food))), 'food is not activation fuel (GKM439)');
    const ledger = readLedgers().find(({name}) => name === 'creatures');
    assert.deepEqual(ledger.problems, []);
    const {computed, problems} = await computeLedgers([ledger]);
    assert.deepEqual(problems, []);
    assert.equal(computed.get('creatures').size, 82);
    assert.equal(computed.get('creatures').get('sheep').state, 'expressed-authored');
});

test('the creature timeline rejects an incorrect wisp parent after reload', async () => {
    const data = coverageCase('lantern-fleece.moon-veil');
    const glow = data.timeline.find(step => step.id === 'wisp-lights-barn');
    glow.expect.find(outcome => outcome.creationParents).to = ['ewe'];
    assert.deepEqual(await runCaseData(data), {
        state: 'blocked:runner-expect-mismatch',
        detail: 'wisp-lights-barn: the world did not change as step expect says',
    });
});
