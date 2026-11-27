// A keeper takes in the Moonlight Gu, starts its native Moonblade hunt, and lets the job finish.
// The visible cut is the played-effects adapter's authored 12-vitality boar calibration.
// @ladder {"keys":["gu_kinds:moonlight"],"scope":"headless",
// @ladder  "route":"fixture","checks":{"saveReload":true,"exportImport":true,"browser":false},
// @ladder  "watch":["src/played_effects_domain.js","src/gu_keeper_moves.js"]}
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';

const wallStart = Date.UTC(2026, 10, 24, 12);
const KEY = 'book.ri.keeper.km.use.moonblade__moon__own';
const LINE = 'The Moonblade struck: the boar lost 12 of 12 vitality.';

test('the keeper Moonblade hunt lands and persists through reload and import', {timeout: 240000}, async () => {
    const game = await boot(null, {seed: 1, wallStart, heroName: null});
    const completed = () => game.internals.expansionState?.actors?.player?.completed?.[KEY];
    const visible = () => game.text('#message_log_div')?.includes(LINE) ?? false;
    let afterHunt, saved, reloaded, imported;
    try {
        await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'beginning');
        await game.fill('select[data-structured-choice="life"]', 'book.ri.keeper');
        await game.click('[data-structured-begin]');
        await game.click('[data-structured-action="book.ri.keeper.take_moon"]');
        await game.click(`[data-structured-action="${KEY}"]`);
        await game.step(60);
        afterHunt = {line: visible(), completed: completed()};
        const save = await game.save();
        saved = {line: JSON.stringify(save.reports_dock).includes(LINE), completed: save.expansion?.actors?.player?.completed?.[KEY]};
        await game.reload();
        reloaded = {line: visible(), completed: completed()};
        const file = await game.exportFile();
        game.storage.clear();
        await game.importFile(file);
        imported = {line: visible(), completed: completed()};
    } finally { game.close(); }
    assert.equal(game.errors.length, 0, game.errors.join('\n'));
    assert.deepEqual(afterHunt, {line: true, completed: 1});
    assert.deepEqual(saved, afterHunt);
    assert.deepEqual(reloaded, afterHunt);
    assert.deepEqual(imported, afterHunt);
});
