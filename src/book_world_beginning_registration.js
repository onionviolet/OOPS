// One composition registration for source-qualified typed book beginnings.
// Each book retains its own content owner and exact saved definition.
import {registerHpBeginnings} from './book_world_hp_content.js';
import {registerDomain, domainRegistry} from './domain_registry.js';
import {packNative} from './world_pack_registry.js';
import {loadHpLeadCast,withHpLeadCast} from './book_world_hp_lead_pack.js';
import {hpLeadPracticeExtension} from './hp_lead_spells.js';
import {registerHpLeadDomain} from './book_world_hp_lead_domain.js';
import {registerHpLeadFlight,hpSchoolPassageClockRequest} from './book_world_hp_lead_flight.js';
import {registerHpLeadDuel,hpDuelPassageClockRequest} from './book_world_hp_lead_duel.js';
import {registerHpLeadHalloween,hpHalloweenPassageClockRequest} from './book_world_hp_lead_halloween.js';
import {registerHpLeadQuidditch,hpQuidditchPassageClockRequest} from './book_world_hp_lead_quidditch.js';
import {registerHpLeadMirror,hpMirrorPassageClockRequest} from './book_world_hp_lead_mirror.js';
import {registerHpLeadFlamel,hpFlamelPassageClockRequest} from './book_world_hp_lead_flamel.js';
import {registerHpLeadNorbert,hpNorbertPassageClockRequest} from './book_world_hp_lead_norbert.js';
import {registerHpLeadFinale,hpFinalePassageClockRequest} from './book_world_hp_lead_finale.js';
import {registerHpLifeHoldings} from './hp_life_holdings.js';
import {registerBookLifeHoldings} from './book_life_holdings.js';
import {shadowSlaveApprentice} from './world_packs/book_shadow_slave_life.js';
import {shadowSlaveTrial} from './world_packs/book_shadow_slave_trial.js';
import {guAcademyLife} from './world_packs/book_gu_life.js';
import {guKeeperLife} from './world_packs/book_gu_keeper.js';
import {registerGuKeeperPropagation} from './world_packs/book_gu_keeper_propagation.js';
import {registerGuKeeperVitality} from './world_packs/book_gu_keeper_vitality.js';
import {registerGuKeeperHostedWolf} from './world_packs/book_gu_keeper_hosted_wolf.js';
import {registerGuKeeperInsightMoth} from './world_packs/book_gu_keeper_insight_moth.js';
import {guCoordinationTrial} from './world_packs/book_gu_coordination.js';
import {registerGuKeeperMoonblade} from './world_packs/book_gu_keeper_moonblade.js';
import {registerGuKeeperMoonlightTrial} from './world_packs/book_gu_keeper_moonlight_trial.js';
import {registerGuKeeperMoonlightProspect} from './world_packs/book_gu_keeper_moonlight_prospect.js';
import {registerGuKeeperMoonlightStock} from './world_packs/book_gu_keeper_moonlight_stock.js';
import {registerGuKeeperMoveTrial} from './world_packs/book_gu_keeper_move_trial.js';
import {registerGuKeeperFireTrial} from './world_packs/book_gu_keeper_fire_trial.js';
import {registerGuKeeperRainbow} from './world_packs/book_gu_keeper_rainbow.js';
import {registerGuKeeperRankTrial} from './world_packs/book_gu_keeper_rank_trial.js';
import {registerGuKeeperFireflyFarm} from './world_packs/book_gu_keeper_firefly_farm.js';
import {registerGuKeeperFireflyCare} from './world_packs/book_gu_keeper_firefly_care.js';
import {registerGuKeeperFusion} from './world_packs/book_gu_keeper_fusion.js';
import {registerGuKeeperGoal} from './world_packs/book_gu_keeper_goal.js';
import {registerGuKeeperSpirit} from './world_packs/book_gu_keeper_spirit.js';
import {registerGuKeeperBeamProcedure} from './world_packs/book_gu_keeper_beam_procedure.js';
import {registerGuKeeperAntNest} from './world_packs/book_gu_keeper_ant_nest.js';
import {registerGuKeeperAttitude} from './world_packs/book_gu_keeper_attitude.js';
import {registerGuKeeperFixedForge} from './world_packs/book_gu_keeper_fixed_forge.js';
import {registerGuKeeperFixedImmortalTravel} from './world_packs/book_gu_keeper_fixed_immortal_travel.js';
import {registerGuKeeperStargate} from './world_packs/book_gu_keeper_stargate.js';
import {registerGuKeeperStargateSky} from './world_packs/book_gu_keeper_stargate_sky.js';
import {registerGuKeeperPastMoonblade} from './world_packs/book_gu_keeper_past_moonblade.js';
import {registerGuKeeperWildWorm} from './world_packs/book_gu_keeper_wild_worm.js';
import {registerGuKeeperWormEssence} from './world_packs/book_gu_keeper_worm_essence.js';
import {registerGuKeeperFourFlavors} from './world_packs/book_gu_keeper_four_flavors.js';
import {registerGuKeeperRedSteel} from './world_packs/book_gu_keeper_red_steel.js';
import {registerGuKeeperSeven} from './world_packs/book_gu_keeper_seven.js';
import {registerGuKeeperNine} from './world_packs/book_gu_keeper_nine.js';
import {registerGuKeeperImmortalRefinement} from './world_packs/book_gu_keeper_immortal_refinement.js';
import {registerGuKeeperImmortalAdvancement} from './world_packs/book_gu_keeper_immortal_advancement.js';
import {registerGuKeeperImmortalReclamation} from './world_packs/book_gu_keeper_immortal_reclamation.js';
import {guLeadLife} from './world_packs/book_gu_lead_life.js';
import {registerGuLeadSelection,guLeadAcademyPassageClockRequest} from './world_packs/book_gu_lead_selection.js';
import {registerGuLeadRefinement,guLeadRefinementClockRequest} from './world_packs/book_gu_lead_refinement.js';
import {registerGuLeadVital,guLeadVitalClockRequest} from './world_packs/book_gu_lead_vital.js';
import {registerGuLeadMoonblade,guLeadMoonbladeClockRequest} from './world_packs/book_gu_lead_moonblade.js';
import {registerGuLeadDorm,guLeadDormClockRequest} from './world_packs/book_gu_lead_dorm.js';
import {registerGuLeadAssessment} from './world_packs/book_gu_lead_assessment.js';
import {registerGuLeadConfrontation,guLeadConfrontationClockRequest} from './world_packs/book_gu_lead_confrontation.js';
import {registerGuLeadClanResponse,guLeadClanResponseClockRequest} from './world_packs/book_gu_lead_clan_response.js';
import {registerGuLeadCaravan,guLeadCaravanClockRequest} from './world_packs/book_gu_lead_caravan.js';
import {registerGuLeadInheritance,guLeadInheritanceClockRequest} from './world_packs/book_gu_lead_inheritance.js';
import {registerGuLeadMoonveil,guLeadMoonveilClockRequest} from './world_packs/book_gu_lead_moonveil.js';
import {registerGuLeadHearing} from './world_packs/book_gu_lead_hearing.js';
import {registerGuLeadSecondGu,guLeadSecondGuClockRequest} from './world_packs/book_gu_lead_second_gu.js';
import {registerGuLeadLightPairing} from './world_packs/book_gu_lead_light_pairing.js';
import {registerGuLeadEarlyDuel,guLeadEarlyDuelClockRequest} from './world_packs/book_gu_lead_early_duel.js';
import {registerGuLeadHuntFollowthrough,guLeadHuntFollowthroughClockRequest} from './world_packs/book_gu_lead_hunt_followthrough.js';
import {registerGuLeadExamResult,guLeadExamResultClockRequest} from './world_packs/book_gu_lead_exam_result.js';
import {registerGuLeadYearEnd,guLeadYearEndClockRequest} from './world_packs/book_gu_lead_year_end.js';
import {registerGuLeadRankTwo,guLeadRankTwoClockRequest} from './world_packs/book_gu_lead_rank_two.js';
import {registerGuLeadEstateClaim,guLeadEstateClaimClockRequest} from './world_packs/book_gu_lead_estate_claim.js';
import {registerGuLeadWhiteJade,guLeadWhiteJadeClockRequest} from './world_packs/book_gu_lead_white_jade.js';
import {registerGuLeadEstateHandover,guLeadEstateHandoverClockRequest} from './world_packs/book_gu_lead_estate_handover.js';
import {registerGuLeadQingShuMeeting} from './world_packs/book_gu_lead_qing_shu_meeting.js';
import {registerGuLeadMoonglow,guLeadMoonglowClockRequest} from './world_packs/book_gu_lead_moonglow.js';
import {registerGuLeadRelicMarket,guLeadRelicMarketClockRequest} from './world_packs/book_gu_lead_relic_market.js';
import {registerGuLeadStoneForest} from './world_packs/book_gu_lead_stone_forest.js';
import {registerGuLeadRiverToad} from './world_packs/book_gu_lead_river_toad.js';
import {registerGuLeadWolfFront,guLeadWolfFrontClockRequest} from './world_packs/book_gu_lead_wolf_front.js';
import {registerGuLeadAllianceSlope} from './world_packs/book_gu_lead_alliance_slope.js';
import {registerGuLeadEarGrass,guLeadEarGrassClockRequest} from './world_packs/book_gu_lead_ear_grass.js';
import {registerGuLeadIceSoul,guLeadIceSoulClockRequest} from './world_packs/book_gu_lead_ice_soul.js';
import {registerGuLeadIceCrystal} from './world_packs/book_gu_lead_ice_crystal.js';
import {registerGuLeadWoodCharm,guLeadWoodCharmClockRequest} from './world_packs/book_gu_lead_wood_charm.js';
import {registerGuLeadWallNight} from './world_packs/book_gu_lead_wall_night.js';
import {registerGuLeadBurialGu} from './world_packs/book_gu_lead_burial_gu.js';
import {registerGuLeadElderHall,guLeadElderHallClockRequest} from './world_packs/book_gu_lead_elder_hall.js';
import {registerGuLeadSecretRoom,guLeadSecretRoomClockRequest} from './world_packs/book_gu_lead_secret_room.js';
import {registerGuLeadTusitaFlower,guLeadTusitaFlowerClockRequest} from './world_packs/book_gu_lead_tusita_flower.js';
import {registerGuLeadThunderCrown,guLeadThunderCrownClockRequest} from './world_packs/book_gu_lead_thunder_crown.js';
import {registerGuLeadLycan} from './world_packs/book_gu_lead_lightning_lycan.js';
import {registerGuLeadInvestigator} from './world_packs/book_gu_lead_investigator.js';
import {molSchoolPassageClockRequest} from './mol_zorian_sensing.js';
import {shadowCompanyLife} from './world_packs/book_shadow_company_life.js';

