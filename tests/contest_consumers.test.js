// Chat C first consumers FC1-FC3: book contests as rows over contest.js,
// checked against their canon outcomes across seeds (AD49 calibration).
import assert from 'node:assert/strict';
import test from 'node:test';

import {composeSubstrate, createWorld, readQuantity, readProvenance, serializeWorld, restoreWorld} from '../src/world_substrate.js';
import {beginContest, runContest, stepContest, serializeContest, restoreContest, contestBodyIntents} from '../src/contest.js';
import {contestPack, applyLifecycleIntents} from '../src/contest_bodies.js';
import {restoreCreatureLifecycle, settleCohortStock} from '../src/creature_lifecycle.js';
import {GU_CONTEST, wangErDuel, crippledPackHunt} from '../src/contest_packs/gu_world.js';
import {HOGWARTS_CONTEST, duellingClub} from '../src/contest_packs/hogwarts.js';

function startFight(law, scene, seed, detail = 'near') {
    const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities})]});
    const world = createWorld(rules, {holders: scene.bodies});
    const record = beginContest(law, {id: 'scene', seed, place: scene.place, entrants: scene.entrants,
        sides: scene.sides, limits: scene.limits, sunDirection: scene.sunDirection, detail}, world);
    return {rules, record, world};
}

function fight(law, scene, seed, detail = 'near') {
    const {rules, record, world} = startFight(law, scene, seed, detail);
    return runContest(law, record, rules, world);
}
const seeds = n => Array.from({length: n}, (_, i) => i + 1);

test('FC1 Gu duel: shared Moonlight activation pays four parts and reproduces the broad outcome (RI ch66)', () => {
    let fangWins = 0, wangKilled = 0, hunterYields = 0;
    for (const seed of seeds(40)) {
        const {record, world} = fight(GU_CONTEST, wangErDuel(), seed);
        const o = record.result.outcomes;
        if (record.result.winner === 'fang_yuan') fangWins += 1;
        if (o.wang_er === 'killed') wangKilled += 1;
        hunterYields += ['hunter_1', 'hunter_2', 'hunter_3'].filter(h => o[h] === 'yielded').length;
        const spent = 16 - readQuantity(world, 'fang_yuan', 'primeval_essence');
        assert.equal(spent % 4, 0, 'moonblades cost four parts each');
        assert.equal(-Object.values(readProvenance(world, 'fang_yuan', 'primeval_essence')).reduce((x, y) => x + y, 0), spent);
    }
    assert.ok(fangWins >= 32, `Fang Yuan won ${fangWins}/40`);
    assert.ok(wangKilled >= 28, `Wang Er died in ${wangKilled}/40`);
    assert.ok(hunterYields >= 60, `hunters knelt ${hunterYields}/120`);
});

test('FC2a Hogwarts duel: Snape disarms Lockhart (CoS ch11); the hit lands on the wand, not on health', () => {
    let snape = 0;
    for (const seed of seeds(40)) {
        const {record, world} = fight(HOGWARTS_CONTEST, duellingClub('snape_lockhart'), seed);
        if (record.result.winner === 'snape') {
            snape += 1;
            assert.equal(record.result.outcomes.lockhart, 'yielded');
            assert.equal(readQuantity(world, 'lockhart', 'focus'), 0);
            assert.equal(readQuantity(world, 'lockhart', 'vitality'), 20);
        }
    }
    assert.ok(snape >= 36, `Snape won ${snape}/40`);
});

test('FC2b Hogwarts duel: Harry and Draco trade charms until the bout is stopped; no one is defeated', () => {
    for (const seed of seeds(20)) {
        const {record, world} = fight(HOGWARTS_CONTEST, duellingClub('harry_draco'), seed);
        assert.equal(record.result.reason, 'stopped');
        assert.equal(record.result.winner, null);
        assert.deepEqual(record.result.outcomes, {draco: 'stood', harry: 'stood'});
        const lost = readQuantity(world, 'draco', 'composure') < 100 || readQuantity(world, 'harry', 'footing') < 100;
        assert.ok(lost, 'a charm landed on composure or footing');
    }
});

test('FC3 wolf hunt: the crippled pack breaks after about a quarter falls; the hunter is hurt but stands (RI ch122-123)', () => {
    let wins = 0, loss = 0, fallen = 0, routs = 0;
    for (const seed of seeds(40)) {
        const {record, world} = fight(GU_CONTEST, crippledPackHunt(), seed);
        const o = Object.entries(record.result.outcomes).filter(([id]) => id.startsWith('wolf_')).map(([, v]) => v);
        if (record.result.winner === 'fang_yuan') wins += 1;
        loss += 30 - readQuantity(world, 'fang_yuan', 'vitality');
        fallen += o.filter(v => v === 'killed' || v === 'knocked_out').length;
        if (o.includes('routed')) routs += 1;
        assert.ok(readQuantity(world, 'fang_yuan', 'primeval_essence') >= 0);
    }
    assert.ok(wins >= 34, `won ${wins}/40`);
    assert.ok(routs >= 34, `pack routed ${routs}/40`);
    assert.ok(fallen / 40 >= 4 && fallen / 40 <= 6, `about five wolves fall (${fallen / 40})`);
    assert.ok(loss / 40 >= 3 && loss / 40 <= 12, `the hunter loses a few health, canon six (${loss / 40})`);
});

