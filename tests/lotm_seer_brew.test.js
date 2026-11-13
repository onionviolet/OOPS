// W2a (LT7 Klein): Old Neil's Seer brew through the shared craft engine, and the binding onto the pack's brew and drink acts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateRule} from '../src/rules.js';
import {cancelSimulationJob, commitSimulationCommand, previewSimulationCommand} from '../src/simulation.js';
import {createSimulationRegistry, validateSimulationState} from '../src/simulation_contracts.js';
import {fresh, ctx, wait, registry, I} from './lotm_helpers.js';
import {LOTM_INBOX, lotmLossLine} from '../src/book_world_lotm_harm.js';
import {brewSeer, bindSeerBrew, seedSeerStock, SEER_BREW_BINDING, SEER_BREW_FACTS} from '../src/lotm_seer_brew.js';

test('the formula batch has the Seer’s power and no madness; the same inputs give the same product', () => {
    const p = brewSeer();
    assert.deepEqual(p.outputs, {beyonder: {seer: 57}});
    assert.equal(brewSeer().id, p.id);
});

test('the measured allocation is Neil’s one-time stock and the reserved amounts determine the cup', () => {
    const {brewAct, consumer} = SEER_BREW_BINDING;
    const state = {worlds: {lotm: {facts: {}}}, actors: {player: {facts: {}}, neil: {resources: {}}}, simulation: {jobs: []}};
    const commands = [{id: brewAct, targetId: 'neil', duration: 20, costs: [], effects: []}, {id: consumer, effects: []}];
    assert.equal(seedSeerStock(state, 'lotm', 'neil'), true);
    bindSeerBrew(commands);
    const [cup, , measure] = commands;
    assert.equal(measure.costs.length, 7);
    assert.deepEqual(cup.costs, []);
    for(const cost of measure.costs) {
        assert.equal(cost.actor, 'neil');
        assert.equal(state.actors.neil.resources[cost.key], -cost.amount);
        state.actors.neil.resources[cost.key] += cost.amount;
    }
    const loaded = JSON.parse(JSON.stringify(state));
    assert.equal(seedSeerStock(loaded, 'lotm', 'neil'), false);
    assert.ok(Object.values(loaded.actors.neil.resources).every(qty => qty === 0));

    const variant = [{id: brewAct, targetId: 'neil', duration: 20, costs: [], effects: []}, {id: consumer, effects: []}];
    bindSeerBrew(variant, {'Lavos Squid blood': 11});
    assert.equal(variant[2].costs.find(c => c.key.endsWith('.lavos-squid-blood')).amount, -11);
    assert.equal(variant[0].effects.find(e => e.key === SEER_BREW_FACTS.madness).value, 1);
});

test('both Seer measurements share stock but keep separate final-step prerequisites', () => {
    const {brewAct, consumer} = SEER_BREW_BINDING;
    const commands = [{id: brewAct, targetId: 'neil', duration: 20, costs: [], effects: []}, {id: consumer, effects: []}];
    const state = {worlds: {lotm: {facts: {}}}, actors: {player: {facts: {}}, neil: {resources: {}}}, simulation: {jobs: []}};
    seedSeerStock(state, 'lotm', 'neil');
    assert.equal(seedSeerStock(state, 'lotm', 'neil', {overmeasure: true}), true);
    assert.equal(seedSeerStock(state, 'lotm', 'neil', {overmeasure: true}), false);
    bindSeerBrew(commands, {}, {overmeasure: true});
    const [standard, , standardMeasure, extraMeasure, extra] = commands;
    const blood = standardMeasure.costs.find(cost => cost.key.endsWith('.lavos-squid-blood')).key;
    assert.equal(state.actors.neil.resources[blood], 11);
    assert.equal(standardMeasure.costs.find(cost => cost.key === blood).amount, -10);
    assert.equal(extraMeasure.costs.find(cost => cost.key === blood).amount, -11);
    assert.equal(extra.procedure.parentId, brewAct);
    const measured = {[`actor.${extra.procedure.key}`]: 1};
    assert.equal(evaluateRule(extra.requires, measured).met, true);
    assert.equal(evaluateRule(standard.requires, measured).met, false);
});

