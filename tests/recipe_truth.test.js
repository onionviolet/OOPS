// Recipe truth (GKM247-GKM250): a holder's record of a composition can differ
// from what works. Two consumers: a fixture move law and the brewing law.
// Every number here is fixture data, a dial with its reason beside it.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, quoteWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {defineComposition} from '../src/kernel_compose.js';
import {BREW_LAW, brewBalance, unfinishedBatch} from '../src/brew_law.js';
import {backlashOf, bindRecipe, checkRecipe, conditionAuthority, defineRecipe, denyCondition, mergeRecipes, recipeDifferences,
    recipeFaults, restoreRecipes, serializeRecipes} from '../src/recipe_truth.js';

// ---- Consumer 1: a move law. Gathered charge has to go somewhere. -----------
// draw gathers a core's output and leaves half of it as loose strain; fold
// multiplies the charge through a second core and binds the strain, and what
// that core cannot hold turns on the operator; release lets the charge go, and
// any loose strain goes with it into the operator. `scale` (permille) is how
// hard the operator pushes; a place absorbs a share of what turns back.
const scaled = (n, facts) => Math.floor(n * (facts.scale ?? 1000) / 1000);
const kept = (n, ground) => Math.ceil(n * (1000 - (ground?.absorbs ?? 0)) / 1000);
const moveLaw = defineWorkingLaw({id: 'fixture.move', revision: 1, operations: {
    draw: {roles: {operator: 'person', core: 'core'}, minutes: 1, settle({bound, facts}) {
        const n = scaled(bound.core.output, facts);
        return {ok: true, facts: {charge: (facts.charge ?? 0) + n, strain: (facts.strain ?? 0) + Math.ceil(n / 2)}};
    }},
    fold: {roles: {operator: 'person', core: 'core', ground: 'place'}, minutes: 1, settle({bound, facts, options}) {
        const next = (facts.charge ?? 0) * options.times + scaled(options.plus ?? 0, facts), cap = scaled(bound.core.capacity, facts);
        if (next > cap) return {ok: false, reason: 'overload', observed: {over: next - cap},
            costs: [{quantity: 'health', holder: bound.operator.id, amount: kept(next - cap, bound.ground)}]};
        return {ok: true, facts: {charge: next, strain: 0}};
    }},
    release: {roles: {operator: 'person', ground: 'place'}, minutes: 1, settle({bound, facts}) {
        const effects = [{kind: 'force', by: bound.operator.id, amount: facts.charge ?? 0}];
        if (facts.strain > 0) effects.push({kind: 'harm', target: bound.operator.id, amount: kept(facts.strain, bound.ground)});
        return {ok: true, facts: {charge: 0, strain: 0}, effects};
    }},
}});
const filler = (id, roles, steps, conditions) => ({law: moveLaw, method: {id, revision: 1, law: moveLaw.ref, roles, steps}, ...(conditions ? {conditions} : {})});
const P = {operator: 'person'}, PC = {operator: 'person', core: 'core'}, PCG = {...PC, ground: 'place'}, PG = {...P, ground: 'place'};
const same = roles => Object.fromEntries(Object.keys(roles).map(k => [k, k]));
const fold = (id, options, conditions) => filler(id, PCG, [{op: 'fold', bindings: same(PCG), options}], conditions);
// Closing a condition costs the denier attention for as long as it is held (GKM250).
const attention = amount => ({costs: [{quantity: 'attention', amount}], minutes: 5});
const moveBook = {
    compositions: {'move.tally': defineComposition({id: 'move.tally', revision: 1, roles: {operator: 'person', a: 'core', b: 'core', ground: 'place'}, slots: [
        {name: 'gather', needs: PC, bindings: {operator: 'operator', core: 'a'}, facts: 'shared'},
        {name: 'join', needs: PCG, bindings: {operator: 'operator', core: 'b', ground: 'ground'}, facts: 'shared'},
        {name: 'release', needs: PG, bindings: {operator: 'operator', ground: 'ground'}, facts: 'shared'},
    ]})},
    fillers: {
        'gather.plain': filler('gather.plain', PC, [{op: 'draw', bindings: same(PC)}]),
        // The disciple's own way to gather: a spoken trigger and a feeling let go.
        // The trigger can be done without, at a steep price in essence.
        'gather.spoken': filler('gather.spoken', PC, [{op: 'draw', bindings: same(PC)}], [
            {id: 'spoken-trigger', kind: 'utterance', role: 'operator', deny: attention(3), forgo: {costs: [{quantity: 'essence', amount: 40}]}},
            {id: 'feeling-released', kind: 'state', role: 'operator', deny: attention(6)}]),
        'join.official': fold('join.official', {times: 8}),          // 8 x 8 = 64, under the core's 70
        'join.false': fold('join.false', {times: 11}),               // 88: the wrong sum, 18 over
        'join.annotated': fold('join.annotated', {times: 8, plus: 6}), // a margin note fills the core to 70
        // Works like the official step, with a mark its author can close cheaply.
        'join.marked': fold('join.marked', {times: 8}, [{id: 'maker-mark', kind: 'state', role: 'operator',
            deny: attention(1), lapse: {costs: [{quantity: 'health', amount: 30}]}}]),
        'release.plain': filler('release.plain', PG, [{op: 'release', bindings: same(PG)}]),
    },
};
const things = {disciple: {kind: 'person', id: 'disciple'}, 'core.a': {kind: 'core', id: 'core.a', output: 8}, 'core.b': {kind: 'core', id: 'core.b', capacity: 70},
    field: {kind: 'place', id: 'field', absorbs: 0}, cell: {kind: 'place', id: 'cell', absorbs: 800}};
