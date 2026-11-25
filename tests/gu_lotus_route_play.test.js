// The ordinary keeper earns the precursor, recipe and seven finite spring charges,
// refines the same living specimen, uses its essence, then carries the save onward.
// @ladder {"keys":["gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus"],"scope":"headless",
// @ladder  "route":"fixture","checks":{"saveReload":true,"exportImport":true,"browser":false},
// @ladder  "watch":["src/gu_keeper_lotus_route.js","src/world_packs/book_gu_keeper_lotus_route.js","src/played_effects_domain.js"]}
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';
import {keeperLotus as ID, LOTUS_DIALS as D, LOTUS_SPRINGS, lotusLedgerKey} from '../src/gu_keeper_lotus_route.js';

const wallStart = Date.UTC(2026, 10, 24, 12);
const action = name => `[data-structured-action="${ID}.${name}"]`;
const line = 'The Monarch Lotus produced primeval essence';

test('ordinary keeper buys, drains seven springs, refines and uses the Monarch Lotus across save routes',
    {timeout: 240000}, async () => {
        const game = await boot(null, {seed: 1, wallStart, heroName: null});
        const state = () => game.internals.expansionState;
        const ledger = () => JSON.parse(state().worlds['book.ri.keeper.world'].facts[lotusLedgerKey]);
        const click = name => game.click(action(name));
        const savedShape = save => ({ledger: JSON.parse(save.expansion.worlds['book.ri.keeper.world'].facts[lotusLedgerKey]),
            essence: save.expansion.simulation.energies.player['book.ri.keeper.primeval'].reserve,
            use: save.expansion.actors.player.completed[`${ID}.use`]});
        let before, saved, reloaded, imported, clock;
        try {
            await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'beginning');
            await game.fill('select[data-structured-choice="life"]', 'book.ri.keeper');
            await game.click('[data-structured-begin]');
            await game.click(`[data-structured-extension="${ID}"]`);
            for (let i = 0; i < 8; i++) {
                await game.click('[data-structured-action="book.ri.keeper.chores"]');
                await game.step(120);
            }
            await click('buy_precursor');
            await click('buy_recipe');
            await click('walk_trail');
            await game.step(D.trailMinutes);
            for (const spring of LOTUS_SPRINGS) {
                await click(`draw_${spring.id}`);
                await game.step(D.springDutyMinutes);
                assert.match(game.text(`[data-gu="lotus-spring-${spring.id}"]`), /consumed permanently/);
            }
            await click('walk_home');
            await game.step(D.trailMinutes);
            await click('begin');
            for (let i = 1; i <= 7; i++) {
                await game.step(D.stageMinutes);
                await click(`stage_${i}`);
            }
            await game.click('[data-structured-action="book.ri.keeper.take_moon"]');
            await click('use');
            const useAt = state().clock;
            await game.step(1);
            before = {clock: state().clock, row: ledger(), reserve: state().simulation.energies.player['book.ri.keeper.primeval'].reserve,
                line: game.text('#message_log_div')?.includes(line), use: state().actors.player.completed[`${ID}.use`]};
            clock = useAt;
            const save = await game.save();
            saved = savedShape(save);
            await game.reload();
            reloaded = savedShape(await game.save());
            const file = await game.exportFile();
            game.storage.clear();
            await game.importFile(file);
            imported = savedShape(await game.save());
        } finally { game.close(); }
        assert.equal(game.errors.length, 0, game.errors.join('\n'));
        assert.equal(before.clock, 8 * 120 + 2 * D.trailMinutes + 7 * D.springDutyMinutes + 7 * D.stageMinutes + 1);
        assert.equal(before.row.world.gu[0].kind, 'heavenly-essence-treasure-monarch-lotus');
        assert.equal(before.row.world.gu[0].rank, 4);
        assert.equal(before.row.world.gu[0].holder, 'player');
        assert.equal(LOTUS_SPRINGS.every(s => before.row.springs[s.id] !== null), true);
        assert.equal(before.row.lastUseAt, clock);
        assert.equal(before.reserve, 12);
        assert.equal(before.line, true);
        assert.equal(before.use, 1);
        assert.deepEqual(reloaded, saved);
        assert.deepEqual(imported, saved);
    });
