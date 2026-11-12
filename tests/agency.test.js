import test from 'node:test';
import assert from 'node:assert/strict';
import {actorQuote, bandOf, chooseWorking, defineAgent, recordChoice, CHOICE_RING} from '../src/agency.js';
import {householdCandidates, householdCook, householdLaw, householdMethods, householdNeeds, householdReader, ROUTINE_NEED} from '../src/agency_household.js';
import {createWildAgencyPack, liquorWormState, LIQUOR_WORM_ROW} from '../src/agency_wild.js';
import {composeSubstrate, createWorld, advanceWorld, applyWorldOps} from '../src/world_substrate.js';
import {defineGrammar, fitGrammar, generate} from '../src/procedural_grammar.js';
import {address} from '../src/gen_kit.js';

const house = (over = {}) => ({cook: {coin: 20}, pantry: {raw: 2, cooked: 0}, stall: {raw: 6, price: 3}, house: {integrity: 100, wetness: 0}, ...over});
const decideCook = (belief, at = 0) => chooseWorking({agent: householdCook, needs: householdNeeds(belief), candidates: householdCandidates(),
    at, knows: householdReader(belief)});

// AGC3: the player's quote and the NPC's quote are one function.
test('the cook weighs the same quote the player is shown for the same knowledge', () => {
    const s = house({pantry: {raw: 0, cooked: 0}});
    const bindings = {cook: {kind: 'person', id: 'cook'}, stall: {kind: 'store', id: 'stall'}};
    const player = actorQuote(householdLaw, householdMethods.buy, {id: 'a.household.cook/buy/0', bindings, at: 0, knows: householdReader(s)});
    const choice = decideCook(s);
    assert.equal(choice.choice, 'buy');
    assert.deepEqual(choice.quote, player, 'the quote the cook weighed is the quote the player is shown');
    assert.equal(player.effects[0].amount, -6);
});

test('default wants reproduce the manor routine rule', () => {
    for (const cooked of [0, 1, 2, 5]) for (const integrity of [60, 100]) for (const wetness of [0, 20]) {
        const s = house({pantry: {raw: 3, cooked}, house: {integrity, wetness}});
        const c = decideCook(s);
        for (const task of ['cook', 'repair', 'dry']) {
            const row = c.scored.find(r => r.id === task);
            assert.equal(row.ok && row.score > 0, ROUTINE_NEED[task](s), `${task} at cooked ${cooked}, integrity ${integrity}, wetness ${wetness}`);
        }
        if (ROUTINE_NEED.cook(s)) assert.equal(c.choice, 'cook', 'feeding the house comes first, as in the manor routine');
    }
});

// OS1 done check: a changed scarcity changes the choice, through the quote.
test('scarcity the cook believes changes the choice; truth it has not seen does not', () => {
    const stocked = house();
    assert.equal(decideCook(stocked).choice, 'cook');
    const empty = house({pantry: {raw: 0, cooked: 0}});
    const buy = decideCook(empty);
    assert.equal(buy.choice, 'buy');
    assert.match(buy.cause.line, /^The cook goes to buy meat: only 0 cooked portions are left/);
    assert.equal(buy.passed.find(p => p.id === 'cook').reason, 'There is no raw meat in the pantry.');
    // The price the cook has heard rises past the purse: buying drops out with its reason.
    const dear = house({pantry: {raw: 0, cooked: 0}, stall: {raw: 6, price: 15}});
    const passed = decideCook(dear);
    assert.notEqual(passed.choice, 'buy');
    assert.equal(passed.passed.find(p => p.id === 'buy').reason, 'Meat at 15 a portion is more than the purse holds.');
    // A dear but affordable price still costs: thrift lowers the score by a labelled term.
    const pricey = decideCook(house({pantry: {raw: 0, cooked: 0}, stall: {raw: 6, price: 9}}));
    const row = pricey.scored.find(r => r.id === 'buy');
    assert.ok(row.terms.some(t => t.want === 'cost' && t.value < 0));
    // The stall sold out but the cook has not heard: the choice holds, and the
    // same working settled against the truth would stop with the reason.
    const truth = house({pantry: {raw: 0, cooked: 0}, stall: {raw: 0, price: 3}});
    assert.equal(decideCook(empty).choice, 'buy', 'the cook acts on what it has heard');
    const settled = actorQuote(householdLaw, householdMethods.buy, {id: 'x', bindings: {cook: {kind: 'person', id: 'cook'}, stall: {kind: 'store', id: 'stall'}},
        at: 0, knows: householdReader(truth)});
    assert.equal(settled.ok, false);
    assert.equal(settled.reason, 'The stall has no meat to sell.');
});

test('a priority-only agent keeps authored order, and ties keep candidate order', () => {
    const agent = defineAgent({id: 'a.test.clerk', revision: 0, label: 'The clerk', wants: {work: {weight: 0}}});
    const cands = householdCandidates().map((c, i) => ({...c, serves: () => ({}), bias: [0.1, 0.5, 0.5, 0.2, 0][i]}));
    const c = chooseWorking({agent, needs: {}, candidates: cands, at: 3, knows: householdReader(house({pantry: {raw: 0, cooked: 0}}))});
    assert.equal(c.choice, 'buy');
    assert.equal(c.cause.terms[0].want, 'habit');
});