const read = ref => things[ref.id] ?? null;
const bindings = (ground = 'field') => ({operator: {kind: 'person', id: 'disciple'}, a: {kind: 'core', id: 'core.a'}, b: {kind: 'core', id: 'core.b'}, ground: {kind: 'place', id: ground}});
const recipe = (id, join, extra = {}) => defineRecipe({id, composition: 'move.tally', holder: 'disciple',
    fillers: {gather: 'gather.plain', ...(join ? {join} : {}), release: 'release.plain'}, ...extra});
const own = defineRecipe({id: 'own', composition: 'move.tally', holder: 'disciple', source: 'disciple',
    fillers: {gather: 'gather.spoken', join: 'join.official', release: 'release.plain'}, conditions: ['spoken-trigger', 'feeling-released']});
const taught = recipe('taught', 'join.false', {source: 'teacher'});

// Activate a record: bind it, begin, settle under the real law and the live denials.
function activate(book, rec, {at, until = at + 9, denials = [], forgo, ground, facts = {}, id = `use.${rec.id}`, reader = read, binds = bindings(ground)}) {
    const bound = bindRecipe(book, rec);
    const ports = {read: reader, authority: conditionAuthority(bound.conditions, denials, {forgo})};
    const result = settleWorking(bound.law, beginWorking(bound.law, bound.method, {id, bindings: binds, facts, at}), {now: until, ports});
    return {...result, bound, ports, force: result.effects.filter(e => e.effect.kind === 'force').reduce((n, e) => n + e.effect.amount, 0),
        harm: result.effects.filter(e => e.effect.kind === 'harm').reduce((n, e) => n + e.effect.amount, 0)};
}
const scene = (ground = 'field', facts = {}) => ({bindings: bindings(ground), facts, ports: {read}});
// Check prices: thinking costs mental effort and an hour; a trial costs a little
// essence; a second copy costs a favour. Miss rates are per route.
const routes = {
    deduce: {id: 'think-it-through', kind: 'deduce', costs: [{quantity: 'mental', amount: 12}], minutes: 60, missPermille: 300},
    trial: {id: 'small-trial', kind: 'trial', costs: [{quantity: 'essence', amount: 2}], minutes: 5, missPermille: 0},
    compare: {id: 'second-copy', kind: 'compare', costs: [{quantity: 'favour', amount: 1}], minutes: 30, missPermille: 100},
};
const sure = () => 999, unlucky = () => 0;

