// Progression path contract v0 (PRG1-PRG12) with its three first consumers as adapters:
// an upstream skill level, a Lord of the Mysteries Seq 9 to 8 step with digestion, and the
// Reverend Insanity Rank One peak to Rank Two step through a K working.
import test from 'node:test';
import assert from 'node:assert/strict';
import {definePathRow, createPosition, accrue, trackLevel, trackThreshold, pathFacts, trackFelt, stepQuote, crossStep,
    openAutoSteps, progressionLaw, crossingMethod, PROGRESSION_EFFECTS} from '../src/progression_path.js';
import {beginWorking, settleWorking, quoteWorking, serializeWorking, restoreWorking, interruptWorking} from '../src/kernel_working.js';
import {seerPathway, corpsePathway} from '../src/book_world_lotm_path.js';
import {ccRow} from '../src/book_world_lotm_rows.js';
import {LOTM_DIGEST_ACTS} from '../src/book_world_lotm_ids.js';
import {riGuMasterRow, RI_STONE_PARTS} from '../src/progression_packs/ri_gu_master.js';

// The upstream curve exactly as models/skill.js add_xp runs it (that class does not load under node).
function upstreamLevel(base, scale, max, total) {
    let level = 0, next = base;
    while (total >= next && level < max) { level += 1; next = Math.round(100 * base * (1 - scale ** (level + 1)) / (1 - scale)) / 100; }
    return level;
}
const skillRow = (id, {base = 40, scale = 1.8, max = 10} = {}) => definePathRow({
    path: {id: `skill.${id}`, world: 'base.frontier', label: id, shape: 'ladder', stages: [
        {id: 'l0', label: 'Untrained', crossings: [], grants: []},
        ...Array.from({length: max}, (_, i) => ({id: `l${i + 1}`, label: `Level ${i + 1}`, grants: [],
            crossings: [{id: 'xp', type: 'quota', label: 'Experience', fact: 'xp.level', need: i + 1}]}))]},
    tracks: {xp: {kind: 'geometric', base, scale, max}},
    steps: Object.fromEntries(Array.from({length: max}, (_, i) => [`l${i + 1}`, {open: 'auto'}])),
});

test('skill: the geometric track reproduces the upstream curve at every total', () => {
    for (const [base, scale] of [[40, 1.8], [20, 1.6], [100, 1.8], [10, 1.6]]) {
        const t = {kind: 'geometric', base, scale, max: 12};
        assert.equal(trackThreshold(t, 1), base);
        for (let total = 0; total < 40000; total += 7.31) assert.equal(trackLevel(t, Math.round(total * 100) / 100), upstreamLevel(base, scale, 12, Math.round(total * 100) / 100));
    }
});

test('skill: any split of the same cent-valued gains opens the same level (partition invariance)', () => {
    const row = skillRow('sleeping');
    const gains = [12.5, 0.25, 33, 7.75, 101.1, 0.01, 260.39];
    const whole = accrue(row, createPosition(row), 'xp', gains.reduce((a, b) => a + b, 0));
    let parts = createPosition(row);
    for (const g of gains) parts = accrue(row, parts, 'xp', g);
    assert.equal(parts.tracks.xp, whole.tracks.xp);
    const a = openAutoSteps(row, whole), b = openAutoSteps(row, parts);
    assert.equal(a.record.position, b.record.position);
    assert.equal(a.record.position, upstreamLevel(40, 1.8, 10, whole.tracks.xp));
    assert.ok(a.effects.every(e => e.kind === PROGRESSION_EFFECTS.crossed));
});

// LOTM: the existing Seer and Corpse Collector descriptors, wrapped, with digestion as one count track.
const lotmRow = (path, digest) => definePathRow({path, ceiling: 2,
    tracks: {acting: {kind: 'count', need: digest, felt: ['unsettled', 'settling', 'settled']}},
    steps: {seq8: {open: 'working', felt: 'The new potion takes.'}}});

