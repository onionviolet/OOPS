import assert from 'node:assert/strict';
import test from 'node:test';

import {composeSubstrate, createWorld, readQuantity} from '../src/world_substrate.js';
import {beginContest, defaultChoice, runContest, serializeContest, restoreContest, stepContest} from '../src/contest.js';
import {contestPack, contestBody} from '../src/contest_bodies.js';
import {GU_CONTEST, crippledPackHunt} from '../src/contest_packs/gu_world.js';
import {HOGWARTS_CONTEST, duellingClub} from '../src/contest_packs/hogwarts.js';
import {compareContestPolicies, createPolicyChooser, createScoredChooser, withContestPolicy} from '../src/contest_choice.js';

function arena(scene) {
    const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities ?? []})]});
    const world = createWorld(rules, {holders: scene.bodies});
    return {rules, world};
}
function play(law, scene, seed, chooser = defaultChoice) {
    const {rules, world} = arena(scene);
    const record = beginContest(law, {id: 'choice', seed, place: scene.place, entrants: scene.entrants,
        sides: scene.sides, limits: scene.limits}, world);
    return {...runContest(law, record, rules, world, {choose: chooser}), rules};
}
const seeds = n => Array.from({length: n}, (_, i) => i + 1);
const outcomeMetric = result => result.winner === 'fang_yuan' ? 1 : 0;

test('scored chooser is bounded and high level is no worse than default on wolf hunt and duel seeds', () => {
    let baseline = 0, highScore = 0, lowScore = 0;
    for (const seed of seeds(12)) {
        const hunt = crippledPackHunt();
        const high = createScoredChooser({level: 8, budget: 32});
        const low = createScoredChooser({level: 0, budget: 32});
        baseline += outcomeMetric(play(GU_CONTEST, hunt, seed).record.result);
        highScore += outcomeMetric(play(GU_CONTEST, hunt, seed, high).record.result);
        lowScore += outcomeMetric(play(GU_CONTEST, hunt, seed, low).record.result);
        const duel = duellingClub('snape_lockhart');
        const scoredChooser = createScoredChooser({level: 8, budget: 32});
        const scored = play(HOGWARTS_CONTEST, duel, seed, scoredChooser);
        const ordinary = play(HOGWARTS_CONTEST, duel, seed);
        assert.ok(scored.record.result && ordinary.record.result);
        assert.equal(scored.record.result.winner === 'snape' ? 1 : 0,
            ordinary.record.result.winner === 'snape' ? 1 : 0, `Snape duel seed ${seed}`);
    }
    assert.ok(highScore >= baseline, `high ${highScore} vs default ${baseline}`);
    assert.ok(highScore >= lowScore, `high ${highScore} vs low ${lowScore}`);
    assert.throws(() => createScoredChooser({level: 1, budget: 33}), /budget/);
});

test('Moonblade policy retains its costly first row, uses fallback, and restores its cursor', () => {
    const scene = crippledPackHunt({wolves: 4, essence: 4});
    const {rules, world} = arena(scene);
    let record = beginContest(GU_CONTEST, {id: 'policy', seed: 2, place: scene.place, entrants: scene.entrants}, world);
    record = withContestPolicy(record, 'fang_yuan', {rows: [{move: 'moonglow_blade', fallback: 'fist'}]});
    const choose = createPolicyChooser({fang_yuan: {rows: [{move: 'moonglow_blade', fallback: 'fist'}]}});
    // After the first costly blade, a subsequent row attempt encounters no essence.
    const first = choose(GU_CONTEST, record, world, 'fang_yuan');
    assert.equal(first.move, 'moonglow_blade');
    let state = stepContest(GU_CONTEST, record, rules, world, {choose});
    // Resolve the wolf's actions until Fang's paid working has released.
    for (let i = 0; i < 20 && state.record.entrants.fang_yuan.working; i += 1)
        state = stepContest(GU_CONTEST, state.record, rules, state.world, {choose});
    record = restoreContest(GU_CONTEST, JSON.parse(JSON.stringify(serializeContest(state.record))));
    const fallback = choose(GU_CONTEST, record, state.world, 'fang_yuan');
    assert.equal(fallback.move, 'fist');
    assert.equal(record.entrants.fang_yuan.policy.cursor, 0);
    assert.equal(readQuantity(state.world, 'fang_yuan', 'primeval_essence'), 0);
    const continued = stepContest(GU_CONTEST, record, rules, state.world, {choose});
    assert.equal(continued.record.entrants.fang_yuan.policy.cursor, 0, 'the one-row policy remains on the costly row');
    const resumed = restoreContest(GU_CONTEST, JSON.parse(JSON.stringify(serializeContest(continued.record))));
    assert.deepEqual(resumed.entrants.fang_yuan.policy.rows, record.entrants.fang_yuan.policy.rows);
    const retained = withContestPolicy(resumed, 'fang_yuan', {rows: [{move: 'moonglow_blade', fallback: 'fist'}]});
    retained.entrants.fang_yuan.policy.cursor = 0;
    const depleted = structuredClone(state.world);
    depleted.holders.fang_yuan.quantities.primeval_essence = 0;
    assert.equal(choose(GU_CONTEST, retained, depleted, 'fang_yuan').move, 'fist');
    assert.equal(retained.entrants.fang_yuan.policy.cursor, 0, 'unaffordable row is retained');
});

