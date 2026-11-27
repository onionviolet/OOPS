import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {jsonData} from '../src/simulation_contracts.js';
import {hpLeadDayExtension} from '../src/world_packs/book_hp_lead_day.js';
import {hpLeadLibraryExtension} from '../src/hp_library_work.js';
import {createContentRegistry, createExpansionState, loadExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation, commitSimulationCommand, previewSimulationCommand, advanceSimulationBoundary, cancelSimulationJob, simulationFacts} from '../src/simulation.js';
import {HP_LIBRARY_ACTIONS as A, HP_LIBRARY_COMMANDS, HP_LIBRARY_WORK, HP_LIBRARY_NOTE, HP_LIBRARY_BOOK_DOWN} from '../src/hp_library_work.js';
import {hpLeadSpellFacts} from '../src/hp_lead_spells.js';
import {HP_LEAD_DAY_COMMANDS} from '../src/world_packs/book_hp_lead_day.js';
import {HP_SET_ITEM, HP_MARKED_ITEM, hpDayFacts, hpDayExamInputs} from '../src/book_world_hp_day.js';
import {hpLessonFacts} from '../src/book_world_hp_lessons.js';
const WORLD = 'book.hp.lead.world', HALL = 'book.hp.lead.school_hall', POWER = 'book.hp.lead.levitation';
const key = id => JSON.stringify({id});
function setup({learned = true, wand = true, assignment = false, seed = 1} = {}) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: WORLD, label: 'Hogwarts'}], simulation: {
        commands: [...HP_LIBRARY_COMMANDS, ...HP_LEAD_DAY_COMMANDS], people: [],
        powers: [{id: POWER, revision: 1, label: 'Levitation', model: 'practice', capacity: 1, cooldown: 0}],
        onEnroll: learned ? [{type: 'power', powerId: POWER, operation: 'learn'}] : [],
    }});
    const state = createExpansionState(seed); state.actors.player.worldId = WORLD;
    state.worlds[WORLD] = {facts: {}, resources: {}, completed: {}};
    state.actors.player.facts = {'hp.lead.atSchool': true, 'hp.lead.house': 'gryffindor'};
    state.clock = 65 * 1440 + 60;
    const context = {actorId: 'player', worldId: WORLD, facts: {location: HALL}, external: {},
        vitals: {player: {health: 100, stamina: 100, max_health: 100, max_stamina: 100}},
        gameplay: {player: {inventory: {...(wand ? {[key('book.hp.lead.spell_practice.class_wand')]: 1} : {}),
            ...(assignment ? {[key(HP_SET_ITEM('astronomy'))]: 1} : {})}, skills: {}, reputation: {}}}};
    let live = enrollSimulation(state, registry, context);
    live.state.simulation.knowledge.player ||= {};
    live.state.simulation.knowledge.player['book.hp.lead.opening'] = {at: 0, stage: 'understood', value: 'Fixture opening', cause: 'fixture'};
    const current = () => ({...context, ...live, facts: {location: HALL, ...hpLessonFacts(live.state), ...hpDayFacts(live.state, {gameplay: live.gameplay}),
        ...hpLeadSpellFacts(live.state), [`structured.extension.${HP_LIBRARY_WORK}.admitted`]: true,
        'structured.extension.book.hp.lead.day.admitted': true}});
    const act = id => {const q=previewSimulationCommand(live.state,registry,id,current());assert.equal(q.eligible,true,JSON.stringify({id,reasons:q.reasons,facts:Object.fromEntries(Object.entries(simulationFacts(live.state,current(),registry)).filter(([k])=>/library|actor.life|atSchool/.test(k)))}));live = commitSimulationCommand(live.state, registry, {id}, current());};
    const finish = () => {const job = live.state.simulation.jobs[0]; live.state.clock = job.due; advanceSimulationBoundary(live, registry, {player: current()});};
    return {get live() {return live;}, registry, current, act, finish, draw: value => {live.state.simulation.seed = value === 'high' ? 123456789 : 1;},
        preview: id => previewSimulationCommand(live.state, registry, id, current()),
        cancel: () => {live = cancelSimulationJob(live.state, registry, live.state.simulation.jobs[0].id, current());}};
}
const count = (f, id) => f.live.gameplay.player.inventory[key(id)] || 0;

