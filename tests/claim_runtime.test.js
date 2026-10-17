// A2 claims with named dependencies (RS16-RS18, G6) against similar-world
// fixtures: shounen remembered plot (home), divination, an information power and
// interfering precognition. Synthetic test data, not playable worlds.
import test from 'node:test';
import assert from 'node:assert/strict';
import {compileClaims, claimEffects, claimFresh, claimStale} from '../src/claim_runtime.js';
import {createExpansionState, createContentRegistry} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';
import {simulationFacts} from '../src/simulation_effects.js';
import {evaluateRule} from '../src/rules.js';
const eq = (fact, value=true) => ({fact, op:'eq', value});
const claims = () => [
    {id:'c.ambush', about:'The field exercise is ambushed on day 10.', means:'memory', precision:'event', dependsOn:[eq('world.instructorAssigned'), eq('world.exerciseDay', 10)]},
    {id:'c.relic', about:'A relic lies in the lower cave.', means:'memory', precision:'exact', dependsOn:[eq('world.relicInCave')]},
    {id:'c.omen', about:'A crowned one falls before winter.', means:'divination', precision:'gist', dependsOn:[]},
    {id:'c.ledger', about:'The quartermaster keeps two ledgers.', means:'information', precision:'exact', dependsOn:[eq('world.ledgersHidden')]},
    {id:'c.raid', about:'The raid starts at the docks.', means:'divination', precision:'window', dependsOn:[eq('world.precogInterference', false)]},
    {id:'c.shield', about:'Their shield stops them from moving.', means:'investigation', precision:'gist', dependsOn:[],
        hypothesis:{refutedBy:'world.shieldAllowsMovement', test:{label:'Feint and watch their feet'},
            refuted:'They moved while shielded; the shield does not freeze them.', supported:'They stayed still under the shield again.'}}];
function setup(truth) {
    const d = {id:'c', world:{id:'c.world'}, claims:claims()}, before = structuredClone(d);
    const compiled = compileClaims(d); assert.deepEqual(d, before, 'compiling does not mutate the definition');
    const learn = {id:'c.learn', revision:1, label:'Recall', worldId:'c.world', costs:[], effects:[...compiled.claims.keys()].flatMap(id => claimEffects(compiled, id))};
    const prepare = {id:'c.prepare', revision:1, label:'Prepare for the ambush', worldId:'c.world', costs:[], effects:[{type:'fact', scope:'actor', key:'prepared', value:true}], requires:claimFresh(compiled, 'c.ambush')};
    const registry = createContentRegistry({worlds:[{id:'base.frontier', label:'Home'}, {id:'c.world', label:'Fixture'}], simulation:{commands:[...compiled.commands, learn, prepare], onEnroll:[]}});
    const state = createExpansionState(); state.actors.player.worldId = 'c.world';
    state.worlds['c.world'] = {facts:{instructorAssigned:true, exerciseDay:10, relicInCave:true, ledgersHidden:true, precogInterference:false, shieldAllowsMovement:truth}, resources:{}, completed:{}};
    const context = {actorId:'player', worldId:'c.world', facts:{}, gameplay:{player:{inventory:{}, skills:{}, reputation:{}}}, external:{}};
    const f = {compiled, registry, context, plan:enrollSimulation(state, registry, context)};
    run(f, 'c.learn'); return f;
}
const ctx = f => ({...f.context, gameplay:f.plan.gameplay, external:f.plan.external});
const can = (f, id) => previewSimulationCommand(f.plan.state, f.registry, id, ctx(f)).eligible;
function run(f, id) {f.plan = commitSimulationCommand(f.plan.state, f.registry, {id}, ctx(f)); return f;}
const facts = f => simulationFacts(f.plan.state, ctx(f), f.registry);
const holds = (f, rule) => evaluateRule(rule, facts(f)).met;
const world = f => f.plan.state.worlds['c.world'].facts;

