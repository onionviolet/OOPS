// Kernel working contract v0 (docs/KERNEL_WORKING_CONTRACT.md). One contract
// suite runs over two existing consumers through thin adapters kept here, so
// the Gu and creature owners are not edited: runGuProcedure with the chapter
// 961 Strength Reversing recipe, and planCreatureMethod with courier-shaped
// operations. The adapters call those public functions unchanged.
import assert from 'node:assert/strict';
import test from 'node:test';

import {
    WORKING_SCHEMA, beginQuotedWorking, beginWorking, defineWorkingLaw, quoteForActor, interruptWorking, nextWorkingDeadline, quoteWorking,
    restoreWorking, serializeWorking, settleWorking, validateWorkingMethod, viewWorking,
} from '../src/kernel_working.js';
import {finishStrengthReversal, runGuProcedure, strengthReversingProcedure as reversal} from '../src/gu_procedures.js';
import {planCreatureMethod} from '../src/creature_methods.js';

// ---- Consumer 1: Gu procedure, one kernel step per beat -------------------
// Durations come from the recipe (preparation and development). The beat
// minutes are a dial; the chapter fixes only the totals.
function guConsumer() {
    const stockKey = 'supplementary-mortal-gu';
    const beat = (gu, step, last) => {
        const roles = Object.keys(gu);
        const recipe = {...reversal, roles: reversal.roles.filter(role => roles.includes(role.id)),
            beats: [{roles}], completion: last ? reversal.completion : undefined};
        const available = Object.values(gu).map(row => ({operator: row.operator,
            gu: {id: row.id, kind: row.species, rank: row.rank, fedThrough: row.fedThrough}, ability: row.ability}));
        const binding = Object.fromEntries(Object.values(gu).map(row => [row.id, {id: row.id, operator: row.operator}]));
        return {recipe, available, binding};
    };
    const activate = slots => ({roles: Object.fromEntries([['operator', 'cultivator'], ['supplies', 'stock'],
        ...slots.map(slot => [slot, 'gu'])]), minutes: 1,
    settle({bound, facts, at, options}) {
        const gu = Object.fromEntries(slots.map(slot => [bound[slot].id, bound[slot]]));
        const {recipe, available, binding} = beat(gu, at, options.last === true);
        const result = runGuProcedure({recipe, binding, available, stock: {[stockKey]: bound.supplies.count},
            reserves: facts.reserves, day: at});
        if (result.outcome !== 'complete') return {ok: false, reason: result.reason, observed: {felt: 'the move broke off'}};
        const transition = options.last ? {from: bound.operator.form,
            to: bound.operator.form === 'living' ? 'immortal-zombie' : 'living', dueAt: at + reversal.developmentMinutes} : undefined;
        return {ok: true, facts: {reserves: result.remaining, ...(transition ? {transition} : {})},
            effects: [...result.activations.map(row => ({kind: 'essence-spent', operator: row.operator, fuel: row.fuel, amount: row.cost})),
                ...result.effects],
            observed: {activated: result.activations.map(row => row.id)}};
    }});
    const law = defineWorkingLaw({id: 'kernel.test.gu-procedure', revision: 1, operations: {
        prepare: {roles: {operator: 'cultivator'}, minutes: reversal.preparationMinutes,
            settle: () => ({ok: true, observed: {felt: 'focused'}})},
        'activate-1': activate(['core']),
        'activate-2': activate(['first', 'second']),
        develop: {roles: {operator: 'cultivator'}, minutes: reversal.developmentMinutes, settle({bound, facts, at}) {
            const done = finishStrengthReversal(facts.transition, {now: at, restedSinceActivation: bound.operator.rested === true});
            return done ? {ok: true, effects: [done], observed: {felt: 'the body changed'}}
                : {ok: false, reason: 'The transformation did not hold.'};
        }},
    }});
    const roles = {operator: 'cultivator', supplies: 'stock', eat: 'gu', mountain: 'gu', water: 'gu'};
    const method = {id: reversal.id, revision: 1, law: law.ref, roles, steps: [
        {op: 'prepare', bindings: {operator: 'operator'}},
        {op: 'activate-1', bindings: {operator: 'operator', supplies: 'supplies', core: 'eat'}},
        {op: 'activate-2', bindings: {operator: 'operator', supplies: 'supplies', first: 'mountain', second: 'water'}, options: {last: true}},
        {op: 'develop', bindings: {operator: 'operator'}},
    ]};
    const bindings = {operator: {kind: 'cultivator', id: 'player'}, supplies: {kind: 'stock', id: stockKey},
        eat: {kind: 'gu', id: 'eat-strength'}, mountain: {kind: 'gu', id: 'pulling-mountain'}, water: {kind: 'gu', id: 'pulling-water'}};
    const things = {
        player: {kind: 'cultivator', id: 'player', form: 'living'},
        [stockKey]: {kind: 'stock', id: stockKey, count: 330_000},
        ...Object.fromEntries(reversal.roles.map(({id, kind}, index) => [id, {kind: 'gu', id, species: kind, rank: 6,
            fedThrough: 100_000, operator: 'player', ability: {fuel: 'immortal', cost: index + 1}}])),
    };
    return {name: 'Gu procedure (Strength Reversing)', law, method, bindings, things, facts: {reserves: {player: {immortal: 6}}},
        start: 0, leaving: 'pulling-water', leavesAt: 122, finalEffect: {kind: 'body-transition', from: 'living', to: 'immortal-zombie'}};
}

