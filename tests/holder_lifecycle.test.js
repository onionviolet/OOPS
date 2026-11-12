// E12 holder lifecycle: birth, death, copy, split, merge, and a cohort becoming
// individuals and back are world acts that keep identity history and hand
// quantities on. The fixture pack below is test data; it names no world.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    advanceWorld, applyWorldOps, composeSubstrate, createWorld, readLineage, readLineageKey, readTotals,
    restoreWorld, serializeWorld,
} from '../src/world_substrate.js';
import {applyEffect} from '../src/world_effects.js';
import {ancestorsOf, facetsOf, identityHistory, restoreIdentities, serializeIdentities} from '../src/kernel_identity.js';

const TERM = 40;
// A herd pack: a dam with a mate carries to term and gives birth; anything mortal
// runs down and dies, leaving remains. Both go through the declared acts.
const kin = {
    id: 't.kin', revision: 0,
    quantities: [{id: 'vitality', unit: 'point', max: 1000000}, {id: 'mass', unit: 'gram', max: 1000000}, {id: 'gestation', unit: 'minute', max: 1000}],
    properties: [{id: 'form', type: 'label'}, {id: 'marks', type: 'set'}],
    reads: ['vitality', 'gestation'], writes: ['vitality', 'gestation'],
    lifecycle: {acts: ['create', 'end'], fault: {quantity: 'vitality', amount: 5, to: 'row:kin.wasted'}},
    laws: [
        {id: 'breed', appliesTo: h => h.kind === 'body' && h.tags.includes('dam'),
            rates: (view, id) => view.holder(view.state(id)?.mate) ? [{holder: id, quantity: 'gestation', perMinute: 1}] : [],
            watches: (view, id) => [{holder: id, quantity: 'gestation', op: 'gte', value: TERM}],
            decide: (view, id) => {
                const s = view.state(id);
                if (!s || view.amount(id, 'gestation') < TERM || !view.holder(s.mate)) return [];
                return [
                    {op: 'lifecycle', act: 'create', parents: [id, s.mate], from: [id, s.mate, 'row:kin.birth'],
                        value: {id: `${id}.k${s.born + 1}`, kind: 'body', tags: ['mortal'], properties: {form: 'lamb'}, quantities: {vitality: 30, mass: 400}}},
                    {op: 'add', holder: id, quantity: 'gestation', amount: -TERM},
                    {op: 'state', holder: id, value: {...s, born: s.born + 1}},
                ];
            }},
        {id: 'age', appliesTo: h => h.kind === 'body' && h.tags.includes('mortal'),
            rates: (view, id) => [{holder: id, quantity: 'vitality', perMinute: -1}],
            watches: (view, id) => [{holder: id, quantity: 'vitality', op: 'lte', value: 0}],
            decide: (view, id) => view.amount(id, 'vitality') > 0 ? [] : [{op: 'lifecycle', act: 'end', holder: id, remains: {id: `${id}.remains`}}]},
    ],
};
const rules = composeSubstrate({packs: [kin]});
const base = (holders = []) => createWorld(rules, {holders: [{id: 'fold', kind: 'place', quantities: {mass: 0}}, {id: 'hill', kind: 'place'}, ...holders]});
const body = (id, extra = {}) => ({id, kind: 'body', place: 'fold', quantities: {vitality: 100, mass: 5000}, ...extra});
const run = (world, ops) => applyWorldOps(rules, world, ops, 'test');
const life = (world, op) => run(world, [{op: 'lifecycle', ...op}]);
const last = world => world.chain.at(-1);
const balanced = (before, after) => assert.deepEqual(readTotals(after).total, {...readTotals(after).total, ...readTotals(before).total});

