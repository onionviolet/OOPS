// Three derivation trials for a headless fight (proposal, CBD308): a known case,
// a controlled variation and an unlisted combination, each settled by the
// contest, read through the shared fight view and told by fight_text.js.
// Fixtures follow tests/contest_consumers.test.js. Each fight runs once here.
import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, readQuantity} from '../src/world_substrate.js';
import {beginContest, stepContest, defineContestLaw, moveFromSentence} from '../src/contest.js';
import {contestPack, contestBody} from '../src/contest_bodies.js';
import {GU_CONTEST, wangErDuel} from '../src/contest_packs/gu_world.js';
import {HOGWARTS_QUANTITIES} from '../src/contest_packs/hogwarts.js';
import {projectContest, validateFightView} from '../src/fight_view.js';
import {fightLine, fightLines, fightResult, shownLine, isTurningRow} from '../src/fight_text.js';
import {GU_FIGHT_LABELS} from '../src/world_packs/gu_fight_entry.js';

const GU_LABELS = Object.freeze({seat: 'fang_yuan',
    names: {wang_er: 'Wang Er', hunter_1: 'First hunter', hunter_2: 'Second hunter', hunter_3: 'Third hunter'}, ...GU_FIGHT_LABELS});

// Engine words that must not reach a player line (CBD299).
const ENGINE_WORDS = /fang_yuan|wang_er|hunter_\d|moonlight_gu|close_fist|bow_shot|knocked_out|primeval_essence|undefined|null|\bNaN\b/;

function run(law, scene, {seed = 5, seat, title}) {
    const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities})]});
    let world = createWorld(rules, {holders: scene.bodies});
    let record = beginContest(law, {id: 'scene', seed, place: scene.place, entrants: scene.entrants,
        ...(scene.sunDirection !== undefined && {sunDirection: scene.sunDirection})}, world);
    const opening = projectContest(law, record, world, {seat, title});
    let firstTurn = null; // the view at the seat's first chance to act
    for (let n = 0; n < 400 && !record.result; n += 1) {
        if (!firstTurn) { const v = projectContest(law, record, world, {seat, title}); if (v.yourTurn) firstTurn = v; }
        ({record, world} = stepContest(law, record, rules, world, {}));
    }
    return {record, world, opening, firstTurn};
}
const pit = essence => {
    const scene = wangErDuel({essence});
    const {record, world, opening} = run(GU_CONTEST, scene, {seat: 'fang_yuan', title: 'The pit'});
    const before = Object.fromEntries(scene.bodies.filter(b => b.id === 'fang_yuan').flatMap(b => Object.entries(b.quantities)));
    const means = ['vitality', 'primeval_essence'].map(id => ({id, before: before[id], after: readQuantity(world, 'fang_yuan', id)}));
    const lines = fightLines(record.log, GU_LABELS);
    const result = fightResult({place: 'The pit', seconds: record.result.at / 10, outcomes: record.result.outcomes, rows: record.log, means,
        left: Object.keys(record.dropped ?? {}).length ? ["Wang Er's bow"] : []}, GU_LABELS);
    return {record, world, opening, lines, result, means};
};
const full = pit(16), low = pit(4);

test('trial 1, known case: the pit duel ends as the book has it and reads in terse lines', () => {
    const o = full.record.result.outcomes;
    assert.equal(o.fang_yuan, 'stood');
    assert.equal(o.wang_er, 'killed');
    assert.deepEqual([o.hunter_1, o.hunter_2, o.hunter_3], ['yielded', 'yielded', 'yielded']);
    assert.doesNotThrow(() => validateFightView(full.opening));
    const shown = full.lines.map(shownLine);
    assert.equal(shown[0], 'You: moonblade hits First hunter, hands.');
    assert.equal(shown.at(-1), 'Wang Er down, killed.');
    assert.ok(shown.includes('You: moonblade hits Wang Er, head, through the glare.'), shown.join(' | '));
    for (const line of shown) assert.doesNotMatch(line, ENGINE_WORDS);
    assert.equal(full.result.head, 'The pit. 3.4 seconds. You: standing.');
    assert.deepEqual(Object.fromEntries(full.result.items), {
        Them: 'First hunter, Second hunter, Third hunter: yielded. Wang Er: killed.',
        Spent: 'Primeval essence 12 of 16.', Hurt: 'Unhurt.', 'Left here': "Wang Er's bow.", Asked: 'Nothing.'});
});

test('trial 1: repeated plain lines fold between turning points and each turning point keeps its line', () => {
    const folded = full.lines.find(l => l.text === 'Wang Er: punch misses you.');
    assert.equal(folded.count, 3);
    assert.equal(shownLine(folded), 'Wang Er: punch misses you (3 times).');
    assert.equal(full.lines.filter(l => l.turn).length, full.record.log.filter(r => isTurningRow(r, GU_LABELS)).length);
    assert.ok(full.lines.length < full.record.log.length);
});

