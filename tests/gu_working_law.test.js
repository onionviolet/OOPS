import test from 'node:test';
import assert from 'node:assert/strict';
import {beginWorking, quoteWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {asBoundGu, guAbility, guMethods, guMoveMethod, guRef, guRunnableCoverage, guWorkingLaw as law} from '../src/gu_working_law.js';
import {resolveGuActivation} from '../src/gu_activation.js';
import {searchGuMoves} from '../src/gu_move_search.js';

const operator = {kind: 'operator', id: 'keeper'};
const fed = (id, kind, rank = 1, extra = {}) => ({id, kind, rank, fedThrough: 1e9, alive: true, holder: 'keeper', ...extra});
// The host reader: operators stand for themselves, Gu are read from the host's records (KW3).
const portsFor = specimens => ({read: ref => ref.kind === 'operator' ? ref
    : specimens[ref.id] ? asBoundGu(specimens[ref.id]) : null});
const reserves = amounts => ({reserves: {keeper: amounts}});

test('every executable binding and every derivable parts row runs as a kernel working from data', () => {
    const {rows, runnable, total} = guRunnableCoverage();
    assert.equal(total, Object.keys(guCatalogue).length);
    assert.ok(runnable >= 46, `runnable ${runnable}`);
    for (const row of rows) {
        if (!row.methods.length) assert.ok(row.gap, `${row.kind} names why it cannot run`);
        for (const method of Object.values(guMethods(row.kind))) {
            assert.equal(method.law, law.ref);
            assert.ok(method.steps.every(step => law.operations[step.op]));
        }
    }
    // Derived abilities stay labelled, and kinds whose rank the chapters leave open get no derived default.
    for (const row of rows.filter(entry => entry.derived)) assert.equal(guAbility(row.kind).derived, true);
    for (const kind of ['moon-scar', 'stone-scar', 'yaksha-octopus-king-wild-immortal']) {
        assert.equal(rows.find(row => row.kind === kind).derived, false, kind);
    }
});

test('every runnable ability quotes through the kernel with enough of its own fuel', () => {
    for (const {kind} of guRunnableCoverage().rows.filter(row => row.methods.includes('activate'))) {
        const ability = guAbility(kind);
        const rank = guCatalogue[kind].parts.value.rank[0] ?? 1;
        const quote = quoteWorking(law, guMethods(kind).activate, {id: `q.${kind}`, at: 0,
            bindings: {gu: guRef('g'), operator}, facts: reserves({[ability.fuel]: 100}),
            ports: portsFor({g: fed('g', kind, rank)})});
        assert.equal(quote.ok, true, `${kind}: ${quote.reason}`);
    }
});

test('a canon ability settles the same in one jump or step by step, and survives a reload', () => {
    const ports = portsFor({m: fed('m', 'moonglow', 2)});
    const bindings = {gu: guRef('m'), operator};
    const quote = quoteWorking(law, guMethods('moonglow').activate, {id: 'w1', bindings, facts: reserves({primeval: 10}), at: 5, ports});
    assert.equal(quote.ok, true);
    assert.equal(quote.facts.reserves.keeper.primeval, 10 - guCatalogue.moonglow.ability.value.cost);
    const record = restoreWorking(law, serializeWorking(beginWorking(law, guMethods('moonglow').activate,
        {id: 'w1', bindings, facts: reserves({primeval: 10}), at: 5})));
    const {record: done, effects} = settleWorking(law, record, {now: 5, ports});
    assert.equal(done.status, 'complete');
    assert.deepEqual(effects.map(row => row.effect.kind), quote.effects.map(effect => effect.kind));
    const hungry = quoteWorking(law, guMethods('moonglow').activate, {id: 'w2', bindings, facts: reserves({primeval: 10}), at: 5,
        ports: portsFor({m: fed('m', 'moonglow', 2, {fedThrough: 1})})});
    assert.deepEqual([hungry.ok, hungry.reason], [false, 'needs feeding']);
});

test('the Little Light Moonblade move runs as a composed working with the support carried between steps', () => {
    const move = guCatalogue.moonlight.move.value;
    const specimens = {light: fed('light', 'little-light'), blade: fed('blade', 'moonlight')};
    const bindings = {operator, light: guRef('light'), blade: guRef('blade')};
    const quote = quoteWorking(law, guMoveMethod(move), {id: 'move', bindings, facts: reserves({primeval: 10}), at: 0,
        ports: portsFor(specimens)});
    assert.equal(quote.ok, true, quote.reason);
    const whole = resolveGuActivation({stages: move.roles.map(role => ({gu: specimens[role.id], operator: 'keeper',
        ability: guCatalogue[role.kind].ability.value})), reserves: {keeper: {primeval: 10}}, day: 0});
    const shape = rows => rows.map(({kind, magnitude, range}) => ({kind, magnitude, range}));
    assert.deepEqual(shape(quote.effects), shape(whole.effects));
    assert.equal(quote.facts.reserves.keeper.primeval, whole.remaining.keeper.primeval);
});

test('Red Fire with all three supports as a composed working matches the move search for that set', () => {
    const roles = [{id: 'source', kind: 'fire-source'}, {id: 'dup', kind: 'duplicate'}, {id: 'big', kind: 'enlarge'},
        {id: 'core', kind: 'red-fire'}];
    const specimens = Object.fromEntries(roles.map(role => [role.id, fed(role.id, role.kind)]));
    const bindings = {operator, ...Object.fromEntries(roles.map(role => [role.id, guRef(role.id)]))};
    const quote = quoteWorking(law, guMoveMethod({id: 'red-fire-full', roles}), {id: 'fire', bindings,
        facts: reserves({primeval: 10}), at: 0, ports: portsFor(specimens)});
    assert.equal(quote.ok, true, quote.reason);
    const available = roles.map(role => ({gu: specimens[role.id], operator: 'keeper', ability: guCatalogue[role.kind].ability.value}));
    const {options} = searchGuMoves({available, reserves: {keeper: {primeval: 10}}, day: 0, effect: 'flame', maxSupports: 3});
    const best = options.find(row => row.supports.length === 3);
    const flame = quote.effects.find(effect => effect.kind === 'flame');
    assert.deepEqual([flame.count, flame.magnitude], [best.effects[0].count, best.effects[0].magnitude]);
    assert.equal(quote.facts.reserves.keeper.primeval, best.remaining.keeper.primeval);
});

test('Four Flavors refines through the kernel from its recipe row, the same under any partition', () => {
    const method = structuredClone(guMethods('four-flavors-liquor-worm').refine);
    method.steps[0].options.ingredients = {first: 'w1', second: 'w2'};
    const world = {gu: [fed('w1', 'liquor-worm'), fed('w2', 'liquor-worm')], attempts: [],
        stocks: {keeper: {sour: 1, sweet: 1, bitter: 1, spicy: 1}}};
    const record = beginWorking(law, method, {id: 'four', bindings: {refiner: operator}, facts: {world}, at: 0});
    const once = settleWorking(law, record, {now: 1e4});
    let stepped = record;
    for (const now of [0, 7, 20, 41, 60, 1e4]) stepped = settleWorking(law, stepped, {now}).record;
    assert.deepEqual(stepped, once.record);
    assert.equal(once.record.status, 'complete');
    assert.deepEqual(once.effects.at(-1).effect, {kind: 'gu-emerged', gu: 'four.0.product', guKind: 'four-flavors-liquor-worm'});
    const short = beginWorking(law, method, {id: 'four', bindings: {refiner: operator},
        facts: {world: {...world, stocks: {keeper: {sour: 1}}}}, at: 0});
    assert.equal(settleWorking(law, short, {now: 1e4}).record.status, 'interrupted');
});

test('conversion, growth and treatment rows run with their catalogue numbers', () => {
    const row = guCatalogue['liquor-worm'].conversion.value;
    const convert = quoteWorking(law, guMethods('liquor-worm').convert, {id: 'c', at: 0,
        bindings: {converter: guRef('w'), operator}, facts: reserves({'primeval.r1.initial': row.cost}),
        ports: portsFor({w: fed('w', 'liquor-worm')})});
    assert.equal(convert.ok, true, convert.reason);
    assert.deepEqual(convert.facts.reserves.keeper, {'primeval.r1.initial': 0, [`primeval.r1.${row.stage}`]: row.yield});
    const grass = guCatalogue['vitality-grass'].growth.value;
    const grow = quoteWorking(law, guMethods('vitality-grass').grow, {id: 'g', at: 0,
        bindings: {producer: guRef('p'), operator}, facts: {water: grass.waterCost, ...reserves({'primeval.r2.initial': grass.essenceCost})},
        ports: portsFor({p: fed('p', 'vitality-grass', 2, {leaves: 0})})});
    assert.equal(grow.ok, true, grow.reason);
    assert.equal(grow.facts.leaves, 1);
    const leaf = guCatalogue['vitality-leaf'].treatment.value;
    const treat = (at, treatedAt) => quoteWorking(law, guMethods('vitality-leaf').treat, {id: `t${at}`, at,
        bindings: {consumable: guRef('l'), patient: operator}, facts: {treatedAt}, ports: portsFor({l: fed('l', 'vitality-leaf')})});
    assert.equal(treat(100, {keeper: 100 - leaf.restMinutes}).ok, true);
    assert.equal(treat(100, {keeper: 101 - leaf.restMinutes}).ok, false);
    assert.equal(treat(100, {}).effects[0].amount, leaf.health);
});
