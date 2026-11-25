import {test} from 'node:test';
import assert from 'node:assert/strict';
import {landingRecord} from '../scripts/effect_landing_count.mjs';
import {ENTRY_POINTS} from '../src/played_effects_domain.js';
import {coverageCase} from '../src/world_packs/gu_effect_pack.js';

test('the landing counter attaches the reviewed row key to a Moonblade landing', () => {
    const row = {law: 'gu-working', entry: 'keeper-moonblade-hunt', changed: true};
    assert.deepEqual(landingRecord(row), {...row, ledgerKey: 'gu_kinds:moonlight'});
    const played = ENTRY_POINTS.find(point => point.entry === row.entry).build().steps[0].sentence;
    const covered = coverageCase('moonlight').sentence;
    for (const field of ['verb', 'object', 'target', 'time', 'carrier', 'limits']) assert.deepEqual(played[field], covered[field]);
    assert.equal(played.cost, 'none', 'the native action pays before this adapter lands');
});

test('a keyless entry keeps its original landing record', () => {
    const row = {law: 'layered-ward', entry: 'gu-house-ward', changed: true};
    assert.equal(landingRecord(row), row);
    assert.equal(Object.hasOwn(landingRecord(row), 'ledgerKey'), false);
});