// ---- Consumer 2: creature method, one kernel step per creature step -------
function creatureConsumer() {
    const creatureLaw = 'kernel.test.courier.v1';
    const operations = {
        attach: {roles: {carrier: 'creature', kit: 'equipment'}, resolve({bound, facts}) {
            if (facts.installed) return {ok: false, reason: 'The construct already has a sling.'};
            return {ok: true, facts: {installed: true, carry: facts.carry + bound.kit.support},
                effects: [{kind: 'attach', item: bound.kit.id}]};
        }},
        dispatch: {roles: {carrier: 'creature', parcel: 'cargo', route: 'route'}, resolve({bound, facts}) {
            if (!bound.route.open || bound.parcel.grams > facts.carry) return {ok: false, reason: 'Cannot cross with this parcel.'};
            return {ok: true, facts: {delivered: bound.parcel.id}, effects: [{kind: 'dispatch', item: bound.parcel.id, route: bound.route.id}]};
        }},
    };
    const wrap = op => ({roles: operations[op].roles, settle({bound, facts}) {
        const slots = Object.keys(operations[op].roles);
        const result = planCreatureMethod({id: op, revision: 1, law: creatureLaw,
            steps: [{op, bindings: Object.fromEntries(slots.map(slot => [slot, slot]))}]},
        {law: creatureLaw, operations, bindings: bound, facts});
        return result.ok ? {ok: true, facts: result.facts, effects: result.effects, observed: {evidence: result.evidence}}
            : {ok: false, reason: result.reason};
    }});
    const law = defineWorkingLaw({id: 'kernel.test.creature-method', revision: 1,
        operations: {attach: {...wrap('attach'), minutes: 5}, dispatch: {...wrap('dispatch'), minutes: 8}}});
    const method = {id: 'river-delivery', revision: 1, law: law.ref,
        roles: {carrier: 'creature', kit: 'equipment', parcel: 'cargo', route: 'route'}, steps: [
            {op: 'attach', bindings: {carrier: 'carrier', kit: 'kit'}},
            {op: 'dispatch', bindings: {carrier: 'carrier', parcel: 'parcel', route: 'route'}},
        ]};
    const bindings = {carrier: {kind: 'creature', id: 'creature:17'}, kit: {kind: 'equipment', id: 'item:harness'},
        parcel: {kind: 'cargo', id: 'item:medicine'}, route: {kind: 'route', id: 'river:ford'}};
    const things = {
        'creature:17': {kind: 'creature', id: 'creature:17'},
        'item:harness': {kind: 'equipment', id: 'item:harness', support: 600},
        'item:medicine': {kind: 'cargo', id: 'item:medicine', grams: 850},
        'river:ford': {kind: 'route', id: 'river:ford', open: true},
    };
    return {name: 'Creature method (courier)', law, method, bindings, things, facts: {carry: 400}, start: 30,
        leaving: 'item:medicine', leavesAt: 40, finalEffect: {kind: 'dispatch', item: 'item:medicine', route: 'river:ford'}};
}

import {reader, runWorkingContract} from './kernel_contract_suite.mjs';

for (const make of [guConsumer, creatureConsumer]) runWorkingContract(make());