test('lotm: Seer and Corpse Collector advance Seq 9 to 8 through the same step code', () => {
    for (const [path, digest] of [[seerPathway, LOTM_DIGEST_ACTS], [corpsePathway, ccRow.digest]]) {
        const row = lotmRow(path, digest);
        let rec = createPosition(row, {position: 1});
        const ready = {assessed: true, examined: true, heldClown: true, heldNext: true};
        assert.equal(trackFelt(row, rec, 'acting'), 'unsettled');
        assert.equal(stepQuote(row, rec, ready).admitted, false, 'undigested');
        for (let i = 0; i < digest - 1; i++) rec = accrue(row, rec, 'acting', 1);
        assert.equal(trackFelt(row, rec, 'acting'), 'settling');
        assert.equal(crossStep(row, rec, ready).refused, true);
        rec = accrue(row, rec, 'acting', 1);
        assert.equal(pathFacts(row, rec)['acting.met'], true);
        assert.equal(trackFelt(row, rec, 'acting'), 'settled');
        const r = crossStep(row, rec, ready);
        assert.equal(r.ok, true);
        assert.equal(r.record.position, 2);
        assert.deepEqual(r.effects.at(-1).grants, [...path.stages[2].grants]);
        assert.equal(stepQuote(row, r.record, ready).capped, true, 'the slice ceiling holds at Seq 8');
    }
});

// Gu: Rank One peak to Rank Two through a K working; the host reads the holder at the step time.
const law = progressionLaw({kind: 'body', rows: [riGuMasterRow]});
const pressable = (sea, stones) => sea + stones * RI_STONE_PARTS; // G's law: the sea plus what stones can refill
function gu(sea, stones, position = 4) {
    const rec = createPosition(riGuMasterRow, {position});
    return {kind: 'body', id: 'fang', positions: {'ri.gu_master': rec}, facts: {apertureActive: true, pressable: pressable(sea, stones)}};
}
const method = crossingMethod(law, riGuMasterRow, {kind: 'body', to: 4, minutes: riGuMasterRow.dials.wallMinutes.default});
const run = (holder, {at = 0, now} = {}) => {
    const record = beginWorking(law, method, {id: 'fang.rank2', bindings: {holder: {kind: 'body', id: 'fang'}}, at});
    return settleWorking(law, record, {now: now ?? record.deadlines.at(-1), ports: {read: () => holder}});
};

test('gu: the chapter 87-92 numbers reproduce both attempts', () => {
    const first = run(gu(38, 0, 3));
    assert.equal(first.record.status, 'complete');
    assert.equal(first.record.receipts[0].truth.facts.failed, 'Your sea ran too low to keep pressing; the cracks knit shut.');
    assert.ok(!first.effects.some(e => e.effect.kind === PROGRESSION_EFFECTS.crossed));
    const second = run(gu(44, 6, 3));
    const crossed = second.effects.find(e => e.effect.kind === PROGRESSION_EFFECTS.crossed).effect;
    assert.equal(crossed.position.position, 4);
    const spent = second.effects.find(e => e.effect.kind === PROGRESSION_EFFECTS.spent).effect;
    assert.equal(pressable(44, 6) - spent.amount, 20, 'about twenty parts remain');
});

test('gu: a body with a smaller sea fails by the same rule and passes with more stones', () => {
    assert.ok(!run(gu(12, 6, 3)).effects.some(e => e.effect.kind === PROGRESSION_EFFECTS.crossed));
    assert.ok(run(gu(12, 7, 3)).effects.some(e => e.effect.kind === PROGRESSION_EFFECTS.crossed));
});

test('gu: quote equals settlement, any partition gives the same record, and a reload continues', () => {
    const holder = gu(44, 6, 3);
    const q = quoteWorking(law, method, {id: 'fang.rank2', bindings: {holder: {kind: 'body', id: 'fang'}}, at: 0, ports: {read: () => holder}});
    const whole = run(holder);
    assert.deepEqual(q.effects, whole.effects.map(e => e.effect));
    let rec = beginWorking(law, method, {id: 'fang.rank2', bindings: {holder: {kind: 'body', id: 'fang'}}, at: 0});
    const out = [];
    for (const t of [10, 1440, 2000, 4319]) { const r = settleWorking(law, rec, {now: t, ports: {read: () => holder}}); rec = r.record; out.push(...r.effects); }
    rec = restoreWorking(law, serializeWorking(rec));
    const last = settleWorking(law, rec, {now: 4320, ports: {read: () => holder}});
    assert.deepEqual(last.record, whole.record);
    assert.deepEqual([...out, ...last.effects], whole.effects);
});

