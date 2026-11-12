// Contest contract v0 (chat C, CFC1-CFC14): workings that meet, on K and W.
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

import {composeSubstrate, createWorld, readQuantity, readProvenance, explainEffect, serializeWorld, restoreWorld} from '../src/world_substrate.js';
import {WORKING_SCHEMA} from '../src/kernel_working.js';
import {DEFEAT_OUTCOMES} from '../src/defeat_domain.js';
import {defineContestLaw, beginContest, stepContest, runContest, serializeContest, restoreContest, quoteContestOdds,
    entrantView, LOSER_OUTCOMES} from '../src/contest.js';
import {contestPack, contestBody} from '../src/contest_bodies.js';

const LAW = defineContestLaw({id: 'c.test', revision: 0, lethal: false, moves: {
    jab: {resolver: 'strike', steps: [5], power: 4},
    heavy: {resolver: 'strike', steps: [10, 6], power: 9, costs: {stamina: 2}},
    slam: {resolver: 'strike', steps: [3], power: 6, staggers: true, aim: 3},
    hex: {resolver: 'notch', steps: [4], notch: 0, effects: [{verb: 'remove', object: 'vitality', amount: 5}]},
    ward: {kind: 'guard', target: 'self', steps: [30], block: {vitality: 3}},
}});

function arena(entrants, {extra = []} = {}) {
    const rules = composeSubstrate({packs: [contestPack({extra})]});
    const holders = [{id: 'yard', kind: 'place'}, ...entrants.map(e => contestBody(e.body ?? e.id, 'yard', {vitality: e.vitality ?? 30, stamina: e.stamina ?? 10}))];
    return {rules, world: createWorld(rules, {holders})};
}
const fighter = (id, side, more = {}) => ({id, side, body: id, profile: {attack: 12, evasion: 10, notch: 0, resist: 0}, moves: ['jab'], ...more});

function play(entrants, {seed = 7, detail = 'near', law = LAW, sides, until} = {}) {
    const {rules, world} = arena(entrants);
    const record = beginContest(law, {id: 'bout', seed, place: 'yard', entrants, sides, detail}, world);
    return {rules, ...runContest(law, record, rules, world, {}, {until})};
}

test('every move is a kernel working; each meeting lands on a W body with a ledger source and a cause chain', () => {
    const entrants = [fighter('a', 'red'), fighter('b', 'blue')];
    const {rules, world} = arena(entrants);
    let state = {record: beginContest(LAW, {id: 'bout', seed: 3, place: 'yard', entrants}, world), world};
    state = stepContest(LAW, state.record, rules, state.world);
    const working = Object.values(state.record.entrants).find(e => e.working)?.working;
    assert.equal(working.schema, WORKING_SCHEMA);
    const done = runContest(LAW, state.record, rules, state.world);
    const loser = done.record.result.winner === 'red' ? 'b' : 'a';
    assert.equal(readQuantity(done.world, loser, 'vitality'), 0);
    assert.ok(Object.keys(readProvenance(done.world, loser, 'vitality')).some(k => k.startsWith('contest:bout:')));
    const blow = done.world.chain.find(r => r.kind === 'contest.blow');
    assert.ok(blow && explainEffect(done.world, blow.seq).length >= 1);
    assert.ok(done.world.chain.some(r => r.kind === 'contest.down'));
    assert.equal(done.record.result.outcomes[loser], 'knocked_out');
    assert.equal(done.record.result.winnerOutcome, 'knocked_out');
});

test('loser outcomes are the defeat publisher list (CBR2)', () => {
    assert.deepEqual([...LOSER_OUTCOMES], [...DEFEAT_OUTCOMES]);
});

