import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guKeeperLife as raw, kId as id, kKey as key, KEEPER_DAY as DAY, KEEPER_DIALS as DIAL, KEEPER_GU, keeperDiets} from '../src/world_packs/book_gu_keeper.js';
import {compileUpkeepEvents, nextMeal, starvation, sustainable, dailyCost, validateDiet, stipendAgreement} from '../src/living_upkeep.js';
import {validateObligations, createObligations, writeObligation} from '../src/obligations_ledger.js';
import {createContentRegistry, createExpansionState, advanceSimulation, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack, registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {adoptStructuredExtension, planStructuredSelection, beginStructuredCampaign, structuredCampaignView} from '../src/structured_pack_runtime.js';
import {guKeeperRankTrial} from '../src/world_packs/book_gu_keeper_rank_trial.js';
import {guKeeperFireflyFarm} from '../src/world_packs/book_gu_keeper_firefly_farm.js';
import {guKeeperFireflyCare} from '../src/world_packs/book_gu_keeper_firefly_care.js';
import {guKeeperStargate} from '../src/world_packs/book_gu_keeper_stargate.js';
import {guKeeperStargateSky} from '../src/world_packs/book_gu_keeper_stargate_sky.js';
import {guKeeperFixedImmortalTravel} from '../src/world_packs/book_gu_keeper_fixed_immortal_travel.js';
import {guKeeperFixedForge} from '../src/world_packs/book_gu_keeper_fixed_forge.js';
import {readKeeperFixedClaim, keeperFixedSpecimen} from '../src/gu_keeper_fixed_claim.js';
import {guKeeperAttitude} from '../src/world_packs/book_gu_keeper_attitude.js';
import {guKeeperAntNest} from '../src/world_packs/book_gu_keeper_ant_nest.js';
import {guKeeperBeamProcedure} from '../src/world_packs/book_gu_keeper_beam_procedure.js';
import {guKeeperGoal} from '../src/world_packs/book_gu_keeper_goal.js';
import {guKeeperFusion} from '../src/world_packs/book_gu_keeper_fusion.js';
import {keeperFusionView} from '../src/gu_keeper_fusion.js';
import {keeperGoalView} from '../src/gu_keeper_goal.js';
import {applyKeeperDefense, applyKeeperDefenseResearch, defenseFacts, defenseFarBank, keeperDefense,
    keeperDefenseResearch, keeperDefenseResearchFacts, keeperDefenseView, validateKeeperDefense} from '../src/gu_keeper_defense.js';
import {searchGuGoal} from '../src/gu_goal_search.js';
import {guKeeperSpirit} from '../src/world_packs/book_gu_keeper_spirit.js';
import {keeperSpiritView} from '../src/gu_keeper_spirit.js';
import {keeperProcedureView} from '../src/gu_keeper_procedure.js';
import {beginStrengthReversal, finishStrengthReversal, runGuProcedure, searchGuProcedures, strengthReversingProcedure} from '../src/gu_procedures.js';
import {keeperAntNestView, antBroodMinutes} from '../src/gu_keeper_ant_nest.js';
import {armyAntCounts, hatchArmyAntBrood, produceArmyAnts} from '../src/gu_army_ants.js';
import {restoreCreatureLifecycle} from '../src/creature_lifecycle.js';
import {keeperAttitudeView, mentalEnergy} from '../src/gu_keeper_attitude.js';
import {useAttitudeGu, assessGuDemeanor} from '../src/gu_attitude.js';
import {fixedTravelDose} from '../src/gu_keeper_immortal_travel.js';
import {quoteFixedImmortalTravel} from '../src/gu_fixed_immortal_travel.js';
import {guKeeperMoonlightTrial} from '../src/world_packs/book_gu_keeper_moonlight_trial.js';
import {guKeeperMoonlightProspect} from '../src/world_packs/book_gu_keeper_moonlight_prospect.js';
import {guKeeperMoonlightStock} from '../src/world_packs/book_gu_keeper_moonlight_stock.js';
import {heldMoonlightStockStage, moonlightStockView} from '../src/gu_moonlight_stock.js';
import {clanMoonlightTraits, drawGuTraits} from '../src/gu_traits.js';
import {moonlightTrialView} from '../src/gu_keeper_moonlight_trial.js';
import {guKeeperFireTrial, keeperFireTrialView} from '../src/world_packs/book_gu_keeper_fire_trial.js';
import {guKeeperMoveTrial, guKeeperRaisedMoonblade} from '../src/world_packs/book_gu_keeper_move_trial.js';
import {keeperMoveTrialView} from '../src/gu_keeper_move_trial.js';
import {guKeeperMoonblade} from '../src/world_packs/book_gu_keeper_moonblade.js';
import {guKeeperPastMoonblade} from '../src/world_packs/book_gu_keeper_past_moonblade.js';
import {guKeeperWildWorm} from '../src/world_packs/book_gu_keeper_wild_worm.js';
import {guKeeperWormEssence} from '../src/world_packs/book_gu_keeper_worm_essence.js';
import {guKeeperFourFlavors} from '../src/world_packs/book_gu_keeper_four_flavors.js';
import {guKeeperRedSteel} from '../src/world_packs/book_gu_keeper_red_steel.js';
import {guKeeperRainbow} from '../src/world_packs/book_gu_keeper_rainbow.js';
import {guKeeperPropagation} from '../src/world_packs/book_gu_keeper_propagation.js';
import {guKeeperHostedWolf} from '../src/world_packs/book_gu_keeper_hosted_wolf.js';
import {guKeeperInsightMoth} from '../src/world_packs/book_gu_keeper_insight_moth.js';
import {keeperCooperationView, mothClue, mothLightMinutes} from '../src/gu_keeper_cooperation.js';
import {requestGuAid} from '../src/gu_cooperation.js';
import {hostedWolfView} from '../src/gu_hosted_wolf.js';
import {keeperPotatoFruit, keeperPropagationView} from '../src/gu_keeper_propagation.js';
import {keeperRainbowView} from '../src/world_packs/book_gu_keeper_sustained.js';
import {fourFlavorsWines} from '../src/gu_liquor_worm.js';
import {keeperWildView} from '../src/gu_keeper_wild.js';
import {guKeeperImmortalRefinement} from '../src/world_packs/book_gu_keeper_immortal_refinement.js';
import {guKeeperImmortalAdvancement} from '../src/world_packs/book_gu_keeper_immortal_advancement.js';
import {guKeeperImmortalReclamation} from '../src/world_packs/book_gu_keeper_immortal_reclamation.js';
import {keeperLuckSand, keeperRefinementView} from '../src/gu_keeper_refinement.js';
import {fireflyItem, keeperColonyView} from '../src/gu_keeper_colony.js';
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand} from '../src/simulation.js';
import {requireStructuredContent, validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {requireStructuredExtensions} from '../src/structured_pack_extensions.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup(seed = 717, ...optionalExtensions) {
    const registry = createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash:hash(raw), starts:raw.starts.map(b => ({...b,snapshotHash:hash(b)}))};
    const extensions = optionalExtensions.map(extension => registerStructuredCommandExtension(extension, hash(extension),
        d, registry, null, {bundledInstant: true}));
    const base = createExpansionState(seed), nativeBody = {id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'};
    const context = {registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,nativeBody,busy:false,facts:{location:'Village'},external:{money:0},
        gameplay:{player:{inventory:{},skills:{Woodcutting:{xp:0,enabled:false}},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:{player:{}}};
    const selected = planStructuredSelection(base,d,context), start = beginStructuredCampaign(selected.plan.state,d,context,null,selected.selection);
    let p = start.plan, record = start.record, weather;
    const ctx = () => ({...context,worldId:d.world.id,nativeBody:p.state.simulation.people.player.body,facts:{location:p.state.simulation.people.player.location},
        external:p.external,gameplay:p.gameplay,vitals:p.vitals,structuredNative:{...record,bound:true},nativeWeatherClock:weather});
    const publish = out => {const vitals = p.vitals; p = {...out,vitals:out.vitals||vitals}; for(const e of out.unlocks||[])if(e.kind==='skill')p.gameplay.player.skills[e.id].enabled=true;};
    return {registry,d,get record(){return record;},base,context,ctx,get p(){return p;},
        setWeather(minute) {weather = {minute, clock:p.state.clock};},
        admitExtension(index = 0) {
            const admitted = adoptStructuredExtension(p.state, d, record, extensions[index], ctx());
            record = admitted.record;
            publish({...p, ...admitted.plan});
        },
        start(n) {const c=registry.simulation.commands.get(id(n));publish(commitSimulationCommand(p.state,registry,{id:id(n)},{...ctx(),targetId:c?.targetId}));},
        quote(n) {const c=registry.simulation.commands.get(id(n));return previewSimulationCommand(p.state,registry,id(n),{...ctx(),targetId:c?.targetId});},
        step(n) {publish(advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...ctx(),vitals:p.vitals.player,equipment:{}}}));},
        cancel() {publish(cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx()));},
        envelope() {const save={character:{money:0,equipment:{}},expansion:p.state,content_packs:{schema:1,packs:{},structured:record},'current location':p.state.simulation.people.player.location,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};
            writeGameplayToEnvelope(save,p.gameplay,{player:{category:'person',id:'main_character'}});return save;}
    };
}

const reserve = f => f.p.state.simulation.energies.player[id('primeval')].reserve;
const gu = (f, s) => f.p.state.simulation.people[id(s)];
const larder = (f, s, food) => f.p.state.simulation.owners[id(s)]?.[key(food)] || 0;
const stones = f => f.p.gameplay.player.inventory[key('stone')] || 0;
test('An Insight Moth answers its agreement after a transfer and the clue pays off in ordinary care', () => {
    const life = setup(717, guKeeperInsightMoth);
    const act = op => life.start(`insight_moth.${op}`);
    const view = () => keeperCooperationView(life.p.state);
    const petals = () => life.p.gameplay.player.inventory[key('petals')];
    const validate = () => validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    life.admitExtension();
    act('meet');
    assert.throws(() => act('ask'));
    assert.throws(() => act('gather'));
    act('leave');
    act('feed');
    assert.equal(petals(), 6);
    act('steward_asks');
    assert.equal(view().response.result, 'quiet');
    assert.equal(view().fed, true);
    validate();
    act('ask');
    assert.equal(view().response.result, 'lit');
    assert.equal(view().withSteward, true);
    assert.equal(view().lightRemaining, mothLightMinutes);
    assert.equal(view().fed, false);
    validate();
    life.step(mothLightMinutes);
    assert.throws(() => act('study'));
    act('feed'); act('ask'); act('study');
    assert.ok(life.p.state.simulation.knowledge.player[mothClue]);
    life.step(mothLightMinutes);
    act('gather');
    const pending = JSON.parse(JSON.stringify(life.envelope()));
    requireStructuredExtensions(pending.content_packs.structured, life.d, pending.expansion);
    life.step(20);
    assert.equal(petals(), 8);
    assert.equal(view().gathered, true);
    assert.throws(() => act('gather'));
    act('recall');
    assert.equal(view().withSteward, false);
    validate();
});

test('An agreement can distinguish the same actor in a different body and the moth funds its own aid', () => {
    const args = {gu: {id: 'moth-1', kind: 'insight-moth', rank: 1, fedThrough: 25},
        agreement: {actor: 'player', body: 'body-1'}, visitor: {actor: 'player', body: 'body-1'},
        ability: {fuel: 'meal', cost: 1, effect: {kind: 'light', magnitude: 1}}, reserve: 1, now: 15};
    assert.equal(requestGuAid({...args, visitor: {...args.visitor, body: 'body-2'}}), null);
    assert.equal(requestGuAid({...args, reserve: 0}), null);
    assert.equal(requestGuAid({...args, now: 26}), null);
    assert.deepEqual(requestGuAid(args).remaining, {'moth-1': {meal: 0}});
});

