import test from 'node:test';
import assert from 'node:assert/strict';
import {componentThemeTokens, contrast} from '../src/component_themes.js';
import {combatLogEvent, combatLogKey, combatLogText, encounterSerial} from '../src/combat_log.js';

const hero = {name: 'Hero', tags: {main_character: true}};
const rat = name => ({name, tags: {}});
const fight = (...enemies) => ({attackers: [hero], defenders: enemies});

test('letters follow native slots and only appear when a side has more than one fighter', () => {
    const [a, b] = [rat('Wolf rat'), rat('Wolf rat')], many = fight(a, b), one = fight(rat('Wolf rat'));
    const hit = combatLogEvent(many, {fighter: b, fighterIndex: 1, isAttacker: false, target: hero, outcome: 'hit', amount: 2.43});
    assert.equal(combatLogText(hit), 'Wolf rat B hits you for 2.5');
    assert.equal(hit.direction, 'taken');
    const solo = combatLogEvent(one, {fighter: hero, fighterIndex: 0, isAttacker: true, target: one.defenders[0], outcome: 'miss'});
    assert.equal(combatLogText(solo), 'You miss Wolf rat');
    assert.equal(solo.direction, 'dealt');
});

test('wording covers crit, multi-hit, partial block, full block and defeat', () => {
    const c = fight(rat('Rat'), rat('Rat'), rat('Rat')), [, , t] = c.defenders;
    const ev = o => combatLogEvent(c, {fighter: hero, fighterIndex: 0, isAttacker: true, target: t, ...o});
    assert.equal(combatLogText(ev({outcome: 'hit', amount: 3, hits: 2, critical: true, partial: true})), 'You crit Rat C for 3 (2 hits, part blocked)');
    assert.equal(combatLogText(ev({outcome: 'block'})), 'Rat C blocks you');
    assert.equal(combatLogText(ev({outcome: 'defeat'})), 'Rat C defeated');
    assert.equal(combatLogText(combatLogEvent(c, {fighter: t, fighterIndex: 2, isAttacker: false, target: hero, outcome: 'block'})), 'You block Rat C');
});

test('UX18 key: only equivalent events share it; defeats never collapse; encounters differ', () => {
    const c = fight(rat('Rat'), rat('Rat')), [a, b] = c.defenders;
    const ev = (fighter, i, o) => combatLogEvent(c, {fighter, fighterIndex: i, isAttacker: false, target: hero, outcome: 'hit', amount: 2, ...o});
    assert.equal(combatLogKey(ev(a, 0)), combatLogKey(ev(a, 0)));
    for (const other of [ev(b, 1), ev(a, 0, {amount: 3}), ev(a, 0, {critical: true}), ev(a, 0, {hits: 2}), ev(a, 0, {partial: true}), ev(a, 0, {outcome: 'miss'})])
        assert.notEqual(combatLogKey(other), combatLogKey(ev(a, 0)));
    assert.equal(combatLogKey(combatLogEvent(c, {fighter: hero, fighterIndex: 0, isAttacker: true, target: a, outcome: 'defeat'})), '');
    // A same-named rat in the same slot of the next wave is another encounter.
    const next = fight(rat('Rat'), rat('Rat'));
    assert.notEqual(encounterSerial(next), encounterSerial(c));
    assert.notEqual(combatLogKey(combatLogEvent(next, {fighter: next.defenders[0], fighterIndex: 0, isAttacker: false, target: hero, outcome: 'hit', amount: 2})), combatLogKey(ev(a, 0)));
});

test('custom palettes keep each log role readable and dealt apart from taken', () => {
    // styles/combat_log.css maps the log roles onto these recovered theme tokens.
    const roles = {dealt: '--theme-warning', taken: '--theme-danger', ally: '--theme-accent', hostile: '--theme-text', quiet: '--theme-muted'};
    for (const background of ['#1c243b', '#f4f1e8', '#7f7f7f', '#000000', '#ffffff']) {
        const t = componentThemeTokens({componentTheme: 'neutral', palette: {background, text: '#f1f2f5', accent: '#9bb4ae'}});
        for (const [role, token] of Object.entries(roles)) assert.ok(contrast(t[token], background) >= 4.5, `${role} on ${background}`);
    }
    const t = componentThemeTokens({componentTheme: 'neutral', palette: {background: '#1c243b', text: '#f1f2f5', accent: '#9bb4ae'}});
    assert.notEqual(t['--theme-warning'], t['--theme-danger']);
    assert.notEqual(t['--theme-accent'], t['--theme-text']);
});