test('same seed, same fight; a save and reload mid-fight continues to the same end', () => {
    const entrants = [fighter('a', 'red', {moves: ['heavy', 'jab']}), fighter('b', 'blue', {moves: ['hex', 'jab']})];
    const straight = play(entrants);
    assert.deepEqual(play(entrants).record, straight.record);
    const {rules, world} = arena(entrants);
    let state = {record: beginContest(LAW, {id: 'bout', seed: 7, place: 'yard', entrants}, world), world};
    for (let i = 0; i < 9; i += 1) state = stepContest(LAW, state.record, rules, state.world);
    const record = restoreContest(LAW, JSON.parse(JSON.stringify(serializeContest(state.record))));
    const reloaded = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(state.world))));
    const resumed = runContest(LAW, record, rules, reloaded);
    assert.deepEqual(resumed.record.result, straight.record.result);
    assert.deepEqual(readQuantity(resumed.world, 'a', 'vitality'), readQuantity(straight.world, 'a', 'vitality'));
});

test('far detail runs the same rule: same outcomes and body totals, fewer world records (CFC12)', () => {
    const entrants = [fighter('a', 'red', {moves: ['heavy', 'jab']}), fighter('b', 'blue'), fighter('c', 'blue', {vitality: 12})];
    for (const seed of [1, 2, 3, 4, 5]) {
        const near = play(entrants, {seed}), far = play(entrants, {seed, detail: 'far'});
        assert.deepEqual(far.record.result, near.record.result);
        for (const id of ['a', 'b', 'c']) for (const q of ['vitality', 'stamina'])
            assert.equal(readQuantity(far.world, id, q), readQuantity(near.world, id, q), `${id} ${q} seed ${seed}`);
        assert.ok(far.world.chain.length < near.world.chain.length);
        assert.ok(far.world.chain.some(r => r.kind === 'contest.settled'));
    }
});

test('a hard enough blow cuts a working that has not finished; its cost stays spent (CFC6, KW8)', () => {
    const entrants = [fighter('a', 'red', {moves: ['heavy'], speed: 100}), fighter('b', 'blue', {moves: ['slam'], speed: 200, profile: {attack: 40, evasion: 10}})];
    const {rules, world} = arena(entrants);
    let state = {record: beginContest(LAW, {id: 'bout', seed: 11, place: 'yard', entrants}, world), world};
    let interrupted = null;
    for (let i = 0; i < 40 && !interrupted; i += 1) {
        state = stepContest(LAW, state.record, rules, state.world);
        const w = state.record.entrants.a.working;
        if (w?.status === 'interrupted' && w.receipts.at(-1).cause === 'host') interrupted = w;
    }
    assert.ok(interrupted, 'the slam broke the heavy blow');
    assert.ok(state.record.log.some(l => l.move === 'interrupted' && l.actor === 'a'));
    assert.equal(interrupted.receipts.filter(r => r.ok).length, interrupted.cursor, 'settled steps stay settled');
    assert.ok(readQuantity(state.world, 'a', 'stamina') < 10, 'the heavy blow was paid for at its start');
});

test('leaving is an attempt with a price; pursuers are recorded (CFC11)', () => {
    let got = 0, caught = 0;
    for (let seed = 1; seed <= 30; seed += 1) {
        const {record} = play([fighter('runner', 'red', {wants: {fleeAt: 1}, speed: 130}), fighter('hound', 'blue', {wants: {pursues: true}})], {seed});
        if (record.result.outcomes.runner === 'withdrew') {
            got += 1;
            assert.deepEqual(record.pursuits.map(p => [p.by, p.of]), [['hound', 'runner']]);
            assert.equal(record.result.winnerOutcome, 'drove_off');
        }
        if (record.log.some(l => l.move === 'withdraw' && l.outcome === 'caught')) caught += 1;
    }
    assert.ok(got > 15 && caught > 0, `got away ${got}, caught ${caught}`);
});

