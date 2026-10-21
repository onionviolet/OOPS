import test from 'node:test';
import assert from 'node:assert/strict';
import {boot, canonicalSave, diffSaves} from '../../scripts/headless/runner.mjs';

const BOOK = 'ABC for kids', key = id => JSON.stringify({id});
// Harness-controlled current-format setup, not a naturally acquired character.
function fixture(fresh, {oil = 2.5, progress = 0, hour = 22, minute = 0} = {}) {
    const save = structuredClone(fresh);
    Object.assign(save['current time'], {hour, minute});
    for (const id of ['Oil lamp', BOOK]) save.inventories.person.main_character[key(id)] = {count: 1};
    save.lamplight = {schema: 1, lit: true, oil, noticed: {}};
    save.books[BOOK] = {accumulated_time: progress};
    save.levels.person.main_character.skill_xp.Literacy = progress;
    return save;
}
const progress = save => save.books[BOOK]?.accumulated_time ?? 0;
const fuel = save => save.lamplight?.oil ?? 0;
const xp = save => save.levels.person.main_character.skill_xp.Literacy;
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
async function roundTrip(game) {
    const pending = await game.save();
    await game.reload();
    assert.deepEqual(diffSaves(canonicalSave(await game.save()), canonicalSave(pending)), []);
    const encoded = await game.exportFile(), exported = await game.save();
    await game.importFile(encoded);
    assert.deepEqual(diffSaves(canonicalSave(await game.save()), canonicalSave(exported)), []);
}

test('native reading: fractional expiry, batched equivalence, pause/stop and pending/final persistence', async t => {
    const game = await boot(null, {seed: 11, heroName: null});
    t.after(() => game.close());
    const fresh = await game.save(), seed = fixture(fresh);
    await game.load(seed);
    await game.call('start_reading', key(BOOK));
    await game.step(1);
    closeTo(progress(await game.save()), 1.2);
    closeTo(fuel(await game.save()), 1.5);
    const paused = canonicalSave(await game.save());
    await game.settle(2000);
    assert.deepEqual(diffSaves(canonicalSave(await game.save()), paused), [], 'paused engine/inspection creates no elapsed work');
    await roundTrip(game);
    await game.step(5);
    const whole = await game.save();
    closeTo(progress(whole), 6.5); closeTo(fuel(whole), 0);
    closeTo(xp(whole), 6.5);
    await roundTrip(game);

    await game.load(seed); await game.call('start_reading', key(BOOK));
    for (let i = 0; i < 6; i++) await game.step(1);
    const split = await game.save();
    assert.deepEqual(diffSaves(canonicalSave(split), canonicalSave(whole)), [], 'one batch matches six native advances across expiry');

    await game.load(fixture(fresh, {hour: 3, minute: 58}));
    await game.call('start_reading', key(BOOK));
    await game.step(6);
    closeTo(progress(await game.save()), 6.3775); // Native dawn samples: ambient 69/70/71 at expiry.

    await game.load(fixture(fresh, {oil: 4})); await game.call('start_reading', key(BOOK));
    await game.step(1); await game.call('end_reading');
    const stopped = await game.save();
    await game.step(2);
    closeTo(progress(await game.save()), progress(stopped));
    closeTo(fuel(await game.save()), 1);
    assert.equal(game.snapshot().is_reading, null, 'no reading resumes itself');
    assert.deepEqual(game.errors, []);
});

test('native completion coincides with expiry and rewards/XP settle once through reload/import', async t => {
    const game = await boot(null, {seed: 11, heroName: null});
    t.after(() => game.close());
    const fresh = await game.save();
    await game.load(fixture(fresh, {oil: 1, progress: 118.8}));
    await game.call('start_reading', key(BOOK));
    const before = await game.save();
    await game.step(1);
    const finished = await game.save();
    assert.equal(progress(finished), 120, 'the final fueled interval completes the book');
    assert.equal(fuel(finished), 0);
    assert.equal(finished.is_reading, null);
    closeTo(xp(finished) - xp(before), 1.2);
    assert.equal(game.internals.character.getLevelableComponent().xp_bonuses.multiplier.books.all, 1.2);
    // Titles are recognized by the existing next publication/load backfill. Immediate reload
    // must preserve the completed study and bonus, even before that separate title check runs.
    await game.reload();
    const restored = await game.save();
    assert.deepEqual(restored.books, finished.books);
    assert.deepEqual(restored.lamplight, finished.lamplight);
    assert.equal(xp(restored), xp(finished));
    assert.equal(restored.is_reading, finished.is_reading);
    assert.equal(game.internals.character.getLevelableComponent().xp_bonuses.multiplier.books.all, 1.2);
    const delta = diffSaves(canonicalSave(restored), canonicalSave(finished));
    assert.deepEqual(delta.map(d => d.path), ['/character/titles/reader']);
    await roundTrip(game);
    const settledXP = xp(await game.save());
    await game.step(2);
    assert.equal(progress(await game.save()), 120);
    assert.equal(xp(await game.save()), settledXP);
    assert.equal(game.internals.character.getLevelableComponent().xp_bonuses.multiplier.books.all, 1.2);
    assert.deepEqual(game.errors, []);
});
