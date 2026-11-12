import {addDescent} from './kernel_descent.js';

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
