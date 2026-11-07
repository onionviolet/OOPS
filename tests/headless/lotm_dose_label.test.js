import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';

const nav = '#workspace_navigation select[aria-label="Other known panels"]';
async function workroom(game, tab='work') {
    await game.fill(nav, 'lotm');
    await game.click(`[data-workroom-tabs] [data-tab="${tab}"]`);
}
const label = game => game.$$('#lotm_panel p').find(el => el.textContent.startsWith('Issued dose label:'));

test('a supervised Tingen allocation shows its label, keeps it through import and removes it after drinking', async t => {
    const game = await boot(null, {seed:11, url:'http://localhost/?test_hooks=1&lotm_probe=1'});
    t.after(() => game.close());
    await game.fill(nav, 'lotm');
    await game.click('[data-lotm="pick_probationer"]');
    await game.click('[data-lotm="enroll"]');
    await game.click('[data-lotm="book.lotm.report_in"]');
    assert.equal(label(game), undefined);
    await game.click('[data-lotm="book.lotm.accept_allocation"]');
    await workroom(game);
    const text = label(game)?.textContent;
    assert.match(text, /Issued dose label: Tingen prepared Seer dose: 1 dose/);
    assert.equal(game.hiddenReason(label(game)), null);
    const saved = await game.save();
    const terms = saved.expansion.simulation.knowledge.player['book.lotm.terms'];
    await game.reload();
    await workroom(game);
    assert.equal(label(game)?.textContent, text);
    const exported = await game.exportFile();
    await game.importFile(exported);
    await workroom(game);
    assert.equal(label(game)?.textContent, text);
    assert.deepEqual(game.snapshot().expansion.simulation.knowledge.player['book.lotm.terms'], terms);
    await workroom(game, 'here');
    await game.click('[data-lotm="book.lotm.ingest"]');
    await workroom(game);
    assert.equal(label(game), undefined);
    assert.equal(game.snapshot().expansion.actors.player.facts['book.lotm.ingested'], true);
    assert.deepEqual(game.errors, []);
});