test('simulation reserves Seer stock, refunds interruption, and settles a loaded batch once', () => {
    const {brewAct, consumer} = SEER_BREW_BINDING;
    const room = 'fixture.seer-room';
    const base = {revision: 1, actorId: 'player', worldId: I.world, group: 'book_lotm', location: room,
        duration: 2, cancellation: 'refund', completionFailure: 'refund', label: 'Work at the alchemy bench', costs: [], effects: []};
    const commands = [{...base, id: brewAct, targetId: I.supervisor}, {...base, id: consumer}];
    const measured = {'Lavos Squid blood': 11};
    bindSeerBrew(commands, measured);
    const [cup, drink, measure] = commands;
    const defs = createSimulationRegistry({commands});
    for(const [id, def] of defs.commands) registry.simulation.commands.set(id, def);
    const context = (p, def) => ctx(p, def.targetId);
    const eligible = (p, def) => previewSimulationCommand(p.state, registry, def.id, context(p, def)).eligible;
    const start = (p, def) => ({...p, ...commitSimulationCommand(p.state, registry, {id: def.id}, context(p, def), p.state.sequence)});
    let p = fresh();
    p.state.simulation.people.player.location = room;
    p.state.simulation.people[I.supervisor].location = room;
    assert.equal(seedSeerStock(p.state, I.world, I.supervisor), true);
    const stock = () => p.state.actors[I.supervisor].resources;
    const blood = measure.costs.find(c => c.key.endsWith('.lavos-squid-blood')).key;
    assert.equal(eligible(p, measure), false);
    assert.throws(() => start(p, measure), /Insufficient/);
    assert.equal(stock()[blood], 10);
    stock()[blood]++;
    p = start(p, measure);
    assert.equal(stock()[blood], 0);
    p = JSON.parse(JSON.stringify(p));
    validateSimulationState(p.state.simulation, p.state, registry.simulation);
    p = {...p, ...cancelSimulationJob(p.state, registry, p.state.simulation.jobs[0].id, context(p, measure), p.state.sequence)};
    assert.equal(stock()[blood], 11);
    assert.equal(eligible(p, cup), false);
    p = wait(start(p, measure), 1);
    p = wait(start(p, cup), 1);
    assert.equal(stock()[blood], 0);
    p = JSON.parse(JSON.stringify(p));
    validateSimulationState(p.state.simulation, p.state, registry.simulation);
    assert.equal(p.state.actors.player.facts[SEER_BREW_FACTS.product], brewSeer(measured).id);
    assert.equal(p.state.actors.player.facts[SEER_BREW_FACTS.seer], 57);
    assert.equal(p.state.actors.player.facts[SEER_BREW_FACTS.madness], 1);
    assert.equal(p.state.actors.player.resources[LOTM_INBOX.loss], undefined);
    p = start(p, drink);
    const savedDrink = JSON.parse(JSON.stringify(p));
    validateSimulationState(savedDrink.state.simulation, savedDrink.state, registry.simulation);
    p = wait(savedDrink, 2);
    assert.equal(p.state.actors.player.facts[SEER_BREW_FACTS.seer], 0);
    assert.equal(p.state.actors.player.resources[LOTM_INBOX.loss], 1);
    assert.equal(lotmLossLine(undefined, p.state).count, 1.5);
    validateSimulationState(p.state.simulation, p.state, registry.simulation);
    assert.equal(eligible(p, drink), false);
});

test('the dose law reads only the crucial two: slightly less is tolerated, slightly more leaves madness, water does nothing', () => {
    assert.deepEqual(brewSeer({'Lavos Squid blood': 9}).outputs, {beyonder: {seer: 54}});
    assert.equal(brewSeer({'Lavos Squid blood': 11}).outputs.spirit.madness, 1);
    assert.equal(brewSeer({'Star Crystal': 40}).outputs.spirit.madness, 2, 'too little crystal leaves the blood unbound');
    const diluted = brewSeer({'Distilled water': 300, 'Gold mint leaf': 20});
    assert.deepEqual(diluted.outputs, brewSeer().outputs);
    assert.notEqual(diluted.id, brewSeer().id, 'a different batch is a different product, with the same reading');
});

test('binding puts the engine product on the brew act and gates the drink on it; without the pack acts it binds nothing', () => {
    assert.equal(bindSeerBrew([{id: 'other', effects: []}]), 0);
    const brew = {id: SEER_BREW_BINDING.brewAct, effects: [{type: 'fact', key: 'x'}]};
    const drink = {id: SEER_BREW_BINDING.consumer, effects: [], requires: {all: [{fact: 'a', op: 'eq', value: true}]}};
    assert.equal(bindSeerBrew([brew, drink]), 2);
    const set = Object.fromEntries(brew.effects.filter(e => e.scope === 'actor').map(e => [e.key, e.value]));
    assert.equal(set[SEER_BREW_FACTS.product], brewSeer().id);
    assert.equal(set[SEER_BREW_FACTS.seer], 57);
    assert.equal(set[SEER_BREW_FACTS.madness], 0);
    const debit = drink.effects.find(e => e.key === SEER_BREW_FACTS.seer);
    assert.equal(debit.value, 0);
    for(const k of ['requires', 'completionRequires']) {
        const facts = {a: true, [`actor.${SEER_BREW_FACTS.seer}`]: set[SEER_BREW_FACTS.seer]};
        assert.equal(evaluateRule(drink[k], facts).met, true);
        assert.equal(evaluateRule(drink[k], {...facts, [`actor.${debit.key}`]: debit.value}).met, false);
        assert.equal(evaluateRule(drink[k], {a: true}).met, false);
    }
    assert.equal(drink.requires.all[0].all[0].fact, 'a', 'the pack gate is kept');
});
