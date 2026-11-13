// The Gu aperture: the sea by rank and stage, recovery, stones, the wall, the rank break,
// holds, strain and foreign essence. Canon fixed points are named where a test lands on one (AD49).
import test from 'node:test';
import assert from 'node:assert/strict';
import {APERTURE_LAW as LAW, apertureAccounts, apertureFuel, apertureOrganRecord, aperturePool, essencePotency, quoteStoneRefill,
    readAperture} from '../src/gu_aperture.js';
import {GU_APERTURE, apertureHolder, createGuAperturePack} from '../src/world_substrate_packs/gu_aperture.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {advanceEngineWorld, createEngineWorld, engineReceipts, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {settleCosts} from '../src/cost_owner.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {createLivingBodyPack} from '../src/world_substrate_packs/living_body.js';
import {resolveGuActivation} from '../src/gu_activation.js';
import {apertureOrgan} from '../src/living_body.js';

const rules = composeSubstrate({packs: [createGuAperturePack()]});
const hall = {id: 'hall', kind: 'place'};
const master = spec => apertureHolder({id: 'me', place: 'hall', ...spec});
const world = (...bodies) => createWorld(rules, {holders: [hall, ...bodies]});
const tell = (w, kind, detail) => applyWorldOps(rules, w, [{op: 'publish', kind: `aperture.${kind}`, place: 'hall', detail: {target: 'me', ...detail}}], 'test');
const to = (w, clock) => advanceWorld(rules, w, clock);
const view = (w, id = 'me') => readAperture(w.holders[id]);
const pool = (w, rank, stage, id = 'me') => w.holders[id].quantities[aperturePool(rank, stage)] ?? 0;
const heard = (w, kind) => w.chain.filter(row => row.kind === `aperture.${kind}`);
const percent = motes => motes / (LAW.room / 100);

test('a C sea recovers four points of the aperture an hour and an A sea eight (ch10)', () => {
    const c = to(world(master({aptitude: 44, essence: 0})), 360).world;
    assert.equal(percent(pool(c, 1, 'initial')), 24); // "24% in 6 hours"
    const a = to(world(master({aptitude: 90, essence: 0})), 60).world;
    assert.equal(percent(pool(a, 1, 'initial')), 8);
    const full = to(c, 2000);
    assert.equal(percent(pool(full.world, 1, 'initial')), 44); // fills to the aptitude and stops
    assert.ok(full.segments <= 3);
    assert.deepEqual([view(c).grade, view(c).minutesToFull, view(full.world).minutesToFull], ['C', 300, 0]);
});

test('one jump, minute steps and a reload at every step settle the same sea', () => {
    let start = tell(world(master({aptitude: 44, essence: 30_000, stones: 2})), 'focus', {nurture: 900, absorb: true});
    start = tell(start, 'hold', {id: 'moonblade', motes: 5_000});
    const jump = to(start, 400).world;
    let steps = start;
    for (let t = 1; t <= 400; t++) steps = to(restoreWorld(rules, serializeWorld(steps)), t).world;
    assert.deepEqual(steps.holders.me.quantities, jump.holders.me.quantities);
    assert.deepEqual(steps.holders.me.state, jump.holders.me.state);
});

test('stones refill a resting master in about half an hour, and the quote says what would go unused (ch10, RIG38)', () => {
    const empty = world(master({aptitude: 44, essence: 0, stones: 3}));
    const quote = quoteStoneRefill(empty.holders.me, 3);
    assert.deepEqual([quote.gained, quote.unused, quote.stonesNeeded], [264_000, 456_000, 2]);
    const done = to(tell(empty, 'focus', {absorb: true}), 32).world; // a minute to open each stone
    assert.equal(view(done).total, view(done).capacity);
    assert.equal(view(done).stones, 1); // the second stone is open and part used; the third was never opened
    assert.ok(view(done).stoneLeft > 0);
    // Out of stones: absorbing stops by itself and says so.
    const dry = to(tell(world(master({aptitude: 44, essence: 0, stones: 0})), 'focus', {absorb: true}), 1).world;
    assert.equal(view(dry).absorbing, false);
    assert.equal(heard(dry, 'stones_out').length, 1);
});

