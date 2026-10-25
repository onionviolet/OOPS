import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {PROFILE, enrollGrowth, validateGrowthState, growthBonuses, beginAward, settleAward, consumeTonic, setBackground, advanceBackground, backgroundEligibility, growthView, quoteTonicAcquisition} from '../src/absorb_p23/growth_profile/profile.js';
import {observeGrowthEarned, earnedNativeSkillDelta, validateGrowthEarned, noHealGrowthVitals} from '../src/absorb_p23/host_joins/growth_profile.js';

// growth_profile: original fixture scope retained.
{
const context = (extra = {}) => ({worldId: PROFILE.worldId, profileId: PROFILE.id, bodyId: 'visitor.body.1', bodySupported: true,
    nativeAlive: true, ownsSave: true, saveBlocked: false, nativeEligible: true, known: true, idle: true, clock: 0,
    conditionEligible: true, resourcesEligible: true, occupation: {kind: 'reading', jobId: 'native.read.1', eligible: true},
    conflictingAction: false, bodyConflict: false, resourceConflict: false, ...extra});
const begin = () => enrollGrowth(context());
const reload = x => validateGrowthState(JSON.parse(JSON.stringify(x)));
function finish(state) {
    const crossed = [], deltas = {max_health: 0, max_stamina: 0};
    let rounds = 0;
    do {
        const p = settleAward(state, context(), 2);
        state = reload(p.next); crossed.push(...p.crossed);
        for (const [key, value] of Object.entries(p.nativeDelta.stats)) deltas[key] += value.flat;
        assert.ok(++rounds < 64);
    } while (state.award.remaining);
    return {state, crossed, deltas, rounds};
}
test('old optional state remains absent with no default profile or bonuses', () => {
    assert.equal(validateGrowthState(undefined), undefined);
    assert.deepEqual(growthBonuses(undefined, context()), {stats: {}, xp_multipliers: {}});
    assert.equal(growthView(undefined, context()), null);
});
test('enrollment requires current world/body, learned preparation and save custody', () => {
    for (const patch of [{worldId: 'base.frontier'}, {profileId: 'native'}, {bodySupported: false}, {bodyId: ''},
        {nativeAlive: false}, {ownsSave: false}, {saveBlocked: true}, {nativeEligible: false}, {known: false}]) {
        assert.throws(() => enrollGrowth(context(patch)));
    }
    assert.equal(begin().background.enabled, false);
});
test('two funded acquisitions and consumptions propose exact native health and item costs', () => {
    let state = begin(), money = 100, stock = 3, inventory = 0;
    for (let sequence = 1; sequence <= 2; sequence++) {
        const q = quoteTonicAcquisition(state, context({shopEligible: true}), {money, stockCount: stock});
        money -= q.moneyCost; stock -= q.stockCost; inventory += q.count;
        const p = consumeTonic(state, context(), {sequence, inventoryCount: inventory});
        assert.deepEqual(p.nativeDelta, {stats: {max_health: {flat: 2}}, xp_multipliers: {}});
        inventory -= p.itemCost; state = reload(p.next);
    }
    assert.equal(money, 50); assert.equal(stock, 1); assert.equal(inventory, 0);
    assert.deepEqual(growthBonuses(state, context()).stats, {max_health: {flat: 4}});
});
test('tonic source projection rebuilds once, while replay does not consume another item', () => {
    const first = consumeTonic(begin(), context(), {sequence: 3, inventoryCount: 1});
    const restored = reload(first.next);
    const replay = consumeTonic(restored, context(), {sequence: 3, inventoryCount: 0});
    assert.equal(replay.itemCost, 0); assert.deepEqual(replay.nativeDelta.stats, {});
    assert.deepEqual(replay.nativeProjection.stats, {max_health: {flat: 2}});
    assert.deepEqual(restored, first.next);
});
test('repeat tonics have no lifetime once limit', () => {
    let state = begin();
    for (let sequence = 1; sequence <= 250; sequence++) state = consumeTonic(state, context(), {sequence, inventoryCount: 1}).next;
    assert.equal(growthBonuses(state, context()).stats.max_health.flat, 500);
});
test('unsupported bodies/profiles cannot buy, consume or receive projections', () => {
    const state = consumeTonic(begin(), context(), {sequence: 1, inventoryCount: 1}).next;
    for (const patch of [{bodyId: 'other.body'}, {profileId: 'native'}, {worldId: 'base.frontier'}, {bodySupported: false}]) {
        const c = context(patch);
        assert.throws(() => consumeTonic(state, c, {sequence: 2, inventoryCount: 1}));
        assert.throws(() => quoteTonicAcquisition(state, c, {money: 100, stockCount: 3}));
        assert.deepEqual(growthBonuses(state, c).stats, {});
    }
    assert.equal(growthView(state, context({known: false})), null);
});
test('unfunded shop, absent item, occupied body and native eligibility reject without mutation', () => {
    const state = begin(), before = structuredClone(state);
    for (const args of [{money: 24, stockCount: 1}, {money: 100, stockCount: 0}]) assert.throws(() => quoteTonicAcquisition(state, context({shopEligible: true}), args));
    assert.throws(() => consumeTonic(state, context(), {sequence: 1, inventoryCount: 0}));
    for (const patch of [{idle: false}, {known: false}, {nativeEligible: false}, {ownsSave: false}, {saveBlocked: true}]) assert.throws(() => consumeTonic(state, context(patch), {sequence: 1, inventoryCount: 1}));
    assert.deepEqual(state, before);
});
test('large 150000 XP settles iteratively, crossing each intended milestone exactly once', () => {
    const p = beginAward(begin(), context(), {sequence: 1, amount: 150000});
    assert.equal(p.next.xp, 0);
    const f = finish(reload(p.next));
    assert.ok(f.rounds > 1); assert.equal(f.state.xp, 150000); assert.equal(f.state.level, 10);
    assert.deepEqual(f.crossed, [2, 5, 10]); assert.deepEqual(f.deltas, {max_health: 3, max_stamina: 1});
    assert.deepEqual(settleAward(f.state, context()).nativeDelta.stats, {});
    assert.deepEqual(beginAward(f.state, context(), {sequence: 1, amount: 150000}).nativeDelta.stats, {});
    const next = finish(beginAward(f.state, context(), {sequence: 2, amount: 150000}).next);
    assert.equal(next.state.xp, 300000); assert.equal(next.state.level, 11); assert.deepEqual(next.crossed, []);
});
test('max finite safe award has finite save/view, no recursive settlement or numeric cap', () => {
    const f = finish(beginAward(begin(), context(), {sequence: 1, amount: Number.MAX_SAFE_INTEGER}).next);
    assert.equal(f.state.xp, Number.MAX_SAFE_INTEGER); assert.equal(f.state.level, 46);
    assert.equal(growthView(f.state, context()).nextTotalXP, null);
    assert.deepEqual(f.crossed, [2, 5, 10]);
    assert.throws(() => beginAward(f.state, context(), {sequence: 2, amount: 1}), /finite/);
});
test('invalid/overflow awards, altered receipts and concurrent awards reject atomically', () => {
    const state = begin(), before = structuredClone(state);
    for (const amount of [NaN, Infinity, -1, 0, 1.2, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => beginAward(state, context(), {sequence: 1, amount}));
    const pending = beginAward(state, context(), {sequence: 1, amount: 150000}).next;
    assert.throws(() => beginAward(pending, context(), {sequence: 2, amount: 50}), /pending/);
    assert.throws(() => beginAward(pending, context(), {sequence: 1, amount: 2}), /receipt/);
    assert.throws(() => beginAward(state, context({nativeEligible: false}), {sequence: 1, amount: 100}));
    assert.deepEqual(state, before);
});
test('supported background progresses during reading on native minutes with replay protection', () => {
    let state = setBackground(begin(), context(), true).next;
    for (let clock = 1; clock <= 100; clock++) {
        const p = advanceBackground(state, context({clock}), clock);
        assert.equal(p.eligible, true); assert.equal(p.minutes, 1); state = reload(p.next);
    }
    assert.equal(state.xp, 100); assert.equal(state.level, 1);
    assert.equal(advanceBackground(state, context({clock: 100}), 100).minutes, 0);
    assert.throws(() => advanceBackground(state, context({clock: 101}), 100), /fresh/);
});
test('real body/resources/action conflicts block honestly and blocked time earns nothing later', () => {
    let state = setBackground(begin(), context(), true).next, clock = 0;
    for (const patch of [{conflictingAction: true}, {bodyConflict: true}, {resourceConflict: true}, {conditionEligible: false},
        {resourcesEligible: false}, {nativeEligible: false}, {bodyConflict: undefined}, {resourceConflict: undefined}, {occupation: {kind: 'combat', jobId: 'fight.1', eligible: true}},
        {occupation: {kind: 'reading', jobId: 'read.1', eligible: false}}, {ownsSave: false}]) {
        const c = context({...patch, clock: ++clock});
        assert.equal(backgroundEligibility(state, c).eligible, false);
        state = advanceBackground(state, c, clock).next;
        assert.equal(state.xp, 0);
    }
    state = advanceBackground(state, context({clock: ++clock}), clock).next;
    assert.equal(state.xp, 1);
});
test('disabled background and unchecked time leaps cannot invent elapsed rewards', () => {
    let state = advanceBackground(begin(), context({clock: 30}), 1).next;
    assert.equal(state.xp, 0);
    state = setBackground(state, context({clock: 30}), true).next;
    assert.throws(() => advanceBackground(state, context({clock: 32}), 2), /per native minute/);
    assert.throws(() => advanceBackground(state, context({clock: 29}), 2), /clock/);
    state = setBackground(state, context({clock: 31}), false).next;
    assert.equal(advanceBackground(state, context({clock: 50}), 2).next.xp, 0);
});
test('unsupported/malformed imports reject before any mutation', () => {
    const state = begin();
    for (const patch of [{schema: 2}, {xp: Infinity}, {level: 5}, {bodyId: ''}, {tonics: Number.MAX_SAFE_INTEGER},
        {award: {sequence: 1, amount: 5, remaining: 6}}, {background: {enabled: true, lastClock: -1}}, {extra: 1}]) {
        const x = {...structuredClone(state), ...patch}, before = structuredClone(x);
        assert.throws(() => validateGrowthState(x)); assert.deepEqual(x, before);
    }
});
test('literal JSON fixture imports preserve complete old envelope, pending and completed state without reapplying bonuses', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'p23-growth-contract-'));
    try {
        const old = {character: {money: 102}, levels: {person: {main_character: {skill_xp: {Running: 123}}}}, is_reading: 'ABC for kids'};
        for (const state of [undefined, beginAward(begin(), context(), {sequence: 1, amount: 150000}).next,
            finish(beginAward(consumeTonic(begin(), context(), {sequence: 1, inventoryCount: 1}).next, context(), {sequence: 1, amount: 150000}).next).state]) {
            const envelope = structuredClone(old);
            if (state) envelope.p23_growth_profile = state;
            await writeFile(join(dir, 'literal.json'), JSON.stringify(envelope));
            const imported = JSON.parse(await readFile(join(dir, 'literal.json'), 'utf8'));
            validateGrowthState(imported.p23_growth_profile);
            assert.deepEqual(imported, envelope);
            assert.deepEqual(imported.levels, old.levels);
            if (state?.award.remaining === 0) assert.deepEqual(settleAward(imported.p23_growth_profile, context()).nativeDelta.stats, {});
        }
    } finally {await rm(dir, {recursive: true});}
});

}

