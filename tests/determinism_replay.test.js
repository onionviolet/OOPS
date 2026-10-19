import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createExpansionState, createContentRegistry, loadExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation, setSimulationProgram, commitSimulationCommand, nextSimulationBoundary} from '../src/simulation.js';
import {initializeExpedition, expeditionRegistry} from '../src/expedition_content.js';

// Controlled SOURCE fixtures, never native acquisition or browser-save evidence.
const wood = JSON.stringify({id: 'Rough wood log'});
const kit = JSON.stringify({id: 'Prepared survey kit'});
const boundaries = 48;
const facts = {location: 'Village', 'village.craftsmanMet': true, 'village.shackUnlocked': true};
const context = p => ({actorId: 'player', external: p.external, gameplay: p.gameplay, facts});
const registry = createContentRegistry({worlds: [{id: 'base.frontier'}], simulation: {
    commands: [{id: 'replay.work', revision: 1, label: 'Replay work', duration: 3,
        automatable: true, cancellation: 'refund',
        costs: [{type: 'item', key: wood, amount: -1}, {type: 'resource', key: 'money', native: true, amount: -1}],
        effects: [{type: 'resource', key: 'practice', amount: 1}],
        outcomes: [{id: 'one', weight: 1, effects: [{type: 'item', key: kit, amount: 1}]},
            {id: 'two', weight: 1, effects: [{type: 'item', key: kit, amount: 2}]}]}],
    events: [{id: 'replay.weather', revision: 1, label: 'Replay weather', interval: 2,
        lifetime: 1, automatic: true, public: true, mode: 'ambient', chance: 0.5,
        effects: [{type: 'resource', key: 'signals', amount: 1}]}],
}});
function seeded(seed, content = registry) {
    const p = {state: content === expeditionRegistry ? initializeExpedition(createExpansionState(seed)) : createExpansionState(seed),
        external: {money: 30}, gameplay: {player: {inventory: {[wood]: 20}, skills: {}, reputation: {Village: 0}}}};
    if (content === expeditionRegistry) p.gameplay.oldCraftsman = {inventory: {}, skills: {}, reputation: {Village: 0}};
    const enrolled = enrollSimulation(p.state, content, context(p));
    return content === registry ? setSimulationProgram(enrolled.state, content, 'replay.work', 8, context(enrolled))
        : commitSimulationCommand(enrolled.state, content, {id: 'village.commission'}, {...context(enrolled), targetId: 'oldCraftsman'});
}
function durable(p) {
    // Omit only transient transaction receipts/return values. Keep every state
    // field and the native resource domains the headless engine consumes.
    return JSON.parse(JSON.stringify({state: p.state, external: p.external, gameplay: p.gameplay,
        equipment: p.equipment || {}, ownership: p.ownership || {}, vitals: p.vitals || {}}));
}
function canonical(v) {
    if (Array.isArray(v)) return v.map(canonical);
    if (v !== null && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])]));
    return v;
}
const hash = v => createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex');
function reload(p, content) {
    // An in-memory JSON save envelope, read through the real expansion loader.
    // No localStorage, user save, private pack, or format/migration change.
    const saved = JSON.parse(JSON.stringify(durable(p)));
    return {...saved, state: loadExpansionState(saved.state, content)};
}
function advance(p, content, count) {
    const trace = [];
    for (let i = 0; i < count; i++) {
        const due = nextSimulationBoundary(p.state);
        assert.ok(Number.isSafeInteger(due) && due > p.state.clock, 'fixture needs a future causal boundary');
        p = advanceSimulation(p.state, content, due - p.state.clock, p.external, p.gameplay, {player: {facts}});
        assert.equal(p.state.clock, due);
        assert.equal(p.remaining, 0);
        assert.equal(p.budgetExhausted, false);
        assert.equal(p.stoppedAtChoice, false);
        trace.push(hash(durable(p)));
    }
    return {plan: p, trace};
}
function rejectAmbientRandom(t) {
    t.mock.method(Math, 'random', () => {throw new Error('Headless replay used ambient Math.random');});
}