test('nurturing with all a sea recovers, a C takes twice a B and four times an A to the middle stage (ch148)', () => {
    const minutes = aptitude => {
        const hourly = LAW.grades.filter(g => aptitude >= g.from).at(-1).hourlyPoints * LAW.room / 6000;
        let w = tell(world(master({aptitude, essence: 0})), 'focus', {nurture: hourly});
        w = to(w, 40_000).world;
        const row = heard(w, 'stage')[0];
        assert.equal(row.detail.stage, 'middle');
        return row.at;
    };
    const [c, b, a] = [44, 65, 90].map(minutes);
    assert.ok(Math.abs(c / b - 2) < 0.01, `C/B ${c / b}`);
    assert.equal(c / a, 4);
    assert.equal(c, 30_000); // authored wall: about 21 days of unbroken nurturing for a C
});

test('a new stage makes its own essence; the old essence stays apart and is pushed out as the sea refills (RIG9)', () => {
    let w = world(master({aptitude: 44, quantities: {aperture_wall: LAW.wallNeed[0] - 400}}));
    w = to(tell(w, 'focus', {nurture: 400}), 2).world;
    assert.deepEqual([view(w).stage, view(w).wall, view(w).nurturing], ['middle', 'water', {perMinute: 400}]);
    assert.equal(w.holders.me.state[GU_APERTURE].stage, 1);
    w = to(tell(w, 'focus', {nurture: 0}), 100).world;
    const initial = pool(w, 1, 'initial'), middle = pool(w, 1, 'middle');
    assert.ok(middle > 0 && initial + middle === view(w).capacity, 'the sea stays full while one essence replaces the other');
    assert.equal(essencePotency(LAW, 1, 'middle'), 2);
    assert.equal(view(w).worth, initial + middle * 2);
    // Refined essence poured on the wall goes as far as it is worth.
    let refined = world(master({aptitude: 44, essence: 0, quantities: {[aperturePool(1, 'middle')]: 6_000}}));
    refined = to(tell(refined, 'focus', {nurture: 1_000, pool: aperturePool(1, 'middle')}), 6).world;
    assert.equal(refined.holders.me.quantities.aperture_wall, 12_000);
    assert.equal(pool(refined, 1, 'middle'), 0);
});

test('the rank break: a lone 55% sea breaks the crystal wall at full force and 54% does not (ch91)', () => {
    const attempt = aptitude => {
        const w = tell(world(master({aptitude, stage: 'peak'})), 'focus', {strike: LAW.break.strikeMax});
        return to(w, 300).world;
    };
    const through = attempt(55);
    assert.deepEqual([view(through).rank, view(through).stage, view(through).essence], [2, 'initial', 'red steel']);
    assert.equal(heard(through, 'rank').length, 1);
    assert.equal(view(through).striking, null);
    assert.ok(pool(through, 2, 'initial') > 0, 'the new rank makes its own essence');
    const short = attempt(54);
    assert.deepEqual([view(short).rank, view(short).stage], [1, 'peak']);
    // The sea ran out first, the strike ended and the wall closed.
    assert.equal(view(short).breakProgress.done, 0);
    assert.equal(heard(short, 'rank').length, 0);
    assert.equal(heard(short, 'strike_ended')[0].detail.reason, 'dry');
    assert.equal(view(short).striking, null);
    assert.equal(attempt(44).holders.me.state[GU_APERTURE].rank, 1);
    // A stopped strike closes fast.
    let paused = to(tell(world(master({aptitude: 55, stage: 'peak'})), 'focus', {strike: 6_000}), 30).world;
    assert.equal(view(paused).breakProgress.done, 150_000);
    paused = to(tell(paused, 'focus', {strike: 0}), 45).world;
    assert.equal(view(paused).breakProgress.done, 0);
});