export function bookPassageClockRequest(state,record) {
    return hpSchoolPassageClockRequest(state,record) ?? hpDuelPassageClockRequest(state,record) ??
        hpHalloweenPassageClockRequest(state,record) ?? hpQuidditchPassageClockRequest(state,record) ??
        hpMirrorPassageClockRequest(state,record) ?? hpFlamelPassageClockRequest(state,record) ??
        hpNorbertPassageClockRequest(state,record) ?? hpFinalePassageClockRequest(state,record) ??
        guLeadAcademyPassageClockRequest(state,record) ?? guLeadRefinementClockRequest(state,record) ??
        guLeadVitalClockRequest(state,record) ?? guLeadMoonbladeClockRequest(state,record) ??
        guLeadDormClockRequest(state,record) ??
        guLeadConfrontationClockRequest(state,record) ??
        guLeadClanResponseClockRequest(state,record) ??
        guLeadCaravanClockRequest(state,record) ??
        guLeadInheritanceClockRequest(state,record) ??
        guLeadMoonveilClockRequest(state,record) ??
        guLeadSecondGuClockRequest(state,record) ??
        guLeadEarlyDuelClockRequest(state,record) ??
        guLeadHuntFollowthroughClockRequest(state,record) ??
        guLeadExamResultClockRequest(state,record) ??
        guLeadYearEndClockRequest(state,record) ??
        guLeadRankTwoClockRequest(state,record) ??
        guLeadEstateClaimClockRequest(state,record) ??
        guLeadWhiteJadeClockRequest(state,record) ??
        guLeadEstateHandoverClockRequest(state,record) ??
        guLeadMoonglowClockRequest(state,record) ??
        guLeadRelicMarketClockRequest(state,record) ??
        guLeadWolfFrontClockRequest(state,record) ??
        guLeadEarGrassClockRequest(state,record) ??
        guLeadIceSoulClockRequest(state,record) ??
        guLeadWoodCharmClockRequest(state,record) ??
        guLeadElderHallClockRequest(state,record) ??
        guLeadSecretRoomClockRequest(state,record) ??
        guLeadTusitaFlowerClockRequest(state,record) ??
        guLeadThunderCrownClockRequest(state,record) ??
        molSchoolPassageClockRequest(state);
}