test('the Gu adapter matches the whole-recipe run: per-beat settlement spends the same essence', () => {
    const c = guConsumer();
    const {record, effects} = settleWorking(c.law, beginWorking(c.law, c.method, {id: 'gu.compare', bindings: c.bindings,
        facts: c.facts, at: 0}), {now: 10_000, ports: {read: reader(c.things)}});
    const available = reversal.roles.map(({id, kind}, index) => ({operator: 'player',
        gu: {id, kind, rank: 6, fedThrough: 100_000}, ability: {fuel: 'immortal', cost: index + 1}}));
    const binding = Object.fromEntries(reversal.roles.map(({id}) => [id, {id, operator: 'player'}]));
    const whole = runGuProcedure({recipe: reversal, binding, available, stock: {'supplementary-mortal-gu': 330_000},
        reserves: {player: {immortal: 6}}, day: 120});
    assert.deepEqual(record.facts.reserves, whole.remaining);
    assert.equal(effects.filter(row => row.effect.kind === 'essence-spent').length, whole.activations.length);
    assert.equal(record.deadlines.at(-1), 120 + 2 + reversal.developmentMinutes);
});

test('one migration path: making_procedure step progress becomes a kernel record', () => {
    const law = defineWorkingLaw({id: 'kernel.test.procedure', revision: 1, operations: {
        step: {roles: {maker: 'actor'}, settle: ({options}) => ({ok: true, effects: [{kind: 'made', part: options.part}]})},
    }});
    const method = {id: 'procedure.fixture.brew', revision: 1, law: law.ref, roles: {maker: 'actor'},
        steps: ['grind', 'steep', 'pour'].map((part, index) => ({op: 'step', bindings: {maker: 'maker'}, minutes: index + 2, options: {part}}))};
    const bindings = {maker: {kind: 'actor', id: 'player'}};
    const legacy = {schema: 'making.procedure-step@1', commandId: 'procedure.fixture.brew', completed: 1};
    const record = restoreWorking(law, legacy, {method, bindings, startedAt: 10});
    assert.equal(record.cursor, 1);
    assert.equal(record.receipts[0].migrated, true);
    assert.deepEqual(record.deadlines, [12, 15, 19]);
    const {effects} = settleWorking(law, record, {now: 19});
    assert.deepEqual(effects.map(row => row.effect.part), ['steep', 'pour']);
    assert.throws(() => restoreWorking(law, {...legacy, completed: 3}, {method, bindings, startedAt: 10}), /unfinished/);
    assert.throws(() => restoreWorking(law, {schema: 'mystery@1'}), /Unsupported/);
});

test('the quote draws from the same addresses as settlement, so a forecast holds (KW4, KW6)', () => {
    const hash = text => [...text].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 1000, 7);
    const law = defineWorkingLaw({id: 'kernel.test.draw', revision: 1, operations: {
        attempt: {roles: {maker: 'actor'}, minutes: 3, settle: ({address}) => hash(address) % 2
            ? {ok: true, effects: [{kind: 'drawn', value: hash(address)}]} : {ok: false, reason: 'The draw went against it.'}},
    }});
    const method = {id: 'attempt', revision: 1, law: law.ref, roles: {maker: 'actor'},
        steps: [0, 1, 2].map(() => ({op: 'attempt', bindings: {maker: 'maker'}}))};
    const bindings = {maker: {kind: 'actor', id: 'player'}};
    const ids = Array.from({length: 40}, (_, n) => `trial.${n}`);
    for (const id of ids) {
        const quote = quoteWorking(law, method, {id, bindings, at: 0});
        const settled = settleWorking(law, beginWorking(law, method, {id, bindings, at: 0}), {now: 9});
        assert.deepEqual(quote.effects, settled.effects.map(row => row.effect));
        assert.equal(quote.ok, settled.record.status === 'complete');
    }
    const outcomes = new Set(ids.map(id => JSON.stringify(quoteWorking(law, method, {id, bindings, at: 0}).effects)));
    assert.ok(outcomes.size > 1, 'different ids draw differently');
    assert.throws(() => quoteWorking(law, method, {bindings, at: 0}), /id the working will begin with/);
});

// ---- Actor-scoped quote (KW17), forecast fields (KW15), fingerprint (KW16) ----
const guRun = (c, overrides = {}) => ({id: 'gu.actor', bindings: c.bindings, facts: c.facts, at: 0, ...overrides});
const actorRun = c => ({id: 'gu.actor', bindings: c.bindings, knownFacts: c.facts, at: 0});

