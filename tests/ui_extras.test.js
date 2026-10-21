import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {rankEntries, registerPaletteSource, collectPaletteEntries, unregisterPaletteSource} from '../src/command_palette.js';
import {registerShortcut, shortcutGroups, unregisterShortcut} from '../src/shortcut_registry.js';
import {visibleText} from '../src/dom_text.js';
import {rowCommands} from '../src/row_context_menu.js';
import {newKeys, registerChangeCounter, pollBadges, badgeCount, markSeen} from '../src/change_badges.js';
import {projectKnownThings, matches} from '../src/known_things.js';
import {projectStatistics} from '../src/statistics_panel.js';
import {activityHours, runningCommitments} from '../src/today_strip.js';
import {projectRegion} from '../src/region_view.js';
import {projectCompanions} from '../src/companion_roster.js';
import {planLoadout, validateLoadouts, migrateLoadouts, fresh, saveCurrentAs, deleteLoadout, MAX_SETS} from '../src/loadouts.js';
import {configureUiPorts, readPort} from '../src/ui_ports.js';

test('palette ranks prefix matches first, needs every word and survives a failing source', () => {
    const entries = [{label: 'Inventory'}, {label: 'Belongings'}, {label: 'Old inventory notes', detail: 'in the Journal'}, {label: 'Journal'}];
    assert.deepEqual(rankEntries(entries, 'inv').map(e => e.label), ['Inventory', 'Old inventory notes']);
    assert.deepEqual(rankEntries(entries, 'journal inv').map(e => e.label), ['Old inventory notes']);
    assert.deepEqual(rankEntries(entries, 'zzz'), []);
    registerPaletteSource('boom', () => { throw new Error('source failed'); });
    registerPaletteSource('ok', () => [{label: 'Fine', group: 'G', run() {}}]);
    assert.equal(collectPaletteEntries().filter(e => e.source === 'ok').length, 1);
    unregisterPaletteSource('boom'); unregisterPaletteSource('ok');
});

test('shortcut registry groups by scope and rejects an incomplete entry', () => {
    registerShortcut({id: 't1', keys: 'X', label: 'Do x', scope: 'Test scope'});
    registerShortcut({id: 't2', keys: 'Y', label: 'Do y', scope: 'Test scope'});
    const group = shortcutGroups().find(g => g.scope === 'Test scope');
    assert.deepEqual(group.items.map(i => i.keys), ['X', 'Y']);
    assert.throws(() => registerShortcut({id: 't3', keys: 'Z'}), /needs an id/);
    unregisterShortcut('t1'); unregisterShortcut('t2');
});

test('row menu lists the inventory div controls, labels without icon text, and clicks the real control', () => {
    const previous = globalThis.document, dom = createDom();
    dom.loadHTML('<html><body><div id="inventory_content_div"><div class="inventory_item_control character_item_usable" id="row">'
        + '<div class="inventory_item"><div class="item_fav_div"><i class="material-icons item_fav_icon">star_border</i></div><span class="item_name">Bread</span></div>'
        + '<div class="item_additional_content"><div class="item_use_button">[use]</div><div class="item_auto_use_button">auto</div></div></div></div></body></html>');
    globalThis.document = dom.document;
    try {
        const row = dom.document.getElementById('row');
        const commands = rowCommands(row);
        assert.deepEqual(commands.map(c => c.label), ['Toggle favorite', 'Use', 'Toggle auto-use']);
        let clicked = null;
        for (const c of commands) c.button.addEventListener('click', () => { clicked = c.label; });
        commands[1].button.click();
        assert.equal(clicked, 'Use');
        assert.equal(commands[0].button.className, 'material-icons item_fav_icon', 'the favourite star is clicked by its icon, as the list handler expects');
        const dropdown = dom.document.createElement('div');
        dropdown.innerHTML = '<i class="material-icons">question_answer</i> Talk to someone<div role="button">Talk to village elder</div>';
        assert.equal(visibleText(dropdown), 'Talk to someone');
    } finally { globalThis.document = previous; }
});

test('change counters count only rows that are new against what was seen', () => {
    assert.equal(newKeys(['a', 'b', 'c'], new Set(['a'])), 2);
    assert.equal(newKeys([], new Set(['a'])), 0);
});

test('known things lists only what was met and filters by name and detail', () => {
    const view = projectKnownThings({
        kills: {rat: 3, wolf: 0}, enemies: {rat: {name: 'Rat'}, wolf: {name: 'Wolf'}},
        bookProgress: {Primer: {accumulated_time: 50, required_time: 100}, Done: {accumulated_time: 9, required_time: 9}, Unopened: {accumulated_time: 0, required_time: 9}},
        bookItems: {}, found: {bread: {number: 5}, ghost: {number: 0}}, itemTemplates: {bread: {name: 'Stale bread'}},
        places: [{id: 'v', name: 'Village', detail: 'Region'}],
    });
    assert.deepEqual(view.creatures.map(r => r.name), ['Rat']);
    assert.deepEqual(view.books.map(r => `${r.name}:${r.detail}`), ['Done:Finished', 'Primer:50% read']);
    assert.deepEqual(view.items.map(r => r.name), ['Stale bread']);
    assert.deepEqual(view.places.map(r => r.name), ['Village']);
    assert.equal(matches(view.creatures[0], 'defeat'), true);
    assert.equal(matches(view.creatures[0], 'wolf'), false);
    assert.deepEqual(projectKnownThings({}), {creatures: [], books: [], items: [], places: []});
});

