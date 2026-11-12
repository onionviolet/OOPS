import assert from 'node:assert/strict';
import test from 'node:test';
import {beginGuRefinement, cancelGuRefinement, observeGuRefinement, previewGuRefinementProduct,
    stepGuRefinement} from '../src/gu_refinement.js';
import {fourFlavorsRecipe, fourFlavorsWines} from '../src/gu_liquor_worm.js';
import {livingGuClaim} from '../src/gu_world_claims.js';
import {armGuDestruction, settleGuDestruction, stabilizeGuDestruction} from '../src/gu_restoration.js';
import {fixedClaimOriginal, fixedClaimRival, fixedClaimSteward, keeperFixedClaimAt, writeKeeperFixedClaim} from '../src/gu_keeper_fixed_claim.js';
import {fitGuHouse, quoteGuHouse, settleGuHouse} from '../src/gu_house_assembly.js';
import {guCatalogue} from '../src/gu_catalogue.js';

// A representative luck-path recipe for ch. 1852's refinement race. Materials,
// stages and amounts are fixture dials, independent of the chapter claim.
const recipe = {
    id: 'luck-path-procedure', revision: 1, kind: 'luck-path-gu', rank: 6, uniqueKey: 'luck-path-gu',
    stages: [
        {id: 'prepare', inputs: [{material: 'luck-material', amount: 2}]},
        {id: 'finish', inputs: [{material: 'luck-material', amount: 3}]},
    ],
};
const world = () => ({
    gu: [], attempts: [], stocks: {'first-refiner': {'luck-material': 10}, 'rival-refiner': {'luck-material': 10}},
});
const begin = (state, id, refiner, definition = recipe, precursor) =>
    beginGuRefinement(state, {id, refiner, recipe: definition, precursor});
const settle = (state, id) => stepGuRefinement(stepGuRefinement(state, id), id);
const roundTrip = state => JSON.parse(JSON.stringify(state));

test('a Gu House binds real participants and replaces a destroyed support without changing the core', () => {
    const core = {id: 'core', kind: 'travel', rank: 6, alive: true, holder: 'first-refiner'};
    const light = {id: 'light-brace', kind: 'light', rank: 6, alive: true};
    const heavy = {id: 'heavy-brace', kind: 'heavy', rank: 6, alive: true};
    const plain = {fuel: 'immortal', cost: 1};
    const blueprint = {core: 'travel', rank: 6, minutes: 15, ability: {...plain, cost: 2, effect: {kind: 'travel', magnitude: 1}},
        supports: {light: {ability: plain}, heavy: {carriesLoad: true,
            ability: {...plain, modifier: {property: 'cost', factor: 0.5}}}}};
    const assembly = fitGuHouse(blueprint, core, light, 10);
    const failed = settleGuHouse(blueprint, roundTrip(assembly), core, light, 24, true);
    assert.equal(failed.assembly.core, core.id);
    assert.equal(failed.support.fate, 'destroyed');
    assert.equal(core.alive, true);
    assert.throws(() => fitGuHouse(blueprint, core, failed.support, 25), /compatible living support/);
    const repaired = settleGuHouse(blueprint, fitGuHouse(blueprint, core, heavy, 25), core, heavy, 40);
    const request = {core, support: heavy, operator: core.holder, clock: 40, reserve: 2, loaded: true};
    assert.equal(quoteGuHouse(blueprint, repaired.assembly, request).remaining[core.holder]['green-grape'], 0);
    assert.equal(quoteGuHouse(blueprint, repaired.assembly, {...request, core: {...core, id: 'replacement'}}), null);
    assert.equal(quoteGuHouse(blueprint, repaired.assembly, {...request, core: {...core, injured: true}}), null);
});

