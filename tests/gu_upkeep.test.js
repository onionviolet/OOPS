import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guKeeperLife as raw, kId as id, kKey as key, KEEPER_DAY as DAY, KEEPER_DIALS as DIAL, KEEPER_GU, keeperDiets} from '../src/world_packs/book_gu_keeper.js';
import {compileUpkeepEvents, nextMeal, starvation, sustainable, dailyCost, validateDiet, stipendAgreement} from '../src/living_upkeep.js';
import {validateObligations, createObligations, writeObligation} from '../src/obligations_ledger.js';
import {createContentRegistry, createExpansionState, advanceSimulation, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign, structuredCampaignView} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand} from '../src/simulation.js';
import {validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup(seed = 717) {
    const registry = createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash:hash(raw), starts:raw.starts.map(b => ({...b,snapshotHash:hash(b)}))};
    const base = createExpansionState(seed), nativeBody = {id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'};
    const context = {registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,nativeBody,busy:false,facts:{location:'Village'},external:{money:0},
        gameplay:{player:{inventory:{},skills:{Woodcutting:{xp:0,enabled:false}},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:{player:{}}};
    const selected = planStructuredSelection(base,d,context), start = beginStructuredCampaign(selected.plan.state,d,context,null,selected.selection);
    let p = start.plan;
    const ctx = () => ({...context,worldId:d.world.id,nativeBody:p.state.simulation.people.player.body,facts:{location:id('annex')},external:p.external,gameplay:p.gameplay,vitals:p.vitals});
    const publish = out => {const vitals = p.vitals; p = {...out,vitals:out.vitals||vitals}; for(const e of out.unlocks||[])if(e.kind==='skill')p.gameplay.player.skills[e.id].enabled=true;};
    return {registry,d,record:start.record,base,context,ctx,get p(){return p;},
        start(n) {const c=d.simulation.commands.find(c=>c.id===id(n));publish(commitSimulationCommand(p.state,registry,{id:id(n)},{...ctx(),targetId:c?.targetId}));},
        quote(n) {const c=d.simulation.commands.find(c=>c.id===id(n));return previewSimulationCommand(p.state,registry,id(n),{...ctx(),targetId:c?.targetId});},
        step(n) {publish(advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...ctx(),vitals:p.vitals.player,equipment:{}}}));},
        cancel() {publish(cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx()));},
        envelope() {const save={character:{money:0,equipment:{}},expansion:p.state,content_packs:{schema:1,packs:{},structured:start.record},'current location':id('annex'),inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};
            writeGameplayToEnvelope(save,p.gameplay,{player:{category:'person',id:'main_character'}});return save;}
    };
}

const reserve = f => f.p.state.simulation.energies.player[id('primeval')].reserve;
const gu = (f, s) => f.p.state.simulation.people[id(s)];
const larder = (f, s, food) => f.p.state.simulation.owners[id(s)]?.[key(food)] || 0;
const stones = f => f.p.gameplay.player.inventory[key('stone')] || 0;
test('seam: diet validation, compiled rows, prediction and the feeding cap are pure and exact', () => {
    const d = keeperDiets[0];
    assert.throws(() => validateDiet({...d, perMeal: 0}), /positive/);
    const rows = compileUpkeepEvents(d, {worldId: id('world'), ids: id});
    assert.deepEqual(rows.map(r => r.id.split('.').pop()), ['a_reset', 'b_death', 'c_meal', 'd_hunger', 'b_death_refined', 'c_meal_refined', 'd_hunger_refined']);
    assert.equal(nextMeal(d, 100, 0), DAY);
    // 8 petals = 2 meals of 4; condition 4 -> misses at boundary 3 (4->3), 4 (->2), 5 (->1), death at 6.
    const s = starvation(d, {stock: 8, condition: 4, now: 0});
    assert.deepEqual([s.meals, s.firstMiss, s.deathAt], [2, 3 * DAY, 6 * DAY]);
    const cap = sustainable([{id: 'a', perDay: 0.5}, {id: 'b', perDay: 0.25}, {id: 'c', perDay: 0.4}], 0.9);
    assert.deepEqual([cap.fed, cap.starving], [['a', 'b'], ['c']]);
    assert.equal(dailyCost(keeperDiets[1], 0.25), 0.125);
    assert.doesNotThrow(() => validateObligations(writeObligation(createObligations(), stipendAgreement({amount: 6, intervalDays: 7, paid: 0, remaining: 52}))));
});

