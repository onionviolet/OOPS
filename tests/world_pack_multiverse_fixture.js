// Synthetic multiverse and series packs (P9M, P9S). Original test data only.
// test.multiverse (multiverse rulebook layer)
//   └─ test.saga (series: shared census, base laws)
//        ├─ test.saga_dawn (continuity world, "academy" preset)
//        └─ test.saga_dusk (continuity world, "frontier" preset)
// Both continuities hold their own counterpart of the series hero.
const header = (id, role, extra = {}) => ({
    format: 'yairpg.world-pack', formatVersion: 1, id, revision: 1, saveSchema: 1, saveCompatibleFrom: 1, kind: 'original', role,
    title: id, attribution: {source: 'YAIRPG synthetic fixture', licence: 'original', notice: 'Synthetic test data.'},
    budgets: {entities: 50, drawsPerEntity: 4, saveBytes: 20000, presenceQueryMicros: 50}, content: {}, ...extra,
});

export function makeMultiversePack() {
    return header('test.multiverse', 'multiverse', {
        axes: {cosmology: 'shared_multiverse', law: 'mana_economy', metaphysics: 'souls_conserved', scale: 'heroic', lifeDeath: 'permanent'},
        lock: ['metaphysics'],
        provides: {presets: [
            {id: 'test.multiverse.preset.academy', label: 'Academy world', axes: {resolution: 'd20', progression: 'levels', time: {model: 'ratio', num: 1, den: 1}, tone: ['cozy']}},
            {id: 'test.multiverse.preset.frontier', label: 'Frontier world', axes: {resolution: 'percentile', progression: 'learn_by_use', time: {model: 'frozen_when_absent'}, tone: ['grim']}},
        ]},
    });
}
export function makeSeriesPack() {
    return header('test.saga', 'series', {
        kind: 'canon', sourceSnapshot: {hash: 'synthetic-saga-1', locator: 'tests/world_pack_multiverse_fixture.js'},
        memberships: [{parent: 'test.multiverse', layer: 'multiverse', scopes: ['cosmology', 'law', 'metaphysics', 'scale']}],
        axes: {law: 'mana_economy_tidal', canonCourse: 'resists_change'},
        lock: ['canonCourse'],
        content: {catalog: [{id: 'test.saga.cat.hero', label: 'The hero', kind: 'person', canonWeight: 'W3'}, {id: 'test.saga.cat.sundering', label: 'The sundering', kind: 'event', era: 'prologue'}]},
    });
}
function makeContinuity(id, preset, extra = {}) {
    const p = `${id}.`;
    return header(id, 'world', {
        kind: 'canon', sourceSnapshot: {hash: `synthetic-${id}-1`, locator: 'tests/world_pack_multiverse_fixture.js'},
        memberships: [{parent: 'test.multiverse', layer: 'multiverse', scopes: ['metaphysics', 'lifeDeath']}, {parent: 'test.saga', layer: 'series', scopes: ['law', 'canonCourse', 'scale']}],
        preset, entryArea: `${p}area.square`,
        content: {
            areas: [
                {id: `${p}area.square`, label: 'Square', coverage: 'playable', activities: [`${p}act.look`], people: [`${p}person.hero`, `${p}person.smith`], routes: [{to: `${p}area.forge`, method: 'walk', minutes: 4}]},
                {id: `${p}area.forge`, label: 'Forge', coverage: 'playable', activities: [`${p}act.work`], people: [`${p}person.smith`], routes: [{to: `${p}area.square`, method: 'walk', minutes: 4}]},
            ],
            people: [{id: `${p}person.hero`, name: 'Ren', canonWeight: 'W3', counterpartOf: 'test.saga.cat.hero'}, {id: `${p}person.smith`, name: 'Ola', canonWeight: 'W1'}],
            crossings: [],
        },
        ...extra,
    });
}
export const makeDawnPack = () => {
    const pack = makeContinuity('test.saga_dawn', 'test.multiverse.preset.academy', {axes: {lifeDeath: 'respawn'}});
    pack.content.crossings = [{id: 'test.saga_dawn.cross.dusk', to: 'test.saga_dusk', authority: 'traveler'}];
    return pack;
};
export const makeDuskPack = () => makeContinuity('test.saga_dusk', 'test.multiverse.preset.frontier', {axes: {time: {model: 'catch_up_on_return'}}});
export const makeSeriesFixture = () => [makeMultiversePack(), makeSeriesPack(), makeDawnPack(), makeDuskPack()];