test('FC3 lands on L: fallen wolves leave the lifecycle cohort through its own door; far settles the same fight', () => {
    const scene = crippledPackHunt();
    const near = fight(GU_CONTEST, scene, 9), far = fight(GU_CONTEST, crippledPackHunt(), 9, 'far');
    assert.deepEqual(far.record.result, near.record.result);
    assert.equal(readQuantity(far.world, 'fang_yuan', 'vitality'), readQuantity(near.world, 'fang_yuan', 'vitality'));
    const habitat = {id: 'qing_mao.mountain', capacity: 40, supportedSpecies: ['lightning-wolf']};
    const lifecycle = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'qing_mao.lightning_wolves',
        species: 'lightning-wolf', habitat, delta: 20});
    const intents = contestBodyIntents(near.record);
    const fallen = Object.values(near.record.result.outcomes).filter(v => v === 'killed' || v === 'knocked_out').length;
    assert.equal(intents.filter(i => i.door === 'cohort').length, fallen);
    const after = applyLifecycleIntents(lifecycle, intents, {clock: 0});
    assert.equal(after.cohorts['qing_mao.lightning_wolves'].stock, 20 - fallen);
});

// ---------- entrants as effect sentences and composed workings (MS goal update; SC9) ----------
import {guMethods} from '../src/gu_working_law.js';
import {hpEffects} from './fixtures/procedural_grammar/effect_worlds.mjs';
import {assembleEffect} from '../src/effect_grammar.js';

const withGu = (scene, moves) => {
    const fy = scene.entrants.find(e => e.id === 'fang_yuan');
    fy.moves = moves;
    fy.profile.gu = [{id: 'fy.moonlight', kind: 'moonlight', rank: 1}, {id: 'fy.little_light', kind: 'little-light', rank: 1}];
    return scene;
};

const CANON_SEED = 5;

test('FC1 chapter 66: a surviving arm wound breaks morale before the bow, fist and glare exchange', () => {
    const {record, world} = fight(GU_CONTEST, wangErDuel(), CANON_SEED);
    const blades = record.log.filter(row => row.move === 'moonlight_gu');
    assert.deepEqual(blades.map(({target, outcome, location}) => [target, outcome, location]), [
        ['hunter_1', 'hit', undefined], ['wang_er', 'miss', undefined], ['wang_er', 'hit', 'head'],
    ]);
    assert.deepEqual(blades.map(row => row.spent.primeval_essence), [4, 4, 4]);
    assert.equal(record.entrants.hunter_1.harm.parts.hands.rung, 'maimed');
    assert.ok(readQuantity(world, 'hunter_1', 'vitality') > 0);
    assert.deepEqual(record.log.filter(row => row.posture === 'kneeling').map(row => row.actor), ['hunter_2', 'hunter_3']);
    const beats = [
        row => row === blades[0],
        row => row.actor === 'hunter_3' && row.posture === 'kneeling',
        row => row.move === 'bow_shot' && row.outcome === 'miss',
        row => row.move === 'drop_bow',
        row => row.move === 'close_fist' && row.actor === 'wang_er' && row.outcome === 'miss',
        row => row.move === 'slip_past',
        row => row === blades[2] && row.glare,
        row => row.actor === 'wang_er' && row.outcome === 'killed',
    ];
    let previous = -1;
    for (const beat of beats) {
        const next = record.log.findIndex((row, index) => index > previous && beat(row));
        assert.ok(next > previous, `missing or out of order beat ${beat}`);
        previous = next;
    }
    assert.equal(record.entrants.wang_er.held.bow, undefined);
    assert.equal(record.dropped['wang_er.bow'], 5);
    assert.equal(readQuantity(world, 'wang_er', 'arrows'), 0);
    assert.equal(readQuantity(world, 'fang_yuan', 'vitality'), 30);
    const shade = fight(GU_CONTEST, wangErDuel({sunlight: 0}), CANON_SEED);
    assert.ok(shade.record.log.every(row => !row.glare && row.location !== 'head'));
    assert.notDeepEqual(shade.record.result, record.result);
});