test('a 44% sea breaks through on stones in about three days and ends near 20% (ch92)', () => {
    let w = world(master({aptitude: 44, stage: 'peak', stones: 200}));
    w = tell(w, 'focus', {strike: 1_073, absorb: true});
    const run = to(w, 6 * 1440);
    const broke = heard(run.world, 'rank')[0];
    assert.ok(broke, 'the wall breaks');
    const days = broke.at / 1440;
    assert.ok(days > 2.5 && days < 3.5, `${days} days`);
    const then = to(w, broke.at).world; // the sea at the minute the wall broke
    const left = percent(pool(then, 1, 'peak'));
    assert.ok(left > 17 && left < 23, `${left}% of the aperture left in the old essence`);
    const used = 200 - view(then).stones;
    assert.ok(used > 60 && used < 110, `${used} stones`);
    // Afterwards red steel essence forms and pushes the green copper out.
    assert.ok(pool(run.world, 2, 'initial') > 0 && pool(run.world, 1, 'peak') < pool(then, 1, 'peak'));
    assert.ok(run.segments < 1500, `${run.segments} segments for six days`);
});

test('a hold keeps essence for a working in flight; spending pays at the essence\'s worth', () => {
    let w = world(master({aptitude: 44, stage: 'middle', essence: 10_000}));
    w = tell(w, 'hold', {id: 'killer-move', price: 8_000}); // 8,000 rank-one initial motes is 4,000 middle motes
    assert.deepEqual(view(w).holds, [{id: 'killer-move', pool: aperturePool(1, 'middle'), amount: 4_000}]);
    assert.equal(view(w).free, 6_000);
    // A price takes the free essence and leaves the hold.
    w = tell(w, 'spend', {price: 12_000});
    assert.deepEqual([pool(w, 1, 'middle'), view(w).total, view(w).free, view(w).strain], [0, 4_000, 0, 0]);
    w = tell(w, 'spend', {price: 8_000, hold: 'killer-move'});
    assert.deepEqual([pool(w, 1, 'middle'), view(w).holds, view(w).strain], [0, [], 0]);
    // A second hold that the sea cannot cover holds what there is and says so.
    w = tell(to(w, 5).world, 'hold', {id: 'late', motes: 5_000});
    assert.equal(view(w).holds[0].amount, 2_000);
    assert.deepEqual(heard(w, 'short').at(-1).detail, {target: 'me', hold: 'late', wanted: 5_000, held: 2_000});
    w = tell(w, 'release', {id: 'late'});
    assert.equal(view(w).free, 2_000);
    // Nurturing does not touch a hold.
    let held = tell(world(master({aptitude: 44, essence: 9_000})), 'hold', {id: 'h', motes: 9_000});
    held = to(tell(held, 'focus', {nurture: 5_000}), 10).world;
    assert.deepEqual([pool(held, 1, 'initial'), view(held).holds[0].amount, view(held).total], [0, 9_000, 9_000]);
    assert.equal(held.holders.me.quantities.aperture_wall, 4_000); // only what recovery made
});