test('pack compiles; holding more Gu than you can feed is allowed, refusal comes from price', () => {
    const f = setup();
    assert.equal(f.quote('take_worm').eligible, false); assert.match(f.quote('take_worm').reasons.join(' '), /4 primeval stones/);
    assert.equal(f.quote('take_moon').eligible, true);
});
test('scheduled starvation: three Gu, one fed, the others starve on the predicted minute; stipend and chores pay stones', () => {
    const f = setup(), d = id => keeperDiets.find(x => x.holder === id), buy = n => f.start(n);
    f.start('take_moon'); f.start('feed_moon');
    f.step(7 * DAY - f.p.state.clock);
    assert.equal(stones(f), DIAL.startStones + DIAL.stipendStones, 'stipend paid at the weekly boundary');
    assert.equal(gu(f, 'moon').life, 'dead', 'eight petals fed two meals, then four misses at condition 4 -> dead by day 7');
    // fresh start: feed the moon each time so only the bought Gu starve
    const g = setup(); g.step(7 * DAY - g.p.state.clock);
    g.start('chores'); g.step(DIAL.choreMinutes);
    assert.equal(stones(g), DIAL.startStones + DIAL.stipendStones + DIAL.choreStones);
    g.start('take_moon'); g.start('take_worm'); g.start('take_jade');
    assert.equal(stones(g), 0, '4 + 6 stones spent'); assert.equal(g.quote('take_worm').eligible, false);
    const t0 = g.p.state.clock;
    for(const slot of ['worm', 'jade']) {
        const diet = keeperDiets.find(x => x.holder === id(slot)), predicted = starvation(diet, {stock: 0, condition: 4, now: t0, anchor: 0});
        g.step(predicted.deathAt - 1 - g.p.state.clock); assert.equal(gu(g, slot).life, 'alive', slot + ' alive a minute before'); 
        g.step(1); assert.equal(gu(g, slot).life, 'dead', slot + ' dead on the predicted minute');
    }
});