test('a policy restored mid-fight reaches the same result and resource totals', () => {
    const scene = crippledPackHunt({wolves: 3, essence: 8}), {rules, world} = arena(scene);
    const spec = {id: 'policy-resume', seed: 9, place: scene.place, entrants: scene.entrants};
    const policy = {fang_yuan: {rows: [{move: 'moonglow_blade', fallback: 'fist', count: 2}, {move: 'fist'}]}};
    let straightRecord = withContestPolicy(beginContest(GU_CONTEST, spec, world), 'fang_yuan', policy.fang_yuan);
    const straight = runContest(GU_CONTEST, straightRecord, rules, world, {choose: createPolicyChooser(policy)});
    let state = {record: withContestPolicy(beginContest(GU_CONTEST, spec, world), 'fang_yuan', policy.fang_yuan), world};
    const firstChooser = createPolicyChooser(policy);
    for (let i = 0; i < 4; i += 1) state = stepContest(GU_CONTEST, state.record, rules, state.world, {choose: firstChooser});
    state = {record: restoreContest(GU_CONTEST, JSON.parse(JSON.stringify(serializeContest(state.record)))),
        world: structuredClone(state.world)};
    const resumed = runContest(GU_CONTEST, state.record, rules, state.world, {choose: createPolicyChooser(policy)});
    assert.deepEqual(resumed.record.result, straight.record.result);
    assert.equal(readQuantity(resumed.world, 'fang_yuan', 'primeval_essence'),
        readQuantity(straight.world, 'fang_yuan', 'primeval_essence'));
});

test('policy with no usable move withdraws through the no-means path', () => {
    const scene = crippledPackHunt({wolves: 2, essence: 0});
    scene.entrants[0].moves = ['moonglow_blade'];
    const {world} = arena(scene);
    const record = beginContest(GU_CONTEST, {id: 'empty-policy', seed: 1, place: scene.place, entrants: scene.entrants}, world);
    const chooser = createPolicyChooser({fang_yuan: {rows: [{move: 'moonglow_blade'}]}});
    const {record: ended} = runContest(GU_CONTEST, record, arena(scene).rules, world, {choose: chooser});
    assert.equal(ended.result.outcomes.fang_yuan, 'yielded');
});

test('policy spread reports a choice-sensitive fight and zero spread when no move can vary', () => {
    const duel = duellingClub('snape_lockhart'), arena1 = arena(duel);
    const spread = compareContestPolicies(HOGWARTS_CONTEST,
        {id: 'spread', seed: 1, place: duel.place, entrants: duel.entrants}, arena1.rules, arena1.world,
        {fast: {snape: {rows: [{move: 'expelliarmus'}]}}, alternate: {snape: {rows: [{move: 'expelliarmus'}, {move: 'expelliarmus', count: 2}]}}},
        {seeds: seeds(3)});
    assert.ok(Object.keys(spread.fast.outcomes).length > 0);
    assert.ok(spread.fast.changed.lockhart && Object.keys(spread.fast.changed.lockhart).length > 0,
        `per-side changed quantities: ${JSON.stringify(spread.fast.changed)}`);
    const same = {...duel, entrants: duel.entrants.map(e => ({...e, moves: [e.moves[0]]}))};
    const arena2 = arena(same);
    const zero = compareContestPolicies(HOGWARTS_CONTEST,
        {id: 'zero', seed: 1, place: same.place, entrants: same.entrants}, arena2.rules, arena2.world,
        {one: {snape: {rows: [{move: 'expelliarmus'}]}}, two: {snape: {rows: [{move: 'expelliarmus'}]}}}, {seeds: [1]});
    assert.deepEqual(zero.one.samples[0].result, zero.two.samples[0].result);
    assert.deepEqual(zero.one.spent, zero.two.spent);
});

test('spread budget fails when a nonending contest exceeds its step cap', () => {
    const scene = duellingClub('harry_draco'), {rules, world} = arena(scene);
    assert.throws(() => compareContestPolicies(HOGWARTS_CONTEST,
        {id: 'bounded', seed: 1, place: scene.place, entrants: scene.entrants, limits: {landed: 100}}, rules, world,
        {policy: {}}, {maxSteps: 1}), /exceeded/);
});

test('policy spread separates a blade policy from a fist policy on the same hunt (coordinator review)', () => {
    const scene = crippledPackHunt({wolves: 4, essence: 12});
    const {rules, world} = arena(scene);
    const spread = compareContestPolicies(GU_CONTEST,
        {id: 'hunt-spread', seed: 1, place: scene.place, entrants: scene.entrants, sides: scene.sides, limits: scene.limits},
        rules, world, {
            blades: {fang_yuan: {rows: [{move: 'moonglow_blade', fallback: 'fist'}]}},
            fists: {fang_yuan: {rows: [{move: 'fist'}]}},
        }, {seeds: seeds(6)});
    // Same seeds, same pack: the two policies end differently and cost differently.
    assert.notDeepEqual(spread.blades.outcomes, spread.fists.outcomes);
    assert.ok(spread.blades.spent.fang_yuan.primeval_essence > 0, 'blades spend essence');
    assert.equal(spread.fists.spent.fang_yuan?.primeval_essence, undefined, 'fists spend none');
    assert.ok((spread.fists.changed.fang_yuan?.vitality ?? 0) < (spread.blades.changed.fang_yuan?.vitality ?? 0),
        'the fist policy costs the hunter more of his own body');
});
