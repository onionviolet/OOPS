// Atlas pilot B3, rungs 3 and 4 for the Monarch Lotus: the whole game boots headless, a player opens Capability runs, begins the
// workshop, presses the Lotus act, then the save is reloaded and the export is imported. Slow (boots the game three times).
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';

const wallStart = Date.UTC(2026, 10, 24, 12);
const LINE = /Gu grammar · Monarch Lotus[^.]*\./;

test('a player can press the Lotus act, and it survives a reload and an export import', {timeout: 240000}, async () => {
    const game = await boot(null, {seed: 1, wallStart, heroName: null});
    const text = () => (game.document.querySelector('#capability_runs_view')?.textContent ?? '').replace(/\s+/g, ' ');
    const open = async () => { await game.clickText('Capability runs'); await game.click('[data-capability-run="workshop"]'); };
    const seen = {};
    try {
        await open();
        await game.click('[data-capability-action="begin"]');
        await game.click('[data-capability-action="lotus"]');
        seen.act = text().match(LINE)?.[0];
        seen.saved = JSON.stringify(await game.save()).includes('Monarch Lotus');
        await game.reload();
        await open();
        seen.reload = {line: text().match(LINE)?.[0], sea: /Adept sea\s*40 motes/.test(text()), spent: game.document.querySelector('[data-capability-action="lotus"]')?.disabled};
        const file = await game.exportFile();
        game.storage.clear();
        await game.importFile(file);
        await open();
        seen.imported = {line: text().match(LINE)?.[0], sea: /Adept sea\s*40 motes/.test(text())};
    } finally { game.close(); }
    assert.equal(game.errors.length, 0, game.errors.join('\n'));
    assert.match(seen.act, /rose by 40 of 40 motes/);
    assert.equal(seen.saved, true);
    assert.deepEqual(seen.reload, {line: seen.act, sea: true, spent: true});
    assert.deepEqual(seen.imported, {line: seen.act, sea: true});
});