test('row 1: a false move from a teacher fails at once with backlash; the disciple who checked first is unhurt', () => {
    // The default: a record equals what works.
    assert.equal(activate(moveBook, own, {at: 0}).force, 64);
    assert.deepEqual(recipeFaults(moveBook, own, {id: 'dry', at: 0, ...scene()}), []);

    // Pressure, minute 10. The teacher closes the spoken trigger and pays attention for it.
    const trigger = bindRecipe(moveBook, own).conditions.find(c => c.id === 'spoken-trigger');
    const {denial, costs} = denyCondition(trigger, {target: 'disciple', by: 'teacher', at: 10});
    assert.deepEqual(costs, [{holder: 'teacher', quantity: 'attention', amount: 3}]);
    assert.deepEqual([denial.from, denial.until], [10, 15]);
    const closed = activate(moveBook, own, {at: 10, denials: [denial]});
    assert.equal(closed.record.status, 'interrupted');
    assert.deepEqual([closed.record.receipts[0].reason, closed.record.receipts[0].cause, closed.force], ['condition-denied', 'authority', 0]);
    assert.deepEqual(backlashOf(closed.record), [], 'a move that never starts turns nothing back');
    assert.equal(activate(moveBook, own, {at: 15, denials: [denial]}).force, 64, 'the denial lasts while the denier pays for it');

    // Unchecked: the taught move is what remains. It fails on its second step.
    const used = activate(moveBook, taught, {at: 10, denials: [denial]});
    assert.equal(used.record.status, 'interrupted');
    assert.deepEqual(used.record.receipts.map(r => [r.op, r.at, r.ok]), [['gather/draw', 11, true], ['join/fold', 12, false]]);
    assert.equal(used.record.receipts[1].reason, 'overload');
    assert.deepEqual(backlashOf(used.record), [{quantity: 'health', holder: 'disciple', amount: 18}]);
    assert.equal(used.force, 0);
    // The same failure shape as a true record with a part that cannot carry it.
    const weak = activate(moveBook, own, {at: 0, reader: ref => ref.id === 'core.b' ? {...things['core.b'], capacity: 50} : read(ref)});
    assert.deepEqual(backlashOf(weak.record), [{quantity: 'health', holder: 'disciple', amount: 14}]);
    assert.deepEqual(Object.keys(weak.record.receipts[1]), Object.keys(used.record.receipts[1]));

    // Checked first, at minute 0: an hour of thought and mental effort finds the fault.
    const checked = checkRecipe(moveBook, taught, routes.deduce, {id: 'check.1', by: 'disciple', at: 0, draw: sure, scene: scene()});
    assert.deepEqual(checked.check.found, [{slot: 'join', kind: 'fails', reason: 'overload'}]);
    assert.deepEqual(checked.costs, [{holder: 'disciple', quantity: 'mental', amount: 12}]);
    assert.deepEqual([checked.check.done, checked.backlash], [60, []]);
    assert.equal(checked.recipe.checks.length, 1, 'the record keeps what its holder found');
    // Under the same pressure he leaves the taught move alone and pays to work without the trigger.
    const forced = activate(moveBook, own, {at: 70, denials: [{...denial, from: 70, until: 75}], forgo: ['spoken-trigger']});
    assert.equal(forced.record.status, 'complete');
    assert.equal(forced.force, 64);
    assert.deepEqual(forced.record.receipts[0].truth.costs, [{holder: 'disciple', quantity: 'essence', amount: 40}]);
    assert.deepEqual(backlashOf(forced.record), []);
});

