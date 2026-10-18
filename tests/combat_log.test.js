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
