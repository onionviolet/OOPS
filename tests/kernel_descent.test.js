// One descent graph (DG1-DG7, PFP33, KW40-KW45). Adapters read two existing
// owners unchanged: lineage_traits breeding (sire and dam become born-of
// edges) and family_tree chronicles (an ended life's heir becomes inherited-by,
// an apprentice also taught-by). The other owners' mappings are in the doc.
import assert from 'node:assert/strict';
import test from 'node:test';

import {addIdentity, createIdentities} from '../src/kernel_identity.js';
import {
    DESCENT_SCHEMA, addDescent, ancestors, bloodline, createDescent, descendants, descendsFrom, purity, restoreDescent, serializeDescent,
} from '../src/kernel_descent.js';
import {breed, foundingGenes, member, seeded} from '../src/lineage_traits.js';
import {extendLineage} from '../src/family_tree.js';

const mint = (reg, thingId, owner, key, at = 0) => addIdentity(reg, {id: thingId, at, cause: 'observed', facets: {record: {owner, key}}});

// A three-generation pedigree from the real breeding owner.
function pedigree() {
    const rng = seeded('kernel-descent');
    const a = member('ewe-a', 'A', 'f', foundingGenes(rng));
    const b = member('ram-b', 'B', 'm', foundingGenes(rng));
    const c = member('ewe-c', 'C', 'f', foundingGenes(rng));
    const {child: d} = breed(b, a, {rng, id: 'lamb-d', name: 'D', sex: 'f', bornAt: 10, members: [a, b]});
    const {child: e} = breed(b, c, {rng, id: 'lamb-e', name: 'E', sex: 'm', bornAt: 12, members: [a, b, c]});
    const {child: f} = breed(e, d, {rng, id: 'lamb-f', name: 'F', sex: 'f', bornAt: 30, members: [a, b, c, d, e]});
    const members = [a, b, c, d, e, f];
    let reg = createIdentities();
    for (const m of members) reg = mint(reg, `sheep:${m.id}`, 'lineage', m.id, m.bornAt);
    let graph = createDescent();
    for (const m of members) for (const parent of [m.sire, m.dam].filter(Boolean)) {
        graph = addDescent(graph, reg, {kind: 'born-of', from: `sheep:${m.id}`, to: `sheep:${parent}`, at: m.bornAt, writer: 'l', cause: 'bred'});
    }
    return {reg, graph, members};
}

test('a bred pedigree becomes born-of edges, and a bloodline is a query over them', () => {
    const {graph} = pedigree();
    assert.equal(graph.edges.length, 6);
    assert.deepEqual(ancestors(graph, 'sheep:lamb-f').map(({id, depth}) => [id, depth]),
        [['sheep:lamb-d', 1], ['sheep:lamb-e', 1], ['sheep:ewe-a', 2], ['sheep:ewe-c', 2], ['sheep:ram-b', 2]]);
    assert.deepEqual(descendants(graph, 'sheep:ram-b').map(row => row.id), ['sheep:lamb-d', 'sheep:lamb-e', 'sheep:lamb-f']);
    assert.equal(descendsFrom(graph, 'sheep:lamb-f', 'sheep:ewe-c'), true);
    assert.equal(descendsFrom(graph, 'sheep:lamb-d', 'sheep:ewe-c'), false);
    assert.deepEqual(ancestors(graph, 'sheep:lamb-f', {depth: 1}).map(row => row.id), ['sheep:lamb-d', 'sheep:lamb-e']);
});

test('purity is a computed share, and unobserved ancestry stays unknown (BL3, BX3)', () => {
    const {graph} = pedigree();
    // Founders A and B are of the "old line"; C is not.
    const judge = id => ({'sheep:ewe-a': true, 'sheep:ram-b': true, 'sheep:ewe-c': false})[id] ?? null;
    assert.deepEqual(purity(graph, 'sheep:lamb-d', judge), {matching: 1, unknown: 0, other: 0});
    assert.deepEqual(purity(graph, 'sheep:lamb-f', judge), {matching: 0.75, unknown: 0, other: 0.25});
    // A lamb with one observed parent: the other half is unknown, not assumed.
    let {reg, graph: g} = pedigree();
    reg = mint(reg, 'sheep:stray', 'lineage', 'stray', 40);
    g = addDescent(g, reg, {kind: 'born-of', from: 'sheep:stray', to: 'sheep:lamb-d', at: 40, writer: 'l', cause: 'seen nursing'});
    assert.deepEqual(purity(g, 'sheep:stray', judge), {matching: 0.5, unknown: 0.5, other: 0});
    // A Gu propagated from one mother is a world dial (expected parents: 1).
    assert.deepEqual(purity(g, 'sheep:stray', judge, {expected: 1}), {matching: 1, unknown: 0, other: 0});
});