test('stable hash sorts object keys but preserves arrays and resource/RNG differences', () => {
    assert.equal(hash({b: [1, 2], a: {z: 3, x: 4}}), hash({a: {x: 4, z: 3}, b: [1, 2]}));
    assert.notEqual(hash([1, 2]), hash([2, 1]));
    for (const field of ['rng', 'money', 'count']) assert.notEqual(hash({[field]: 1}), hash({[field]: 2}));
});
test('seeded jobs, event rolls and finite routines replay 48 causal boundaries exactly', t => {
    rejectAmbientRandom(t);
    const finals = [];
    for (const seed of [17, 42, 0xcafe]) {
        const start = seeded(seed), before = hash(durable(start));
        const first = advance(start, registry, boundaries), second = advance(seeded(seed), registry, boundaries);
        assert.deepEqual(first.trace, second.trace);
        assert.equal(hash(durable(first.plan)), hash(durable(second.plan)));
        assert.equal(hash(durable(start)), before, 'advancing must not mutate the input');
        assert.equal(first.plan.state.simulation.programs.player.status, 'complete');
        assert.equal(first.plan.state.actors.player.resources.practice, 8);
        assert.equal(first.plan.external.money, 22);
        assert.equal(first.plan.gameplay.player.inventory[wood], 12);
        assert.ok(first.plan.gameplay.player.inventory[kit] >= 8);
        assert.ok(first.plan.state.simulation.checks['replay.weather'].count > 10);
        assert.ok(Object.keys(first.plan.state.simulation.events).length > 0);
        assert.notEqual(first.plan.state.simulation.seed, start.state.simulation.seed);
        finals.push(first.trace.at(-1));
        t.diagnostic(`seed=${seed}; boundaries=${boundaries}; clock=${first.plan.state.clock}; sha256=${first.trace.at(-1)}`);
    }
    assert.equal(new Set(finals).size, 3, 'different seeds must remain observable');
});
test('JSON save/reload resumes frozen paid jobs and RNG cursors without replay drift', t => {
    rejectAmbientRandom(t);
    const expected = advance(seeded(17), registry, boundaries);
    for (const split of [1, 11]) {
        const prefix = advance(seeded(17), registry, split), restored = reload(prefix.plan, registry);
        assert.equal(hash(durable(restored)), hash(durable(prefix.plan)), 'reload must preserve the entire durable envelope');
        if (split === 1) assert.ok(restored.state.simulation.jobs.length > 0, 'save while a paid outcome is frozen');
        const suffix = advance(restored, registry, boundaries - split);
        assert.deepEqual([...prefix.trace, ...suffix.trace], expected.trace);
        assert.equal(hash(durable(suffix.plan)), hash(durable(expected.plan)));
    }
});
test('loaded expedition content replays commission, NPC work and event boundaries', t => {
    rejectAmbientRandom(t);
    const first = advance(seeded(17, expeditionRegistry), expeditionRegistry, boundaries);
    const second = advance(seeded(17, expeditionRegistry), expeditionRegistry, boundaries);
    assert.deepEqual(first.trace, second.trace);
    const prefix = advance(seeded(17, expeditionRegistry), expeditionRegistry, 1);
    assert.ok(prefix.plan.state.simulation.jobs.length > 0);
    const suffix = advance(reload(prefix.plan, expeditionRegistry), expeditionRegistry, boundaries - 1);
    assert.deepEqual([...prefix.trace, ...suffix.trace], first.trace);
    assert.equal(first.plan.gameplay.oldCraftsman.inventory[kit], 1);
    t.diagnostic(`expedition; boundaries=${boundaries}; clock=${first.plan.state.clock}; sha256=${first.trace.at(-1)}`);
});

// The former test.todo entries for legacy default-RNG paths (combat, local life, encounter/loot/craft/market)
// were removed 2026-10-19: those sites now draw from saved streams and fail loudly when unseeded. The native
// replay with Math.random forbidden lives in seeded_streams.test.js ("native lineup, loot, stock and pending
// fighter turns survive save/restore with Math.random forbidden"). Remaining Math.random sites are cosmetic.