test('Gu as Before strips a live mark and preserves the exact specimen, claim, custody and injury', () => {
    const kind = 'fixed-immortal-travel';
    const gu = {id: fixedClaimOriginal, kind, uniqueKey: kind, alive: true, rank: 6, holder: fixedClaimSteward};
    const marked = armGuDestruction({...world(), gu: [gu]}, {specimen: gu.id, now: 10, delay: 20});
    assert.throws(() => stabilizeGuDestruction(marked, {specimen: 'another-gu', now: 29}), /no longer within reach/);
    const saved = stabilizeGuDestruction(roundTrip(marked), {specimen: gu.id, now: 29});
    assert.deepEqual(livingGuClaim(settleGuDestruction(saved, 30), kind), {...gu, injured: true});
    assert.throws(() => stabilizeGuDestruction(marked, {specimen: gu.id, now: 30}), /no longer within reach/);
    assert.equal(livingGuClaim(settleGuDestruction(marked, 30), kind), undefined);
});

test('a marked claim and a rival refinement settle by due time even when the clock jumps', () => {
    const kind = 'fixed-immortal-travel';
    const gu = {id: fixedClaimOriginal, kind, uniqueKey: kind, alive: true, rank: 6, holder: fixedClaimSteward};
    const prepared = beginGuRefinement({gu: [gu], attempts: [], stocks: {[fixedClaimRival]: {'luck-material': 3}}}, {
        id: 'rival-job', refiner: fixedClaimRival,
        recipe: {...recipe, kind, uniqueKey: kind, stages: recipe.stages.slice(1)},
    });
    prepared.attempts[0].startedAt = 0;
    for (const [delay, status] of [[20, 'complete'], [30, 'complete'], [40, 'failed']]) {
        const state = {clock: 50, worlds: {'book.ri.keeper.world': {facts: {}}}};
        writeKeeperFixedClaim(state, armGuDestruction(prepared, {specimen: gu.id, now: 0, delay}));
        const outcome = keeperFixedClaimAt(state);
        assert.equal(outcome.destructionMark.endedAt, delay);
        assert.equal(outcome.attempts[0].status, status);
        assert.equal(livingGuClaim(outcome, kind)?.id, status === 'complete' ? 'rival-job' : undefined);
    }
});

test('fatal refinement protects the exact vital Gu of a living master, including a borrowed precursor', () => {
    const vital = {id: 'vital', kind: 'luck-path-gu', rank: 6, alive: true, uniqueKey: 'luck-path-gu',
        holder: 'first-refiner', vitalMaster: 'lender'};
    const initial = {...world(), gu: [vital]};
    const raise = {...recipe, id: 'raise', rank: 7, precursorKind: vital.kind,
        stages: [{id: 'temper', inputs: [], onPrecursorControlFailure: 'destroy'}]};
    const pending = begin(initial, 'raise-job', 'first-refiner', raise, vital.id);
    const failed = (world, isLivingMaster) => stepGuRefinement(roundTrip(world), 'raise-job', {controlFailed: true, isLivingMaster});
    const protectedWorld = failed(pending, id => id === 'lender');
    assert.deepEqual(livingGuClaim(protectedWorld, vital.uniqueKey), {...vital, injured: true});
    assert.deepEqual(protectedWorld.attempts[0].vitalSurvivors, [vital.id]);
    assert.equal(livingGuClaim(failed(pending, id => id === 'first-refiner'), vital.uniqueKey), undefined);
    const ordinary = roundTrip(pending);
    delete ordinary.gu[0].vitalMaster;
    assert.equal(failed(ordinary, () => true).gu[0].fate, 'destroyed');
    assert.deepEqual(stepGuRefinement(pending, 'raise-job').gu[0], {...vital, rank: 7});
});

test('only a declared fusion successor inherits the vital bond, with the exact source recorded', () => {
    const gu = {id: 'loan-light', kind: 'little-light', rank: 1, alive: true, holder: 'first-refiner', vitalMaster: 'lender'};
    const fuse = {id: 'light-fusion', revision: 1, kind: 'moonglow', rank: 2, ingredients: {light: gu.kind},
        recordLineage: true, vitalSuccessorRole: 'light', stages: [{id: 'finish', inputs: [], onControlFailure: {light: 'destroy'}}]};
    const pending = beginGuRefinement({...world(), gu: [gu]}, {id: 'finish-job', refiner: 'first-refiner',
        recipe: fuse, ingredients: {light: gu.id}});
    const failed = stepGuRefinement(pending, 'finish-job', {controlFailed: true, isLivingMaster: id => id === 'lender'});
    assert.deepEqual(failed.gu, [{...gu, injured: true}]);
    const success = stepGuRefinement(pending, 'finish-job');
    assert.equal(success.gu[0].fate, 'consumed');
    assert.equal(success.gu[0].vitalMaster, undefined);
    assert.equal(success.gu[1].vitalMaster, 'lender');
    assert.deepEqual(success.gu[1].provenance.ingredients, {light: gu.id});
});

