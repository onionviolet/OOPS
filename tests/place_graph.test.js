// E10 place graph (audit AF2): one small world of eight places and three link
// kinds proves the shared links, their reader, link-based effect targets and the
// packs, stored workings and worm travel that read them. All numbers are fixture
// rows; nothing here is a world's canon.
import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, linkDistance, linkNeighbours, linksWithin,
    reachReport, restoreWorld, serializeWorld, worldLinks} from '../src/world_substrate.js';
import {applyEffect, resolveTargets} from '../src/world_effects.js';
import {WORLD_EFFECT_KINDS as K} from '../src/world_quantities.js';
import {createForageAttractionPack} from '../src/world_substrate_packs/forage_attraction.js';
import {createResidueFlowPack} from '../src/world_substrate_packs/residue_flow.js';
import {createWildAgencyPack, liquorWormState, LIQUOR_WORM_ROW} from '../src/agency_wild.js';
import {SATIETY} from '../src/world_substrate_packs/living_body.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld} from '../src/engine_world.js';
import {fireStored} from '../src/stored_working.js';
import {engine as storedEngine, make as storedMake, effect as storedEffect, n as storedN} from './fixtures/stored_workings/rows.mjs';

// ---------- the fixture world ----------
const n = {interval: 10, ward: 10, stamina: 12, doorPrice: 5, doorDrag: 2, end: 200, reload: 73};
const PLACES = ['hall', 'study', 'yard', 'road', 'mill', 'tower', 'vault', 'crypt'];
const LINKS = [
    {id: 'p.hall.study', kind: 'path', from: 'hall', to: 'study', cost: 1},
    {id: 'p.hall.yard', kind: 'path', from: 'hall', to: 'yard', cost: 2},
    {id: 'p.yard.road', kind: 'path', from: 'yard', to: 'road', cost: 3},
    {id: 'p.road.mill', kind: 'path', from: 'road', to: 'mill', cost: 5},
    {id: 'p.mill.tower', kind: 'path', from: 'mill', to: 'tower', cost: 6},
    {id: 'p.hall.mill', kind: 'path', from: 'hall', to: 'mill', cost: 30, note: 'The long way over the ridge.'},
    {id: 'p.yard.vault', kind: 'path', from: 'yard', to: 'vault', cost: 4, oneWay: true, note: 'A coal chute: down, not up.'},
    {id: 'd.hall.vault', kind: 'door', from: 'hall', to: 'vault', cost: 1, state: 'closed',
        force: {cost: n.doorDrag, price: [{quantity: 'stamina', amount: n.doorPrice}]}},
    {id: 'd.study.crypt', kind: 'door', from: 'study', to: 'crypt', cost: 1, state: 'closed'},
    {id: 'w.hall.tower', kind: 'wire', from: 'hall', to: 'tower', cost: 1},
];
// A taint that walks the paths: a place that has held it for a link's cost in intervals passes it on.
const taintPack = {
    id: 'x.taint',
    quantities: [{id: 'ward', unit: 'layer', min: 0, max: 100}, {id: 'stamina', unit: 'point', min: 0, max: 100},
        {id: 'taint', unit: 'mark', min: 0, max: 1}],
    reads: ['taint'], writes: ['taint'],
    laws: [{
        id: 'spread',
        appliesTo: h => h.kind === 'place' && (h.quantities.taint ?? 0) >= 1,
        horizon: view => n.interval - view.clock % n.interval,
        decide: (view, id) => {
            if (view.clock % n.interval) return [];
            const since = view.state(id)?.since ?? 0, ops = [];
            for (const exit of view.exits(id, {kinds: ['path']})) {
                if (!view.has(exit.to, 'taint') || view.amount(exit.to, 'taint') > 0 || view.clock - since < exit.cost * n.interval) continue;
                ops.push({op: 'add', holder: exit.to, quantity: 'taint', amount: 1}, {op: 'state', holder: exit.to, value: {since: view.clock}});
            }
            return ops;
        },
    }],
};
const rules = composeSubstrate({packs: [taintPack]});
const body = (id, place, quantities = {ward: 0}) => ({id, kind: 'body', place, quantities});
function fixture({links = LINKS, seed = 'hall'} = {}) {
    return createWorld(rules, {links, holders: [
        ...PLACES.map(id => ({id, kind: 'place', quantities: {taint: id === seed ? 1 : 0}})),
        body('caster', 'hall', {ward: 0, stamina: n.stamina}), body('a', 'study'), body('b', 'vault'),
        body('c', 'yard'), body('d', 'tower'), body('e', 'crypt'),
    ]});
}
const ward = (world, target) => applyEffect(rules, world, {verb: 'add', object: 'ward', amount: n.ward, target, by: 'caster'}, 'test:ward');
const warded = world => Object.keys(world.holders).filter(id => world.holders[id].quantities.ward > 0).sort();
const tainted = world => PLACES.filter(id => world.holders[id].quantities.taint > 0).sort();
const doorQuote = {place: 'vault', via: ['d.hall.vault'], price: [{link: 'd.hall.vault', quantity: 'stamina', amount: n.doorPrice}]};