test('a birth from two parents draws its amounts from them and a named row, and both sides keep the lineage', () => {
    const w = base([body('ewe'), body('ram')]);
    const born = life(w, {act: 'create', parents: ['ewe', 'ram'], from: ['ewe', 'ram', 'row:spark'],
        value: {id: 'lamb', kind: 'body', quantities: {vitality: 150, mass: 400, gestation: 0}}});
    assert.deepEqual(born.holders.lamb.quantities, {vitality: 150, mass: 400, gestation: 0});
    assert.equal(born.holders.lamb.place, 'fold');
    assert.deepEqual([born.holders.ewe.quantities, born.holders.ram.quantities], [{vitality: 0, mass: 4600}, {vitality: 50, mass: 5000}]);
    assert.deepEqual(born.holders.lamb.ledger.vitality, {'lifecycle:create:ewe': 100, 'lifecycle:create:ram': 50});
    balanced(w, born);
    assert.deepEqual(readTotals(born).rows, {});
    const row = readLineage(born, 'lamb')[0];
    assert.deepEqual([row.act, row.parents, row.at, row.traitKey], ['create', ['ewe', 'ram'], 0, 'lamb']);
    assert.deepEqual(readLineage(born, 'ewe').map(r => [r.act, r.role, r.into]), [['create', 'parent', ['lamb']]]);
    assert.deepEqual(ancestorsOf(born.identity, 'lamb'), ['ewe', 'ram']);
    assert.deepEqual(last(born).kind, 'lifecycle.create');
    // With no parent able to give, the rest comes from the row, which then shows the source.
    const made = life(w, {act: 'create', from: ['row:spark'], value: {id: 'stone', kind: 'thing', place: 'hill', quantities: {mass: 70}}});
    assert.deepEqual(readTotals(made).rows, {spark: {mass: -70}});
    balanced(w, made);
});

test('a death leaves remains that hold what the body held; law fields follow the remains', () => {
    const w0 = base([body('ewe', {properties: {form: 'sheep'}, refs: {item: 'ewe-key'}, state: {'t.kin': {mate: 'ram', born: 2}}})]);
    const w = run(w0, [{op: 'law_add', field: {id: 'brand', scope: 'ewe', kind: 'mark'}}]);
    const dead = life(w, {act: 'end', holder: 'ewe', remains: {id: 'carcass'}});
    assert.equal(dead.holders.ewe, undefined);
    const c = dead.holders.carcass;
    assert.deepEqual([c.kind, c.place, c.quantities, c.properties, c.refs], ['thing', 'fold', {vitality: 100, mass: 5000}, {form: 'sheep'}, {item: 'ewe-key'}]);
    assert.deepEqual(c.state, {'t.kin': {mate: 'ram', born: 2}});
    assert.equal(dead.laws[0].scope, 'carcass');
    balanced(w, dead);
    assert.deepEqual(readLineage(dead, 'ewe').map(r => [r.act, r.into]), [['end', ['carcass']]]);
    assert.deepEqual(readLineage(dead, 'carcass').map(r => [r.act, r.role, r.parents]), [['end', 'remains', ['ewe']]]);
    assert.deepEqual(facetsOf(dead.identity, 'ewe'), {});
    assert.deepEqual(identityHistory(dead.identity, 'ewe').map(r => r.change), ['add', 'lineage', 'remove']);
    // Routes: the life goes to a named sink, the flesh to the ground, with no remains.
    const gone = life(w, {act: 'end', holder: 'ewe', routes: {vitality: ['row:passed']}, to: ['fold']});
    assert.deepEqual([gone.holders.fold.quantities.mass, readTotals(gone).rows, gone.laws], [5000, {passed: {vitality: 100}}, []]);
    balanced(w, gone);
    // With nowhere named, the amounts land on the unclaimed row; they do not vanish.
    const bare = life(w, {act: 'end', holder: 'ewe'});
    assert.deepEqual(readTotals(bare).rows, {'lifecycle.unclaimed': {vitality: 100, mass: 5000}});
    balanced(w, bare);
    // The old outside removal also names where the amounts went.
    const removed = run(w0, [{op: 'holder_remove', holder: 'ewe'}]);
    assert.deepEqual(readTotals(removed).rows, {'holder.removed': {vitality: 100, mass: 5000}});
});