test('surrender is accepted or refused by the other side (CFC11)', () => {
    const yielder = fighter('y', 'red', {wants: {yieldAt: 1}});
    const accepted = play([yielder, fighter('m', 'blue', {wants: {acceptsSurrender: true}})]);
    assert.equal(accepted.record.result.outcomes.y, 'yielded');
    assert.equal(accepted.record.result.winnerOutcome, 'surrender_accepted');
    const refused = play([yielder, fighter('m', 'blue', {wants: {acceptsSurrender: false}})]);
    assert.ok(refused.record.log.some(l => l.move === 'yield' && l.outcome === 'refused'));
    assert.notEqual(refused.record.result.outcomes.y, 'yielded');
});

test('a held guard blocks what it names (EF3 counterplay)', () => {
    const hexer = fighter('h', 'red', {moves: ['hex'], profile: {notch: 0}});
    let open = 0, guarded = 0;
    for (let seed = 1; seed <= 40; seed += 1) {
        const plain = play([hexer, fighter('t', 'blue', {moves: ['jab'], vitality: 200})], {seed, until: 40});
        const warded = play([hexer, fighter('t', 'blue', {moves: ['ward', 'jab'], vitality: 200})], {seed, until: 40});
        open += plain.record.log.filter(l => l.actor === 'h' && l.outcome === 'hit').length;
        guarded += warded.record.log.filter(l => l.actor === 'h' && l.outcome === 'hit').length;
    }
    assert.ok(guarded < open * 0.7, `guarded ${guarded} vs open ${open}`);
});

test('the opening goes to who notices first (CFC5)', () => {
    const {rules, world} = arena([fighter('s', 'red'), fighter('w', 'blue')]);
    const record = beginContest(LAW, {id: 'ambush', seed: 1, place: 'yard', entrants: [
        fighter('s', 'red', {stealth: 30, perception: 20}), fighter('w', 'blue', {perception: 1})]}, world);
    assert.deepEqual(record.surprised, ['blue']);
    assert.ok(record.entrants.w.ready > record.entrants.s.ready);
    void rules;
});

test('injury lowers control before it stops the fighter (CBR22)', () => {
    const {world} = arena([fighter('a', 'red', {vitality: 30}), fighter('b', 'blue')]);
    const record = beginContest(LAW, {id: 'v', seed: 1, place: 'yard', entrants: [fighter('a', 'red'), fighter('b', 'blue')]}, world);
    assert.equal(entrantView(LAW, record, world, 'a').impair, 1);
    record.pending.a = {vitality: -16};
    const hurt = entrantView(LAW, record, world, 'a');
    assert.ok(hurt.impair < 1 && hurt.able);
});

test('a body that enters a fight already hurt fights impaired from its first meeting', () => {
    const entrants = [fighter('a', 'red', {vitality: 15, maxVitality: 30}), fighter('b', 'blue')];
    const {world} = arena(entrants);
    const record = beginContest(LAW, {id: 'w', seed: 1, place: 'yard', entrants}, world);
    assert.equal(record.entrants.a.max.vitality, 30);
    assert.ok(entrantView(LAW, record, world, 'a').impair < 1);
});

test('odds quote is the same rule on keyed seeds and sums to one', () => {
    const entrants = [fighter('a', 'red', {profile: {attack: 20, evasion: 12}}), fighter('b', 'blue')];
    const {rules, world} = arena(entrants);
    const spec = {id: 'q', seed: 5, place: 'yard', entrants};
    const odds = quoteContestOdds(LAW, spec, rules, world, {samples: 12});
    assert.deepEqual(quoteContestOdds(LAW, spec, rules, world, {samples: 12}), odds);
    assert.equal(Object.values(odds.sides).reduce((x, y) => x + y, 0), 1);
    assert.ok(odds.sides.red > 0.5);
});

test('the contest names no world and no entrant domain (SC9, PFP3)', () => {
    for (const file of ['src/contest.js', 'src/contest_resolvers.js']) {
        const imports = readFileSync(file, 'utf8').split('\n').filter(l => l.startsWith('import'));
        assert.ok(imports.every(l => !/world_packs|contest_packs|book_|gu_(?!defense)|hp_|lotm/.test(l)), `${file}: ${imports.join(' | ')}`);
    }
});
