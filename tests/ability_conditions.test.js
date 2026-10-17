// A1 ability conditions (RS13/RS14, G1-G5) against four similar-world fixtures.
// Fixtures are synthetic test data shaped by the shounen manga (home), Hunter x
// Hunter, Jujutsu Kaisen and fae-bargain digests; they are not playable worlds.
import test from 'node:test';
import assert from 'node:assert/strict';
import {compileStructuredAbilities} from '../src/structured_ability_runtime.js';
import {createExpansionState, createContentRegistry} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';
const eq = (fact, value=true) => ({fact, op:'eq', value});
const worn = JSON.stringify({id:'w.worn'}), fixed = JSON.stringify({id:'w.fixed'});
function raw(conditions, change=()=>{}) {
    const d = {id:'w', world:{id:'w.world'}, sources:['method','carrier'].map(id => ({id:'w.'+id, revision:1, kind:'technique', label:id, grants:[]})),
        abilities:[{id:'w.ability', commandId:'w.use', sourceId:'w.method', powerId:'w.power', function:'craft', acquisition:'learned', executionKind:'ordinary-technique',
            control:eq('actor.control'), target:null, counters:[], carriers:[{sourceId:'w.carrier', requires:eq('actor.carrierFit')}], ...(conditions ? {conditions} : {})}],
        simulation:{powers:[{id:'w.power', revision:1, label:'Technique', model:'practice', capacity:1}],
            commands:[{id:'w.use', revision:1, label:'Use technique', worldId:'w.world', actorId:'player', targetId:'w.target', coLocated:true, participants:['$target'], audience:['$actor'],
                powerId:'w.power', duration:0, costs:[{type:'item', actor:'$target', key:worn, amount:-1}], effects:[{type:'item', actor:'$target', key:fixed, amount:1}]}]}};
    change(d); return d;
}
function setup(d, people=[]) {
    const compiled = compileStructuredAbilities(d);
    const commands = [...compiled.commands, {id:'w.learn', revision:1, label:'Learn', worldId:'w.world', effects:[{type:'power', powerId:'w.power', operation:'learn'}], costs:[]}];
    const registry = createContentRegistry({worlds:[{id:'base.frontier', label:'Home'}, {id:'w.world', label:'Fixture'}], sources:d.sources,
        simulation:{commands, powers:compiled.powers, people:[{id:'w.target', revision:1, label:'Recipient', worldId:'w.world', location:'w.room', inventory:'simulation', resources:{}}, ...people],
            onEnroll:[{type:'source', sourceId:'w.method', operation:'grant', awakened:true, active:true}, {type:'item', actor:'w.target', key:worn, amount:9}, ...compiled.seeds]}});
    const state = createExpansionState(); state.actors.player.worldId = 'w.world'; state.worlds['w.world'] = {facts:{}, resources:{}, completed:{}};
    state.actors.player.facts.control = true; state.actors.player.facts.carrierFit = true; Object.assign(state.actors.player.resources, {lifespan:10, cursedEnergy:10});
    const context = {actorId:'player', targetId:'w.target', worldId:'w.world', facts:{location:'w.room'}, gameplay:{player:{inventory:{}, skills:{}, reputation:{}}}, external:{}};
    const f = {compiled, registry, context, plan:enrollSimulation(state, registry, context)};
    run(f, 'w.learn', {targetId:null}); return f;
}
const ctx = (f, extra={}) => ({...f.context, gameplay:f.plan.gameplay, external:f.plan.external, ...extra});
const can = (f, id, extra) => previewSimulationCommand(f.plan.state, f.registry, id, ctx(f, extra)).eligible;
function run(f, id, extra) {f.plan = commitSimulationCommand(f.plan.state, f.registry, {id}, ctx(f, extra)); return f;}
const me = f => f.plan.state.actors.player;
function transfer(f) {
    const p = f.plan.state; delete me(f).sources['w.method']; delete p.simulation.faculties.player['w.method'];
    me(f).sources['w.carrier'] = {acquiredAt:0, expiresAt:null, receiptId:'fixture.transfer', worldId:'w.world', revision:1};
    p.simulation.faculties.player['w.carrier'] = {awakened:true, active:true, suppressed:false, development:0};
}