test('gu: leaving partway interrupts the attempt with nothing crossed or spent', () => {
    let rec = beginWorking(law, method, {id: 'fang.rank2', bindings: {holder: {kind: 'body', id: 'fang'}}, at: 0});
    rec = interruptWorking(rec, {at: 1000, reason: 'You stopped pressing; the cracks close.'});
    const r = settleWorking(law, rec, {now: 5000, ports: {read: () => gu(44, 6, 3)}});
    assert.equal(r.record.status, 'interrupted');
    assert.deepEqual(r.effects, []);
});

test('gu: Rank One sub-stages open by themselves as G supplies them, and a working cannot skip ahead', () => {
    const rec = createPosition(riGuMasterRow);
    const r = openAutoSteps(riGuMasterRow, rec, {'rank1.middle': true, 'rank1.upper': true});
    assert.equal(r.record.position, 2);
    const holder = {...gu(44, 6), positions: {'ri.gu_master': r.record}};
    const out = settleWorking(law, beginWorking(law, method, {id: 'x', bindings: {holder: {kind: 'body', id: 'fang'}}, at: 0}),
        {now: 4320, ports: {read: () => holder}});
    assert.equal(out.record.status, 'interrupted');
});

test('rows refuse what they cannot run', () => {
    assert.throws(() => definePathRow({path: {...riGuMasterRow.path}, steps: {rank2_initial: {open: 'working', supply: {fact: 'x', need: 'nope'}, fail: {reason: 'r'}}}}), /dial/);
    assert.throws(() => definePathRow({path: {...riGuMasterRow.path}, dials: {d: {default: 1, reason: 'r'}}, steps: {rank2_initial: {open: 'working', supply: {fact: 'x', need: 'd'}}}}), /failing/);
    assert.throws(() => createPosition(riGuMasterRow, {position: 9}), /Invalid position/);
});

test('lotm live: one digestion counter writes the same facts and felt words for every pathway', async () => {
    const {digestionFacts, digestionFelt} = await import('../src/book_world_lotm_digestion.js');
    const {pathwayRows} = await import('../src/book_world_lotm_rows.js');
    for (const [prefix, need] of [['lotm', LOTM_DIGEST_ACTS], ['lotm.clown', LOTM_DIGEST_ACTS], ...pathwayRows.map(r => [`lotm.${r.key}`, r.digest])]) {
        for (let acts = 0; acts <= need + 1; acts++) {
            const f = digestionFacts({}, prefix, acts, need);
            assert.equal(f[`${prefix}.acting`], acts);
            assert.equal(f[`${prefix}.digested`], acts >= need);
            assert.equal(digestionFelt(f, prefix), acts >= need ? 'settled' : acts > 0 ? 'settling' : 'unsettled');
        }
        assert.equal(digestionFacts({}, prefix, undefined, need)[`${prefix}.acting`], 0);
    }
});

test('tempering: the path row rolls exactly as the breakthrough trial and reads the same gate', async () => {
    const {temperingRow, trialRules, temperingGate, stageNeed} = await import('../src/pledges_content.js');
    const {attemptBreakthrough, createTrialState} = await import('../src/breakthrough_trial.js');
    const {evaluateGate} = await import('../src/progression_gates.js');
    for (const tier of [1, 2, 3]) for (const pressure of [0, 3]) for (const units of [0, 5]) for (let roll = 0; roll < 1000; roll += 37) {
        const state = {...createTrialState(), pressure};
        const direct = attemptBreakthrough(trialRules, state, {tier, roll, progress: 0, units, stability: 4, scar: 1});
        const r = crossStep(temperingRow, createPosition(temperingRow, {position: tier - 1}), {trialFree: true, 'skill.combat': 9},
            {attempt: {roll, units, state, stability: 4, scar: 1}});
        assert.deepEqual(r.trial, direct);
        assert.equal(r.ok, direct.passed);
        assert.equal(r.record.position, direct.passed ? tier : tier - 1);
    }
    for (const tier of [1, 2, 3]) for (const combat of [0, 1, 3, 6]) {
        const facts = {'skill.combat': combat, 'skill.equilibrium': 0, 'skill.persistence': 0};
        const q = stepQuote(temperingRow, createPosition(temperingRow, {position: tier - 1}), {...facts, trialFree: true}, {knows: () => true});
        assert.deepEqual(q.gate, evaluateGate(temperingGate, facts, {dials: {need: stageNeed(tier)}, knows: () => true}));
    }
});

