import test from 'node:test';
import assert from 'node:assert/strict';
import {lintLeadBot} from '../scripts/check_lead_bot.mjs';
import {leadBot} from '../scripts/headless/lead_bot.mjs';

const codes = src => lintLeadBot('planted.mjs', src).map(f => f.code);

test('lead bot lint: a clean route passes', () => {
    const src = [
        "import {leadBot} from './lead_bot.mjs';",
        "import {ROUTE} from './fixtures/lotm_v1_fixture.mjs';",
        "// game.internals.x = 1 and import '../../src/main.js' in a comment are ignored",
        "const note = 'window.simulationTestHooks = 1; advanceWall';",
        "const bot = await leadBot(null, {seed: 7});",
        "for(const s of ROUTE) await bot.click(s);",
        "await bot.call('switchToInventory');",
    ].join('\n');
    assert.deepEqual(lintLeadBot('ok.mjs', src), []);
});

test('lead bot lint: rejects a state import', () => {
    assert.ok(codes("import {state} from '../../src/state.js';\n").includes('import'));
    assert.ok(codes("import {boot} from './runner.mjs';\nconst m = await import('../../src/main.js');").includes('import'));
    assert.ok(codes("import fs from 'node:fs';").includes('import'));
});

test('lead bot lint: rejects clock and seed writes', () => {
    assert.ok(codes("import {leadBot} from './lead_bot.mjs';\nbot.game.advanceWall(86400000);").includes('clock'));
    assert.ok(codes("Date.now = () => 0;").includes('clock'));
    assert.ok(codes("bot.game.internals.current_game_time.day_count = 9;").includes('clock'));
    assert.ok(codes("await bot.game.ticks(500);").includes('clock'));
    assert.ok(codes("const bot = await leadBot(null, {seed: 1});\nawait other({seed: 2});").includes('seed'));
});

test('lead bot lint: rejects state writes and teleports', () => {
    assert.ok(codes("save.availabilities.dialogue.oldCraftsman = 1;").includes('write'));
    assert.ok(codes("bot.game.internals.character.money += 999;").includes('write'));
    assert.ok(codes("await bot.call('change_location', {location_id: 'Shack'});").includes('teleport'));
    assert.ok(codes("await bot.call(name);").includes('dynamic'));
});

test('lead bot: logs every action with verb, target, cost and world minute', async t => {
    const bot = await leadBot(null, {seed: 20261014, wallStart: Date.UTC(2026, 0, 1, 12)});
    t.after(() => bot.close());
    const start = bot.minute();
    await bot.click('.choice_dialogue');
    await bot.click('[data-dialogue="villageElder"]');
    await bot.click('[data-textline="hello"]');
    await bot.click('#center_mode_back');
    await bot.step(15);
    await bot.save('after-talk');
    await bot.load('after-talk');
    await assert.rejects(bot.call('change_location', {location_id: 'Shack'}), /not a markup control/);
    await assert.rejects(bot.click('#no-such-element'), /No element/);
    const verbs = bot.log.map(e => e.verb);
    assert.deepEqual(verbs, ['click', 'click', 'click', 'click', 'step', 'save', 'load', 'click']);
    for(const e of bot.log) {
        assert.equal(typeof e.verb, 'string');
        assert.ok(e.target, 'target recorded');
        assert.ok(Number.isInteger(e.worldMinute), 'world minute recorded');
        assert.ok(e.cost && Number.isFinite(e.cost.minutes) && Number.isFinite(e.cost.money), 'cost recorded');
    }
    assert.equal(bot.log[0].worldMinute, start);
    assert.ok(bot.log[4].cost.minutes >= 15, 'step cost is the minutes it took');
    assert.ok(bot.log.at(-1).error, 'failed action is logged with its error');
    assert.ok(bot.log[5].worldMinute >= start + 15);
});