test('an actor quote reads only what the actor knows, and reports unknown roles as data', () => {
    const c = guConsumer();
    const truth = reader(c.things);
    const known = (ref, at) => ref.id === 'pulling-water' ? null : truth(ref, at);
    const quote = quoteForActor(c.law, c.method, {...actorRun(c), actor: 'player', known});
    assert.equal(quote.eligible, false);
    assert.deepEqual(quote.reasons, [{step: null, role: 'water', cause: 'unknown', reason: 'role-unknown'}]);
    assert.deepEqual([quote.minutes, quote.fingerprint], [null, null]);
    const unlearned = quoteForActor(c.law, c.method, {...actorRun(c), actor: 'npc.novice', known: truth,
        knowsMethod: (actor, {id}) => actor !== 'npc.novice' || id !== reversal.id});
    assert.deepEqual(unlearned.reasons, [{step: null, role: null, cause: 'method-unknown', reason: 'method-unknown'}]);
    const full = quoteForActor(c.law, c.method, {...actorRun(c), actor: 'player', known: truth});
    assert.equal(full.eligible, true);
    assert.equal(full.minutes, full.endsAt - 0);
    assert.deepEqual(full.effects.at(-1), c.finalEffect);
});

test('a wrong belief quotes as eligible and settlement interrupts it', () => {
    const c = guConsumer();
    const believed = reader(c.things);
    const actual = {...c.things, 'supplementary-mortal-gu': {...c.things['supplementary-mortal-gu'], count: 1}};
    const quote = quoteForActor(c.law, c.method, {...actorRun(c), actor: 'player', known: believed});
    assert.equal(quote.eligible, true);
    const {record} = settleWorking(c.law, beginWorking(c.law, c.method, guRun(c)), {now: 10_000, ports: {read: reader(actual)}});
    assert.equal(record.status, 'interrupted');
    assert.equal(record.receipts.at(-1).step, 1);
    assert.equal(record.receipts.at(-1).cause, 'operation');
});

test('the player and an NPC with the same knowledge get the same quote (PFP11)', () => {
    for (const c of [guConsumer(), creatureConsumer()]) {
        const run = {id: `${c.method.id}.same`, bindings: c.bindings, knownFacts: c.facts, at: c.start, known: reader(c.things)};
        const {actor: a, ...player} = quoteForActor(c.law, c.method, {...run, actor: 'player'});
        const {actor: b, ...npc} = quoteForActor(c.law, c.method, {...run, actor: 'npc.rival'});
        assert.deepEqual(npc, player);
        assert.notEqual(a, b);
    }
});

test('authority in an actor quote is what the actor believes; the truth decides at settlement', () => {
    const c = creatureConsumer();
    const record = beginWorking(c.law, c.method, {id: 'courier.offer', bindings: c.bindings, facts: c.facts, at: c.start});
    const expired = () => ({ok: false, reason: 'offer-expired'});
    const quote = quoteForActor(c.law, c.method, {id: 'courier.offer', actor: 'npc.carter', bindings: c.bindings,
        knownFacts: c.facts, at: c.start, known: reader(c.things), believedAuthority: () => ({ok: true})});
    assert.equal(quote.eligible, true);
    assert.equal(JSON.stringify(quote).includes('offer-expired'), false);
    const settled = settleWorking(c.law, record, {now: 999, ports: {read: reader(c.things), authority: expired}});
    assert.equal(settled.record.receipts[0].cause, 'authority');
});

test('operations can add costs, odds and a cause; quotes carry them and saves keep them', () => {
    const law = defineWorkingLaw({id: 'kernel.test.forecast', revision: 1, operations: {
        climb: {roles: {climber: 'actor', route: 'route'}, minutes: 10, settle: ({bound}) => ({ok: true,
            costs: [{quantity: 'stamina', amount: bound.route.steep ? 30 : 10}], odds: bound.route.steep ? 700 : 950,
            cause: bound.route.steep ? 'steep-route' : 'easy-route', effects: [{kind: 'arrive', place: bound.route.id}]})},
    }});
    const method = {id: 'climb', revision: 1, law: law.ref, roles: {climber: 'actor', route: 'route'},
        steps: [{op: 'climb', bindings: {climber: 'climber', route: 'route'}}]};
    const bindings = {climber: {kind: 'actor', id: 'player'}, route: {kind: 'route', id: 'ridge'}};
    const things = {player: {kind: 'actor', id: 'player'}, ridge: {kind: 'route', id: 'ridge', steep: true}};
    const quote = quoteForActor(law, method, {id: 'climb.1', actor: 'player', bindings, at: 0, known: reader(things)});
    assert.deepEqual([quote.costs, quote.odds, quote.cause], [[{quantity: 'stamina', amount: 30}], [700], ['steep-route']]);
    const {record} = settleWorking(law, beginWorking(law, method, {id: 'climb.1', bindings, at: 0}), {now: 10, ports: {read: reader(things)}});
    assert.equal(restoreWorking(law, serializeWorking(record)).receipts[0].truth.odds, 700);
    const bad = defineWorkingLaw({id: 'kernel.test.bad', revision: 1, operations: {x: {roles: {}, settle: () => ({ok: true, odds: 1.5})}}});
    assert.throws(() => quoteWorking(bad, {id: 'x', revision: 1, law: bad.ref, roles: {}, steps: [{op: 'x', bindings: {}}]},
        {id: 'x.1', bindings: {}, at: 0}), /permille/);
});