test('a copy carries the design kept as state, and the dial says whether innate traits are shared or redrawn', () => {
    const design = {'t.kin': {genes: {coat: ['plain', 'plain']}}};
    const w = base([body('ewe', {tags: ['dam'], properties: {form: 'sheep', marks: ['ear']}, state: design, refs: {item: 'ewe-key'}})]);
    const twin = life(w, {act: 'copy', holder: 'ewe', value: {id: 'twin'}});
    const t = twin.holders.twin;
    assert.deepEqual([t.kind, t.place, t.tags, t.properties, t.state, t.quantities, t.refs],
        ['body', 'fold', ['dam'], {form: 'sheep', marks: ['ear']}, design, {vitality: 100, mass: 5000}, {}]);
    assert.deepEqual(twin.holders.ewe, w.holders.ewe);
    assert.deepEqual(readTotals(twin).rows, {'lifecycle.made': {vitality: -100, mass: -5000}});
    balanced(w, twin);
    const row = readLineage(twin, 'twin')[0];
    assert.deepEqual([row.act, row.parents, row.innate, row.traitKey], ['copy', ['ewe'], 'share', 'ewe']);
    assert.equal(readLineageKey(twin, 'twin'), 'ewe');
    // A copy of the copy still shares the first one's key; a redraw takes its own.
    const third = life(twin, {act: 'copy', holder: 'twin', value: {id: 'third', place: 'hill'}, innate: 'redraw'});
    const fourth = life(twin, {act: 'copy', holder: 'twin', value: {id: 'fourth'}});
    assert.deepEqual([readLineageKey(third, 'third'), third.holders.third.place, readLineageKey(fourth, 'fourth')], ['third', 'hill', 'ewe']);
    assert.deepEqual(ancestorsOf(fourth.identity, 'fourth'), ['twin', 'ewe']);
    // Matter taken from a named stock instead of made: a copy that cannot be fed is a fault.
    const fed = life(w, {act: 'copy', holder: 'ewe', value: {id: 'twin', quantities: {mass: 300}}, from: ['ewe']});
    assert.deepEqual([fed.holders.twin.quantities, fed.holders.ewe.quantities.mass, readTotals(fed).rows], [{mass: 300}, 4700, {}]);
    const starved = life(w, {act: 'copy', holder: 'ewe', value: {id: 'twin'}, from: ['fold']});
    assert.deepEqual([starved.holders.twin, last(starved).kind, last(starved).detail.reason], [undefined, 'lifecycle.fault', 'short']);
});

test('a split divides amounts by shares and a merge sums them, with nothing lost to rounding', () => {
    const w = base([body('slime', {quantities: {vitality: 100, mass: 1001}, state: {'t.kin': {genes: 'g'}}})]);
    const split = life(w, {act: 'split', holder: 'slime', into: [{id: 'a', share: 1}, {id: 'b', share: 2}]});
    assert.equal(split.holders.slime, undefined);
    // floor(100/3)=33 and 66, the 1 left over goes to the first part; mass 333 + 1 over, and 667.
    assert.deepEqual([split.holders.a.quantities, split.holders.b.quantities], [{vitality: 34, mass: 334}, {vitality: 66, mass: 667}]);
    assert.deepEqual(split.holders.b.state, {'t.kin': {genes: 'g'}});
    balanced(w, split);
    assert.deepEqual(readTotals(split).rows, {});
    assert.deepEqual(readLineage(split, 'b').map(r => [r.act, r.parents, r.share, r.of, r.traitKey]), [['split', ['slime'], 2, 3, 'slime']]);
    assert.deepEqual(readLineage(split, 'slime').map(r => [r.act, r.into, r.kept]), [['split', ['a', 'b'], false]]);
    // Budding: the holder keeps a share and stays itself.
    const bud = life(w, {act: 'split', holder: 'slime', keep: 3, into: [{id: 'bud', share: 1, tags: ['young']}]});
    assert.deepEqual([bud.holders.slime.quantities, bud.holders.bud.quantities, bud.holders.bud.tags], [{vitality: 75, mass: 751}, {vitality: 25, mass: 250}, ['young']]);
    balanced(w, bud);
    // Merge into a new holder: parents on the lineage, amounts summed.
    const merged = life(split, {act: 'merge', holders: ['a', 'b'], value: {id: 'whole'}});
    assert.deepEqual([Object.keys(merged.holders).sort(), merged.holders.whole.quantities], [['fold', 'hill', 'whole'], {vitality: 100, mass: 1001}]);
    balanced(w, merged);
    assert.deepEqual(readLineage(merged, 'whole').map(r => [r.act, r.parents]), [['merge', ['a', 'b']]]);
    assert.deepEqual(ancestorsOf(merged.identity, 'whole'), ['a', 'b', 'slime']);
    // Merge into one of them: it survives and takes the other in. What its bound cannot hold goes where the op says.
    const tight = composeSubstrate({packs: [{...kin, quantities: [{id: 'vitality', unit: 'point', max: 80}, kin.quantities[1], kin.quantities[2]]}]});
    const w2 = createWorld(tight, {holders: [{id: 'fold', kind: 'place'}, {id: 'a', kind: 'body', place: 'fold', quantities: {vitality: 50}}, {id: 'b', kind: 'body', place: 'fold', quantities: {vitality: 50}}]});
    const eaten = applyWorldOps(tight, w2, [{op: 'lifecycle', act: 'merge', holders: ['a', 'b'], into: 'a', to: ['row:spilled']}], 'test');
    assert.deepEqual([eaten.holders.a.quantities, eaten.holders.b, readTotals(eaten).rows], [{vitality: 80}, undefined, {spilled: {vitality: 20}}]);
    assert.deepEqual(readTotals(eaten).total, readTotals(w2).total);
});