test('checking is priced and can miss: deduction, a small safe trial, a second source', () => {
    // Deduction misses three times in ten; a miss reads as a clean record.
    const at = n => () => n;
    const missed = checkRecipe(moveBook, taught, routes.deduce, {id: 'c', by: 'disciple', at: 0, draw: at(299), scene: scene()});
    assert.deepEqual([missed.check.found, missed.missed.length, missed.costs[0].amount], [[], 1, 12]);
    assert.equal(checkRecipe(moveBook, taught, routes.deduce, {id: 'c', by: 'disciple', at: 0, draw: at(300), scene: scene()}).check.found.length, 1);

    // A trial does the move for real: a quarter push in a warded cell. The
    // backlash is real and small (5 over, the cell takes four fifths).
    const trial = checkRecipe(moveBook, taught, routes.trial, {id: 't', by: 'disciple', at: 0, draw: sure, scene: scene('cell', {scale: 250})});
    assert.deepEqual(trial.check.found, [{slot: 'join', kind: 'fails', reason: 'overload'}]);
    assert.deepEqual(trial.backlash, [{quantity: 'health', holder: 'disciple', amount: 1}]);
    assert.deepEqual(trial.costs, [{holder: 'disciple', quantity: 'essence', amount: 2}]);
    assert.equal(trial.check.done, 5);
    // A trial sees what happened in the cell. A mark nobody closed there stays unseen.
    const marked = recipe('gift', 'join.marked');
    assert.deepEqual(checkRecipe(moveBook, marked, routes.trial, {id: 't2', by: 'disciple', at: 0, draw: sure, scene: scene('cell', {scale: 250})}).check.found, []);
    assert.deepEqual(checkRecipe(moveBook, marked, routes.deduce, {id: 'd2', by: 'disciple', at: 0, draw: sure, scene: scene()}).check.found,
        [{slot: 'join', kind: 'unlisted-condition', condition: 'maker-mark'}]);

    // A second source shows where two copies differ, and leaves which is right open.
    const peer = recipe('peer-copy', 'join.official', {holder: 'peer'});
    const compared = checkRecipe(moveBook, taught, routes.compare, {id: 'k', by: 'disciple', at: 0, draw: sure, second: peer});
    assert.deepEqual(compared.check.found, [{slot: 'join', kind: 'differs', other: 'peer-copy'}]);
    assert.deepEqual(compared.backlash, []);
    // A copy from the same forger agrees with the lie.
    const sibling = recipe('sibling-copy', 'join.false', {holder: 'sibling', source: 'teacher'});
    assert.deepEqual(checkRecipe(moveBook, taught, routes.compare, {id: 'k2', by: 'disciple', at: 0, draw: sure, second: sibling}).check.found, []);
    assert.equal(checkRecipe(moveBook, taught, routes.compare, {id: 'k3', by: 'disciple', at: 0, draw: unlucky, second: peer}).missed.length, 1);
    assert.throws(() => checkRecipe(moveBook, taught, {...routes.trial, missPermille: undefined}, {id: 'x', by: 'disciple', at: 0, draw: sure, scene: scene()}), /miss rate/);
});

// ---- Consumer 2: a potion formula on the brewing law -----------------------
const VL = {vessel: 'vessel'}, base = {vessel: 'vessel', herb: 'lot', salt: 'lot'};
const brewStep = (id, roles, steps) => ({law: BREW_LAW, method: {id, revision: 1, law: BREW_LAW.ref, roles, steps}});
const react = (id, reaction) => brewStep(id, VL, [{op: 'react', bindings: same(VL), minutes: 5, options: {reactions: [reaction]}}]);
const pour = (id, doses) => brewStep(id, VL, [{op: 'divide', bindings: same(VL), minutes: 1, options: {doses}}]);
const brewBook = {
    compositions: {'potion.calm': defineComposition({id: 'potion.calm', revision: 1, roles: base, slots: [
        {name: 'base', needs: base, bindings: same(base), facts: 'shared'},
        {name: 'bind', needs: VL, bindings: same(VL), facts: 'shared'},
        {name: 'pour', needs: VL, bindings: same(VL), facts: 'shared'},
    ]})},
    fillers: {
        'base.both': brewStep('base.both', base, [{op: 'admit', bindings: {vessel: 'vessel', lot: 'herb'}}, {op: 'admit', bindings: {vessel: 'vessel', lot: 'salt'}}]),
        'bind.true': react('bind.true', {id: 'xy', reactants: {x: 1, y: 1}, products: {z: 2}}),
        'bind.wrong': react('bind.wrong', {id: 'xx', reactants: {x: 2}, products: {w: 2}}), // the herb alone, turned to dross
        'pour.two': pour('pour.two', 2),
        'pour.lost': pour('pour.lost', 0), // a copy whose dose count was lost
    },
};
const lots = amount => ({cauldron: {kind: 'vessel', id: 'cauldron', place: 'workroom', retainPermille: 0, closure: 'open'},
    'lot.herb': {kind: 'lot', id: 'lot.herb', material: 'herb', amount, properties: {x: 1000}},
    'lot.salt': {kind: 'lot', id: 'lot.salt', material: 'salt', amount, properties: {y: 1000}}});