test('FC1: swapping the bound Gu changes opening damage, final impact and fuel under the same conditions', () => {
    assert.deepEqual(GU_CONTEST.moves.moonlight_gu.bridge.method, guMethods('moonlight').activate);
    assert.deepEqual(GU_CONTEST.moves.moonglow_gu.bridge.method, guMethods('moonglow').activate);
    const baseline = fight(GU_CONTEST, wangErDuel(), CANON_SEED);
    const swap = fight(GU_CONTEST, wangErDuel({attackGu: 'moonglow'}), CANON_SEED);
    for (const [result, move, opening, final, essence] of [
        [baseline, 'moonlight_gu', 'vitality -4, hands -14', 'vitality -21', 4],
        [swap, 'moonglow_gu', 'vitality -11, hands -42', 'vitality -63', 1],
    ]) {
        const casts = result.record.log.filter(row => row.move === move);
        assert.equal(casts.length, 3);
        assert.equal(casts[0].landed, opening);
        assert.equal(casts[2].landed, final);
        assert.equal(readQuantity(result.world, 'fang_yuan', 'primeval_essence'), essence);
        assert.equal(result.record.result.outcomes.wang_er, 'killed');
    }
    assert.equal(swap.record.result.ticks, baseline.record.result.ticks);
});

test('FC1: four parts fund Moonlight but leave Moonglow unused, changing the winner in the paired run', () => {
    const seed = 3, essence = 4;
    const baseline = fight(GU_CONTEST, wangErDuel({essence}), seed);
    const swap = fight(GU_CONTEST, wangErDuel({essence, attackGu: 'moonglow'}), seed);
    assert.equal(readQuantity(baseline.world, 'fang_yuan', 'primeval_essence'), 0);
    assert.ok(swap.record.log.some(row => row.actor === 'fang_yuan' && row.move === 'close_fist'));
    assert.ok(!swap.record.log.some(row => row.move === 'moonglow_gu'));
    assert.equal(readQuantity(swap.world, 'fang_yuan', 'primeval_essence'), essence);
    assert.equal(baseline.record.result.winner, 'hunters');
    assert.equal(swap.record.result.winner, 'fang_yuan');
});

test('FC1: restore after the arm wound and bow drop with a cast pending in both loadouts', () => {
    for (const attackGu of ['moonlight', 'moonglow']) {
        const scene = wangErDuel({attackGu});
        const straight = fight(GU_CONTEST, scene, CANON_SEED);
        const {rules, ...start} = startFight(GU_CONTEST, scene, CANON_SEED);
        let pending = start;
        while (!pending.record.result && (!pending.record.dropped || !pending.record.entrants.fang_yuan.working)) {
            pending = stepContest(GU_CONTEST, pending.record, rules, pending.world);
        }
        assert.equal(pending.record.entrants.hunter_1.harm.parts.hands.rung, 'maimed');
        assert.equal(pending.record.entrants.wang_er.held.bow, undefined);
        assert.equal(pending.record.entrants.fang_yuan.working.status, 'running');
        assert.equal(readQuantity(pending.world, 'fang_yuan', 'primeval_essence'), attackGu === 'moonlight' ? 12 : 11);
        const reloaded = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(pending.world))));
        const resumed = runContest(GU_CONTEST, restoreContest(GU_CONTEST, serializeContest(pending.record)), rules, reloaded);
        assert.deepEqual(resumed.record, straight.record);
        assert.deepEqual(serializeWorld(resumed.world), serializeWorld(straight.world));
    }
});

test('the Little Light Moonblade composed working costs five, cuts twice as hard and gives way to fists', () => {
    const scene = withGu(wangErDuel({essence: 5}), ['little_light_moonblade', 'close_fist', 'close_in']);
    const {rules, ...start} = startFight(GU_CONTEST, scene, CANON_SEED);
    let state = start;
    while (!state.record.result && readQuantity(state.world, 'fang_yuan', 'primeval_essence') === 5) {
        state = stepContest(GU_CONTEST, state.record, rules, state.world);
    }
    const cast = state.record.log.find(l => l.move === 'little_light_moonblade');
    assert.equal(cast.spent.primeval_essence, 5);
    assert.match(cast.landed, /hands -28/);
    assert.equal(readQuantity(state.world, 'fang_yuan', 'primeval_essence'), 0);
    const {record} = runContest(GU_CONTEST, state.record, rules, state.world);
    assert.ok(record.log.some(l => l.actor === 'fang_yuan' && l.move === 'close_fist'));
});

test('the Hogwarts rows are effect sentences the effect grammar accepts', () => {
    for (const [id, move] of Object.entries(HOGWARTS_CONTEST.moves)) {
        if (!move.sentences) continue;
        for (const sentence of move.sentences) {
            const {verb, object, target, time, carrier, cost} = sentence;
            const out = assembleEffect(hpEffects, {verb, object, target, time, carrier, cost, limits: []});
            assert.equal(out.ok, true, `${id}: ${JSON.stringify(out.receipt.violations)}`);
        }
    }
});
