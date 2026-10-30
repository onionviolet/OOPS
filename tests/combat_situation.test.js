import test from 'node:test';
import assert from 'node:assert/strict';
import {fightSituation, chaseSituation, hardestBlow, chanceWord} from '../src/ui/combat_situation.js';
import {validateFigureSpec, figureText} from '../src/ui/figure.js';
import {fromCombatOpponentsProjection} from '../src/opponent_board.js';
import {projectOpponents} from '../src/combat_opponents_domain.js';
import {DUEL_BOARD, BRAWL_BOARD, COMBAT_FIXTURES} from '../src/ui/preview/fixtures/combat.js';

const you = (current, extra = {}) => ({name: 'You', health: {current, max: 40}, speed: .8, defense: 2, minDamageShare: .05, damageTaken: 1, sideSize: 1, ...extra});

test('one on one: chances in words with the shown number, both sides named (UR40)', () => {
    const s = fightSituation(DUEL_BOARD, you(30));
    assert.equal(s.odds.shown, true);
    assert.match(s.odds.text, /you hit usually \(82%\)/);
    assert.match(s.odds.text, /Ditch reaver hits you more often than not \(71%\)/);
    assert.equal(chanceWord(50), 'about half the time');
});

test('several opponents: ratings never become chances or chance words', () => {
    const s = fightSituation(BRAWL_BOARD, you(30));
    assert.equal(s.odds.shown, false);
    assert.doesNotMatch(s.odds.text, /%|usually|often|rarely|sometimes/);
    assert.match(s.odds.text, /not chances/);
});

test('intent is unassessed until a source exists, never inferred from speed', () => {
    for (const board of [DUEL_BOARD, BRAWL_BOARD]) {
        const s = fightSituation(board, you(30));
        assert.match(s.intent, /unassessed/);
        assert.ok(s.spec.notes.some(n => n.state === 'unknown' && n.text === s.intent));
    }
});

test('lethal line is a stated bound: hardest ordinary roll after own defense, crits excluded', () => {
    // 9 dmg x2, roll up to 1.2 -> 10.8 each, minus defense 2 -> 8.8 each -> 17.6.
    assert.equal(hardestBlow({power: 9, count: 2}, {defense: 2}), 17.6);
    const low = fightSituation(DUEL_BOARD, you(14));
    assert.equal(low.lethal[0].level, 'lethal');
    assert.match(low.lethal[0].text, /hardest ordinary blow could take 17\.6 hp after your defense, and you have 14/);
    assert.equal(low.spec.nodes.find(n => n.id === 'opp-0').state, 'strained');
    assert.deepEqual(fightSituation(DUEL_BOARD, you(40)).lethal, []);
});

test('unknown facts stay unknown: no hidden value reaches health, lethal or tempo (UR36)', () => {
    const hidden = {opponents: [{id: 'h', slot: 0, letter: 'A', name: 'Stranger', knowledge: 'unknown', defeated: false,
        health: {text: '50/50 hp', progress: 100, knowledge: 'unknown'},
        facts: [{label: 'Attack', value: '99 dmg', knowledge: 'unknown'}, {label: 'Speed', value: '9 /s', knowledge: 'unknown'}]}]};
    const s = fightSituation(hidden, you(5));
    assert.deepEqual(s.lethal, []);
    assert.match(s.tempo, /not assessed/);
    const node = s.spec.nodes.find(n => n.id === 'opp-0');
    assert.equal(node.state, 'unknown');
    assert.match(node.label, /\?\?\? hp/);
    assert.doesNotMatch(figureText(s.spec), /99|50\/50|9 \/s/);
});

test('with allies on your side the target is unread; a defeated opponent draws no strike', () => {
    const s = fightSituation(BRAWL_BOARD, you(30, {sideSize: 2}));
    assert.ok(s.spec.edges.every(e => e.state === 'unknown' && e.label === 'target unread'));
    assert.equal(s.spec.edges.length, 3);
    assert.equal(s.spec.nodes.find(n => n.id === 'opp-0').state, 'broken');
});

test('an unassessed opponent turns the together line into a lower bound', () => {
    const s = fightSituation(BRAWL_BOARD, you(5));
    assert.ok(s.lethal.some(l => /Lethal together: if the assessed ones .* at least 5\.6 hp/.test(l.text)));
});

test('the real projection path: projectOpponents -> board -> situation', () => {
    const fighter = (name, extra = {}) => ({name, is_alive: true, tags: {}, ...extra});
    const combat = {is_ended: false, attackers: [fighter('Hero', {tags: {main_character: true}})], defenders: [fighter('Fen cat')]};
    const readout = () => ({name: 'Fen cat', defeated: false, health: {current: 8, max: 10, bar: 80}, attack: {power: 5, count: 1}, speed: 1.6,
        solo: true, opposingShield: false, hitPct: 40, shield: false, evadePct: 10, defense: 0, youHitPct: 90});
    const board = fromCombatOpponentsProjection(projectOpponents(combat, readout));
    const s = fightSituation(board, you(30));
    assert.equal(s.active, true);
    assert.match(s.odds.text, /you hit usually \(90%\); Fen cat hits you sometimes \(40%\)/);
    assert.match(s.tempo, /Fen cat strikes about 2 times for each of your blows/);
    assert.equal(fightSituation({opponents: []}, you(30)).active, false);
});

test('chase is stages, with distance stated as not modelled', () => {
    const spec = chaseSituation({definitionId: 'x', label: 'Tail', status: 'encounter', text: 'Face to face.'});
    assert.deepEqual(spec.tracks[0].steps.map(s => s.state), ['done', 'done', 'current', 'pending']);
    assert.match(figureText(spec), /Distance: not modelled here/);
    assert.equal(chaseSituation(null), null);
});

test('every combat fixture is a valid figure spec with a text form', () => {
    for (const spec of COMBAT_FIXTURES) { validateFigureSpec(spec); assert.ok(figureText(spec).length > 40); }
});
