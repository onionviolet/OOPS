import test from 'node:test';
import assert from 'node:assert/strict';
import {defineAbilityRecords, abilityView} from '../src/ability_records.js';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const rows = limit => [{key: 'spark', label: 'Throw a spark', sourceId: 'abl.gift', conditions: [{label: 'Hands free', requires: eq('actor.handsFree')}],
    cost: [{type: 'resource', scope: 'actor', key: 'spirit', amount: -2}], limit, effects: [{type: 'item', actor: 'player', key: '{"id":"abl.spark"}', amount: 1}],
    price: [{type: 'resource', scope: 'actor', key: 'strain', amount: 1}], failure: {hook: 'abl.backlash'}, unstated: ['range']}];

function setup(limit, {learn = true} = {}) {
    const set = defineAbilityRecords(rows(limit), {prefix: 'abl', world: {id: 'abl.world'}});
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: 'abl.world', label: 'Synthetic'}], sources: set.definition.sources,
        simulation: {commands: [...set.commands, {id: 'abl.learn', revision: 1, label: 'Learn', worldId: 'abl.world', costs: [], effects: set.grants.spark}], powers: set.powers, people: [], onEnroll: [{type: 'source', sourceId: 'abl.gift', operation: 'grant', awakened: true, active: true}, ...set.seeds]}});
    const state = createExpansionState();
    state.actors.player.worldId = 'abl.world'; state.worlds['abl.world'] = {facts: {}, resources: {}, completed: {}};
    state.actors.player.resources.spirit = 5; state.actors.player.facts.handsFree = true;
    const context = {actorId: 'player', worldId: 'abl.world', facts: {}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}, external: {}};
    const f = {set, registry, context, plan: enrollSimulation(state, registry, context)};
    if(learn && set.grants.spark.length) f.plan = commitSimulationCommand(f.plan.state, registry, {id: 'abl.learn'}, {...context, gameplay: f.plan.gameplay});
    return f;
}
const cmd = 'abl.use.spark';
const preview = f => previewSimulationCommand(f.plan.state, f.registry, cmd, {...f.context, gameplay: f.plan.gameplay});
const use = f => commitSimulationCommand(f.plan.state, f.registry, {id: cmd}, {...f.context, gameplay: f.plan.gameplay});

test('the row lowers to a native command: condition refuses, cost is paid in the ledger, price and effect apply', () => {
    const f = setup({kind: 'none'});
    assert.equal(preview(f).eligible, true);
    const r = use(f);
    assert.equal(r.state.actors.player.resources.spirit, 3);
    assert.equal(r.gameplay.player.inventory['{"id":"abl.spark"}'], 1);
    f.plan.state.actors.player.facts.handsFree = false;
    const before = structuredClone(f.plan.state);
    assert.equal(preview(f).eligible, false);
    assert.throws(() => use(f));
    assert.deepEqual(f.plan.state, before);
    f.plan.state.actors.player.facts.handsFree = true; f.plan.state.actors.player.resources.spirit = 1;
    assert.equal(preview(f).eligible, false);
});

test('a cooldown limit refuses until the minutes pass and reports when it recovers', () => {
    const f = setup({kind: 'cooldown', minutes: 30});
    const r = use(f);
    const again = previewSimulationCommand(r.state, f.registry, cmd, {...f.context, gameplay: r.gameplay});
    assert.equal(again.eligible, false);
    assert.match(again.reasons.join(' '), /recovers in 30/);
});

test('a charge limit spends one charge per use and refuses at empty', () => {
    const f = setup({kind: 'charges', max: 2, recharge: {when: 'empty', requires: eq('actor.rested')}});
    let state = f.plan.state, gameplay = f.plan.gameplay;
    for(let i = 0; i < 2; i++) {const r = commitSimulationCommand(state, f.registry, {id: cmd}, {...f.context, gameplay}); state = r.state; gameplay = r.gameplay;}
    assert.equal(previewSimulationCommand(state, f.registry, cmd, {...f.context, gameplay}).eligible, false);
});

test('the read model reports condition labels, cost, limit and the failure hook without the predicate', () => {
    const {cards} = defineAbilityRecords(rows({kind: 'cooldown', minutes: 30}), {prefix: 'abl', world: {id: 'abl.world'}});
    const v = abilityView(cards.spark, {facts: {'actor.handsFree': false}, readyIn: 10});
    assert.equal(v.ready, false);
    assert.deepEqual(v.refusedBy, ['Hands free', 'recovering']);
    assert.deepEqual(v.cost, [{what: 'spirit', amount: 2}]);
    assert.equal(v.failureHook, 'abl.backlash');
    assert.deepEqual(v.unstated, ['range']);
    assert.ok(!JSON.stringify(v).includes('actor.handsFree'));
    assert.equal(abilityView(cards.spark, {facts: {'actor.handsFree': true}}).ready, true);
});

test('authoring rejects unowned sources, positive costs, bad limits and duplicates', () => {
    for(const change of [r => r.sourceId = 'foreign.gift', r => r.cost = [{type: 'resource', key: 'x', amount: 1}], r => r.limit = {kind: 'cooldown'}, r => r.effects = [], r => r.pretend = 1]) {
        const r = rows({kind: 'none'}); change(r[0]);
        assert.throws(() => defineAbilityRecords(r, {prefix: 'abl', world: {id: 'abl.world'}}));
    }
    const dup = rows({kind: 'none'}); dup.push(dup[0]);
    assert.throws(() => defineAbilityRecords(dup, {prefix: 'abl', world: {id: 'abl.world'}}));
});

