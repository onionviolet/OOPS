import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import {guLeadLife, riLeadId as id} from '../src/world_packs/book_gu_lead_life.js';
import {GU_LEAD_SELECTION, guLeadSelection, guLeadAcademyPassageClockRequest, leadMoonlightKey} from '../src/world_packs/book_gu_lead_selection.js';
import {GU_LEAD_REFINEMENT, guLeadRefinement, guLeadRefinementClockRequest, guLeadRefinementStatus} from '../src/world_packs/book_gu_lead_refinement.js';
import {GU_LEAD_VITAL, guLeadVital, guLeadVitalClockRequest} from '../src/world_packs/book_gu_lead_vital.js';
import {GU_LEAD_MOONBLADE, guLeadMoonblade, guLeadMoonbladeClockRequest} from '../src/world_packs/book_gu_lead_moonblade.js';
import {GU_LEAD_DORM, guLeadDorm, guLeadDormClockRequest, registerGuLeadDorm} from '../src/world_packs/book_gu_lead_dorm.js';
import {GU_LEAD_ASSESSMENT, guLeadAssessment, registerGuLeadAssessment} from '../src/world_packs/book_gu_lead_assessment.js';
import {GU_LEAD_CONFRONTATION, guLeadConfrontation, guLeadConfrontationClockRequest, registerGuLeadConfrontation} from '../src/world_packs/book_gu_lead_confrontation.js';
import {GU_LEAD_CLAN_RESPONSE, guLeadClanResponse, guLeadClanResponseClockRequest, registerGuLeadClanResponse} from '../src/world_packs/book_gu_lead_clan_response.js';
import {GU_LEAD_CARAVAN, guLeadCaravan, guLeadCaravanClockRequest, registerGuLeadCaravan} from '../src/world_packs/book_gu_lead_caravan.js';
import {GU_LEAD_INHERITANCE, guLeadInheritance, guLeadInheritanceClockRequest, registerGuLeadInheritance} from '../src/world_packs/book_gu_lead_inheritance.js';
import {GU_LEAD_MOONVEIL, guLeadMoonveil, guLeadMoonveilClockRequest, registerGuLeadMoonveil} from '../src/world_packs/book_gu_lead_moonveil.js';
import {GU_LEAD_HEARING, guLeadHearing, registerGuLeadHearing} from '../src/world_packs/book_gu_lead_hearing.js';
import {GU_LEAD_SECOND_GU, guLeadSecondGu, guLeadSecondGuClockRequest, registerGuLeadSecondGu} from '../src/world_packs/book_gu_lead_second_gu.js';
import {guLeadLightPairing} from '../src/world_packs/book_gu_lead_light_pairing.js';
import {GU_LEAD_EARLY_DUEL, guLeadEarlyDuel, guLeadEarlyDuelClockRequest, registerGuLeadEarlyDuel} from '../src/world_packs/book_gu_lead_early_duel.js';
import {GU_LEAD_HUNT_FOLLOWTHROUGH, guLeadHuntFollowthrough, guLeadHuntFollowthroughClockRequest, registerGuLeadHuntFollowthrough} from '../src/world_packs/book_gu_lead_hunt_followthrough.js';
import {GU_LEAD_EXAM_RESULT, guLeadExamResult, guLeadExamResultClockRequest, registerGuLeadExamResult} from '../src/world_packs/book_gu_lead_exam_result.js';
import {GU_LEAD_YEAR_END, guLeadYearEnd, guLeadYearEndClockRequest, registerGuLeadYearEnd} from '../src/world_packs/book_gu_lead_year_end.js';
import {GU_LEAD_RANK_TWO, guLeadRankTwo, guLeadRankTwoClockRequest, registerGuLeadRankTwo} from '../src/world_packs/book_gu_lead_rank_two.js';
import {GU_LEAD_ESTATE_CLAIM, guLeadEstateClaim, guLeadEstateClaimClockRequest, registerGuLeadEstateClaim} from '../src/world_packs/book_gu_lead_estate_claim.js';
import {GU_LEAD_WHITE_JADE, guLeadWhiteJade, guLeadWhiteJadeClockRequest, registerGuLeadWhiteJade} from '../src/world_packs/book_gu_lead_white_jade.js';
import {guLeadEstateHandover, guLeadEstateHandoverClockRequest, registerGuLeadEstateHandover} from '../src/world_packs/book_gu_lead_estate_handover.js';
import {guLeadQingShuMeeting, registerGuLeadQingShuMeeting} from '../src/world_packs/book_gu_lead_qing_shu_meeting.js';
import {guLeadMoonglow, guLeadMoonglowClockRequest, registerGuLeadMoonglow} from '../src/world_packs/book_gu_lead_moonglow.js';
import {guLeadRelicMarket, guLeadRelicMarketClockRequest, registerGuLeadRelicMarket} from '../src/world_packs/book_gu_lead_relic_market.js';
import {guLeadStoneForest, registerGuLeadStoneForest} from '../src/world_packs/book_gu_lead_stone_forest.js';
import {guLeadRiverToad, registerGuLeadRiverToad} from '../src/world_packs/book_gu_lead_river_toad.js';
import {guLeadWolfFront, guLeadWolfFrontClockRequest, registerGuLeadWolfFront} from '../src/world_packs/book_gu_lead_wolf_front.js';
import {guLeadAllianceSlope, registerGuLeadAllianceSlope} from '../src/world_packs/book_gu_lead_alliance_slope.js';
import {guLeadEarGrass, guLeadEarGrassClockRequest, registerGuLeadEarGrass} from '../src/world_packs/book_gu_lead_ear_grass.js';
import {guLeadIceSoul, guLeadIceSoulClockRequest, registerGuLeadIceSoul} from '../src/world_packs/book_gu_lead_ice_soul.js';
import {guLeadIceCrystal, registerGuLeadIceCrystal} from '../src/world_packs/book_gu_lead_ice_crystal.js';
import {guLeadWoodCharm, guLeadWoodCharmClockRequest, registerGuLeadWoodCharm} from '../src/world_packs/book_gu_lead_wood_charm.js';
import {guLeadWallNight, registerGuLeadWallNight} from '../src/world_packs/book_gu_lead_wall_night.js';
import {guLeadBurialGu, registerGuLeadBurialGu} from '../src/world_packs/book_gu_lead_burial_gu.js';
import {guLeadElderHall, guLeadElderHallClockRequest, registerGuLeadElderHall} from '../src/world_packs/book_gu_lead_elder_hall.js';
import {guLeadSecretRoom, guLeadSecretRoomClockRequest, registerGuLeadSecretRoom} from '../src/world_packs/book_gu_lead_secret_room.js';
import {guLeadTusitaFlower, guLeadTusitaFlowerClockRequest, registerGuLeadTusitaFlower} from '../src/world_packs/book_gu_lead_tusita_flower.js';
import {guLeadThunderCrown, guLeadThunderCrownClockRequest, registerGuLeadThunderCrown} from '../src/world_packs/book_gu_lead_thunder_crown.js';
import {guLeadLycan, registerGuLeadLycan} from '../src/world_packs/book_gu_lead_lightning_lycan.js';
import {guLeadInvestigator, registerGuLeadInvestigator} from '../src/world_packs/book_gu_lead_investigator.js';
import {createContentRegistry, createExpansionState, advanceSimulation, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack, registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign, adoptStructuredExtension, structuredActionCosts} from '../src/structured_pack_runtime.js';
import {cancelSimulationJob, commitSimulationCommand, previewSimulationCommand} from '../src/simulation.js';
import {requireStructuredContent, validateStructuredEnvelope} from '../src/structured_pack_state.js';

