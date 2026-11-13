import {addDescent} from './kernel_descent.js';
import {check, natural} from './basics.js';
import {inbreedingGrowthDelay, kinship} from './lineage_traits.js';

// The host supplies a Map from local creature IDs to registry IDs for this
// birth. Include the child and only parents whose relationship is known in
// this context. The adapter never registers identities or publishes body data.
export function projectCreatureBirth(graph, registry, lifecycle, childId, observed) {
    const child = Object.hasOwn(lifecycle.individuals, childId) ? lifecycle.individuals[childId] : undefined;
    const from = observed.get(childId);
    if (!child?.parents || !from || !Object.hasOwn(registry.entries, from)) return graph;

    for (const parentId of child.parents) {
        const to = observed.get(parentId);
        if (!to || !Object.hasOwn(registry.entries, to)) continue;
        if (graph.edges.some(edge => edge.kind === 'born-of' && edge.from === from && edge.to === to)) continue;
        graph = addDescent(graph, registry, {kind: 'born-of', from, to, at: child.bornAt, writer: 'l', cause: 'birth'});
    }
    return graph;
}

// Read the observer's projected graph. Missing edges leave the estimate
// provisional, even when the observed contribution is zero.
export function forecastCreatureInbreeding(graph, {parents, genome}) {
    const effect = genome?.inbreeding?.growthMinutesAtFull;
    if (effect === undefined) return {status: 'disabled'};
    check(natural(effect) && Array.isArray(parents) && parents.length === 2 &&
        parents.every(id => typeof id === 'string' && id.length > 0) && parents[0] !== parents[1],
    'A breeding forecast needs two distinct identities and a whole-minute growth rule.');
    const edges = new Map();
    for (const {kind, from, to} of graph.edges) {
        if (kind !== 'born-of') continue;
        if (!edges.has(from)) edges.set(from, []);
        edges.get(from).push(to);
    }
    const ordered = new Map(), visiting = new Set();
    function include(id) {
        if (ordered.has(id)) return;
        check(!visiting.has(id), 'An observed pedigree cannot loop.');
        visiting.add(id);
        const known = [...new Set(edges.get(id) ?? [])].sort();
        check(known.length <= 2, 'An observed creature pedigree has at most two parents.');
        for (const ancestor of known) include(ancestor);
        visiting.delete(id);
        const [sire, dam] = known;
        ordered.set(id, {id, sire, dam});
    }
    for (const id of [...parents].sort()) include(id);
    const coefficient = kinship([...ordered.values()], ...parents);
    return {status: coefficient > 0 ? 'related-in-records' : 'undetermined',
        estimatedGrowthDelay: inbreedingGrowthDelay(effect, coefficient)};
}
