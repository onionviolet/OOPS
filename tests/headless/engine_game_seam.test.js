// E23 seam probe (proposal): the engine world saved and restored inside a real game save and driven by
// the game's clock, headless, with no interface. A probe, not a feature: nothing in src/ is touched and
// the game does not load the engine. Where the game cannot do a step today the test asserts what it does
// instead, so the gap is written down. Findings: docs/gm/dispatch/foundation-run-2026-11-12/W18_GAME_SEAM.md.
//
// Boots the whole game once (scripts/headless/runner.mjs), about a minute in all.
//   node --test tests/headless/engine_game_seam.test.js
//   YAIRPG_SEAM_WEEK=1 also spends a whole banked week through the game's own away bank and settles the
//   engine week minute by minute (several minutes of wall time).
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot, SAVE_KEY} from '../../scripts/headless/runner.mjs';
import {bindingState, defineBinding} from '../../src/binding.js';
import {chargeAt} from '../../src/stored_working.js';
import {engineReceipts} from '../../src/engine_world.js';
import {DAY, createClockBridge, createSeamEngine, engineSkyAt, restoreSeamEngine, saveText, seamTimeline} from '../fixtures/engine_game_seam.mjs';

const SEED = 23, WEEK = 7 * DAY, FULL_WEEK = process.env.YAIRPG_SEAM_WEEK === '1';
// The key the probe uses for its slice. `expansion` is the one part of the save the game hands on whole.
const SLICE = 'engineWorld';
const decodeFile = encoded => { // src/save_files.js encodeSaveFile, read back without loading the game's modules twice
    assert.ok(encoded.startsWith('YAIR-UTF8-1:'));
    return JSON.parse(Buffer.from(encoded.slice('YAIR-UTF8-1:'.length), 'base64').toString('utf8'));
};
const statuses = engine => Object.fromEntries(Object.entries(engine.records.workings).map(([id, w]) => [id, w.record.status]));