test('unknown charm or missing wand cannot spend; fizzle pays and teaches but leaves the book and notes inaccessible', () => {
    for (const config of [{learned: false}, {wand: false}]) {
        const f = setup(config), before = structuredClone(f.live);
        assert.equal(f.preview(A.cast).eligible, false);
        assert.throws(() => f.act(A.cast));
        assert.deepEqual(f.live, before);
    }
    const f = setup(); f.draw('high'); f.act(A.cast);
    assert.equal(f.live.vitals.player.stamina, 99);
    assert.equal(f.live.state.simulation.powers.player[POWER].mastery, 1);
    assert.equal(f.preview(A.copy).eligible, false);
    assert.equal(count(f, HP_LIBRARY_NOTE), 0);
    assert.match(f.live.state.simulation.knowledge.player[`${HP_LIBRARY_WORK}.last`].value, /settled back/);
    f.draw('low'); f.act(A.cast);
    assert.equal(f.live.vitals.player.stamina, 98);
    assert.equal(f.preview(A.copy).eligible, true);
    f.act(A.copy); f.finish();
    assert.equal(count(f, HP_LIBRARY_NOTE), 1);
    assert.equal(f.live.state.worlds[WORLD].facts[HP_LIBRARY_BOOK_DOWN], false);
});

test('ladder recovery costs time; interrupted copying grants none, and the settled notes survive native state reload', () => {
    const f = setup({learned: false}), start = f.live.state.clock;
    f.act(A.ladder); f.finish(); assert.equal(f.live.state.clock - start, 10);
    assert.equal(f.live.vitals.player.stamina, 100);
    f.act(A.copy); f.cancel(); assert.equal(count(f, HP_LIBRARY_NOTE), 0);
    assert.equal(f.live.state.worlds[WORLD].facts[HP_LIBRARY_BOOK_DOWN], true);
    f.act(A.copy); f.finish(); assert.equal(f.live.state.clock - start, 15);
    assert.equal(count(f, HP_LIBRARY_NOTE), 1);
    const reloaded = loadExpansionState(JSON.parse(JSON.stringify(f.live.state)), f.registry);
    assert.equal(reloaded.worlds[WORLD].facts[HP_LIBRARY_BOOK_DOWN], false);
});

test('reference notes shorten the same assigned homework and feed the existing exam input', () => {
    const f = setup({assignment: true});
    assert.equal(f.preview(A.homework).eligible, false);
    assert.equal(f.preview('book.hp.lead.day.homework_astronomy').duration, 60);
    f.act(A.ladder); f.finish(); f.act(A.copy); f.finish();
    assert.equal(f.preview(A.homework).duration, 30);
    const before = f.live.state.clock; f.act(A.homework);
    assert.equal(count(f, HP_SET_ITEM('astronomy')), 0);
    f.finish(); assert.equal(f.live.state.clock - before, 30);
    assert.equal(count(f, HP_MARKED_ITEM('astronomy')), 1);
    assert.equal(count(f, HP_LIBRARY_NOTE), 1);
    assert.equal(hpDayExamInputs(f.live.gameplay, 'astronomy').understanding, 1 / 12);
});

test('losing the reference during work returns its reserved assignment without producing a mark', () => {
    const f = setup({assignment: true}); f.act(A.ladder); f.finish(); f.act(A.copy); f.finish();
    f.act(A.homework); delete f.live.gameplay.player.inventory[key(HP_LIBRARY_NOTE)]; f.finish();
    assert.equal(count(f, HP_SET_ITEM('astronomy')), 1);
    assert.equal(count(f, HP_MARKED_ITEM('astronomy')), 0);
});


test('the exact library extension is JSON and registers through the real bundled command-extension boundary', () => {
    const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
    const rawBase = packNative('book.hp.lead');
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(rawBase, registry); mergeStructuredPack(compiled, registry);
    const base = {...compiled.definition, contentHash: hash(rawBase)};
    const day = hpLeadDayExtension(base);
    registerStructuredCommandExtension(day, hash(day), base, registry, undefined, {bundledInstant: true});
    const library = hpLeadLibraryExtension(base);
    assert.doesNotThrow(() => jsonData(library));
    assert.deepEqual(JSON.parse(JSON.stringify(library)), library);
    const extension = registerStructuredCommandExtension(library, hash(library), base, registry, undefined, {bundledInstant: true});
    assert.equal(extension.commands.length, 4);
    assert.ok(registry.simulation.commands.has(A.cast));
});