export async function registerBookBeginnings(register, choices, hpPorts = null) {
    await registerHpBeginnings(register, choices);
    const lead = await register(withHpLeadCast(packNative('book.hp.lead'), await loadHpLeadCast()));
    if(register.bundledInstantExtension)await register.bundledInstantExtension(hpLeadPracticeExtension(lead),lead);
    await registerHpLeadFlight(register, lead);
    await registerHpLeadDuel(register, lead);
    await registerHpLeadHalloween(register, lead);
    await registerHpLeadQuidditch(register, lead);
    await registerHpLeadMirror(register, lead);
    await registerHpLeadFlamel(register, lead);
    await registerHpLeadNorbert(register, lead);
    await registerHpLeadFinale(register, lead);
    // The domain registry is process-wide and rejects a repeated id, so a second call keeps the first registration.
    if (!domainRegistry.list().some(d => d.id === 'hp')) registerHpLeadDomain(registerDomain, hpPorts?.state ?? (() => null), hpPorts);
    if (hpPorts) { registerHpLifeHoldings(); registerBookLifeHoldings(); }
    choices.register({packId: lead.id, label: 'Harry Potter · the boy in the cupboard',
        arrival: 'Begin as a ten-year-old in your guardians\' household on the morning of a cousin\'s birthday. This is an opt-in lead life; the school and trade lives are unchanged.',
        means: 'No money, no wand and no method of your own. Your aunt and uncle decide the day; something in you sometimes acts on its own.'});
    const d = await register(shadowSlaveApprentice);
    choices.register({packId: d.id, label: 'Shadow Slave · divergent Memory apprentice',
        arrival: 'Begin a divergent Woken artisan life with rare acquired weave sight and replication training.',
        means: 'Your keepsake, coat, gloves, two shards and twelve essence. Study the pattern, fit your pieces, then bind and practice their paired ward with Iven at the work desk.'});
    const trial = await register(shadowSlaveTrial);
    choices.register({packId: trial.id, label: 'Shadow Slave · original Second Trial',
        arrival: 'Begin an original Woken student life at a training hall, one trial from Risen.',
        means: 'Four trial supplies and one healing salve. Prepare, cross into the Far Reach, choose a steady or rushed route, then settle the trial or retreat.'});
    const gu = await register(guAcademyLife);
    choices.register({packId:gu.id,label:'Reverend Insanity · original Moonlight Gu novice',
        arrival:'Begin an original adult clan-sponsored novice life with an already-opened Rank-one aperture.',
        means:'Keeper Lin, one living Moonlight Gu, sixteen fresh petals and six primeval units. Refine the same Gu, prepare its daily care, and learn a close-target cutting exercise.'});
    const keeper=await register(guKeeperLife);
    await registerGuKeeperMoonblade(register, keeper);
    await registerGuKeeperPropagation(register, keeper);
    await registerGuKeeperVitality(register, keeper);
    await registerGuKeeperHostedWolf(register, keeper);
    await registerGuKeeperInsightMoth(register, keeper);
    await registerGuKeeperMoonlightTrial(register, keeper);
    await registerGuKeeperMoonlightStock(register, keeper);
    await registerGuKeeperMoonlightProspect(register, keeper);
    await registerGuKeeperMoveTrial(register, keeper);
    await registerGuKeeperFireTrial(register, keeper);
    await registerGuKeeperRankTrial(register, keeper);
    await registerGuKeeperFireflyFarm(register, keeper);
    await registerGuKeeperFireflyCare(register, keeper);
    await registerGuKeeperStargate(register, keeper);
    await registerGuKeeperFixedImmortalTravel(register, keeper);
    await registerGuKeeperFixedForge(register, keeper);
    await registerGuKeeperAttitude(register, keeper);
    await registerGuKeeperAntNest(register, keeper);
    await registerGuKeeperBeamProcedure(register, keeper);
    await registerGuKeeperGoal(register, keeper);
    await registerGuKeeperFusion(register, keeper);
    await registerGuKeeperSpirit(register, keeper);
    await registerGuKeeperRainbow(register, keeper);
    await registerGuKeeperStargateSky(register, keeper);
    await registerGuKeeperPastMoonblade(register, keeper);
    await registerGuKeeperWildWorm(register, keeper);
    await registerGuKeeperWormEssence(register, keeper);
    await registerGuKeeperFourFlavors(register, keeper);
    await registerGuKeeperRedSteel(register, keeper);
    await registerGuKeeperSeven(register, keeper);
    await registerGuKeeperNine(register, keeper);
    await registerGuKeeperImmortalRefinement(register, keeper);
    await registerGuKeeperImmortalAdvancement(register, keeper);
    await registerGuKeeperImmortalReclamation(register, keeper);
    choices.register({packId:keeper.id,label:'Reverend Insanity · original Gu keeper, first year',
        arrival:'Begin an original adult clan-sponsored Gu keeper with an already-opened Rank-one aperture and a weekly stone stipend.',
        means:'Three primeval stones, eight essence, a free Moonlight Gu and two more Gu for sale. Feed each on its own schedule, take in only what you can pay for, and risk one refinement.'});
    const coordination = await register(guCoordinationTrial);
    choices.register({packId:coordination.id,label:'Reverend Insanity · Three Heads Six Arms rehearsal',
        arrival:'Rehearse the formation as Liu Wen Wu, with Ouyang Bi Sang and Mo Shi Kuang.',
        means:'Eighteen Gu and three separate essence reserves. Coordinate the draw and test the merged form at the weighted gate.'});
    const guLead = await register(guLeadLife);
    await registerGuLeadSelection(register, guLead);
    await registerGuLeadRefinement(register, guLead);
    await registerGuLeadVital(register, guLead);
    await registerGuLeadMoonblade(register, guLead);
    await registerGuLeadDorm(register, guLead);
    await registerGuLeadAssessment(register, guLead);
    await registerGuLeadConfrontation(register, guLead);
    await registerGuLeadClanResponse(register, guLead);
    await registerGuLeadCaravan(register, guLead);
    await registerGuLeadInheritance(register, guLead);
    await registerGuLeadMoonveil(register, guLead);
    await registerGuLeadHearing(register, guLead);
    await registerGuLeadSecondGu(register, guLead);
    await registerGuLeadLightPairing(register, guLead);
    await registerGuLeadEarlyDuel(register, guLead);
    await registerGuLeadHuntFollowthrough(register, guLead);
    await registerGuLeadExamResult(register, guLead);
    await registerGuLeadYearEnd(register, guLead);
    await registerGuLeadRankTwo(register, guLead);
    await registerGuLeadEstateClaim(register, guLead);
    await registerGuLeadWhiteJade(register, guLead);
    await registerGuLeadEstateHandover(register, guLead);
    await registerGuLeadQingShuMeeting(register, guLead);
    await registerGuLeadMoonglow(register, guLead);
    await registerGuLeadRelicMarket(register, guLead);
    await registerGuLeadStoneForest(register, guLead);
    await registerGuLeadRiverToad(register, guLead);
    await registerGuLeadWolfFront(register, guLead);
    await registerGuLeadAllianceSlope(register, guLead);
    await registerGuLeadEarGrass(register, guLead);
    await registerGuLeadIceSoul(register, guLead);
    await registerGuLeadIceCrystal(register, guLead);
    await registerGuLeadWoodCharm(register, guLead);
    await registerGuLeadWallNight(register, guLead);
    await registerGuLeadBurialGu(register, guLead);
    await registerGuLeadElderHall(register, guLead);
    await registerGuLeadSecretRoom(register, guLead);
    await registerGuLeadTusitaFlower(register, guLead);
    await registerGuLeadThunderCrown(register, guLead);
    await registerGuLeadLycan(register, guLead);
    await registerGuLeadInvestigator(register, guLead);
    choices.register({packId: guLead.id, label: 'Reverend Insanity · the returned clan youth',
        arrival: 'Begin in your guardians’ house on the morning of the Awakening Ceremony. You remember a life that everyone around you has yet to live.',
        means: 'Your clan name gives you a place at the ceremony. You have no opened aperture, primeval essence or Gu of your own.'});
    const company=await register(shadowCompanyLife);
    choices.register({packId:company.id,label:'Shadow Slave · original Shadowbound company',arrival:'Begin an original Woken life with an explicitly acquired Shadowbound fan-law binding and one already-owned shadow.',
        means:'An injured stored marsh-hound shadow, two gems and actual patrol supplies. Recovery and independent gem sleep feed a prepared two-person causeway patrol with Sera’s finite stipend.'});
}