test('a committed quote fingerprint refuses a stale quote and reaches authority at settlement (KW16)', () => {
    const c = creatureConsumer();
    const run = {id: 'courier.fp', bindings: c.bindings, facts: c.facts, at: c.start, ports: {read: reader(c.things)}};
    const quote = quoteWorking(c.law, c.method, run);
    const begun = beginQuotedWorking(c.law, c.method, {...run, fingerprint: quote.fingerprint});
    assert.equal(begun.stale, false);
    assert.equal(begun.record.fingerprint, quote.fingerprint);
    const heavier = {...c.things, 'item:medicine': {...c.things['item:medicine'], grams: 2000}};
    const stale = beginQuotedWorking(c.law, c.method, {...run, ports: {read: reader(heavier)}, fingerprint: quote.fingerprint});
    assert.equal(stale.stale, true);
    assert.equal(stale.record, undefined);
    const seen = [];
    settleWorking(c.law, begun.record, {now: 999, ports: {read: reader(c.things), authority: request => {
        seen.push(request.fingerprint); return {ok: true};
    }}});
    assert.deepEqual(seen, [quote.fingerprint, quote.fingerprint]);
    assert.equal(restoreWorking(c.law, serializeWorking(begun.record)).fingerprint, quote.fingerprint);
});

test('an offer owner keeps the accepted fingerprint and refuses a record carrying another (SMK7)', () => {
    // A priced sale: the price comes from the offer and is a cost, so it is in the fingerprint.
    const law = defineWorkingLaw({id: 'kernel.test.sale', revision: 1, operations: {
        sell: {roles: {buyer: 'actor', offer: 'offer'}, minutes: 1, settle: ({bound}) => ({ok: true,
            costs: [{quantity: 'money', amount: bound.offer.price, holder: 'buyer'}], odds: bound.offer.sure ? 1000 : 600,
            effects: [{kind: 'sold', good: bound.offer.good}]})},
    }});
    const method = {id: 'buy', revision: 1, law: law.ref, roles: {buyer: 'actor', offer: 'offer'},
        steps: [{op: 'sell', bindings: {buyer: 'buyer', offer: 'offer'}}]};
    const bindings = {buyer: {kind: 'actor', id: 'player'}, offer: {kind: 'offer', id: 'stall.salt'}};
    const terms = (price, sure = true) => reader({player: {kind: 'actor', id: 'player'}, 'stall.salt': {kind: 'offer', id: 'stall.salt', good: 'salt', price, sure}});
    const accepted = quoteWorking(law, method, {id: 'buy.1', bindings, at: 0, ports: {read: terms(6)}});
    assert.notEqual(quoteWorking(law, method, {id: 'buy.1', bindings, at: 0, ports: {read: terms(9)}}).fingerprint, accepted.fingerprint);
    assert.notEqual(quoteWorking(law, method, {id: 'buy.1', bindings, at: 0, ports: {read: terms(6, false)}}).fingerprint, accepted.fingerprint,
        'a changed chance is a changed deal');
    const offerOwner = {accepted: accepted.fingerprint};
    const authority = ({fingerprint}) => fingerprint === offerOwner.accepted ? {ok: true} : {ok: false, reason: 'terms-changed'};
    const good = beginWorking(law, method, {id: 'buy.1', bindings, at: 0, fingerprint: accepted.fingerprint});
    assert.equal(settleWorking(law, good, {now: 1, ports: {read: terms(6), authority}}).record.status, 'complete');
    const other = beginWorking(law, method, {id: 'buy.1', bindings, at: 0, fingerprint: 'kw1:00000000:1'});
    const refused = settleWorking(law, other, {now: 1, ports: {read: terms(6), authority}}).record;
    assert.deepEqual([refused.status, refused.receipts[0].cause, refused.receipts[0].reason], ['interrupted', 'authority', 'terms-changed']);
});
