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

// A world reader that knows when each thing leaves, so every port is asked at
// the step's own boundary time (KW6).
const reader = (things, gone = {}) => (ref, at) => (gone[ref.id] !== undefined && at >= gone[ref.id]) ? null : things[ref.id];
const settleIn = (law, record, times, ports) => times.reduce(({record: current, effects}, now) => {
    const step = settleWorking(law, current, {now, ports});
    return {record: step.record, effects: [...effects, ...step.effects]};
}, {record, effects: []});
const range = (from, to, by = 1) => Array.from({length: Math.floor((to - from) / by) + 1}, (_, i) => from + i * by);
const lcg = seed => () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;

for (const make of [guConsumer, creatureConsumer]) {
    const c = make();
    const begin = (overrides = {}) => beginWorking(c.law, c.method, {id: `${c.method.id}.trial`, bindings: c.bindings,
        facts: c.facts, at: c.start, ...overrides});
    const end = () => begin().deadlines.at(-1);

    test(`${c.name}: the method is data with typed roles, and a wrong kind is refused`, () => {
        validateWorkingMethod(c.law, c.method);
        const role = Object.keys(c.bindings)[0];
        assert.throws(() => begin({bindings: {...c.bindings, [role]: {kind: 'wrong', id: 'x'}}}), /Bind a/);
        assert.throws(() => validateWorkingMethod(c.law, {...c.method, steps: [{op: 'missing'}]}), /does not have/);
        assert.throws(() => validateWorkingMethod(c.law, {...c.method, law: 'other@1'}), /different law/);
    });

    test(`${c.name}: the quote is pure and forecasts what settlement publishes`, () => {
        const ports = {read: reader(c.things)};
        const before = structuredClone({method: c.method, bindings: c.bindings, facts: c.facts, things: c.things});
        const quote = quoteWorking(c.law, c.method, {id: `${c.method.id}.trial`, bindings: c.bindings, facts: c.facts, at: c.start, ports});
        assert.deepEqual({method: c.method, bindings: c.bindings, facts: c.facts, things: c.things}, before);
        assert.equal(quote.ok, true);
        assert.deepEqual(quote.effects.at(-1), c.finalEffect);
        const settled = settleWorking(c.law, begin(), {now: end(), ports});
        assert.deepEqual(settled.effects.map(row => row.effect), quote.effects);
        assert.equal(settled.record.status, 'complete');
        assert.equal(quote.endsAt, end());
    });

    test(`${c.name}: one jump, every minute and random partitions settle the same`, () => {
        const ports = {read: reader(c.things)};
        const finish = end();
        const jump = settleIn(c.law, begin(), [finish + 7], ports);
        const minutes = settleIn(c.law, begin(), range(c.start, finish + 7, finish > 1000 ? 7 : 1), ports);
        const random = lcg(961);
        const cuts = [...new Set(range(c.start, finish).filter(() => random() < 0.01).concat(finish + 7))].sort((a, b) => a - b);
        const partitioned = settleIn(c.law, begin(), cuts, ports);
        assert.deepEqual(minutes, jump);
        assert.deepEqual(partitioned, jump);
        assert.equal(jump.record.status, 'complete');
        assert.equal(nextWorkingDeadline(jump.record), null);
    });

    test(`${c.name}: save mid-run, reload, continue: same as never saved`, () => {
        const ports = {read: reader(c.things)};
        const first = begin().deadlines[0];
        const part = settleWorking(c.law, begin(), {now: first, ports});
        const saved = JSON.stringify(serializeWorking(part.record));
        const restored = restoreWorking(c.law, JSON.parse(saved));
        assert.equal(restored.schema, WORKING_SCHEMA);
        const resumed = settleWorking(c.law, restored, {now: end(), ports});
        const straight = settleWorking(c.law, begin(), {now: end(), ports});
        assert.deepEqual(resumed.record, straight.record);
        assert.deepEqual([...part.effects, ...resumed.effects], straight.effects);
        assert.throws(() => restoreWorking(c.law, {...JSON.parse(saved), schema: 'kernel.working@9'}), /Unsupported/);
        assert.throws(() => restoreWorking(c.law, {...JSON.parse(saved), cursor: 0}), /receipts/);
    });

    test(`${c.name}: a bound thing that leaves interrupts at the same step under any partition`, () => {
        const record = begin();
        const ports = {read: reader(c.things, {[c.leaving]: c.leavesAt})};
        const jump = settleIn(c.law, record, [end() + 1], ports);
        const steps = settleIn(c.law, record, [...record.deadlines, end() + 1], ports);
        assert.deepEqual(steps, jump);
        assert.equal(jump.record.status, 'interrupted');
        const failed = jump.record.receipts.at(-1);
        assert.equal(failed.ok, false);
        assert.equal(failed.cause, 'binding');
        assert.ok(jump.record.receipts.slice(0, -1).every(row => row.ok), 'earlier steps stay settled');
        assert.ok(jump.effects.length > 0 && !jump.effects.some(row => row.step === failed.step));
        assert.equal(settleWorking(c.law, jump.record, {now: end() + 999, ports}).effects.length, 0);
    });

    test(`${c.name}: authority is read at each step's settlement (FG7)`, () => {
        const record = begin();
        const lapse = record.deadlines[0] + 1;
        const offer = {authority: ({at}) => at < lapse ? {ok: true} : {ok: false, reason: 'The offer has expired.'}};
        const ports = {read: reader(c.things), ...offer};
        const jump = settleIn(c.law, record, [end()], ports);
        const steps = settleIn(c.law, record, range(c.start, end(), Math.max(1, Math.floor((end() - c.start) / 50))).concat(end()), ports);
        assert.deepEqual(steps, jump);
        assert.deepEqual(jump.record.receipts.map(row => row.ok), [true, false]);
        assert.equal(jump.record.receipts[1].cause, 'authority');
        assert.equal(jump.record.receipts[1].reason, 'The offer has expired.');
        // An offer valid when the step settled keeps its receipt after it expires.
        const early = settleWorking(c.law, record, {now: record.deadlines[0], ports}).record;
        const later = settleWorking(c.law, early, {now: record.deadlines[0], ports: {...ports, authority: () => ({ok: false, reason: 'gone'})}});
        assert.deepEqual(later.record.receipts, early.receipts);
        assert.equal(restoreWorking(c.law, serializeWorking(early)).receipts[0].ok, true);
    });

    test(`${c.name}: the maker's view keeps observation apart from truth`, () => {
        const ports = {read: reader(c.things)};
        const {record} = settleWorking(c.law, begin(), {now: end(), ports});
        const view = viewWorking(record);
        assert.equal(JSON.stringify(view).includes('"truth"'), false);
        // A refusal's private reason stays in truth unless the port says what was visible.
        const secret = {read: reader(c.things), authority: ({step}) => step === 0 ? {ok: true}
            : {ok: false, reason: 'private-token-7731'}};
        const refused = settleWorking(c.law, begin(), {now: end(), ports: secret}).record;
        assert.equal(refused.receipts.at(-1).reason, 'private-token-7731');
        assert.equal(JSON.stringify(viewWorking(refused)).includes('private-token-7731'), false);
        const shown = settleWorking(c.law, begin(), {now: end(), ports: {...secret,
            authority: args => ({...secret.authority(args), ...(args.step ? {observed: {saw: 'the gate stayed shut'}} : {})})}}).record;
        assert.deepEqual(viewWorking(shown).steps.at(-1).observed, {saw: 'the gate stayed shut'});
        assert.equal(view.steps.length, c.method.steps.length);
        assert.ok(record.receipts.every(row => row.truth && row.observed));
        const stopped = interruptWorking(begin(), {at: c.start + 1, reason: 'The maker walked away.'});
        assert.equal(viewWorking(stopped).steps[0].observed.reason, 'The maker walked away.');
        assert.equal(settleWorking(c.law, stopped, {now: end(), ports}).effects.length, 0);
    });
}

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