test('a price past the sea is paid as strain: the aperture cracks, holds less, and mends with rest (ch193)', () => {
    let w = world(master({aptitude: 44, essence: 10_000}));
    w = tell(w, 'spend', {price: 80_000});
    assert.equal(view(w).strain, 70_000);
    assert.deepEqual(heard(w, 'short')[0].detail, {target: 'me', price: 80_000, owed: 70_000, strain: 70_000});
    w = to(w, 1).world;
    assert.deepEqual([view(w).condition, view(w).capacity], ['cracked', 132_000]);
    assert.equal(heard(w, 'condition')[0].detail.condition, 'cracked');
    // A full sea in a cracking aperture loses what no longer fits.
    let brim = tell(world(master({aptitude: 44})), 'spend', {price: 264_000 + 61_000});
    brim = applyWorldOps(rules, brim, [{op: 'add', holder: 'me', quantity: aperturePool(1, 'initial'), amount: 200_000}], 'test');
    brim = to(brim, 1).world;
    assert.equal(view(brim).total, 132_000);
    assert.equal(heard(brim, 'overflow')[0].detail.lost, 68_400); // the minute's recovery went with it
    // Rest eases the strain; at none the crack has mended.
    const rested = to(w, 1 + 70_000 / LAW.strain.easePerMinute + 1).world;
    assert.deepEqual([view(rested).strain, view(rested).condition, view(rested).capacity], [0, 'intact', 264_000]);
    // Far past it, the aperture shatters and makes no more essence.
    const gone = to(tell(world(master({aptitude: 44, essence: 0})), 'spend', {price: 300_000}), 600).world;
    assert.deepEqual([view(gone).condition, view(gone).capacity, view(gone).total, view(gone).recoveryPerMinute], ['shattered', 0, 0, 0]);
    assert.deepEqual(apertureOrganRecord(gone.holders.me.state[GU_APERTURE]), {grade: 'C', rank: 1, condition: 'shattered'});
});

test('an elder\'s poured essence fills the sea, stays as foreign essence and slows the wall until cleansed (ch50, ch111)', () => {
    const elder = apertureHolder({id: 'elder', place: 'hall', aptitude: 70, rank: 3});
    let w = world(master({aptitude: 44, essence: 0}), elder);
    w = applyWorldOps(rules, w, [{op: 'publish', kind: 'aperture.pour', place: 'hall', detail: {target: 'me', from: 'elder', motes: 1_000}}], 'test');
    // 1,000 rank-three motes are worth 100,000 rank-one initial motes.
    assert.equal(pool(w, 1, 'initial'), 100_000);
    assert.equal(pool(w, 3, 'initial', 'elder'), 420_000 - 1_000);
    assert.equal(view(w).foreign, 100_000);
    assert.equal(view(w).wallProgress.permille, 622); // 100,000 of a 264,000 sea is foreign
    w = tell(w, 'cleanse', {});
    assert.deepEqual([view(w).foreign, view(w).wallProgress.permille], [0, 1000]);
    // More than fits is lost to the giver all the same.
    let flood = world(master({aptitude: 44, essence: 0}), elder);
    flood = applyWorldOps(rules, flood, [{op: 'publish', kind: 'aperture.pour', place: 'hall', detail: {target: 'me', from: 'elder', motes: 5_000}}], 'test');
    assert.deepEqual([pool(flood, 1, 'initial'), pool(flood, 3, 'initial', 'elder')], [264_000, 415_000]);
});

test('outside means temper the aperture: aptitude moves the cap and the pace, a relic lifts one small realm (RIG1, RIG5, RIG7)', () => {
    let w = tell(world(master({aptitude: 44})), 'temper', {aptitude: 9}); // the Blood Skull route, 44% to 53%
    assert.deepEqual([view(w).aptitude, view(w).capacity, view(w).minutesToFull], [53, 318_000, 135]);
    w = to(tell(w, 'temper', {aptitude: -11}), 1).world; // the burial recipe takes some back; the sea above the new cap is lost
    assert.deepEqual([view(w).aptitude, view(w).grade, view(w).total], [42, 'C', 252_000]);
    assert.equal(heard(w, 'overflow').length, 1);
    w = tell(w, 'temper', {aptitude: 40});
    assert.deepEqual([view(w).grade, view(w).recoveryPerMinute], ['A', 800]);
    w = tell(tell(w, 'focus', {nurture: 100}), 'temper', {stages: 1});
    assert.deepEqual([view(w).stage, heard(w, 'stage')[0].detail.by], ['middle', 'temper']);
    w = tell(w, 'temper', {stages: 5});
    assert.deepEqual([view(w).stage, view(w).nurturing, view(w).rank], ['peak', null, 1]); // a relic does not break a rank
});