test('statistics only reorders counters the game already keeps, ranks skills and caps lists', () => {
    const skills = Object.fromEntries(Array.from({length: 14}, (_, i) => [`S${i}`, {current_level: i}]));
    const view = projectStatistics({counters: {playtime_hours: 1.5, kills: 12, money: 1234}, stats: {gathered_materials: {wood: 4, herb: 9}}, skills});
    assert.equal(view.lifetime.find(([l]) => l === 'Time played')[1], '1 h 30 min');
    assert.equal(view.lifetime.find(([l]) => l === 'Enemies defeated')[1], '12');
    assert.equal(view.lifetime.find(([l]) => l === 'Purse')[1], '1,234');
    assert.equal(view.skills.length, 10); assert.deepEqual(view.skills[0], ['S13', 'Lv 13']);
    assert.deepEqual(view.materials, [['herb', '9'], ['wood', '4']]);
    assert.deepEqual(projectStatistics({}).skills, []);
});

test('today reports open now, time to opening and closed-until-tomorrow, and never labels a running commitment', () => {
    const hours = {start: 8, end: 18};
    assert.match(activityHours(600, hours, true).text, /^Open now/);
    assert.match(activityHours(6 * 60, hours, false).text, /opens in 2 h/);
    assert.match(activityHours(20 * 60, hours, false).text, /until tomorrow/);
    const expansion = {clock: 100, pending: [{due: 130, label: 'SECRET OUTCOME', context: {actorId: 'player'}}, {due: 110, label: 'another', context: {actorId: 'player'}}, {due: 105, context: {actorId: 'npc'}}]};
    assert.deepEqual(runningCommitments(expansion), {count: 2, nextIn: 10});
    assert.ok(!JSON.stringify(runningCommitments(expansion)).includes('SECRET'));
    assert.deepEqual(runningCommitments(null), {count: 0, nextIn: null});
});

test('region lists only reachable roads, skips challenges and names the way back', () => {
    const shack = {id: 'Shack', name: 'Shack', tags: {safe_zone: true}}, cave = {id: 'Cave', name: 'Cave', tags: {safe_zone: false}}, hidden = {id: 'Hidden', name: 'Hidden', tags: {}}, trial = {id: 'Trial', name: 'Trial', is_challenge: true};
    const village = {id: 'Village', name: 'Village', connected_locations: [{location: shack, travel_time: 10}, {location: cave, travel_time: 70}, {location: hidden, travel_time: 5}, {location: trial, travel_time: 1}], parent_location: {id: 'Town', name: 'Town'}};
    const view = projectRegion(village, {reachable: t => t.id !== 'Hidden', times: {Village: {Cave: 75, Town: 20}}});
    assert.deepEqual(view.rows.map(r => r.name), ['Shack', 'Cave', 'Back to Town']);
    assert.equal(view.rows[0].detail, '10 min away');
    assert.equal(view.rows[1].detail, '1 h 15 min away · combat zone');
    assert.deepEqual(projectRegion(null), {here: '', rows: []});
});

test('companions show Lio only once met and other people only when met', () => {
    const base = {clock: 10, actors: {player: {facts: {}}}, simulation: {people: {partyPartner: {location: 'Village', vitals: {health: 40, max_health: 50, stamina: 9, max_stamina: 10}}}, jobs: []}};
    assert.deepEqual(projectCompanions(base, []), []);
    const met = {...base, actors: {player: {facts: {'party.met': true}}}};
    const rows = projectCompanions(met, [{id: 'p1', name: 'Mira', role: 'tinker', status: 'resident', action: 'resting', met: true}, {id: 'p2', name: 'Unmet traveler', role: 'x', status: 'visiting', action: 'browsing', met: false}]);
    assert.deepEqual(rows.map(r => r.name), ['Lio', 'Mira']);
    assert.match(rows[0].detail, /40\/50 health, 9\/10 stamina/);
    assert.match(rows[1].detail, /settled here/);
});

