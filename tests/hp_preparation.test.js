import test from 'node:test';
import assert from 'node:assert/strict';
import {hpPreparationTerms, planHpPreparation, validateHpPreparationReceipt, projectHpPreparation} from '../src/hp_preparation.js';
import {HP, resolveBrew} from '../src/hp_brewing_state.js';

const fine = 'book.hp.prep.powder_fine', coarse = 'book.hp.prep.powder_coarse';
const raw = () => ({id: 'L1', ingredient: 'book.hp.ing.bicorn_horn', form: 'raw', variant: null, acquiredAt: 4,
    route: 'book.hp.route.trusted_supplier', custody: 'owned', claim: 'Acquired lot',
    truth: {provenance: 'other', stewedMinutes: 0}, known: {provenance: 'unknown', assayed: false, stewed: false}, stew: null});
const request = (lot = raw(), variantId = fine) => ({lot, variantId, now: 8, purse: 10, apparatusAvailable: true});

test('paid preparation changes actual formula fit without mutating source or inventing identity', () => {
    const source = raw(), before = structuredClone(source);
    const slots = Object.fromEntries(HP.formula.slots.map(slot => [slot.id, {ingredient: slot.ingredient, form: slot.form, variant: null,
        truth: {provenance: slot.provenance ?? null, stewedMinutes: slot.minStewMinutes ?? 0}}]));
    slots.bicorn = source;
    assert.equal(resolveBrew(slots, HP.rules.cauldronStart).grade, 'original');
    const good = planHpPreparation(request(source));
    assert.equal(resolveBrew({...slots, bicorn: good.lot}, HP.rules.cauldronStart).grade, 'canon');
    const rough = planHpPreparation(request(source, coarse));
    assert.equal(resolveBrew({...slots, bicorn: rough.lot}, HP.rules.cauldronStart).grade, 'degraded');
    assert.deepEqual([good.cost.coins, rough.cost.coins], [2, 1]);
    assert.deepEqual(source, before);
    for(const key of ['id', 'ingredient', 'acquiredAt', 'route', 'custody', 'claim', 'truth', 'known']) assert.deepEqual(good.lot[key], source[key]);
    assert.deepEqual(good.receipt.accounting, {unit: 'recipe-portion', input: 1, yield: 1, waste: 0});
    assert.match(good.summary, /paid labor.*ORIGINAL/);
});

test('unfunded, unavailable, stale-prepared and incompatible preparation refuse without changing a lot', () => {
    const source = raw(), before = structuredClone(source);
    assert.throws(() => planHpPreparation({...request(source), purse: 1}), /costs 2/);
    assert.throws(() => planHpPreparation({...request(source), apparatusAvailable: false}), /unavailable/);
    assert.throws(() => planHpPreparation({...request(source), apparatusAvailable: undefined}), /unavailable/);
    assert.throws(() => planHpPreparation({...request(source), now: 3}), /played clock/);
    assert.throws(() => planHpPreparation(request({...source, stew: {startedAt: 4}})), /raw lot/);
    assert.throws(() => planHpPreparation(request(source, 'book.hp.prep.shred_fine')), /cannot receive/);
    const made = planHpPreparation(request(source));
    assert.throws(() => planHpPreparation(request(made.lot)), /raw lot/);
    assert.deepEqual(source, before);
    assert.equal(planHpPreparation(request(source)).cost.coins, 2, 'recovery after failed quote uses the same paid mechanism');
});

test('paid or borrowed source is not permanent apparatus access or broader demonstrated conditions', () => {
    const borrowed = {...raw(), custody: 'borrowed'};
    const first = planHpPreparation(request(borrowed));
    assert.equal(first.lot.custody, 'borrowed');
    const next = {...raw(), id: 'L2'};
    assert.equal(planHpPreparation(request(next)).cost.coins, first.cost.coins);
    assert.throws(() => planHpPreparation({...request(next), apparatusAvailable: false}), /unavailable/);
    assert.equal(first.receipt.after.variant, fine);
    assert.equal(Object.hasOwn(first.receipt, 'tolerance'), false);
    assert.equal(Object.hasOwn(first.receipt, 'learnedApparatus'), false);
});

test('retained receipt roundtrip validates exact variant, cost, source identity and portion accounting', () => {
    const made = planHpPreparation(request()), restored = JSON.parse(JSON.stringify(made.lot));
    assert.deepEqual(validateHpPreparationReceipt(restored.preparation, restored), made.receipt);
    for(const alter of [r => {r.revision = 2;}, r => {r.accounting.yield = 2;}, r => {r.means.laborCoins = 0;},
        r => {r.after.variant = coarse;}, r => {r.secret = 'hidden';}]) {
        const bad = structuredClone(made.receipt); alter(bad);
        assert.throws(() => validateHpPreparationReceipt(bad));
    }
    assert.throws(() => validateHpPreparationReceipt(made.receipt, {...restored, id: 'other'}), /differs/);
    assert.throws(() => validateHpPreparationReceipt(made.receipt, {...restored, acquiredAt: 9}), /differs/);
    assert.throws(() => validateHpPreparationReceipt(made.receipt, restored, 7), /time/);
});

test('public preparation evidence stays equal when concealed provenance differs', () => {
    const a = raw(), b = raw(); b.truth.provenance = 'full_moon';
    const p = planHpPreparation(request(a)), q = planHpPreparation(request(b));
    assert.deepEqual(projectHpPreparation(p.receipt), projectHpPreparation(q.receipt));
    assert.notDeepEqual(p.lot.truth, q.lot.truth);
    const visible = projectHpPreparation(p.receipt); visible.means.laborCoins = 0;
    assert.equal(p.receipt.means.laborCoins, 2);
});

test('existing hand-shredding variants use supported forms and declared labor without fuel', () => {
    for(const variantId of ['book.hp.prep.shred_fine', 'book.hp.prep.shred_ragged']) {
        const lot = {...raw(), ingredient: 'book.hp.ing.boomslang_skin'};
        const p = planHpPreparation(request(lot, variantId));
        assert.equal(p.lot.form, 'shredded'); assert.deepEqual(p.cost, {coins: 1, fuel: 0});
    }
    assert.throws(() => hpPreparationTerms('unpublished-variant'), /supported/);
});
