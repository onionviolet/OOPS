import assert from 'node:assert/strict';
import test from 'node:test';

import {
    acquireCreature, restoreCreatureLifecycle, settleCohortStock, settleCreatureBirth, startCreatureBrood,
} from '../src/creature_lifecycle.js';
import {createDescent, purity} from '../src/kernel_descent.js';
import {addIdentity, createIdentities, identityFor} from '../src/kernel_identity.js';
import {pedigreeKnowledgeEffect, readPedigree} from '../src/knowledge_pedigree.js';
import {projectCreatureBirth} from '../src/living_descent.js';
import {LIVING_GENOMES} from '../src/living_genomes.js';
import {createSimulationState, validateSimulationState} from '../src/simulation_contracts.js';
import {applySimulationEffects} from '../src/simulation_effects.js';

test('one birth yields only the parentage independently established for each observer', () => {
    const field = {id: 'field', capacity: 4, supportedSpecies: ['sheep']};
    const genome = LIVING_GENOMES['village.sheep'];
    const genes = {fleece: ['F', 'f'], coat: ['D', 'd'], winter: ['W', 'w'], vigor: ['V', 'v']};
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

    const identities = [[lamb.id, 'flock:lamb'], [ewe.id, 'flock:ewe'], [ram.id, 'flock:ram'], [decoy.id, 'flock:decoy']];
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
});