const brewScene = amount => ({bindings: {vessel: {kind: 'vessel', id: 'cauldron'}, herb: {kind: 'lot', id: 'lot.herb'}, salt: {kind: 'lot', id: 'lot.salt'}},
    facts: {}, ports: {read: ref => lots(amount)[ref.id] ?? null}});
const formula = (id, bind, pourKey = 'pour.two') => defineRecipe({id, composition: 'potion.calm', holder: 'brewer', fillers: {base: 'base.both', bind, pour: pourKey}});
const brew = (rec, amount = 1000) => {
    const s = brewScene(amount);
    return activate(brewBook, rec, {at: 0, reader: s.ports.read, binds: s.bindings});
};
const dose = run => run.record.facts.brew.doses[0].contents;

test('row 2: the same records on a potion formula with a wrong step', () => {
    const good = brew(formula('official', 'bind.true'));
    assert.deepEqual([good.record.status, dose(good).z, dose(good).w], ['complete', 1000, undefined]);
    // The wrong step settles under the brewing law like any step: the brew
    // finishes, and what it makes is dross with the salt left loose in it.
    const bad = brew(formula('copied', 'bind.wrong'));
    assert.deepEqual([bad.record.status, dose(bad).z, dose(bad).w, dose(bad).y], ['complete', undefined, 500, 500]);
    assert.ok(brewBalance(bad.record.facts).balanced);
    assert.deepEqual(backlashOf(bad.record), [], 'this law charges a wrong step in spoiled stock, on its own ledger');
    // A small trial spends a tenth of the stock and shows the dross.
    const trial = checkRecipe(brewBook, formula('copied', 'bind.wrong'), routes.trial, {id: 'bt', by: 'brewer', at: 0, draw: sure, scene: brewScene(100)});
    assert.deepEqual([trial.working.facts.brew.doses[0].contents.w, trial.check.found], [50, []]);
    // A second copy points at the step.
    assert.deepEqual(recipeDifferences(formula('copied', 'bind.wrong'), formula('official', 'bind.true')), [{slot: 'bind', kind: 'differs', other: 'official'}]);
    // A step that cannot be done at all fails as a step, and the batch stays in the vessel.
    const lost = formula('torn', 'bind.true', 'pour.lost');
    assert.deepEqual(checkRecipe(brewBook, lost, routes.deduce, {id: 'bd', by: 'brewer', at: 0, draw: sure, scene: brewScene(1000)}).check.found,
        [{slot: 'pour', kind: 'fails', reason: 'Choose how many doses to pour.'}]);
    const stuck = brew(lost);
    assert.equal(stuck.record.status, 'interrupted');
    assert.deepEqual([unfinishedBatch(stuck.record).settledSteps, unfinishedBatch(stuck.record).batch.z], [3, 2000]);
});

test('row 3: better, incomplete, backdoored and withheld recipes are records, with no code of their own', () => {
    // Better than the official one: an annotated manual fills the second core.
    assert.equal(activate(moveBook, recipe('annotated', 'join.annotated'), {at: 0}).force, 70);
    assert.deepEqual(recipeFaults(moveBook, recipe('annotated', 'join.annotated'), {id: 'dry', at: 0, ...scene()}), []);

    // Incomplete: no join. An eighth of the strength, and the loose strain comes back.
    const partial = activate(moveBook, recipe('fragment', null), {at: 0});
    assert.deepEqual([partial.record.status, partial.force, partial.harm, partial.bound.missing], ['complete', 8, 4, ['join']]);
    assert.deepEqual(recipeFaults(moveBook, recipe('fragment', null), {id: 'dry', at: 0, ...scene()}), [{slot: 'join', kind: 'missing'}]);

    // Backdoored: works until its author closes the mark, for one point of attention.
    const gift = recipe('gift', 'join.marked');
    assert.equal(activate(moveBook, gift, {at: 0}).force, 64);
    const mark = bindRecipe(moveBook, gift).conditions.find(c => c.id === 'maker-mark');
    assert.equal(mark.listed, false);
    const sprung = denyCondition(mark, {target: 'disciple', by: 'author', at: 0});
    assert.deepEqual(sprung.costs, [{holder: 'author', quantity: 'attention', amount: 1}]);
    const failed = activate(moveBook, gift, {at: 0, denials: [sprung.denial]});
    assert.deepEqual([failed.record.receipts.at(-1).op, failed.record.receipts.at(-1).reason], ['join/fold', 'condition-denied']);
    assert.deepEqual(backlashOf(failed.record), [{holder: 'disciple', quantity: 'health', amount: 30}]);
    assert.equal(activate(moveBook, gift, {at: 0, denials: [{...sprung.denial, target: 'someone-else'}]}).force, 64);

    // Withheld last step: the charge is gathered and never let go, until a second record supplies the step.
    const withheld = defineRecipe({id: 'first-scroll', composition: 'move.tally', holder: 'disciple', fillers: {gather: 'gather.plain', join: 'join.official'}});
    const held = activate(moveBook, withheld, {at: 0});
    assert.deepEqual([held.record.status, held.force, held.record.facts.charge], ['complete', 0, 64]);
    const key = defineRecipe({id: 'second-scroll', composition: 'move.tally', fillers: {release: 'release.plain'}});
    const whole = mergeRecipes(withheld, key);
    assert.deepEqual([whole.id, activate(moveBook, whole, {at: 0}).force], ['first-scroll', 64]);
    assert.throws(() => bindRecipe(moveBook, defineRecipe({id: 'odd', composition: 'move.tally', fillers: {flourish: 'release.plain'}})), /does not have/);
    assert.throws(() => bindRecipe(moveBook, recipe('swapped', 'gather.plain')), /does not bind/);
});

