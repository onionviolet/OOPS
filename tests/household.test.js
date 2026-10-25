import test from 'node:test';
import assert from 'node:assert/strict';
import {HOUSEHOLD as H, planHousehold, validateHousehold, householdRest} from '../src/absorb_p23/household/model.js';
import {commitHousehold, preflightHouseholdImport, householdPresentation} from '../src/absorb_p23/household/host.js';
import {furnitureComfort} from '../src/absorb_b/furniture.js';
import {stageHouseholdJoin} from '../src/absorb_p23/host_joins/tranche_one.js';

// household: original fixture scope retained.
{
function rig() {
    let state;
    const c = {sequence: 0, clock: 0, homeId: 'test.owned-home', homeOwned: true, atHome: true,
        alive: true, controlled: true, animalKnown: true, hearthOwned: true, wet: false, knownGift: true,
        ownedInventory: {[H.fuelKey]: 3, [H.giftKey]: 0}};
    const run = (type, extra = {}) => {
        const plan = planHousehold(state, {type, sequence: c.sequence + 1, clock: c.clock, ...extra}, c);
        // Deliberate mock atomic native publisher. Not native gameplay evidence.
        for(const e of plan.effects) {
            if(e.type === 'item') c.ownedInventory[e.key] += e.amount;
            if(e.type === 'removeCondition') c.wet = false;
        }
        state = plan.state; c.sequence++; return plan;
    };
    return {c, run, state: () => state, tick(n) {c.clock += n; return run('tick', {elapsed: n});},
        load(s) {state = preflightHouseholdImport(s, c.clock, c.sequence);}};
}
test('optional old-save state is absent and ticks grant nothing', () => {
    const r = rig(); r.tick(100);
    assert.equal(r.state(), undefined); assert.equal(validateHousehold(undefined), undefined);
    assert.equal(householdRest(undefined, r.c), 1);
});
test('repeated real visits bond, mature and give recurring paid-publisher gifts', () => {
    const r = rig(); r.run('meet');
    assert.throws(() => r.run('pet'), /five played/);
    r.tick(5); r.run('pet'); assert.equal(r.state().animal.bond, 20);
    r.tick(5); r.run('pet'); assert.equal(r.state().animal.adopted, true);
    assert.equal(householdRest(r.state(), r.c), 1.03);
    r.tick(50); r.run('pet'); assert.equal(r.c.ownedInventory[H.giftKey], 1);
    const saved = JSON.parse(JSON.stringify(r.state())); r.load(saved);
    assert.throws(() => r.run('pet'), /five played/);
    r.tick(5); r.run('pet'); assert.equal(r.c.ownedInventory[H.giftKey], 1);
    r.tick(55); r.run('pet'); assert.equal(r.c.ownedInventory[H.giftKey], 2);
    r.tick(1320); assert.equal(r.state().animal.ageMinutes, 1440);
    assert.equal(householdRest(r.state(), r.c), 1.05);
});
test('known gift gating suppresses undiscovered output without using up opportunity', () => {
    const r = rig(); r.run('meet'); r.tick(5); r.run('pet'); r.tick(55);
    r.c.knownGift = false; r.run('pet'); assert.equal(r.state().animal.gifts, 0);
    r.c.knownGift = true; r.tick(5); r.run('pet'); assert.equal(r.state().animal.gifts, 1);
});
test('real log is debited once, burn is bounded, Wet drying needs actual warmth', () => {
    const r = rig(); r.run('light'); assert.equal(r.c.ownedInventory[H.fuelKey], 2);
    assert.throws(() => r.run('light'), /unlit/);
    r.c.wet = true; r.tick(2); assert.equal(r.c.wet, true);
    r.tick(1); assert.equal(r.c.wet, false);
    r.tick(30); assert.equal(r.state().hearth.fuelMinutes, 0);
    r.c.wet = true; r.tick(3); assert.equal(r.c.wet, true);
    assert.equal(r.c.ownedInventory[H.fuelKey], 2);
});
test('smoke is opt-in; vent, extinguish and native exit remove exposure', () => {
    const r = rig(); r.run('light'); r.run('close_vent');
    r.tick(3); assert.equal(r.state().hearth.smoke, 0);
    r.run('smoke_on'); r.tick(3); assert.equal(r.state().hearth.smoke, 3);
    assert.equal(householdRest(r.state(), r.c, {score: 2}), 1);
    const vent = r.run('ventilate'); assert.equal(r.state().hearth.smoke, 0);
    assert.equal(vent.effects.at(-1).active, false);
    r.run('close_vent'); r.tick(2); r.c.atHome = false;
    assert.equal(r.run('leave').effects.at(-1).active, false);
    r.tick(2); assert.equal(r.state().hearth.smoke, 0);
    r.c.atHome = true; r.run('extinguish'); assert.equal(r.state().hearth.fuelMinutes, 0);
});
test('reloading preserves pending animal/hearth exactly, no retroactive upkeep', () => {
    const r = rig(); r.run('meet'); r.run('light'); r.c.wet = true; r.tick(2);
    const saved = structuredClone(r.state()), inventory = structuredClone(r.c.ownedInventory);
    r.load(JSON.parse(JSON.stringify(saved))); assert.deepEqual(r.state(), saved);
    r.tick(0); assert.equal(r.state().hearth.fuelMinutes, saved.hearth.fuelMinutes);
    assert.equal(r.state().hearth.dryProgress, 2); assert.deepEqual(r.c.ownedInventory, inventory);
    r.tick(1); assert.equal(r.c.wet, false);
});
test('invalid schemas and forged fields reject before mutating input', () => {
    const r = rig(); r.run('meet'); const saved = r.state();
    assert.throws(() => preflightHouseholdImport(saved, r.c.clock + 1, r.c.sequence), /no catch-up/);
    for(const change of [s => s.schema = 2, s => s.hearth.fuelMinutes = -1,
        s => s.animal.bond = NaN, s => s.animal.ageMinutes = 100,
        s => s.animal.id = 'future.secret', s => s.extra = true, s => s.lastSequence = 999]) {
        const bad = structuredClone(saved); change(bad);
        assert.throws(() => preflightHouseholdImport(bad, r.c.clock, r.c.sequence), /Household/);
        assert.deepEqual(r.state(), saved);
    }
});
test('custody, home, body, discovered identity and root clock preflight gate commands', () => {
    for(const flag of ['homeOwned', 'atHome', 'alive', 'controlled', 'animalKnown']) {
        const r = rig(); r.c[flag] = false; assert.throws(() => r.run('meet'), /Household/);
    }
    const r = rig(); r.c.ownedInventory[H.fuelKey] = 0; assert.throws(() => r.run('light'), /unborrowed/);
    r.run('meet'); r.c.clock = 5; assert.throws(() => r.run('pet'), /settle/);
    assert.throws(() => r.run('tick', {elapsed: 10}), /played delta/);
    assert.throws(() => planHousehold(r.state(), {type: 'pet', clock: 5, sequence: 1}, r.c), /stale/);
});
test('atomic host contract prevents duplicate publication and partial preflight failure', () => {
    const r = rig(); let root = {household: undefined, context: structuredClone(r.c)};
    let published = 0;
    const host = {read: () => structuredClone(root), preflight: () => true, publish(plan, snapshot) {
        assert.equal(snapshot.context.sequence, root.context.sequence);
        root.household = plan.state; root.context.sequence++; published++; return root;
    }};
    commitHousehold(host, {type: 'meet', sequence: 0});
    assert.throws(() => commitHousehold(host, {type: 'meet', sequence: 0}), /changed terms/);
    assert.equal(published, 1);
    host.preflight = () => false; const before = structuredClone(root);
    assert.throws(() => commitHousehold(host, {type: 'light', sequence: 1}), /refused/);
    assert.deepEqual(root, before);
});
test('comfort derives distinct active fixtures, never inventory price or copies', () => {
    const row = (id, active = true) => ({id, active});
    const comfort = furnitureComfort({rows: [row('native.bedding'), row('shack.drying_rack'),
        row('shack.drying_rack'), row('proto23.bed', false), row('proto23.home_kit'), row('native.read_books')]});
    assert.equal(comfort.score, 2); assert.equal(comfort.label, 'Settled');
    const r = rig(); r.run('meet'); assert.equal(householdRest(r.state(), r.c, comfort), 1.02);
    r.c.atHome = false; assert.equal(householdRest(r.state(), r.c, comfort), 1);
});
test('known Here presentation hides undiscovered identity and uses sequenced public actions', () => {
    const r = rig(); const input = {state: {}, locationId: 'Shack'};
    let view = householdPresentation({household: r.state(), context: r.c, furnitureInput: input});
    assert.equal(view.visible, true); assert.ok(view.sections[0].actions.every(a => a.command.sequence === 0));
    r.run('meet'); r.c.animalKnown = false;
    view = householdPresentation({household: r.state(), context: r.c, furnitureInput: input});
    assert.equal(JSON.stringify(view).includes('Moss'), false);
    r.c.atHome = false; assert.equal(householdPresentation({household: r.state(), context: r.c, furnitureInput: input}).visible, false);
});

}

// p23-host-joins-tranche-one: original fixture scope retained.
{
const plan=clock=>({state:{clock,sequence:1},gameplay:{player:{inventory:{},skills:{Famine:{xp:0,enabled:true},'Cold resistance':{xp:0,enabled:true}},reputation:{}}}});
const context={played:true,homeWorld:true,needsFood:true,pacing:{schema:1,hungerEnabled:true,fullness:20},maxStamina:40,staminaToFull:0};
test('household fuel preflight rejects denied custody before any native owner publication',()=>{
 const p=plan(0),c={sequence:0,clock:0,homeId:'base.frontier:Shack',atHome:true,homeOwned:true,alive:true,controlled:true,hearthOwned:true,ownedInventory:{'{"id":"Rough wood log"}':1},assertDisposition:()=>{throw Error('borrowed');}};
 p.gameplay.player.inventory={'{"id":"Rough wood log"}':1};const before=structuredClone(p);
 assert.throws(()=>stageHouseholdJoin(p,undefined,c,'light'),/borrowed/);assert.deepEqual(p,before);
});

}