test('shounen home: charges, recharge only once empty, lasting price, author-bound loophole', () => {
    const conditions = [{id:'w.timer', charges:{max:2, recharge:{when:'empty', requires:eq('actor.rested')}}, price:[{type:'resource', key:'lifespan', amount:-1}]},
        {id:'w.promise', subject:'author', requires:eq('actor.promiseKept')}];
    const f = setup(raw(conditions));
    me(f).facts.promiseKept = true;
    assert.equal(me(f).resources['w.timer.charges'], 2, 'starts charged by default');
    run(f, 'w.use');
    assert.equal(can(f, 'w.timer.recharge'), false, 'partly spent charge does not start recharging');
    run(f, 'w.use');
    assert.equal(can(f, 'w.use'), false, 'all charge spent');
    assert.equal(me(f).resources.lifespan, 8);
    assert.equal(can(f, 'w.timer.recharge'), false, 'recharge trigger not met');
    me(f).facts.rested = true; run(f, 'w.timer.recharge');
    assert.equal(me(f).resources['w.timer.charges'], 2);
    assert.equal(me(f).resources.lifespan, 8, 'the lasting price outlives the recharge');
    assert.equal(f.plan.state.simulation.owners['w.target'][fixed], 2);
    // The promise names the original creator's route. Breaking it blocks that route,
    // but the same ability held through a transferred carrier escapes it.
    me(f).facts.promiseKept = false;
    assert.equal(can(f, 'w.use'), false);
    transfer(f);
    assert.equal(can(f, 'w.use'), true);
    // Save/reload: conditions live in ordinary persisted actor state.
    f.plan.state = JSON.parse(JSON.stringify(f.plan.state));
    run(f, 'w.use'); assert.equal(me(f).resources['w.timer.charges'], 1);
    const holder = setup(raw([{id:'w.promise', subject:'holder', requires:eq('actor.promiseKept')}]));
    transfer(holder); assert.equal(can(holder, 'w.use'), false, 'a holder-bound promise follows the carrier');
    assert.deepEqual(f.compiled.conditions.map(c => [c.id, c.subject, c.sourceWorldId]), [['w.timer', 'holder', 'w.world'], ['w.promise', 'author', 'w.world']]);
});

test('hunter x hunter: a restriction raises capacity and a broken vow blocks activation', () => {
    const vow = {id:'w.vow', requires:eq('actor.onlyTheMarked'), strengthens:{capacity:2}, breach:{when:eq('actor.vowBroken'), mode:'block'}};
    const strong = d => {d.simulation.commands[0].output = 3;};
    const plain = setup(raw(null, strong));
    assert.equal(plain.compiled.powers[0].capacity, 1); assert.equal(can(plain, 'w.use'), false, 'output exceeds unrestricted capacity');
    const f = setup(raw([vow], strong));
    assert.equal(f.compiled.powers[0].capacity, 3);
    assert.equal(can(f, 'w.use'), false, 'restriction not honored');
    me(f).facts.onlyTheMarked = true; assert.equal(can(f, 'w.use'), true);
    me(f).facts.vowBroken = true; assert.equal(can(f, 'w.use'), false);
});

