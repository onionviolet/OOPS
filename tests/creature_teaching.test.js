// IH6 / BL6: fixture policy over L (practice), K (working and descent), and N
// (scoped knowledge). The ewe demonstrates a response she already practices
// with this keeper. A lesson earns one response with that same keeper.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
    acquireCreature, creatureDevelopment, practiceWithCreature, restoreCreatureLifecycle, settleCohortStock,
    settleCreatureBirth, startCreatureBrood, transferCreature,
} from '../src/creature_lifecycle.js';
import {LIVING_GENOMES} from '../src/living_genomes.js';
import {addDescent, bloodline, createDescent, restoreDescent, serializeDescent} from '../src/kernel_descent.js';
import {addIdentity, createIdentities, identityFor} from '../src/kernel_identity.js';
import {
    beginWorking, defineWorkingLaw, restoreWorking, serializeWorking, settleWorking,
} from '../src/kernel_working.js';
import {projectCreatureBirth} from '../src/living_descent.js';
import {createSimulationState, validateSimulationState} from '../src/simulation_contracts.js';
import {applySimulationEffects} from '../src/simulation_effects.js';

const field = {id: 'field', capacity: 3, supportedSpecies: ['sheep']};
const handler = 'keeper', witness = 'witness', listener = 'listener';
const skill = 'lead', start = 8, demonstration = 10, finish = 13;
const situationId = 'field.lead-lesson';
const roundTrip = value => JSON.parse(JSON.stringify(value));

function flock({trained = true} = {}) {
    const genome = LIVING_GENOMES['village.sheep'];
    const genes = {fleece: ['F', 'f'], coat: ['D', 'd'], winter: ['W', 'w'], vigor: ['V', 'v']};
    const initial = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'field.sheep',
        species: 'sheep', habitat: field, delta: 2});
    const acquire = state => acquireCreature(state, {revision: state.revision, cohortId: 'field.sheep',
        destination: field, keeper: handler, genome, genes, breeding: {woolTenths: 62}});
    const ewe = acquire(initial), ram = acquire(ewe.state);
    const parents = trained ? practiceWithCreature(ram.state, {revision: ram.state.revision, id: ewe.id,
        actor: handler, clock: 1, minimumGap: 4, bondGain: 0, skill}) : ram.state;
    const brood = startCreatureBrood(parents, {revision: parents.revision, parents: [ewe.id, ram.id],
        keeper: handler, clock: 2, gestationMinutes: 5, growthMinutes: 20, root: 'field.teaching', genome});
    const lamb = settleCreatureBirth(brood.state, {revision: brood.state.revision, broodId: brood.id,
        clock: 7, destination: field});
    return {ewe: ewe.id, ram: ram.id, lamb: lamb.id, lifecycle: lamb.state};
}

const roles = {teacher: 'living', learner: 'living', handler: 'actor'};
function access({bound: {teacher, learner, handler: keeper}}) {
    if ([teacher, learner].some(body => body.keeper !== keeper.id || body.habitat !== keeper.habitat)) {
        return 'The handler needs both animals in their custody at the practice site.';
    }
    if (!(teacher.experience[keeper.id]?.training[skill] > 0)) return 'The teacher has not learned the response.';
}
const law = defineWorkingLaw({id: 'test.creature.lesson', revision: 1, operations: {
    demonstrate: {roles, minutes: 2, settle(context) {
        const reason = access(context);
        return reason ? {ok: false, reason} : {ok: true, observed: {demonstrated: true}};
    }},
    rehearse: {roles, minutes: 3, settle(context) {
        const reason = access(context);
        if (reason) return {ok: false, reason};
        const {bound: {teacher, learner, handler: keeper}} = context;
        return {ok: true, effects: [{kind: 'practice', id: learner.id, teacher: teacher.id, actor: keeper.id, skill}]};
    }},
}});
const method = {id: 'field.lead', revision: 1, law: law.ref, roles,
    steps: ['demonstrate', 'rehearse'].map(op => ({op, bindings: {teacher: 'teacher', learner: 'learner', handler: 'handler'}}))};
const begin = ({ewe, lamb}) => beginWorking(law, method, {id: situationId, at: start,
    bindings: {teacher: {kind: 'living', id: ewe}, learner: {kind: 'living', id: lamb}, handler: {kind: 'actor', id: handler}}});

// Authored attendance spans are fixture inputs, not timestamps inferred from
// polling. A return before the deadline does not make an absence attended.
function settle(record, lifecycle, now, attendance = [[start, finish]]) {
    return settleWorking(law, record, {now, ports: {
        read: ({kind, id}) => kind === 'actor' ? {kind, id, habitat: field.id}
            : {...lifecycle.individuals[id], kind, id},
        authority: ({step, at}) => attendance.some(([from, through]) =>
            from <= (step === 0 ? start : demonstration) && through >= at)
            ? {ok: true} : {ok: false, reason: 'The handler did not attend the whole step.'},
    }});
}

