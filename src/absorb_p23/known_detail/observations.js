// Optional, creature-specific associations missing from the global item log.
// No enemy/drop catalog is read. P00 supplies actual settled native loot only.
const record = v => v && typeof v === 'object' && !Array.isArray(v);
const validId = id => typeof id === 'string' && id.length > 0 && id.length <= 256 && !['__proto__','constructor','prototype'].includes(id);
export function validateDropObservations(raw) {
    if (raw === undefined) return {schema:1, creatures:{}};
    if (!record(raw) || raw.schema !== 1 || !record(raw.creatures) || Object.keys(raw).some(k=>!['schema','creatures'].includes(k))) throw new Error('Unsupported drop observation schema.');
    for (const [id, creature] of Object.entries(raw.creatures)) {
        if (!validId(id) || !record(creature) || !Number.isSafeInteger(creature.lastKillOrdinal) || creature.lastKillOrdinal < 1 || !record(creature.drops) || Object.keys(creature).some(k=>!['lastKillOrdinal','drops'].includes(k))) throw new Error('Invalid creature observation.');
        for (const [itemId,count] of Object.entries(creature.drops)) if (!validId(itemId) || !Number.isSafeInteger(count) || count < 1) throw new Error('Invalid observed drop.');
    }
    return structuredClone(raw);
}
export function settleObservedDrops(raw, event) {
    const next = validateDropObservations(raw);
    if (!record(event) || event.recipientId !== 'player' || !validId(event.creatureId) || !Number.isSafeInteger(event.killOrdinal) || event.killOrdinal < 1 || !Array.isArray(event.drops)) throw new Error('A settled native player kill receipt is required.');
    for (const drop of event.drops) if (!record(drop) || !validId(drop.itemId) || !Number.isSafeInteger(drop.count) || drop.count < 1) throw new Error('Invalid actual loot receipt.');
    const previous = next.creatures[event.creatureId];
    if (previous && event.killOrdinal <= previous.lastKillOrdinal) return {state:next, changed:false};
    const creature = {lastKillOrdinal:event.killOrdinal, drops:{...previous?.drops}};
    for (const drop of event.drops) {
        const count = (creature.drops[drop.itemId] || 0) + drop.count;
        if (!Number.isSafeInteger(count)) throw new Error('Observed count is outside the supported range.');
        creature.drops[drop.itemId] = count;
    }
    next.creatures[event.creatureId] = creature;
    return {state:next, changed:true};
}