test('a cohort of 100 gives up 3 individuals and takes them back with totals conserved', () => {
    const flock = {id: 'flock', kind: 'cohort', place: 'fold', count: 100, tags: ['wild'], properties: {form: 'sheep'},
        quantities: {vitality: 10000, mass: 500050}, state: {'t.kin': {alleles: {coat: {strong: 40, plain: 160}}}}};
    const w = base([flock]);
    const out = life(w, {act: 'promote', holder: 'flock', ids: ['s1', 's2', 's3'], value: {tags: ['mortal']}});
    assert.deepEqual([out.holders.flock.count, out.holders.flock.quantities], [97, {vitality: 9700, mass: 485050}]);
    for (const id of ['s1', 's2', 's3']) {
        const s = out.holders[id];
        assert.deepEqual([s.kind, s.count, s.place, s.tags, s.properties, s.quantities, s.state], ['body', undefined, 'fold', ['mortal'], {form: 'sheep'}, {vitality: 100, mass: 5000}, flock.state]);
    }
    balanced(w, out);
    assert.deepEqual(readTotals(out).rows, {});
    assert.deepEqual(['s1', 's2', 's3'].map(id => readLineageKey(out, id)), ['flock/1', 'flock/2', 'flock/3']);
    assert.deepEqual(readLineage(out, 'flock').map(r => [r.act, r.into, r.count]), [['promote', ['s1', 's2', 's3'], 97]]);
    assert.deepEqual(readLineage(out, 's2').map(r => [r.act, r.parents]), [['promote', ['flock']]]);
    // One of them lives a little, then all three fold back.
    const lived = run(out, [{op: 'add', holder: 's2', quantity: 'mass', amount: 250}]);
    const back = life(lived, {act: 'demote', holders: ['s1', 's2', 's3'], into: 'flock'});
    assert.deepEqual([back.holders.flock.count, back.holders.flock.quantities, back.holders.s1], [100, {vitality: 10000, mass: 500300}, undefined]);
    balanced(lived, back);
    assert.deepEqual(readLineage(back, 's2').map(r => [r.act, r.into ?? r.parents]), [['promote', ['flock']], ['demote', ['flock']]]);
    assert.deepEqual(readLineage(back, 'flock').at(-1).parents, ['s1', 's2', 's3']);
    // The next one out gets the next address, so a replay of the same acts draws the same traits.
    const again = life(back, {act: 'promote', holder: 'flock', ids: ['s4']});
    assert.equal(readLineageKey(again, 's4'), 'flock/4');
    // A cohort splits by shares too, members with it.
    const halves = life(w, {act: 'split', holder: 'flock', keep: 3, into: [{id: 'band', share: 1, place: 'hill'}]});
    assert.deepEqual([halves.holders.flock.count, halves.holders.band.count, halves.holders.band.place, halves.holders.band.quantities.vitality], [75, 25, 'hill', 2500]);
    balanced(w, halves);
});