test('a trained ewe can teach a juvenile only after attended practice, with one settlement after restore', () => {
    const {ewe, ram, lamb, lifecycle} = flock();
    const newborn = lifecycle.individuals[lamb];
    assert.equal(lifecycle.individuals[ewe].experience[handler].training[skill], 1);
    assert.deepEqual(newborn.experience, {});
    assert.equal(creatureDevelopment(lifecycle, lamb, finish).mature, false);

    const working = begin({ewe, lamb});
    const pending = settle(working, lifecycle, demonstration);
    assert.equal(pending.record.cursor, 1);
    assert.deepEqual(pending.effects, []);
    const saved = roundTrip({working: serializeWorking(pending.record), lifecycle});
    const record = restoreWorking(law, saved.working);
    const loaded = restoreCreatureLifecycle(saved.lifecycle);
    assert.deepEqual(loaded.individuals[lamb], newborn);
    assert.equal(settle(record, loaded, finish - 1).record.status, 'running');

    const completed = settle(record, loaded, finish + 3);
    assert.deepEqual(completed, settle(working, lifecycle, finish));
    assert.equal(completed.record.status, 'complete');
    assert.deepEqual(completed.effects, [{working: situationId, step: 1, at: finish,
        effect: {kind: 'practice', id: lamb, teacher: ewe, actor: handler, skill}}]);
    const [{at, effect: {id, actor, skill: practicedSkill}}] = completed.effects;
    const practice = {revision: loaded.revision, id, actor, skill: practicedSkill, clock: at, minimumGap: 4, bondGain: 0};
    const learned = practiceWithCreature(loaded, practice);
    assert.deepEqual(learned.individuals[lamb], {...newborn,
        experience: {[handler]: {lastAt: finish, bond: 0, training: {[skill]: 1}}}});
    assert.deepEqual(learned.individuals[ewe], loaded.individuals[ewe]);
    assert.throws(() => practiceWithCreature(learned, practice), /state changed/);
    const restored = restoreWorking(law, serializeWorking(completed.record));
    assert.deepEqual(settle(restored, restoreCreatureLifecycle(roundTrip(learned)), finish + 10),
        {record: restored, effects: []});

    const transferred = transferCreature(learned, {revision: learned.revision, id: lamb, clock: finish + 1,
        fromKeeper: handler, toKeeper: 'new-keeper', destination: field});
    assert.deepEqual(transferred.individuals[lamb].experience, learned.individuals[lamb].experience);
    assert.equal(transferred.individuals[lamb].experience['new-keeper'], undefined);

    proveProvenance({ewe, lamb, ram, lifecycle: learned, completed: restored});
});

test('an untrained teacher, a lapse in attendance, or a change of custody cannot publish a lesson', () => {
    const novice = flock({trained: false});
    const refused = settle(begin(novice), novice.lifecycle, finish);
    assert.equal(refused.record.status, 'interrupted');
    assert.match(refused.record.receipts.at(-1).reason, /has not learned/);
    assert.deepEqual(refused.effects, []);

    const family = flock();
    const {lifecycle, lamb} = family;
    const pending = settle(begin(family), lifecycle, demonstration).record;
    const left = settle(pending, lifecycle, finish, [[start, 11], [12, finish]]);
    assert.equal(left.record.status, 'interrupted');
    assert.match(left.record.receipts.at(-1).reason, /did not attend/);
    assert.deepEqual(left.effects, []);

    const moved = transferCreature(lifecycle, {revision: lifecycle.revision, id: lamb, clock: 11,
        fromKeeper: handler, toKeeper: 'new-keeper', destination: field});
    const lostAccess = settle(pending, moved, finish);
    assert.equal(lostAccess.record.status, 'interrupted');
    assert.match(lostAccess.record.receipts.at(-1).reason, /custody/);
    assert.deepEqual(lostAccess.effects, []);
    assert.deepEqual(moved.individuals[lamb].experience, {});
});

