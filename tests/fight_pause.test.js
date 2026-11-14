// Pause rule (proposal, CBD56, CBD195): a routine fight stops and asks when a
// foe is new, a means is lower than last time, or the last pick stopped being
// possible. Read from the shared view, so one rule serves both engines.
import assert from 'node:assert/strict';
import test from 'node:test';
import {composeSubstrate, createWorld} from '../src/world_substrate.js';
import {beginContest, stepContest} from '../src/contest.js';
import {contestPack} from '../src/contest_bodies.js';
import {GU_CONTEST, wangErDuel} from '../src/contest_packs/gu_world.js';
import {projectContest} from '../src/fight_view.js';
import {FIGHT_PAUSE_KINDS, fightPauseMemory, fightPauseReasons} from '../src/fight_pause.js';

const NAMES = {wang_er: 'Wang Er', hunter_1: 'First hunter', hunter_2: 'Second hunter', hunter_3: 'Third hunter'};
const MEANS = {primeval_essence: 'Primeval essence', vitality: 'Vitality', stamina: 'Stamina'};
const MOVES = {moonlight_gu: 'Moonblade', close_in: 'Close in'};
// A caller puts its world's names on the view before any text is made from it.
function dressed(view) {
    const v = JSON.parse(JSON.stringify(view));
    for (const m of v.you.means) m.label = MEANS[m.id] ?? null;
    for (const spot of v.people) for (const p of spot.who) p.name = NAMES[p.id] ?? 'You';
    for (const c of v.choices) c.what = MOVES[c.id] ?? null;
    return v;
}
function pit(essence) {
    const scene = wangErDuel({essence});
    const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities})]});
    let world = createWorld(rules, {holders: scene.bodies});
    let record = beginContest(GU_CONTEST, {id: 'scene', seed: 5, place: scene.place, entrants: scene.entrants, sunDirection: scene.sunDirection}, world);
    const view = () => dressed(projectContest(GU_CONTEST, record, world, {seat: 'fang_yuan'}));
    const first = view();
    // Play the policy's moves until Fang Yuan next chooses, and return that view too.
    let second = null;
    for (let n = 0; n < 60 && !record.result && !second; n += 1) {
        ({record, world} = stepContest(GU_CONTEST, record, rules, world, {}));
        const v = view();
        if (v.yourTurn && record.log.some(r => r.actor === 'fang_yuan')) second = v;
    }
    return {first, second};
}
const full = pit(16), low = pit(4);
const known = fightPauseMemory(full.first);

test('what one fight leaves in memory is what quiets or pauses the next', () => {
    // The low-essence visit is judged against the memory the full visit left, with nothing typed in by hand.
    const kinds = fightPauseReasons(low.first, fightPauseMemory(full.first), {first: true}).map(r => r.kind);
    assert.deepEqual(kinds, ['lower means']);
    // After the low visit the memory holds the lower amount, so the same visit again asks nothing.
    assert.deepEqual(fightPauseReasons(low.first, fightPauseMemory(low.first, known), {first: true}), []);
});

test('a familiar fight entered as before asks nothing', () => {
    assert.deepEqual(known.knownFoes, ['hunter_1', 'hunter_2', 'hunter_3', 'wang_er']);
    assert.equal(known.means.primeval_essence, 16);
    assert.deepEqual(fightPauseReasons(full.first, known, {first: true}), []);
    assert.deepEqual(fightPauseReasons(full.second, {...known, lastPick: 'moonlight_gu'}), []);
});

test('a first meeting pauses once per new foe, and not again once they are known', () => {
    const reasons = fightPauseReasons(full.first, {knownFoes: ['hunter_1', 'hunter_2', 'hunter_3']}, {first: true});
    assert.deepEqual(reasons, [{kind: 'new foe', subject: 'wang_er', text: 'Wang Er: not fought before.'}]);
    assert.deepEqual(fightPauseReasons(full.first, known, {first: true}).filter(r => r.kind === 'new foe'), []);
});

test('less of a means than last time pauses at the first turn and names both amounts', () => {
    assert.deepEqual(fightPauseReasons(low.first, known, {first: true}),
        [{kind: 'lower means', subject: 'primeval_essence', text: 'Primeval essence: 4. Last time here: 16.'}]);
    assert.deepEqual(fightPauseReasons(low.first, known, {first: false}), [], 'the comparison is made once, on entry');
});

test('the last pick becoming impossible pauses with the reason from the view', () => {
    const reasons = fightPauseReasons(low.second, {...known, lastPick: 'moonlight_gu'});
    assert.deepEqual(reasons, [{kind: 'pick gone', subject: 'moonlight_gu', text: 'Moonblade: no longer possible, needs more essence.'}]);
});

test('the dial limits which kinds count, and nothing is asked when it is not the seat\'s turn', () => {
    assert.deepEqual(fightPauseReasons(low.first, known, {first: true, only: ['new foe']}), []);
    assert.deepEqual(fightPauseReasons({...low.first, yourTurn: false}, known, {first: true}), []);
    assert.deepEqual(FIGHT_PAUSE_KINDS, ['new foe', 'lower means', 'pick gone']);
    for (const r of [...fightPauseReasons(low.first, {}, {first: true}), ...fightPauseReasons(low.second, {lastPick: 'moonlight_gu'})])
        assert.doesNotMatch(r.text, /fang_yuan|moonlight_gu|primeval_essence|undefined|null/);
});
