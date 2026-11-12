// Chat C first consumers FC1-FC3: book contests as rows over contest.js,
// checked against their canon outcomes across seeds (AD49 calibration).
import assert from 'node:assert/strict';
import test from 'node:test';

import {composeSubstrate, createWorld, readQuantity, readProvenance} from '../src/world_substrate.js';
import {beginContest, runContest, contestBodyIntents} from '../src/contest.js';
import {contestPack, applyLifecycleIntents} from '../src/contest_bodies.js';
import {restoreCreatureLifecycle, settleCohortStock} from '../src/creature_lifecycle.js';
import {GU_CONTEST, wangErDuel, crippledPackHunt} from '../src/contest_packs/gu_world.js';
import {HOGWARTS_CONTEST, duellingClub} from '../src/contest_packs/hogwarts.js';

function fight(law, scene, seed, detail = 'near') {
    const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities})]});
    const world = createWorld(rules, {holders: scene.bodies});
    const record = beginContest(law, {id: 'scene', seed, place: scene.place, entrants: scene.entrants,
        sides: scene.sides, limits: scene.limits, detail}, world);
    return runContest(law, record, rules, world);
}
const seeds = n => Array.from({length: n}, (_, i) => i + 1);

test('FC1 Gu duel: Fang Yuan kills Wang Er and the hunters kneel, paying four parts a blade (RI ch65-70)', () => {
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

test('G\'s own Moonlight Gu working enters the duel unchanged: G\'s cost, G\'s force, the same canon outcome', () => {
    assert.deepEqual(GU_CONTEST.moves.moonlight_gu.bridge.method, guMethods('moonlight').activate);
    let wins = 0;
    for (const seed of seeds(30)) {
        const {record, world} = fight(GU_CONTEST, withGu(wangErDuel(), ['moonlight_gu', 'fist']), seed);
        if (record.result.winner === 'fang_yuan') wins += 1;
        const spent = 16 - readQuantity(world, 'fang_yuan', 'primeval_essence');
        const blades = record.log.filter(l => l.actor === 'fang_yuan' && l.move === 'moonlight_gu').length;
        assert.ok(blades > 0);
        assert.equal(spent, 4 * blades, 'G\'s activation charges four parts a blade');
    }
    assert.ok(wins >= 22, `won ${wins}/30`);
});

test('the Little Light Moonblade composed working costs five and cuts twice as hard; with too little essence the chooser falls back', () => {
    const {record, world} = fight(GU_CONTEST, withGu(wangErDuel({essence: 5}), ['little_light_moonblade', 'fist']), 2);
    const hit = record.log.find(l => l.move === 'little_light_moonblade' && l.outcome === 'hit');
    if (hit) assert.match(hit.landed, /vitality -28/);
    assert.equal(readQuantity(world, 'fang_yuan', 'primeval_essence'), 0);
    assert.equal(record.log.filter(l => l.actor === 'fang_yuan' && l.move === 'little_light_moonblade').length, 1);
    assert.ok(record.log.some(l => l.actor === 'fang_yuan' && l.move === 'fist'), 'out of essence, he fights on with fists');
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