test('a pending final stage can lend its actual product without settling the refinement', () => {
    const working = begin(world(), 'first-job', 'first-refiner');
    assert.equal(previewGuRefinementProduct(working, 'first-job'), null);
    const ready = roundTrip(stepGuRefinement(working, 'first-job'));
    const before = roundTrip(ready);
    assert.deepEqual(previewGuRefinementProduct(ready, 'first-job'), stepGuRefinement(ready, 'first-job').gu[0]);
    assert.deepEqual(ready, before);
    assert.equal(previewGuRefinementProduct(cancelGuRefinement(ready, 'first-job'), 'first-job'), null);
    ready.gu.push({id: 'rival', kind: recipe.kind, rank: recipe.rank, uniqueKey: recipe.uniqueKey, alive: true, holder: 'rival-refiner'});
    assert.equal(previewGuRefinementProduct(ready, 'first-job'), null);
});

test('Four Flavors binds two Worms and a failure during bitter wine preserves only unspent wine', () => {
    const stocks = {keeper: Object.fromEntries(fourFlavorsWines.map(row => [row.flavor, 1]))};
    const state = {gu: ['wild', 'clan'].map(id => ({id, kind: 'liquor-worm', alive: true, holder: 'keeper'})), attempts: [], stocks};
    const request = {id: 'four-flavors', refiner: 'keeper', recipe: fourFlavorsRecipe, ingredients: {first: 'wild', second: 'clan'}};
    assert.throws(() => beginGuRefinement(state, {...request, ingredients: {first: 'wild', second: 'wild'}}), /separate Gu/);
    let pending = beginGuRefinement(state, request);
    pending = stepGuRefinement(stepGuRefinement(pending, request.id), request.id);
    const failed = stepGuRefinement(roundTrip(pending), request.id, {controlFailed: true});
    assert.deepEqual(failed.stocks.keeper, {sour: 0, sweet: 0, bitter: 0, spicy: 1});
    assert.equal(failed.gu[0].injured, true);
    assert.equal(failed.gu[1].fate, 'destroyed');
    const success = stepGuRefinement(stepGuRefinement(pending, request.id), request.id);
    assert.deepEqual(success.gu.filter(gu => gu.alive).map(({kind, rank}) => [kind, rank]), [['four-flavors-liquor-worm', 2]]);
});

test('rivals can start the same Immortal Gu and settle one specimen after a pending save round trip', () => {
    const initial = world();
    let pending = begin(initial, 'first-job', 'first-refiner');
    pending = begin(pending, 'rival-job', 'rival-refiner');
    pending = stepGuRefinement(stepGuRefinement(pending, 'first-job'), 'rival-job');
    assert.equal(initial.stocks['first-refiner']['luck-material'], 10);

    const firstWins = stepGuRefinement(roundTrip(pending), 'first-job');
    firstWins.gu[0].holder = 'new-holder';
    const raced = stepGuRefinement(firstWins, 'rival-job');
    assert.deepEqual(raced.gu.map(({id, holder}) => [id, holder]), [['first-job', 'new-holder']]);
    assert.equal(raced.attempts[1].cause, 'occupied');
    assert.deepEqual(raced.stocks, {'first-refiner': {'luck-material': 5}, 'rival-refiner': {'luck-material': 5}});
    assert.throws(() => stepGuRefinement(raced, 'rival-job'), /not in progress/);

    const rivalWins = stepGuRefinement(stepGuRefinement(pending, 'rival-job'), 'first-job');
    assert.deepEqual(rivalWins.gu.map(gu => gu.id), ['rival-job']);
    const ordinaryFailure = stepGuRefinement(pending, 'rival-job', {controlFailed: true});
    assert.deepEqual(observeGuRefinement(raced, 'rival-job', 'rival-refiner'),
        observeGuRefinement(ordinaryFailure, 'rival-job', 'rival-refiner'));
    assert.equal(observeGuRefinement(raced, 'first-job', 'rival-refiner'), null);

    raced.gu[0].alive = false;
    const retry = settle(begin(roundTrip(raced), 'new-job', 'rival-refiner'), 'new-job');
    assert.deepEqual(retry.gu.filter(gu => gu.alive).map(gu => gu.id), ['new-job']);
});