test('shounen home: changing one precondition stales only the claims that depend on it', () => {
    const f = setup(0);
    assert.ok(holds(f, claimFresh(f.compiled, 'c.ambush')) && holds(f, claimFresh(f.compiled, 'c.relic')));
    assert.equal(can(f, 'c.prepare'), true);
    world(f).instructorAssigned = false; // the player swapped who leads the exercise
    assert.equal(holds(f, claimFresh(f.compiled, 'c.ambush')), false);
    assert.equal(holds(f, claimStale(f.compiled, 'c.ambush')), true);
    assert.equal(holds(f, claimFresh(f.compiled, 'c.relic')), true, 'the unrelated memory stays a usable lead');
    assert.equal(can(f, 'c.prepare'), false, 'a plan built on the stale forecast no longer opens');
    // Save/reload: beliefs and their means live in ordinary persisted state.
    f.plan.state = JSON.parse(JSON.stringify(f.plan.state));
    assert.equal(holds(f, claimStale(f.compiled, 'c.ambush')), true);
    assert.equal(facts(f)['actor.belief.c.relic.means'], 'memory');
});

test('means and precision are recorded; a dependency-free divination cannot go stale', () => {
    const f = setup(0), all = facts(f);
    assert.deepEqual(['c.omen', 'c.ledger', 'c.raid'].map(id => [all[`actor.belief.${id}.means`], all[`actor.belief.${id}.precision`]]),
        [['divination', 'gist'], ['information', 'exact'], ['divination', 'window']]);
    assert.equal(claimStale(f.compiled, 'c.omen'), null);
    assert.equal(holds(f, claimFresh(f.compiled, 'c.omen')), true);
});

test('information power and interfering precognition stale through their own dependencies', () => {
    const f = setup(0);
    world(f).precogInterference = true; // another seer acts on the same future
    assert.equal(holds(f, claimStale(f.compiled, 'c.raid')), true);
    assert.equal(holds(f, claimFresh(f.compiled, 'c.ledger')), true);
    world(f).ledgersHidden = false;
    assert.equal(holds(f, claimFresh(f.compiled, 'c.ledger')), false);
    delete world(f).relicInCave; // unknown is neither fresh nor known stale
    assert.equal(holds(f, claimFresh(f.compiled, 'c.relic')), false);
    assert.equal(holds(f, claimStale(f.compiled, 'c.relic')), false);
});

test('a hypothesis test is equally available either way and revises only the belief', () => {
    for(const [truth, status] of [[1, 'refuted'], [0, 'supported']]) {
        const f = setup(truth);
        assert.equal(can(f, 'c.shield.test'), true);
        run(f, 'c.shield.test');
        const k = f.plan.state.simulation.knowledge.player['belief.c.shield'];
        assert.equal(k.stage, 'understood');
        assert.equal(facts(f)['actor.belief.c.shield.status'], status);
        assert.ok(!k.value.includes('shieldAllowsMovement'), 'the authored result, not the hidden rule');
        assert.equal(can(f, 'c.shield.test'), false, 'one test per hypothesis in this fixture');
    }
});

test('a world without claims compiles empty, and malformed claims refuse before mutation', () => {
    const empty = compileClaims({id:'c', world:{id:'c.world'}});
    assert.equal(empty.claims.size, 0); assert.deepEqual(empty.commands, []);
    const base = claims()[0];
    for(const row of [{...base, id:'foreign.x'}, {...base, means:'vibes'}, {...base, precision:'perfect'}, {...base, dependsOn:undefined}, {...base, about:''}, {...base, extra:1},
        {...base, hypothesis:{refutedBy:'actor.x', test:{label:'t'}, refuted:'a', supported:'b'}}, {...base, hypothesis:{refutedBy:'world.x', test:{label:'t'}, refuted:'a'}},
        {...base, dependsOn:[{fact:'x', op:'gt', value:1}]}]) {
        const d = {id:'c', world:{id:'c.world'}, claims:[row]}, before = structuredClone(d);
        assert.throws(() => compileClaims(d)); assert.deepEqual(d, before);
    }
    assert.throws(() => compileClaims({id:'c', world:{id:'c.world'}, claims:[base, base]}));
});
