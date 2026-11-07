// OB8/OB9 (lane W9-B): authorityOver and knownness. Derived on read; an untouched save gains no key.
import test from 'node:test';
import assert from 'node:assert/strict';
import {authorityOver, knownness, registerAuthoritySource, registerKnownness} from '../src/authority.js';
import {livelihoodsOf, livelihoodLine} from '../src/livelihoods.js';
import '../src/livelihood_sources.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHeatPurse} from '../src/heat.js';
import {HABITAT, planHabitatAction} from '../src/habitat_care.js';
import {HOME_SITE} from '../src/home_content.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';

const W = 'base.frontier';
const state = facts => ({clock: 0, actors: {player: {facts}}});
const shelter = {id: 'shelter', name: 'Willow clearing shelter', access: true};
const homestead = (s, ctx) => livelihoodsOf(s, {homes: [shelter], ...ctx}).find(r => r.id === 'frontier.homestead.shelter');

test('a shelter in the wilds: no claimant, no reach, no obligation, and the line says so', () => {
    const s = state({});
    const a = authorityOver(s, {world: W, place: HOME_SITE});
    assert.deepEqual([a.claimant, a.reach, a.knows], [null, false, false]);
    assert.match(a.why, /No one claims this land/);
    const row = homestead(s);
    assert.equal(row.kind, 'homestead'); assert.equal(row.obligations.kind, 'none'); assert.equal(row.authority.known, false);
    assert.match(livelihoodLine(row), /no one claims this land/);
    // an unknown world or place has no claimant either
    assert.equal(authorityOver(s, {world: 'nowhere', place: 'x'}).claimant, null);
    assert.equal(authorityOver(s, {}).reach, false);
});

test('inside the village the village claims the ground, reaches it, and knows once it is registered or has heard of you', () => {
    const s = state({});
    const bare = authorityOver(s, {world: W, place: 'Village'});
    assert.deepEqual([bare.claimant, bare.reach, bare.knows], ['village', true, false]);
    assert.match(bare.why, /does not know of it yet/);
    const reg = authorityOver(s, {world: W, place: 'Village', registered: true});
    assert.equal(reg.knows, true);
    const plot = livelihoodsOf(state({'mg.plotRight': true})).find(r => r.id === 'frontier.village.courtyard_plot');
    assert.deepEqual(plot.authority, {known: true, who: 'Mira'});
});

test('selling at the market raises knownness; the village then knows of your wilds stead but still claims nothing', () => {
    const s = state({});
    assert.equal(knownness(s, 'village', {marketSales: 0}).level, 'unknown');
    const k = knownness(s, 'village', {marketSales: 4});
    assert.equal(k.value, 1); assert.equal(k.level, 'noticed'); assert.equal(k.signals[0].id, 'market-sales');
    assert.ok(knownness(state({'mg.plotRight': true}), 'village', {marketSales: 2}).value >= 2, 'acts add up');
    const before = homestead(s, {marketSales: 0}), after = homestead(s, {marketSales: 4});
    assert.equal(before.authority.known, false);
    assert.equal(after.authority.known, true); assert.equal(after.authority.who, null);
    assert.equal(after.obligations.kind, 'none', 'someone knowing is not someone owed');
    assert.match(livelihoodLine(after), /the village has heard of it/);
    // a stead beside the village's market (a tent pitched in it) is claimed ground: it knows once you trade
    assert.equal(authorityOver(s, {world: W, place: 'Village', ctx: {marketSales: 4}}).knows, true);
});

test('pen in the Village is claimed ground: unknown until the village hears of you', () => {
    const pen = (s, ctx) => livelihoodsOf(s, ctx).find(r => r.id === 'frontier.village.meadow_pen');
    const built = planHabitatAction(null, 'build', {clock: 100, money: 100, inventory: {}, location: HABITAT.location, world: HABITAT.world, ready: true});
    const owner = built.owner ?? built.next ?? built.habitat ?? Object.values(built).find(v => v?.site);
    assert.ok(owner?.site, 'fixture: a built pen');
    const c = {habitat: {owner, clock: 100}};
    assert.equal(pen(state({}), c)?.authority.known, false);
    const known = pen(state({}), {...c, marketSales: 3});
    assert.equal(known.authority.known, true); assert.equal(known.obligations.kind, 'none');
});

test('a registered source and reader are all it takes to add a world; a throwing source means no claim', () => {
    registerAuthoritySource('test.keep', (s, {place}) => place === 'keep' ? {claimant: 'lord', label: 'the lord', inBounds: true} : place === 'far' ? {claimant: 'lord', label: 'the lord', inBounds: false} : null);
    registerAuthoritySource('test.boom', () => { throw Error('x'); });
    registerKnownness('lord', (s, ctx) => ctx.seen ? [{id: 'smoke', weight: 1, text: 'A traveller saw smoke.'}] : []);
    assert.equal(authorityOver({}, {world: 'test.keep', place: 'keep'}).knows, false);
    assert.equal(authorityOver({}, {world: 'test.keep', place: 'keep', ctx: {seen: true}}).knows, true);
    const far = authorityOver({}, {world: 'test.keep', place: 'far', ctx: {seen: true}});
    assert.deepEqual([far.claimant, far.reach, far.knows], ['lord', false, false], 'a claim on paper without reach');
    assert.equal(authorityOver({}, {world: 'test.boom', place: 'a'}).claimant, null);
    assert.throws(() => registerAuthoritySource('', () => {}));
});

test('heat ignores an act whose authority has no reach, and counts one that does', () => {
    domainRegistry.load({}); domainRegistry.tick(1);
    configureHeatPurse({balance: () => 0, pay: () => {}});
    const record = domainRegistry.command('heat', 'recordAct');
    const heat = () => domainRegistry.project('heat').heat;
    const act = (place, id) => record({authority: 'tingen_police', known: true, weight: 2, id, at: 5, world: LOTM_IDS.world, place});
    assert.equal(act('Wild willow stand', 'a'), false, 'outside the city: the police cannot reach it');
    assert.deepEqual(heat(), []);
    assert.equal(act('Tingen docks', 'b'), true);
    assert.equal(heat().find(h => h.authority === 'tingen_police').value, 2);
    // no place named: unchanged behaviour (existing callers)
    assert.equal(record({authority: 'tingen_police', known: true, weight: 1, id: 'c'}), true);
    // the wrong authority's jurisdiction does not count either
    assert.equal(record({authority: 'landlady', known: true, id: 'd', world: W, place: 'Village'}), false);
});

test('failure scenario: reading adds no key to state, and an untouched life projects nothing', () => {
    const s = state({}); const before = JSON.stringify(s);
    livelihoodsOf(s); authorityOver(s, {world: W, place: 'Village'}); knownness(s, 'village');
    assert.equal(JSON.stringify(s), before);
    assert.deepEqual(livelihoodsOf(s), []);
    assert.deepEqual(livelihoodsOf({}), []);
});