// ---------- links are world data ----------
test('links are declared once in the world, saved with it, and changed by ordinary ops', () => {
    const world = fixture();
    assert.equal(world.links.length, LINKS.length);
    assert.deepEqual(world.links.find(l => l.id === 'p.hall.study'),
        {id: 'p.hall.study', kind: 'path', from: 'hall', to: 'study', cost: 1, state: 'open', oneWay: false});
    assert.deepEqual(restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(world)))), world);
    // A world with no links keeps the older save shape, and an older save restores with none.
    const bare = createWorld(rules, {holders: [{id: 'hall', kind: 'place'}]});
    assert.equal('links' in bare, false);
    assert.deepEqual(worldLinks(restoreWorld(rules, serializeWorld(bare))), []);

    const shut = applyWorldOps(rules, world, [{op: 'link_set', id: 'p.hall.study', state: 'closed'}], 'test:shut');
    assert.deepEqual(linkNeighbours(worldLinks(world), 'hall', {kinds: ['path']}), ['mill', 'study', 'yard']);
    assert.deepEqual(linkNeighbours(worldLinks(shut), 'hall', {kinds: ['path']}), ['mill', 'yard']);
    const cut = applyWorldOps(rules, shut, [{op: 'link_remove', id: 'p.hall.mill'},
        {op: 'link_add', link: {id: 'a.hall.road', kind: 'air', from: 'hall', to: 'road', cost: 2}}], 'test:reroute');
    assert.deepEqual(linkNeighbours(worldLinks(cut), 'hall'), ['road', 'tower', 'yard']);
    assert.throws(() => applyWorldOps(rules, world, [{op: 'link_add', link: LINKS[0]}], 'test:twice'), /exists/);
    // A link to a place that is not in the world is kept and dormant, not an error.
    const dangling = applyWorldOps(rules, world, [{op: 'link_add', link: {id: 'p.hall.annex', kind: 'path', from: 'hall', to: 'annex'}}], 'test:annex');
    assert.equal(dangling.links.length, LINKS.length + 1);
    assert.equal(worldLinks(dangling).length, LINKS.length);
});

