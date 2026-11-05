// Port for who-knows-what rows. Worlds register a source; people_knowledge.js reads them and imports no world.
// A source is (state, {knowledge, personAccounts}) -> rows. `order` keeps the row order stable whatever load order.
const sources = new Map();
export function registerPeopleSource(id, order, source) {
    if (typeof id !== 'string' || !id || !Number.isFinite(order) || typeof source !== 'function') throw new TypeError('A source id, numeric order and reader are required.');
    sources.set(id, {order, source});
    return () => sources.delete(id);
}
export const peopleSources = () => [...sources.values()].sort((a, b) => a.order - b.order).map(s => s.source);
