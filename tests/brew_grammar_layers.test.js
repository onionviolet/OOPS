// Brewing grammar layers (chat B): GL2 effect sentences and GL3 composition,
// each with a canon test on two worlds (EF1, PFP26). Rates are reported, with
// floors set just under the measured result so a regression shows; the misses
// are named missing rules in the checkpoint.
import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_POTION_EFFECTS, HP_POTION_SENTENCES, LOTM_AID_SENTENCES, LOTM_POTION_EFFECTS, assemblePotionEffect,
    lotmPathwaySentences, predictionHolds} from '../src/world_packs/brew_effects_pack.js';
import {potionFamily} from '../scripts/b_coverage_ledgers.mjs';
import {composeBrew, precedenceKept} from '../src/brew_compose.js';
import {BREW_LAW, brewBalance} from '../src/brew_law.js';
import {beginWorking, settleWorking} from '../src/kernel_working.js';
import {LOTM_BREW_ROWS, lotmBrewRow, lotmDoseReading, lotmLots} from '../src/world_packs/lotm_brew_pack.js';
import {THERMAL_REVISION} from '../src/craft_process_thermal.js';

const evidenceIds = new Set((await import('node:fs')).readFileSync(new URL('../docs/research/hogwarts-potion-evidence-2026-11-11/observations.jsonl', import.meta.url), 'utf8')
    .trim().split('\n').map(l => JSON.parse(l).id));

test('GL2: every potion sentence assembles on its world grammar and lowers onto W', () => {
    const rows = [...HP_POTION_SENTENCES.map(r => [HP_POTION_EFFECTS, r]), ...LOTM_AID_SENTENCES.map(r => [LOTM_POTION_EFFECTS, r]),
        ...LOTM_BREW_ROWS.flatMap(row => lotmPathwaySentences(row).map(r => [LOTM_POTION_EFFECTS, r]))];
    for (const [grammar, row] of rows) {
        const a = assemblePotionEffect(grammar, row.parts);
        assert.ok(a.ok, `${row.id}: ${JSON.stringify(a.receipt.violations)}`);
        assert.ok(a.lowered.acts.length + a.lowered.publish.length > 0 && a.lowered.needs.length === 0, `${row.id}: ${JSON.stringify(a.lowered)}`);
    }
    for (const r of HP_POTION_SENTENCES) assert.ok(evidenceIds.has(r.evidence), `${r.id} cites a real evidence row`);
});

test('GL2 canon test: the title-only family predicts the evidence-labelled sentence', () => {
    const score = rows => {
        const judged = rows.map(r => ({id: r.id, family: potionFamily(r.title), holds: predictionHolds(potionFamily(r.title), r.parts)}));
        const predicted = judged.filter(j => j.holds !== null);
        return {rows: rows.length, predicted: predicted.length, hits: predicted.filter(j => j.holds).length,
            misses: predicted.filter(j => !j.holds).map(j => `${j.id} (${j.family})`)};
    };
    const hp = score(HP_POTION_SENTENCES), lotm = score(LOTM_AID_SENTENCES);
    // Hogwarts: 23 labelled, every title predicts, 19 hold (82.6%).
    assert.equal(hp.predicted, 23);
    assert.ok(hp.hits / hp.predicted >= 0.8, JSON.stringify(hp));
    assert.deepEqual(hp.misses.sort(), ['hp.effect.dr_ubblys_oblivious_unction (mind-state)', 'hp.effect.mandrake_restorative_draught (plant-or-creature-target)',
        'hp.effect.skele_gro (body-door)', 'hp.effect.wolfsbane_potion (body-form)']);
    // Lord of the Mysteries: 6 labelled; only 2 titles say anything, both hold.
    assert.equal(lotm.predicted, 2);
    assert.equal(lotm.hits, 2);
});

const thermal = {law: {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1},
    maker: {tools: ['brazier'], competence: 4, workCapacity: 1000, fuelStock: 10000, heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 900, heaterTool: 'brazier', agitationTool: 'paddle', requiredCompetence: 2}};
const cauldron = {kind: 'vessel', id: 'cauldron', place: 'room', retainPermille: 0, closure: 'open',
    thermal: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2}};