// ---------- a ward over adjacent rooms ----------
test('a ward reaches holders within one link, stops at a closed door, and passes it at the stated price', () => {
    const world = fixture();
    const target = {shape: 'within', from: 'caster', links: 1, kinds: ['path', 'door'], present: true};

    const plain = ward(world, target);
    assert.deepEqual(warded(plain.world), ['a', 'c', 'caster'], 'hall, study and yard; the mill is one link off and empty');
    assert.deepEqual(plain.outcome.unreached, [{...doorQuote, reason: 'closed'}], 'it lands on what it can and names the door and its price');
    assert.deepEqual(plain.outcome.forced, []);
    assert.equal(plain.world.holders.caster.quantities.stamina, n.stamina);
    assert.deepEqual(resolveTargets(world, target), ['a', 'c', 'caster'], 'the plain target list is the free reach');

    const pushed = ward(world, {...target, force: true});
    assert.deepEqual(warded(pushed.world), ['a', 'b', 'c', 'caster']);
    assert.deepEqual(pushed.outcome.forced, [{...doorQuote, payer: 'caster'}]);
    assert.deepEqual(pushed.outcome.unreached, []);
    assert.equal(pushed.world.holders.caster.quantities.stamina, n.stamina - n.doorPrice);
    assert.equal(pushed.world.holders.caster.ledger.stamina['force:d.hall.vault'], -n.doorPrice, 'the ledger names the door');
    assert.equal(pushed.world.links.find(l => l.id === 'd.hall.vault').state, 'closed', 'passing a door does not open it');

    // The price is paid per act; when the payer runs short the rest still lands and the door is named.
    const again = ward(pushed.world, {...target, force: true});
    const short = ward(again.world, {...target, force: true});
    assert.equal(again.world.holders.caster.quantities.stamina, n.stamina - 2 * n.doorPrice);
    assert.deepEqual(short.outcome.unreached, [{...doorQuote, reason: 'price'}]);
    assert.equal(short.world.holders.b.quantities.ward, 2 * n.ward);
    assert.equal(short.world.holders.a.quantities.ward, 3 * n.ward);

    // Going around: two links wide, the coal chute reaches the vault with nothing forced.
    // The crypt's door states no way through, so it is reported and nothing fails.
    const wide = ward(world, {...target, links: 2, force: true});
    assert.deepEqual(warded(wide.world), ['a', 'b', 'c', 'caster', 'd']);
    assert.deepEqual(wide.outcome.forced, []);
    assert.deepEqual(wide.outcome.unreached, [{place: 'crypt', reason: 'closed', via: ['d.study.crypt']}]);
    assert.equal(wide.world.holders.caster.quantities.stamina, n.stamina);

    // Opening the door is a world op; then the same one-link ward covers the vault for nothing.
    const opened = applyWorldOps(rules, world, [{op: 'link_set', id: 'd.hall.vault', state: 'open'}], 'test:open');
    const open = ward(opened, target);
    assert.deepEqual(warded(open.world), ['a', 'b', 'c', 'caster']);
    assert.deepEqual(open.outcome.unreached, []);

    // The same-place default is untouched and reports no reach fields.
    const here = ward(world, {shape: 'present', place: 'hall'});
    assert.deepEqual(warded(here.world), ['caster']);
    assert.equal('unreached' in here.outcome, false);
});

// ---------- a network the paths do not follow ----------
test('a wire reaches a far place that paths within the same limits do not', () => {
    const world = fixture();
    const links = worldLinks(world);
    const byWire = ward(world, {shape: 'within', from: 'caster', links: 1, kinds: ['wire'], present: true});
    assert.deepEqual(warded(byWire.world), ['caster', 'd']);
    assert.deepEqual(warded(ward(world, {shape: 'within', from: 'caster', links: 1, kinds: ['path'], present: true}).world), ['a', 'c', 'caster']);
    assert.deepEqual(warded(ward(world, {shape: 'within', from: 'caster', links: 4, cost: 10, kinds: ['path'], present: true}).world),
        ['a', 'b', 'c', 'caster'], 'four links but ten of cost: the chute is six away, the tower sixteen on foot');
    assert.deepEqual(linkDistance(links, 'hall', 'tower', {kinds: ['wire']}), {place: 'tower', links: 1, cost: 1, route: ['w.hall.tower'], forced: []});
    assert.equal(linkDistance(links, 'hall', 'tower', {kinds: ['path']}).cost, 16);
    assert.deepEqual(linksWithin(links, 'hall', {kinds: ['wire']}).map(e => e.place), ['hall', 'tower']);
});

// ---------- distance by cost, for travel ----------
test('distance is the cheapest way by cost inside the limits given, in a fixed order', () => {
    const links = worldLinks(fixture());
    assert.deepEqual(linkDistance(links, 'hall', 'mill', {kinds: ['path']}),
        {place: 'mill', links: 3, cost: 10, route: ['p.hall.yard', 'p.yard.road', 'p.road.mill'], forced: []});
    assert.equal(linkDistance(links, 'hall', 'mill', {kinds: ['path'], maxLinks: 1}).cost, 30, 'fewer links, longer way');
    assert.equal(linkDistance(links, 'hall', 'mill', {kinds: ['path'], maxLinks: 1, maxCost: 20}), null);
    assert.equal(linkDistance(links, 'hall', 'mill').cost, 7, 'with every kind, the wire and the tower path are shorter');
    assert.equal(linkDistance(links, 'hall', 'mill', {weights: {wire: 20}}).cost, 10, 'a kind can be weighted by who travels');
    // One-way and closed links: the chute goes down only; the door has a price in both directions.
    assert.equal(linkDistance(links, 'yard', 'vault', {kinds: ['path']}).cost, 4);
    assert.equal(linkDistance(links, 'vault', 'yard'), null);
    assert.deepEqual(linkDistance(links, 'vault', 'yard', {closed: 'force'}),
        {place: 'yard', links: 2, cost: 1 + n.doorDrag + 2, route: ['d.hall.vault', 'p.hall.yard'], forced: ['d.hall.vault']});
    const report = reachReport(links, 'study', {maxLinks: 1});
    assert.deepEqual(report.reached.map(e => e.place), ['hall', 'study']);
    assert.deepEqual(report.unreached, [{place: 'crypt', reason: 'closed', via: ['d.study.crypt']}]);
});