test('early failure and cancellation return only unspent material, and rejection changes no stock', () => {
    const initial = world();
    const unaffordable = {...recipe, stages: [{id: 'prepare', inputs: [
        {material: 'luck-material', amount: 6}, {material: 'luck-material', amount: 5},
    ]}]};
    assert.throws(() => begin(initial, 'bad-job', 'first-refiner', unaffordable), /lacks/);
    assert.equal(initial.stocks['first-refiner']['luck-material'], 10);
    const pending = begin(initial, 'job', 'first-refiner');
    const failed = stepGuRefinement(pending, 'job', {controlFailed: true});
    assert.equal(failed.stocks['first-refiner']['luck-material'], 8);
    assert.equal(cancelGuRefinement(stepGuRefinement(pending, 'job'), 'job').stocks['first-refiner']['luck-material'], 8);
    assert.equal(cancelGuRefinement(pending, 'job').stocks['first-refiner']['luck-material'], 10);
});

test('advancement keeps the precursor identity and releases it on a failed custody check', () => {
    const definition = {...recipe, precursorKind: 'mortal-luck-gu'};
    const state = world();
    state.gu.push({id: 'precursor', kind: definition.precursorKind, rank: 5, alive: true, holder: 'first-refiner', traits: {force: 2}});
    const pending = begin(state, 'rank-job', 'first-refiner', definition, 'precursor');
    assert.throws(() => begin(pending, 'other-job', 'first-refiner', definition, 'precursor'), /already committed/);
    const advanced = settle(roundTrip(pending), 'rank-job');
    assert.deepEqual(advanced.gu, [{...state.gu[0], kind: recipe.kind, rank: 6, uniqueKey: recipe.uniqueKey}]);

    pending.gu[0].holder = 'rival-refiner';
    const interrupted = stepGuRefinement(pending, 'rank-job');
    assert.equal(interrupted.stocks['first-refiner']['luck-material'], 10);
    assert.deepEqual(interrupted.gu, pending.gu);
    const rivalJob = begin(interrupted, 'rival-rank-job', 'rival-refiner', definition, 'precursor');
    assert.equal(settle(rivalJob, 'rival-rank-job').gu[0].holder, 'rival-refiner');
});

test('advancing Fixed Immortal Travel keeps its cross-rank claim, while destruction permits a lower-rank return', () => {
    const state = world();
    const kind = 'fixed-immortal-travel';
    const rankSix = {...recipe, id: 'fixed-travel-six', kind, uniqueKey: kind};
    const rankSeven = {...rankSix, id: 'fixed-travel-seven', rank: 7, precursorKind: kind};
    state.gu.push({id: 'fixed-travel', kind, rank: 6, uniqueKey: kind, alive: true, holder: 'first-refiner'});
    assert.throws(() => begin(state, 'wrong-key', 'first-refiner', {...rankSeven, uniqueKey: 'fixed-travel-rank-seven'},
        'fixed-travel'), /preserve its unique identity/);
    let pending = begin(state, 'advance', 'first-refiner', rankSeven, 'fixed-travel');
    pending = begin(pending, 'duplicate', 'rival-refiner', rankSix);
    const advanced = settle(roundTrip(pending), 'advance');
    const blocked = settle(advanced, 'duplicate');
    assert.deepEqual(blocked.gu, [{...state.gu[0], rank: 7}]);
    assert.equal(blocked.attempts.find(job => job.id === 'duplicate').cause, 'occupied');
    blocked.gu[0].alive = false;
    const returned = settle(begin(blocked, 'return', 'rival-refiner', rankSix), 'return');
    assert.deepEqual(returned.gu.filter(gu => gu.alive).map(({id, rank}) => [id, rank]), [['return', 6]]);
});