test('trial 2, controlled variation: less essence gives a different fight, and the result says why', () => {
    const o = low.record.result.outcomes;
    assert.equal(o.fang_yuan, 'stood');
    assert.equal(o.wang_er, 'knocked_out');
    const blades = rec => rec.log.filter(r => r.actor === 'fang_yuan' && r.move === 'moonlight_gu').length;
    assert.equal(blades(full.record), 3);
    assert.equal(blades(low.record), 1);
    assert.ok(low.record.result.at > full.record.result.at, 'a fight finished by hand takes longer');
    const items = Object.fromEntries(low.result.items);
    assert.equal(items.Spent, 'Primeval essence 4 of 4.');
    assert.match(items.Hurt, /^Vitality \d+ of 30\.$/);
    assert.equal(items.Them, 'First hunter, Second hunter, Third hunter: yielded. Wang Er: out cold.');
    assert.ok(low.lines.some(l => l.text === 'Wang Er: bow shot hits you, through the glare.'));
    assert.equal(low.lines.find(l => l.text === 'You: punch hits Wang Er.').count, 6);
    assert.ok(full.lines.some(l => l.text === 'Wang Er: bow dropped.') && low.lines.some(l => l.text === 'You: closed in.'));
    assert.deepEqual(low.result.turning.slice(-1), ['Wang Er down, out cold.']);
    for (const line of [...low.lines.map(shownLine), low.result.head, ...low.result.items.map(i => i[1])]) assert.doesNotMatch(line, ENGINE_WORDS);
});

// An action no pack lists, written as one effect sentence: a shove moves the other body's position.
const YARD = defineContestLaw({id: 'c.trial_yard', revision: 0, lethal: false, endings: {footing: 'yielded'},
    moves: {shove: moveFromSentence({verb: 'move', object: 'position', target: 'line', time: 'instant', carrier: 'body', cost: 'stamina', amount: 60},
        {resolver: 'notch', steps: [3], quantityOf: {position: 'footing'}, why: 'Trial row: a shove takes footing. Two put most people on the ground.'})}});
const yard = (() => {
    const place = 'trial.yard';
    const person = id => contestBody(id, place, {vitality: 20, stamina: 10, focus: 1, composure: 100, footing: 100});
    const scene = {place, quantities: HOGWARTS_QUANTITIES, bodies: [{id: place, kind: 'place', tags: ['yard']}, person('you'), person('bully')],
        entrants: [{id: 'you', side: 'you', body: 'you', profile: {attack: 14, evasion: 10}, speed: 110, moves: ['shove'], wants: {acceptsSurrender: true}},
            {id: 'bully', side: 'bully', body: 'bully', profile: {attack: 6, evasion: 4}, speed: 60, moves: ['wait'], wants: {yieldAt: 0, fleeAt: 0}}]};
    return run(YARD, scene, {seed: 3, seat: 'you', title: 'The yard'});
})();

test('trial 3, unlisted combination: a move written as one sentence settles, projects and reads with no code for it', () => {
    assert.equal(yard.record.result.outcomes.bully, 'yielded');
    assert.equal(readQuantity(yard.world, 'bully', 'vitality'), 20, 'a shove takes footing and leaves health alone');
    assert.ok(readQuantity(yard.world, 'bully', 'footing') <= 0);
    assert.doesNotThrow(() => validateFightView(yard.opening));
    assert.ok(yard.firstTurn?.choices.some(c => c.id === 'shove' && !c.blocked), 'the composed move is offered like any other');
    const labels = {seat: 'you', names: {bully: 'The bully'}, moves: {shove: 'Shove'}, means: {}, parts: {}};
    const shown = fightLines(yard.record.log, labels).map(shownLine);
    assert.ok(shown.some(l => l.startsWith('You: shove hits The bully')), shown.join(' | '));
    for (const line of shown) assert.doesNotMatch(line, /footing|notch|c\.trial|undefined/);
});

test('a move whose own working cannot start is blocked for a reason a player can read', () => {
    const blockedAt = (essence, strip) => {
        const scene = wangErDuel({essence});
        if (strip) scene.entrants[0].profile.gu = [];
        return run(GU_CONTEST, scene, {seat: 'fang_yuan', title: 'The pit'}).firstTurn.choices.find(c => c.id === 'moonlight_gu').blocked;
    };
    assert.equal(blockedAt(16, false), null);
    assert.equal(blockedAt(2, false), 'needs more essence');
    assert.equal(blockedAt(16, true), 'something it needs is missing');
});

test('a row with no label gives no line, so an engine id cannot reach the player', () => {
    const labels = {seat: 'you', names: {}, moves: {}, means: {}, parts: {}};
    const hit = yard.record.log.find(r => r.move === 'shove');
    assert.equal(fightLine(hit, labels), null);
    assert.equal(fightLine({actor: 'bully', move: 'down', outcome: 'some_new_engine_word'}, labels), 'Someone down.');
    assert.equal(fightLine({actor: 'you', move: 'wait'}, labels), null);
});