test('a Gu is driven from the sea: the activation resolver reads the free essence and the sea pays the cost', () => {
    let w = tell(world(master({aptitude: 44, essence: 50_000})), 'hold', {id: 'ward', motes: 20_000});
    const {reserves, supply} = apertureFuel(w.holders.me, 'me');
    assert.deepEqual(reserves, {me: {[aperturePool(1, 'initial')]: 30_000}});
    const moonlight = {id: 'moonlight-1', kind: 'moonlight', rank: 1, fedThrough: 0};
    // A Moonblade is a tenth of a C sea at the initial stage (RIG15); 26,400 motes for this one.
    const ability = {fuel: 'primeval', cost: 26_400, effect: {kind: 'cut', magnitude: 10}};
    const cast = resolveGuActivation({stages: [{gu: moonlight, operator: 'me', ability, supply}], reserves, day: 0});
    assert.equal(cast.outcome, 'complete');
    w = tell(w, 'spend', {motes: cast.activations[0].cost, pool: supply.pool, only: true});
    assert.deepEqual([view(w).total, view(w).free, view(w).strain], [23_600, 3_600, 0]);
    // The second cut does not form: the held essence is not the caster's to spend.
    const again = resolveGuActivation({stages: [{gu: moonlight, operator: 'me', ability, supply: apertureFuel(w.holders.me, 'me').supply}],
        reserves: apertureFuel(w.holders.me, 'me').reserves, day: 0});
    assert.deepEqual([again.outcome, again.reason], ['interrupted', 'needs more essence']);
});

test('the engine world carries the aperture as the Gu world\'s own pack and saves it', () => {
    const config = {ownPacks: [createGuAperturePack()], packs: ['l.living_body', GU_APERTURE]};
    let engine = createEngineWorld({...config, holders: [hall, master({aptitude: 44, essence: 0, stones: 1})]});
    engine = advanceEngineWorld(engine, 90).engine;
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld(engine)));
    assert.deepEqual(saved.packs, ['l.living_body', GU_APERTURE]);
    const back = advanceEngineWorld(restoreEngineWorld(saved, {ownPacks: [createGuAperturePack()]}), 200).engine;
    const straight = advanceEngineWorld(engine, 200).engine;
    assert.deepEqual(back.world.holders.me, straight.world.holders.me);
    assert.equal(percent(view(back.world).total), 200 * 400 / 6000);
    // The body's organ record reads from the same aperture through the living-body organ law.
    const organ = apertureOrgan(apertureOrganRecord(back.world.holders.me.state[GU_APERTURE]),
        {rankCapacity: {1: LAW.room}, grades: {C: {seaPercent: 44}}, conditions: {cracked: 50}});
    assert.equal(organ.capacity, view(back.world).capacity);
    assert.ok(createLivingBodyPack);
});

// ---- the sea as the world's price list: workings publish cost rows and never name the aperture ----
const moonblade = guCatalogue.moonlight.ability.value.cost; // four workshop measures
const priceList = (w, options) => ({accounts: apertureAccounts(w.holders.me.state[GU_APERTURE], LAW,
    {kinds: ['essence', 'primeval_essence', 'energy:primeval.rank1'], unit: LAW.measure, ...options})});
const settle = (w, costs, options) => settleCosts({rules, world: w, costs, payer: 'me', cause: 'test', ...priceList(w, options)});