const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
function beginning() {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(guLeadLife, registry);
    mergeStructuredPack(compiled, registry);
    const definition = {...compiled.definition, contentHash: hash(guLeadLife),
        starts: guLeadLife.starts.map(start => ({...start, snapshotHash: hash(start)}))};
    const extension = registerStructuredCommandExtension(guLeadSelection, hash(guLeadSelection), definition, registry);
    const refinement = registerStructuredCommandExtension(guLeadRefinement, hash(guLeadRefinement), definition, registry);
    const vital = registerStructuredCommandExtension(guLeadVital, hash(guLeadVital), definition, registry);
    const moonblade = registerStructuredCommandExtension(guLeadMoonblade, hash(guLeadMoonblade), definition, registry);
    const dorm = registerStructuredCommandExtension(guLeadDorm, hash(guLeadDorm), definition, registry);
    const assessment = registerStructuredCommandExtension(guLeadAssessment, hash(guLeadAssessment), definition, registry);
    const confrontation = registerStructuredCommandExtension(guLeadConfrontation, hash(guLeadConfrontation), definition, registry);
    const clanResponse = registerStructuredCommandExtension(guLeadClanResponse, hash(guLeadClanResponse), definition, registry);
    const caravan = registerStructuredCommandExtension(guLeadCaravan, hash(guLeadCaravan), definition, registry);
    const inheritance = registerStructuredCommandExtension(guLeadInheritance, hash(guLeadInheritance), definition, registry);
    const moonveil = registerStructuredCommandExtension(guLeadMoonveil, hash(guLeadMoonveil), definition, registry);
    const hearing = registerStructuredCommandExtension(guLeadHearing, hash(guLeadHearing), definition, registry);
    const secondGu = registerStructuredCommandExtension(guLeadSecondGu, hash(guLeadSecondGu), definition, registry);
    const lightPairing = registerStructuredCommandExtension(guLeadLightPairing, hash(guLeadLightPairing), definition, registry);
    const earlyDuel = registerStructuredCommandExtension(guLeadEarlyDuel, hash(guLeadEarlyDuel), definition, registry);
    const hunt = registerStructuredCommandExtension(guLeadHuntFollowthrough, hash(guLeadHuntFollowthrough), definition, registry);
    const exam = registerStructuredCommandExtension(guLeadExamResult, hash(guLeadExamResult), definition, registry);
    const yearEnd = registerStructuredCommandExtension(guLeadYearEnd, hash(guLeadYearEnd), definition, registry);
    const rankTwo = registerStructuredCommandExtension(guLeadRankTwo, hash(guLeadRankTwo), definition, registry);
    const estateClaim = registerStructuredCommandExtension(guLeadEstateClaim, hash(guLeadEstateClaim), definition, registry);
    const whiteJade = registerStructuredCommandExtension(guLeadWhiteJade, hash(guLeadWhiteJade), definition, registry);
    const handover = registerStructuredCommandExtension(guLeadEstateHandover, hash(guLeadEstateHandover), definition, registry);
    const meeting = registerStructuredCommandExtension(guLeadQingShuMeeting, hash(guLeadQingShuMeeting), definition, registry);
    const moonglow = registerStructuredCommandExtension(guLeadMoonglow, hash(guLeadMoonglow), definition, registry);
    const relicMarket = registerStructuredCommandExtension(guLeadRelicMarket, hash(guLeadRelicMarket), definition, registry);
    const stoneForest = registerStructuredCommandExtension(guLeadStoneForest, hash(guLeadStoneForest), definition, registry);
    const riverToad = registerStructuredCommandExtension(guLeadRiverToad, hash(guLeadRiverToad), definition, registry);
    const wolfFront = registerStructuredCommandExtension(guLeadWolfFront, hash(guLeadWolfFront), definition, registry);
    const allianceSlope = registerStructuredCommandExtension(guLeadAllianceSlope, hash(guLeadAllianceSlope), definition, registry);
    const earGrass = registerStructuredCommandExtension(guLeadEarGrass, hash(guLeadEarGrass), definition, registry);
    const iceSoul = registerStructuredCommandExtension(guLeadIceSoul, hash(guLeadIceSoul), definition, registry);
    const iceCrystal = registerStructuredCommandExtension(guLeadIceCrystal, hash(guLeadIceCrystal), definition, registry);
    const woodCharm = registerStructuredCommandExtension(guLeadWoodCharm, hash(guLeadWoodCharm), definition, registry);
    const wallNight = registerStructuredCommandExtension(guLeadWallNight, hash(guLeadWallNight), definition, registry);
    const burialGu = registerStructuredCommandExtension(guLeadBurialGu, hash(guLeadBurialGu), definition, registry);
    const elderHall = registerStructuredCommandExtension(guLeadElderHall, hash(guLeadElderHall), definition, registry);
    const secretRoom = registerStructuredCommandExtension(guLeadSecretRoom, hash(guLeadSecretRoom), definition, registry);
    const tusita = registerStructuredCommandExtension(guLeadTusitaFlower, hash(guLeadTusitaFlower), definition, registry);
    const thunderCrown = registerStructuredCommandExtension(guLeadThunderCrown, hash(guLeadThunderCrown), definition, registry);
    const lycan = registerStructuredCommandExtension(guLeadLycan, hash(guLeadLycan), definition, registry);
    const investigator = registerStructuredCommandExtension(guLeadInvestigator, hash(guLeadInvestigator), definition, registry);
    const initial = {
        registry, actorId: 'player', worldId: 'base.frontier', nativeAlive: true, nativeReady: true, busy: false,
        nativeBody: {id: 'native.body', ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult'},
        facts: {location: 'Village'}, external: {money: 0},
        gameplay: {player: {inventory: {}, skills: {Weightlifting: {xp: 0, enabled: true}}, reputation: {}}},
        vitals: {player: {health: 60, max_health: 60, stamina: 40, max_stamina: 40}}, equipment: {player: {}}
    };
    const selection = planStructuredSelection(createExpansionState(717), definition, initial);
    const begun = beginStructuredCampaign(selection.plan.state, definition, initial, null, selection.selection);
    let record = begun.record;
    let plan = begun.plan;
    let nativeVitals = initial.vitals;
    const context = (name) => {
        const player = plan.state.simulation.people.player;
        return {...initial, worldId: definition.world.id, nativeBody: player.body, facts: {location: player.location},
            external: plan.external, gameplay: plan.gameplay, vitals: nativeVitals,
            targetId: registry.simulation.commands.get(id(name))?.targetId,
            structuredNative: {...record, bound: true, bodyId: player.body.id}};
    };
    return {
        get state() {return plan.state;},
        get sim() {return plan.state.simulation;},
        get player() {return plan.state.actors.player;},
        get record() {return record;},
        get gu() {return plan.gameplay.player.inventory[leadMoonlightKey] || 0;},
        get inventory() {return plan.gameplay.player.inventory;},
        get skills() {return plan.gameplay.player.skills;},
        get location() {return plan.state.simulation.people.player.location;},
        get energy() {return plan.state.simulation.energies?.player?.[id('primeval')];},
        quote: name => previewSimulationCommand(plan.state, registry, id(name), context(name)),
        costs(name) {return structuredActionCosts(this.quote(name), definition, plan.state);},
        act(name) {
            plan = commitSimulationCommand(plan.state, registry, {id: id(name)}, context(name));
            nativeVitals = plan.vitals;
        },
        step(minutes) {
            plan = advanceSimulation(plan.state, registry, minutes, plan.external, plan.gameplay,
                {player: {...context(), vitals: nativeVitals.player}});
        },
        cancel() {
            plan = cancelSimulationJob(plan.state, registry, plan.state.simulation.jobs[0].id, context());
            nativeVitals = plan.vitals;
        },
        admit(selected = extension) {
            const next = adoptStructuredExtension(plan.state, definition, record, selected, context());
            record = next.record;
            plan = {...plan, ...next.plan};
        },
        pace(candidate = record) {return guLeadAcademyPassageClockRequest(plan.state, candidate, extension);},
        admitRefinement() {this.admit(refinement);},
        admitVital() {this.admit(vital);},
        admitMoonblade() {this.admit(moonblade);},
        admitDorm() {this.admit(dorm);},
        admitAssessment() {this.admit(assessment);},
        admitConfrontation() {this.admit(confrontation);},
        admitClanResponse() {this.admit(clanResponse);},
        admitCaravan() {this.admit(caravan);},
        admitHearing() {this.admit(hearing);},
        admitSecondGu() {this.admit(secondGu);},
        practiceLightPairing(check) {
            const saved = structuredClone({plan, record, nativeVitals});
            try {
                this.admit(lightPairing);
                check(this);
            } finally {
                ({plan, record, nativeVitals} = saved);
            }
        },
        pairingFixture() {
            return {expansion: plan.state, record, gameplay: plan.gameplay, location: this.location};
        },
        admitExam() {this.admit(exam);},
        admitYearEnd() {this.admit(yearEnd);},
        admitRankTwo() {this.admit(rankTwo);},
        admitWoodCharm() {this.admit(woodCharm);},
        admitWallNight() {this.admit(wallNight);},
        admitBurialGu() {this.admit(burialGu);},
        admitElderHall() {this.admit(elderHall);},
        admitSecretRoom() {this.admit(secretRoom);},
        admitTusita() {this.admit(tusita);},
        admitThunderCrown() {this.admit(thunderCrown);},
        admitLycan() {this.admit(lycan);},
        admitInvestigator() {this.admit(investigator);},
        thunderCrownPace(candidate = record) {return guLeadThunderCrownClockRequest(plan.state, candidate, thunderCrown);},
        tusitaPace(candidate = record) {return guLeadTusitaFlowerClockRequest(plan.state, candidate, tusita);},
        secretRoomPace(candidate = record) {return guLeadSecretRoomClockRequest(plan.state, candidate, secretRoom);},
        elderHallPace(candidate = record) {return guLeadElderHallClockRequest(plan.state, candidate, elderHall);},
        woodCharmPace(candidate = record) {return guLeadWoodCharmClockRequest(plan.state, candidate, woodCharm);},
        admitIceCrystal() {this.admit(iceCrystal);},
        admitIceSoul() {this.admit(iceSoul);},
        iceSoulPace(candidate = record) {return guLeadIceSoulClockRequest(plan.state, candidate, iceSoul);},
        admitEarGrass() {this.admit(earGrass);},
        earGrassPace(candidate = record) {return guLeadEarGrassClockRequest(plan.state, candidate, earGrass);},
        admitAllianceSlope() {this.admit(allianceSlope);},
        admitWolfFront() {this.admit(wolfFront);},
        wolfFrontPace(candidate = record) {return guLeadWolfFrontClockRequest(plan.state, candidate, wolfFront);},
        admitRiverToad() {this.admit(riverToad);},
        admitStoneForest() {this.admit(stoneForest);},
        admitRelicMarket() {this.admit(relicMarket);},
        relicMarketPace(candidate = record) {return guLeadRelicMarketClockRequest(plan.state, candidate, relicMarket);},
        admitMoonglow() {this.admit(moonglow);},
        moonglowPace(candidate = record) {return guLeadMoonglowClockRequest(plan.state, candidate, moonglow);},
        admitQingShuMeeting() {this.admit(meeting);},
        admitEstateHandover() {this.admit(handover);},
        estateHandoverPace(candidate = record) {return guLeadEstateHandoverClockRequest(plan.state, candidate, handover);},
        admitWhiteJade() {this.admit(whiteJade);},
        whiteJadePace(candidate = record) {return guLeadWhiteJadeClockRequest(plan.state, candidate, whiteJade);},
        admitEstateClaim() {this.admit(estateClaim);},
        estateClaimPace(candidate = record) {return guLeadEstateClaimClockRequest(plan.state, candidate, estateClaim);},
        rankTwoPace(candidate = record) {return guLeadRankTwoClockRequest(plan.state, candidate, rankTwo);},
        yearEndPace(candidate = record) {return guLeadYearEndClockRequest(plan.state, candidate, yearEnd);},
        examPace(candidate = record) {return guLeadExamResultClockRequest(plan.state, candidate, exam);},
        admitHunt() {this.admit(hunt);},
        huntPace(candidate = record) {return guLeadHuntFollowthroughClockRequest(plan.state, candidate, hunt);},
        admitEarlyDuel() {this.admit(earlyDuel);},
        earlyDuelPace(candidate = record) {return guLeadEarlyDuelClockRequest(plan.state, candidate, earlyDuel);},
        secondGuPace(candidate = record) {return guLeadSecondGuClockRequest(plan.state, candidate, secondGu);},
        admitMoonveil() {this.admit(moonveil);},
        moonveilPace(candidate = record) {return guLeadMoonveilClockRequest(plan.state, candidate, moonveil);},
        admitInheritance() {this.admit(inheritance);},
        inheritancePace(candidate = record) {return guLeadInheritanceClockRequest(plan.state, candidate, inheritance);},
        caravanPace(candidate = record) {return guLeadCaravanClockRequest(plan.state, candidate, caravan);},
        clanResponsePace(candidate = record) {return guLeadClanResponseClockRequest(plan.state, candidate, clanResponse);},
        confrontationPace(candidate = record) {return guLeadConfrontationClockRequest(plan.state, candidate, confrontation);},
        dormPace(candidate = record) {return guLeadDormClockRequest(plan.state, candidate, dorm);},
        refinementPace(candidate = record) {return guLeadRefinementClockRequest(plan.state, candidate, refinement);},
        vitalPace(candidate = record) {return guLeadVitalClockRequest(plan.state, candidate, vital);},
        moonbladePace(candidate = record) {return guLeadMoonbladeClockRequest(plan.state, candidate, moonblade);},
        refinementStatus() {return guLeadRefinementStatus(plan.state, record, context());},
        validate(candidate) {requireStructuredContent(candidate, new Map([[definition.id, definition]]), plan.state);},
        roundTrip() {
            const saved = JSON.parse(JSON.stringify({expansion: plan.state, content_packs: {structured: record},
                character: {bio: {race: 'human'}}, 'current location': plan.state.simulation.people.player.location}));
            validateStructuredEnvelope(saved);
            this.validate(saved.content_packs.structured);
            const restored = loadExpansionState(saved.expansion, registry);
            assert.deepEqual(restored, plan.state);
            plan = {...plan, state: restored};
        }
    };
}

function unawakened(life) {
    assert.equal(life.player.sources[id('aperture')], undefined);
    assert.equal(life.sim.faculties.player?.[id('aperture')], undefined);
    assert.equal(life.energy, undefined);
    assert.equal(life.sim.claims[id('academy_roll')], undefined);
    assert.equal(life.sim.knowledge.player?.[id('awakening')], undefined);
    assert.equal(life.quote('circulate').eligible, false);
}
function atRiver() {
    const life = beginning();
    unawakened(life);
    assert.equal(life.quote('cross').eligible, false);
    life.act('muster');
    life.step(2);
    assert.equal(life.sim.people.player.location, id('spring'));
    return life;
}

test('awakening is earned at the completed crossing, never from selection or interrupted work', () => {
    const life = atRiver();
    life.act('cross');
    life.step(4);
    unawakened(life);
    life.roundTrip();
    life.cancel();
    unawakened(life);
    life.act('cross');
    life.sim.people[id('academy_elder')].location = id('home');
    life.step(5);
    unawakened(life);
    assert.equal(life.sim.people.player.location, id('spring'));
    assert.equal(life.quote('cross').eligible, false);
    life.sim.people[id('academy_elder')].location = id('spring');
    life.act('cross');
    life.step(5);
    assert.equal(life.sim.people.player.location, id('academy'));
    assert.equal(life.sim.people[id('academy_elder')].location, id('academy'));
    assert(life.player.sources[id('aperture')]);
    assert(life.sim.faculties.player[id('aperture')]);
    assert.equal(life.energy.policy.capacity, 44);
    assert.equal(life.energy.reserve, 44);
    assert.equal(life.sim.claims[id('academy_roll')].owner, 'player');
    assert.match(life.sim.knowledge.player[id('awakening')].value, /27.*44%.*C-grade/);
    life.roundTrip();
});

test('the opened Gu room follows the earned ceremony date and grants one physical, unrefined Gu', () => {
    const life = atRiver();
    const week = 'selection.week', take = 'selection.take_moonlight';
    assert.throws(() => life.admit(), /first exercise/);
    life.act('cross');
    life.step(5);
    const deadline = life.state.clock + 7 * 1440;
    life.act('circulate');
    life.step(5);
    const base = structuredClone(life.record);
    assert.equal(life.quote(week).eligible, false);
    life.admit();
    assert.deepEqual({...life.record, extensions: undefined}, {...base, extensions: undefined});
    assert.equal(life.record.extensions[0].id, GU_LEAD_SELECTION);
    assert.equal(life.gu, 0);
    assert.equal(life.quote(take).visible, false);
    life.act(week);
    assert.equal(life.sim.jobs[0].due, deadline);
    assert.equal(life.pace(), 120);
    assert.equal(life.pace(base), null);
    assert.throws(() => life.validate(base), /Pending extension work/);
    life.step(360);
    life.roundTrip();
    life.cancel();
    assert.equal(life.quote(week).duration, deadline - life.state.clock);
    life.act(week);
    life.step(deadline - life.state.clock - 1);
    assert.equal(life.pace(), 1);
    assert.equal(life.quote(take).visible, false);
    life.step(1);
    assert.equal(life.pace(), null);
    assert.equal(life.gu, 0);
    assert.equal(life.quote(take).eligible, true);
    life.act(take);
    life.step(1);
    life.roundTrip();
    life.cancel();
    assert.equal(life.gu, 0);
    life.act(take);
    life.sim.people[id('academy_elder')].location = id('home');
    life.step(2);
    assert.equal(life.gu, 0);
    life.sim.people[id('academy_elder')].location = id('academy');
    life.act(take);
    life.step(2);
    assert.equal(life.gu, 1);
    assert.match(life.sim.knowledge.player[id('selection.chosen')].value, /still unrefined/);
    assert.equal(life.energy.reserve, 44);
    assert.equal(life.quote(take).eligible, false);
    assert.throws(() => life.validate(base), /Settled extension work/);
    life.roundTrip();
});

test('first academy exercise uses the earned active aperture, its essence, the roll and the elder', () => {
    const life = atRiver();
    life.act('cross');
    life.step(5);
    const faculty = life.sim.faculties.player[id('aperture')];
    faculty.suppressed = true;
    assert.equal(life.quote('circulate').eligible, false);
    faculty.suppressed = false;
    life.energy.reserve = 0;
    assert.equal(life.quote('circulate').eligible, false);
    life.energy.reserve = 44;
    const claim = life.sim.claims[id('academy_roll')];
    claim.status = 'settled';
    assert.equal(life.quote('circulate').eligible, false);
    claim.status = 'held';
    life.act('circulate');
    assert.equal(life.energy.reserve, 43);
    life.roundTrip();
    life.cancel();
    assert.equal(life.energy.reserve, 44);
    life.act('circulate');
    life.sim.people[id('academy_elder')].location = id('home');
    life.step(5);
    assert.equal(life.player.completed[id('circulate')], undefined);
    assert.equal(life.energy.reserve, 44);
    assert.equal(life.sim.knowledge.player[id('first_lesson')], undefined);
    life.sim.people[id('academy_elder')].location = id('academy');
    life.act('circulate');
    life.step(5);
    assert.equal(life.player.completed[id('circulate')], 1);
    assert.equal(life.energy.reserve, 44);
    assert.match(life.sim.knowledge.player[id('first_lesson')].value, /moved its essence/);
    life.roundTrip();
    assert.equal(life.quote('circulate').eligible, false);
});

test('the first resisted infusion spends essence, leaves the same unrefined Gu, and the drawn stone restores the sea', () => {
    const life = atRiver();
    const goHome = 'refinement.go_home', search = 'refinement.search', rain = 'refinement.storm_wait';
    const infuse = 'refinement.infuse', draw = 'refinement.draw_stone';
    const itemKey = name => JSON.stringify({id: `${GU_LEAD_REFINEMENT}.${name}`});
    const wine = itemKey('search_wine'), stone = itemKey('primeval_stone'), drawn = itemKey('drawn_stone');
    life.act('cross');
    life.step(5);
    life.act('circulate');
    life.step(5);
    assert.throws(() => life.admitRefinement(), /Choose your Moonlight Gu/);
    life.admit();
    life.act('selection.week');
    life.step(7 * 1440 - 5);
    life.act('selection.take_moonlight');
    life.step(2);
    const selectionOnly = structuredClone(life.record);
    delete life.inventory[leadMoonlightKey];
    assert.throws(() => life.admitRefinement(), /keep it in your bag/);
    life.inventory[leadMoonlightKey] = 1;
    life.admitRefinement();
    assert.deepEqual(life.record.extensions.slice(0, 1), selectionOnly.extensions);
    assert.equal(life.record.extensions.at(-1).id, GU_LEAD_REFINEMENT);
    life.act(goHome);
    assert.equal(life.refinementPace(), 30);
    life.step(120);
    assert.equal(life.sim.people.player.location, id('home'));
    assert.equal(life.inventory[stone], 6);
    assert.equal(life.inventory[wine], 2);
    assert.equal(life.quote(infuse).visible, false);
    assert.deepEqual(life.costs(search), ['2 × Jar of aged wine']);
    life.act(search);
    life.step(360);
    assert.equal(life.inventory[wine], undefined);
    const due = life.state.clock + 3 * 1440;
    life.act(rain);
    assert.equal(life.refinementPace(), 120);
    assert.equal(life.refinementPace(selectionOnly), null);
    life.step(900);
    life.roundTrip();
    life.cancel();
    life.act(rain);
    assert.equal(life.sim.jobs[0].due, due);
    life.step(due - life.state.clock);
    assert.equal(life.quote(infuse).eligible, true);
    assert.deepEqual(life.costs(infuse), ['30 Green-copper primeval essence']);
    life.act(infuse);
    assert.equal(life.energy.reserve, 14);
    assert.equal(life.refinementPace(), null);
    life.step(15);
    life.roundTrip();
    life.cancel();
    assert.equal(life.energy.reserve, 44);
    assert.equal(life.sim.knowledge.player[id('refinement.attempt')], undefined);
    life.act(infuse);
    delete life.inventory[leadMoonlightKey];
    life.step(30);
    assert.equal(life.energy.reserve, 44);
    assert.equal(life.quote(draw).visible, false);
    assert.equal(life.sim.knowledge.player[id('refinement.attempt')], undefined);
    life.inventory[leadMoonlightKey] = 1;
    life.act(infuse);
    life.step(30);
    assert.equal(life.energy.reserve, 14);
    assert.equal(life.gu, 1);
    assert.match(life.sim.knowledge.player[id('refinement.attempt')].value, /about a twelfth/);
    assert.match(life.refinementStatus()[1].value, /Unrefined.*360 played minutes/);
    life.roundTrip();
    assert.throws(() => life.validate(selectionOnly), /Settled extension work/);
    assert.deepEqual(life.costs(draw), ['1 × Primeval stone']);
    life.act(draw);
    assert.equal(life.inventory[stone], 5);
    life.step(15);
    life.roundTrip();
    life.cancel();
    assert.equal(life.inventory[stone], 6);
    assert.equal(life.inventory[drawn], undefined);
    life.act(draw);
    life.step(30);
    assert.equal(life.energy.reserve, 44);
    assert.equal(life.inventory[stone], 5);
    assert.equal(life.inventory[drawn], 1);
    assert.equal(life.gu, 1);
    assert.match(life.refinementStatus()[1].value, /315 played minutes/);
    life.step(315);
    assert.match(life.refinementStatus()[1].value, /Unrefined.*pushed out the last/);
    assert.equal(life.quote(infuse).eligible, false);
    assert.equal(life.quote(draw).eligible, false);
    life.roundTrip();
});

test('the later search separates sighting, custody, the prior bond, new refinement and the academy result', async t => {
    const life = atRiver();
    const work = (name, minutes) => {life.act(name); life.step(minutes);};
    const play = (name, minutes) => work('vital.' + name, minutes);
    const facts = () => life.player.facts;
    const fact = name => facts()[id('vital.' + name)];
    const note = name => life.sim.knowledge.player[id('vital.' + name)]?.value;
    const stock = name => life.inventory[JSON.stringify({id: id(name)})] ?? 0;
    const stone = 'refinement.primeval_stone';
    assert.throws(() => life.admitVital(), /Finish drawing/);
    work('cross', 5);
    work('circulate', 5);
    life.admit();
    work('selection.week', 7 * 1440 - 5);
    work('selection.take_moonlight', 2);
    life.admitRefinement();
    work('refinement.go_home', 120);
    work('refinement.search', 360);
    work('refinement.storm_wait', 3 * 1440);
    work('refinement.infuse', 30);
    work('refinement.draw_stone', 30);
    const before = structuredClone(life.record);
    life.admitVital();
    assert.deepEqual(life.record.extensions.slice(0, -1), before.extensions);
    assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_VITAL, revision: 1, contentHash: hash(guLeadVital)});
    assert.equal(stock(stone), 5);
    assert.equal(life.gu, 1);
    assert.equal(life.energy.reserve, 44);
    assert.equal(fact('vital_bond'), undefined);
    play('leave', 20);
    play('buy_wine', 5);
    assert.equal(stock(stone), 1);
    assert.equal(stock('vital.bamboo_wine'), 1);
    life.act('vital.lure');
    assert.equal(life.vitalPace(), 120);
    assert.equal(life.vitalPace(before), null);
    life.step(120);
    life.roundTrip();
    life.cancel();
    assert.equal(stock('vital.bamboo_wine'), 1);
    assert.equal(note('search_result'), undefined);
    play('lure', 180);
    assert.equal(stock('vital.bamboo_wine'), 0);
    assert.equal(stock('vital.liquor_worm'), 0);
    play('follow', 35);
    assert.equal(stock('vital.liquor_worm'), 0);
    play('take_worm', 3);
    assert.equal(stock('vital.liquor_worm'), 1);
    assert.equal(fact('vital_bond'), undefined);
    assert.equal(life.quote('vital.refine_worm').visible, false);
    play('search_crevice', 12);
    assert.equal(stock(stone), 16);
    play('return_inn', 45);
    play('first_night', 360);
    assert.equal(life.energy.reserve, 14);
    assert.equal(stock(stone), 14);
    play('brother', 15);
    assert.equal(stock(stone), 19);
    assert.equal(stock('vital.half_stone'), 1);
    life.act('vital.press_again');
    assert.equal(stock(stone), 9);
    life.step(120);
    life.roundTrip();
    life.cancel();
    assert.equal(stock(stone), 19);
    assert.equal(life.energy.reserve, 14);
    assert.equal(fact('vital_bond'), undefined);
    play('press_again', 2880);
    assert.equal(stock(stone), 9);
    assert.equal(life.energy.reserve, 4);
    assert.equal(fact('vital_bond'), 'spring_autumn_cicada');
    assert.equal(stock('vital.refined_liquor_worm'), 0);
    assert.equal(life.gu, 1);
    assert.throws(() => life.validate(before), /Settled extension work/);
    const aperture = life.sim.faculties.player[id('aperture')];
    aperture.suppressed = true;
    assert.equal(life.quote('vital.refine_worm').eligible, false);
    aperture.suppressed = false;
    play('refine_worm', 1);
    assert.equal(stock('vital.liquor_worm'), 0);
    assert.equal(stock('vital.refined_liquor_worm'), 1);
    assert.equal(fact('vital_bond'), 'spring_autumn_cicada');
    assert.equal(fact('moonlight_form'), undefined);
    assert.equal(fact('assessment'), undefined);
    assert.equal(life.gu, 1);
    play('refine_moonlight', 5);
    assert.equal(life.gu, 0);
    assert.equal(fact('moonlight_form'), 'forehead');
    assert.equal(life.energy.reserve, 2);
    play('go_academy', 15);
    assert.equal(life.location, id('academy'));
    assert.equal(stock('vital.refined_liquor_worm'), 0);
    assert.equal(fact('worm_custody'), 'inn_bed');
    assert.equal(fact('assessment'), undefined);
    assert.throws(() => life.admitMoonblade(), /confirm first place/);
    life.act('vital.show_elder');
    life.sim.people[id('academy_elder')].location = id('home');
    life.step(2);
    assert.equal(fact('assessment'), undefined);
    life.sim.people[id('academy_elder')].location = id('academy');
    play('show_elder', 2);
    assert.equal(fact('assessment'), 'first');
    assert.match(note('academy_result'), /first in the batch/);
    assert.equal(stock(stone), 9);
    life.roundTrip();

    await t.test('the prize, dated lesson, one paid throw and homework preserve distinct outcomes', () => {
        const collect = 'moonblade.collect_prize', wait = 'moonblade.wait_for_lesson';
        const watch = 'moonblade.watch_elder', aim = 'moonblade.throw_left', homework = 'moonblade.hear_homework';
        const knowledge = name => life.sim.knowledge.player[id('moonblade.' + name)]?.value;
        const recognized = structuredClone(life.record);
        assert.throws(() => life.admitDorm(), /Moonblade homework/);
        const classDay = life.state.clock + 10 * 1440;
        life.admitMoonblade();
        assert.deepEqual(life.record.extensions.slice(0, -1), recognized.extensions);
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_MOONBLADE, revision: 1, contentHash: hash(guLeadMoonblade)});
        assert.equal(stock(stone), 9);
        assert.equal(life.quote(watch).visible, false);
        life.act(collect);
        life.step(1);
        life.cancel();
        assert.equal(stock(stone), 9);
        work(collect, 2);
        assert.equal(stock(stone), 29);
        assert.equal(life.quote(collect).eligible, false);
        life.act(wait);
        assert.equal(life.sim.jobs[0].due, classDay);
        assert.equal(life.moonbladePace(), 120);
        assert.equal(life.moonbladePace(recognized), null);
        life.step(120);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 2);
        life.act(wait);
        assert.equal(life.sim.jobs[0].due, classDay);
        life.step(classDay - life.state.clock);
        assert.equal(life.energy.reserve, 44);
        assert.equal(life.moonbladePace(), null);
        work(watch, 5);
        assert.match(knowledge('demonstration'), /ten metres/);
        assert.equal(knowledge('first_throw'), undefined);
        assert.equal(life.quote(homework).visible, false);
        life.energy.reserve = 9;
        assert.equal(life.quote(aim).eligible, false);
        life.energy.reserve = 44;
        life.act(aim);
        assert.equal(life.energy.reserve, 34);
        assert.equal(knowledge('first_throw'), undefined);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 44);
        work(aim, 5);
        assert.equal(life.energy.reserve, 34);
        assert.match(knowledge('first_throw'), /grass knits together/);
        assert.equal(life.player.facts[id('moonblade.left_puppet')], 'regrown');
        assert.equal(life.quote(aim).eligible, false);
        work(homework, 1);
        assert.match(knowledge('homework'), /three days.*ten primeval stones/);
        assert.equal(life.energy.reserve, 34);
        assert.equal(stock(stone), 29);
        assert.equal(life.gu, 0);
        assert.equal(stock('vital.refined_liquor_worm'), 0);
        assert.equal(fact('worm_custody'), 'inn_bed');
        assert.equal(fact('moonlight_form'), 'forehead');
        assert.throws(() => life.validate(recognized), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('dorm care buys, reserves and spends supplies and opens the dated school lesson', () => {
        const old = structuredClone(life.record);
        const care = name => 'dorm.' + name;
        const workDorm = (name, minutes) => work(care(name), minutes);
        const petals = care('petals'), wine = 'vital.bamboo_wine', worm = 'vital.refined_liquor_worm';
        const due = life.state.clock + 3 * 1440;
        life.admitDorm();
        assert.deepEqual(life.record.extensions.slice(0, -1), old.extensions);
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_DORM, revision: 1, contentHash: hash(guLeadDorm)});
        assert.equal(stock(worm), 0);
        workDorm('buy_petals', 5);
        assert.equal(stock(stone), 28);
        assert.equal(stock(petals), 10);
        life.act(care('retrieve_worm'));
        life.step(1);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(worm), 0);
        workDorm('retrieve_worm', 20);
        assert.equal(stock(worm), 1);
        assert.equal(life.quote(care('retrieve_worm')).eligible, false);
        workDorm('buy_wine_meal', 30);
        assert.equal(stock(stone), 25);
        assert.equal(stock(wine), 1);
        workDorm('stock_wine', 20);
        assert.equal(stock(wine), 6);
        assert.equal(stock(stone), 15);
        workDorm('first_meal', 5);
        assert.equal(stock(wine), 5);
        assert.equal(stock(petals), 8);
        assert.equal(life.quote(care('watch_footwork')).visible, false);
        assert.equal(life.quote(care('keep_meals')).eligible, false);
        assert.match(life.quote(care('keep_meals')).reasons.join(' '), /ten|10/);
        workDorm('top_up_petals', 5);
        assert.equal(stock(petals), 18);
        assert.equal(stock(stone), 14);
        life.act(care('keep_meals'));
        assert.equal(life.dormPace(), 120);
        assert.equal(life.dormPace(old), null);
        assert.equal(life.sim.jobs[0].due, due);
        life.step(120);
        assert.equal(stock(petals), 8);
        assert.equal(life.energy.reserve, 34);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(petals), 18);
        assert.equal(stock(wine), 5);
        assert.equal(stock(worm), 1);
        life.act(care('keep_meals'));
        assert.equal(life.sim.jobs[0].due, due);
        life.step(due - life.state.clock);
        assert.equal(life.energy.reserve, 44);
        assert.equal(stock(petals), 8);
        assert.equal(life.quote(care('watch_footwork')).eligible, true);
        workDorm('watch_footwork', 15);
        assert.throws(() => life.admitAssessment(), /Line up for the Moonblade assessment/);
        workDorm('line_up', 10);
        assert.match(life.sim.knowledge.player[id(care('assessment'))].value, /Fang Zheng steps up/);
        assert.equal(stock(stone), 14);
        assert.equal(stock(wine), 5);
        assert.equal(stock(worm), 1);
        assert.equal(life.energy.reserve, 44);
        assert.equal(life.quote(care('line_up')).eligible, false);
        assert.throws(() => life.validate(old), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('assessment, gate collection and Liquor Worm conversion settle their actual inputs once', () => {
        const previous = structuredClone(life.record);
        const names = name => 'assessment.' + name;
        const doNext = (name, minutes) => work(names(name), minutes);
        const worm = 'vital.refined_liquor_worm', wine = 'vital.bamboo_wine';
        const condensed = id(names('condensed_parts')), puppet = id(names('puppet'));
        life.admitAssessment();
        assert.throws(() => life.admitConfrontation(), /Refill your mixed primeval sea/);
        assert.deepEqual(life.record.extensions.slice(0, -1), previous.extensions);
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_ASSESSMENT, revision: 1, contentHash: hash(guLeadAssessment)});
        assert.equal(stock(stone), 14);
        doNext('watch_brother', 3);
        doNext('throw_high', 1);
        assert.equal(life.energy.reserve, 34);
        assert.equal(life.player.facts[puppet], 'standing');
        life.act(names('pair_at_neck'));
        assert.equal(life.energy.reserve, 14);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 34);
        assert.equal(life.player.facts[puppet], 'standing');
        assert.equal(life.quote(names('receive_purses')).visible, false);
        doNext('pair_at_neck', 1);
        assert.equal(life.energy.reserve, 14);
        assert.equal(life.player.facts[puppet], 'head_severed');
        assert.equal(stock(stone), 14);
        doNext('receive_purses', 2);
        assert.equal(stock(stone), 27);
        assert.equal(life.quote(names('receive_purses')).eligible, false);
        doNext('hear_challenge', 4);
        doNext('block_gate', 3);
        assert.equal(life.quote(names('collect_gate')).visible, false);
        doNext('hold_gate', 5);
        assert.equal(life.energy.reserve, 14);
        assert.equal(stock(stone), 27);
        doNext('collect_gate', 5);
        assert.equal(stock(stone), 83);
        assert.equal(life.quote(names('collect_gate')).eligible, false);
        doNext('buy_cellar', 30);
        assert.equal(stock(stone), 43);
        assert.equal(stock(wine), 25);
        doNext('settle_at_night', 30);
        assert.equal(life.energy.reserve, 44);
        const wormKey = JSON.stringify({id: id(worm)});
        delete life.inventory[wormKey];
        assert.equal(life.quote(names('condense_essence')).eligible, false);
        life.inventory[wormKey] = 1;
        life.act(names('condense_essence'));
        assert.equal(life.energy.reserve, 24);
        assert.equal(life.player.facts[condensed], undefined);
        life.step(4);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 44);
        doNext('condense_essence', 5);
        assert.equal(life.energy.reserve, 24);
        assert.equal(life.player.facts[condensed], 5);
        doNext('draw_after_conversion', 15);
        assert.equal(stock(stone), 42);
        assert.equal(stock(names('partly_drawn_stone')), 1);
        assert.equal(life.energy.reserve + life.player.facts[condensed], 44);
        assert.equal(life.refinementStatus()[0].value, '44 of 44 parts · 39 ordinary, 5 stronger');
        assert.equal(stock(worm), 1);
        assert.equal(fact('moonlight_form'), 'forehead');
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('second allowance and stronger Moonblades use the earned purse and split sea', () => {
        const previous = structuredClone(life.record);
        const names = name => 'confrontation.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const count = name => life.player.facts[id(names(name))];
        const worm = 'vital.refined_liquor_worm';
        const due = life.sim.knowledge.player[id('assessment.purses')].at + 7 * 1440;
        life.admitConfrontation();
        assert.deepEqual(life.record.extensions.slice(0, -1), previous.extensions);
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_CONFRONTATION, revision: 1, contentHash: hash(guLeadConfrontation)});
        life.act(names('keep_school_week'));
        assert.equal(life.sim.jobs[0].due, due);
        assert.equal(life.confrontationPace(), 120);
        assert.equal(life.confrontationPace(previous), null);
        life.step(120);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 39);
        assert.equal(count('condensed_parts'), undefined);
        life.act(names('keep_school_week'));
        assert.equal(life.sim.jobs[0].due, due);
        life.step(due - life.state.clock);
        assert.equal(life.energy.reserve, 12);
        assert.equal(count('condensed_parts'), 32);
        play('receive_allowance', 2);
        assert.equal(stock(stone), 45);
        play('hold_gate_again', 15);
        assert.equal(stock(stone), 101);
        assert.equal(life.quote(names('hold_gate_again')).eligible, false);
        play('meet_at_supper', 15);
        play('lead_to_room', 10);
        assert.equal(count('encounter'), 'threshold');
        play('hold_threshold', 10);
        assert.equal(count('encounter'), 'watch');
        assert.equal(life.quote(names('step_out')).visible, false);
        play('nurture_wall', 60);
        assert.equal(count('condensed_parts'), 0);
        assert.equal(life.energy.reserve, 12);
        play('draw_at_night', 30);
        assert.equal(stock(stone), 100);
        assert.equal(life.energy.reserve, 44);
        const wormKey = JSON.stringify({id: id(worm)});
        delete life.inventory[wormKey];
        assert.equal(life.quote(names('condense_night')).eligible, false);
        life.inventory[wormKey] = 1;
        life.act(names('condense_night'));
        life.step(120);
        assert.equal(life.confrontationPace(), 60);
        assert.equal(life.energy.reserve, 0);
        assert.equal(stock(stone), 98);
        assert.equal(count('condensed_parts'), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 100);
        assert.equal(life.energy.reserve, 44);
        play('condense_night', 180);
        assert.equal(stock(stone), 98);
        assert.equal(life.energy.reserve, 0);
        assert.equal(count('condensed_parts'), 44);
        play('step_out', 5);
        play('trade_blows', 3);
        play('cut_guard', 1);
        assert.equal(count('condensed_parts'), 34);
        play('pursue', 1);
        assert.equal(count('condensed_parts'), 24);
        life.act(names('finish_fight'));
        life.roundTrip();
        life.cancel();
        assert.equal(count('condensed_parts'), 24);
        assert.equal(count('encounter'), 'caught');
        play('finish_fight', 1);
        assert.equal(count('condensed_parts'), 4);
        assert.equal(count('encounter'), 'dead');
        assert.equal(stock(names('guard_sabre')), 0);
        play('take_sabre', 2);
        assert.equal(stock(names('guard_sabre')), 1);
        assert.equal(count('encounter'), 'body_in_your_custody');
        assert.equal(stock(worm), 1);
        assert.equal(stock('vital.bamboo_wine'), 25);
        assert.equal(stock('assessment.partly_drawn_stone'), 1);
        assert.equal(fact('moonlight_form'), 'forehead');
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('the dawn aftermath transfers custody and escrows the fine and fortnight costs', () => {
        const previous = structuredClone(life.record);
        const names = name => 'clan_response.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const fact = name => life.player.facts[id(names(name))];
        life.admitClanResponse();
        assert.deepEqual(life.record.extensions.slice(0, -1), previous.extensions);
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_CLAN_RESPONSE, revision: 1, contentHash: hash(guLeadClanResponse)});
        assert.equal(life.quote(names('pay_fine')).visible, false);
        play('pack_box', 20);
        assert.equal(stock(names('wooden_box')), 1);
        life.act(names('return_box'));
        assert.equal(stock(names('wooden_box')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(names('wooden_box')), 1);
        assert.equal(fact('custody'), 'packed');
        play('return_box', 12);
        assert.equal(stock(names('wooden_box')), 0);
        assert.equal(fact('custody'), 'delivered');
        play('answer_elder', 10);
        assert.equal(stock(stone), 98);
        life.act(names('pay_fine'));
        assert.equal(stock(stone), 68);
        assert.equal(fact('fine'), 'announced');
        assert.equal(life.quote(names('receive_compensation')).eligible, false);
        life.cancel();
        assert.equal(stock(stone), 98);
        play('pay_fine', 5);
        assert.equal(fact('fine'), 'paid');
        play('receive_compensation', 5);
        assert.equal(stock(stone), 98);
        const weekDue = life.state.clock + 7 * 1440;
        life.act(names('train_first_week'));
        assert.equal(stock(stone), 69);
        assert.equal(life.clanResponsePace(), 120);
        assert.equal(life.clanResponsePace(previous), null);
        life.step(120);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 98);
        life.act(names('train_first_week'));
        assert.equal(life.sim.jobs[0].due, weekDue);
        life.step(weekDue - life.state.clock);
        assert.equal(stock(stone), 108);
        play('train_second_week', 7 * 1440);
        assert.equal(stock(stone), 118);
        play('wait_for_caravan', 1440);
        assert.equal(stock(stone), 98);
        play('go_to_rock_tent', 12);
        play('shortlist_stones', 15);
        assert.equal(fact('shortlisted'), 6);
        assert.equal(fact('price_each'), 10);
        assert.equal(fact('purse_floor'), 28);
        assert.equal(stock(stone), 98);
        assert.equal(stock('confrontation.guard_sabre'), 1);
        assert.equal(stock('vital.refined_liquor_worm'), 1);
        assert.equal(stock('vital.bamboo_wine'), 25);
        assert.equal(stock('assessment.partly_drawn_stone'), 1);
        assert.equal(life.player.facts[id('confrontation.condensed_parts')], 4);
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('caravan settles the wager, sale and unpaid inspection separately', () => {
        const previous = structuredClone(life.record);
        const names = name => 'caravan.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const fact = name => life.player.facts[id(names(name))];
        const rocks = names('purple_gold_rock');
        const toad = names('mudskin_toad');
        life.admitCaravan();
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_CARAVAN, revision: 1, contentHash: hash(guLeadCaravan)});
        assert.equal(life.quote(names('finish_fifth')).visible, false);
        const stoneKey = JSON.stringify({id: id(stone)});
        life.inventory[stoneKey] = 87;
        assert.equal(life.quote(names('buy_six')).eligible, false);
        life.inventory[stoneKey] = 98;
        life.act(names('buy_six'));
        assert.equal(stock(stone), 38);
        assert.equal(stock(rocks), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 98);
        play('buy_six', 2);
        assert.equal(stock(rocks), 6);
        play('ready_light', 15);
        play('open_first_four', 12);
        assert.deepEqual([stock(rocks), life.energy.reserve, fact('condensed_parts')], [2, 0, 2]);
        play('grind_fifth', 3);
        assert.equal(stock(toad), 0);
        assert.equal(life.quote(names('sell_toad')).visible, false);
        play('refuse_forty', 2);
        play('finish_fifth', 3);
        life.act(names('sell_toad'));
        assert.equal(stock(toad), 0);
        assert.equal(stock(stone), 38);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(toad), 1);
        play('sell_toad', 5);
        assert.deepEqual([stock(stone), stock(toad)], [538, 0]);
        play('store_bags', 30);
        assert.deepEqual([stock(stone), fact('room_stones')], [38, 500]);
        play('condense_in_room', 45);
        assert.deepEqual([stock(stone), stock(names('half_drawn_stone')), fact('condensed_parts')], [37, 1, 44]);
        play('open_last', 4);
        assert.equal(stock(rocks), 0);
        const anchor = life.sim.knowledge.player[id('clan_response.caravan')].at;
        life.act(names('look_for_grass'));
        const due = life.sim.jobs[0].due;
        assert.equal(due, anchor + 18 * 60);
        assert.equal(life.caravanPace(), 120);
        assert.equal(life.caravanPace(previous), null);
        life.step(120);
        life.cancel();
        life.act(names('look_for_grass'));
        assert.equal(life.sim.jobs[0].due, due);
        life.step(due - life.state.clock);
        play('show_worm', 3);
        assert.deepEqual([stock(stone), stock('vital.refined_liquor_worm'), fact('worm_seen')], [36, 1, true]);
        play('hear_dispute', anchor + 25 * 60 - life.state.clock);
        play('watch_jia_fu', 4);
        play('offer_wall', 10);
        play('show_wall', 45);
        assert.equal(life.sim.knowledge.player[id(names('wall_message'))], undefined);
        assert.equal(life.quote(names('strike')).visible, false);
        play('watch_change', 1);
        assert.ok(life.sim.knowledge.player[id(names('wall_message'))]);
        play('strike', 1);
        assert.deepEqual([stock(stone), fact('room_stones'), fact('condensed_parts'), fact('deal')], [36, 500, 22, 'ended_unpaid']);
        assert.equal(stock('confrontation.guard_sabre'), 1);
        assert.equal(life.quote(names('strike')).eligible, false);
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('Fang Yuan earns middle stage without spending his room cache or taking the arena prize', () => {
        const previous = structuredClone(life.record);
        const names = name => 'inheritance.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const fact = name => life.player.facts[id(names(name))];
        const stronger = () => fact('condensed_parts');
        life.admitInheritance();
        assert.deepEqual(life.record.extensions.at(-1), {
            id: GU_LEAD_INHERITANCE, revision: 1, contentHash: hash(guLeadInheritance)
        });
        assert.equal(life.sim.knowledge.player[id(names('wall'))], undefined);
        assert.equal(life.quote(names('breakthrough')).visible, false);
        play('clear_crevice', 300);
        assert.ok(life.sim.knowledge.player[id(names('wall'))]);
        play('watch_departure', 20);
        life.act(names('nurture_in_rain'));
        const due = life.sim.jobs[0].due;
        assert.equal(stock(stone), 35);
        assert.equal(stronger(), 22);
        assert.equal(life.inheritancePace(), 120);
        assert.equal(life.inheritancePace(previous), null);
        life.step(120);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 36);
        assert.equal(fact('wall_condition'), undefined);
        life.act(names('nurture_in_rain'));
        assert.equal(life.sim.jobs[0].due, due);
        life.step(due - life.state.clock);
        play('spar', 80);
        assert.equal(fact('wins'), 33);
        play('leave_ring', 5);
        assert.equal(fact('ring'), 'withdrawn_unpaid');
        assert.equal(stock(stone), 35);
        play('prepare_sea', 300);
        assert.equal(stronger(), 44);
        life.act(names('breakthrough'));
        life.step(120);
        life.roundTrip();
        life.cancel();
        assert.equal(fact('aperture_stage'), undefined);
        assert.equal(stronger(), 44);
        play('breakthrough', 360);
        assert.deepEqual([fact('aperture_stage'), fact('wall_condition'), stronger()], ['middle', 'water', 20]);
        assert.deepEqual([stock(stone), life.player.facts[id('caravan.room_stones')]], [34, 500]);
        assert.equal(stock('caravan.half_drawn_stone'), 1);
        assert.equal(stock('vital.refined_liquor_worm'), 1);
        assert.equal(life.quote(names('breakthrough')).eligible, false);
        assert.equal(life.refinementStatus()[0].value, '20 of 44 parts · 0 ordinary, 20 stronger');
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('Fang Yuan earns the academy prize and collects at the gate after declining the chair', () => {
        const previous = structuredClone(life.record);
        const names = name => 'moonveil.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const fact = name => life.player.facts[id(names(name))];
        life.admitMoonveil();
        assert.deepEqual(life.record.extensions.at(-1), {
            id: GU_LEAD_MOONVEIL, revision: 1, contentHash: hash(guLeadMoonveil)
        });
        assert.equal(life.quote(names('hold_gate')).visible, false);
        life.act(names('hide_worm'));
        life.step(1);
        life.cancel();
        assert.equal(stock('vital.refined_liquor_worm'), 1);
        play('hide_worm', 3);
        assert.equal(stock('vital.refined_liquor_worm'), 0);
        assert.equal(fact('worm_custody'), 'dorm_wine');
        life.roundTrip();
        play('face_guards', 6);
        play('show_water_wall', 4);
        const inspected = life.state.clock;
        assert.equal(fact('middle_attested'), true);
        assert.equal(fact('guards'), 'treated_dismissed');
        play('recover_worm', 3);
        assert.equal(stock('vital.refined_liquor_worm'), 1);
        life.act(names('collect_prize'));
        const due = life.sim.jobs[0].due;
        assert.equal(due, inspected + 5760);
        assert.equal(life.moonveilPace(), 120);
        assert.equal(life.moonveilPace(previous), null);
        life.step(120);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 34);
        assert.equal(fact('second_gu_priority'), undefined);
        life.act(names('collect_prize'));
        assert.equal(life.sim.jobs[0].due, due);
        life.step(due - life.state.clock);
        assert.equal(stock(stone), 64);
        assert.equal(fact('second_gu_priority'), true);
        play('decline_chair', 4);
        assert.equal(fact('chair_offer'), 'declined');
        play('hold_gate', 18);
        assert.equal(stock(stone), 132);
        assert.equal(fact('gate_take'), 68);
        assert.equal(life.quote(names('hold_gate')).eligible, false);
        assert.deepEqual([life.player.facts[id('caravan.room_stones')], life.player.facts[id('inheritance.condensed_parts')],
            stock('caravan.half_drawn_stone'), stock('confrontation.guard_sabre')], [500, 20, 1, 1]);
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('the hearing keeps the two Gu tests separate from the charge', () => {
        const previous = structuredClone(life.record);
        const names = name => 'hearing.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const fact = name => life.player.facts[id(names(name))];
        const inventory = structuredClone(life.inventory);
        life.admitHearing();
        assert.deepEqual(life.record.extensions.at(-1), {
            id: GU_LEAD_HEARING, revision: 1, contentHash: hash(guLeadHearing)
        });
        assert.equal(life.quote(names('leave_hall')).visible, false);
        play('answer_summons', 8);
        play('hear_witnesses', 5);
        assert.equal(fact('worm_public'), true);
        play('give_account', 5);
        play('question_motive', 5);
        play('hear_elder', 3);
        play('show_tracks', 6);
        assert.equal(fact('tracks_result'), 'village_only');
        play('accept_bamboo', 2);
        assert.equal(fact('bamboo_custody'), 'aperture');
        assert.equal(life.quote(names('answer_questions')).visible, false);
        life.act(names('quiet_bamboo'));
        life.step(1);
        life.roundTrip();
        life.cancel();
        assert.equal(fact('bamboo_response'), undefined);
        assert.equal(fact('bamboo_custody'), 'aperture');
        play('quiet_bamboo', 2);
        play('answer_questions', 4);
        assert.deepEqual([fact('bamboo_response'), fact('bamboo_observed'), fact('bamboo_custody')],
            ['suppressed', 'green', 'jia_fu']);
        play('leave_hall', 4);
        assert.deepEqual([fact('hearing_state'), fact('inquiry')], ['dismissed', 'unresolved']);
        assert.equal(life.quote(names('leave_hall')).eligible, false);
        assert.deepEqual(life.inventory, inventory);
        assert.deepEqual([stock(stone), life.player.facts[id('caravan.room_stones')],
            life.player.facts[id('inheritance.condensed_parts')], life.player.facts[id('moonveil.second_gu_priority')]],
        [132, 500, 20, true]);
        assert.throws(() => life.validate(previous), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('academy selection and the cave discovery use earned means and preserve distinct custody', () => {
        const names = name => 'second_gu.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitSecondGu();
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_SECOND_GU, revision: 1, contentHash: hash(guLeadSecondGu)});
        assert.equal(life.quote(names('take_little_light')).visible, false);
        play('watch_road', 15);
        life.act(names('return_to_wall'));
        assert.equal(life.secondGuPace(), 120);
        assert.equal(life.secondGuPace(prior), null);
        life.step(10 * 1440);
        assert.equal(life.energy.reserve, 14);
        life.act(names('shave_wall'));
        life.step(30);
        life.roundTrip();
        assert.equal(life.energy.reserve, 2);
        life.cancel();
        assert.equal(life.energy.reserve, 14);
        assert.equal(fact('wall'), undefined);
        play('shave_wall', 5 * 1440 + 15 - 30);
        play('test_opening', 30);
        play('sound_passage', 60);
        play('reach_boulder', 120);
        play('inspect_shelves', 8);
        play('take_little_light', 4);
        assert.equal(fact('selection'), 'first_choice_used');
        assert.equal(stock(names('little_light_unrefined')), 1);
        assert.equal(stock(names('little_light')), 0);
        assert.equal(life.quote(names('check_boulder')).visible, false);
        play('refine_little_light', 20);
        assert.deepEqual([stock(names('little_light_unrefined')), stock(names('little_light'))], [0, 1]);
        play('check_boulder', 40);
        play('open_bud', 20);
        assert.equal(stock(names('sleeping_gu')), 1);
        play('refine_find', 20);
        play('plan_provisions', 45);
        assert.deepEqual([stock(names('sleeping_gu')), stock(names('white_boar')), fact('passage'),
            fact('provision_plan'), life.energy.reserve], [0, 1, 'blocked', 'scout_for_pork', 0]);
        assert.deepEqual([stock(stone), life.player.facts[id('caravan.room_stones')],
            life.player.facts[id('inheritance.condensed_parts')], life.player.facts[id('moonveil.second_gu_priority')]],
        [132, 500, 20, true]);
        assert.equal(life.quote(names('take_little_light')).eligible, false);
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('the original map leads to a paid paired shot and White Boar strength', () => {
        const names = name => 'early_duel.' + name;
        const play = (name, minutes) => work(names(name), minutes);
        const prior = structuredClone(life.record);
        const before = structuredClone(life.inventory);
        life.admitEarlyDuel();
        assert.deepEqual(life.record.extensions.at(-1), {id: GU_LEAD_EARLY_DUEL, revision: 1, contentHash: hash(guLeadEarlyDuel)});
        assert.equal(life.quote(names('pair_gu')).visible, false);
        life.act(names('scout'));
        assert.equal(life.earlyDuelPace(), 120);
        assert.equal(life.earlyDuelPace(prior), null);
        life.step(120);
        for (const [name, minutes] of [['track',45],['finish_trapped_boar',1],['close_gap',1],['duck_arrow',1],
            ['use_sun',1],['demand_map',35],['check_sketch',15],['press_for_original',5]]) play(name, minutes);
        assert.equal(stock(names('beast_skin_map')), 0);
        play('search_hearth',5);
        play('answer_guard',8);
        play('find_boar',120);
        play('wear_down',3);
        assert.equal(life.energy.reserve, 28);
        if (process.env.YAIR_GU_PAIRING_FIXTURE) {
            writeFileSync(process.env.YAIR_GU_PAIRING_FIXTURE, JSON.stringify(life.pairingFixture()));
        }
        life.practiceLightPairing(practice => {
            practice.act('light_pairing.solo');
            practice.step(5);
            assert.equal(practice.player.facts[id('light_pairing.far_target_cut')], false);
            assert.equal(practice.energy.reserve, 24);
            practice.act('light_pairing.paired');
            practice.roundTrip();
            practice.step(5);
            assert.equal(practice.player.facts[id('light_pairing.far_target_cut')], true);
            assert.equal(practice.energy.reserve, 19);
            assert.equal(stock('second_gu.little_light'), 1);
            practice.roundTrip();
        });
        assert.equal(life.quote(names('cultivate_strength')).visible, false);
        life.act(names('pair_gu'));
        assert.equal(life.energy.reserve, 23);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 28);
        assert.equal(stock(names('fresh_pork')), 0);
        play('pair_gu',1);
        assert.equal(stock(names('fresh_pork')), 1);
        play('feed_boar_gu',12);
        assert.equal(stock(names('fresh_pork')), 0);
        play('cultivate_strength',15);
        assert.equal(life.skills.Weightlifting.xp, 60);
        assert.equal(life.energy.reserve, 22);
        assert.equal(life.refinementStatus()[0].value, '22 of 44 parts · dark green');
        assert.equal(life.player.facts[id('inheritance.aperture_stage')], 'middle');
        assert.equal(stock(names('beast_skin_map')), 1);
        for (const [k, v] of Object.entries(before)) assert.equal(life.inventory[k], v);
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });


    await t.test('the midyear hunt turns strength and map knowledge into separate earned and buried bags', () => {
        const names = name => 'hunt_followthrough.' + name;
        const full = name => id(names(name));
        const play = name => work(names(name), guLeadHuntFollowthrough.commands.find(c => c.id === full(name)).duration);
        const fact = name => life.player.facts[full(name)];
        const old = structuredClone(life.inventory);
        const prior = structuredClone(life.record);
        life.admitHunt();
        assert.deepEqual(life.record.extensions.at(-1),
            {id: GU_LEAD_HUNT_FOLLOWTHROUGH, revision: 1, contentHash: hash(guLeadHuntFollowthrough)});
        life.act(names('train_and_feed'));
        assert.equal(life.huntPace(), 120);
        assert.equal(life.huntPace(prior), null);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 22);
        assert.equal(life.skills.Weightlifting.xp, 60);
        play('train_and_feed');
        assert.equal(life.skills.Weightlifting.xp, 180);
        play('test_boulder');
        assert.equal(fact('passage'), 'still_blocked');
        play('study_map');
        play('keep_low');
        assert.equal(life.energy.reserve, 44);
        play('spare_rivals');
        play('bury_cache');
        assert.equal(life.quote(names('approach_circle')).visible, false);
        play('hunt_at_noon');
        life.act(names('hunt_at_sunset'));
        assert.equal(life.energy.reserve, 3);
        assert.equal(fact('exam_boars'), 8);
        assert.equal(stock(names('exam_bag')), 0);
        life.cancel();
        assert.equal(life.energy.reserve, 27);
        play('hunt_at_sunset');
        assert.equal(fact('exam_boars'), 23);
        assert.equal(stock(names('exam_bag')), 1);
        assert.equal(fact('threat'), undefined);
        for (const name of ['approach_circle', 'inspect_shelter', 'weigh_clues', 'plan_escape']) play(name);
        assert.equal(fact('route'), 'avoid_mapped_boar_grounds');
        assert.equal(fact('cache'), 'buried_by_stream');
        assert.equal(life.player.facts[id('inheritance.aperture_stage')], 'middle');
        assert.equal(life.player.facts[id('caravan.room_stones')], 500);
        assert.equal(life.refinementStatus()[0].value, '3 of 44 parts · dark green');
        assert.deepEqual(life.inventory, {...old, [JSON.stringify({id: id(stone)})]: 131,
            [JSON.stringify({id: full('exam_bag')})]: 1});
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('exam custody, cultivation and Jade Skin each settle once on their earned route', () => {
        const names = name => 'exam_result.' + name;
        const play = name => work(names(name), guLeadExamResult.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const before = structuredClone(life.inventory);
        const prior = structuredClone(life.record);
        life.admitExam();
        assert.deepEqual(life.record.extensions.at(-1),
            {id: GU_LEAD_EXAM_RESULT, revision: 1, contentHash: hash(guLeadExamResult)});
        for (const name of ['circle_cross', 'listen_at_hill']) play(name);
        life.act(names('hand_over_bag'));
        assert.equal(stock('hunt_followthrough.exam_bag'), 0);
        assert.equal(fact('result'), undefined);
        life.roundTrip();
        life.cancel();
        assert.equal(stock('hunt_followthrough.exam_bag'), 1);
        play('hand_over_bag');
        assert.equal(fact('result'), 'first');
        assert.equal(fact('buried_bag_custody'), 'unreconciled');
        assert.equal(stock(stone), 131);
        play('take_gift');
        assert.equal(stock(stone), 161);
        life.act(names('hear_jiang_he'));
        assert.equal(life.examPace(), 120);
        assert.equal(life.examPace(prior), null);
        life.cancel();
        for (const name of ['hear_jiang_he', 'reach_upper', 'train_for_slope', 'clear_slope', 'dig_in_room', 'test_pillars']) play(name);
        assert.equal(stock(names('jade_skin')), 1);
        assert.equal(stock(names('jade_eyes')), 2);
        life.act(names('feed_jade'));
        assert.equal(stock(names('jade_eyes')), 0);
        life.cancel();
        assert.equal(stock(names('jade_eyes')), 2);
        for (const name of ['feed_jade', 'search_rim', 'hunt_with_jade', 'listen_in_brush']) play(name);
        assert.equal(stock(names('jade_eyes')), 0);
        assert.equal(stock('hunt_followthrough.exam_bag'), 0);
        assert.equal(fact('trail'), 'footsteps_approach');
        assert.equal(fact('aperture_stage'), 'upper');
        assert.equal(life.player.facts[id('hunt_followthrough.exam_boars')], 23);
        assert.equal(life.player.facts[id('caravan.room_stones')], 500);
        assert.equal(life.refinementStatus()[0].value, '36 of 44 parts · black green');
        delete before[JSON.stringify({id: id('hunt_followthrough.exam_bag')})];
        assert.deepEqual(life.inventory, {...before, [JSON.stringify({id: id(stone)})]: 160,
            [JSON.stringify({id: id(names('jade_skin'))})]: 1});
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });
    await t.test('the final exam tests earned strength, settles real custody, and leaves the announced reward uncollected', () => {
        const names = name => 'year_end.' + name;
        const play = name => work(names(name), guLeadYearEnd.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        const strength = life.skills.Weightlifting.xp;
        life.admitYearEnd();
        assert.deepEqual(life.record.extensions.at(-1),
            {id: GU_LEAD_YEAR_END, revision: 1, contentHash: hash(guLeadYearEnd)});
        play('watch_hunter');
        life.act(names('cultivate_for_winter'));
        assert.equal(life.yearEndPace(), 120);
        assert.equal(life.yearEndPace(prior), null);
        assert.equal(fact('aperture_stage'), undefined);
        life.cancel();
        assert.equal(stock(stone), 160);
        play('cultivate_for_winter');
        assert.equal(stock(stone), 154);
        assert.equal(fact('aperture_stage'), 'peak');
        assert.equal(life.refinementStatus()[0].value, '44 of 44 parts · black green');
        play('take_final_check');
        life.act(names('leave_gu'));
        assert.equal(fact('cave_custody'), undefined);
        assert.equal(stock('second_gu.white_boar'), 0);
        assert.equal(stock('exam_result.jade_skin'), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock('second_gu.white_boar'), 1);
        assert.equal(stock('exam_result.jade_skin'), 1);
        for (const name of ['leave_gu', 'enter_draw', 'watch_fang_zheng', 'close_inside_range', 'circle_and_pin', 'cut_palm']) play(name);
        assert.equal(life.energy.reserve, 40);
        assert.equal(fact('cave_custody'), 'white_boar_and_jade_skin');
        const strengthFact = id('exam_result.practice');
        delete life.player.facts[strengthFact];
        assert.equal(life.quote(names('break_jade_light')).eligible, false);
        life.player.facts[strengthFact] = 'one_boar_strength';
        for (const name of ['break_jade_light', 'accept_treatment', 'hear_group_offer']) play(name);
        assert.equal(fact('hands'), 'healed_still_weak');
        assert.equal(fact('announced_stones'), 150);
        assert.equal(fact('offered_stones'), 100);
        assert.equal(fact('group_offer'), 'open');
        assert.equal(stock(stone), 154);
        assert.equal(life.skills.Weightlifting.xp, strength);
        assert.equal(life.refinementStatus()[0].value, '40 of 44 parts · black green');
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });
    await t.test('mission payout, blocked inheritance, and a sustained Rank Two advance settle independently', () => {
        const names = name => 'rank_two.' + name;
        const play = name => work(names(name), guLeadRankTwo.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        const inventory = {...life.inventory};
        life.admitRankTwo();
        assert.deepEqual(life.record.extensions.at(-1),
            {id: GU_LEAD_RANK_TWO, revision: 1, contentHash: hash(guLeadRankTwo)});
        assert.equal(life.quote(names('break_through')).eligible, false);
        for (const name of ['join_jiao_san', 'report_for_work', 'bring_back_soil']) play(name);
        assert.equal(fact('first_mission'), 'settled');
        assert.equal(stock(stone), 155);
        for (const name of ['leave_lunch', 'check_the_queue']) play(name);
        assert.equal(fact('mission'), 'leader_assignment_active');
        assert.equal(fact('claim'), 'blocked_by_active_mission');
        for (const name of ['rent_bamboo_room', 'rush_the_wall']) play(name);
        assert.equal(life.energy.reserve, 2);
        assert.equal(fact('aperture_stage'), undefined);
        for (const name of ['leave_decoy', 'fill_the_sea']) play(name);
        assert.equal(life.energy.reserve, 44);
        life.act(names('break_through'));
        assert.equal(life.rankTwoPace(), 120);
        assert.equal(life.rankTwoPace(prior), null);
        assert.equal(stock(stone), 148);
        assert.equal(life.energy.reserve, 20);
        assert.equal(fact('aperture_stage'), undefined);
        assert.equal(life.quote(names('rest_and_set_out')).eligible, false);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 154);
        assert.equal(life.energy.reserve, 44);
        play('break_through');
        play('rest_and_set_out');
        assert.equal(fact('aperture_stage'), 'rank_two_initial');
        assert.equal(life.refinementStatus()[0].value, '20 of 44 parts · black green and pale red');
        assert.equal(fact('mission'), 'leader_assignment_active');
        assert.equal(fact('claim'), 'blocked_by_active_mission');
        assert.equal(fact('return'), 'toward_clan');
        assert.equal(fact('rent'), 'paid');
        assert.deepEqual(life.inventory, {...inventory, [JSON.stringify({id: id(stone)})]: 147});
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('the group closes before the estate assignment and the two Gu are transferred once', () => {
        const names = name => 'estate_claim.' + name;
        const play = name => work(names(name), guLeadEstateClaim.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const before = structuredClone(life.inventory);
        const prior = structuredClone(life.record);
        life.admitEstateClaim();
        assert.equal(life.quote(names('file_at_hall')).eligible, false);
        assert.equal(stock('second_gu.white_boar'), 0);
        assert.equal(stock('exam_result.jade_skin'), 0);
        for (const name of ['take_back_gu', 'follow_chi_shan', 'let_go', 'cut_the_net']) play(name);
        assert.equal(life.energy.reserve, 15);
        assert.equal(life.quote(names('take_back_gu')).eligible, false);
        life.act(names('wait_out_wolves'));
        assert.equal(stock(stone), 146);
        assert.equal(life.energy.reserve, 15);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 147);
        play('wait_out_wolves');
        play('cover_jiao_san');
        assert.equal(life.quote(names('file_at_hall')).eligible, false);
        play('answer_elders');
        assert.equal(fact('roll'), 'assignment_closed');
        assert.equal(fact('withdrawal'), 'unused');
        play('file_at_hall');
        life.act(names('collect_assignment'));
        assert.equal(life.estateClaimPace(), 120);
        assert.equal(life.estateClaimPace(prior), null);
        life.roundTrip();
        assert.equal(fact('claim'), 'filed_waiting');
        life.step(3 * 1440);
        play('plan_white_jade');
        assert.equal(fact('claim'), 'honey_wine_assignment');
        assert.equal(fact('plan'), 'white_jade_before_hive');
        assert.equal(life.energy.reserve, 27);
        const item = name => JSON.stringify({id: id(name)});
        assert.deepEqual(life.inventory, {...before, [item(stone)]: 146,
            [item('second_gu.white_boar')]: 1, [item('exam_result.jade_skin')]: 1});
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });

    await t.test('White Jade reserves the whole recipe and protects the wine gathering', () => {
        const names = name => 'white_jade.' + name;
        const play = name => work(names(name), guLeadWhiteJade.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const strength = life.skills.Weightlifting.xp;
        const prior = structuredClone(life.record);
        life.admitWhiteJade();
        assert.equal(life.quote(names('fuse_white_jade')).eligible, false);
        play('collect_tusk');
        const inputs = [stone, 'second_gu.white_boar', 'exam_result.jade_skin', names('boar_king_tusk')];
        const counts = () => inputs.map(stock);
        assert.deepEqual(counts(), [146, 1, 1, 1]);
        assert.equal(life.energy.reserve, 44);
        life.act(names('fuse_white_jade'));
        assert.deepEqual(counts(), [2, 0, 0, 0]);
        assert.equal(stock(names('white_jade_gu')), 0);
        assert.equal(life.quote(names('draw_honey_wine')).eligible, false);
        life.roundTrip();
        life.cancel();
        assert.deepEqual(counts(), [146, 1, 1, 1]);
        play('fuse_white_jade');
        assert.deepEqual(counts(), [2, 0, 0, 0]);
        assert.equal(stock(names('white_jade_gu')), 1);
        assert.equal(life.skills.Weightlifting.xp, strength);
        life.act(names('draw_honey_wine'));
        assert.equal(life.whiteJadePace(), 120);
        assert.equal(life.whiteJadePace(prior), null);
        life.roundTrip();
        life.step(7 * 1440);
        assert.equal(stock(names('golden_bee_wine')), 5);
        play('clear_pillar_path');
        play('return_with_wine');
        assert.equal(life.energy.reserve, 4);
        assert.equal(life.refinementStatus()[0].value, '4 of 44 parts · pale red');
        assert.equal(fact('pillars'), 'central_path_unfinished');
        assert.equal(fact('return'), 'uncle_at_rented_house');
        assert.equal(life.player.facts[id('estate_claim.claim')], 'honey_wine_assignment');
        assert.throws(() => life.validate(prior), /Settled extension work/);
        life.roundTrip();
    });


    await t.test('the hall conveys the estate only after delivery, checked record and recovery', () => {
        const names = name => 'estate_handover.' + name;
        const play = name => work(names(name), guLeadEstateHandover.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const wine = 'white_jade.golden_bee_wine';
        const before = life.inventory;
        const prior = structuredClone(life.record);
        life.admitEstateHandover();
        assert.equal(life.quote(names('collect_the_deeds')).eligible, false);
        play('refuse_the_offer');
        assert.equal(stock(stone), 2);
        assert.equal(stock(wine), 5);
        life.act(names('hand_over_wine'));
        assert.equal(stock(wine), 0);
        assert.equal(stock(names('estate_deeds')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(wine), 5);
        play('hand_over_wine');
        assert.equal(life.quote(names('collect_the_deeds')).eligible, false);
        play('read_the_record');
        life.act(names('collect_the_deeds'));
        assert.equal(life.estateHandoverPace(), 120);
        assert.equal(life.estateHandoverPace(prior), null);
        life.step(3 * 1440 - 1);
        assert.equal(stock(names('estate_deeds')), 0);
        assert.equal(stock(names('unrefined_vitality_grass')), 0);
        life.roundTrip();
        life.step(1);
        assert.equal(stock(names('estate_deeds')), 1);
        assert.equal(stock(names('unrefined_vitality_grass')), 1);
        assert.equal(fact('rented_houses'), 3);
        assert.equal(fact('estate_servants'), 8);
        for (const name of ['read_tavern_books', 'raise_tavern_wages', 'inspect_the_houses']) play(name);
        assert.equal(fact('waiter_raise_percent'), 20);
        assert.equal(fact('keeper_raise_percent'), 40);
        assert.equal(fact('rentals'), 'terms_retained');
        assert.equal(fact('return'), 'fang_zheng_below');
        assert.equal(life.energy.reserve, 4);
        const item = name => JSON.stringify({id: id(name)});
        assert.deepEqual(life.inventory, Object.fromEntries(Object.entries({...before,
            [item(names('estate_deeds'))]: 1, [item(names('unrefined_vitality_grass'))]: 1}).filter(([key]) => key !== item(wine))));
        life.roundTrip();
    });


    await t.test('Qing Shu mediates the proposed bout without taking the worm or conveying the estate', () => {
        const names = name => 'qing_shu_meeting.' + name;
        const play = name => work(names(name), guLeadQingShuMeeting.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const before = life.inventory;
        assert.equal(life.quote(names('hear_the_challenge')).eligible, false);
        life.admitQingShuMeeting();
        assert.equal(life.quote(names('answer_with_the_estate')).eligible, false);
        play('hear_the_challenge');
        assert.equal(fact('challenge'), 'proposed');
        play('send_him_to_qing_shu');
        assert.equal(fact('challenge'), 'awaiting_team_leader');
        play('meet_at_the_north_gate');
        play('hear_the_terms');
        assert.equal(fact('offer'), 'sale_or_clan_refinement');
        play('keep_the_worm');
        assert.equal(fact('fusion'), 'ingredients_missing');
        life.act(names('answer_with_the_estate'));
        life.roundTrip();
        assert.equal(fact('mediation'), undefined);
        life.cancel();
        assert.equal(fact('mediation'), undefined);
        play('answer_with_the_estate');
        assert.equal(fact('challenge'), 'awaiting_mediation');
        assert.equal(fact('mediation'), 'qing_shu_promised');
        assert.equal(fact('offer'), 'declined');
        assert.equal(life.quote(names('answer_with_the_estate')).eligible, false);
        assert.deepEqual(life.inventory, before);
        life.roundTrip();
    });


    await t.test('Moonglow fails with losses, then protects the tavern after earned recovery', () => {
        const names = name => 'moonglow.' + name;
        const play = name => {
            const command = guLeadMoonglow.commands.find(c => c.id === id(names(name)));
            life.act(names(name));
            life.step(command.duration);
        };
        const fact = name => life.player.facts[id(names(name))];
        const rooted = names('rooted_leaf');
        const plucked = names('vitality_leaf');
        const light = 'second_gu.little_light';
        const prior = structuredClone(life.record);
        life.admitMoonglow();
        assert.equal(life.quote(names('complete_moonglow')).eligible, false);
        play('prepare_the_grass');
        assert.equal(stock(plucked), 9);
        play('fund_the_fusion');
        assert.equal(stock(stone), 452);
        play('buy_second_light');
        assert.equal(stock(light), 2);
        play('attempt_moonglow');
        assert.equal(stock(light), 1);
        assert.equal(stock(stone), 352);
        assert.equal(fact('fusion'), 'gu_injured');
        assert.equal(life.quote(names('complete_moonglow')).eligible, false);
        for (let i = 0; i < 4; i++) {
            play('grow_two_leaves');
            assert.equal(stock(rooted), (i + 1) * 2);
            assert.equal(life.quote(names('grow_two_leaves')).eligible, false);
            play('draw_from_stones');
        }
        play('grow_last_leaf');
        assert.equal(stock(rooted), 9);
        assert.equal(stock(plucked), 0);
        assert.equal(life.energy.reserve, 24);
        assert.equal(stock(stone), 304);
        life.act(names('rest_the_gu'));
        assert.equal(life.moonglowPace(), 120);
        assert.equal(life.moonglowPace(prior), null);
        life.step(3 * 1440 - 1);
        assert.equal(fact('fusion'), 'gu_injured');
        life.roundTrip();
        life.step(1);
        assert.equal(fact('fusion'), 'recovered');
        play('replace_the_lost_light');
        play('complete_moonglow');
        assert.equal(stock(light), 0);
        assert.equal(stock(names('moonglow_gu')), 1);
        assert.equal(stock(stone), 204);
        play('pluck_sale_lot');
        assert.equal(stock(rooted), 0);
        assert.equal(stock(plucked), 9);
        assert.equal(life.quote(names('grow_two_leaves')).eligible, false);
        play('settle_the_sale');
        assert.equal(stock(stone), 654);
        assert.equal(stock(plucked), 0);
        play('hear_the_warning');
        play('cut_before_the_armor_forms');
        play('cut_through_his_guard');
        assert.equal(fact('fight'), 'pinned_wounded');
        play('let_man_shi_leave');
        assert.equal(fact('fight'), 'man_shi_left_wounded');
        assert.equal(stock(stone), 654);
        assert.equal(life.energy.reserve, 25);
        life.roundTrip();
    });


    await t.test('sealed bids and the estate transfer preserve costs, retained grass and unused cultivation', () => {
        const names = name => 'relic_market.' + name;
        const play = name => work(names(name), guLeadRelicMarket.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const deeds = 'estate_handover.estate_deeds';
        const grass = 'moonglow.vitality_grass';
        const prior = structuredClone(life.record);
        life.admitRelicMarket();
        play('settle_the_estate_books');
        assert.equal(stock(stone), 1254);
        play('visit_the_treehouse');
        play('submit_the_worm_bid');
        assert.equal(stock(stone), 614);
        assert.equal(stock(names('second_liquor_worm')), 0);
        life.act(names('collect_the_worm'));
        assert.equal(life.relicMarketPace(), 120);
        assert.equal(life.relicMarketPace(prior), null);
        life.roundTrip();
        life.step(720);
        assert.equal(stock(names('second_liquor_worm')), 1);
        play('search_the_wine_stalls');
        assert.equal(fact('fusion'), 'bitter_wine_missing');
        for (const wine of ['sweet_wine', 'sour_wine', 'spicy_wine']) assert.equal(stock(names(wine)), 1);
        play('save_the_purse');
        play('submit_the_boar_bid');
        play('collect_the_boar');
        assert.equal(stock(names('black_boar_gu')), 1);
        assert.equal(stock(stone), 164);
        play('read_the_relic_listing');
        assert.equal(life.quote(names('submit_the_relic_bid')).eligible, false);
        life.act(names('sign_over_the_estate'));
        assert.equal(stock(deeds), 0);
        assert.equal(stock(grass), 1);
        assert.equal(stock(stone), 164);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(deeds), 1);
        assert.equal(stock(stone), 164);
        play('sign_over_the_estate');
        assert.equal(stock(deeds), 0);
        assert.equal(stock(grass), 1);
        assert.equal(stock(stone), 6764);
        play('submit_the_relic_bid');
        assert.equal(stock(names('red_steel_relic')), 0);
        assert.equal(stock(stone), 264);
        play('hear_jia_fu');
        play('leave_with_the_relic');
        assert.equal(stock(names('red_steel_relic')), 1);
        assert.equal(stock(names('jia_token')), 1);
        assert.equal(fact('relic'), 'won_unspent');
        assert.equal(life.player.facts[id('rank_two.aperture_stage')], 'rank_two_initial');
        life.roundTrip();
    });


    await t.test('the Relic is used once before the cave strategy and the next room remains unexplored', () => {
        const names = name => 'stone_forest.' + name;
        const play = name => work(names(name), guLeadStoneForest.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const relic = 'relic_market.red_steel_relic';
        life.admitStoneForest();
        play('fill_for_practice');
        play('train_under_impact');
        assert.equal(life.energy.reserve, 14);
        life.act(names('use_the_relic'));
        assert.equal(stock(relic), 0);
        assert.equal(fact('aperture_stage'), undefined);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(relic), 1);
        play('use_the_relic');
        assert.equal(stock(relic), 0);
        assert.equal(fact('aperture_stage'), 'rank_two_middle');
        assert.equal(life.energy.reserve, 14);
        play('refill_with_scarlet_essence');
        assert.match(life.refinementStatus()[0].value, /44 of 44 parts · scarlet red/);
        play('hold_white_jade');
        play('turn_the_groups_against_each_other');
        assert.equal(life.energy.reserve, 11);
        play('bait_with_your_shirt');
        play('cut_the_moving_shirt');
        assert.equal(life.energy.reserve, 1);
        assert.equal(stock(names('stealth_rock_gu')), 0);
        play('recover_behind_the_door');
        play('follow_the_blood');
        play('take_stealth_rock');
        assert.equal(stock(names('stealth_rock_gu')), 1);
        play('leave_the_stairs_unexplored');
        assert.equal(fact('path'), 'stairs_seen_route_reset');
        assert.equal(life.energy.reserve, 5);
        assert.equal(stock(stone), 248);
        play('listen_for_wine');
        play('turn_away_the_shopkeeper');
        play('hear_the_river_news');
        assert.equal(fact('wine'), 'bai_bitter_shell_lead');
        assert.equal(fact('toad'), 'sleeping_response_pending');
        assert.equal(stock('relic_market.second_liquor_worm'), 1);
        assert.equal(stock('relic_market.black_boar_gu'), 1);
        assert.equal(stock('moonglow.vitality_grass'), 1);
        life.roundTrip();
    });


    await t.test('the tide earns bitter wine and the two worms and four wines settle as one fusion', () => {
        const names = name => 'river_toad.' + name;
        const play = name => work(names(name), guLeadRiverToad.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const ingredients = ['vital.refined_liquor_worm', 'relic_market.second_liquor_worm', 'relic_market.sour_wine',
            'relic_market.sweet_wine', 'relic_market.spicy_wine', names('bitter_shell_wine')];
        const strength = life.skills.Weightlifting.xp;
        life.admitRiverToad();
        play('train_with_black_boar');
        assert.equal(life.skills.Weightlifting.xp, strength + 60);
        assert.equal(stock('relic_market.black_boar_gu'), 0);
        assert.equal(stock(names('refined_black_boar_gu')), 1);
        play('report_for_the_order');
        play('test_the_weight');
        assert.equal(fact('river'), 'bare_push_failed');
        assert.equal(stock(names('bitter_shell_wine')), 0);
        play('push_with_the_tide');
        assert.equal(fact('river'), 'toad_left_downstream');
        play('collect_bitter_shells');
        assert.equal(stock(names('whole_bitter_shell')), 4);
        assert.equal(stock(names('broken_bitter_shell')), 2);
        play('collect_the_hall_reward');
        assert.equal(fact('leadership'), 'team_leader');
        assert.equal(stock(stone), 742);
        life.act(names('fuse_the_four_flavours'));
        assert.equal(stock(stone), 282);
        for (const input of ingredients) assert.equal(stock(input), 0);
        assert.equal(stock(names('four_flavours_liquor_worm')), 0);
        life.roundTrip();
        life.cancel();
        for (const input of ingredients) assert.equal(stock(input), 1);
        assert.equal(stock(stone), 742);
        play('fuse_the_four_flavours');
        assert.equal(stock(names('four_flavours_liquor_worm')), 1);
        play('prepare_stronger_essence');
        assert.match(life.refinementStatus()[0].value, /13 scarlet, 2 upper-stage/);
        play('ask_about_stealth_scales');
        assert.equal(fact('nourishment'), 'upper_essence_applied');
        assert.equal(fact('stealth_plan'), 'materials_requested');
        assert.equal(life.player.facts[id('stone_forest.aperture_stage')], 'rank_two_middle');
        assert.equal(stock(stone), 262);
        life.roundTrip();
    });


    await t.test('winter access, wolf salvage and bargaining change the purse without completing the trade', () => {
        const names = name => 'wolf_front.' + name;
        const play = name => work(names(name), guLeadWolfFront.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitWolfFront();
        life.act(names('clear_three_pillars'));
        assert.equal(life.wolfFrontPace(), 120);
        assert.equal(life.wolfFrontPace(prior), null);
        life.roundTrip();
        life.step(2880);
        assert.equal(fact('pillars_cleared'), 3);
        assert.equal(fact('condensed_parts'), 0);
        assert.equal(life.energy.reserve, 1);
        play('work_around_the_patrols');
        assert.equal(fact('path'), 'patrols_slowed_access');
        play('fight_the_crippled_pack');
        assert.equal(life.energy.reserve, 11);
        assert.equal(stock(names('wolf_salvage')), 0);
        play('salvage_the_wolves');
        assert.equal(stock(names('wolf_salvage')), 1);
        play('take_the_compensation');
        assert.equal(stock(stone), 450);
        assert.equal(fact('contest'), 'ordered_to_abstain_compensated');
        play('grow_the_next_lot');
        assert.equal(stock('moonglow.vitality_leaf'), 9);
        play('settle_with_jiang_ya');
        assert.equal(stock('moonglow.vitality_leaf'), 0);
        assert.equal(stock(stone), 880);
        assert.equal(fact('trade'), 'paid_fish_scale_missing');
        play('set_terms_for_black_boar');
        play('hear_the_medicine_offer');
        assert.equal(fact('offer'), 'medicine_offer_awaiting_reply');
        assert.equal(fact('exchange'), 'black_boar_terms_named');
        for (const held of ['river_toad.refined_black_boar_gu', 'river_toad.four_flavours_liquor_worm',
            'stone_forest.stealth_rock_gu', 'moonglow.vitality_grass']) assert.equal(stock(held), 1);
        life.roundTrip();
    });


    await t.test('the alliance gathering leaves the price unaccepted and the challenge unfought', () => {
        const names = name => 'alliance_slope.' + name;
        const play = name => work(names(name), guLeadAllianceSlope.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const before = life.inventory;
        const essence = life.energy.reserve;
        life.admitAllianceSlope();
        assert.equal(life.quote(names('admit_defeat_without_sparring')).eligible, false);
        play('refuse_the_purchase');
        assert.equal(fact('medicine'), 'declined');
        play('quote_the_leaf_price');
        assert.equal(fact('leaf_price'), 65);
        assert.equal(fact('sale'), 'price_declined');
        play('attend_alliance_slope');
        play('watch_the_three_attack_match');
        assert.equal(fact('demonstration'), 'shadow_bond_seen');
        life.act(names('admit_defeat_without_sparring'));
        assert.equal(fact('challenge'), undefined);
        life.roundTrip();
        life.step(1);
        assert.equal(fact('challenge'), 'conceded_before_sparring');
        assert.equal(life.energy.reserve, essence);
        assert.deepEqual(life.inventory, before);
        life.roundTrip();
    });


    await t.test('ear adaptation gates reconnaissance and only declared eyes earn merit', () => {
        const names = name => 'ear_grass.' + name;
        const play = name => work(names(name), guLeadEarGrass.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        const strength = life.skills.Weightlifting.xp;
        life.admitEarGrass();
        play('hear_the_alliance_terms');
        play('exchange_black_boar');
        assert.equal(stock('river_toad.refined_black_boar_gu'), 0);
        assert.equal(stock(names('fish_scale_gu')), 1);
        assert.equal(life.skills.Weightlifting.xp, strength);
        play('fuse_stealth_scales');
        assert.equal(stock('stone_forest.stealth_rock_gu'), 0);
        assert.equal(stock(names('fish_scale_gu')), 0);
        assert.equal(stock(names('stealth_scales_gu')), 1);
        play('hunt_for_the_quota');
        assert.equal(stock(names('merit')), 40);
        play('take_the_ear_grass');
        play('buy_ginseng_and_petals');
        assert.equal(stock(names('merit')), 10);
        life.act(names('attach_the_ear_grass'));
        assert.equal(life.earGrassPace(), 120);
        assert.equal(life.earGrassPace(prior), null);
        assert.equal(fact('ear'), 'grass_found');
        assert.equal(life.quote(names('probe_the_centipede_passage')).eligible, false);
        life.roundTrip();
        life.step(720);
        assert.equal(fact('ear'), 'right_ear_adapted');
        play('probe_the_centipede_passage');
        assert.equal(fact('cave'), 'centipede_seen_door_closed');
        play('draw_back_the_healthy_pack');
        play('listen_then_collect_the_eyes');
        assert.equal(stock(names('wolf_eyes')), 8);
        play('declare_two_eyes');
        assert.equal(stock(names('wolf_eyes')), 0);
        assert.equal(stock(names('cached_wolf_eyes')), 6);
        assert.equal(stock(names('merit')), 30);
        play('run_ahead_of_the_tide');
        assert.equal(fact('tide'), 'running_toward_village');
        assert.equal(life.energy.reserve, 14);
        assert.equal(stock(stone), 818);
        life.roundTrip();
    });


    await t.test('the wolf tide pursuit spends defenses and leaves the intended spoils unavailable', () => {
        const names = name => 'ice_soul.' + name;
        const play = name => work(names(name), guLeadIceSoul.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitIceSoul();
        life.act(names('stay_in_the_inn'));
        assert.equal(life.iceSoulPace(), 120);
        assert.equal(life.iceSoulPace(prior), null);
        life.roundTrip();
        life.step(720);
        play('work_the_wolf_tide');
        assert.equal(life.energy.reserve, 24);
        assert.equal(stock(stone), 802);
        const inventory = life.inventory;
        play('read_the_resource_board');
        assert.equal(fact('board'), 'movement_gu_sought');
        assert.equal(worldFact('plunder'), 'held_by_bai');
        play('choose_man_shis_group');
        play('lure_the_bold_pack');
        play('escape_bai_through_the_pack');
        assert.equal(life.energy.reserve, 2);
        assert.equal(worldFact('man_shi'), 'killed_by_bai');
        play('redirect_bai_toward_xiong');
        play('watch_and_reconsider');
        assert.equal(fact('battle'), 'xiong_and_bai_fighting');
        assert.equal(fact('appraisal'), 'direct_fight_unfavorable');
        assert.deepEqual(life.inventory, inventory);
        life.roundTrip();
    });


    await t.test('the indirect wound enables Plunder custody while the ice withdrawal leaves the clash unresolved', () => {
        const names = name => 'ice_crystal.' + name;
        const play = name => work(names(name), guLeadIceCrystal.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        life.admitIceCrystal();
        play('wait_for_a_retreat');
        assert.equal(life.energy.reserve, 38);
        assert.equal(stock(stone), 792);
        play('help_close_the_formation');
        play('watch_for_the_link');
        assert.equal(worldFact('xiong_li'), 'killed_by_bai');
        assert.equal(fact('link'), 'shadow_bond_active');
        play('strike_through_the_shadow');
        assert.equal(worldFact('xiong_jiang'), 'killed_by_fang_yuan');
        assert.equal(fact('link'), 'harm_transferred');
        life.act(names('take_plunder_in_the_pursuit'));
        assert.equal(stock(names('plunder_gu')), 0);
        assert.equal(worldFact('plunder_custody'), undefined);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 16);
        play('take_plunder_in_the_pursuit');
        assert.equal(stock(names('plunder_gu')), 1);
        assert.equal(worldFact('plunder_custody'), 'held_by_fang_yuan');
        play('warn_qing_shu');
        play('test_the_ice');
        assert.equal(worldFact('frost_demon'), 'destroyed');
        assert.equal(life.energy.reserve, 3);
        play('leave_the_frozen_path');
        assert.equal(fact('ice'), 'fang_yuan_withdrew');
        assert.equal(worldFact('qing_shu'), 'wood_charm_activated');
        assert.equal(worldFact('clan_elder'), 'killed_by_bai');
        assert.equal(stock(names('plunder_gu')), 1);
        life.roundTrip();
    });


    await t.test('recovered Gu earn merit while plundered Gu stay unused through upper-stage cultivation', () => {
        const names = name => 'wood_charm.' + name;
        const play = name => work(names(name), guLeadWoodCharm.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitWoodCharm();
        play('recover_in_cover');
        assert.equal(life.energy.reserve, 44);
        play('gather_from_the_fallen');
        assert.equal(stock(names('recovered_gu_bundle')), 1);
        play('listen_and_approach_the_cage');
        assert.equal(life.energy.reserve, 27);
        play('take_the_relic_from_bai');
        assert.equal(stock(names('red_steel_relic')), 1);
        play('take_stone_aperture');
        assert.equal(stock(names('stone_aperture_gu')), 1);
        play('take_water_shield');
        assert.equal(stock(names('water_shield_gu')), 1);
        assert.equal(life.energy.reserve, 0);
        play('withdraw_and_report_the_bundle');
        assert.equal(stock(names('recovered_gu_bundle')), 0);
        assert.equal(stock('ear_grass.merit'), 4030);
        assert.equal(worldFact('qing_shu'), 'body_returned_to_gu_yue');
        assert.equal(worldFact('fang_zheng'), 'received_letter_and_chose_to_protect');
        life.act(names('nourish_to_upper_stage'));
        assert.equal(life.woodCharmPace(), 120);
        assert.equal(life.woodCharmPace(prior), null);
        assert.equal(fact('aperture_stage'), undefined);
        life.roundTrip();
        life.step(7200);
        assert.equal(fact('aperture_stage'), 'rank_two_upper');
        assert.match(life.refinementStatus()[0].value, /44 of 44 parts · dark red/);
        play('refuse_more_leaf_sales');
        assert.equal(fact('leaves'), 'extra_sales_refused');
        assert.equal(stock(names('red_steel_relic')), 1);
        assert.equal(stock(names('stone_aperture_gu')), 1);
        assert.equal(stock(stone), 680);
        life.roundTrip();
    });


    await t.test('the Xiong bargain, the clan notice and the first wall night spend real stones and essence', () => {
        const names = name => 'wall_night.' + name;
        const play = name => work(names(name), guLeadWallNight.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        const stones = stock(stone);
        life.admitWallNight();
        play('quote_the_leaves_to_ye');
        assert.equal(fact('leaves'), 'ye_five_at_seventy_two_due_in_three_days');
        assert.equal(stock('moonglow.vitality_grass'), 1);
        assert.equal(stock(stone), stones);
        play('set_terms_with_jiang_ya');
        play('wait_above_the_valley');
        assert.equal(worldFact('wolf_lure'), 'four_packs_drawn_to_valley');
        assert.equal(stock(names('bear_enslavement_gu')), 0);
        play('offer_the_vine_route');
        assert.equal(stock(names('bear_enslavement_gu')), 0);
        life.act(names('refine_the_bear_gu_together'));
        assert.equal(stock(names('bear_enslavement_gu')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(life.energy.reserve, 44);
        assert.equal(stock(stone), stones);
        play('refine_the_bear_gu_together');
        assert.equal(stock(names('bear_enslavement_gu')), 1);
        assert.equal(stock(stone), stones + 700);
        assert.equal(life.energy.reserve, 36);
        assert.equal(worldFact('public_opinion'), 'condemning_fang_yuan_after_survivors_talk');
        play('read_the_requisition');
        assert.equal(stock('moonglow.vitality_grass'), 1);
        assert.equal(fact('notice'), 'named_as_not_handed_over');
        play('plan_the_rank_three_push');
        assert.equal(life.player.facts[id('wood_charm.aperture_stage')], 'rank_two_upper');
        assert.equal(fact('plan'), 'life_burial_recipe_pending_right_moment');
        play('answer_the_sirens');
        play('hold_the_wall_against_a_bold_wolf');
        assert.equal(life.energy.reserve, 12);
        assert.equal(stock('wood_charm.water_shield_gu'), 1);
        play('recover_off_the_ladder');
        assert.equal(life.energy.reserve, 34);
        play('rotate_back_until_ten');
        assert.equal(life.energy.reserve, 14);
        assert.equal(fact('wall'), 'five_entries_by_ten_battle_continues');
        assert.equal(worldFact('battle'), 'continues_at_ten_at_night');
        assert.equal(stock(stone), stones + 694);
        life.roundTrip();
    });


    await t.test('the frenzy wolves, Yao Le and the Life Burial Gu spend real stones, merit and essence to reach Rank Three', () => {
        const names = name => 'burial_gu.' + name;
        const play = name => work(names(name), guLeadBurialGu.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        life.admitBurialGu();
        play('throw_moonblades_from_the_tower');
        assert.equal(life.energy.reserve, 10);
        play('take_the_thunderball');
        assert.equal(fact('defence_gu'), 'dulled_and_fragile');
        assert.equal(stock('wood_charm.water_shield_gu'), 1);
        play('watch_the_frenzy_wolves');
        play('see_the_east_gate_break');
        assert.equal(worldFact('yao_le'), 'thrown_outside_the_village');
        play('guide_yao_le_out_of_the_fight');
        assert.equal(life.energy.reserve, 6);
        play('take_her_to_the_cave');
        assert.equal(life.energy.reserve, 36);
        assert.equal(stock(stone), 1366);
        play('take_her_gu_with_plunder');
        assert.equal(stock(names('yao_le_gu')), 1);
        assert.equal(life.energy.reserve, 28);
        play('let_the_bear_finish_the_recipe');
        assert.equal(worldFact('yao_le'), 'killed_by_fang_yuan_for_the_recipe');
        life.act(names('burn_the_materials_into_a_gu'));
        assert.equal(stock(names('man_beast_life_burial_gu')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 1366);
        assert.equal(stock('ear_grass.merit'), 4030);
        play('burn_the_materials_into_a_gu');
        assert.equal(stock(names('man_beast_life_burial_gu')), 1);
        assert.equal(stock(stone), 366);
        assert.equal(stock('ear_grass.merit'), 3230);
        play('swallow_the_gu_and_break_through');
        assert.equal(stock(names('man_beast_life_burial_gu')), 0);
        assert.equal(life.energy.reserve, 0);
        assert.equal(fact('aperture_stage'), 'rank_three_initial');
        play('form_white_silver_essence');
        assert.equal(life.energy.reserve, 44);
        assert.equal(stock(stone), 354);
        assert.match(life.refinementStatus()[0].value, /44 of 44 parts · white silver with a trace of black red/);
        assert.equal(worldFact('elder_meeting'), 'called_to_confirm_the_new_rank_three');
        life.roundTrip();
    });


    await t.test('the clan hall, the Chi loans and two fusions settle stones, merit and Gu without using the borrowed Gu', () => {
        const names = name => 'elder_hall.' + name;
        const play = name => work(names(name), guLeadElderHall.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitElderHall();
        play('meet_chi_lian_in_secret');
        play('show_your_rank_to_the_elders');
        play('refuse_yao_ji_s_inspection');
        play('account_for_three_days');
        play('turn_the_search_against_yao_ji');
        assert.equal(fact('elder'), 'confirmed_by_clan_head');
        assert.equal(worldFact('medicine_hall'), 'chi_zhong_acting_elder');
        play('accept_the_elders_congratulations');
        assert.equal(stock(stone), 354);
        life.act(names('borrow_from_chi_lian'));
        assert.equal(stock(names('cleansing_water_gu')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 354);
        play('borrow_from_chi_lian');
        assert.equal(stock(stone), 3354);
        assert.equal(stock(names('cleansing_water_gu')), 1);
        play('choose_the_clans_rank_three_gu');
        assert.equal(stock(names('thunderwings_gu')), 1);
        life.act(names('fuse_water_shield_and_white_jade'));
        assert.equal(life.elderHallPace(), 120);
        assert.equal(life.elderHallPace(prior), null);
        life.step(1440);
        assert.equal(stock('wood_charm.water_shield_gu'), 0);
        assert.equal(stock('white_jade.white_jade_gu'), 1);
        assert.equal(stock(stone), 2954);
        life.act(names('fuse_the_sky_canopy_gu'));
        life.step(2880);
        assert.equal(stock('white_jade.white_jade_gu'), 0);
        assert.equal(stock(names('sky_canopy_gu')), 1);
        assert.equal(stock(stone), 2554);
        assert.equal(stock('ear_grass.merit'), 2730);
        assert.equal(stock(names('cleansing_water_gu')), 1);
        assert.equal(life.energy.reserve, 44);
        life.roundTrip();
    });


    await t.test('the secret room, the grass for a token and the family visit settle stones and custody', () => {
        const names = name => 'secret_room.' + name;
        const play = name => work(names(name), guLeadSecretRoom.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitSecretRoom();
        play('browse_the_recipes');
        play('wonder_about_the_flower_wine_monk');
        life.act(names('return_for_blood_moon'));
        assert.equal(life.secretRoomPace(), 120);
        assert.equal(life.secretRoomPace(prior), null);
        life.step(1440);
        assert.equal(fact('recipes'), 'blood_moon_memorised');
        play('plan_your_six_gu');
        assert.equal(fact('plan'), 'storage_gu_missing');
        play('collect_the_allowance_from_chi_zhong');
        assert.equal(stock(stone), 2854);
        life.act(names('trade_the_grass_for_the_prize_token'));
        assert.equal(stock(names('prize_token')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock('moonglow.vitality_grass'), 1);
        play('trade_the_grass_for_the_prize_token');
        assert.equal(stock('moonglow.vitality_grass'), 0);
        assert.equal(stock(names('prize_token')), 1);
        play('visit_uncle_and_aunt');
        assert.equal(stock(stone), 2554);
        assert.equal(stock('ear_grass.merit'), 2730);
        life.roundTrip();
    });


    await t.test('Blood Moon Gu, the cleansed sea and the storage Gu settle stones, Gu and essence', () => {
        const names = name => 'tusita_flower.' + name;
        const play = name => work(names(name), guLeadTusitaFlower.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitTusita();
        play('read_the_injury_report');
        play('extort_blood_essence_from_chi_lian');
        assert.equal(stock(names('blood_essence_gu')), 2);
        life.act(names('fuse_blood_moon_first_try'));
        assert.equal(life.tusitaPace(), 120);
        assert.equal(life.tusitaPace(prior), null);
        life.step(480);
        assert.equal(stock(names('blood_essence_gu')), 1);
        assert.equal(stock('moonglow.moonglow_gu'), 1);
        assert.equal(stock(stone), 2054);
        life.act(names('fuse_blood_moon_gu'));
        assert.equal(stock(names('blood_moon_gu')), 0);
        life.roundTrip();
        life.cancel();
        assert.equal(stock('moonglow.moonglow_gu'), 1);
        assert.equal(stock(stone), 2054);
        life.act(names('fuse_blood_moon_gu'));
        life.step(480);
        assert.equal(stock(names('blood_moon_gu')), 1);
        assert.equal(stock('moonglow.moonglow_gu'), 0);
        assert.equal(stock(names('blood_essence_gu')), 0);
        assert.equal(stock(stone), 1554);
        play('wash_the_black_red_from_your_sea');
        assert.equal(stock('elder_hall.cleansing_water_gu'), 0);
        assert.match(life.refinementStatus()[0].value, /44 of 44 parts · white silver$/);
        play('fly_to_the_east_gate');
        assert.equal(life.energy.reserve, 30);
        play('finish_the_frenzy_wolf_with_the_elders');
        assert.equal(life.energy.reserve, 18);
        play('choose_the_tusita_flower');
        assert.equal(stock('secret_room.prize_token'), 0);
        assert.equal(stock(names('tusita_flower')), 1);
        play('go_to_dings_banquet');
        assert.equal(stock(stone), 11354);
        play('store_the_stones_in_the_tusita_flower');
        play('count_your_six_gu');
        assert.equal(fact('plan'), 'healing_gu_missing');
        assert.equal(stock('ear_grass.merit'), 2730);
        life.roundTrip();
    });


    await t.test('the centipede, the spring and the wolf king settle stones and essence through the Bai ambush', () => {
        const names = name => 'thunder_crown.' + name;
        const play = name => work(names(name), guLeadThunderCrown.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        const prior = structuredClone(life.record);
        life.admitThunderCrown();
        life.act(names('hold_the_western_line_for_ten_days'));
        assert.equal(life.thunderCrownPace(), 120);
        assert.equal(life.thunderCrownPace(prior), null);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 11354);
        play('hold_the_western_line_for_ten_days');
        assert.equal(life.energy.reserve, 44);
        assert.equal(stock(stone), 11346);
        play('clear_the_rock_forest');
        assert.equal(life.energy.reserve, 38);
        play('take_the_chainsaw_golden_centipede');
        assert.equal(stock(names('chainsaw_golden_centipede')), 1);
        assert.equal(life.energy.reserve, 26);
        play('follow_the_tunnel_to_the_spring');
        play('test_the_lotus_with_stones');
        assert.equal(stock(stone), 10826);
        play('climb_the_hill_and_see_the_wolf_king');
        play('watch_the_elders_trap_the_wolf');
        play('watch_the_blood_guillotine');
        assert.equal(fact('tide'), 'blood_guillotine_broke_the_wolf_tide');
        play('follow_the_clan_leader_in_stealth');
        assert.equal(life.energy.reserve, 24);
        play('kill_the_bai_elder');
        assert.equal(worldFact('bai_elder'), 'killed_by_fang_yuan');
        play('beat_bai_ning_bing_back');
        play('send_the_centipede_underground');
        assert.equal(life.energy.reserve, 4);
        assert.equal(fact('duel'), 'centipede_hidden_underground_fight_unresolved');
        assert.equal(stock(names('chainsaw_golden_centipede')), 1);
        assert.equal(stock('ear_grass.merit'), 2730);
        life.roundTrip();
    });


    await t.test('the ice storm, the lycan, the truce and the investigator settle essence, stones and Gu', () => {
        const names = name => 'lightning_lycan.' + name;
        const play = name => work(names(name), guLeadLycan.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        life.admitLycan();
        play('outfly_the_ice_storm');
        assert.equal(life.energy.reserve, 1);
        play('take_the_thunder_shield_gu');
        assert.equal(stock(names('thunder_shield_gu')), 1);
        assert.equal(life.energy.reserve, 0);
        life.act(names('hide_and_refill_from_the_tusita_flower'));
        assert.equal(stock(stone), 10786);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 10826);
        assert.equal(life.energy.reserve, 0);
        play('hide_and_refill_from_the_tusita_flower');
        assert.equal(life.energy.reserve, 44);
        assert.equal(stock(stone), 10786);
        play('count_the_dead_in_the_valley');
        play('flee_the_lightning_lycan');
        assert.equal(life.energy.reserve, 18);
        assert.equal(stock(names('thunder_shield_gu')), 0);
        assert.equal(fact('thunderwings'), 'barely_alive_and_unusable');
        play('cut_through_the_wolves');
        assert.equal(life.energy.reserve, 4);
        play('make_a_truce_with_bai_ning_bing');
        play('escape_through_the_southeast_gap');
        play('part_from_bai_ning_bing');
        assert.equal(life.energy.reserve, 1);
        play('decide_to_leave_the_mountain');
        play('meet_tie_xue_leng_on_the_road');
        play('see_the_lycan_driven_off');
        assert.equal(worldFact('chi_lian'), 'killed_in_the_smoke');
        play('sit_through_the_banquet_for_the_investigator');
        assert.equal(fact('banquet'), 'admitted_fear_and_stayed');
        assert.equal(stock('thunder_crown.chainsaw_golden_centipede'), 1);
        assert.equal(stock('ear_grass.merit'), 2730);
        life.roundTrip();
    });


    await t.test('the cover story, the marriage price and the charge in the hall leave stones and Gu unchanged except the refill', () => {
        const names = name => 'investigator.' + name;
        const play = name => work(names(name), guLeadInvestigator.commands.find(c => c.id === id(names(name))).duration);
        const fact = name => life.player.facts[id(names(name))];
        const worldFact = name => life.state.worlds[id('world')].facts[id(names(name))];
        life.admitInvestigator();
        play('let_mo_chen_cover_for_you');
        assert.equal(fact('status'), 'punishment_pending_after_discussion');
        life.act(names('draw_stones_after_the_banquet'));
        assert.equal(stock(stone), 10746);
        life.roundTrip();
        life.cancel();
        assert.equal(stock(stone), 10786);
        assert.equal(life.energy.reserve, 1);
        play('draw_stones_after_the_banquet');
        assert.equal(life.energy.reserve, 44);
        assert.equal(stock(stone), 10746);
        play('name_your_price_in_the_pavilion');
        play('guide_the_investigators_round_the_village');
        play('weigh_the_factions_and_the_clock');
        play('volunteer_as_envoy_to_the_xiong_clan');
        play('hear_the_charge_in_the_hall');
        play('admit_the_killing_and_stay');
        assert.equal(fact('leaving'), 'barred_until_cleared_by_the_investigators');
        play('bargain_again_with_mo_chen');
        assert.equal(fact('mo'), 'terms_thirty_percent_off_forty_thousand_advance_pig_iron_and_afterlife_grass');
        assert.equal(worldFact('mo_yan'), 'agrees_to_marry_him_and_hates_the_idea');
        assert.equal(stock(stone), 10746);
        assert.equal(stock('ear_grass.merit'), 2730);
        life.roundTrip();
    });


});

test('dorm continuation requires the exact installed Moonblade pin', async () => {
    const pack = {contentHash: guLeadDorm.base.contentHash,
        extensions: [{id: GU_LEAD_MOONBLADE, revision: 1, contentHash: hash(guLeadMoonblade)}]};
    const loaded = {id: GU_LEAD_DORM};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadDorm);
        assert.equal(base, pack);
        return loaded;
    }};
    assert.equal(await registerGuLeadDorm(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadDorm(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadDorm(register, pack), loaded);
});

test('assessment continuation requires the exact installed dorm pin', async () => {
    const pack = {contentHash: guLeadAssessment.base.contentHash,
        extensions: [{id: GU_LEAD_DORM, revision: 1, contentHash: hash(guLeadDorm)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadAssessment);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadAssessment(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadAssessment(register, pack), guLeadAssessment);
});


test('Mo confrontation requires the exact installed assessment pin', async () => {
    const pack = {contentHash: guLeadConfrontation.base.contentHash,
        extensions: [{id: GU_LEAD_ASSESSMENT, revision: 1, contentHash: hash(guLeadAssessment)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadConfrontation);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadConfrontation(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadConfrontation(register, pack), guLeadConfrontation);
});


test('clan response requires the exact installed dawn pin', async () => {
    const pack = {contentHash: guLeadClanResponse.base.contentHash,
        extensions: [{id: GU_LEAD_CONFRONTATION, revision: 1, contentHash: hash(guLeadConfrontation)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadClanResponse);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadClanResponse(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadClanResponse(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadClanResponse(register, pack), guLeadClanResponse);
});


test('caravan continuation requires the exact installed clan-response pin', async () => {
    const pack = {contentHash: guLeadCaravan.base.contentHash,
        extensions: [{id: GU_LEAD_CLAN_RESPONSE, revision: 1, contentHash: hash(guLeadClanResponse)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadCaravan);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadCaravan(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadCaravan(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadCaravan(register, pack), guLeadCaravan);
});


test('inheritance continuation requires the exact installed caravan pin', async () => {
    const pack = {contentHash: guLeadInheritance.base.contentHash,
        extensions: [{id: GU_LEAD_CARAVAN, revision: 1, contentHash: hash(guLeadCaravan)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadInheritance);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadInheritance(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadInheritance(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadInheritance(register, pack), guLeadInheritance);
});

test('academy gate continuation requires the exact installed inheritance pin', async () => {
    const pack = {contentHash: guLeadMoonveil.base.contentHash,
        extensions: [{id: GU_LEAD_INHERITANCE, revision: 1, contentHash: hash(guLeadInheritance)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadMoonveil);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadMoonveil(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadMoonveil(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadMoonveil(register, pack), guLeadMoonveil);
});

test('hearing continuation requires the exact installed academy gate pin', async () => {
    const pack = {contentHash: guLeadHearing.base.contentHash,
        extensions: [{id: GU_LEAD_MOONVEIL, revision: 1, contentHash: hash(guLeadMoonveil)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadHearing);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadHearing(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadHearing(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadHearing(register, pack), guLeadHearing);
});

test('second Gu continuation requires the exact installed hearing pin', async () => {
    const pack = {contentHash: guLeadSecondGu.base.contentHash,
        extensions: [{id: GU_LEAD_HEARING, revision: 1, contentHash: hash(guLeadHearing)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadSecondGu);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadSecondGu(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadSecondGu(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadSecondGu(register, pack), guLeadSecondGu);
});

test('the foothill continuation requires the exact installed second-Gu pin', async () => {
    const pack = {contentHash: guLeadEarlyDuel.base.contentHash,
        extensions: [{id: GU_LEAD_SECOND_GU, revision: 1, contentHash: hash(guLeadSecondGu)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadEarlyDuel(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadEarlyDuel(register, pack), guLeadEarlyDuel);
});


test('the midyear hunt requires the exact installed foothills pin', async () => {
    const pack = {contentHash: guLeadHuntFollowthrough.base.contentHash,
        extensions: [{id: GU_LEAD_EARLY_DUEL, revision: 1, contentHash: hash(guLeadEarlyDuel)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(raw, guLeadHuntFollowthrough);
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadHuntFollowthrough(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadHuntFollowthrough(register, pack), guLeadHuntFollowthrough);
});

test('exam result requires the exact installed midyear hunt pin', async () => {
    const predecessor = {id: GU_LEAD_HUNT_FOLLOWTHROUGH, revision: 1, contentHash: hash(guLeadHuntFollowthrough)};
    const pack = {contentHash: guLeadExamResult.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadExamResult(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadExamResult(register, pack), guLeadExamResult);
});

test('final exam requires the exact installed midyear result pin', async () => {
    const predecessor = {id: GU_LEAD_EXAM_RESULT, revision: 1, contentHash: hash(guLeadExamResult)};
    const pack = {contentHash: guLeadYearEnd.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadYearEnd(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadYearEnd(register, pack), guLeadYearEnd);
});


test('Rank Two continuation requires the exact installed year-end pin', async () => {
    const pack = {contentHash: guLeadRankTwo.base.contentHash,
        extensions: [{id: GU_LEAD_YEAR_END, revision: 1, contentHash: hash(guLeadYearEnd)}]};
    const register = {extension: async (raw, base) => {
        assert.equal(base, pack);
        return raw;
    }};
    assert.equal(await registerGuLeadRankTwo(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadRankTwo(register, {...pack, extensions: [{...pack.extensions[0], contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadRankTwo(register, pack), guLeadRankTwo);
});

test('estate assignment requires the exact installed Rank Two pin', async () => {
    const predecessor = {id: GU_LEAD_RANK_TWO, revision: 1, contentHash: hash(guLeadRankTwo)};
    const pack = {contentHash: guLeadEstateClaim.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadEstateClaim(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadEstateClaim(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadEstateClaim(register, pack), guLeadEstateClaim);
});

test('White Jade continuation requires the exact estate assignment pin', async () => {
    const predecessor = {id: GU_LEAD_ESTATE_CLAIM, revision: 1, contentHash: hash(guLeadEstateClaim)};
    const pack = {contentHash: guLeadWhiteJade.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadWhiteJade(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadWhiteJade(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal((await registerGuLeadWhiteJade(register, pack)).id, GU_LEAD_WHITE_JADE);
});

test('estate handover requires the exact installed White Jade pin', async () => {
    const predecessor = {id: GU_LEAD_WHITE_JADE, revision: 1, contentHash: hash(guLeadWhiteJade)};
    const pack = {contentHash: guLeadEstateHandover.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadEstateHandover(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadEstateHandover(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadEstateHandover(register, pack), guLeadEstateHandover);
});


test('Qing Shu’s meeting requires the exact installed estate handover pin', async () => {
    const predecessor = {id: guLeadEstateHandover.id, revision: 1, contentHash: hash(guLeadEstateHandover)};
    const pack = {contentHash: guLeadQingShuMeeting.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadQingShuMeeting(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadQingShuMeeting(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadQingShuMeeting(register, pack), guLeadQingShuMeeting);
});


test('Moonglow requires the exact installed Qing Shu meeting pin', async () => {
    const predecessor = {id: guLeadQingShuMeeting.id, revision: 1, contentHash: hash(guLeadQingShuMeeting)};
    const pack = {contentHash: guLeadMoonglow.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadMoonglow(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadMoonglow(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadMoonglow(register, pack), guLeadMoonglow);
});


test('the relic market requires the exact installed Moonglow pin', async () => {
    const predecessor = {id: guLeadMoonglow.id, revision: 1, contentHash: hash(guLeadMoonglow)};
    const pack = {contentHash: guLeadRelicMarket.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadRelicMarket(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadRelicMarket(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadRelicMarket(register, pack), guLeadRelicMarket);
});


test('the stone forest requires the exact installed Relic Market pin', async () => {
    const predecessor = {id: guLeadRelicMarket.id, revision: 1, contentHash: hash(guLeadRelicMarket)};
    const pack = {contentHash: guLeadStoneForest.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadStoneForest(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadStoneForest(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadStoneForest(register, pack), guLeadStoneForest);
});


test('the river assignment requires the exact installed Stone Forest pin', async () => {
    const predecessor = {id: guLeadStoneForest.id, revision: 1, contentHash: hash(guLeadStoneForest)};
    const pack = {contentHash: guLeadRiverToad.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadRiverToad(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadRiverToad(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadRiverToad(register, pack), guLeadRiverToad);
});


test('the wolf front requires the exact installed River Toad pin', async () => {
    const predecessor = {id: guLeadRiverToad.id, revision: 1, contentHash: hash(guLeadRiverToad)};
    const pack = {contentHash: guLeadWolfFront.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadWolfFront(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadWolfFront(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadWolfFront(register, pack), guLeadWolfFront);
});


test('Alliance Slope requires the exact installed Wolf Front pin', async () => {
    const predecessor = {id: guLeadWolfFront.id, revision: 1, contentHash: hash(guLeadWolfFront)};
    const pack = {contentHash: guLeadAllianceSlope.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadAllianceSlope(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadAllianceSlope(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadAllianceSlope(register, pack), guLeadAllianceSlope);
});


test('the Ear Grass continuation requires the exact installed Alliance Slope pin', async () => {
    const predecessor = {id: guLeadAllianceSlope.id, revision: 1, contentHash: hash(guLeadAllianceSlope)};
    const pack = {contentHash: guLeadEarGrass.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadEarGrass(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadEarGrass(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadEarGrass(register, pack), guLeadEarGrass);
});


test('the Ice Soul continuation requires the exact installed Ear Grass pin', async () => {
    const predecessor = {id: guLeadEarGrass.id, revision: 1, contentHash: hash(guLeadEarGrass)};
    const pack = {contentHash: guLeadIceSoul.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadIceSoul(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadIceSoul(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadIceSoul(register, pack), guLeadIceSoul);
});


test('the Ice Crystal continuation requires the exact installed Ice Soul pin', async () => {
    const predecessor = {id: guLeadIceSoul.id, revision: 1, contentHash: hash(guLeadIceSoul)};
    const pack = {contentHash: guLeadIceCrystal.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadIceCrystal(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadIceCrystal(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadIceCrystal(register, pack), guLeadIceCrystal);
});


test('the Wood Charm continuation requires the exact installed Ice Crystal pin', async () => {
    const predecessor = {id: guLeadIceCrystal.id, revision: 1, contentHash: hash(guLeadIceCrystal)};
    const pack = {contentHash: guLeadWoodCharm.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadWoodCharm(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadWoodCharm(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadWoodCharm(register, pack), guLeadWoodCharm);
});


test('the wall night continuation requires the exact installed Wood Charm pin', async () => {
    const predecessor = {id: guLeadWoodCharm.id, revision: 1, contentHash: hash(guLeadWoodCharm)};
    const pack = {contentHash: guLeadWallNight.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadWallNight(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadWallNight(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadWallNight(register, pack), guLeadWallNight);
});


test('the burial Gu continuation requires the exact installed wall night pin', async () => {
    const predecessor = {id: guLeadWallNight.id, revision: 1, contentHash: hash(guLeadWallNight)};
    const pack = {contentHash: guLeadBurialGu.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadBurialGu(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadBurialGu(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadBurialGu(register, pack), guLeadBurialGu);
});


test('the elder hall continuation requires the exact installed burial Gu pin', async () => {
    const predecessor = {id: guLeadBurialGu.id, revision: 1, contentHash: hash(guLeadBurialGu)};
    const pack = {contentHash: guLeadElderHall.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadElderHall(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadElderHall(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadElderHall(register, pack), guLeadElderHall);
});


test('the secret room continuation requires the exact installed elder hall pin', async () => {
    const predecessor = {id: guLeadElderHall.id, revision: 1, contentHash: hash(guLeadElderHall)};
    const pack = {contentHash: guLeadSecretRoom.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadSecretRoom(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadSecretRoom(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadSecretRoom(register, pack), guLeadSecretRoom);
});


test('the tusita flower continuation requires the exact installed secret room pin', async () => {
    const predecessor = {id: guLeadSecretRoom.id, revision: 1, contentHash: hash(guLeadSecretRoom)};
    const pack = {contentHash: guLeadTusitaFlower.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadTusitaFlower(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadTusitaFlower(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadTusitaFlower(register, pack), guLeadTusitaFlower);
});


test('the thunder crown continuation requires the exact installed tusita flower pin', async () => {
    const predecessor = {id: guLeadTusitaFlower.id, revision: 1, contentHash: hash(guLeadTusitaFlower)};
    const pack = {contentHash: guLeadThunderCrown.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadThunderCrown(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadThunderCrown(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadThunderCrown(register, pack), guLeadThunderCrown);
});


test('the lightning lycan continuation requires the exact installed thunder crown pin', async () => {
    const predecessor = {id: guLeadThunderCrown.id, revision: 1, contentHash: hash(guLeadThunderCrown)};
    const pack = {contentHash: guLeadLycan.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadLycan(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadLycan(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadLycan(register, pack), guLeadLycan);
});


test('the investigator continuation requires the exact installed lightning lycan pin', async () => {
    const predecessor = {id: guLeadLycan.id, revision: 1, contentHash: hash(guLeadLycan)};
    const pack = {contentHash: guLeadInvestigator.base.contentHash, extensions: [predecessor]};
    const register = {extension: async raw => raw};
    assert.equal(await registerGuLeadInvestigator(register, {...pack, extensions: []}), null);
    assert.equal(await registerGuLeadInvestigator(register, {...pack, extensions: [{...predecessor, contentHash: 'wrong'}]}), null);
    assert.equal(await registerGuLeadInvestigator(register, pack), guLeadInvestigator);
});