function proveProvenance({ewe, lamb, ram, lifecycle, completed}) {
    const participants = [handler, witness, listener];
    const actors = Object.fromEntries(participants.map(id => [id, {worldId: 'village'}]));
    const simulation = {...createSimulationState(1), enrolledAt: 0};
    for (const id of participants) simulation.people[id] = {
        life: 'alive', inventory: 'simulation', location: id === listener ? 'lane' : field.id, bornAt: 0,
    };
    const state = {clock: start, actors, worlds: {village: {}}, simulation};
    const write = (effects, receipt) => applySimulationEffects({state}, effects, {actorId: handler}, {simulation: {}}, receipt);
    write([{type: 'situation', operation: 'begin', situationId, definition: {
        id: situationId, revision: 1, context: {worldId: 'village', instanceId: 'village', continuityId: 'village',
            eraId: 'now', regionId: field.id}, phases: ['lesson', 'finished'], initialPhase: 'lesson',
        privateTruth: {practiceSite: field.id}, participants,
    }}], 'field.lesson.opened');

    const step = completed.receipts.at(-1);
    assert.equal(step.ok, true);
    const [practice] = step.truth.effects;
    const cause = `${completed.id}.step.${step.step}`;
    const key = `lesson.${practice.id}.${practice.teacher}.${practice.skill}`;
    const account = (actor, kind, attributedTo, value) => ({
        type: 'knowledge', actor, key, stage: 'seen', value, basis: {kind, attributedTo, situationId},
    });

    // This fixture's witness is present at the committed practice. Capture the
    // recipients from presence before publication; the knowledge label alone
    // cannot authenticate a claim. This is the test host's receipt binding.
    state.clock = step.at;
    const recipients = [witness, listener].filter(id => simulation.people[id].location === field.id);
    assert.deepEqual(recipients, [witness]);
    write([{type: 'situation', operation: 'advance', situationId, expected: ['lesson'], phase: 'finished'},
        ...recipients.map(id => account(id, 'observation', id, 'The lamb followed the ewe.'))], cause);
    const authentic = {key, cause, at: step.at, recipients, learner: practice.id, teacher: practice.teacher};

    // Use the same true endpoints in both claims. Even a direct-observation
    // label and matching working cause do not put an absent seat at the lesson.
    const falselyLabeled = roundTrip(state);
    applySimulationEffects({state: falselyLabeled},
        [account(listener, 'observation', listener, 'I saw the lesson.')], {actorId: handler}, {simulation: {}}, cause);
    state.clock = step.at + 1;
    write([account(listener, 'instruction', witness, 'I heard how the lamb learned.')], 'field.lesson.talk');
    const saved = roundTrip({state, authentic});
    const loaded = saved.state;
    validateSimulationState(loaded.simulation, loaded);

    const registry = [[ewe, 'flock:ewe'], [ram, 'flock:ram'], [lamb, 'flock:lamb']]
        .reduce((reg, [key, id]) => addIdentity(reg, {id, at: start, cause: 'field.identities',
            facets: {body: {owner: 'lifecycle', key}}}), createIdentities());
    const idFor = local => identityFor(registry, 'lifecycle', local)?.id;
    const ancestry = projectCreatureBirth(createDescent(), registry, lifecycle, lamb,
        new Map([ewe, ram, lamb].map(local => [local, idFor(local)])));

    function viewLesson(snapshot, observer) {
        const {key, cause, at, recipients, learner, teacher} = saved.authentic;
        const entry = snapshot.simulation.knowledge[observer]?.[key];
        const receipt = snapshot.simulation.situations[situationId]?.receipts.at(-1);
        if (receipt?.to !== 'finished' || receipt.cause !== cause || receipt.at !== at) return ancestry;
        if (!entry || !recipients.includes(observer) || entry.cause !== cause ||
            entry.at !== at || entry.basis?.kind !== 'observation' ||
            entry.basis.attributedTo !== observer || entry.basis.situationId !== completed.id) return ancestry;
        return addDescent(ancestry, registry, {kind: 'taught-by', writer: 'n', from: idFor(learner),
            to: idFor(teacher), at: entry.at, cause: entry.cause});
    }

    const seen = viewLesson(loaded, witness);
    const persisted = restoreDescent(serializeDescent(seen), registry);
    assert.deepEqual(persisted.edges.slice(ancestry.edges.length), [
        {kind: 'taught-by', from: 'flock:lamb', to: 'flock:ewe', at: finish, writer: 'n', cause},
    ]);
    assert.deepEqual(bloodline(persisted, 'flock:lamb'), {...bloodline(ancestry, 'flock:lamb'),
        teaching: [{learner: 'flock:lamb', teacher: 'flock:ewe', at: finish}]});
    assert.equal(loaded.simulation.knowledge[listener][key].basis.kind, 'instruction');
    assert.equal(viewLesson(loaded, listener), ancestry);
    assert.equal(viewLesson(falselyLabeled, listener), ancestry);
    const withoutReceipt = roundTrip(loaded);
    withoutReceipt.simulation.situations[situationId].receipts.pop();
    assert.equal(viewLesson(withoutReceipt, witness), ancestry);
    assert.equal(viewLesson(loaded, handler), ancestry, 'no knowledge is inferred from custody');
    assert.deepEqual(loaded.simulation.knowledge[witness][key].basis,
        {kind: 'observation', attributedTo: witness, situationId});
}
