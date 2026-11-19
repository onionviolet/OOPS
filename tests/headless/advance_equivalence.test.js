// Outside the ordinary unit glob (boots the whole game). Run explicitly:
//   node --test tests/headless/advance_equivalence.test.js
// Same save and seed advanced three ways must give the same canonical save: one call,
// 60-minute chunks, and a day at a time. Differences are named by path, never normalised.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {boot, canonicalSave, diffSaves, ROOT} from '../../scripts/headless/runner.mjs';
import {advanceGame, minutesToNextEvent} from '../../scripts/headless/advance.mjs';
import {scenarioSave} from '../../scripts/headless/scenarios.mjs';
import {join} from 'node:path';

const DAYS = Number(process.env.ADVANCE_DAYS || 2);
const save = await readFile(join(ROOT, 'tests/fixtures/perf/fresh.json'), 'utf8');
const inputBytes = canonicalSave(save);

async function run(plan) {
    const game = await boot(save, {seed: 5});
    try {
        let receipts = [];
        for(const step of plan) receipts.push(await advanceGame(game, step));
        return {snap: game.snapshot(), receipts, clock: game.internals.expansionState.clock};
    } finally {game.close();}
}

test('one call, 60-minute chunks and day-by-day give the same save', async t => {
    const once = await run([{days: DAYS, chunk: 1440}]);
    const chunked = await run([{days: DAYS, chunk: 60}]);
    const daily = await run(Array.from({length: DAYS}, () => ({days: 1, chunk: 240})));
    for(const [name, other] of [['60-minute chunks', chunked], ['day by day', daily]]) {
        const diffs = diffSaves(canonicalSave(once.snap), canonicalSave(other.snap));
        assert.deepEqual(diffs, [], `${name} differs from one call at: ${diffs.map(d => d.path).join(', ')}`);
    }
    assert.equal(canonicalSave(save), inputBytes, 'input save text is untouched');
    t.diagnostic(`once: ${JSON.stringify(once.receipts[0])}`);
});

test('until-event stops at the engine boundary', async () => {
    const game = await boot(save, {seed: 5});
    try {
        const want = await minutesToNextEvent(game);
        const r = await advanceGame(game, {untilEvent: true});
        if(want == null) assert.equal(r.reason, 'no scheduled event');
        else assert.ok(r.advanced >= want, `advanced ${r.advanced} of ${want}`);
    } finally {game.close();}
});

test('a deed published at batch close is included in the durable Reports tail across chunk sizes', {
    skip: !existsSync(join(ROOT, 'private_packs/lotm-cast')),
}, async () => {
    const fixture = await scenarioSave('lotm-tingen-day3');
    const saved = [];
    for(const chunk of [60, 120]) {
        const game = await boot(fixture, {seed: 1});
        try {
            await game.step(240, {chunk});
            const durable = JSON.parse(game.storage.getItem('save data'));
            assert.deepEqual(durable.reports_dock, game.snapshot().reports_dock);
            assert.ok(durable.reports_dock.lines.some(line => line.startsWith('Deed done:')));
            saved.push(canonicalSave(durable));
        } finally {game.close();}
    }
    assert.deepEqual(diffSaves(...saved), []);
});
