import test from 'node:test';
import assert from 'node:assert/strict';
import {boot, canonicalSave, diffSaves} from '../../scripts/headless/runner.mjs';

// M4 lamplight native journey (2026-10-19): buy at the village market, light through the inventory,
// walk into Cave depths and let the lamplight find the loose wall; Save/reload and Export/Import keep
// the lit lamp, its oil and the revealed route. Starts from a fresh save that has no lamplight slice.
const key = id => JSON.stringify({id});
const count = (save, id) => save.inventories.person.main_character[key(id)]?.count ?? 0;
function progressed(save) {
    const out = structuredClone(save);
    out.availabilities.trader.villageTrader = 1;
    out.character.money = 5000;
    for(const place of ['Nearby cave', 'Cave depths']) out.availabilities.location[place] = 1;
    // A seasoned hero, so wolf rats do not end the visit before the lamplight has time to work.
    const xp = out.levels.person.main_character;
    xp.total_xp = out.character.xp.total_xp = 2e6;
    for(const skill of ['Combat', 'Evasion', 'Iron skin', 'Night vision', 'Pest killer', 'Unarmed']) xp.skill_xp[skill] = 5e6;
    return out;
}

test('lamplight: buy, light, reveal the Cave depths wall, persist through reload and import', async t => {
    const game = await boot(null, {seed:11, heroName:null});
    t.after(() => game.close());
    const fresh = await game.save();
    assert.equal(fresh.availabilities.location['Suspicious wall'], 0);
    assert.equal(fresh.lamplight, undefined, 'a save from before the slice has none');
    await game.load(progressed(fresh));
    assert.equal((await game.save()).lamplight, undefined, 'old save loads with no invented lamp history');

    await game.click('.choice_trade');
    await game.click('[data-trader="villageTrader"]');
    await game.click(`[data-trader_item='${key('Oil lamp')}']`);
    await game.click(`[data-trader_item='${key('Lamp oil')}']`);
    await game.click('#accept_trade_button');
    await game.click('#center_mode_back');
    let save = await game.save();
    assert.deepEqual([count(save, 'Oil lamp'), count(save, 'Lamp oil')], [1, 1]);
    assert.equal(game.$(`#inventory_content_div > [data-character_item='${key('Oil lamp')}'] .item_auto_use_button`), null, 'a lamp toggles, so it has no auto-use');

    await game.click(`#inventory_content_div > [data-character_item='${key('Oil lamp')}']`);
    await game.click('[data-shell-item-action="use"]');
    save = await game.save();
    assert.equal(count(save, 'Lamp oil'), 0);
    assert.equal(save.lamplight.lit, true);
    assert.equal(game.internals.character.nativeLightBonus(), 40);

    await game.load(save);
    assert.deepEqual((await game.save()).lamplight, save.lamplight, 'reload keeps the lit lamp and its oil');
    assert.equal(game.internals.character.nativeLightBonus(), 40);

    // Walk the way a player does: open "Move somewhere else" if needed, then pick the place.
    // A village trade starts the market owner, so this also covers the p23 travel branch.
    const travel = async id => {
        const target = game.$(`[data-travel="${id}"]`), dropdown = target.closest('.location_choice_dropdown');
        if(game.hiddenReason(target) && dropdown) await game.click(dropdown.firstElementChild);
        await game.click(target);
    };
    const walkStart = game.minutes();
    await travel('Nearby cave');
    await travel('Cave depths');
    assert.equal(game.internals.current_location.id, 'Cave depths');
    const walked = game.minutes() - walkStart;
    assert.equal((await game.save()).lamplight.oil, save.lamplight.oil - walked, 'the lamp burns while you walk');
    await game.step(25, {chunk:5});
    save = await game.save();
    assert.equal(save.availabilities.location['Suspicious wall'], 1, 'lamplight reveals the loose wall before any clear');
    assert.ok(game.text('#message_log_div').includes('loose mortar'));
    assert.equal(save.lamplight.noticed['Cave depths'], 20);

    const encoded = await game.exportFile();
    const exported = await game.save();
    await game.importFile(encoded);
    const imported = await game.save();
    assert.deepEqual(diffSaves(canonicalSave(imported), canonicalSave(exported)), []);
    assert.deepEqual(imported.lamplight, exported.lamplight);
    assert.equal(imported.availabilities.location['Suspicious wall'], 1);
    assert.deepEqual(game.errors, []);
});