test('Keeper extracts the same hosted Thunderclap after the wolf recovers, while a hunt loses it', () => {
    const start = () => {
        const life = setup(717, guKeeperHostedWolf);
        life.admitExtension();
        const act = name => life.start(`hosted_wolf.${name}`);
        const view = () => hostedWolfView(life.p.state, life.record);
        act('buy_silver'); act('enter'); act('find');
        assert.equal(view().gu, null);
        act('inspect');
        return {life, act, view};
    };
    const {life, act, view} = start();
    const original = view().gu.id;
    act('shelter');
    act('care');
    const recovering = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(recovering);
    assert.equal(view().wounded, true);
    life.step(20);
    assert.equal(view().wounded, false);
    assert.throws(() => act('extract'));
    const before = reserve(life);
    act('extract_sound');
    assert.equal(reserve(life), before - 4);
    assert.equal(view().gu.id, original);
    assert.equal(view().gu.custody, 'keeper');
    assert.equal(view().gu.controlled, false);
    assert.throws(() => act('cast'));
    act('release'); act('refine'); act('cast');
    assert.equal(view().held, false);
    assert.equal(view().struck, true);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));

    const hunt = start();
    hunt.act('hunt');
    assert.equal(hunt.view().dead, true);
    assert.equal(hunt.view().gu.custody, 'lost');
    assert.equal(hunt.view().gu.id, original);
    assert.throws(() => hunt.act('shelter'));
    assert.throws(() => hunt.act('find'));
    validateKeeperEnvelope(JSON.parse(JSON.stringify(hunt.life.envelope())));
});