test('E23: the engine world rides a real game save and follows the game clock', async t => {
    const game = await boot(null, {seed: SEED});
    t.after(() => game.close());
    const root = () => game.internals.expansionState.clock;
    const clean = label => { assert.deepEqual(game.errors, [], label); assert.equal(game.internals.is_loading_error, false, label); assert.ok(!game.internals.expansionError, label); };
    const fresh = await game.save();
    const r0 = root(), calendarOffset = game.minutes() - r0;
    const timeline = seamTimeline(r0);
    // One engine jump from the start to a root minute: the answer every driven run is compared with.
    const jumpTo = (minute, rows = timeline) => { const b = createClockBridge({engine: createSeamEngine(r0), timeline: rows}); b.sync(minute); return b; };
    let bridge = createClockBridge({engine: createSeamEngine(r0), timeline});
    let sliceText, base;

    await t.test('1. a fresh save from the game: version fields, whole-minute clock, no checksum', () => {
        assert.match(fresh['game version'], /^v\d+(\.\d+)+$/, 'the save version is the release string; a newer one is refused on load');
        assert.equal(fresh.fork_schema, 1);
        assert.ok(Number.isSafeInteger(fresh.expansion.schema), 'the expansion slice has its own integer schema with migrations');
        assert.ok(Number.isSafeInteger(fresh.expansion.clock) && fresh.expansion.clock === r0, 'the root clock is whole minutes');
        assert.deepEqual([fresh['current time'].hour, fresh['current time'].minute, calendarOffset], [8, 0, DAY + 8 * 60], 'root minute 0 is 08:00 on calendar day 1');
        assert.deepEqual(Object.keys(fresh).filter(k => /checksum|crc|integrity|signature|sha\d/i.test(k)), [], 'no integrity field: any JSON that validates loads');
        assert.equal(game.internals.tickrate, 1, 'one tick a second at normal speed, one game minute a tick while awake');
        assert.equal(Object.hasOwn(fresh.expansion, SLICE) || Object.hasOwn(fresh, 'engine_world'), false, 'the game knows nothing of the engine world');
        t.diagnostic(`fresh game save: ${game.storage.getItem(SAVE_KEY).length} characters, ${Object.keys(fresh).length} top-level slices; storage budget 2,097,152 characters, compressed above 262,144`);
    });

    await t.test('2. eighteen game minutes in, the engine holds a working in flight, a stored working and a binding', () => {
        while (root() < r0 + 18) { game.ticks(1); bridge.sync(root()); }
        const mid = bridge.engine;
        assert.equal(mid.world.clock, root(), 'the engine minute is the root minute');
        assert.deepEqual(statuses(mid), {blade: 'running', 'cast.1': 'complete', 'feed.1': 'complete'});
        assert.deepEqual([mid.records.stored['gate.ward'].status, chargeAt(mid.records.stored['gate.ward'], root() - r0)], ['armed', 3]);
        assert.equal(bindingState(defineBinding(mid.records.bindings[0]), {now: root(), receipts: engineReceipts(mid), log: mid.records.log}).status, 'held');
        assert.equal(mid.rules.packs.length, 17, 'every registered pack is loaded');
        sliceText = saveText(mid);
        assert.equal(saveText(jumpTo(root()).engine), sliceText, 'eighteen ticks equal one jump');
        t.diagnostic(`engine slice at minute 18: ${sliceText.length} characters`);
    });

    await t.test('3. round trip: a top-level slice is dropped without a word; inside `expansion` it comes back byte for byte through save, export and import', async () => {
        base = await game.save();
        const slice = () => JSON.parse(sliceText);

        // (a) An extra top-level slice. load() reads the keys it knows and create_save() writes a new object,
        // so the slice is accepted, never refused, and gone at the first save. This is the gap.
        await game.load({...structuredClone(base), engine_world: slice()});
        clean('a save with an unknown top-level slice loads with no complaint');
        assert.equal(JSON.parse(game.storage.getItem(SAVE_KEY)).engine_world.schema, 'engine.world@1', 'the stored bytes still hold it until the game saves');
        const dropped = await game.save();
        assert.equal(Object.hasOwn(dropped, 'engine_world'), false, 'CURRENT BEHAVIOUR: the unknown top-level slice is dropped at the first save');
        assert.equal(dropped.expansion.clock, base.expansion.clock);

        // (b) Inside `expansion`, which the game validates by the keys it knows and hands on whole.
        const carried = structuredClone(base); carried.expansion[SLICE] = slice();
        await game.load(carried);
        clean('a save with the slice inside expansion loads');
        const saved = await game.save();
        assert.equal(JSON.stringify(saved.expansion[SLICE]), sliceText, 'save and load: byte-identical');
        const file = await game.exportFile();
        assert.equal(JSON.stringify(decodeFile(file).expansion[SLICE]), sliceText, 'export file: byte-identical');
        await game.importFile(file);
        clean('the exported file imports (structural validation, preflight in a second game instance, reload)');
        assert.equal(JSON.stringify((await game.save()).expansion[SLICE]), sliceText, 'import: byte-identical');
        assert.equal(root(), r0 + 18, 'the import restored the clock');

        // (c) The game's own keep-what-I-no-longer-register list also carries it verbatim, as a path and a value.
        await game.load({...structuredClone(base), retired_content: {schema: 1, entries: [{path: ['engine_world'], value: slice()}]}});
        clean('retired-content carrier loads');
        const kept = (await game.save()).retired_content;
        assert.equal(JSON.stringify(kept.entries.find(e => e.path.join('/') === 'engine_world').value), sliceText);

        await game.load(carried);
    });

    let dayBridge;
    await t.test('4. a day on the game clock: the engine restored from the game save, advanced one minute per game tick, equals one engine jump', async () => {
        const saved = await game.save();
        dayBridge = createClockBridge({engine: restoreSeamEngine(saved.expansion[SLICE]), timeline, next: bridge.next});
        const end = r0 + DAY, started = performance.now(), night = [];
        const hourAt = minute => Math.floor((minute + calendarOffset) % DAY / 60);
        // Two hours one tick at a time, reading the game clock after each tick. Then the stepper's own
        // sixty-tick batches (reading the clock between single ticks from outside costs about seven times
        // the batch rate), with the engine still advanced one minute per tick the batch ran.
        let ticks = 0, idle = 0;
        while (root() < r0 + 120) {
            game.ticks(1); ticks += 1;
            idle = dayBridge.sync(root()) === 0 ? idle + 1 : 0;
            assert.ok(idle < 4, 'the game clock stopped');
            assert.equal(game.internals.current_game_time.hour, hourAt(root()));
        }
        while (root() < end) {
            const before = root(), n = Math.min(60, end - before);
            game.ticks(n); ticks += n;
            assert.equal(root() - before, n, 'an awake hero: each tick in the batch was one minute');
            for (let minute = before + 1; minute <= root(); minute++) dayBridge.sync(minute);
        }
        for (let minute = r0 + 19; minute <= end; minute++) { const hour = hourAt(minute); night.push([minute, hour >= 20 || hour < 4]); } // src/game_time.js night_time
        const wall = performance.now() - started;
        clean('a day of ticks');
        assert.equal(game.minutes() - root(), calendarOffset, 'the calendar and the root clock moved together');
        assert.deepEqual(dayBridge.stats.spans, {1: DAY - 18}, 'an awake hero: every tick is one whole minute, so no rounding arises');
        const jump = jumpTo(end);
        assert.equal(saveText(dayBridge.engine), saveText(jump.engine), 'tick by tick from a restored save equals one jump');
        assert.deepEqual(statuses(dayBridge.engine), {blade: 'complete', 'cast.1': 'complete', 'feed.1': 'complete', 'cast.evening.0': 'complete'});
        assert.equal(dayBridge.engine.world.holders.feeder.place, 'hill', 'the valley ran too: the feeder followed the colony light');

        // The game rewrote its save every tick and carried the slice untouched: intact, and a day stale.
        assert.equal(JSON.stringify(game.snapshot().expansion[SLICE]), sliceText, 'CURRENT BEHAVIOUR: the game carries the slice and does not advance it');

        // Uneven spans through the game's own clock function (travel and long activities use it this way).
        for (const [minutes, source] of [[30, null], [7, 'travel'], [45, null]]) {
            const before = root(), consumed = game.internals.update_timer(minutes, source);
            assert.deepEqual([consumed, root() - before, dayBridge.sync(root())], [minutes, minutes, minutes]);
        }
        assert.equal(saveText(dayBridge.engine), saveText(jumpTo(root()).engine), 'spans of 30, 7 and 45 minutes equal one jump');

        // Day and night: the game's night is 20:00 to 04:00; the sky pack's default dawn is 06:00 on the same calendar.
        const differs = dials => night.filter(([minute, isNight]) => (engineSkyAt(minute, dials).daylight === 0) !== isNight).length;
        assert.equal(differs(), 120, 'CURRENT BEHAVIOUR: default sky dials call 04:00 to 06:00 dark while the game calls it day');
        assert.equal(differs({dawn: 240}), 0, 'the dawn dial closes it: a pack setting, no code');
        t.diagnostic(`game day: ${ticks} ticks in ${(wall / 1000).toFixed(1)} s wall, of which the engine bridge ${dayBridge.stats.ms.toFixed(0)} ms `
            + `(${dayBridge.stats.segments} segments tick by tick, ${jump.stats.segments} in one jump taking ${jump.stats.ms.toFixed(0)} ms); slice ${saveText(dayBridge.engine).length} characters`);
    });

    await t.test('5. writing the engine back needs a reload today; the restored engine carries on; what the slice costs each tick', async () => {
        // No src hook lets the test hand the game a newer slice, so it goes through stored bytes and a reload.
        const now = saveText(dayBridge.engine), s = await game.save();
        s.expansion[SLICE] = JSON.parse(now);
        await game.load(s);
        clean('the day-end slice loads');
        assert.equal(JSON.stringify((await game.save()).expansion[SLICE]), now);
        const time = n => { const t0 = performance.now(); game.ticks(n); return performance.now() - t0; };
        const withSlice = time(60);
        const again = createClockBridge({engine: restoreSeamEngine((await game.save()).expansion[SLICE]), timeline, next: dayBridge.next});
        assert.equal(again.sync(root()), 60, 'the engine was an hour behind the game and catches up in one call');
        assert.equal(saveText(again.engine), saveText(jumpTo(root()).engine), 'restored from the game save a second time, same world');
        dayBridge = again;
        const bare = await game.save(); delete bare.expansion[SLICE];
        await game.load(bare);
        const without = time(60);
        dayBridge.sync(root());
        t.diagnostic(`one 60-tick batch with a ${now.length}-character slice in expansion: ${withSlice.toFixed(0)} ms; without: ${without.toFixed(0)} ms (one run each, wall time, not a benchmark)`);
    });

    await t.test('6. away: the game banks time away and spends it through its own ticks; the engine is asked for whatever span the clock moved', async () => {
        const s = await game.save();
        s.awayBank = {schema: 1, bankedMinutes: WEEK, remainderMs: 0};
        s.expansion[SLICE] = dayBridge.save();
        await game.load(s);
        clean('a save with a banked week loads');
        const bank = () => globalThis.simulationTestHooks.project('awayBank');
        assert.deepEqual([bank().bankedMinutes, bank().capacity, bank().spendMinutes], [WEEK, WEEK, 60],
            'the bank holds seven days at most (a dial) and the button spends sixty minutes; more time away than the cap is dropped');
        const away = createClockBridge({engine: restoreSeamEngine((await game.save()).expansion[SLICE]), timeline, next: dayBridge.next});
        const spend = async minutes => {
            let done = false, result, failure;
            const before = root(), started = performance.now();
            globalThis.simulationTestHooks.command('awayBank', 'spend', minutes).then(r => { result = r; }, e => { failure = e; }).finally(() => { done = true; });
            // The spend runs in slices inside the game; the test can look at the clock only between them.
            for (let i = 0; !done && performance.now() - started < 900_000; i++) { await game.settle(50); away.sync(root()); }
            assert.ok(done, 'the bank spend did not finish');
            if (failure) throw failure;
            away.sync(root());
            return {...result, moved: root() - before, wall: performance.now() - started};
        };
        const hour = await spend(60);
        clean('an hour spent from the bank');
        assert.deepEqual([hour.requested, hour.consumed, hour.moved, bank().bankedMinutes], [60, 60, 60, WEEK - 60]);
        assert.equal(saveText(away.engine), saveText(jumpTo(root()).engine), 'the engine followed the spend and equals one jump');
        t.diagnostic(`banked hour: ${hour.wall.toFixed(0)} ms wall; clock spans the bridge saw: ${JSON.stringify(away.stats.spans)}`);
        if (FULL_WEEK) {
            const rest = await spend(WEEK - 60);
            clean('the whole banked week spent');
            assert.deepEqual([rest.consumed, bank().bankedMinutes], [WEEK - 60, 0]);
            assert.equal(saveText(away.engine), saveText(jumpTo(root()).engine), 'a banked week through the game equals one engine jump');
            t.diagnostic(`banked week through the game: ${((hour.wall + rest.wall) / 1000).toFixed(1)} s wall, engine bridge ${(away.stats.ms / 1000).toFixed(1)} s in ${away.stats.syncs} syncs and ${away.stats.segments} segments; `
                + `slice ${saveText(away.engine).length} characters; spans ${JSON.stringify(away.stats.spans)}`);
        }
    });
});

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
