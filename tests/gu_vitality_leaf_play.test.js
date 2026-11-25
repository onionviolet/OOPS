// The workshop's vitality-leaf act lands a generic Gu sentence with an authored healing amount.
// This proves the workshop demo, not a native vitality-leaf action in an ordinary life.
// @ladder {"keys":["gu_kinds:vitality-leaf"],"scope":"workshop demo",
// @ladder  "route":"capability-run","checks":{"saveReload":true,"exportImport":true,"browser":false},
// @ladder  "watch":["src/world_packs/effects_workshop.js"]}
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';

const wallStart = Date.UTC(2026, 10, 24, 12);
const LINE = /Gu grammar · vitality leaf reads [^.]*\./;

test('a player feeds a vitality leaf in the workshop, then reloads and imports it', {timeout: 240000}, async () => {
    const game = await boot(null, {seed: 1, wallStart, heroName: null});
    const text = () => (game.document.querySelector('#capability_runs_view')?.textContent ?? '').replace(/\s+/g, ' ');
    const open = async () => { await game.clickText('Capability runs'); await game.click('[data-capability-run="workshop"]'); };
    let act, saved, reloaded, imported;
    try {
        await open();
        await game.click('[data-capability-action="begin"]');
        await game.click('[data-capability-action="gu"]');
        act = {line: text().match(LINE)?.[0], vitality: /Brewer vitality\s*15/.test(text())};
        saved = JSON.stringify(await game.save()).includes('vitality leaf');
        await game.reload();
        await open();
        reloaded = {line: text().match(LINE)?.[0], vitality: /Brewer vitality\s*15/.test(text()), spent: game.document.querySelector('[data-capability-action="gu"]')?.disabled};
        const file = await game.exportFile();
        game.storage.clear();
        await game.importFile(file);
        await open();
        imported = {line: text().match(LINE)?.[0], vitality: /Brewer vitality\s*15/.test(text())};
    } finally { game.close(); }
    assert.equal(game.errors.length, 0, game.errors.join('\n'));
    assert.match(act.line, /landed, vitality \+3/);
    assert.equal(act.vitality, true);
    assert.equal(saved, true);
    assert.deepEqual(reloaded, {...act, spent: true});
    assert.deepEqual(imported, act);
});