// Held-out canon orders: the composer never reads these pairs.
const CANON = [
    {id: 'lotm.seer', world: 'lotm', evidence: 'S 0031 (supplements, then the two crucial ones)',
        build: () => {
            const row = lotmBrewRow('fool_9');
            return {parts: row.slots.map(s => ({slot: s.id, role: s.role})), process: {react: {minutes: 60, options: {reactions: [row.reaction]}}, finish: [{op: 'divide', minutes: 60, options: {doses: 1}}]},
                dials: {order: 'aux-then-main'}};
        },
        pairs: ['a1', 'a2', 'a3', 'a4', 'a5'].flatMap(a => ['m1', 'm2'].map(m => [`admit:${a}`, `admit:${m}`]))},
    {id: 'hp.cure_for_boils', world: 'hogwarts', evidence: 'HPPE002, HPPE003, HPPE004',
        build: () => ({parts: [{slot: 'nettles', role: 'base'}, {slot: 'fangs', role: 'active', prepare: {how: 'crush', minutes: 5}},
            {slot: 'slugs', role: 'solvent', prepare: {how: 'stew', minutes: 30}}, {slot: 'quills', role: 'additive', tags: ['function.heat_reactive']}],
        process: {heat: {minutes: 10, options: {...thermal}}, finish: [{op: 'divide', minutes: 1, options: {doses: 1}}]}, dials: {order: 'listed'}}),
        pairs: [['prepare:fangs', 'admit:fangs'], ['prepare:slugs', 'admit:slugs'], ['heat', 'cool'], ['cool', 'admit:quills']]},
    {id: 'hp.polyjuice', world: 'hogwarts', evidence: 'HPPE013, HPPE015, HPPE020',
        build: () => ({parts: [{slot: 'lacewing', role: 'active', prepare: {how: 'stew', minutes: 30240}}, {slot: 'leeches', role: 'active'},
            {slot: 'fluxweed', role: 'active'}, {slot: 'knotgrass', role: 'active'}, {slot: 'bicorn', role: 'active', prepare: {how: 'powder', minutes: 10}},
            {slot: 'boomslang', role: 'active', prepare: {how: 'shred', minutes: 10}}, {slot: 'donor', role: 'identity'}],
        process: {react: {minutes: 2880}, finish: [{op: 'divide', minutes: 1, options: {doses: 3}}]}, dials: {order: 'listed'}}),
        pairs: [['prepare:lacewing', 'admit:lacewing'], ['admit:leeches', 'admit:lacewing'], ['prepare:bicorn', 'admit:bicorn']], atDelivery: ['donor']},
];

test('GL3 canon test: held-out recipe orders rebuilt from their parts, and every composed brew runs through K', () => {
    const report = [];
    for (const c of CANON) {
        const spec = c.build();
        const composed = composeBrew({id: `composed.${c.id}`, ...spec});
        const kept = precedenceKept(composed.sequence, c, composed);
        report.push({id: c.id, ...kept, misses: kept.results.filter(r => !r.ok).map(r => r.pair)});
        // It runs: every slot gets a lot; the ledger balances; the working completes.
        const lots = Object.fromEntries(spec.parts.map(p => [p.slot, {kind: 'lot', id: `lot.${p.slot}`, material: p.slot, amount: 1000, properties: {active: 500}}]));
        if (c.id === 'lotm.seer') Object.assign(lots, lotmLots(lotmBrewRow('fool_9')));
        const things = {cauldron, ...Object.fromEntries(Object.values(lots).map(l => [l.id, l]))};
        const bindings = {vessel: {kind: 'vessel', id: 'cauldron'}, ...Object.fromEntries(Object.entries(lots).map(([k, l]) => [k, {kind: 'lot', id: l.id}]))};
        for (const slot of composed.atDelivery) delete bindings[slot];
        for (const slot of composed.atDelivery) delete composed.method.roles[slot];
        const {record} = settleWorking(BREW_LAW, beginWorking(BREW_LAW, composed.method, {id: `w.${c.id}`, bindings, at: 0}),
            {now: 99999, ports: {read: ref => things[ref.id] ?? null}});
        assert.equal(record.status, 'complete', c.id);
        assert.ok(brewBalance(record.facts).balanced, c.id);
        if (c.id === 'lotm.seer') {
            const row = lotmBrewRow('fool_9');
            const canonical = settleWorking(BREW_LAW, beginWorking(BREW_LAW, row.method, {id: 'w.canon', bindings, at: 0}), {now: 99999, ports: {read: ref => things[ref.id] ?? null}}).record;
            assert.deepEqual(lotmDoseReading(row, record.facts.brew.doses[0]), lotmDoseReading(row, canonical.facts.brew.doses[0]), 'same dose as the canon method');
        }
    }
    const kept = report.reduce((n, r) => n + r.kept, 0), total = report.reduce((n, r) => n + r.total, 0);
    // 10 + 4 + 3 of 18 canon pairs hold (94.4%); the one miss is the Polyjuice leeches-before-lacewings order.
    assert.equal(total, 18);
    assert.equal(kept, 17, JSON.stringify(report));
    assert.deepEqual(report.flatMap(r => r.misses), ['admit:leeches < admit:lacewing']);
});

test('GL3: CR3 holds back a heat-reactive part, and the dial lets a world add it on the fire', () => {
    const parts = [{slot: 'base', role: 'base'}, {slot: 'quills', role: 'additive', tags: ['function.heat_reactive']}];
    const process = {heat: {minutes: 5, options: thermal}};
    assert.deepEqual(composeBrew({id: 'a', parts, process}).sequence, ['admit:base', 'heat', 'cool', 'admit:quills']);
    assert.deepEqual(composeBrew({id: 'b', parts, process, dials: {heatReactiveWaits: false}}).sequence, ['admit:base', 'admit:quills', 'heat']);
});
