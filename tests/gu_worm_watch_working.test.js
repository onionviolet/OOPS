import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {liquorWormState} from '../src/agency_wild.js';
import {GU_WORM_WATCH_LAW, guWormWatchPack, guWormWatchWorking} from '../src/world_packs/gu_worm_watch_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const config = {ownPacks: [guWormWatchPack], packs: ['l.living_body', 'a.wild_agency', 'n.presence', guWormWatchPack.id],
    shared: {quantities: sharedQuantities(['stock']), properties: [...sharedProperties(['alive']), {id: 'gu_kind', type: 'label'}]},
    host: {laws: [GU_WORM_WATCH_LAW]}};
function setup({liquor = 300, concealed = false} = {}) {
    const state = {...liquorWormState('border'), beliefs: {cellar: {liquor: Number(liquor > 0)}}};
    return createEngineWorld({...config, holders: [
        {id: 'border', kind: 'place'},
        {id: 'cellar', kind: 'place', quantities: {liquor, 'stock:searchable-traces': 1}},
        ...['hunter', 'rival'].map(id => ({id, kind: 'body', as: ['operator'], place: 'cellar', properties: {senses: ['sight']}})),
        {id: 'worm', kind: 'body', as: ['gu'], place: 'border', tags: ['a.wild.liquor_worm'], quantities: {satiety: 300},
            properties: {alive: true, gu_kind: 'liquor-worm', ...(concealed && {concealed: ['sight']})},
            state: {'a.wild_agency': state}},
    ]});
}
const advance = (engine, to) => {
    const out = advanceEngineWorld(engine, to);
    assert.equal(out.pending, false);
    return out.engine;
};
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
function work(engine, id, operation, observer = 'hunter') {
    const method = guWormWatchWorking(operation);
    const ids = {observer, site: 'cellar'};
    return startEngineWorking(engine, {id, law: GU_WORM_WATCH_LAW, method,
        bindings: Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]))});
}
const lead = (engine, who) => engine.world.holders[who].properties.gu_worm_sighting;
const traces = engine => engine.world.holders.cellar.quantities['stock:searchable-traces'];

test('the Worm chooses to drink, and its visit enables a search for the observer who saw it', () => {
    const before = advance(setup(), 60);
    assert.equal(before.world.holders.worm.place, 'border');
    const waiting = work(before, 'watch', 'watch');
    const seen = advance(restore(waiting), 62);
    assert.deepEqual(serializeEngineWorld(seen), serializeEngineWorld(advance(waiting, 62)));
    assert.equal(seen.world.holders.worm.place, 'cellar');
    assert.ok(seen.world.holders.cellar.quantities.liquor < 300);
    assert.equal(lead(seen, 'hunter'), 'cellar');
    assert.equal(lead(seen, 'rival'), undefined);
    const gone = advance(seen, 600);
    assert.equal(gone.world.holders.worm.place, 'border');
    assert.deepEqual(gone.world.holders.hunter.properties['sensed-presence'], []);
    assert.equal(lead(gone, 'hunter'), 'cellar');
    const searched = advance(work(work(gone, 'a-rival', 'search', 'rival'), 'b-hunter', 'search'), 601);
    assert.equal(searched.records.workings['a-rival'].record.status, 'interrupted');
    assert.equal(searched.records.workings['b-hunter'].record.status, 'complete');
    assert.equal(traces(searched), 0);
    assert.equal(lead(searched, 'hunter'), undefined);
});

test('a dry site or a screened Worm gives the observer no lead', () => {
    const dry = advance(work(advance(setup({liquor: 0}), 60), 'watch', 'watch'), 62);
    const screened = advance(work(advance(setup({concealed: true}), 60), 'watch', 'watch'), 62);
    assert.equal(dry.world.holders.worm.place, 'border');
    assert.equal(screened.world.holders.worm.place, 'cellar');
    for (const engine of [dry, screened]) {
        assert.equal(lead(engine, 'hunter'), undefined);
        assert.equal(engine.records.workings.watch.record.status, 'complete');
        const attempt = advance(work(engine, 'search', 'search'), 63);
        assert.equal(attempt.records.workings.search.record.status, 'interrupted');
        assert.equal(traces(attempt), 1);
    }
});

test('an actor leaving before the watch settles cannot learn the Worm is present', () => {
    const waiting = work(advance(setup(), 60), 'watch', 'watch');
    const left = applyEngineOps(waiting, [{op: 'move', holder: 'hunter', to: 'border'}], 'fixture.left');
    const outcome = advance(restore(left), 62);
    assert.equal(outcome.world.holders.worm.place, 'cellar');
    assert.equal(lead(outcome, 'hunter'), undefined);
});

test('two witnesses can learn the site but only one can examine its remaining trace', () => {
    let engine = advance(setup(), 60);
    engine = advance(work(work(engine, 'hunter-watch', 'watch'), 'rival-watch', 'watch', 'rival'), 62);
    assert.equal(lead(engine, 'hunter'), 'cellar');
    assert.equal(lead(engine, 'rival'), 'cellar');
    engine = advance(work(work(engine, 'hunter-search', 'search'), 'rival-search', 'search', 'rival'), 63);
    assert.equal(engine.records.workings['hunter-search'].record.status, 'complete');
    assert.equal(engine.records.workings['rival-search'].record.status, 'interrupted');
    assert.equal(traces(engine), 0);
});
