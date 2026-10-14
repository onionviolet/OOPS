import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaultCheatState, grantCheat, optionalStartCard, awakenCheats, validateCheatState, awakenedStatusCard} from '../src/cheat_cards.js';
import {importSaveFile, encodeSaveFile} from '../src/save_files.js';
import {cheatGame} from './helpers/cheat_game.mjs';
const at = {year:999, month:4, day:1, hour:8, minute:0, day_count:1};
const dormant = () => grantCheat(defaultCheatState(), optionalStartCard(), {route:'optional-start', at});

test('cheat awakening rejects message-free discovery and preserves legacy messages', () => {
    const state = dormant(); state.held['system-quests'].card.state.awakened = true;
    assert.throws(() => validateCheatState(state), /system-quests.*first system message/);
    assert.equal(awakenedStatusCard(state), undefined);
    state.held['system-quests'].card.state = {};
    assert.deepEqual(validateCheatState(state), state);
    state.held['system-quests'].messages.push({text:'Legacy first message', at});
    assert.ok(awakenedStatusCard(validateCheatState(state)));
    const awake = awakenCheats(dormant(), {dayCount:3, at});
    assert.equal(awake.state.held['system-quests'].messages.length, 1);
    assert.deepEqual(awakenCheats(awake.state, {dayCount:4, at}).messages, []);
});

test('cheat awakening invalid points and missing message refuse before import preflight or writes', async () => {
    const base = JSON.parse(readFileSync(new URL('../docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/dormant_day3.save.txt', import.meta.url), 'utf8'));
    for(const mutation of [h => h.card.state.points=-1, h => h.card.state.points=.5,
        h => h.card.state.points=Number.MAX_SAFE_INTEGER+1, h => h.card.state.awakened=true]) {
        const save = structuredClone(base); mutation(save.cheats.held['system-quests']);
        await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(save)), {currentVersion:save['game version'],
            preflight: () => assert.fail('must reject before preflight'), storage:{setItem(){assert.fail('must reject before writes');}}, key:'save data'}), /cheat card system-quests/);
    }
});

test('cheat awakening clock jump commits first message before live discovery and retries failed storage', async () => {
    const g = await cheatGame({start:'system-quests'});
    try {
        const failed = await g.page.evaluate(() => {
            const old = Storage.prototype.setItem;
            window.cheatAwakeningStorage = old;
            window.cheatAwakeningAttempts = 0;
            Storage.prototype.setItem = function(key, value) {
                if(key==='save data' && JSON.parse(value).cheats?.held?.['system-quests']?.card.state.awakened) {
                    cheatAwakeningAttempts++;
                    throw new DOMException('test awakening quota fault','QuotaExceededError');
                }
                return old.call(this,key,value);
            };
            const t=JSON.parse(__cheatTest.create_save())['current time'];
            __cheatTest.advance((3-t.day_count)*1440-t.hour*60-t.minute+10);
            return {live:__cheatTest.read(), durable:JSON.parse(localStorage.getItem('save data')).cheats,
                attempts:cheatAwakeningAttempts, panel:document.querySelector('#status_window_panel').hidden};
        });
        assert.ok(failed.attempts>0);
        assert.equal(failed.live.held['system-quests'].card.state.awakened, false);
        assert.deepEqual(failed.live.held['system-quests'].messages, []);
        assert.equal(failed.durable.held['system-quests'].card.state.awakened, false);
        assert.equal(failed.panel, true);
        const recovered = await g.page.evaluate(() => {
            Storage.prototype.setItem = cheatAwakeningStorage;
            __cheatTest.advance(1);
            return {live:__cheatTest.read(), durable:JSON.parse(localStorage.getItem('save data')).cheats};
        });
        assert.deepEqual(recovered.live, recovered.durable);
        assert.equal(recovered.live.held['system-quests'].card.state.awakened, true);
        assert.equal(recovered.live.held['system-quests'].messages.length, 1);
        const again = await g.page.evaluate(() => {__cheatTest.advance(1); return __cheatTest.read();});
        assert.deepEqual(again, recovered.live);
        assert.deepEqual(g.errors, []);
    } finally {await g.close();}
});

test('cheat awakening does not mistake a partial enemy kill for a won fight on load', async () => {
    const g = await cheatGame({start:'system-quests'});
    try {
        const observed = await g.page.evaluate(() => {
            // Fault input: a valid saved bestiary kill, with zero won zone rounds.
            // A group may still have another living enemy. No clock milestone met.
            const save=JSON.parse(__cheatTest.create_save());
            save.enemy_killcount={'Wolf rat':1};
            __cheatTest.load(save);
            __cheatTest.advance(1);
            return __cheatTest.read();
        });
        assert.equal(observed.held['system-quests'].card.state.awakened, false);
        assert.deepEqual(observed.held['system-quests'].messages, []);
        assert.deepEqual(g.errors, []);
    } finally {await g.close();}
});
