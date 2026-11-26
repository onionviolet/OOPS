import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createContentRegistry, createExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand, advanceSimulationBoundary, cancelSimulationJob} from '../src/simulation.js';
import {jsonData} from '../src/simulation_contracts.js';
import {compileStructuredPack, mergeStructuredPack, registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {guLeadLife} from '../src/world_packs/book_gu_lead_life.js';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadLeafTreatment} from '../src/world_packs/book_gu_lead_leaf_treatment.js';
import {guLeadHealerWork as raw, RI_HEALER_WORK as ID, RI_HEALER_NOTE} from '../src/world_packs/book_gu_lead_healer_work.js';
import {RI_DAY_ITEMS as IT, riLeadDayFacts, RI_LEAD_DAY as DAY} from '../src/ri_lead_day_facts.js';
import {RI_LEAF_ITEM, RI_LEAF_TREATMENT} from '../src/ri_leaf_treatment.js';
const key = id => JSON.stringify({id});
function setup(tallies = 1) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: 'book.ri.lead.world', label: 'Qing Mao'}],
        simulation: {commands: [...raw.commands, ...guLeadLeafTreatment.commands, guLeadDay.commands.find(c => c.id === `${DAY}.hand_in_tally`)], people: []}});
    const state = createExpansionState(1); state.actors.player.worldId = 'book.ri.lead.world'; state.actors.player.facts[`${DAY}.injured`] = true;
    state.worlds['book.ri.lead.world'] = {facts: {}, resources: {}, completed: {}};
    const context = {actorId: 'player', nativeAlive: true, facts: {location: 'book.ri.lead.academy', 'native.ready': true, 'native.alive': true,
        'body.ownerId': 'player', 'body.controllerId': 'player', 'body.mobile': true,
        ...Object.fromEntries([ID, DAY, RI_LEAF_TREATMENT].map(id => [`structured.extension.${id}.admitted`, true]))},
        vitals: {player: {health: 100, stamina: 100, max_health: 100, max_stamina: 100}},
        gameplay: {player: {inventory: {...(tallies ? {[key(IT.tally)]: tallies} : {}), [key(IT.stone)]: 2}, skills: {}, reputation: {}}}};
    let live = enrollSimulation(state, registry, context);
    const current = () => ({...context, ...live, facts: {...context.facts, ...riLeadDayFacts(live.state)}});
    const act = id => {const quote = previewSimulationCommand(live.state, registry, id, current()); assert.equal(quote.eligible, true, JSON.stringify(quote.reasons)); live = commitSimulationCommand(live.state, registry, {id}, current());};
    return {get live() {return live;}, current, act,
        preview: id => previewSimulationCommand(live.state, registry, id, current()),
        finish: () => {live.state.clock = live.state.simulation.jobs[0].due; advanceSimulationBoundary(live, registry, {player: current()});},
        cancel: () => {live = cancelSimulationJob(live.state, registry, live.state.simulation.jobs[0].id, current());}};
}
const count = (f, id) => f.live.gameplay.player.inventory[key(id)] || 0;
test('patrol tally buys treatment at the cost of the existing board payout, preserving stones', () => {
    const f = setup(); f.act(`${ID}.tally`);
    assert.equal(count(f, IT.tally), 0); assert.equal(count(f, IT.stone), 2); assert.equal(count(f, RI_LEAF_ITEM), 1);
    assert.equal(f.preview(`${DAY}.hand_in_tally`).eligible, false);
    assert.equal(f.preview(`${ID}.tally`).eligible, false);
    f.act(`${RI_LEAF_TREATMENT}.treat`);
    assert.equal(count(f, RI_LEAF_ITEM), 0); assert.equal(f.live.state.actors.player.facts[`${DAY}.injured`], false);
    assert.equal(f.preview(`${RI_LEAF_TREATMENT}.treat`).eligible, false);
});
test('cash and labor conserve different resources; stopped labor grants no leaf', () => {
    const cash = setup(); cash.act(`${RI_LEAF_TREATMENT}.buy`);
    assert.equal(count(cash, IT.stone), 0); assert.equal(count(cash, IT.tally), 1); assert.equal(count(cash, RI_LEAF_ITEM), 1);
    const f = setup(0); assert.equal(f.preview(`${ID}.tally`).eligible, false);
    f.act(`${ID}.sort`); f.cancel(); assert.equal(count(f, RI_LEAF_ITEM), 0);
    const start = f.live.state.clock; f.act(`${ID}.sort`); f.finish();
    assert.equal(f.live.state.clock - start, 45); assert.equal(count(f, RI_LEAF_ITEM), 1); assert.equal(count(f, IT.stone), 2);
    assert.match(f.live.state.simulation.knowledge.player[RI_HEALER_NOTE].value, /sorted and tied/);
});
test('exact optional continuation is JSON and registers with current RI dependencies', async () => {
    const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(guLeadLife, registry); mergeStructuredPack(compiled, registry);
    const base = {...compiled.definition, contentHash: hash(guLeadLife), extensions: [guLeadDay, guLeadLeafTreatment]};
    assert.doesNotThrow(() => jsonData(raw)); assert.deepEqual(JSON.parse(JSON.stringify(raw)), raw);
    registerStructuredCommandExtension(raw, hash(raw), base, registry, undefined, {bundledInstant: true});
    assert.ok(registry.simulation.commands.has(`${ID}.tally`)); assert.ok(registry.simulation.commands.has(`${ID}.sort`));
});
