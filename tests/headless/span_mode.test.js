// Outside the ordinary unit glob (boots the whole game). Run: node --test tests/headless/span_mode.test.js
// Span mode (runner.spans) is a separate, faster mode, not RT8. On the Tingen scenario it must give the same
// clock and the same kernel/world state as single ticks; only native per-minute idle passives may differ.
// Village-local life draws one random stream cell per minute, so span mode is NOT equivalent there (documented
// in docs/tools/HEADLESS_STEP_SPEED_2026-11-18.md); use single ticks for the Village.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {boot, canonicalSave, diffSaves, ROOT} from '../../scripts/headless/runner.mjs';
import {scenarioSave} from '../../scripts/headless/scenarios.mjs';

const MINUTES = 180;
// Paths a skipped native tick may change: idle skill XP and its tracked records.
const PASSIVE = /^\/(levels\/person\/main_character\/skill_xp|skillRecords\/tracked)\//;
const have = existsSync(join(ROOT, 'private_packs/lotm-cast'));

test('span mode keeps the clock and kernel state of single ticks (Tingen)', {skip: !have && 'needs private_packs/lotm-cast'}, async () => {
    const save = await scenarioSave('lotm-tingen-day3');
    const run = async mode => {
        const game = await boot(save, {seed:3});
        try {
            mode === 'span' ? await game.spans(MINUTES) : await game.step(MINUTES);
            return {snap:canonicalSave(game.snapshot()), clock:game.internals.expansionState.clock, errors:game.errors.length};
        } finally {game.close();}
    };
    const ticks = await run('ticks'), span = await run('span');
    assert.equal(span.clock, ticks.clock);
    assert.equal(span.errors, 0);
    const diffs = diffSaves(ticks.snap, span.snap, 200).filter(d => !PASSIVE.test(d.path));
    assert.deepEqual(diffs, [], 'only native idle passives may differ');
});