test('row 4: one jump equals minute by minute, and a save mid-scene reaches the same end', () => {
    // The backdoored move begins at minute 0; its author closes the mark at minute 1; the join is due at minute 2.
    const gift = recipe('gift', 'join.marked');
    const mark = bindRecipe(moveBook, gift).conditions[0];
    const begin = bound => beginWorking(bound.law, bound.method, {id: 'use.gift', bindings: bindings(), at: 0});
    const ports = (bound, denials) => ({read, authority: conditionAuthority(bound.conditions, denials)});
    const denials = [denyCondition(mark, {target: 'disciple', by: 'author', at: 1}).denial];

    const bound = bindRecipe(moveBook, gift);
    const jump = settleWorking(bound.law, begin(bound), {now: 9, ports: ports(bound, denials)}).record;
    let stepped = begin(bound);
    for (let now = 0; now <= 9; now++) stepped = settleWorking(bound.law, stepped, {now, ports: ports(bound, now >= 1 ? denials : [])}).record;
    assert.deepEqual(stepped, jump);
    assert.deepEqual(backlashOf(jump), [{holder: 'disciple', quantity: 'health', amount: 30}]);

    // Save after the first step, with the denial already made.
    const mid = settleWorking(bound.law, begin(bound), {now: 1, ports: ports(bound, denials)}).record;
    assert.deepEqual([mid.status, mid.cursor], ['running', 1]);
    const saved = JSON.parse(JSON.stringify({working: serializeWorking(mid), book: serializeRecipes({recipes: [gift, taught], denials})}));
    const restored = restoreRecipes(saved.book);
    const again = bindRecipe(moveBook, restored.recipes[0]);
    const resumed = settleWorking(again.law, restoreWorking(again.law, saved.working), {now: 9, ports: ports(again, restored.denials)}).record;
    assert.deepEqual(resumed, jump);
    // A save restores only against the same record: the taught move is another working.
    assert.throws(() => restoreWorking(bindRecipe(moveBook, restored.recipes[1]).law, saved.working), /different law/);
    assert.deepEqual(restored.recipes[0], gift);
    assert.throws(() => restoreRecipes({...saved.book, recipes: [saved.book.recipes[0], saved.book.recipes[0]]}), /Duplicate/);

    // A check's result is fixed by its address: the same check after a restore finds the same thing.
    const draw = address => [...address].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 1000, 7);
    const check = rec => checkRecipe(moveBook, rec, routes.deduce, {id: 'check.saved', by: 'disciple', at: 3, draw, scene: scene()});
    assert.deepEqual(check(restored.recipes[1]).check, check(taught).check);
    assert.equal(quoteWorking(bound.law, bound.method, {id: 'q', bindings: bindings(), at: 0, ports: {read}}).ok, true);
});
