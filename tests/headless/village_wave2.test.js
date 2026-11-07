import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';
import {scenarioSave} from '../../scripts/headless/scenarios.mjs';

const navigation = '#workspace_navigation select[aria-label="Other known panels"]';
async function people(game, panel) {
    await game.fill(navigation, 'notebook');
    await game.click('#notebook_tab_people');
    const details = game.$(panel) || (panel === '#tempo_fight_panel' && game.$('[data-shared-slot="encounter"] details'));
    assert.ok(details, panel);
    if(!details.open) await game.click(details.querySelector('summary'));
}
function actionable(game, selector) {
    const button = game.$(selector);
    assert.ok(button, selector);
    assert.equal(game.hiddenReason(button), null, `${selector} has no hidden ancestor`);
    assert.equal(button.disabled, false);
}

test('workshop recipe boots unenrolled and its visible enrollment button starts local life', async t => {
    const save = await scenarioSave('village-workshop-unenrolled', {seed: 11});
    assert.equal(JSON.parse(save).expansion.simulation, null);
    const game = await boot(save, {seed: 11});
    t.after(() => game.close());
    await people(game, '#simulation_panel');
    actionable(game, '[data-simulation="enroll"]');
    await game.click('[data-simulation="enroll"]');
    assert.ok(game.snapshot().expansion.simulation?.people.player);
    assert.ok(game.hiddenReason(game.$('[data-simulation="enroll"]')));
    assert.deepEqual(game.errors, []);
});

test('rival recipe reaches study, spends ten minutes once and keeps appraisal through reload and import', async t => {
    const game = await boot(await scenarioSave('village-rival', {seed: 11}), {seed: 11});
    t.after(() => game.close());
    await people(game, '#tempo_fight_panel');
    assert.ok(game.$('[data-rival-brief="unread"]'));
    actionable(game, '[data-tempo="study"]');
    const before = game.snapshot().expansion.clock;
    await game.click('[data-tempo="study"]');
    assert.equal(game.snapshot().expansion.clock - before, 10);
    assert.equal(game.text('#tempo_fight_panel > p[role="status"]'), 'You have taken her measure.');
    const assertAppraised = async () => {
        await people(game, '#tempo_fight_panel');
        assert.match(game.text('[data-rival-brief="appraised"]'), /you have taken her measure/i);
        assert.equal(game.$('[data-tempo="study"]'), null);
    };
    await assertAppraised();
    const saved = await game.save();
    const observation = saved.expansion.simulation.knowledge.player['person.roadRival.strength'];
    assert.ok(observation);
    await game.reload();
    await assertAppraised();
    const exported = await game.exportFile();
    await game.importFile(exported);
    await assertAppraised();
    assert.deepEqual(game.snapshot().expansion.simulation.knowledge.player['person.roadRival.strength'], observation);
    assert.deepEqual(game.errors, []);
});
