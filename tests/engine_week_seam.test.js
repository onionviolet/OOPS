// E21 at the seam (proposal), split from tests/engine_game_seam.test.js: the engine alone, no game boot, a week of
// the seam timeline in one jump against the away bank's sixty-minute spends. Findings:
// docs/gm/dispatch/foundation-run-2026-11-12/W18_GAME_SEAM.md.
//   YAIRPG_SEAM_WEEK=1 also settles the week minute by minute (several minutes of wall time).
import test from 'node:test';
import assert from 'node:assert/strict';
import {DAY, createClockBridge, createSeamEngine, saveText, seamTimeline} from './fixtures/engine_game_seam.mjs';

const WEEK = 7 * DAY, FULL_WEEK = process.env.YAIRPG_SEAM_WEEK === '1';

test('E21 at the seam: an engine week in one jump, in the bank\'s sixty-minute spends, and what it costs', t => {
    const rows = seamTimeline(0, {days: 7});
    const run = stops => { const b = createClockBridge({engine: createSeamEngine(0), timeline: rows}); for (const stop of stops) b.sync(stop); return b; };
    const every = step => Array.from({length: WEEK / step}, (_, i) => (i + 1) * step);
    const day = run([DAY]), jump = run([WEEK]), spends = run(every(60));
    const whole = saveText(jump.engine);
    assert.equal(saveText(spends.engine), whole, '168 spends of sixty minutes equal one jump');
    if (FULL_WEEK) {
        const minutes = run(every(1));
        assert.equal(saveText(minutes.engine), whole, 'a week minute by minute equals one jump');
        t.diagnostic(`engine week minute by minute: ${(minutes.stats.ms / 1000).toFixed(1)} s, ${minutes.stats.segments} segments`);
    }
    // CURRENT BEHAVIOUR, written down so a change shows: records keep every receipt, so the save and the
    // time per day both grow with the days played. The ward alone writes a receipt every fifteen minutes.
    const ward = jump.engine.records.stored['gate.ward'];
    assert.equal(ward.receipts.length, WEEK / 15);
    assert.ok(whole.length > 2 * saveText(day.engine).length, 'the week save is more than twice the day save');
    assert.ok(jump.stats.ms > 7 * day.stats.ms, 'a week costs more than seven days');
    assert.ok(jump.stats.ms < 120_000, 'stated budget for this probe: a week away settles inside two minutes');
    t.diagnostic(`engine day: ${day.stats.segments} segments, ${day.stats.ms.toFixed(0)} ms, ${saveText(day.engine).length} characters; `
        + `week in one jump: ${jump.stats.segments} segments, ${(jump.stats.ms / 1000).toFixed(1)} s, ${whole.length} characters; `
        + `week in 60-minute spends: ${spends.stats.segments} segments, ${(spends.stats.ms / 1000).toFixed(1)} s`);
});
