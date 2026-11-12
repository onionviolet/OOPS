import test from 'node:test';
import assert from 'node:assert/strict';
import {createMarketPack, MARKET_PACK, shelfQuote, shelfState, stockOf} from '../src/market_substrate.js';
import {groupsOf, registerGroupSource, saveOrganizations} from '../src/organizations.js';
import {defineGrammar, fitGrammar} from '../src/procedural_grammar.js';
import {freezeSociety, proposeSociety, thawSociety} from '../src/procedural_societies.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, readQuantity} from '../src/world_substrate.js';

// Authored original-world fixture dials and profiles. The fit supplies draw
// weights for these profiles, with no source corpus or canon calibration.
const profiles = [
    {id: 'reserve', parts: {doctrine: 'keep a common reserve', role: 'storekeeper', rank: 'steward'}},
    {id: 'purchase', parts: {doctrine: 'pool purchases', role: 'buyer', rank: 'delegate'}},
];
const spec = {
    id: 'fixture.frontier.bread-society', revision: 1,
    slots: [
        {id: 'doctrine', type: 'one', values: 'corpus'},
        {id: 'role', type: 'one', values: 'corpus', given: 'doctrine'},
        {id: 'rank', type: 'one', values: 'corpus', given: 'role'},
    ],
    fallback: profiles[0],
    budget: {maxDraws: 3},
};
const grammar = fitGrammar(defineGrammar(spec), profiles);
const row = {
    id: 'bread-shortage', world: 'fixture.original.frontier', place: 'village', shelf: 'bakery', grammar,
    shortage: {units: 4, reason: 'A common supply can cover a missed evening ration.'},
    founder: {tag: 'baker', coin: 8, reason: 'A local baker needs eight coins to pay for the first delivery.'},
    rival: {id: 'grain-dealers', reason: 'The dealers oppose a common order that bypasses their stalls.'},
};
const authoredGroup = Object.freeze({
    id: row.rival.id, world: row.world, kind: 'guild', status: 'active', revision: 1,
    authored: true, name: 'Grain Dealers', charter: Object.freeze({admission: 'invite'}),
});
registerGroupSource(row.world, () => [authoredGroup]);

const bread = stockOf('bread');
const market = createMarketPack({goods: ['bread']});
const substrate = composeSubstrate({packs: [market]});
function fixture({coin = 8, breadHeld = 2, founderPlace = 'village', founderTags = ['person', 'baker']} = {}) {
    return createWorld(substrate, {holders: [
        {id: 'village', kind: 'place'},
        {id: 'crossing', kind: 'place'},
        {id: 'bakery', kind: 'thing', place: 'village', tags: ['market.shelf'], quantities: {[bread]: 8},
            state: {[MARKET_PACK]: shelfState({good: 'bread', base: 4, wantPerDay: 4, par: 8})}},
        {id: 'baker', kind: 'body', place: founderPlace, tags: founderTags,
            quantities: {[bread]: breadHeld, ...(coin === null ? {} : {coin})}},
    ]});
}
const afterSupper = world => advanceWorld(substrate, world, 1080).world;
const propose = (world, options) => proposeSociety(row, {root: 'bread-fixture', world, founder: 'baker', ...options});

test('PG2 reads actual local demand and uses P to draw a repeatable doctrine and post proposal', () => {
    const start = fixture();
    assert.equal(propose(start).reason, 'missing-cause');
    const world = afterSupper(start);
    const quote = shelfQuote(world, row.shelf);
    assert.equal(quote.stock, 4, 'the market law consumed four units at supper');
    const groups = groupsOf({}, {world: row.world});
    const before = structuredClone({world, groups});
    const result = propose(world, {groups});
    assert.equal(result.eligible, true);
    assert.deepEqual(propose(afterSupper(fixture()), {groups}), result);
    const {proposal, receipt} = result;
    assert.equal(proposal.address, receipt.address);
    assert.equal(proposal.grammar, grammar.ref);
    assert.deepEqual(proposal.cause, receipt.cause);
    assert.equal(proposal.cause.kind, 'pressure');
    assert.equal(proposal.cause.shelf, row.shelf);
    assert.equal(proposal.cause.at, world.clock);
    assert.equal(proposal.cause.stock, quote.stock);
    assert.equal(proposal.cause.par, quote.par);
    assert.equal(proposal.cause.reason, row.shortage.reason);
    assert.ok(profiles.some(({parts}) => Object.keys(parts).every(key => parts[key] === proposal.parts[key])));
    assert.equal(receipt.attempts, 1);
    assert.equal(receipt.draws, 3);
    assert.equal(receipt.fallbackUsed, false);
    assert.equal(new Set(Array.from({length: 16}, (_, root) => propose(world, {root}).proposal.parts.doctrine)).size, 2);
    assert.deepEqual(proposal.context, {
        world: row.world, place: row.place, founder: 'baker',
        holdings: [{holder: 'baker', quantity: bread}],
        rivals: [{group: authoredGroup.id, reason: row.rival.reason}],
    });
    assert.equal(readQuantity(world, 'baker', bread), 2);
    assert.equal(readQuantity(world, 'baker', 'coin'), 8);
    assert.deepEqual(world, before.world);
    assert.deepEqual(groupsOf({}, {world: row.world}), before.groups);
    assert.equal(saveOrganizations(), undefined);
});

test('PG2 refuses absent pressure, place, people or actual means and omits unsupported references', () => {
    const world = afterSupper(fixture());
    assert.equal(proposeSociety({...row, shelf: 'absent'}, {world}).reason, 'missing-cause');
    assert.equal(proposeSociety({...row, place: 'absent'}, {world}).reason, 'missing-place');
    assert.equal(propose(world, {founder: 'absent'}).reason, 'missing-founder');
    assert.equal(propose(afterSupper(fixture({founderPlace: 'crossing'}))).reason, 'ineligible-founder');
    assert.equal(propose(afterSupper(fixture({founderTags: ['person']}))).reason, 'ineligible-founder');
    for (const coin of [null, 7]) {
        const short = afterSupper(fixture({coin}));
        assert.equal(readQuantity(short, 'baker', 'coin'), coin);
        assert.deepEqual(propose(short), {eligible: false, reason: 'missing-means', why: row.founder.reason});
    }
    const {proposal} = propose(afterSupper(fixture({breadHeld: 0})), {groups: [{...authoredGroup, world: 'elsewhere'}]});
    assert.deepEqual(proposal.context.holdings, []);
    assert.deepEqual(proposal.context.rivals, []);
});

test('PG2 freezes the draw address, cause, original version and reference bindings by value', () => {
    const world = afterSupper(fixture());
    const {proposal} = propose(world, {groups: groupsOf({}, {world: row.world})});
    const frozen = JSON.parse(JSON.stringify(freezeSociety(proposal)));
    const newer = fitGrammar(defineGrammar({...spec, revision: 2}), profiles);
    const restocked = applyWorldOps(substrate, world, [{op: 'set', holder: row.shelf, quantity: bread, amount: 8}], 'delivery');
    assert.equal(propose(restocked).reason, 'missing-cause');
    const restored = thawSociety(frozen, {[newer.ref]: newer});
    assert.equal(restored.receipt.pinnedLoaded, false);
    assert.deepEqual(restored.proposal, proposal);
    assert.equal(thawSociety(frozen, {[grammar.ref]: grammar}).receipt.stillValid, true);
    restored.proposal.cause.stock = 0;
    restored.proposal.context.holdings.length = 0;
    assert.deepEqual(thawSociety(frozen).proposal, proposal);
});