test('a failed advancement can destroy the actual precursor and release the claim before a rival settles', () => {
    const state = world();
    state.gu.push({id: 'original', kind: recipe.kind, rank: 6, uniqueKey: recipe.uniqueKey,
        alive: true, holder: 'first-refiner'});
    const advancement = {...recipe, id: 'advance-luck', rank: 7, precursorKind: recipe.kind,
        stages: [{...recipe.stages[0], onPrecursorControlFailure: 'destroy'}]};
    let pending = begin(state, 'advance', 'first-refiner', advancement, 'original');
    pending = begin(pending, 'rival-job', 'rival-refiner');
    const broken = stepGuRefinement(roundTrip(pending), 'advance', {controlFailed: true});
    const settled = settle(broken, 'rival-job');
    assert.equal(settled.gu[0].fate, 'destroyed');
    assert.deepEqual(settled.gu.filter(gu => gu.alive).map(({id, rank}) => [id, rank]), [['rival-job', 6]]);
});

test('fusion binds actual Gu across stages, checks custody again, and applies losses only to their bound roles', () => {
    const state = world();
    state.gu = ['moonlight', 'little-light', 'little-light'].map((kind, index) => ({
        id: index + 1, kind, alive: true, holder: 'first-refiner',
    }));
    const definition = {
        id: 'moonglow-fusion', revision: 1, kind: 'moonglow', rank: 2,
        ingredients: {core: 'moonlight', near: 'little-light', far: 'little-light'},
        stages: [
            {id: 'prepare', inputs: []},
            {id: 'fuse', inputs: [], onControlFailure: {core: 'injure', near: 'injure', far: 'destroy'}},
        ],
    };
    const request = {id: 'fusion', refiner: 'first-refiner', recipe: definition,
        ingredients: {core: 1, near: 2, far: 3}, productId: 4};
    const pending = beginGuRefinement(state, request);
    assert.throws(() => beginGuRefinement(pending, {...request, id: 'other-fusion', productId: 5}), /already committed/);
    assert.throws(() => beginGuRefinement(state, {...request, ingredients: {core: 1, near: 2, far: 2}}), /separate Gu/);
    const prepared = stepGuRefinement(roundTrip(pending), 'fusion');
    const failed = stepGuRefinement(prepared, 'fusion', {controlFailed: true});
    assert.deepEqual(failed.gu.map(gu => [gu.id, gu.alive, gu.injured ?? false, gu.fate]), [
        [1, true, true, undefined], [2, true, true, undefined], [3, false, false, 'destroyed'],
    ]);
    prepared.gu[2].holder = 'rival-refiner';
    const unavailable = stepGuRefinement(prepared, 'fusion', {controlFailed: true});
    assert.equal(unavailable.attempts[0].cause, 'ingredient-unavailable');
    assert.deepEqual(unavailable.gu, prepared.gu);
});

test('the same Fish Scale cannot be bound to both armor and concealment', () => {
    const armor = guCatalogue['scale-armor'].recipe.value;
    const cloak = guCatalogue['stealth-scales'].recipe.value;
    const state = {gu: [{id: 'fish', kind: 'fish-scale', rank: 1, alive: true, holder: 'player'},
        {id: 'rock', kind: 'stealth-rock', rank: 1, alive: true, holder: 'player'}],
    attempts: [], stocks: {player: {'shell-laminate': 1}}};
    const first = beginGuRefinement(state, {id: 'cloak-job', refiner: 'player', recipe: cloak,
        ingredients: {rock: 'rock', scales: 'fish'}});
    const request = {id: 'armor-job', refiner: 'player', recipe: armor, ingredients: {scales: 'fish'}};
    assert.throws(() => beginGuRefinement(first, request), /already committed/);
    const afterCancel = cancelGuRefinement(first, 'cloak-job');
    const prepared = stepGuRefinement(beginGuRefinement(afterCancel, request), 'armor-job');
    const finished = stepGuRefinement(prepared, 'armor-job');
    assert.equal(finished.gu.find(gu => gu.id === 'rock').alive, true);
    assert.equal(finished.gu.find(gu => gu.id === 'fish').fate, 'consumed');
    assert.equal(finished.gu.find(gu => gu.id === 'armor-job').provenance.ingredients.scales, 'fish');
});