test('latitude draws among near-best options at a keyed address and replays', () => {
    const agent = defineAgent({...householdCook, id: 'a.test.reckless', latitude: 1});
    const run = at => chooseWorking({agent, needs: householdNeeds(house()), candidates: householdCandidates(), at, knows: householdReader(house()), root: 'seed'}).choice;
    const picks = Array.from({length: 40}, (_, i) => run(i));
    assert.deepEqual(picks, Array.from({length: 40}, (_, i) => run(i)));
    assert.ok(new Set(picks).size > 1);
});

test('the choice ring is bounded per holder', () => {
    let ring = [];
    for (let i = 0; i < 20; i++) ring = recordChoice(ring, {at: i, choice: 'rest', cause: {line: 'x'}});
    assert.equal(ring.length, CHOICE_RING);
    assert.equal(ring[0].at, 20 - CHOICE_RING);
});

// ---------- the wild worm on the world substrate ----------

const P = {home: 'border', cellar: 'cellar', grove: 'grove'};
function wormWorld({liquor = 300, satiety = 400, detail = 'far', believe = {cellar: 1}, grove = 0, invent = null} = {}) {
    const rules = composeSubstrate({packs: [createWildAgencyPack({invent})]});
    const state = liquorWormState(P.home);
    state.beliefs = Object.fromEntries(Object.entries(believe).map(([k, v]) => [k, {liquor: v}]));
    const world = createWorld(rules, {holders: [
        {id: P.home, kind: 'place', detail, quantities: {}},
        {id: P.cellar, kind: 'place', detail, quantities: {liquor}},
        {id: P.grove, kind: 'place', detail, quantities: {liquor: grove}},
        {id: 'worm', kind: 'body', place: P.home, tags: ['a.wild.liquor_worm'], quantities: {satiety}, state: {'a.wild_agency': state}},
    ]});
    return {rules, world};
}
const wormState = w => w.holders.worm.state['a.wild_agency'];
const strip = w => JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(w.holders).map(([k, h]) => [k, {...h, detail: undefined}]))));

test('the worm goes for wine it knows of when hungry, drinks to full and comes home', () => {
    const {rules, world} = wormWorld({satiety: 300});
    const r = advanceWorld(rules, world, 600).world;
    const ring = wormState(r).ring;
    assert.equal(ring[0].chose, 'drink:cellar');
    assert.match(ring[0].cause, /^The Liquor Worm goes to drink at the cellar: it is hungry for wine/);
    assert.equal(ring[1].chose, 'home');
    assert.equal(r.holders.worm.place, P.home);
    assert.ok(r.holders.cellar.quantities.liquor < 300, 'it drank real wine');
});

test('scarcity: a cellar the worm knows is dry keeps it home; one it wrongly believes stocked draws it out to find out', () => {
    const known = advanceWorld(...Object.values(wormWorld({satiety: 300, liquor: 0, believe: {cellar: 0}})), 600).world;
    assert.equal(known.holders.worm.place, P.home);
    assert.equal(wormState(known).ring.length, 0);
    const wrong = advanceWorld(...Object.values(wormWorld({satiety: 300, liquor: 0, believe: {cellar: 1}})), 600).world;
    const ring = wormState(wrong).ring;
    assert.equal(ring[0].chose, 'drink:cellar', 'belief, not truth, drives the choice');
    assert.equal(wormState(wrong).beliefs.cellar.liquor, 0, 'seeing the dry cellar corrects the belief');
    assert.equal(ring[1].chose, 'home');
    assert.match(ring[1].cause, /no wine at the cellar/i);
});

test('people at the cellar send a drinking worm home: fear outweighs hunger', () => {
    const {rules, world} = wormWorld({satiety: 100, liquor: 5000});
    let w = advanceWorld(rules, world, 70).world;
    assert.equal(w.holders.worm.place, P.cellar);
    w = applyWorldOps(rules, w, [{op: 'holder_add', value: {id: 'keeper', kind: 'body', place: P.cellar, tags: ['person'], quantities: {}}}], 'test');
    w = advanceWorld(rules, w, 80).world;
    const last = wormState(w).ring.at(-1);
    assert.equal(last.chose, 'home');
    assert.match(last.cause, /people are close/);
});

test('coarse choice away: far settles the same day in far fewer segments', () => {
    const near = wormWorld({satiety: 300, detail: 'near'}), far = wormWorld({satiety: 300});
    const a = advanceWorld(near.rules, near.world, 3 * 1440), b = advanceWorld(far.rules, far.world, 3 * 1440);
    assert.deepEqual(strip(b.world), strip(a.world));
    assert.deepEqual(b.world.chain, a.world.chain);
    assert.ok(b.segments * 20 < a.segments, `far ${b.segments} vs near ${a.segments}`);
    // Any partition of the far run gives the same world.
    let w = far.world;
    for (const t of [17, 333, 1000, 1441, 2500, 3 * 1440]) w = advanceWorld(far.rules, w, t).world;
    assert.deepEqual(strip(w), strip(b.world));
});