test('loadout slice validates, migrates a missing slice and rejects damage', () => {
    assert.deepEqual(migrateLoadouts(null), fresh());
    assert.doesNotThrow(() => validateLoadouts(null));
    assert.doesNotThrow(() => validateLoadouts({schema: 1, sets: [{name: 'A', slots: {weapon: '{"id":"x"}'}}]}));
    for (const bad of [{schema: 2, sets: []}, {schema: 1, sets: 'x'}, {schema: 1, sets: [{name: '', slots: {}}]}, {schema: 1, sets: [{name: 'A', slots: {Weapon: 'k'}}]},
        {schema: 1, sets: [{name: 'A', slots: {}}, {name: 'A', slots: {}}]}, {schema: 1, sets: Array.from({length: MAX_SETS + 1}, (_, i) => ({name: `N${i}`, slots: {}}))}])
        assert.throws(() => validateLoadouts(bad), /Invalid loadouts/);
});

test('planning a loadout keeps worn items, equips held ones, names missing ones and bares others only on request', () => {
    const set = {name: 'S', slots: {weapon: 'sword', legs: 'pants', head: 'helm'}};
    const plan = planLoadout(set, {weapon: 'sword', legs: 'rags', ring: 'band'}, ['pants']);
    assert.deepEqual(plan.map(r => `${r.slot}:${r.action}`), ['weapon:keep', 'legs:equip', 'head:missing']);
    assert.equal(plan[1].replaces, 'rags');
    const bare = planLoadout(set, {weapon: 'sword', legs: 'rags', ring: 'band'}, ['pants'], {bareOthers: true});
    assert.deepEqual(bare.at(-1), {slot: 'ring', key: 'band', action: 'bare'});
    // The same item under another durability instance counts as that item.
    const a = JSON.stringify({id: 'pants', quality: 40, e2_instance: 'e2.1'}), b = JSON.stringify({id: 'pants', quality: 40, e2_instance: 'e2.9'});
    assert.equal(planLoadout({name: 'S', slots: {legs: a}}, {}, [b])[0].action, 'equip');
});

test('saving and deleting loadouts enforces names, content and the set limit', () => {
    configureUiPorts(null);
    assert.throws(() => saveCurrentAs('  ', {legs: 'k'}), /Name the loadout/);
    assert.throws(() => saveCurrentAs('A', {}), /nothing to remember/);
    assert.equal(saveCurrentAs('  Everyday\u0007  gear ', {legs: 'k'}), 'Everyday gear');
    assert.equal(saveCurrentAs('Everyday gear', {legs: 'k2'}), 'Everyday gear', 'the same name replaces, not duplicates');
    for (let i = 1; i < MAX_SETS; i++) saveCurrentAs(`Set ${i}`, {legs: 'k'});
    assert.throws(() => saveCurrentAs('One too many', {legs: 'k'}), /can keep/);
    deleteLoadout('Everyday gear');
    assert.equal(saveCurrentAs('One too many', {legs: 'k'}), 'One too many');
    for (let i = 1; i < MAX_SETS; i++) deleteLoadout(`Set ${i}`);
    deleteLoadout('One too many');
});

test('ports read as absent when missing or throwing', () => {
    configureUiPorts(null);
    assert.equal(readPort('character'), undefined);
    configureUiPorts({character: () => { throw new Error('mid-load'); }, counters: () => ({kills: 2})});
    assert.equal(readPort('character'), undefined);
    assert.deepEqual(readPort('counters'), {kills: 2});
    configureUiPorts(null);
});

test('badges take the baseline while the start screen is open and for a moment after, skip a source that is not ready, then count new rows', () => {
    const previous = globalThis.document, dom = createDom();
    dom.loadHTML('<html><body></body></html>'); globalThis.document = dom.document;
    try {
        let rows = null; const shown = {on: false};
        registerChangeCounter('t-badge', {read: () => rows, showing: () => shown.on});
        const root = dom.document.documentElement;
        root.dataset.startScreen = 'open';
        rows = ['a', 'b']; pollBadges(0);
        assert.equal(badgeCount('t-badge'), 0, 'rows present while the start screen is open are the baseline');
        root.dataset.startScreen = 'closed';
        rows = ['a', 'b', 'c']; pollBadges(1000);
        assert.equal(badgeCount('t-badge'), 0, 'rows restored just after play are still baseline');
        pollBadges(1000 + 2600);
        rows = ['a', 'b', 'c', 'd']; pollBadges(1000 + 2700);
        assert.equal(badgeCount('t-badge'), 1, 'a row that appears later is new');
        rows = null; pollBadges(1000 + 2800);
        assert.equal(badgeCount('t-badge'), 1, 'a source that is not ready changes nothing');
        shown.on = true; rows = ['a', 'b', 'c', 'd']; pollBadges(1000 + 2900);
        assert.equal(badgeCount('t-badge'), 0, 'showing the panel clears it');
        shown.on = false; rows = ['a', 'b', 'c', 'd', 'e']; pollBadges(1000 + 3000);
        assert.equal(badgeCount('t-badge'), 1);
        markSeen('t-badge');
        assert.equal(badgeCount('t-badge'), 0, 'opening the route clears it');
    } finally { globalThis.document = previous; }
});