test('jujutsu kaisen: a mutual vow binds two parties, not the technique target, and law enforces breach once', () => {
    const vow = {id:'w.pact', parties:['player', 'w.partner'], enforcer:{kind:'law', reason:'Binding vows are enforced by the world itself.'},
        breach:{when:eq('world.pactBroken'), mode:'consequence', penalized:'player', effects:[{type:'resource', key:'cursedEnergy', amount:-5}]}};
    const f = setup(raw([vow]), [{id:'w.partner', revision:1, label:'Partner', worldId:'w.world', location:'w.room', inventory:'simulation', resources:{}}]);
    assert.deepEqual(f.compiled.conditions[0].parties, ['player', 'w.partner']);
    assert.equal(can(f, 'w.pact.enforce'), false);
    run(f, 'w.use');
    assert.equal(f.plan.state.actors['w.target'].resources.cursedEnergy, undefined, 'the target is not a vow party');
    f.plan.state.worlds['w.world'].facts.pactBroken = true;
    assert.equal(can(f, 'w.use'), true, 'consequence mode does not block the technique');
    run(f, 'w.pact.enforce');
    assert.equal(me(f).resources.cursedEnergy, 5);
    assert.equal(can(f, 'w.pact.enforce'), false, 'one enforcement per breach in this fixture');
});

test('fae bargain: an agent enforces the bargain until the spoken true name ends it', () => {
    const bargain = {id:'w.bargain', enforcer:{kind:'agent', id:'w.lord', reason:'The lord collects what was promised.'}, ends:eq('world.trueNameSpoken'),
        requires:eq('actor.bargainStruck'), breach:{when:eq('world.promiseWithheld'), mode:'consequence', effects:[{type:'fact', scope:'world', key:'lordClaimedDebt', value:true}]}};
    const f = setup(raw([bargain]), [{id:'w.lord', revision:1, label:'Lord', worldId:'w.world', location:'w.room', inventory:'simulation', resources:{}}]);
    const enforce = f.compiled.commands.find(c => c.id === 'w.bargain.enforce');
    assert.equal(enforce.actorId, 'w.lord');
    assert.equal(can(f, 'w.use'), false, 'no gift without the bargain');
    me(f).facts.bargainStruck = true; assert.equal(can(f, 'w.use'), true);
    f.plan.state.worlds['w.world'].facts.promiseWithheld = true;
    const named = structuredClone(f.plan.state);
    run(f, 'w.bargain.enforce', {actorId:'w.lord', targetId:null});
    assert.equal(f.plan.state.worlds['w.world'].facts.lordClaimedDebt, true);
    // Alternate branch: the true name is learned first, so the bargain has ended.
    f.plan.state = named; me(f).facts.bargainStruck = false;
    f.plan.state.worlds['w.world'].facts.trueNameSpoken = true;
    assert.equal(can(f, 'w.use'), true, 'the ended bargain no longer restricts the gift');
    assert.equal(can(f, 'w.bargain.enforce', {actorId:'w.lord', targetId:null}), false);
});

test('a world without conditions compiles unchanged, and malformed conditions refuse before mutation', () => {
    const plain = raw(null), withEmpty = compileStructuredAbilities(plain);
    assert.equal(withEmpty.commands.length, 1); assert.deepEqual(withEmpty.conditions, []);
    assert.deepEqual(withEmpty.commands[0].costs, plain.simulation.commands[0].costs);
    for(const c of [[], [{id:'w.x'}], [{id:'foreign.x', requires:eq('a')}], [{id:'w.x', pretend:1, requires:eq('a')}], [{id:'w.x', charges:{max:0, recharge:{when:'empty'}}}],
        [{id:'w.x', strengthens:{capacity:2}, charges:{max:1, recharge:{when:'empty'}}}], [{id:'w.x', enforcer:{kind:'law'}, requires:eq('a')}],
        [{id:'w.x', enforcer:{kind:'law', reason:'r'}, breach:{when:eq('a'), mode:'consequence', effects:[{type:'fact', scope:'actor', key:'k', value:true}]}}],
        [{id:'w.x', subject:'body', requires:eq('a')}], [{id:'w.x', requires:eq('a')}, {id:'w.x', requires:eq('b')}]]) {
        const d = raw(c), before = structuredClone(d);
        assert.throws(() => compileStructuredAbilities(d)); assert.deepEqual(d, before);
    }
});