test('an actor quote reads only what the actor knows, and reports unknown roles as data', () => {
    const c = guConsumer();
    const truth = reader(c.things);
    const known = (ref, at) => ref.id === 'pulling-water' ? null : truth(ref, at);
    const quote = quoteForActor(c.law, c.method, {...guRun(c), actor: 'player', known});
    assert.equal(quote.eligible, false);
    assert.deepEqual(quote.reasons, [{step: null, role: 'water', cause: 'unknown', reason: 'role-unknown'}]);
    const full = quoteForActor(c.law, c.method, {...guRun(c), actor: 'player', known: truth});
    assert.equal(full.eligible, true);
    assert.equal(full.minutes, full.endsAt - 0);
    assert.deepEqual(full.effects.at(-1), c.finalEffect);
});

test('a wrong belief quotes as eligible and settlement interrupts it', () => {
    const c = guConsumer();
    const believed = reader(c.things);
    const actual = {...c.things, 'supplementary-mortal-gu': {...c.things['supplementary-mortal-gu'], count: 1}};
    const quote = quoteForActor(c.law, c.method, {...guRun(c), actor: 'player', known: believed});
    assert.equal(quote.eligible, true);
    const {record} = settleWorking(c.law, beginWorking(c.law, c.method, guRun(c)), {now: 10_000, ports: {read: reader(actual)}});
    assert.equal(record.status, 'interrupted');
    assert.equal(record.receipts.at(-1).step, 1);
    assert.equal(record.receipts.at(-1).cause, 'operation');
});

test('the player and an NPC with the same knowledge get the same quote (PFP11)', () => {
    for (const c of [guConsumer(), creatureConsumer()]) {
        const run = {id: `${c.method.id}.same`, bindings: c.bindings, facts: c.facts, at: c.start, known: reader(c.things)};
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
        facts: c.facts, at: c.start, known: reader(c.things), believedAuthority: () => ({ok: true})});
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