// NV4: invent under pressure, through P's grammar, kept only if the same quote runs it.
const habits = defineGrammar({id: 'a.test.worm_habits', revision: 1,
    slots: [{id: 'verb', type: 'one', values: ['nose', 'dig']}, {id: 'site', type: 'one', values: 'corpus'}],
    rules: [], fallback: {id: 'fallback', parts: {verb: 'nose', site: 'grove'}}});
const fitted = fitGrammar(habits, [{id: 'a', parts: {verb: 'nose', site: 'grove'}}, {id: 'b', parts: {verb: 'dig', site: 'grove'}}]);
const invent = ({actor, at, cause, here, known}) => {
    const g = generate(fitted, {root: 'world-seed', address: address('agency.invent', actor, at), cause,
        validate: v => v.parts.site !== here && !known.includes(v.parts.site)});
    return {id: `${g.value.parts.verb}:${g.value.parts.site}`, verb: g.value.parts.verb, site: g.value.parts.site, cause: g.value.cause};
};

test('NV4: a hungry worm with no known wine invents a search, finds wine, and keeps the routine', () => {
    const run = () => advanceWorld(...Object.values(wormWorld({satiety: 300, liquor: 0, believe: {cellar: 0}, grove: 500, invent})), 1440).world;
    const w = run();
    const s = wormState(w);
    assert.equal(s.repertoire.length, 1);
    assert.equal(s.repertoire[0].cause.kind, 'pressure');
    assert.equal(s.ring[0].invented, s.repertoire[0].id);
    assert.equal(s.beliefs.grove.liquor, 1, 'searching the grove taught it there is wine');
    assert.ok(s.ring.some(r => r.chose === 'drink:grove'));
    assert.ok(w.holders.grove.quantities.liquor < 500);
    assert.deepEqual(strip(run()), strip(w), 'the same seed invents the same routine');
});

test('NV4 stays shut when an existing working already serves the want', () => {
    let calls = 0;
    const counting = args => { calls++; return invent(args); };
    advanceWorld(...Object.values(wormWorld({satiety: 300, invent: counting})), 600);
    assert.equal(calls, 0);
});

test('two actors sharing one profile are keyed apart', () => {
    const s = house();
    const one = chooseWorking({agent: householdCook, actor: 'cook.ada', needs: householdNeeds(s), candidates: householdCandidates(), at: 5, knows: householdReader(s)});
    const two = chooseWorking({agent: householdCook, actor: 'cook.bram', needs: householdNeeds(s), candidates: householdCandidates(), at: 5, knows: householdReader(s)});
    assert.equal(one.actor, 'cook.ada');
    assert.equal(two.actor, 'cook.bram');
    const seen = [];
    const spy = args => { seen.push(args.actor); return null; };
    const rules = composeSubstrate({packs: [createWildAgencyPack({invent: spy})]});
    const worm = id => ({id, kind: 'body', place: P.home, tags: ['a.wild.liquor_worm'], quantities: {satiety: 300}, state: {'a.wild_agency': liquorWormState(P.home)}});
    const w = createWorld(rules, {holders: [{id: P.home, kind: 'place', quantities: {}}, {id: P.cellar, kind: 'place', quantities: {liquor: 0}}, worm('worm.a'), worm('worm.b')]});
    advanceWorld(rules, w, 3);
    assert.ok(seen.includes('worm.a') && seen.includes('worm.b'), 'invention is asked per worm, keyed by holder');
});

const parity = (make, until, outside = []) => {
    const run = (detail, cuts) => {
        let {rules, world} = make(detail);
        for (const t of cuts) {
            for (const [at, ops] of outside) if (at === t) world = applyWorldOps(rules, world, ops, 'test');
            world = advanceWorld(rules, world, t).world;
        }
        return world;
    };
    const stops = [...new Set([...outside.map(([at]) => at), until])].sort((a, b) => a - b);
    const near = run('near', stops), far = run('far', stops), cut = run('far', [...new Set([...stops, 13, 211, 777])].filter(t => t <= until).sort((a, b) => a - b));
    assert.deepEqual(strip(far), strip(near));
    assert.deepEqual(far.chain, near.chain);
    assert.deepEqual(strip(cut), strip(far));
};

test('parity holds for invention and for an outside arrival mid-run', () => {
    parity(detail => wormWorld({detail, satiety: 300, liquor: 0, believe: {cellar: 0}, grove: 500, invent}), 1440);
    const keeper = [[70, [{op: 'holder_add', value: {id: 'keeper', kind: 'body', place: P.cellar, tags: ['person'], quantities: {}}}]],
        [200, [{op: 'holder_remove', holder: 'keeper'}]]];
    parity(detail => wormWorld({detail, satiety: 100, liquor: 5000}), 1440, keeper);
});

test('bands', () => {
    assert.equal(bandOf(359, [360, 1440]), 0);
    assert.equal(bandOf(360, [360, 1440]), 1);
    assert.equal(bandOf(1440, [360, 1440]), 2);
    assert.equal(LIQUOR_WORM_ROW.mealMinutes, 1440);
});
