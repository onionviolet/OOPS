import assert from 'node:assert/strict';
import test from 'node:test';

import {
    acquireCreature, practiceWithCreature, restoreCreatureLifecycle, settleCohortStock, settleCreatureBirth, startCreatureBrood,
} from '../src/creature_lifecycle.js';
import {createDescent, purity} from '../src/kernel_descent.js';
import {addIdentity, createIdentities, identityFor} from '../src/kernel_identity.js';
import {pedigreeKnowledgeEffect, readPedigree} from '../src/knowledge_pedigree.js';
import {forecastCreatureInbreeding, projectCreatureBirth} from '../src/living_descent.js';
import {planMeadowFleece} from '../src/meadow_fleece.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {livingKindRegistry} from '../src/living_kinds.js';
import {cueAncestralLanternSignal, cueLanternSignal, lanternBodyReader, lanternCoatProperties,
    LANTERN_COAT_PACK, LANTERN_FLEECE_LAW} from '../src/world_packs/meadow_lantern_fleece.js';
import {LIVING_GENOMES} from '../src/living_genomes.js';
import {createSimulationState, validateSimulationState} from '../src/simulation_contracts.js';
import {applySimulationEffects} from '../src/simulation_effects.js';

test('one birth yields only the parentage independently established for each observer', () => {
    const field = {id: 'field', capacity: 6, supportedSpecies: ['sheep']};
    const genome = LIVING_GENOMES['village.sheep'];
    const genes = {fleece: ['F', 'f'], coat: ['D', 'D'], winter: ['W', 'w'], vigor: ['V', 'v']};
    const initial = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'field.sheep',
        species: 'sheep', habitat: field, delta: 3});
    const acquire = state => acquireCreature(state, {revision: state.revision, cohortId: 'field.sheep',
        destination: field, keeper: 'player', genome, genes, breeding: {woolTenths: 62}});
    const ewe = acquire(initial), ram = acquire(ewe.state), decoy = acquire(ram.state);
    const parents = [ewe.id, ram.id];
    const brood = startCreatureBrood(decoy.state, {revision: decoy.state.revision, parents, keeper: 'player',
        clock: 1, gestationMinutes: 4, growthMinutes: 2, root: 'pedigree', genome});
    const lamb = settleCreatureBirth(brood.state, {revision: brood.state.revision, broodId: brood.id,
        clock: 5, destination: field});
    const newborn = lamb.state.individuals[lamb.id];
    assert.deepEqual(newborn.parents, parents);
    assert.ok(newborn.genes && newborn.breeding);

    const secondBrood = startCreatureBrood(lamb.state, {revision: lamb.state.revision, parents, keeper: 'player',
        clock: 5, gestationMinutes: 1, growthMinutes: 2, root: 'pedigree', genome});
    const sibling = settleCreatureBirth(secondBrood.state, {revision: secondBrood.state.revision,
        broodId: secondBrood.id, clock: 6, destination: field});
    const identities = [[lamb.id, 'flock:lamb'], [ewe.id, 'flock:ewe'], [ram.id, 'flock:ram'],
        [decoy.id, 'flock:decoy'], [sibling.id, 'flock:sibling']];
    const registry = identities.reduce((current, [key, id]) => addIdentity(current, {
        id, at: 5, cause: 'fixture.identity', facets: {body: {owner: 'lifecycle', key}},
    }), createIdentities());
    const identityForLocal = key => identityFor(registry, 'lifecycle', key)?.id;

    const observer = 'player', listener = 'listener', situationId = 'field.lambing', cause = 'field.witness';
    const participants = [observer, listener];
    const actors = Object.fromEntries(participants.map(id => [id, {worldId: 'village'}]));
    const simulation = {...createSimulationState(1), enrolledAt: 0};
    for (const id of participants) simulation.people[id] = {life: 'alive', inventory: 'simulation', location: 'field', bornAt: 0};
    const state = {clock: 5, actors, worlds: {village: {}}, simulation};
    const write = (effects, receipt) => applySimulationEffects({state}, effects, {actorId: observer}, {simulation: {}}, receipt);
    write([{type: 'situation', operation: 'begin', situationId, definition: {
        id: situationId, revision: 1, context: {worldId: 'village', instanceId: 'village', continuityId: 'village',
            eraId: 'now', regionId: 'field'}, phases: ['lambing'], initialPhase: 'lambing',
        privateTruth: {birthSettled: true}, participants,
    }}], 'field.opened');

    const report = (recipient, parent, kind, attributedTo, stage, value) => pedigreeKnowledgeEffect({
        observer: recipient, child: lamb.id, parent, stage, value, basis: {kind, attributedTo, situationId},
    });
    write([
        report(observer, ewe.id, 'observation', observer, 'seen', 'I witnessed this parent at the birth.'),
        report(observer, decoy.id, 'observation', observer, 'understood', 'A misidentified parent.'),
        report(listener, ewe.id, 'observation', listener, 'understood', 'An unwitnessed claim.'),
    ], cause);
    write([
        report(listener, decoy.id, 'recollection', observer, 'understood', 'I was told this was the parent.'),
        report(listener, decoy.id, 'inference', listener, 'understood', 'I guessed this was the parent.'),
    ], 'field.talk');

    // Independent fixture event: only the player saw the ewe give birth.
    // Bind the receipt to its observer and both endpoints, not hidden parentage.
    const authenticate = row => row.observer === observer && row.child === lamb.id && row.parent === ewe.id &&
        row.basis.kind === 'observation' && row.basis.attributedTo === observer &&
        row.basis.situationId === situationId && row.at === 5 && row.cause === cause;
    const loaded = JSON.parse(JSON.stringify(state));
    validateSimulationState(loaded.simulation, loaded);
    const before = JSON.stringify(loaded);
    const seen = readPedigree(loaded, observer, lamb.id, {authenticate, identityForLocal});
    const checked = [];
    const heard = readPedigree(loaded.simulation, listener, lamb.id, {identityForLocal, authenticate: row => {
        checked.push(row.basis.kind);
        return authenticate(row);
    }});
    assert.deepEqual(checked, ['observation'], 'hearsay and inference cannot qualify for an edge');
    assert.deepEqual(seen.observed, new Map([[lamb.id, 'flock:lamb'], [ewe.id, 'flock:ewe']]));
    assert.deepEqual(seen.accounts[0], {observer, child: lamb.id, parent: ewe.id, stage: 'seen',
        value: 'I witnessed this parent at the birth.', at: 5, cause, basis: {kind: 'observation', attributedTo: observer, situationId}});
    assert.deepEqual(heard.accounts.map(row => [row.parent, row.basis.kind]), [
        [ewe.id, 'observation'], [decoy.id, 'recollection'], [decoy.id, 'inference'],
    ]);
    assert.deepEqual([...heard.observed], []);
    assert.deepEqual([...readPedigree(loaded, observer, lamb.id, {identityForLocal}).observed], []);
    assert.deepEqual(readPedigree(loaded, 'absent', lamb.id), {accounts: [], observed: new Map()});
    assert.equal(JSON.stringify(loaded), before);

    const graph = createDescent();
    const witnessGraph = projectCreatureBirth(graph, registry, lamb.state, lamb.id, seen.observed);
    const listenerGraph = projectCreatureBirth(graph, registry, lamb.state, lamb.id, heard.observed);
    assert.deepEqual(witnessGraph.edges, [
        {kind: 'born-of', from: 'flock:lamb', to: 'flock:ewe', at: 5, writer: 'l', cause: 'birth'},
    ]);
    assert.equal(listenerGraph, graph);
    assert.deepEqual(purity(witnessGraph, 'flock:lamb', () => true), {matching: 0.5, unknown: 0.5, other: 0});
    const published = JSON.stringify([seen.accounts, [...seen.observed], heard.accounts, [...heard.observed], witnessGraph, listenerGraph]);
    for (const hidden of [ram.id, 'flock:ram', 'genes', 'breeding', 'woolTenths']) assert.ok(!published.includes(hidden), hidden);

    // A later authenticated evidence receipt can establish the same edge for the listener.
    state.clock = 6;
    write([report(listener, ewe.id, 'instruction', observer, 'interpreted', 'I examined the signed birth record.')], 'field.record');
    const evidence = readPedigree(state, listener, lamb.id, {identityForLocal, authenticate: row =>
        row.observer === listener && row.child === lamb.id && row.parent === ewe.id && row.basis.kind === 'instruction' &&
        row.basis.situationId === situationId && row.basis.attributedTo === observer && row.at === 6 && row.cause === 'field.record',
    });
    assert.deepEqual(evidence.observed, seen.observed);
    assert.deepEqual(projectCreatureBirth(graph, registry, lamb.state, lamb.id, evidence.observed), witnessGraph);

    const practiced = practiceWithCreature(sibling.state, {revision: sibling.state.revision, id: lamb.id,
        actor: observer, clock: 8, minimumGap: 1, bondGain: 1, skill: 'lantern-signal'});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const kinds = livingKindRegistry();
    const forage = 'l.forage_attraction';
    const config = (life, pedigree) => ({packs: [LANTERN_COAT_PACK.id, forage], ownPacks: [LANTERN_COAT_PACK],
        settings: {[forage]: {profiles: [{light, minimum: 8, interval: 11}], maxNeighbors: 1}},
        host: {laws: [LANTERN_FLEECE_LAW], ports: {readThing: lanternBodyReader(life, kinds, {
            readObservedPedigree: ({keeper, id}) => keeper === observer && id === lamb.id
                ? {graph: pedigree, identity: identityForLocal(id)} : undefined,
        })}}});
    const world = createEngineWorld({...config(practiced, witnessGraph), clock: 8,
        links: [{id: 'forage-trail', kind: 'path', from: 'hedge', to: field.id}], holders: [
        {id: field.id, kind: 'place', quantities: {[light]: 0}},
        {id: 'hedge', kind: 'place'},
        {id: 'moth', kind: 'body', place: 'hedge', properties: {alive: true, forage_light: light}},
        {id: lamb.id, kind: 'body', place: field.id, refs: {creature: lamb.id},
            properties: lanternCoatProperties(newborn), quantities: {[charge]: 1}},
    ]});
    const cue = {id: 'pedigree-cue', animal: lamb.id, keeper: observer};
    const pending = cueAncestralLanternSignal(world, {...cue, ancestor: 'flock:ewe'});
    const reload = (engine, pedigree) => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))),
        config(restoreCreatureLifecycle(JSON.parse(JSON.stringify(practiced))), JSON.parse(JSON.stringify(pedigree))));
    const advance = (engine, clock) => advanceEngineWorld(engine, clock).engine;
    const denied = advance(reload(pending, listenerGraph), 9);
    assert.equal(denied.records.workings[cue.id].record.receipts[0].reason, 'lantern-signal-lineage-unverified');
    assert.equal(denied.world.holders[lamb.id].quantities[charge], 1);
    const unobserved = cueAncestralLanternSignal(world, {...cue, ancestor: 'flock:ram'});
    assert.equal(advance(reload(unobserved, witnessGraph), 9).records.workings[cue.id].record.receipts[0].reason,
        'lantern-signal-lineage-unverified');
    const hearsay = cueAncestralLanternSignal(world, {...cue, ancestor: 'flock:decoy'});
    assert.equal(advance(reload(hearsay, listenerGraph), 9).records.workings[cue.id].record.receipts[0].reason,
        'lantern-signal-lineage-unverified');
    const sustained = advance(reload(pending, witnessGraph), 9);
    assert.deepEqual(serializeEngineWorld(sustained), serializeEngineWorld(advance(pending, 9)));
    const emitted = sustained.world.holders[field.id].quantities[light];
    assert.equal(emitted, 8);
    assert.equal(sustained.world.holders[lamb.id].quantities[charge], 0);
    const followed = advance(reload(sustained, witnessGraph), 11);
    assert.equal(followed.world.holders[field.id].quantities[light], emitted);
    assert.equal(followed.world.holders.moth.place, field.id);
    assert.deepEqual(followed.world.holders.moth.state[forage].lastMove,
        {at: 11, from: 'hedge', to: field.id, light, here: 0, there: 8, minimum: 8});
    const faded = advance(reload(followed, witnessGraph), 12);
    assert.equal(faded.world.holders[field.id].quantities[light], 0);
    assert.deepEqual(serializeEngineWorld(faded), serializeEngineWorld(advance(pending, 12)));
    const closedTrail = applyEngineOps(sustained, [
        {op: 'link_set', id: 'forage-trail', state: 'closed'},
    ], 'close-forage-trail');
    const blocked = advance(reload(closedTrail, witnessGraph), 11);
    assert.equal(blocked.world.holders[field.id].quantities[light], emitted);
    assert.equal(blocked.world.holders.moth.place, 'hedge');
    const ordinary = advance(reload(cueLanternSignal(world, cue), listenerGraph), 9);
    assert.equal(ordinary.world.holders[field.id].quantities[light], emitted);
    const ordinaryEnd = advance(reload(ordinary, listenerGraph), 12);
    assert.equal(ordinaryEnd.world.holders[field.id].quantities[light], 0);
    assert.equal(ordinaryEnd.world.holders.moth.place, 'hedge');

    const riskGenome = {...genome, inbreeding: {growthMinutesAtFull: 40}};
    const forecast = (observed, genome = riskGenome) =>
        forecastCreatureInbreeding(observed, {parents: ['flock:lamb', 'flock:sibling'], genome});
    assert.deepEqual(forecast(listenerGraph), {status: 'undetermined', estimatedGrowthDelay: 0});
    assert.deepEqual(forecast(witnessGraph), {status: 'undetermined', estimatedGrowthDelay: 0});
    assert.deepEqual(forecast(witnessGraph, genome), {status: 'disabled'});
    const birthRecord = pedigreeKnowledgeEffect({observer, child: sibling.id, parent: ewe.id,
        stage: 'interpreted', value: 'I examined the signed birth record.', basis: {kind: 'instruction', attributedTo: observer, situationId}});
    write([birthRecord], 'field.second-record');
    const observedSibling = readPedigree(JSON.parse(JSON.stringify(state)), observer, sibling.id, {
        identityForLocal, authenticate: row => row.observer === observer && row.child === sibling.id &&
            row.parent === ewe.id && row.basis.kind === 'instruction' && row.basis.attributedTo === observer &&
            row.basis.situationId === situationId && row.at === 6 && row.cause === 'field.second-record',
    });
    const partial = projectCreatureBirth(witnessGraph, registry, sibling.state, sibling.id, observedSibling.observed);
    assert.deepEqual(forecast(JSON.parse(JSON.stringify(partial))), {status: 'related-in-records', estimatedGrowthDelay: 5});
    assert.ok(!JSON.stringify(partial).includes('flock:ram'));
    const children = [lamb.id, sibling.id];
    write(children.map(child => pedigreeKnowledgeEffect({observer, child, parent: ram.id, stage: 'interpreted',
        value: 'I examined the signed sire record.', basis: {kind: 'instruction', attributedTo: observer, situationId}})),
    'field.sire-records');
    const documented = children.reduce((known, child) => {
        const {observed} = readPedigree(state, observer, child, {identityForLocal, authenticate: row =>
            row.observer === observer && row.child === child && row.parent === ram.id && row.basis.kind === 'instruction' &&
            row.basis.attributedTo === observer && row.basis.situationId === situationId && row.at === 6 && row.cause === 'field.sire-records',
        });
        return projectCreatureBirth(known, registry, sibling.state, child, observed);
    }, partial);
    assert.deepEqual(forecast(documented), {status: 'related-in-records', estimatedGrowthDelay: 10});
    const proposed = startCreatureBrood(sibling.state, {revision: sibling.state.revision, parents: [lamb.id, sibling.id],
        keeper: 'player', clock: 8, gestationMinutes: 1, growthMinutes: 2, root: 'pedigree', genome: riskGenome});
    const savedBrood = restoreCreatureLifecycle(JSON.parse(JSON.stringify(proposed.state)));
    const offspring = settleCreatureBirth(savedBrood, {revision: savedBrood.revision, broodId: proposed.id, clock: 9, destination: field});
    const clip = clock => planMeadowFleece(offspring.id, offspring.state.individuals[offspring.id], 5, {genome: riskGenome, clock});
    const projectedClip = 9 + 2 + forecast(partial).estimatedGrowthDelay;
    assert.equal(clip(projectedClip).ok, false);
    assert.equal(clip(20).ok, false);
    assert.equal(clip(9 + 2 + forecast(documented).estimatedGrowthDelay).ok, true);
});