test('lotm lore LR4: undigested advancing leaves pressure in proportion; digested leaves the residual', async () => {
    const {lotmSeerRow, lotmCorpseCollectorRow, LOTM_LORE} = await import('../src/progression_packs/lotm_sequences.js');
    const held = {assessed: true, examined: true, heldClown: true, heldNext: true};
    for (const row of [lotmSeerRow, lotmCorpseCollectorRow]) {
        const need = row.tracks.acting.need;
        for (let acts = 0; acts <= need; acts++) {
            let rec = createPosition(row, {position: 1});
            if (acts) rec = accrue(row, rec, 'acting', acts);
            const r = crossStep(row, rec, held, {holder: 'klein'});
            assert.equal(r.ok, true, 'the rule lets a rushed drink happen; the cost is pressure');
            const p = r.effects.find(e => e.kind === PROGRESSION_EFFECTS.pressure);
            const missing = need - acts;
            if (missing === 0) assert.equal(p, undefined, 'digested Seq 9 to 8 leaves no residue at the default dial');
            else assert.deepEqual([p.amount, p.cause, p.missing], [Math.ceil(2 * missing / need), 'undigested', missing]);
            assert.match(r.observed.felt, missing ? /not settled/ : /takes\.$/);
        }
        const raised = crossStep(row, accrue(row, createPosition(row, {position: 1}), 'acting', need), held, {dials: {residualPressure: 1}});
        assert.equal(raised.effects.find(e => e.kind === PROGRESSION_EFFECTS.pressure).cause, 'residual');
        assert.equal(crossStep(row, createPosition(row, {position: 1}), {...held, assessed: false}).refused, true, 'other crossings still bind');
    }
    assert.ok(LOTM_LORE.every(l => l.locators.length > 0));
});

test('lotm lore LR3: what a Beyonder took in is conserved and released whole at death, the highest holding the rest', async () => {
    const {lotmSeerRow, LOTM_POTION_IDS} = await import('../src/progression_packs/lotm_sequences.js');
    const {heldConserved, releaseConserved} = await import('../src/progression_path.js');
    assert.deepEqual(releaseConserved(lotmSeerRow, createPosition(lotmSeerRow)), [], 'an ordinary person releases nothing');
    const nine = crossStep(lotmSeerRow, createPosition(lotmSeerRow), {heldSeer: true});
    assert.equal(nine.effects.find(e => e.kind === PROGRESSION_EFFECTS.crossed).conserves, LOTM_POTION_IDS.seer.seq9);
    const eight = crossStep(lotmSeerRow, accrue(lotmSeerRow, nine.record, 'acting', 6), {assessed: true, examined: true, heldClown: true});
    assert.deepEqual(heldConserved(lotmSeerRow, eight.record), [LOTM_POTION_IDS.seer.seq9, LOTM_POTION_IDS.seer.seq8]);
    const [released] = releaseConserved(lotmSeerRow, eight.record, {holder: 'klein', place: 'tingen.street', at: 99});
    assert.deepEqual(released, {kind: PROGRESSION_EFFECTS.released, holder: 'klein', path: 'lotm.seer', at: 99, place: 'tingen.street',
        identity: LOTM_POTION_IDS.seer.seq8, contains: [LOTM_POTION_IDS.seer.seq9]});
});