test('each owner writes only its own kind; edges join observed identities; time lines cannot loop', () => {
    const {reg, graph} = pedigree();
    assert.throws(() => addDescent(graph, reg, {kind: 'born-of', from: 'sheep:ewe-a', to: 'sheep:lamb-f', at: 50, writer: 'l', cause: 'x'}), /cannot loop/);
    assert.throws(() => addDescent(graph, reg, {kind: 'born-of', from: 'sheep:lamb-f', to: 'sheep:ewe-a', at: 50, writer: 'm', cause: 'x'}), /Only l writes/);
    assert.throws(() => addDescent(graph, reg, {kind: 'born-of', from: 'sheep:lamb-f', to: 'sheep:never-seen', at: 50, writer: 'l', cause: 'x'}), /observed identities/);
    assert.throws(() => addDescent(graph, reg, {kind: 'kin-of', from: 'sheep:lamb-f', to: 'sheep:ewe-a', at: 50, writer: 'l', cause: 'x'}), /Unknown descent kind/);
    assert.throws(() => addDescent(graph, reg, {kind: 'born-of', from: 'sheep:lamb-d', to: 'sheep:ewe-a', at: 10, writer: 'l', cause: 'bred'}), /already recorded/);
    // Mutual teaching is allowed: taught-by is not a time line.
    let g = addDescent(graph, reg, {kind: 'taught-by', from: 'sheep:ewe-a', to: 'sheep:ram-b', at: 5, writer: 'n', cause: 'x'});
    g = addDescent(g, reg, {kind: 'taught-by', from: 'sheep:ram-b', to: 'sheep:ewe-a', at: 6, writer: 'n', cause: 'x'});
    assert.equal(g.edges.length, 8);
});

test('a family chronicle maps onto inherited-by and taught-by, and what rides with the line comes back (BL6)', () => {
    // Two ended lives from the real family_tree owner: a kin heir, then an apprentice.
    const first = extendLineage(null, {name: 'Old Weaver', age: 71}, 'kin');
    const second = extendLineage({life: {experience: {lineage: first, generation: 2}}}, {name: 'Second Weaver', age: 64}, 'apprentice');
    assert.deepEqual(second.ancestors.map(row => row.via), ['apprentice', 'kin']);
    let reg = createIdentities();
    for (const [thingId, key] of [['person:old', 'Old Weaver'], ['person:second', 'Second Weaver'], ['person:third', 'You'],
        ['item:loom', 'Loom'], ['recipe:plain', 'Plain weave'], ['recipe:twill', 'Twill']]) reg = mint(reg, thingId, 'chronicle', key);
    let g = createDescent();
    g = addDescent(g, reg, {kind: 'born-of', from: 'person:second', to: 'person:old', at: 1, writer: 'l', cause: 'kin'});
    g = addDescent(g, reg, {kind: 'inherited-by', from: 'person:second', to: 'person:old', via: 'item:loom', at: 71, writer: 'm', cause: 'kin heir'});
    // The apprentice is taught, not born: taught-by plus inherited-by, no born-of.
    g = addDescent(g, reg, {kind: 'taught-by', from: 'person:third', to: 'person:second', at: 60, writer: 'n', cause: 'apprentice'});
    g = addDescent(g, reg, {kind: 'inherited-by', from: 'person:third', to: 'person:second', via: 'item:loom', at: 64, writer: 'm', cause: 'apprentice heir'});
    g = addDescent(g, reg, {kind: 'forked-from', from: 'recipe:twill', to: 'recipe:plain', at: 65, writer: 'p', cause: 'pattern variant'});
    g = addDescent(g, reg, {kind: 'taught-by', from: 'recipe:twill', to: 'person:second', at: 65, writer: 'n', cause: 'family recipe'});
    assert.equal(descendsFrom(g, 'person:third', 'person:old'), false, 'no blood between master and apprentice');
    assert.equal(descendsFrom(g, 'person:third', 'person:old', {kinds: ['taught-by', 'born-of']}), true, 'a teaching line all the same');
    const line = bloodline(g, 'person:second');
    assert.deepEqual(line.ancestors.map(row => row.id), ['person:old']);
    assert.deepEqual(line.holdings, [{heir: 'person:second', from: 'person:old', thing: 'item:loom', at: 71}]);
    assert.deepEqual(ancestors(g, 'recipe:twill', {kinds: ['forked-from']}).map(row => row.id), ['recipe:plain']);
    assert.throws(() => addDescent(g, reg, {kind: 'born-of', from: 'person:third', to: 'person:old', via: 'item:loom', at: 1, writer: 'l', cause: 'x'}), /Only inherited-by/);
});

test('the graph saves as one versioned record and is rechecked on restore', () => {
    const {reg, graph} = pedigree();
    const restored = restoreDescent(JSON.parse(JSON.stringify(serializeDescent(graph))), reg);
    assert.deepEqual(restored, graph);
    assert.equal(restored.schema, DESCENT_SCHEMA);
    assert.throws(() => restoreDescent({...graph, schema: 'kernel.descent@9'}, reg), /Unsupported/);
    const looped = structuredClone(graph);
    looped.edges.push({kind: 'born-of', from: 'sheep:ram-b', to: 'sheep:lamb-f', at: 99, writer: 'l', cause: 'x'});
    assert.throws(() => restoreDescent(looped, reg), /cannot loop/);
    assert.throws(() => restoreDescent(graph, createIdentities()), /observed identities/);
});
