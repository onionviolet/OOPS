import test from 'node:test';
import assert from 'node:assert/strict';
import {boot, canonicalSave, diffSaves} from '../../scripts/headless/runner.mjs';

// CBL1 native journey (2026-10-19): a fresh hero walks into Nearby cave and is beaten. The legacy
// counter and log behave as before; the defeat record names outcome and cause; Save/reload and
// Export/Import keep it. Starts from a save that has no defeat slice.
function cave(save) {
    const out = structuredClone(save);
    out.availabilities.location['Nearby cave'] = 1;
    out.options = {...out.options, auto_return_to_bed: false};
    return out;
}
// Walk the way a player does, then stay in the fight until the hero goes down.
async function loseInCaveRoom(game) {
    for(const id of ['Nearby cave', 'Cave room']) {
        const target = game.$(`[data-travel="${id}"]`), dropdown = target.closest('.location_choice_dropdown');
        if(game.hiddenReason(target) && dropdown) await game.click(dropdown.firstElementChild);
        await game.click(target);
    }
    assert.equal(game.internals.current_location.id, 'Cave room');
    for(let i = 0; i < 60 && !(await game.save()).total_deaths; i++) await game.step(10, {chunk:1});
}

test('defeat: a beaten hero publishes one unconscious record that persists', async t => {
    const game = await boot(null, {seed:5, heroName:null});
    t.after(() => game.close());
    const fresh = await game.save();
    assert.equal(fresh.defeat, undefined, 'a save from before the slice has none');
    await game.load(cave(fresh));
    assert.equal((await game.save()).defeat, undefined, 'old save loads with no invented defeats');
    await loseInCaveRoom(game);
    const save = await game.save();
    assert.equal(save.total_deaths, 1, 'legacy counter unchanged in meaning');
    assert.ok(game.text('#message_log_div').includes('has lost consciousness'));
    assert.deepEqual(save.defeat.counts, {unconscious: 1});
    assert.equal(save.defeat.last.outcome, 'unconscious');
    assert.equal(save.defeat.last.cause.kind, 'combat');
    assert.ok(save.defeat.last.cause.place, 'names where it happened');
    assert.ok(save.defeat.last.cause.by.length >= 1, 'names who was still standing');

    await game.load(save);
    assert.deepEqual((await game.save()).defeat, save.defeat, 'reload keeps the record');
    const encoded = await game.exportFile();
    const exported = await game.save();
    await game.importFile(encoded);
    const imported = await game.save();
    assert.deepEqual(diffSaves(canonicalSave(imported), canonicalSave(exported)), []);
    assert.deepEqual(imported.defeat, save.defeat);
    assert.deepEqual(game.errors, []);
});