// p23-host-joins-growth: original fixture scope retained.
{
const c={worldId:PROFILE.worldId,profileId:PROFILE.id,bodyId:'native.player.body',bodySupported:true,nativeAlive:true,ownsSave:true,saveBlocked:false,nativeEligible:true,known:true,idle:true,clock:0,conditionEligible:true,resourcesEligible:true,occupation:{kind:'reading',jobId:'native.read.1',eligible:true},conflictingAction:false,bodyConflict:false,resourceConflict:false};
test('old accumulated XP is not backfilled; actual positive native deltas retain hundredths',()=>{
 const profile=enrollGrowth(c),before={Literacy:900000},after={Literacy:900000};
 assert.equal(observeGrowthEarned(undefined,profile,c,{before,after,sequence:1}).counter,undefined);
 const r=observeGrowthEarned(undefined,profile,c,{before,after:{Literacy:900000.25},sequence:1});assert.equal(r.counter.earnedUnits,25);assert.equal(r.counter.awardedUnits,0);
 assert.equal(earnedNativeSkillDelta({Cooking:10,Alchemy:20},{Cooking:11,Alchemy:20}),100);
});
test('each further earned threshold can fund a bounded reward without a lifetime once gate',()=>{
 let profile=enrollGrowth(c),counter;
 const first=observeGrowthEarned(counter,profile,c,{before:{Literacy:0},after:{Literacy:150000},sequence:1});counter=first.counter;profile=first.profile;
 assert.equal(counter.awardedUnits,15000000);assert.equal(profile.award.remaining,150000);
 assert.equal(observeGrowthEarned(counter,profile,c,{before:{Literacy:0},after:{Literacy:150000},sequence:1}).counted,false);
 while(profile.award.remaining)profile=settleAward(profile,c,8).next;
 const second=observeGrowthEarned(counter,profile,c,{before:{Literacy:150000},after:{Literacy:300000},sequence:2});assert.equal(second.counter.awardedUnits,30000000);assert.equal(second.profile.award.remaining,150000);
});
test('unsupported contexts and schemas do not count or mutate future grant receipts',()=>{
 const profile=enrollGrowth(c),before=structuredClone(profile);
 const r=observeGrowthEarned(undefined,profile,{...c,worldId:'base.frontier'},{before:{},after:{Literacy:1},sequence:1});assert.equal(r.counter,undefined);assert.deepEqual(profile,before);
 assert.throws(()=>validateGrowthEarned({schema:2}));
});
test('growth maximum-vital source preserves absolute health and stamina, including clamping departure',()=>{
 const stats={full:{max_health:60,health:22,max_stamina:40,stamina:15},total_multiplier:{max_health:1,max_stamina:1}};
 const next=noHealGrowthVitals({}, {max_health:2},stats);assert.equal(next.hpToFull,40);assert.equal(next.staminaToFull,25);
 const departure=noHealGrowthVitals({max_health:2},{},{...stats,full:{...stats.full,max_health:62,health:61}});assert.equal(departure.hpToFull,0);
});

}

