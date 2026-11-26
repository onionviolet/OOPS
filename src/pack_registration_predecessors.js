// Exact, owner-declared dormant provenance transitions. This registry is not
// part of a world's hashed content and grants no life, stock or activity.
const predecessors = new Map();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const validId = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);
const shape = (packId, row) => row && Object.keys(row).sort().join(',') === 'itemIds,locationIds,worldId'
    && validId(row.worldId) && row.worldId.startsWith(packId + '.')
    && ['locationIds', 'itemIds'].every(field => Array.isArray(row[field])
        && new Set(row[field]).size === row[field].length
        && row[field].every(id => validId(id) && id.startsWith(packId + '.')));

export function declareRegistrationPredecessor({packId, from, to, contentHash}) {
    if (!validId(packId) || predecessors.has(packId) || !shape(packId, from) || !shape(packId, to)
        || from.worldId !== to.worldId || !/^sha256:[a-f0-9]{64}$/.test(contentHash)
        || !['locationIds', 'itemIds'].every(field => from[field].every(id => to[field].includes(id)))) {
        throw Error('Invalid exact registration predecessor.');
    }
    predecessors.set(packId, structuredClone({from, to, contentHash}));
}

export function registrationIsDormant(state, packId) {
    return !Object.hasOwn(state.packs, packId) && state.structured?.packId !== packId
        && state.pendingStructured?.packId !== packId;
}

export function migrateRegistrationPredecessor(row, definition, dormant) {
    const rule = predecessors.get(definition.id);
    if (!row || !rule || !dormant || definition.contentHash !== rule.contentHash) return row;
    // Match all historical fields exactly. A malformed or visited partial
    // record cannot masquerade as an uncompiled predecessor.
    if (Object.keys(row).some(key => !['worldId', 'locationIds', 'itemIds', 'native'].includes(key))) return row;
    const fields = value => ({worldId: value.worldId, locationIds: value.locationIds, itemIds: value.itemIds});
    const target = {worldId: definition.world.id, locationIds: definition.locations.map(l => l.id),
        itemIds: (definition.items || []).map(i => i.id)};
    if (!same(fields(row), rule.from) || !same(target, rule.to)
        || (definition.simulation?.containers || []).length) return row;
    return {...row, locationIds: [...rule.to.locationIds], itemIds: [...rule.to.itemIds]};
}