test('refinement: failure injures the Gu (never kills) and cannot be repeated until it recovers; success makes it hardier', () => {
    const seen = new Set();
    for(let seed = 1; seed <= 40 && seen.size < 2; seed++) {
        const f = setup(seed); f.start('take_moon'); f.start('buy_lees'); f.start('buy_lees'.replace('lees', 'petals'));
        assert.equal(gu(f, 'moon').vitals.health, 4);
        f.p.state.simulation.seed = seed * 2654435761 % 4294967295 + 1; f.start('fuse'); const m = gu(f, 'moon');
        assert.equal(m.life, 'alive'); assert.equal(larder(f, 'moon', 'lees'), 0);
        assert.equal(f.p.gameplay.player.inventory[key('lees')], 2, '2 of 4 jars spent either way');
        if(m.vitals.health === 2) {
            seen.add('injured'); assert.equal(f.quote('fuse').eligible, false);
            f.start('feed_moon'); f.step(DAY); assert.equal(gu(f, 'moon').vitals.health, 3);
            assert.equal(f.quote('fuse').eligible, true, 'a fed Gu is allowed to try again');
        } else {
            seen.add('refined'); assert.equal(m.vitals.health, 4); assert.equal(f.quote('fuse').eligible, false);
            f.start('feed_moon'); f.step(DAY); assert.equal(larder(f, 'moon', 'petals'), 8 - 3, 'refined meal is 3 petals');
        }
    }
    assert.deepEqual([...seen].sort(), ['injured', 'refined']);
});
test('aperture: capacity is the aptitude cap, regeneration is hourly, rest cannot lift the cap', () => {
    const f = setup(); assert.equal(reserve(f), DIAL.startEssence); f.start('take_moon'); assert.equal(reserve(f), DIAL.startEssence - 1);
    f.step(60); assert.equal(reserve(f), DIAL.startEssence); f.step(10 * 60); assert.equal(reserve(f), DIAL.capacity);
    assert.equal(f.quote('rest').eligible, false);
});
import {validateKeeperEnvelope, keeperHouseView} from '../src/book_world_gu_keeper_domain.js';
const valid = f => { validateStructuredEnvelope(f.envelope()); validateKeeperEnvelope(f.envelope()); };
test('persistence: serialized load equals live state, validator accepts a played year and refuses tampering; coarse = fine stepping', () => {
    const f = setup(); f.start('take_moon'); f.start('feed_moon'); valid(f);
    f.step(3 * DAY + 17); valid(f);
    const saved = JSON.parse(JSON.stringify(f.envelope())); validateKeeperEnvelope(saved);
    assert.deepEqual(loadExpansionState(saved.expansion, f.registry), f.p.state);
    for(const change of [s => s.expansion.simulation.checks[id('stipend')].count++, s => { s.expansion.simulation.people[id('moon')].vitals.health = 9; }, s => { s.expansion.simulation.claims[id('moon_title')].owner = 'nobody'; },
        s => { s.expansion.simulation.owners[id('moon')][key('petals')] = -1; }, s => delete s.expansion.simulation.checks[id('regen')]]) {
        const bad = structuredClone(saved); change(bad); assert.throws(() => validateKeeperEnvelope(bad));
    }
    const coarse = setup(), fine = setup(); coarse.step(9 * DAY); while(fine.p.state.clock < 9 * DAY) fine.step(Math.min(47, 9 * DAY - fine.p.state.clock));
    assert.deepEqual(coarse.p.state, fine.p.state); valid(coarse);
});
test('house view: timers, gauge, cap and ledger read the save', () => {
    const f = setup(); f.start('take_moon'); f.start('feed_moon');
    const v = () => keeperHouseView(f.p.state, f.d, f.record, f.ctx());
    let h = v(); assert.equal(h.gauge.max, DIAL.capacity); assert.equal(h.stones, DIAL.startStones);
    const m = h.gu.find(x => x.id === 'moon'); assert.deepEqual([m.kept, m.mealsStocked, m.nextMealIn, m.starvesIn], [true, 2, DAY, 6 * DAY - f.p.state.clock]);
    assert.equal(h.gu.find(x => x.id === 'worm').kept, false); assert.match(h.feedingCap.line, /1 of 1/);
    f.step(7 * DAY - f.p.state.clock); h = v();
    assert.equal(h.ledger.lines[0].amount, DIAL.stipendStones); assert.equal(h.ledger.agreement.kind, 'coin'); assert.equal(h.ledger.nextStipendIn, 7 * DAY);
    f.start('chores'); f.step(DIAL.choreMinutes); f.start('buy_petals'); h = v();
    assert.deepEqual(h.ledger.lines.map(l => l.amount), [DIAL.stipendStones, DIAL.choreStones, 0, -1]);
    assert.equal(h.ledger.net, h.stones - DIAL.startStones, 'ledger nets to the change in stones');
    assert.equal(structuredCampaignView(f.p.state, f.d, f.record, f.ctx()).house.stones, h.stones);
});
test('a year and more: stipend stops after its 52 weeks and the saved schedule still validates', () => {
    const f = setup(); const total = 380 * DAY;
    while(f.p.state.clock < total) f.step(Math.min(5 * DAY, total - f.p.state.clock));
    console.log(JSON.stringify(f.p.state.simulation.checks[id("stipend")]), f.p.state.clock); assert.equal(stones(f), DIAL.startStones + DIAL.stipendStones * DIAL.stipendWeeks); valid(f);
    assert.equal(keeperHouseView(f.p.state, f.d, f.record, f.ctx()).ledger.nextStipendIn, null);
});