test('an act that cannot be done as asked settles as a fault with a price from data and a way around', () => {
    const w = base([body('ewe'), {id: 'flock', kind: 'cohort', place: 'fold', count: 2, quantities: {vitality: 200}}]);
    const price = {quantity: 'vitality', amount: 7, to: 'row:wasted'};
    const cases = [
        [{act: 'create', parents: ['ewe'], value: {id: 'flock', kind: 'body'}}, 'id-taken', 'ewe'],
        [{act: 'create', parents: ['ewe', 'ghost'], value: {id: 'lamb', kind: 'body'}}, 'no-holder', 'ewe'],
        [{act: 'create', parents: ['ewe'], from: ['ewe'], value: {id: 'lamb', kind: 'body', quantities: {vitality: 500}}}, 'short', 'ewe'],
        [{act: 'create', parents: ['ewe'], value: {id: 'lamb', kind: 'body', place: 'nowhere'}}, 'no-place', 'ewe'],
        [{act: 'end', holder: 'fold'}, 'occupied', 'fold'],
        [{act: 'promote', holder: 'flock', ids: ['a', 'b', 'c']}, 'short', 'flock'],
        [{act: 'promote', holder: 'ewe', ids: ['a']}, 'not-cohort', 'ewe'],
        [{act: 'demote', holders: ['ewe'], into: 'fold'}, 'not-cohort', 'ewe'],
        [{act: 'split', holder: 'ewe', into: [{id: 'flock', share: 1}]}, 'id-taken', 'ewe'],
    ];
    for (const [op, reason, payer] of cases) {
        const out = life(w, {...op, fault: price});
        const row = last(out);
        assert.deepEqual([row.kind, row.detail.act, row.detail.reason, typeof row.detail.way], ['lifecycle.fault', op.act, reason, 'string'], reason);
        const paid = payer === 'fold' ? 0 : 7;
        assert.deepEqual(row.detail.price, {quantity: 'vitality', asked: 7, paid, payer});
        assert.deepEqual(Object.keys(out.holders), Object.keys(w.holders));
        assert.deepEqual(readTotals(out).rows, paid ? {wasted: {vitality: 7}} : {});
        balanced(w, out);
    }
    // An ended holder's id stays its own: history is not overwritten.
    const dead = life(w, {act: 'end', holder: 'ewe'});
    assert.equal(last(life(dead, {act: 'create', value: {id: 'ewe', kind: 'body', place: 'fold'}})).detail.reason, 'id-taken');
    // A malformed op and an act the pack did not declare are contract errors.
    assert.throws(() => life(w, {act: 'vanish', holder: 'ewe'}), /unknown lifecycle act/);
    const sly = composeSubstrate({packs: [{...kin, lifecycle: {acts: ['create']}}]});
    const w2 = createWorld(sly, {holders: [{id: 'fold', kind: 'place'}, {id: 'old', kind: 'body', place: 'fold', tags: ['mortal'], quantities: {vitality: 1}}]});
    assert.throws(() => advanceWorld(sly, w2, 5), /does not declare the lifecycle act end/);
    assert.throws(() => composeSubstrate({packs: [{...kin, lifecycle: {acts: ['hatch']}}]}), /lifecycle names acts/);
});

test('a pack law performs birth and death; one jump, minute by minute and save and restore agree', () => {
    const start = base([
        body('ewe', {tags: ['dam', 'mortal'], quantities: {vitality: 100, mass: 5000, gestation: 0}, state: {'t.kin': {mate: 'ram', born: 0}}}),
        body('ram', {quantities: {vitality: 400, mass: 7000}}),
    ]);
    const END = 130;
    const jump = advanceWorld(rules, start, END).world;
    let step = start;
    for (let t = 1; t <= END; t++) step = advanceWorld(rules, step, t).world;
    const mid = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(advanceWorld(rules, start, 55).world))));
    const resumed = advanceWorld(rules, mid, END).world;
    assert.deepEqual(serializeWorld(step), serializeWorld(jump));
    assert.deepEqual(serializeWorld(resumed), serializeWorld(jump));
    // Born at 40 from both parents; the ewe had 60 left, gave 30 and died at 70; the lamb lived its 30 and died at 70.
    assert.deepEqual(Object.keys(jump.holders).sort(), ['ewe.k1.remains', 'ewe.remains', 'fold', 'hill', 'ram']);
    assert.deepEqual(readLineage(jump, 'ewe.k1').map(r => [r.at, r.act, r.parents ?? r.into]), [[40, 'create', ['ewe', 'ram']], [70, 'end', ['ewe.k1.remains']]]);
    assert.deepEqual(readLineage(jump, 'ewe').map(r => [r.at, r.act]), [[40, 'create'], [70, 'end']]);
    assert.deepEqual(readLineage(jump, 'ram').map(r => [r.at, r.act, r.role]), [[40, 'create', 'parent']]);
    assert.deepEqual(ancestorsOf(jump.identity, 'ewe.k1.remains'), ['ewe.k1', 'ewe', 'ram']);
    assert.deepEqual([jump.holders['ewe.k1.remains'].quantities.mass, jump.holders['ewe.remains'].quantities.mass], [400, 4600]);
    // Mass has no law on it, so its world total is what it was, with no row needed.
    assert.equal(readTotals(jump).total.mass, readTotals(start).total.mass);
    assert.deepEqual(readTotals(jump).rows, {});
    assert.deepEqual(jump.chain.filter(r => r.kind.startsWith('lifecycle.')).map(r => [r.at, r.kind, r.detail.id]),
        [[40, 'lifecycle.create', 'ewe.k1'], [70, 'lifecycle.end', 'ewe'], [70, 'lifecycle.end', 'ewe.k1']]);
    // The identity record saves and restores on its own shape too.
    assert.deepEqual(restoreIdentities(serializeIdentities(jump.identity)), jump.identity);
    // A world that ran no lifecycle act saves exactly as before.
    assert.deepEqual(Object.keys(serializeWorld(advanceWorld(rules, base([body('ram')]), 30).world)).sort(),
        ['chain', 'clock', 'decidedAt', 'holders', 'laws', 'revision', 'schema', 'seq']);
});