import {addCombatOccurrence, COMBAT_OCCURRENCE_WINDOW} from '../src/combat_log.js';
import {createDom} from '../scripts/headless/dom.mjs';
import {normalizeDisplaySettings, setDisplaySettings, getDisplaySetting, resetDisplaySettings, registerPanelSettings, exportDisplayPreferences, adoptDisplayPreferences} from '../src/display_settings.js';

test('long repeat groups keep exact totals and bounded truthful detail without moving an open snapshot', () => {
    const dom = createDom();dom.loadHTML('<html><body></body></html>');const {document} = dom;
    const message = document.createElement('div'); document.body.append(message);
    for (let i = 1; i <= 12000; i++) addCombatOccurrence(message, `08:00 · Rat ${i % 2 + 1} of 2`);
    assert.equal(message.combatOccurrenceTotal, 12000);
    assert.equal(message.combatOccurrences.length, COMBAT_OCCURRENCE_WINDOW);
    const button = message.querySelector('.log-repeat');button.focus();button.click();
    const snapshot = message.querySelector('.log-occurrences'), first = snapshot.querySelector('li');
    assert.equal(snapshot.querySelectorAll('li').length, 100);
    assert.match(snapshot.textContent, /11901–12000/);
    assert.match(snapshot.textContent, /older labels are discarded/);
    assert.match(snapshot.textContent, /Rat 2 of 2/);
    addCombatOccurrence(message, '08:01 · Rat 1 of 2');
    assert.equal(message.dataset.repeat, '12001');
    assert.equal(message.combatOccurrences.length, 100);
    assert.equal(message.querySelector('.log-repeat'), button);
    assert.equal(document.activeElement, button);
    assert.equal(snapshot.querySelector('li'), first);
    assert.equal(snapshot.querySelectorAll('li').length, 100);
    assert.match(snapshot.textContent, /11901–12000/);
    button.click();button.click();
    assert.match(message.querySelector('.log-occurrences').textContent, /11902–12001/);
    assert.match(message.querySelector('.log-occurrences').textContent, /08:01 · Rat 1 of 2/);
});

test('combat repeat preference normalizes and shares browser reset/export/import', () => {
    const priorStorage = globalThis.localStorage;
    const values = new Map();globalThis.localStorage = {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
    assert.equal(normalizeDisplaySettings({combatRepeatMode: 'unknown'}).combatRepeatMode, 'stack');
    setDisplaySettings({combatRepeatMode:'detailed'});
    const saved = exportDisplayPreferences();
    resetDisplaySettings();assert.equal(getDisplaySetting('combatRepeatMode'), 'stack');
    adoptDisplayPreferences(saved);assert.equal(getDisplaySetting('combatRepeatMode'), 'detailed');
    resetDisplaySettings();
    registerPanelSettings({id:'ig-import',title:'Import lifecycle',settings:[{key:'introduced',default:'new',options:[['new','New'],['seen','Seen']]}]});
    setDisplaySettings({'panel.ig-import.introduced':'seen'});
    assert.equal(JSON.parse(values.get('yairpg.display.v1')).combatRepeatMode, undefined, 'automatic metadata does not persist an unrelated default');
    adoptDisplayPreferences(saved);assert.equal(getDisplaySetting('combatRepeatMode'), 'detailed');
    setDisplaySettings({combatRepeatMode:'stack'});adoptDisplayPreferences(saved);
    assert.equal(getDisplaySetting('combatRepeatMode'), 'stack', 'explicit local choice wins imported preference');
    resetDisplaySettings();globalThis.localStorage = priorStorage;
});

test('the compact hit line carries the damage type and the weak-spot note, and stays plain when untyped', () => {
    const c = fight(rat('River crab')), crab = c.defenders[0];
    const ev = o => combatLogEvent(c, {fighter: hero, fighterIndex: 0, isAttacker: true, target: crab, outcome: 'hit', amount: 3.1, ...o});
    assert.equal(combatLogText(ev({kind: 'bludgeoning', note: 'weak spot', hits: 3})), 'You hit River crab for 3.1 bludgeoning (3 hits, weak spot)');
    assert.equal(combatLogText(ev({kind: 'physical'})), 'You hit River crab for 3.1');
    assert.notEqual(combatLogKey(ev({kind: 'bludgeoning'})), combatLogKey(ev({kind: 'slashing'})));
});