test('Keeper produces, sorts, carries and plants a Mother Gu fruit that clears the pit once', () => {
    const life = setup(717, guKeeperPropagation);
    life.admitExtension();
    const act = name => life.start(`thunder_potato.${name}`);
    const view = () => keeperPropagationView(life.p.state, life.record);
    const stock = () => life.p.gameplay.player.inventory[keeperPotatoFruit] ?? 0;
    act('borrow');
    assert.throws(() => act('produce'));
    for (let batch = 0; batch < 3 && !stock(); batch++) {
        act('buy_silver');
        act('produce');
        assert.equal(view().unsorted, 4);
        assert.equal(stock(), 0);
        act('sort');
    }
    assert.ok(stock() > 0);
    const carried = stock();
    act('return_mother');
    act('refine');
    act('enter_pit');
    assert.throws(() => act('inspect_recess'));
    act('plant_deep');
    assert.equal(stock(), carried - 1);
    const growing = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(growing);
    validateStructuredEnvelope(growing);
    assert.equal(keeperPropagationView(growing.expansion, growing.content_packs.structured).planted.remaining, 10);
    assert.throws(() => act('strike'));
    life.step(10);
    act('tap');
    assert.equal(view().last, 'quiet');
    act('strike');
    assert.equal(view().last, 'blast');
    assert.equal(view().planted, undefined);
    assert.throws(() => act('strike'));
    act('inspect_recess');
    assert.equal(life.p.nativePatch['current location'], id('thunder_potato.recess'));
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('Keeper Rainbow Light pays on the shared clock and gates an actual flight on live support', () => {
    const begin = () => {
        const life = setup(717, guKeeperFireflyFarm, guKeeperStargate, guKeeperMoveTrial, guKeeperRainbow);
        life.start('take_moon');
        life.admitExtension(0); life.start('firefly_farm.start'); life.admitExtension(1); life.admitExtension(2); life.admitExtension(3);
        life.start('chores'); life.step(120);
        life.start('rainbow_light.loan');
        life.start('rainbow_light.buy');
        life.start('move_trial.borrow_light_source');
        return life;
    };
    const view = life => keeperRainbowView(life.p.state, life.record);
    const supported = begin();
    const aperture = reserve(supported);
    supported.start('rainbow_light.start_supported');
    assert.equal(view(supported).reserve, 8);
    supported.start('rainbow_light.fly_out');
    supported.step(10);
    assert.equal(view(supported).reserve, 4);
    const saved = JSON.parse(JSON.stringify(supported.envelope()));
    validateKeeperEnvelope(saved);
    validateStructuredEnvelope(saved);
    requireStructuredContent(saved.content_packs.structured, new Map([[supported.d.id, supported.d]]), saved.expansion);
    supported.step(6);
    assert.equal(supported.p.state.simulation.people.player.location, id('stargate.observatory'));
    assert.equal(reserve(supported), aperture);
    supported.step(14);
    assert.equal(view(supported).reserve, 0);
    assert.equal(view(supported).reason, 'needs more essence');

    const interrupted = begin();
    interrupted.start('rainbow_light.start_supported');
    interrupted.start('move_trial.return_light_source');
    interrupted.start('rainbow_light.fly_out');
    interrupted.step(16);
    assert.equal(view(interrupted).reason, 'Gu unavailable');
    assert.equal(view(interrupted).reserve, 8);
    assert.equal(interrupted.p.state.simulation.people.player.location, id('annex'));

    const solo = begin();
    solo.start('rainbow_light.start_solo');
    solo.start('rainbow_light.fly_out');
    solo.step(16);
    assert.equal(view(solo).reserve, 0);
    assert.equal(solo.p.state.simulation.people.player.location, id('stargate.observatory'));
});

function fuseFourFlavors(...extra) {
    const life = setup(717, guKeeperWildWorm, guKeeperWormEssence, guKeeperFourFlavors, ...extra);
    life.admitExtension(0); life.admitExtension(1); life.admitExtension(2);
    for (let index = 0; index < 7; index++) {
        life.start('chores'); life.step(120);
    }
    life.start('take_worm');
    const wild = name => life.start(`wild_worm.${name}`);
    wild('find'); wild('approach'); wild('follow'); wild('buy_wine'); wild('lure'); wild('capture'); wild('refine');
    wild('buy_wine'); life.start('worm_essence.feed');
    for (const {flavor} of fourFlavorsWines.slice(0, 3)) life.start(`four_flavors.buy_${flavor}`);
    assert.throws(() => life.start('four_flavors.fuse_four'));
    assert.equal(gu(life, 'worm').life, 'alive');
    life.start('four_flavors.buy_spicy');
    life.start('four_flavors.fuse_four');
    return life;
}

test('Keeper fuses the actual clan and wild Worms with four distinct wines', () => {
    const life = fuseFourFlavors();
    assert.equal(gu(life, 'worm').life, 'dead');
    const view = keeperWildView(life.p.state, life.record);
    assert.equal(view.phase, 'fused');
    assert.equal(view.fourFlavors.rank, 2);
    assert.throws(() => life.start('wild_worm.find'));
    assert.throws(() => life.start('worm_essence.convert'));
    assert.throws(() => life.start('order_worm_on'));
    const stock = life.p.gameplay.player.inventory;
    assert.equal(stock[key('worm_gu')] ?? 0, 0);
    for (const {flavor} of fourFlavorsWines) assert.equal(stock[key(`four_flavors.${flavor}_wine`)] ?? 0, 0);
    const save = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(save);
    validateStructuredEnvelope(save);
    assert.equal(keeperWildView(save.expansion, save.content_packs.structured).fourFlavors.id, view.fourFlavors.id);
});

test('Keeper Four Flavors refines actual rank-two essence and the upper-stage reserve funds Moonglow', () => {
    const life = fuseFourFlavors(guKeeperRankTrial, guKeeperRedSteel);
    life.start('take_moon');
    life.admitExtension(3);
    assert.throws(() => life.admitExtension(4), /borrow the steward/);
    life.start('rank_trial.borrow');
    life.admitExtension(4);
    for (let index = 0; index < 3; index++) {
        life.start('chores'); life.step(120);
    }
    const act = name => life.start(`red_steel_refinement.${name}`);
    const view = () => keeperWildView(life.p.state, life.record).redSteel;
    life.start('rank_trial.buy_dose');
    assert.throws(() => act('concentrate_red'));
    // The ordinary dose stays in its own pool. Work for the staged one.
    for (let index = 0; index < 2; index++) {
        life.start('chores'); life.step(120);
    }
    life.start('wild_worm.buy_wine');
    act('feed_four');
    assert.throws(() => act('concentrate_red'));
    act('buy_middle');
    const initial = reserve(life);
    act('concentrate_red');
    assert.equal(view().stock, 2);
    assert.equal(reserve(life), initial);
    const saved = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(saved);
    validateStructuredEnvelope(saved);
    act('cast_upper');
    assert.equal(view().stock, 0);
    assert.equal(view().lastCut, 4);
    assert.equal(reserve(life), initial);
    assert.equal(life.p.gameplay.player.inventory[key('rank_trial.red_steel')], 1);
    assert.throws(() => act('cast_upper'));
});

test('Keeper feeds and controls a wild Worm to concentrate essence, then casts from the separate rank-one pool', () => {
    const life = setup(717, guKeeperWildWorm, guKeeperWormEssence);
    life.start('take_moon');
    life.admitExtension(0);
    life.admitExtension(1);
    const wild = name => life.start(`wild_worm.${name}`);
    const essence = name => life.start(`worm_essence.${name}`);
    const view = () => keeperWildView(life.p.state, life.record).essence;
    wild('find'); wild('approach'); wild('follow'); wild('buy_wine'); wild('lure'); wild('capture');
    assert.throws(() => essence('convert'), /Feed the Worm/);
    wild('buy_wine');
    essence('feed');
    assert.throws(() => essence('convert'), /refine its control/);
    wild('refine');
    const raw = reserve(life);
    essence('convert');
    assert.equal(reserve(life), raw - 2);
    assert.equal(view().middle, 1);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    life.step(DAY);
    assert.equal(view().fed, false);
    assert.throws(() => essence('convert'), /Feed the Worm/);
    wild('release');
    const before = reserve(life);
    essence('cast_middle');
    assert.equal(reserve(life), before);
    assert.equal(view().middle, 0);
    assert.equal(view().lastCut, 2);
    assert.throws(() => essence('cast_middle'), /middle-stage measure/);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('Keeper generates and tries Moonblade candidates, retaining early costs when a later Gu is gone', () => {
    const life = setup(717, guKeeperMoveTrial);
    life.start('take_moon');
    life.admitExtension();
    const action = name => life.start(`move_trial.${name}`);
    const view = () => keeperMoveTrialView(life.p.state, life.record);
    action('research');
    assert.equal(view().plans.length, 1);
    action('borrow_little_light');
    action('borrow_light_source');
    action('research');
    const sourced = view().plans.find(plan => plan.known);
    const alternate = view().plans.find(plan => plan.names.length === 2);
    assert.deepEqual([sourced.cost, sourced.power, sourced.reach], [5, 2, 2]);
    assert.deepEqual([alternate.cost, alternate.power, alternate.reach], [4, 2, 2]);
    const before = reserve(life);
    action(`try_${sourced.slot}`);
    assert.equal(reserve(life), before - 5);
    assert.equal(view().last.outcome, 'complete');
    life.start('rest');
    life.step(60);
    action(`try_${alternate.slot}`);
    assert.equal(view().last.spent, 4);
    assert.equal(view().last.outcome, 'complete');
    action('return_light_source');
    const after = reserve(life);
    action(`try_${alternate.slot}`);
    assert.equal(reserve(life), after - 1);
    assert.deepEqual(view().last, {slot: alternate.slot, outcome: 'interrupted', spent: 1, reason: 'Gu unavailable'});
    const restored = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(restored);
    assert.deepEqual(keeperMoveTrialView(restored.expansion, restored.content_packs.structured), view());
    action('borrow_light_source');
    life.start('rest');
    life.step(60);
    action(`try_${alternate.slot}`);
    assert.equal(view().last.outcome, 'complete');
});

test('Keeper feeds the exact Gu and only the known pairing reaches the distant cord', () => {
    const life = setup(717, guKeeperMoveTrial, guKeeperRaisedMoonblade);
    const move = op => life.start(`move_trial.${op}`);
    const trial = op => life.start(`raised_moonblade.${op}`);
    const view = () => keeperMoveTrialView(life.p.state, life.record).raised;
    life.start('take_moon');
    life.admitExtension();
    life.admitExtension(1);
    move('borrow_little_light');
    life.start('feed_moon');
    life.start('buy_petals');
    life.step(DAY);
    assert.equal(view().moonFed, true);
    assert.equal(view().support, 'hungry');
    const petals = life.p.gameplay.player.inventory[key('petals')];
    trial('feed');
    assert.equal(life.p.gameplay.player.inventory[key('petals')], petals - 1);
    trial('research');
    const plain = view().plans.find(plan => plan.names.length === 0);
    const paired = view().plans.find(plan => plan.known);
    trial(`try_${plain.slot}`);
    assert.equal(view().last.reach, 1);
    assert.equal(view().cut, false);
    life.step(DAY);
    assert.equal(view().support, 'hungry');
    trial(`try_${paired.slot}`);
    assert.deepEqual(view().last, {slot: paired.slot, outcome: 'interrupted', spent: 0, reason: 'needs feeding'});
    move('return_little_light');
    move('borrow_light_source');
    trial(`try_${paired.slot}`);
    assert.equal(view().last.reason, 'Gu unavailable');
    trial('research');
    const substituted = view().plans.find(plan => plan.names[0] === 'Light Source Gu');
    trial(`try_${substituted.slot}`);
    assert.equal(view().last.reach, 1);
    assert.equal(view().cut, false);
    move('borrow_little_light');
    trial('feed');
    trial('research');
    trial(`try_${view().plans.find(plan => plan.known).slot}`);
    assert.equal(view().last.spent, 5);
    assert.equal(view().cut, true);
    trial('enter');
    const restored = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(restored);
    assert.deepEqual(keeperMoveTrialView(restored.expansion, restored.content_packs.structured).raised, view());
});

test('Keeper Red Fire keeps the written recipe and prior payments across a returned loan', () => {
    const life = setup(717, guKeeperFireTrial);
    const act = op => life.start(`fire_trial.${op}`);
    const view = (state = life.p.state) => keeperFireTrialView(state, life.record);
    const savedNote = state => state.worlds[id('world')].facts[id('fire_trial.notes')];
    const restTo = amount => {
        for (let hour = 0; hour < amount && reserve(life) < amount; hour++) {
            life.start('rest');
            life.step(60);
        }
        assert.ok(reserve(life) >= amount);
    };
    life.admitExtension();
    act('loan');
    act('research');
    const {plans} = view();
    const all = plans.find(plan => plan.names.length === 3);
    assert.deepEqual([all.cost, all.count, all.force], [6, 2, 2]);
    const research = savedNote(life.p.state);
    const legacyPlans = [[], ['fire-source'], ['duplicate'], ['enlarge'], ['fire-source', 'duplicate'],
        ['fire-source', 'enlarge'], ['duplicate', 'enlarge'], ['fire-source', 'duplicate', 'enlarge']];
    assert.equal(research, JSON.stringify({pair: false, bundle: false, plans: legacyPlans, last: null}));

    act('return_duplicate');
    assert.deepEqual(view().plans, plans);
    assert.equal(savedNote(life.p.state), research);
    const beforeReturnCast = reserve(life);
    act(`try_${all.slot}`);
    assert.equal(reserve(life), beforeReturnCast - 1);
    assert.deepEqual(view().last, {slot: all.slot, spent: 1, outcome: 'interrupted', reason: 'Gu unavailable'});

    const interrupted = research.replace('"last":null',
        `"last":{"slot":${all.slot},"spent":1,"outcome":"interrupted","reason":"Gu unavailable"}`);
    const envelope = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(envelope);
    const loaded = loadExpansionState(envelope.expansion, life.registry);
    assert.equal(savedNote(loaded), interrupted);
    assert.deepEqual(view(loaded), view());

    act('borrow_duplicate');
    const pair = plans.find(plan => plan.count === 2 && plan.force === 1 && plan.cost === 5);
    const bundle = plans.find(plan => plan.count === 1 && plan.force === 2 && plan.cost === 5);
    restTo(pair.cost);
    const beforePair = reserve(life);
    act(`try_${pair.slot}`);
    assert.equal(reserve(life), beforePair - pair.cost);
    assert.deepEqual(view().last, {slot: pair.slot, spent: pair.cost, outcome: 'complete', count: pair.count, force: pair.force});
    assert.throws(() => act('cross'));

    const beforeBundle = reserve(life);
    assert.equal(beforeBundle, 2);
    act(`try_${bundle.slot}`);
    assert.equal(reserve(life), 0);
    assert.deepEqual(view().last, {slot: bundle.slot, spent: 2, outcome: 'interrupted', reason: 'needs more essence'});
    restTo(bundle.cost);
    act(`try_${bundle.slot}`);
    assert.equal(view().pair, true);
    assert.equal(view().bundle, true);

    restTo(2);
    const beforeCross = reserve(life);
    const beforeCrossNote = savedNote(life.p.state);
    act('cross');
    assert.equal(reserve(life), beforeCross - 2);
    assert.equal(life.p.state.simulation.people.player.location, id('fire_trial.ledge'));
    assert.equal(savedNote(life.p.state), beforeCrossNote);
    assert.equal(life.p.state.actors.player.completed[id('fire_trial.cross')], 1);
    act('return_house');
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('Generated clan specimens retain innate blade focus and a separate individual refinement across custody', () => {
    // Fact byte hashes captured at f622d4cdb for the same command route.
    const fixtures = [
        [1, [5, 4], [
            'a81307df44df64cc2e4eab2476a6151f732982c8a663e57724506c5496922a58',
            '98a0cee25ef92c9d9ea38f9afa33e799e9e21bc4f0e5cd743e1046a2eec71fe4',
            '8ba78d420b9306ee8c27b30e1862df57be7a436aa9ae47df1eabdc08fdac0f66',
        ]],
        [2, [4, 5], [
            'ab0bb1239d91b8831aa95e826824a7bba9260739297edb923437cdb3a9b82acb',
            '8e2e1b6e705b31cb620f9606a3f5442e8674922aded47d72cc1edfb070268e21',
            'e74edb27507f42e2e34e10cd3e0f9ca7a6ad6ee220c8957a4b1a700ffdaee629',
        ]],
    ];
    for (const [seed, cuts, [surveyHash, returnedHash, recastHash]] of fixtures) {
        const life = setup(seed, guKeeperMoonlightTrial, guKeeperMoonlightStock);
        const act = op => life.start(`moonlight_stock.${op}`);
        const view = () => moonlightStockView(life.p.state);
        life.start('take_moon');
        life.admitExtension(0); life.admitExtension(1);
        const fact = id('moonlight_stock.roster');
        const rosterBytes = () => life.p.state.worlds[id('world')].facts[fact];
        const rosterHash = () => createHash('sha256').update(rosterBytes()).digest('hex');
        assert.throws(() => act('borrow_first'));
        act('survey');
        assert.equal(rosterHash(), surveyHash);
        assert.throws(() => act('survey'));
        act('borrow_first');
        assert.throws(() => act('borrow_second'));
        act('cast_stock'); act('return_stock');
        assert.equal(heldMoonlightStockStage(life.p.state), null);
        assert.throws(() => act('cast_stock'));
        act('borrow_second');
        life.step(180);
        act('cast_stock');
        assert.deepEqual(view().map(row => row.cut), cuts);
        act('tune_stock');
        const original = view()[1].id;
        act('return_stock');
        assert.equal(rosterHash(), returnedHash);
        const returned = JSON.parse(JSON.stringify(life.envelope()));
        validateKeeperEnvelope(returned);
        assert.deepEqual(moonlightStockView(returned.expansion), view());

        const invalid = structuredClone(returned);
        const facts = invalid.expansion.worlds[id('world')].facts;
        const roster = JSON.parse(facts[fact]);
        for (const specimen of Object.values(roster.lifecycle.individuals)) {
            specimen.keeper = 'player';
            specimen.habitat = id('moonlight_stock.desk');
        }
        facts[fact] = JSON.stringify(roster);
        assert.throws(() => validateKeeperEnvelope(invalid), /clan Moonlight Gu and their test records disagree/);
        act('borrow_second'); life.step(240); act('cast_stock');
        assert.equal(view()[1].id, original);
        const stage = heldMoonlightStockStage(life.p.state);
        assert.equal(stage.gu.id, id(`moonlight_stock.${original}`));
        assert.equal(stage.gu.traits.bladeForce, cuts[1] / 4 - 0.75);
        assert.deepEqual(view().map(row => row.cut), [cuts[0], cuts[1] + 1]);
        assert.deepEqual(view().map(row => row.refined), [false, true]);
        assert.equal(rosterHash(), recastHash);
        validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    }
});

test('Addressed Gu traits preserve earlier draws when a table adds a field', () => {
    const input = {seed: 2, source: 'clan-tray-v1', identity: 1};
    const original = drawGuTraits({...input, table: clanMoonlightTraits});
    assert.equal(drawGuTraits({...input, table: {...clanMoonlightTraits,
        temper: [{id: 'calm', weight: 1}, {id: 'bold', weight: 1}]} }).focus, original.focus);
    assert.deepEqual(drawGuTraits({...input, table: {}}), {});
});

test('Keeper compares innate Moonlight force and same-rank refinement through custody changes', () => {
    const life = setup(717, guKeeperMoonlightTrial);
    life.start('take_moon');
    life.admitExtension();
    const action = name => life.start(`moonlight_trial.${name}`);
    const view = () => moonlightTrialView(life.p.state);
    assert.throws(() => action('cast_loan'));
    action('borrow');
    const firstId = view().id;
    life.step(60);
    const before = reserve(life);
    action('cast_clan');
    assert.equal(before - reserve(life), 4);
    const after = reserve(life);
    action('cast_loan');
    assert.equal(after - reserve(life), 4);
    assert.deepEqual(view().marks, {clan: 4, loan: 5});
    life.step(300);
    action('tune');
    assert.equal(stones(life), 2);
    assert.throws(() => action('tune'));
    action('return_loan');
    const returned = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(returned);
    assert.equal(moonlightTrialView(returned.expansion).id, firstId);
    assert.equal(moonlightTrialView(returned.expansion).held, false);
    assert.throws(() => action('cast_loan'));
    action('borrow');
    action('cast_loan');
    assert.equal(view().id, firstId);
    assert.equal(view().tuned, true);
    assert.deepEqual(view().marks, {clan: 4, loan: 6});
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('Keeper borrows the result of a prepared focus refinement and can cancel or set the real focus', () => {
    const life = setup(717, guKeeperMoonlightTrial, guKeeperMoonlightProspect);
    const loan = op => life.start(`moonlight_trial.${op}`);
    const prospect = op => life.start(`moonlight_prospect.${op}`);
    const view = () => moonlightTrialView(life.p.state);
    const validate = () => validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    life.start('take_moon');
    life.admitExtension(0);
    loan('borrow'); loan('cast_loan');
    const specimen = view().id;
    assert.equal(view().marks.loan, 5);
    life.admitExtension(1);
    assert.throws(() => prospect('open'));
    prospect('prepare');
    assert.throws(() => loan('tune'));
    assert.throws(() => prospect('finish'));
    prospect('open');
    const before = reserve(life);
    validate();
    prospect('cast_future');
    assert.equal(view().prospect.cut, 6);
    assert.equal(view().tuned, false);
    assert.equal(view().marks.loan, 5);
    assert.equal(reserve(life), before);
    assert.throws(() => prospect('cast_future'));
    prospect('cancel');
    assert.equal(view().prospect.cut, 6);
    assert.equal(stones(life), 2);
    assert.throws(() => prospect('finish'));
    prospect('prepare'); prospect('open');
    life.step(20);
    assert.throws(() => prospect('cast_future'));
    loan('return_loan'); loan('borrow');
    assert.equal(view().prospect.status, 'lost');
    life.step(10);
    assert.throws(() => prospect('finish'));
    validate();
    prospect('cancel');
    life.step(180);
    prospect('prepare');
    life.step(30);
    prospect('finish');
    assert.equal(view().id, specimen);
    assert.equal(view().tuned, true);
    assert.equal(view().prospect.status, 'complete');
    loan('cast_loan');
    assert.equal(view().marks.loan, 6);
    validate();
});

test('Moonlight fusion discovers force, reach and a substitution, then casts each product with its own provenance', () => {
    for (const [slot, expected] of [[1, {power: 3, reach: 1}], [2, {power: 1, reach: 2}], [3, {power: 1, reach: 1.5}]]) {
        const life = setup(717, guKeeperFusion);
        const act = op => life.start(`moon_fusion.${op}`);
        const view = () => keeperFusionView(life.p.state, life.record);
        life.admitExtension();
        act('setup'); act('research');
        assert.deepEqual(view().plans.map(plan => plan.label), ['Moonglow Gu', 'Moon Scar Gu', 'Etched Moon Gu']);
        if (slot === 1) {
            act('start_1'); act('rush');
            assert.equal(stones(life), 2);
            assert.deepEqual(view().destroyed, ['Little Light Gu']);
            assert.throws(() => act('recover'));
            act('research');
            assert.equal(view().plans.length, 0);
            life.step(30);
            act('recover'); act('replace'); act('research');
        }
        act(`start_${slot}`);
        assert.throws(() => act('finish'));
        validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
        life.step(20); act('finish');
        assert.throws(() => act('cast'));
        act('take_dose'); act('cast');
        assert.deepEqual(view().cast, expected);
        const bench = JSON.parse(life.p.state.worlds[id('world')].facts[id('moon_fusion.bench')]);
        const product = bench.world.gu.find(gu => gu.rank === 2);
        assert.equal(product.provenance.recipe, product.kind);
        for (const input of Object.values(product.provenance.ingredients)) {
            assert.equal(bench.world.gu.find(gu => gu.id === input).fate, 'consumed');
        }
        if (slot === 1) assert.ok(Object.values(product.provenance.ingredients).includes('fusion-replacement-1'));
        validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    }
});

test('Keeper researches one target across direct and coordinated Gu moves and reaches the same native shelf by either', () => {
    for (const selected of [1, 2]) {
        const life = setup(717, guKeeperMoveTrial, guKeeperBeamProcedure, guKeeperGoal);
        const act = op => life.start(`screen_research.${op}`);
        const view = () => keeperGoalView(life.p.state, life.record);
        life.start('take_moon');
        for (let i = 0; i < 3; i++) {life.start('chores'); life.step(120);}
        life.start('take_jade');
        life.admitExtension(0); life.admitExtension(1); life.admitExtension(2);
        life.start('beam_procedure.borrow_light'); act('research');
        assert.equal(view().plans.length, 1);
        assert.ok(view().blocked.some(row => row.method === 'lower-counterweight' && row.reason === 'insufficient-effect'));
        life.start('beam_procedure.borrow_heavy'); act('research');
        assert.deepEqual(view().plans.map(row => row.cost), [4, 7]);
        assert.ok(view().blocked.some(row => row.method === 'lift-runner' && row.role === 'lifting-strength'));
        assert.throws(() => act('enter'));
        if (selected === 2) {
            life.start('beam_procedure.return_heavy');
            act('try_2');
            assert.equal(view().last.spent, 1);
            assert.equal(view().openedBy, null);
            life.start('beam_procedure.borrow_heavy');
        }
        act(`try_${selected}`);
        assert.equal(view().openedBy, selected === 1 ? 'cut-cord' : 'lower-counterweight');
        act('enter'); act('salvage');
        assert.equal(life.p.gameplay.player.inventory[key('petals')], 12);
        validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    }
});

test('Gu goal search evaluates target fit before discarding a weaker direct effect', () => {
    const available = [1, 2].map(magnitude => ({operator: 'player',
        gu: {id: `blade-${magnitude}`, kind: 'moonlight', fedThrough: 0},
        ability: {fuel: 'primeval', cost: 1, effect: {kind: 'damage', magnitude}}}));
    const goal = {kind: 'score', limit: 1};
    const methods = [{id: 'blade', goal: 'score', effect: 'damage',
        apply: (target, effects) => effects[0].magnitude <= target.limit ? 'scored' : null}];
    const result = searchGuGoal({goal, methods, available, reserves: {player: {primeval: 1}}, day: 0, budget: 2});
    assert.deepEqual(result.options.map(row => row.binding[0].id), ['blade-1']);
    assert.equal(result.visited, 2);
});

test('Fighting Spirit abort preserves the supports, late backlash destroys them, and distinct recovery enables retry', () => {
    const life = setup(717, guKeeperSpirit);
    const act = op => life.start(`fighting_spirit.${op}`);
    const view = () => keeperSpiritView(life.p.state, life.record);
    const save = () => JSON.parse(JSON.stringify(life.envelope()));
    const beads = () => life.p.gameplay.player.inventory[key('fighting_spirit.red_date')] ?? 0;
    const world = () => JSON.parse(life.p.state.worlds[id('world')].facts[id('fighting_spirit.encounter')]).world;
    life.admitExtension();
    act('borrow'); act('prepare'); act('buy_supports'); act('buy_beads');
    const original = world().gu.map(gu => gu.id);
    const before = reserve(life);
    act('abort');
    assert.equal(beads(), 3);
    assert.equal(reserve(life), before - 2);
    assert.deepEqual(view(), {held: true, last: 'abort', alive: 2, mind: 2, soul: 2});
    act('rush');
    assert.equal(beads(), 0);
    assert.equal(reserve(life), before - 4);
    assert.deepEqual(view(), {held: true, last: 'rush', alive: 0, mind: 0, soul: 0});
    assert.deepEqual(world().gu.filter(gu => !gu.alive).map(gu => gu.id), original.slice(1));
    validateKeeperEnvelope(save());
    life.start('chores'); life.step(120);
    act('buy_supports'); act('buy_beads');
    assert.throws(() => act('steady'));
    act('recover_mind');
    const pending = save();
    requireStructuredExtensions(pending.content_packs.structured, life.d, pending.expansion);
    life.step(30);
    assert.equal(view().mind, 2);
    assert.equal(view().soul, 0);
    assert.throws(() => act('steady'));
    act('recover_soul'); life.step(60);
    act('steady'); act('supplies');
    assert.equal(world().gu.find(gu => gu.kind === 'fight').id, original[0]);
    assert.equal(view().alive, 2);
    assert.equal(life.p.gameplay.player.inventory[key('petals')], 12);
    validateKeeperEnvelope(save());
});

test('Keeper writes two three-core moves, loses only the early charge on interruption, and reaches the heavy shelf', () => {
    const life = setup(717, guKeeperBeamProcedure);
    const act = op => life.start(`beam_procedure.${op}`);
    const view = () => keeperProcedureView(life.p.state, life.record);
    life.start('take_moon');
    for (let i = 0; i < 3; i++) {life.start('chores'); life.step(120);}
    life.start('take_jade');
    life.admitExtension();
    act('borrow_light'); act('borrow_heavy'); act('research');
    assert.deepEqual(view().plans.map(row => [row.cost, row.load]), [[6, 1], [7, 2]]);
    act('return_heavy');
    const before = reserve(life);
    act('try_2');
    assert.equal(reserve(life), before - 1);
    assert.equal(view().last.outcome, 'interrupted');
    assert.throws(() => act('enter'));
    act('try_1'); act('enter');
    assert.equal(life.p.state.simulation.people.player.location, id('beam_procedure.bay'));
    assert.throws(() => act('salvage'));
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    act('back'); life.step(360);
    act('borrow_heavy'); act('try_2'); act('enter'); act('salvage');
    assert.equal(life.p.gameplay.player.inventory[key('petals')], 12);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('Three-core search fits the chapter 961 arrangement, its cohort and both timed body directions', () => {
    const recipe = strengthReversingProcedure;
    const available = recipe.roles.map(({id, kind}, index) => ({operator: 'player',
        gu: {id, kind, rank: 6, fedThrough: 120}, ability: {fuel: 'immortal', cost: index + 1}}));
    const request = {recipe, available, stock: {'supplementary-mortal-gu': 330_000},
        reserves: {player: {immortal: 6}}, day: 120};
    const {options: [plan]} = searchGuProcedures(request);
    assert.deepEqual(Object.keys(plan.binding), ['eat-strength', 'pulling-mountain', 'pulling-water']);
    assert.equal(plan.result.remaining.player.immortal, 0);
    assert.equal(searchGuProcedures({...request, searchLimit: 2}).truncated, true);
    assert.equal(searchGuProcedures({...request, stock: {'supplementary-mortal-gu': 329_999}}).options.length, 0);
    const interrupted = runGuProcedure({...request, binding: plan.binding, available: available.slice(0, 2)});
    assert.equal(interrupted.outcome, 'interrupted');
    assert.equal(interrupted.remaining.player.immortal, 5);
    assert.throws(() => beginStrengthReversal({...request, binding: plan.binding, form: 'living', preparedAt: 0, now: 119}));
    for (const [from, to] of [['living', 'immortal-zombie'], ['immortal-zombie', 'living']]) {
        const {transition} = beginStrengthReversal({...request, binding: plan.binding, form: from, preparedAt: 0, now: 120});
        assert.equal(finishStrengthReversal(transition, {now: 4439}), null);
        assert.equal(finishStrengthReversal(transition, {now: 4440, restedSinceActivation: true}), null);
        assert.deepEqual(finishStrengthReversal(transition, {now: 4440}), {kind: 'body-transition', from, to});
    }
});

test('Ant Nest pays for a founder colony and the queen’s timed broods supply real soldiers after the loan ends', () => {
    const life = setup(717, guKeeperAntNest);
    const act = op => life.start(`ant_nest.${op}`);
    const view = () => keeperAntNestView(life.p.state, life.record);
    const bag = name => life.p.gameplay.player.inventory[key(`ant_nest.${name}`)] ?? 0;
    life.admitExtension();
    act('borrow');
    assert.throws(() => act('seed'));
    assert.throws(() => act('brood'));
    act('buy_inputs'); act('seed');
    assert.deepEqual(view(), {queen: 1, worker: 2, soldier: 0, held: true, breeding: null, clear: false});
    assert.equal(bag('dose'), 0);
    assert.equal(bag('substrate'), 0);
    act('return_loan'); act('buy_rations');
    act('brood');
    const pending = JSON.parse(JSON.stringify(life.envelope()));
    requireStructuredExtensions(pending.content_packs.structured, life.d, pending.expansion);
    validateKeeperEnvelope(pending);
    life.cancel();
    assert.equal(bag('ration'), 2);
    assert.equal(view().soldier, 0);
    act('brood'); life.step(antBroodMinutes);
    assert.equal(view().soldier, 1);
    assert.throws(() => act('clear'));
    act('brood'); life.step(antBroodMinutes);
    assert.equal(view().soldier, 2);
    assert.equal(view().queen, 1);
    assert.equal(bag('ration'), 0);
    act('clear');
    assert.equal(view().soldier, 1);
    assert.equal(life.p.state.simulation.people.player.location, id('ant_nest.niche'));
    act('salvage');
    assert.equal(life.p.gameplay.player.inventory[key('petals')], 12);
    assert.throws(() => act('salvage'));
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    act('back'); act('enter');
    assert.equal(life.p.state.simulation.people.player.location, id('ant_nest.niche'));
});

test('Ant Nest production and queen reproduction require distinct inputs and respect tray capacity', () => {
    const empty = restoreCreatureLifecycle(null);
    const input = {gu: {id: 'nest', kind: 'ant-nest', rank: 8, holder: 'player', fedThrough: 0},
        operator: 'player', now: 0, reserve: 1, material: 1};
    assert.throws(() => produceArmyAnts(empty, {...input, reserve: 0}), /immortal essence/);
    assert.throws(() => produceArmyAnts(empty, {...input, material: 0}), /immortal material/);
    assert.throws(() => hatchArmyAntBrood(empty, {ration: 1}), /queen/);
    const {lifecycle} = produceArmyAnts(empty, input);
    let colony = lifecycle;
    for (let i = 0; i < 4; i++) colony = hatchArmyAntBrood(colony, {ration: 1});
    assert.deepEqual(armyAntCounts(colony), {queen: 1, worker: 6, soldier: 4});
    assert.throws(() => hatchArmyAntBrood(colony, {ration: 1}), /room/);
    assert.deepEqual(armyAntCounts(empty), {queen: 0, worker: 0, soldier: 0});
});

test('Attitude Gu spends native mental energy and changes an observer response without conferring title', () => {
    const life = setup(717, guKeeperAttitude);
    const act = op => life.start(`attitude_trial.${op}`);
    const view = () => keeperAttitudeView(life.p.state, life.record);
    const validate = () => validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    life.admitExtension();
    act('borrow'); act('ask');
    assert.equal(view().response, 'wary');
    assert.throws(() => act('wear'));
    act('center');
    const primeval = reserve(life);
    const body = structuredClone(life.p.state.simulation.people.player.body);
    act('wear'); act('ask');
    assert.equal(view().response, 'reassured');
    assert.equal(view().mental, 0);
    assert.equal(reserve(life), primeval);
    assert.deepEqual(life.p.state.simulation.people.player.body, body);
    assert.throws(() => act('collect'));
    validate();
    life.step(30);
    assert.equal(view().remaining, 0);
    assert.throws(() => act('wear'));
    act('ask');
    assert.equal(view().response, 'wary');
    assert.equal(view().approved, true);
    act('recover');
    const pending = JSON.parse(JSON.stringify(life.envelope()));
    requireStructuredExtensions(pending.content_packs.structured, life.d, pending.expansion);
    life.step(30);
    assert.equal(view().mental, 2);
    life.start('take_moon');
    act('collect');
    assert.equal(life.p.gameplay.player.inventory[key('petals')], 12);
    assert.throws(() => act('collect'));
    act('wear'); act('return_loan');
    assert.equal(view().remaining, 0);
    validate();
    const invalid = JSON.parse(JSON.stringify(life.envelope()));
    invalid.expansion.simulation.energies.player[mentalEnergy.id].policy.capacity++;
    assert.throws(() => validateKeeperEnvelope(invalid), /mental reserve/);
});

test('Attitude Gu can influence suspicion without treating an independent check as persuasion', () => {
    const gu = {id: 'mask', kind: 'attitude', rank: 8, holder: 'player', fedThrough: 0};
    const use = useAttitudeGu({gu, operator: 'player', now: 0, mental: 2});
    assert.equal(use.remaining.player.mental, 0);
    const [{magnitude}] = use.effects;
    assert.equal(assessGuDemeanor({suspicion: 1, impression: magnitude}), 'reassured');
    assert.equal(assessGuDemeanor({suspicion: 2, impression: magnitude}), 'wary');
    assert.equal(useAttitudeGu({gu, operator: 'player', now: 0, mental: 1}), null);
});

test('Keeper uses the same living Fixed Immortal Travel with witnessed landings and real stored immortal essence', () => {
    const life = setup(717, guKeeperFireflyFarm, guKeeperStargate, guKeeperFixedImmortalTravel);
    const act = op => life.start(`fixed_immortal_travel.${op}`);
    const doses = () => life.p.gameplay.player.inventory[fixedTravelDose] ?? 0;
    const where = () => life.p.state.simulation.people.player.location;
    const claim = () => JSON.parse(life.p.state.worlds[id('world')].facts[id('fixed_immortal_travel.claim')]).gu[0];
    life.admitExtension(0);
    life.start('firefly_farm.start');
    life.admitExtension(1);
    life.admitExtension(2);
    act('borrow'); act('buy_dose'); act('remember_annex');
    const specimen = claim().id;
    assert.throws(() => act('travel_out'));
    assert.equal(doses(), 1);
    life.start('chores'); life.step(120);
    life.start('firefly_farm.collect'); life.start('stargate.cross_out');
    act('remember_hill');
    const aperture = reserve(life);
    act('travel_back');
    assert.equal(where(), id('annex'));
    assert.equal(doses(), 0);
    assert.equal(reserve(life), aperture);
    assert.equal(claim().id, specimen);
    act('return_loan'); act('buy_dose');
    assert.throws(() => act('travel_out'));
    assert.equal(doses(), 1);
    act('borrow'); act('travel_out');
    assert.equal(where(), id('stargate.observatory'));
    assert.equal(claim().id, specimen);
    assert.throws(() => act('travel_back'));
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('A rival rank-six forge and the rank-seven travel loan settle against the same living claim', () => {
    const life = setup(717, guKeeperFireflyFarm, guKeeperStargate, guKeeperFixedImmortalTravel, guKeeperFixedForge);
    const travel = op => life.start(`fixed_immortal_travel.${op}`);
    const forge = op => life.start(`fixed_forge.${op}`);
    const world = () => readKeeperFixedClaim(life.p.state);
    const living = () => keeperFixedSpecimen(world());
    const validate = () => validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    life.admitExtension(0); life.start('firefly_farm.start'); life.admitExtension(1); life.admitExtension(2);
    travel('borrow'); travel('remember_annex'); travel('buy_dose');
    const original = living().id;
    validate();
    life.start('chores'); life.step(120); life.start('firefly_farm.collect'); life.start('stargate.cross_out');
    travel('remember_hill'); life.start('stargate.walk_back'); life.step(60);
    life.admitExtension(3);
    assert.equal(life.p.state.simulation.people.player.location, id('annex'));
    for (let i = 0; i < 2; i++) {life.start('chores'); life.step(120);}
    forge('commission'); forge('raise');
    assert.equal(living().id, original);
    assert.equal(living().rank, 7);
    assert.throws(() => travel('travel_out'));
    assert.throws(() => forge('settle'));
    validate();
    forge('buy_dose'); forge('travel_out');
    assert.equal(life.p.state.simulation.people.player.location, id('stargate.observatory'));
    life.start('stargate.walk_back'); life.step(60);
    forge('settle');
    assert.equal(world().attempts.find(job => job.id === 'fixed-rival-1').cause, 'occupied');
    assert.equal(world().gu.length, 1);
    life.start('chores'); life.step(120);
    forge('commission'); life.step(30); forge('destroy');
    assert.equal(living(), undefined);
    assert.throws(() => travel('borrow'));
    forge('settle');
    assert.equal(world().attempts.find(job => job.id === 'fixed-rival-2').cause, 'occupied');
    life.start('chores'); life.step(120);
    forge('commission');
    validate();
    life.step(30); forge('settle'); travel('borrow');
    assert.equal(living().rank, 6);
    assert.notEqual(living().id, original);
    travel('travel_out');
    assert.equal(life.p.state.simulation.people.player.location, id('stargate.observatory'));
    validate();
});

test('Fixed Immortal Travel checks scene changes, seals, custody and the actual fuel family', () => {
    const args = {gu: {id: 'fixed-travel', kind: 'fixed-immortal-travel', holder: 'player', rank: 6, fedThrough: 12},
        operator: 'player', now: 12, from: 'annex', destination: {id: 'hill', scene: 'stone-terrace'},
        impression: {site: 'hill', scene: 'stone-terrace'},
        supply: {pool: 'green-grape', family: 'immortal', rank: 6, source: 'stored'}, reserve: 1};
    assert.equal(quoteFixedImmortalTravel(args).spent, 1);
    assert.equal(quoteFixedImmortalTravel({...args, impression: null}).reason, 'unknown-destination');
    assert.equal(quoteFixedImmortalTravel({...args, destination: {...args.destination, scene: 'fallen-terrace'}}).reason, 'changed-destination');
    assert.equal(quoteFixedImmortalTravel({...args, destination: {...args.destination, sealed: true}}).reason, 'sealed-destination');
    assert.equal(quoteFixedImmortalTravel({...args, gu: {...args.gu, holder: 'steward'}}).reason, 'unavailable');
    assert.equal(quoteFixedImmortalTravel({...args, supply: {...args.supply, family: 'primeval'}}).reason, 'wrong-fuel');
});

test('Keeper Stargates accept natural light at both endpoints and use carried Gu when the sky fails', () => {
    const life = setup(717, guKeeperFireflyFarm, guKeeperStargate, guKeeperStargateSky);
    life.admitExtension(0);
    life.start('firefly_farm.start');
    assert.throws(() => life.admitExtension(2), /Try the paired Stargates/);
    life.admitExtension(1);
    life.admitExtension(2);
    life.step(120);
    life.start('firefly_farm.collect');
    const stock = () => life.p.gameplay.player.inventory[fireflyItem] ?? 0;
    life.setWeather(2 * DAY + 20 * 60 + 30);
    assert.throws(() => life.start('stargate_sky.cross_out'), /Both gates/);
    life.setWeather(4 * DAY + 22 * 60);
    assert.throws(() => life.start('stargate_sky.cross_out'), /Both gates/);
    life.setWeather(2 * DAY + 21 * 60);
    life.start('stargate_sky.cross_out');
    assert.equal(stock(), 1);
    assert.equal(life.p.nativePatch['current location'], id('stargate.observatory'));
    const save = JSON.parse(JSON.stringify(life.envelope()));
    const definitions = new Map([[life.d.id, life.d]]);
    validateStructuredEnvelope(save);
    requireStructuredContent(save.content_packs.structured, definitions, save.expansion);
    const invalid = structuredClone(save.content_packs.structured);
    invalid.extensions = invalid.extensions.filter(pin => pin.id !== guKeeperStargate.id);
    assert.throws(() => requireStructuredContent(invalid, definitions, save.expansion), /required continuation/);
    life.setWeather(3 * DAY + 4 * 60);
    assert.throws(() => life.start('stargate_sky.cross_back'), /Both gates/);
    life.start('stargate.cross_back');
    assert.equal(stock(), 0);
});

test('Keeper Stargate spends collected Gu on native relocation and permits a return on foot', () => {
    const life = setup(717, guKeeperFireflyFarm, guKeeperStargate);
    const original = structuredClone(life.record);
    const definitions = new Map([[life.d.id, life.d]]);
    requireStructuredContent(original, definitions, life.p.state);
    life.admitExtension(0);
    life.start('firefly_farm.start');
    life.admitExtension(1);
    assert.deepEqual(life.record.locationIds, [id('annex'), id('stargate.observatory')]);
    assert.throws(() => life.start('stargate.cross_out'), /Collect a Starlight Firefly Gu/);
    life.step(120);
    life.start('firefly_farm.collect');
    const stock = () => life.p.gameplay.player.inventory[fireflyItem] ?? 0;
    assert.equal(stock(), 1);
    life.start('stargate.cross_out');
    assert.equal(stock(), 0);
    assert.equal(life.p.nativePatch['current location'], id('stargate.observatory'));
    const across = JSON.parse(JSON.stringify(life.envelope()));
    validateStructuredEnvelope(across);
    requireStructuredContent(across.content_packs.structured, definitions, across.expansion);
    const bad = structuredClone(across.content_packs.structured);
    bad.extensions.pop();
    assert.throws(() => requireStructuredContent(bad, definitions, across.expansion));
    assert.throws(() => life.start('stargate.cross_back'), /Collect a Starlight Firefly Gu/);
    life.start('stargate.walk_back');
    life.step(60);
    assert.equal(life.p.state.simulation.people.player.location, id('annex'));
    assert.equal(stock(), 0);
    life.start('firefly_farm.collect');
    life.start('firefly_farm.collect');
    life.start('stargate.cross_out');
    life.start('stargate.cross_back');
    assert.equal(life.p.state.simulation.people.player.location, id('annex'));
    assert.equal(stock(), 0);
});

test('Keeper advances the won Fortune Thread in place and settles quench or cancellation from the same recipe', () => {
    const start = seed => {
        const life = setup(seed, guKeeperImmortalRefinement, guKeeperImmortalAdvancement);
        life.admitExtension(0);
        assert.throws(() => life.admitExtension(1), /of your own/);
        life.start('immortal_refinement.buy_sand');
        life.start('immortal_refinement.start');
        life.step(20);
        life.start('immortal_refinement.prepare');
        life.step(20);
        life.start('immortal_refinement.finish');
        life.admitExtension(1);
        life.start('immortal_advancement.buy_sand');
        life.start('immortal_advancement.advance_start');
        return life;
    };
    const view = life => keeperRefinementView(life.p.state);
    const safe = start(717);
    const original = view(safe).product;
    assert.equal(view(safe).rank, 6);
    assert.throws(() => safe.start('immortal_advancement.advance_finish'));
    validateKeeperEnvelope(JSON.parse(JSON.stringify(safe.envelope())));
    safe.step(30);
    safe.start('immortal_advancement.advance_finish');
    safe.step(20);
    assert.equal(view(safe).rank, 7);
    assert.equal(view(safe).product, original);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(safe.envelope())));

    const stopped = start(717);
    stopped.start('immortal_advancement.advance_cancel');
    assert.equal(view(stopped).rank, 6);
    assert.equal(stopped.p.gameplay.player.inventory[keeperLuckSand], 3);

    const outcomes = new Set();
    for (let seed = 1; seed <= 12 && outcomes.size < 2; seed++) {
        const rushed = start(seed * 5837);
        rushed.start('immortal_advancement.advance_quench');
        const settled = view(rushed);
        outcomes.add(settled.advancement.status);
        assert.equal(settled.rank, settled.advancement.status === 'complete' ? 7 : undefined);
        assert.equal(rushed.p.gameplay.player.inventory[keeperLuckSand] ?? 0, 0);
        rushed.step(50);
        assert.equal(view(rushed).rank, settled.rank);
        validateKeeperEnvelope(JSON.parse(JSON.stringify(rushed.envelope())));
    }
    assert.deepEqual([...outcomes].sort(), ['complete', 'failed']);
});

test('Fortune Thread stays claimed through a transfer and a later refinement can fill the vacant claim', () => {
    const life = setup(717, guKeeperImmortalRefinement, guKeeperImmortalReclamation, guKeeperImmortalAdvancement);
    const race = op => life.start(`immortal_refinement.${op}`);
    const reclaim = op => life.start(`immortal_reclamation.${op}`);
    const view = () => keeperRefinementView(life.p.state).reclamation;
    const validate = () => validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
    const prepare = () => {life.step(20); reclaim('retry_prepare'); life.step(20);};
    life.admitExtension(0);
    race('buy_sand');
    race('start');
    life.step(20);
    race('prepare');
    life.step(20);
    race('finish');
    const original = keeperRefinementView(life.p.state).product;
    life.admitExtension(1);
    reclaim('lend');
    assert.equal(view().holder, 'steward');
    assert.equal(view().rank, 6);
    assert.throws(() => reclaim('destroy'));
    life.start('chores'); life.step(120);
    race('buy_sand');
    reclaim('retry_start');
    prepare();
    validate();
    reclaim('retry_finish');
    assert.equal(view().replacement.status, 'failed');
    assert.equal(Object.hasOwn(view().replacement, 'cause'), false);
    assert.equal(view().holder, 'steward');
    reclaim('recall');
    assert.equal(view().specimen, original);
    for (let i = 0; i < 2; i++) {life.start('chores'); life.step(120);}
    race('buy_sand');
    reclaim('retry_start');
    prepare();
    reclaim('retry_cancel');
    assert.equal(life.p.gameplay.player.inventory[keeperLuckSand], 3);
    for (let i = 0; i < 2; i++) {life.start('chores'); life.step(120);}
    race('buy_sand');
    reclaim('retry_start');
    prepare();
    reclaim('destroy');
    assert.equal(view().holder, null);
    validate();
    reclaim('retry_finish');
    const replacement = view().specimen;
    assert.equal(view().replacement.status, 'complete');
    assert.notEqual(replacement, original);
    assert.equal(view().rank, 6);
    const invalid = JSON.parse(JSON.stringify(life.envelope()));
    const facts = invalid.expansion.worlds[id('world')].facts;
    const ledgerKey = id('immortal_reclamation.world_ledger');
    const ledger = JSON.parse(facts[ledgerKey]);
    ledger.world.gu.find(gu => gu.id === original).alive = true;
    facts[ledgerKey] = JSON.stringify(ledger);
    assert.throws(() => validateKeeperEnvelope(invalid), /Invalid living Gu claim/);
    life.admitExtension(2);
    life.start('immortal_advancement.advance_start');
    life.step(30);
    life.start('immortal_advancement.advance_finish');
    assert.equal(view().specimen, replacement);
    assert.equal(view().rank, 7);
    validate();
});

test('Keeper Immortal refinement settles the first finisher and refunds only unspent sand', () => {
    const start = () => {
        const life = setup(717, guKeeperImmortalRefinement);
        life.admitExtension();
        life.start('immortal_refinement.buy_sand');
        life.start('immortal_refinement.start');
        assert.equal(stones(life), 1);
        assert.equal(life.p.gameplay.player.inventory[keeperLuckSand] ?? 0, 0);
        assert.throws(() => life.start('immortal_refinement.prepare'));
        life.step(20);
        life.start('immortal_refinement.prepare');
        return life;
    };
    const view = life => keeperRefinementView(life.p.state);
    const first = start();
    validateKeeperEnvelope(JSON.parse(JSON.stringify(first.envelope())));
    assert.equal(view(first).status, 'working');
    assert.equal(view(first).stage, 1);
    first.step(20);
    first.start('immortal_refinement.finish');
    const won = view(first);
    assert.equal(won.status, 'complete');
    assert.equal(won.product, 'keeper-luck-refinement');
    first.step(60);
    assert.deepEqual(view(first), won);

    const late = start();
    late.step(70);
    assert.equal(view(late).status, 'working');
    late.start('immortal_refinement.finish');
    assert.equal(view(late).status, 'failed');
    assert.equal(Object.hasOwn(view(late), 'cause'), false);
    assert.equal(Object.hasOwn(view(late), 'product'), false);
    assert.equal(late.p.gameplay.player.inventory[keeperLuckSand] ?? 0, 0);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(late.envelope())));

    const stopped = start();
    stopped.start('immortal_refinement.cancel');
    assert.equal(stopped.p.gameplay.player.inventory[keeperLuckSand], 3);
    assert.equal(view(stopped).status, 'cancelled');
    assert.throws(() => stopped.start('immortal_refinement.cancel'));
});

test('A distant refiner can claim Fortune Thread after a Keeper destroys the original before the rival settles', () => {
    const life = setup(717, guKeeperImmortalRefinement, guKeeperImmortalReclamation);
    const race = op => life.start(`immortal_refinement.${op}`);
    const reclaim = op => life.start(`immortal_reclamation.${op}`);
    life.admitExtension(0);
    race('buy_sand'); race('start');
    life.step(20); race('prepare');
    life.step(20); race('finish');
    life.admitExtension(1);
    reclaim('destroy');
    life.start('chores'); life.step(120);
    race('buy_sand'); reclaim('retry_start');
    life.step(20); reclaim('retry_prepare');
    life.step(20); reclaim('retry_finish');
    const saved = JSON.parse(JSON.stringify(life.envelope()));
    const ledger = JSON.parse(saved.expansion.worlds[id('world')].facts[id('immortal_reclamation.world_ledger')]);
    assert.deepEqual(ledger.world.gu.map(({holder, alive}) => [holder, alive]), [['player', false], ['distant-refiner', true]]);
    assert.equal(keeperRefinementView(life.p.state).reclamation.holder, null);
    assert.equal(keeperRefinementView(life.p.state).reclamation.replacement.status, 'failed');
    validateKeeperEnvelope(saved);
});

test('Keeper wild Liquor Worm preserves its identity and familiarity across release and recapture', () => {
    const life = setup(717, guKeeperWildWorm);
    life.admitExtension();
    const action = name => life.start(`wild_worm.${name}`);
    const read = () => JSON.parse(life.p.state.worlds[id('world')].facts[id('wild_worm.encounter')]);
    action('find');
    const original = read().id;
    assert.throws(() => action('capture'));
    const initial = reserve(life);
    action('approach');
    assert.equal(reserve(life), initial);
    assert.equal(read().phase, 'sheltered');
    action('follow');
    assert.throws(() => action('lure'));
    action('buy_wine');
    action('lure');
    assert.equal(stones(life), 2);
    assert.equal(life.p.gameplay.player.inventory[key('wild_worm.wine')] ?? 0, 0);
    action('capture');
    assert.equal(reserve(life), initial - 2);
    assert.equal(read().lifecycle.individuals[original].keeper, 'player');
    assert.equal(read().controlled, false);
    action('refine');
    assert.equal(read().controlled, true);
    action('release');
    assert.equal(read().lifecycle.individuals[original].keeper, null);
    assert.equal(read().controlled, false);
    assert.throws(() => action('find'));
    const released = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(released);
    released.content_packs.structured.extensions = [];
    assert.throws(() => validateKeeperEnvelope(released), /Gu house permission/);
    life.step(60);
    action('find');
    if (read().lifecycle.individuals[original].traits.temperament === 'wary') {
        action('buy_wine');
        action('lure');
    }
    action('capture');
    const recaught = read();
    assert.deepEqual(Object.keys(recaught.lifecycle.individuals), [original]);
    assert.ok(recaught.lifecycle.individuals[original].experience.player.bond >= 30);
    assert.equal(recaught.controlled, false);
});

test('Keeper past Moonblade uses a witnessed cast after the live Gu starves out', () => {
    const life = setup(717, guKeeperMoonblade, guKeeperPastMoonblade);
    life.start('take_moon');
    life.admitExtension(0);
    life.admitExtension(1);
    assert.throws(() => life.start('past_moonblade.open'), /Cut a straw target/);
    life.start('moonblade.set_target');
    life.step(1);
    life.start('moonblade.cut_target');
    life.step(5);
    const moonBody = gu(life, 'moon').body.id;
    for (let day = 0; day < 12 && gu(life, 'moon').vitals.health > 1; day++) life.step(DAY);
    assert.equal(gu(life, 'moon').vitals.health, 1);
    life.start('past_moonblade.open');
    const restored = JSON.parse(JSON.stringify(life.envelope()));
    validateKeeperEnvelope(restored);
    const invalid = structuredClone(restored);
    delete invalid.expansion.worlds[id('world')].facts[id('past_moonblade.cast_at')];
    assert.throws(() => validateKeeperEnvelope(invalid), /times disagree/);
    life.start('moonblade.set_target');
    life.step(1);
    assert.throws(() => life.start('moonblade.cut_target'), /good health/);
    const ownEssence = reserve(life);
    life.start('past_moonblade.cast');
    assert.equal(reserve(life), ownEssence);
    assert.equal(gu(life, 'moon').body.id, moonBody);
    assert.equal(life.p.state.actors.player.facts[id('moonblade.target_ready')], false);
    assert.throws(() => life.start('past_moonblade.cast'));
    life.step(30);
    assert.equal(life.p.state.actors.player.facts[id('moonblade.target_ready')], false);
    validateKeeperEnvelope(JSON.parse(JSON.stringify(life.envelope())));
});

test('Keeper rank trial settles recoil, treatment and a separate stored dose on the native command path', () => {
    let recoil;
    for (let seed = 1; seed <= 20 && !recoil; seed++) {
        const life = setup((seed * 2654435761) >>> 0, guKeeperRankTrial);
        life.start('take_moon');
        life.admitExtension();
        life.start('rank_trial.borrow');
        life.start('rest');
        life.step(60);
        const before = reserve(life);
        life.start('rank_trial.aperture_cast');
        assert.equal(reserve(life), before - 10);
        if (life.p.state.actors.player.facts[id('rank_trial.moonglow_sound')] === false) recoil = life;
    }
    assert.ok(recoil, 'at least one deterministic seed must recoil');
    assert.equal(recoil.quote('rank_trial.aperture_cast').eligible, false);
    recoil.start('rank_trial.treat');
    recoil.start('rank_trial.buy_dose');
    const before = reserve(recoil);
    recoil.start('rank_trial.stored_cast');
    assert.equal(reserve(recoil), before);
    assert.equal(stones(recoil), 0);
    assert.equal(recoil.p.gameplay.player.inventory[key('rank_trial.red_steel')] || 0, 0);
    assert.match(recoil.p.state.simulation.knowledge.player[id('rank_trial.last_cast')].value, /cuts through/);
    const save = JSON.parse(JSON.stringify(recoil.envelope()));
    validateStructuredEnvelope(save);
    assert.deepEqual(loadExpansionState(save.expansion, recoil.registry), recoil.p.state);
});

test('Keeper firefly farm settles clocked emergence and collection through the native command transaction', () => {
    const f = setup(717, guKeeperFireflyFarm);
    f.admitExtension();
    f.start('firefly_farm.start');
    assert.equal(stones(f), 1);
    assert.equal(keeperHouseView(f.p.state, f.d, f.record, f.ctx()).ledger.net, -2);
    assert.equal(f.quote('firefly_farm.collect').eligible, false);
    f.step(60);
    assert.equal(keeperColonyView(f.p.state).emerged, 1);
    f.start('firefly_farm.collect');
    assert.equal(f.p.gameplay.player.inventory[fireflyItem], 1);
    assert.equal(keeperColonyView(f.p.state).emerged, 0);
    assert.equal(f.quote('firefly_farm.collect').eligible, false);
    const saved = JSON.parse(JSON.stringify(f.envelope()));
    validateStructuredEnvelope(saved);
    assert.deepEqual(loadExpansionState(saved.expansion, f.registry), f.p.state);
});

test('Keeper firefly care promotes one cohort member, rests it across save and uses the same Gu again', () => {
    const f = setup(717, guKeeperFireflyFarm, guKeeperFireflyCare);
    f.admitExtension();
    f.start('firefly_farm.start');
    f.admitExtension(1);
    f.step(60);
    f.start('firefly_care.keep');
    const kept = () => keeperColonyView(f.p.state).kept;
    const individual = kept().id;
    assert.equal(keeperColonyView(f.p.state).emerged, 0);
    assert.equal(f.p.gameplay.player.inventory[fireflyItem], undefined);
    const before = reserve(f);
    f.start('firefly_care.shine');
    assert.equal(reserve(f), before - 1);
    assert.equal(f.quote('firefly_care.shine').eligible, false);
    f.start('firefly_care.care');
    f.step(29);
    const saved = JSON.parse(JSON.stringify(f.envelope()));
    validateKeeperEnvelope(saved);
    assert.deepEqual(keeperColonyView(loadExpansionState(saved.expansion, f.registry)).kept,
        {id: individual, tired: true, resting: true});
    f.step(1);
    assert.deepEqual(kept(), {id: individual, tired: false, resting: false});
    f.start('firefly_care.shine');
    assert.equal(kept().id, individual);
});
test('seam: diet validation, compiled rows, prediction and the feeding cap are pure and exact', () => {
    const d = keeperDiets[0], lethal = {...d, lethal: true};
    assert.throws(() => validateDiet({...d, perMeal: 0}), /positive/);
    assert.throws(() => validateDiet({...d, alt: {food: d.food, perMeal: 1}}), /alternate/);
    const ids = diet => compileUpkeepEvents(diet, {worldId: id('world'), ids: id}).map(r => r.id.split('.').pop());
    assert.deepEqual(ids(lethal), ['a_reset', 'b_death', 'c_meal', 'c_meal_alt', 'd_hunger', 'b_death_refined', 'c_meal_refined', 'c_meal_alt_refined', 'd_hunger_refined']);
    assert.ok(!ids(d).some(x => x.startsWith('b_death')), 'a non-lethal diet has no death rows');
    assert.equal(nextMeal(d, 100, 0), DAY);
    // 8 petals = 2 meals of 4 (heals to 4); misses at boundaries 3,4,5 -> condition 1 after 5; a lethal diet dies at 6.
    const s = starvation(lethal, {stock: 8, condition: 4, now: 0});
    assert.deepEqual([s.meals, s.firstMiss, s.deathAt, s.starvedOutAt], [2, 3 * DAY, 6 * DAY, 5 * DAY]);
    const n = starvation(d, {stock: 8, altStock: 12, condition: 4, now: 0});
    assert.deepEqual([n.meals, n.deathAt, n.starvedOutAt], [4, null, 7 * DAY], 'two poorer meals push hunger back two days');
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
test('hunger on schedule: unfed Gu lose condition on the predicted minutes, are starved out (not dead), refuse work, and recover when fed', () => {
    const f = setup(), diet = keeperDiets[0]; f.start('take_moon');
    const t = starvation(diet, {stock: 0, condition: 4, now: f.p.state.clock, anchor: 0});
    f.step(t.starvedOutAt - 1 - f.p.state.clock); assert.equal(gu(f, 'moon').vitals.health, 2);
    f.step(1); assert.equal(gu(f, 'moon').vitals.health, 1); assert.equal(gu(f, 'moon').life, 'alive');
    f.step(9 * DAY); assert.equal(gu(f, 'moon').life, 'alive', 'a keeper’s Gu does not die of hunger'); assert.equal(gu(f, 'moon').vitals.health, 1);
    assert.equal(f.quote('work_moon').eligible, false); assert.equal(f.quote('work_moon_weak').eligible, false);
    assert.equal(stones(f), DIAL.startStones + DIAL.stipendStones * Math.floor(f.p.state.clock / (7 * DAY)));
    f.start('feed_moon'); f.step(DAY); assert.equal(gu(f, 'moon').vitals.health, 2, 'a meal heals one point');
    assert.equal(f.quote('work_moon_weak').eligible, true); assert.equal(f.quote('work_moon').eligible, false);
    f.start('chores'); f.step(DIAL.choreMinutes); assert.equal(stones(f) > DIAL.startStones, true); valid(f);
});
test('work: a sound Gu pays once per meal window; a hungry Gu works at risk but is never killed', () => {
    const f = setup(); f.start('take_moon'); f.start('feed_moon');
    const before = stones(f); f.start('work_moon'); assert.equal(stones(f), before + 1); assert.equal(f.quote('work_moon').eligible, false);
    f.step(DAY); assert.equal(f.quote('work_moon').eligible, true, 'the window reopens at the next boundary');
    const seen = new Set();
    for(let seed = 1; seed <= 60 && seen.size < 2; seed++) {
        const g = setup(seed); g.start('take_moon'); g.step(2 * DAY - g.p.state.clock); assert.equal(gu(g, 'moon').vitals.health, 2);
        g.p.state.simulation.seed = seed * 2654435761 % 4294967295 + 1; const b = stones(g); g.start('work_moon_weak');
        assert.equal(stones(g), b + 1); assert.equal(gu(g, 'moon').life, 'alive'); seen.add(gu(g, 'moon').vitals.health);
    }
    assert.deepEqual([...seen].sort(), [1, 2]);
});
test('standing order feeds before the meal; poorer food ends hunger without healing', () => {
    const f = setup(); f.start('take_moon'); f.start('buy_petals'); f.start('buy_petals');
    f.start('order_moon_on'); assert.equal(f.quote('order_moon_on').eligible, false);
    f.step(5 * DAY - f.p.state.clock); assert.equal(gu(f, 'moon').vitals.health, 4, 'the order ran before each meal'); assert.equal(f.p.gameplay.player.inventory[key('petals')], 24 - 20);
    f.start('order_moon_off'); f.step(2 * DAY); assert.equal(gu(f, 'moon').vitals.health >= 2, true);
    const g = setup(); g.start('take_moon'); g.step(DAY); assert.equal(gu(g, 'moon').vitals.health, 3);
    g.start('buy_dried'); g.start('feed_dried'); g.step(DAY); assert.equal(gu(g, 'moon').vitals.health, 3, 'poorer food holds condition');
    assert.equal(larder(g, 'moon', 'dried'), 6);
    g.start('buy_petals'); g.start('feed_moon'); g.step(DAY); assert.equal(gu(g, 'moon').vitals.health, 4, 'main food heals');
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
    const m = h.gu.find(x => x.id === 'moon'); assert.deepEqual([m.kept, m.mealsStocked, m.nextMealIn, m.starvesIn, m.starvedOutIn], [true, 2, DAY, null, 5 * DAY - f.p.state.clock]);
    assert.equal(h.gu.find(x => x.id === 'worm').kept, false); assert.match(h.feedingCap.line, /1 of 1/);
    assert.deepEqual([m.being.grain, m.being.holder, m.being.care.state, m.being.tie.rows.length, m.ability], ['held', 'you', 'fed', 0, 'sound'], 'CPR10: the shared being record reads the Gu row');
    assert.equal(h.gu.find(x => x.id === 'worm').being.holder, 'the clan steward');
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

test('automatic keeper events that act on the player are gated, so another world\'s enrolled player never runs them (LOTM wait stall)',()=>{
    const events=raw.simulation?.events||raw.events||[];
    assert.ok(events.length>0);
    const open=events.filter(e=>e.automatic&&(e.actorId||'player')==='player'&&!e.requires).map(e=>e.id);
    assert.deepEqual(open,[]);
});

// Compression regressions exercise saved native ledgers across the shared Gu working hosts.
import {refinementLine} from '../src/gu_refinement_line.js';
import {sevenLine, nineLine} from '../src/world_packs/book_gu_keeper_lines.js';
import {guGarden} from '../src/gu_garden_host.js';
import {vitalityGarden} from '../src/world_packs/book_gu_keeper_gardens.js';
import {sustainedGuHost} from '../src/gu_sustained_host.js';
import {rainbowLine} from '../src/world_packs/book_gu_keeper_sustained.js';
import {guRefinementTrial} from '../src/gu_refinement_trial_host.js';
import {stealthTrial} from '../src/world_packs/book_gu_keeper_refinement_trials.js';

function compressedFixture(config, packs = []) {
    const state = {clock: 10, worlds: {[config.world]: {facts: {}}},
        actors: {player: {worldId: config.world, completed: {}, facts: {}}},
        simulation: {people: {player: {life: 'alive', location: config.place ?? 'test.host'},
            [config.custodian]: {life: 'alive', location: config.place ?? 'test.host'}}}};
    const record = {initializedAt: 0, extensions: [config.id, ...packs].map(id => ({id}))};
    const receipt = (op, pack = config.id) => {
        const key = `${pack}.${op}`;
        state.actors.player.completed[key] = (state.actors.player.completed[key] ?? 0) + 1;
    };
    return {state, record, receipt};
}

test('compressed Worm lines retain cancellation, late failure, lineage and saved reserve receipts', () => {
    const seven = refinementLine(sevenLine, {ready: () => true, activate: () => 2});
    const {state, record, receipt} = compressedFixture(sevenLine);
    const parent = {id: 'test.four', rank: 2, provenance: {recipe: 'four-flavors-fusion'}};
    const act = op => {seven.apply(state, record, op, parent, true); receipt(op); seven.validate(state, record, parent);};
    assert.equal(seven.actions(state, parent, false).prepare_seven, false);
    act('prepare_seven');
    assert.equal(seven.actions(state, parent, true).finish_seven, false);
    act('cancel_seven'); act('prepare_seven');
    state.clock += sevenLine.minutes;
    act('finish_seven'); act('feed_seven'); act('concentrate_silver'); act('cast_seven');
    assert.equal(seven.view(state, record).stock, 0);
    assert.equal(seven.actions(state, parent, true, true).concentrate_silver, false);
    const savedSeven = JSON.parse(JSON.stringify(state));
    assert.deepEqual(seven.view(savedSeven, record), seven.view(state, record));
    seven.validate(savedSeven, record, parent);
    savedSeven.actors.player.completed[`${sevenLine.id}.cast_seven`]++;
    assert.throws(() => seven.validate(savedSeven, record, parent), /receipts/);

    const nine = refinementLine(nineLine), fixture = compressedFixture(nineLine);
    const input = seven.specimen(state);
    const next = op => {nine.apply(fixture.state, fixture.record, op, input); fixture.receipt(op);
        nine.validate(fixture.state, fixture.record, input);};
    fixture.receipt('buy_second');
    next('prepare_nine'); fixture.state.clock += nineLine.holdMinutes; next('settle_nine');
    assert.equal(nine.view(fixture.state, fixture.record).status, 'failed');
    next('prepare_nine'); next('cancel_nine'); next('prepare_nine');
    fixture.state.clock += nineLine.minutes; next('settle_nine'); next('feed_nine');
    next('test_initial'); assert.equal(nine.view(fixture.state, fixture.record).lastDistance, 100);
    next('concentrate_gold'); next('cross_cut');
    assert.equal(nine.view(fixture.state, fixture.record).lastDistance, 200);
    assert.equal(nine.view(fixture.state, fixture.record).stock, 0);
    const savedNine = JSON.parse(JSON.stringify(fixture.state));
    nine.validate(savedNine, fixture.record, input);
    assert.deepEqual(nine.view(savedNine, fixture.record), nine.view(fixture.state, fixture.record));
    const job = JSON.parse(savedNine.worlds[nineLine.world].facts[`${nineLine.id}.work`]);
    job.world.gu.at(-1).provenance.ingredients.second = 'wrong.worm';
    savedNine.worlds[nineLine.world].facts[`${nineLine.id}.work`] = JSON.stringify(job);
    assert.throws(() => nine.validate(savedNine, fixture.record, input), /lineage/);
});

test('a garden row keeps the same plant, detached stock, daylight and treatment rest after serialization', () => {
    // A second location and operation vocabulary exercise row reuse without a new host.
    const config = {...vitalityGarden, id: 'test.garden', key: 'test.garden.bed', place: 'test.courtyard',
        plantId: 'test.plant', item: 'test.leaf', ops: {borrow: 'lend', return: 'give_back', grow: 'nurture',
            harvest: 'pluck', treat: 'heal', sell: 'trade'}};
    const host = guGarden(config), {state, record, receipt} = compressedFixture(config);
    const inventory = {}, context = {actorId: 'player', structuredNative: record,
        vitals: {player: {health: 4, max_health: 10}}, nativeWeatherClock: {minute: 600, clock: state.clock}};
    const act = op => {
        const result = host.apply(state, {operation: op}, context); receipt(op);
        if (result) inventory[result.key] = (inventory[result.key] ?? 0) + result.count;
        if (op === config.ops.treat) inventory[config.item]--;
        host.validate(state, record, inventory);
    };
    act('lend'); act('nurture');
    assert.equal(host.facts(state, context)['test.garden.can_nurture'], false);
    act('pluck'); act('heal');
    assert.equal(host.facts(state, context)['test.garden.can_heal'], false);
    act('give_back'); act('lend'); state.clock += config.growthMinutes; act('nurture');
    const saved = JSON.parse(JSON.stringify(state));
    host.validate(saved, record, inventory);
    assert.deepEqual(host.view(saved, record), host.view(state, record));
    state.clock += 720;
    assert.equal(host.facts(state, context)['test.garden.can_nurture'], false);
});

test('a sustained row settles support loss, exhaustion and exact due-time renewal on the working law', () => {
    const host = sustainedGuHost(rainbowLine), {state, record, receipt} = compressedFixture(rainbowLine);
    state.actors.player.facts[rainbowLine.core.id] = true;
    state.actors.player.facts[rainbowLine.support.id] = true;
    const context = {actorId: 'player', structuredNative: record};
    const act = operation => {host.apply(state, {type: rainbowLine.effectType, actor: 'player', operation}, context);
        receipt(operation); host.validate(state, record);};
    assert.equal(host.quote(false), 6); assert.equal(host.quote(true), 4);
    act('buy'); act('start_supported');
    const saved = JSON.parse(JSON.stringify(state));
    state.clock = host.boundary(state); host.advance(state); host.validate(state, record);
    assert.equal(host.view(state, record).reserve, 4);
    const restored = sustainedGuHost(rainbowLine);
    saved.clock = restored.boundary(saved); restored.advance(saved);
    assert.deepEqual(saved, state);
    delete state.actors.player.facts[rainbowLine.support.id];
    state.clock = host.boundary(state); host.advance(state); host.validate(state, record);
    assert.equal(host.view(state, record).reason, 'Gu unavailable');
    assert.equal(host.view(state, record).reserve, 4);
    act('buy'); act('start_solo');
    state.clock = host.boundary(state); host.advance(state);
    state.clock = host.boundary(state); host.advance(state);
    assert.equal(host.view(state, record).reason, 'needs more essence');
    host.validate(state, record);
    // A support can pay before the core refuses. Preserve that paid debit at renewal.
    act('buy'); act('start_solo'); act('stop');
    state.actors.player.facts[rainbowLine.support.id] = true;
    act('start_supported');
    state.clock = host.boundary(state); host.advance(state);
    assert.equal(host.view(state, record).reserve, 2);
    state.clock = host.boundary(state); host.advance(state);
    assert.equal(host.view(state, record).reserve, 1);
    assert.equal(host.view(state, record).reason, 'needs more essence');
    host.validate(state, record);
});

test('branch rows conserve exact Fish Scale inputs across cancellation and both consumed-input products', () => {
    const host = guRefinementTrial(stealthTrial);
    const {state, record, receipt} = compressedFixture(stealthTrial, ['book.ri.keeper.scale_armor']);
    const act = op => {host.apply(state, record, op); receipt(op, host.pack(op)); host.validate(state, record);};
    act('take_rock'); act('bind_rock'); act('test_rock'); act('buy_fish'); act('prepare_cloak');
    assert.equal(host.facts(state)[`${stealthTrial.id}.can_test_rock`], false);
    act('cancel_cloak'); act('prepare_cloak'); state.clock += stealthTrial.branches.cloak.minutes;
    act('finish_cloak'); act('test_scales'); act('cross_screen');
    act('trade_fish'); act('prepare_armor'); state.clock += stealthTrial.branches.armor.minutes;
    act('finish_armor'); act('guard_run');
    assert.equal(host.view(state, record).armorGuarded, true);
    assert.equal(host.facts(state)[`${stealthTrial.id}.can_buy_fish`], false);
    const saved = JSON.parse(JSON.stringify(state)); host.validate(saved, record);
    assert.deepEqual(host.view(saved, record), host.view(state, record));
    const ledger = JSON.parse(saved.worlds[stealthTrial.world].facts[stealthTrial.key]);
    ledger.world.gu.find(gu => gu.kind === 'fish-scale').alive = true;
    saved.worlds[stealthTrial.world].facts[stealthTrial.key] = JSON.stringify(ledger);
    assert.throws(() => host.validate(saved, record), /receipts/);
});

test('Keeper demonstrations and crossing plans keep exact damage, recovery and saved receipts after guard loss', () => {
    const config = {id: keeperDefense, world: id('world')};
    const {state, record, receipt} = compressedFixture(config, [keeperDefenseResearch]);
    const jadeId = id('jade');
    const aperture = {reserve: 6};
    state.simulation.energies = {player: {[id('primeval')]: aperture}};
    state.simulation.people[jadeId] = {life: 'alive', body: {controllerId: 'player'}, vitals: {health: 2}};
    state.simulation.claims = {[`${jadeId}_title`]: {owner: 'player'}};
    const facts = state.worlds[config.world].facts;
    const note = 'book.ri.keeper.layered_defense.trial';
    const armor = {...stealthTrial.specimens.armor, alive: true};
    facts[stealthTrial.key] = JSON.stringify({world: {gu: [armor]}});

    const initial = keeperDefenseView(state, record);
    assert.equal(initial.research.limit, 8);
    assert.deepEqual(initial.research.options.find(row => row.operation === 'cross_6'), {
        operation: 'cross_6', cost: 4, kinds: ['white-jade', 'scale-armor'], blast: 7, landing: 1,
    });
    assert.equal(applyKeeperDefense(state, record, 'bare_blast', 1), 13);
    receipt('bare_blast');
    assert.equal(facts[note], '{"operation":"bare_blast","at":10,"shieldAt":null}');
    assert.throws(() => applyKeeperDefenseResearch(state, record, 'cross_5', 1), /hunter can fire again/);

    state.clock = 15;
    armor.alive = false;
    facts[stealthTrial.key] = JSON.stringify({world: {gu: [armor]}});
    assert.equal(defenseFacts(state, true)[`${keeperDefense}.armor_ready`], false);
    assert.equal(keeperDefenseResearchFacts(state, record)[`${keeperDefenseResearch}.cross_5`], undefined);
    assert.throws(() => applyKeeperDefense(state, record, 'braced_blast', 1), /chosen defenses must be ready/);
    assert.throws(() => applyKeeperDefenseResearch(state, record, 'cross_5', 1), /Gu or essence.*changed/);
    assert.equal(facts[note], '{"operation":"bare_blast","at":10,"shieldAt":null}');

    armor.alive = true;
    facts[stealthTrial.key] = JSON.stringify({world: {gu: [armor]}});
    aperture.reserve = 3;
    assert.throws(() => applyKeeperDefenseResearch(state, record, 'cross_5', 1), /Gu or essence.*changed/);
    aperture.reserve = 6;
    assert.deepEqual(applyKeeperDefenseResearch(state, record, 'cross_5', 1), {cost: 4, damage: 5});
    receipt('cross_5', keeperDefenseResearch);
    state.simulation.people.player.location = defenseFarBank;
    assert.equal(facts[note], '{"operation":"cross_5","at":15,"shieldAt":15}');
    assert.equal(state.actors.player.completed['book.ri.keeper.defense_research.cross_5'], 1);
    assert.equal(aperture.reserve, 6, 'The native command owns the quoted debit.');

    state.clock = 20;
    armor.alive = false;
    facts[stealthTrial.key] = JSON.stringify({world: {gu: [armor]}});
    const saved = JSON.parse(JSON.stringify(state));
    validateKeeperDefense(saved, record);
    const restored = keeperDefenseView(saved, record);
    assert.deepEqual(restored, keeperDefenseView(state, record));
    assert.deepEqual(restored.last.remainder.map(packet => packet.amount), [4, 1]);
    assert.deepEqual(restored.last.layers, [{id: 'water-shield', absorbed: 5, broken: true},
        {id: 'scale-armor', absorbed: 3, broken: false}]);
    assert.equal(restored.shotIn, 0);
    assert.equal(restored.shieldIn, 15);
    assert.deepEqual(restored.research.missing, ['water-shield', 'scale-armor']);
    assert.deepEqual(restored.research.options, []);
});

test('a refined Gu is a tied being: pushed hungry it resents it, the work verb shuts, feeding makes amends (CPR10, TIE19)', () => {
    let f = null;
    for(let seed = 1; seed <= 60 && !f; seed++) {
        const g = setup(seed); g.start('take_moon'); g.start('buy_petals'); g.start('buy_lees');
        g.p.state.simulation.seed = seed * 2654435761 % 4294967295 + 1; g.start('fuse');
        if(gu(g, 'moon').vitals.health === 4) f = g;
    }
    assert.ok(f, 'some seed refines');
    const view = () => keeperHouseView(f.p.state, f.d, f.record, f.ctx()).gu.find(r => r.id === 'moon');
    assert.equal(view().being.grain, 'tied');
    assert.match(view().being.tie.line, /comes when you call/);
    assert.equal(f.quote('work_moon').eligible, true);
    assert.equal(f.quote('work_moon_weak').eligible, false);
    // Starve it to condition 2 and push it: the bound variant is the one on offer, and it leaves the Gu resenting.
    f.start('feed_moon'); f.step(DAY * 4);
    const cond = gu(f, 'moon').vitals.health;
    assert.ok(cond <= 3, 'it got hungry');
    f.p.state.simulation.people[id('moon')].vitals.health = 2;
    assert.equal(f.quote('work_moon_weak').eligible, false, 'a refined Gu uses the bound variant');
    assert.equal(f.quote('work_moon_weak_bound').eligible, true);
    f.start('work_moon_weak_bound');
    assert.equal(view().resents, true);
    assert.match(view().being.tie.line, /snaps at you/);
    assert.match(view().being.tie.line, /refuses to be handled|snaps/);
    // Shut by the tie, not by hunger: set it fed and sound; the verb stays shut until you feed it.
    f.p.state.simulation.people[id('moon')].vitals.health = 4;
    f.step(DAY);
    f.p.state.simulation.people[id('moon')].vitals.health = 4;
    assert.equal(f.quote('work_moon').eligible, false);
    f.start('feed_moon');
    assert.equal(view().resents, false);
    assert.equal(f.quote('work_moon').eligible, true);
    assert.match(view().being.tie.line, /comes when you call/);
    valid(f);
});
test('an unrefined Gu is held, has no mind to resent, and keeps the plain hungry-work command', () => {
    const f = setup(); f.start('take_moon');
    assert.equal(f.quote('work_moon_weak_bound').eligible, false);
    assert.equal(keeperHouseView(f.p.state, f.d, f.record, f.ctx()).gu.find(r => r.id === 'moon').being.grain, 'held');
});