test('a landed effect carries a lifecycle act, answers a ward, and reports a fault', () => {
    const w = base([body('ewe', {state: {'t.kin': {genes: 'g'}}}), body('ram')]);
    const at = id => ({shape: 'holder', id});
    const cloned = applyEffect(rules, w, {verb: 'copy', object: 'position', target: at('ewe'), by: 'ram', lifecycle: {act: 'copy', value: {id: 'dolly'}}}, 'spell');
    assert.deepEqual(cloned.outcome.applied, [{target: 'ewe', verb: 'copy', object: 'holder', act: 'copy'}]);
    assert.deepEqual([cloned.world.holders.dolly.state, readLineage(cloned.world, 'dolly')[0].parents, cloned.world.chain.at(-1).by], [{'t.kin': {genes: 'g'}}, ['ewe'], 'ram']);
    const killed = applyEffect(rules, w, {verb: 'end', target: at('ewe'), lifecycle: {act: 'end', remains: {id: 'carcass'}}}, 'spell');
    assert.deepEqual([killed.world.holders.ewe, killed.world.holders.carcass.quantities.mass], [undefined, 5000]);
    const made = applyEffect(rules, w, {verb: 'add', object: 'position', target: at('hill'), lifecycle: {act: 'create', parents: ['ewe', 'ram'], from: ['ewe'], value: {id: 'lamb', kind: 'body', quantities: {mass: 400}}}}, 'spell');
    assert.deepEqual([made.world.holders.lamb.place, made.world.holders.ewe.quantities.mass], ['hill', 4600]);
    const fused = applyEffect(rules, w, {verb: 'transform', object: 'position', target: {shape: 'holders', ids: ['ewe', 'ram']}, lifecycle: {act: 'merge', value: {id: 'chimera'}}}, 'spell');
    assert.deepEqual([fused.world.holders.chimera.quantities, fused.outcome.applied.length], [{vitality: 200, mass: 10000}, 2]);
    const warded = applyEffect(rules, w, {verb: 'block', target: at('ewe'), field: 'ward', params: {verb: 'end', object: 'position'}}, 'ward').world;
    const stopped = applyEffect(rules, warded, {verb: 'end', target: at('ewe'), lifecycle: {act: 'end'}}, 'spell');
    assert.deepEqual([stopped.outcome.blocked, stopped.world], [[{target: 'ewe', by: 'ward'}], warded]);
    const fault = applyEffect(rules, w, {verb: 'copy', object: 'position', target: at('ewe'), lifecycle: {act: 'copy', value: {id: 'ram'}, fault: {quantity: 'vitality', amount: 9}}}, 'spell');
    assert.deepEqual([fault.outcome.applied, fault.outcome.faults[0].reason, fault.outcome.faults[0].price.paid], [[], 'id-taken', 9]);
    assert.deepEqual(readTotals(fault.world).rows, {'lifecycle.fault': {vitality: 9}});
    assert.throws(() => applyEffect(rules, w, {verb: 'move', object: 'position', target: at('ewe'), to: 'hill', lifecycle: {act: 'end'}}, 'spell'), /rides the verb end/);
    // The older one-property copy into a new thing now says where it came from.
    const shaped = applyEffect(rules, run(w, [{op: 'property', holder: 'ewe', property: 'form', value: 'sheep'}]),
        {verb: 'copy', object: 'property:form', from: 'ewe', target: at('hill'), create: {id: 'cast', kind: 'thing'}}, 'spell').world;
    assert.deepEqual(readLineage(shaped, 'cast').map(r => [r.act, r.parents, r.note]), [['create', ['ewe'], 'copy:property:form']]);
});