test('a published essence cost is paid from the sea at its worth: a Moonblade is a tenth of a C sea, a twentieth at the middle stage (RIG15, RIG5)', () => {
    // The two row shapes the Gu workings publish today: a bare quantity and a ranked energy key.
    const first = settle(world(master({aptitude: 44})), [{quantity: 'energy:primeval.rank1', payer: 'me', amount: moonblade}]);
    assert.equal(first.status, 'paid');
    assert.equal(percent(264_000 - view(first.world).total), 4.4); // a tenth of the 44% sea
    const second = settle(first.world, [{quantity: 'primeval_essence', amount: moonblade}]);
    assert.equal(percent(264_000 - view(second.world).total), 8.8);
    const middle = settle(world(master({aptitude: 44, stage: 'middle'})), [{kind: 'essence', amount: moonblade}]);
    assert.equal(percent(264_000 - view(middle.world).total), 2.2);
    assert.equal(middle.lines[0].paid[0].quantity, aperturePool(1, 'middle'));
    // Weaker essence left in the sea pays once the master's own is gone.
    const mixed = settle(world(master({aptitude: 44, stage: 'middle', essence: 6_600, quantities: {[aperturePool(1, 'initial')]: 50_000}})),
        [{kind: 'essence', amount: moonblade}]);
    assert.deepEqual([pool(mixed.world, 1, 'middle'), pool(mixed.world, 1, 'initial'), mixed.status], [0, 50_000 - 13_200, 'paid']);
});

test('a cost the sea cannot cover lands as a priced fault on the aperture, and held essence is not touched', () => {
    let w = tell(world(master({aptitude: 44, essence: 30_000})), 'hold', {id: 'ward', motes: 20_000});
    const cut = settle(w, [{kind: 'essence', amount: moonblade}]); // 26,400 wanted, 10,000 free
    assert.equal(cut.status, 'fault');
    assert.deepEqual([cut.faults[0].id, cut.faults[0].short, cut.faults[0].owed[0].quantity], ['aperture.overdrawn', 3, 'aperture_strain']);
    assert.deepEqual([view(cut.world).free, view(cut.world).holds[0].amount, view(cut.world).strain], [3_400, 20_000, 19_800]);
    // The working that owns the hold pays from it first.
    const ward = settle(w, [{kind: 'essence', amount: 3}], {hold: 'ward'});
    assert.deepEqual([ward.status, view(ward.world).holds[0].amount, view(ward.world).free], ['paid', 200, 10_000]);
    // A hold paid out in full is over at the next minute.
    const exact = tell(world(master({aptitude: 44, essence: 30_000})), 'hold', {id: 'ward', motes: 19_800});
    const spent = to(settle(exact, [{kind: 'essence', amount: 3}], {hold: 'ward'}).world, 1).world;
    assert.deepEqual(view(spent).holds, []);
});

test('a kernel working on the engine host pays its essence from the sea', () => {
    const law = defineWorkingLaw({id: 'test.moonblade', revision: 1, operations: {
        cut: {roles: {operator: 'operator'}, settle: ({bound}) => ({ok: true,
            costs: [{quantity: 'energy:primeval.rank1', payer: bound.operator.holder, amount: moonblade}], effects: []})}}});
    const method = {id: 'test.moonblade.cut', revision: 1, law: law.ref, roles: {operator: 'operator'},
        steps: [{op: 'cut', minutes: 1, bindings: {operator: 'operator'}}]};
    const body = {...master({aptitude: 44, essence: 30_000}), as: ['operator']};
    let engine = createEngineWorld({ownPacks: [createGuAperturePack()], packs: [GU_APERTURE], holders: [hall, body],
        host: {laws: [law], costs: {accounts: apertureAccounts(body.state[GU_APERTURE], LAW, {kinds: ['energy:primeval.rank1'], unit: LAW.measure})}}});
    const start = id => { engine = startEngineWorking(engine, {law, method, id, payer: 'me', bindings: {operator: {kind: 'operator', id: 'me'}}}); };
    start('cut.1');
    engine = advanceEngineWorld(engine, 2).engine;
    assert.equal(engineReceipts(engine, 'cut.1').at(-1).truth.paid.status, 'paid');
    assert.equal(view(engine.world).total, 30_000 - 26_400 + 2 * 400);
    start('cut.2'); // the sea has not recovered: the cut still lands and the aperture pays the rest
    engine = advanceEngineWorld(engine, 4).engine;
    assert.equal(engineReceipts(engine, 'cut.2').at(-1).truth.paid.status, 'fault');
    assert.ok(view(engine.world).strain > 0);
});