// ---------- spreading along links over time ----------
test('a taint spreads along paths by link cost: one jump, minute steps and a reload agree', () => {
    const start = fixture();
    const at = clock => tainted(advanceWorld(rules, start, clock).world);
    assert.deepEqual(at(9), ['hall']);
    assert.deepEqual(at(10), ['hall', 'study']);
    assert.deepEqual(at(20), ['hall', 'study', 'yard']);
    assert.deepEqual(at(55), ['hall', 'road', 'study', 'yard']);
    assert.deepEqual(at(60), ['hall', 'road', 'study', 'vault', 'yard'], 'down the chute');

    const jump = advanceWorld(rules, start, n.end);
    assert.deepEqual(tainted(jump.world), ['hall', 'mill', 'road', 'study', 'tower', 'vault', 'yard'], 'the crypt door is not a path');
    assert.equal(jump.world.holders.mill.state['x.taint'].since, 100, 'by the road, long before the ridge way would carry it');
    assert.equal(jump.world.holders.tower.state['x.taint'].since, 160);
    let stepped = start;
    for (let t = 1; t <= n.end; t++) stepped = advanceWorld(rules, stepped, t).world;
    assert.deepEqual(stepped, jump.world);
    const half = advanceWorld(rules, start, n.reload).world;
    const reloaded = advanceWorld(rules, restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(half)))), n.end).world;
    assert.deepEqual(reloaded, jump.world);
    assert.ok(jump.segments <= 2 * n.end / n.interval, `one jump took ${jump.segments} segments`);

    // Closing a path mid-run stops the spread there, the same in a jump as in steps.
    const closeAt = 40, close = [{op: 'link_set', id: 'p.yard.road', state: 'closed'}];
    const run = step => {
        let world = start;
        for (let t = step; t <= n.end; t += step) {
            world = advanceWorld(rules, world, t).world;
            if (t === closeAt) world = applyWorldOps(rules, world, close, 'test:close');
        }
        return world;
    };
    assert.deepEqual(run(1), run(closeAt));
    // The ridge way is open but thirty long: it would carry the taint at minute 300, after this run ends.
    assert.deepEqual(tainted(run(closeAt)), ['hall', 'study', 'vault', 'yard']);
});