// Learnable layer (GM8, GM40): taught, gated by prerequisites, practiced, then cast.
import {learnView} from '../src/ability_records.js';
const learnRows = () => [
    {key: 'basic', label: 'Basic charm', sourceId: 'abl.gift', conditions: [], cost: [], limit: {kind: 'none'}, effects: [{type: 'item', actor: 'player', key: '{"id":"abl.basic"}', amount: 1}],
        learn: {teacher: {label: 'A teacher is present', reason: 'No one here can teach it.', requires: eq('actor.teacherHere')}, signs: [{at: 1, text: 'The first try sputters.'}]}},
    {key: 'adv', label: 'Advanced charm', sourceId: 'abl.gift', conditions: [], cost: [], limit: {kind: 'cooldown', minutes: 10}, effects: [{type: 'item', actor: 'player', key: '{"id":"abl.adv"}', amount: 1}],
        learn: {teacher: {label: 'A teacher is present', reason: 'No one here can teach it.', requires: eq('actor.teacherHere')},
            prerequisites: [{label: 'Knows the basic charm', reason: 'Learn the basic charm first.', requires: eq('power.abl.power.basic.owned')}],
            lessonCost: [{type: 'resource', scope: 'actor', key: 'spirit', amount: -1}], practice: {minutes: 20, mastery: 1}, masteryNeeded: 2,
            signs: [{at: 1, text: 'It holds for a breath.'}, {at: 2, text: 'It answers the first time.'}]}}];
function learnWorld() {
    const set = defineAbilityRecords(learnRows(), {prefix: 'abl', world: {id: 'abl.world'}});
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: 'abl.world', label: 'Synthetic'}], sources: set.definition.sources,
        simulation: {commands: set.commands, powers: set.powers, people: [], onEnroll: [{type: 'source', sourceId: 'abl.gift', operation: 'grant', awakened: true, active: true}, ...set.seeds]}});
    const state = createExpansionState();
    state.actors.player.worldId = 'abl.world'; state.worlds['abl.world'] = {facts: {}, resources: {}, completed: {}};
    state.actors.player.resources.spirit = 5; state.actors.player.facts.teacherHere = true;
    const context = {actorId: 'player', worldId: 'abl.world', facts: {}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}, external: {}};
    return {set, registry, context, plan: enrollSimulation(state, registry, context)};
}
const q = (f, id) => previewSimulationCommand(f.plan.state, f.registry, id, {...f.context, gameplay: f.plan.gameplay});
const run = (f, id) => {const r = commitSimulationCommand(f.plan.state, f.registry, {id}, {...f.context, gameplay: f.plan.gameplay}); f.plan = {...f.plan, state: r.state, gameplay: r.gameplay}; return r;};

test('a spell is refused before its prerequisite and teacher, learned after, then needs practice to cast', () => {
    const f = learnWorld();
    assert.equal(q(f, 'abl.learn.adv').eligible, false);
    assert.match(q(f, 'abl.learn.adv').reasons.join(' '), /Knows the basic charm/);
    f.plan.state.actors.player.facts.teacherHere = false;
    assert.match(q(f, 'abl.learn.basic').reasons.join(' '), /A teacher is present/);
    f.plan.state.actors.player.facts.teacherHere = true;
    run(f, 'abl.learn.basic');
    assert.equal(q(f, 'abl.learn.basic').eligible, false, 'once');
    assert.equal(q(f, 'abl.learn.adv').eligible, true);
    run(f, 'abl.learn.adv');
    assert.equal(f.plan.state.actors.player.resources.spirit, 4);
    assert.equal(q(f, 'abl.use.adv').eligible, false, 'known but not practiced');
    assert.equal(q(f, 'abl.practice.adv').eligible, true);
    for(let i = 0; i < 2; i++) {
        const r = run(f, 'abl.practice.adv');
        const done = advanceSimulation(r.state, f.registry, 20, r.external, r.gameplay);
        f.plan = {...f.plan, state: done.state, gameplay: done.gameplay ?? r.gameplay};
    }
    assert.equal(f.plan.state.simulation.powers.player['abl.power.adv'].mastery, 2);
    assert.equal(q(f, 'abl.use.adv').eligible, true, 'practiced to the needed mastery');
});

test('the learning read model reports stage, authored refusal reasons and signs of progress, and lists what the row leaves unstated', () => {
    const {cards} = defineAbilityRecords(learnRows(), {prefix: 'abl', world: {id: 'abl.world'}});
    const un = learnView(cards.adv, {facts: {'actor.teacherHere': false}});
    assert.equal(un.stage, 'unlearned'); assert.equal(un.canLearn, false);
    assert.deepEqual(un.refusedBy, ['No one here can teach it.', 'Learn the basic charm first.']);
    const mid = learnView(cards.adv, {facts: {'power.abl.power.adv.owned': true, 'power.abl.power.adv.mastery': 1}});
    assert.equal(mid.stage, 'practicing'); assert.equal(mid.sign, 'It holds for a breath.'); assert.equal(mid.nextSignAt, 2);
    assert.equal(learnView(cards.adv, {facts: {'power.abl.power.adv.owned': true, 'power.abl.power.adv.mastery': 2}}).stage, 'castable');
    assert.deepEqual(cards.basic.unstated, ['practice time']);
    assert.equal(learnView(cards.spark ?? cards.basic, {}) !== null, true);
});

test('a learn block with a gate missing its reason or a threshold without practice is rejected', () => {
    for(const change of [l => l.teacher = {label: 'T', requires: eq('x')}, l => {delete l.practice; l.masteryNeeded = 2;}, l => l.signs = [{at: 0, text: 'x'}]]) {
        const rows = learnRows(); change(rows[1].learn);
        assert.throws(() => defineAbilityRecords(rows, {prefix: 'abl', world: {id: 'abl.world'}}));
    }
});
