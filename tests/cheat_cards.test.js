import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateCheatCard, validateCheatState, defaultCheatState, grantCheat, recordCheatMessage, SYSTEM_QUESTS_CARD} from '../src/cheat_cards.js';
import {encodeSaveFile, importSaveFile} from '../src/save_files.js';
import {cheatGame} from './helpers/cheat_game.mjs';
const at = {year: 999, month: 4, day: 1, hour: 8, minute: 0};

test('cheat validators reject malformed cards and held state', () => {
    assert.deepEqual(validateCheatCard(SYSTEM_QUESTS_CARD), SYSTEM_QUESTS_CARD);
    for(const card of [{...SYSTEM_QUESTS_CARD, id: ''}, {...SYSTEM_QUESTS_CARD, ui: 'no-panel'},
        {...SYSTEM_QUESTS_CARD, terms: 'revocable'}, {...SYSTEM_QUESTS_CARD, extra: true},
        {...SYSTEM_QUESTS_CARD, hooks: {}}, {...SYSTEM_QUESTS_CARD, state: {run: () => {}}}]) {
        assert.throws(() => validateCheatCard(card), /cheat/i);
    }
    assert.throws(() => validateCheatState({...defaultCheatState(), schema: 2}), /schema/);
    assert.throws(() => validateCheatState(null), /cheat/);
    const held = grantCheat(defaultCheatState(), SYSTEM_QUESTS_CARD, {route: 'test-fixture', at});
    held.held['system-quests'].card.id = 'wrong';
    assert.throws(() => validateCheatState(held), /id/);
});

test('cheat grants and messages are pure and retain acquisition', () => {
    const empty = defaultCheatState();
    const held = grantCheat(empty, SYSTEM_QUESTS_CARD, {route: 'test-fixture', at});
    const next = recordCheatMessage(held, 'system-quests', 'Your system is awake.', at);
    assert.deepEqual(empty, defaultCheatState());
    assert.deepEqual(held.held['system-quests'].messages, []);
    assert.equal(next.held['system-quests'].messages[0].text, 'Your system is awake.');
    at.minute = 1;
    assert.equal(next.held['system-quests'].acquired.at.minute, 0);
    at.minute = 0;
    assert.throws(() => grantCheat(held, SYSTEM_QUESTS_CARD, {route: 'test-fixture', at}), /already/);
    assert.throws(() => recordCheatMessage(empty, 'missing', 'Hello', at), /unheld/);
});

test('cheat old-save load and real create_save encode import round trip', async () => {
    const game = await cheatGame();
    try {
        const old = JSON.parse(readFileSync(new URL('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/fixtures/precombat.save.txt', import.meta.url), 'utf8'));
        delete old.cheats;
        await game.page.evaluate(save => __cheatTest.load(save), old);
        const saved = await game.page.evaluate(() => __cheatTest.create_save());
        assert.deepEqual(JSON.parse(saved).cheats, defaultCheatState());
        const cheats = recordCheatMessage(grantCheat(defaultCheatState(), SYSTEM_QUESTS_CARD, {route: 'test-fixture', at}), 'system-quests', 'Your system is awake.', at);
        await game.page.evaluate(value => __cheatTest.set(value), cheats);
        const serialized = await game.page.evaluate(() => __cheatTest.create_save());
        let stored;
        const imported = await importSaveFile(encodeSaveFile(serialized), {currentVersion: old['game version'],
            preflight: save => game.page.evaluate(value => __cheatTest.load(value), save),
            storage: {setItem(key, value) {stored = value;}}, key: 'save data'});
        assert.deepEqual(imported.cheats, cheats);
        assert.deepEqual(JSON.parse(stored).cheats, cheats);
        assert.deepEqual(await game.page.evaluate(() => JSON.parse(__cheatTest.create_save()).cheats), cheats);
        assert.deepEqual(game.errors, []);
    } finally {await game.close();}
});

test('cheat invalid imported card is rejected before preflight or storage', async () => {
    const save = JSON.parse(readFileSync(new URL('../docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/held_system.save.txt', import.meta.url), 'utf8'));
    delete save.cheats.held['system-quests'].card.id;
    await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(save)), {currentVersion: save['game version'],
        preflight: () => assert.fail('invalid cheat must not load'), storage: {setItem() {assert.fail('invalid cheat must not write');}}, key: 'save data'}), /cheat card/i);
});