// ---------- the three packs read the world's links ----------
test('forage, drainage and directed motion follow world links with no routes of their own', () => {
    // Forage: a feeder on the ridge moves to the lit hill along a path, and stays when the path is closed.
    const light = 'light:star';
    const forage = composeSubstrate({packs: [createForageAttractionPack({profiles: [{light, minimum: 10, interval: 5}], maxNeighbors: 2})]});
    const forageWorld = state => createWorld(forage, {
        links: [{id: 'p.ridge.hill', kind: 'path', from: 'ridge', to: 'hill', state}, {id: 'w.ridge.lamp', kind: 'wire', from: 'ridge', to: 'lamp'}],
        holders: [{id: 'ridge', kind: 'place', quantities: {[light]: 0}}, {id: 'hill', kind: 'place', quantities: {[light]: 40}},
            {id: 'lamp', kind: 'place', quantities: {[light]: 90}},
            {id: 'feeder', kind: 'body', place: 'ridge', properties: {alive: true, forage_light: light}}]});
    assert.equal(advanceWorld(forage, forageWorld('open'), 5).world.holders.feeder.place, 'hill', 'the brighter lamp is on a wire, not a path');
    assert.equal(advanceWorld(forage, forageWorld('closed'), 5).world.holders.feeder.place, 'ridge');

    // Drainage: a pour in the washroom follows the one-way water link downhill.
    const drain = composeSubstrate({packs: [{id: 'x.pour', publishes: [K.water_poured.id]}, createResidueFlowPack()]});
    const drainWorld = createWorld(drain, {
        links: [{id: 'd.wash.field', kind: 'water', from: 'washroom', to: 'field', oneWay: true, note: 'A gravity drain.'},
            {id: 'p.wash.field', kind: 'path', from: 'washroom', to: 'other'}],
        holders: [{id: 'washroom', kind: 'place'}, {id: 'field', kind: 'place', quantities: {'residue:active': 7}},
            {id: 'other', kind: 'place', quantities: {'residue:active': 0}}]});
    const pour = place => [{op: 'publish', kind: K.water_poured.id, place, detail: {contents: {active: 30}}}];
    const poured = applyWorldOps(drain, drainWorld, pour('washroom'), 'test:pour');
    assert.equal(poured.holders.field.quantities['residue:active'], 37);
    assert.equal(poured.holders.other.quantities['residue:active'], 0);
    assert.equal(applyWorldOps(drain, drainWorld, pour('field'), 'test:pour').holders.field.quantities['residue:active'], 7, 'water does not run back up');

    // Directed motion: a body with a destination crosses an open path, and waits at a closed one.
    const mind = state => applyEngineOps(createEngineWorld({packs: ['a.mind'], holders: [{id: 'grove', kind: 'place'}, {id: 'den', kind: 'place'},
        {id: 'walker', kind: 'body', place: 'grove', properties: {mind_awake: true, agency_goal: 'den'}}]}),
    [{op: 'link_add', link: {id: 'p.grove.den', kind: 'path', from: 'grove', to: 'den', state}}], 'test:link');
    assert.equal(advanceEngineWorld(mind('open'), 1).engine.world.holders.walker.place, 'den');
    assert.equal(advanceEngineWorld(mind('closed'), 1).engine.world.holders.walker.place, 'grove');
});

// ---------- stored-working reach and worm travel ----------
test('a stored working reaches along links, and the worm travels the linked distance', () => {
    const spec = {effects: [storedEffect('add', 'heat', 'yard', storedN.distantAmount)]};
    const fire = (record, e) => fireStored({rules: e.rules, world: e.world, record, at: e.world.clock});
    const linked = state => { const e = storedEngine(); return {...e, world: applyWorldOps(e.rules, e.world,
        [{op: 'link_add', link: {id: 'p.room.yard', kind: 'path', from: 'room', to: 'yard', state}}], 'test:link')}; };
    const reach = {links: {within: 1, kinds: ['path']}, extra: storedN.reachCost};
    assert.equal(fire(storedMake(spec), linked('open')).receipt.reason, 'reach', 'a link alone grants nothing; the pattern must be made to reach');
    const far = fire(storedMake({...spec, reach}), linked('open'));
    assert.equal(far.receipt.status, 'fired');
    assert.equal(far.receipt.cost, storedN.per + storedN.reachCost);
    assert.equal(fire(storedMake({...spec, reach}), linked('closed')).receipt.reason, 'reach');
    assert.equal(fire(storedMake({...spec, reach: {...reach, links: {within: 1, kinds: ['wire']}}}), linked('open')).receipt.reason, 'reach');

    const wormRun = (travel, links) => {
        const wild = composeSubstrate({packs: [createWildAgencyPack({travel})], quantities: [SATIETY]});
        const state = {...liquorWormState('border'), beliefs: {cellar: {liquor: 1}}};
        const world = createWorld(wild, {links, holders: [{id: 'border', kind: 'place', quantities: {}},
            {id: 'cellar', kind: 'place', quantities: {liquor: 300}},
            {id: 'worm', kind: 'body', place: 'border', tags: ['a.wild.liquor_worm'], quantities: {satiety: 300}, state: {'a.wild_agency': state}}]});
        const s = advanceWorld(wild, world, 1).world.holders.worm.state['a.wild_agency'];
        return s.arriveAt - 1;
    };
    const trail = [{id: 'p.border.cellar', kind: 'path', from: 'border', to: 'cellar', cost: 25}];
    assert.equal(wormRun(null, trail), LIQUOR_WORM_ROW.travelMinutes, 'without the setting the row constant stands');
    assert.equal(wormRun({kinds: ['path']}, trail), 25);
    assert.equal(wormRun({kinds: ['path'], minutesPerCost: 2}, trail), 50);
    assert.equal(wormRun({kinds: ['path']}, []), LIQUOR_WORM_ROW.travelMinutes, 'no linked way: cross-country at the row constant');
});
