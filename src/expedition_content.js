import {foundationInteractionSources} from './foundation_interaction_content.js';
import {crushSocialWorkPlans} from './crush_social_content.js';
import {factorioRetortPlanDefinitions} from './factorio_retort_content.js';
import {proto23Worlds} from './proto23_world_content.js';
import {worldCompletionSources} from './world_completion_content.js';
import {paradiseWorlds} from './book_world_paradise_content.js';
import {molWorlds} from './book_world_mol_content.js';
import {nestedWorlds} from './feature_expansion_nested_content.js';
import {backlogCapabilities} from './backlog_expansion_content.js';
import {TIDEMARK_WORLD} from './feature_expansion_destination.js';
import {societyWorkPlans} from './feature_expansion_society.js';
import {referenceGameplayWorkPlans} from './reference_gameplay_content.js';
import {auditedKitReservePlanDefinitions} from './audited_kit_reserve_content.js';
import {createWorkPlanRegistry} from './feature_expansion_work_plan.js';
import {initializeCampaignFacts} from "./frontier_campaign.js";
import {techniqueDefinitions, techniqueActions, ratStepRoute} from "./technique_content.js";
import {createContentRegistry} from "./expansion_engine.js";
import {archiveDutyAction} from "./chronicle.js";
import {villageActions, villageCapabilities, villageSources} from "./village_content.js";
import {simulationDefinitions, simulationSources} from "./simulation_content.js";
import {townActions, townSources, TOWN_FACTS} from "./town_content.js";
import {bodySources,bodyCapabilities} from "./body_progression.js";
import {fieldSources,initializeFieldFacts} from "./field_workshop.js";
import {systemsWorkshopDefinitions,systemsWorkshopSources} from './systems_workshop_content.js';

const fact = (scope, key, value) => ({type: "fact", scope, key, value});
const resource = (scope, key, amount) => ({type: "resource", scope, key, amount});
export const SURVEY_KIT_KEY = JSON.stringify({id: "Prepared survey kit"});
export const SURVEY_ROPE_KEY = JSON.stringify({id: "Survey rope"});
const item = (key, amount, label) => ({type: "item", key, amount, label});
const xp = amount => ({type: "xp", skill: "Climbing", amount});
const capable = (name, amount = 1, reason) => ({fact: `capability.${name}`, op: "gte", value: amount, reason});
const village = {fact: "location", op: "eq", value: "Village", reason: "Return to Village to begin."};
const unsurveyed = {fact: "actor.surveyed", op: "eq", value: false, reason: "You have already surveyed this route."};
const knownAnchor = {fact: "campaign.anchor", op: "eq", value: true, reason: "Inspect the crossing to learn its anchor points."};
const aftermath = {type: "opportunity", id: "frontier.departure", delay: 12, lifetime: 120, blocking: false};
const surveyed = [fact("actor", "surveyed", true), aftermath];

// Original review content, not an accepted campaign or a direct book adaptation.
export const expeditionRegistry = createContentRegistry({
    simulation: {
        ...simulationDefinitions,
        situations:[...simulationDefinitions.situations,...systemsWorkshopDefinitions.situations],
        people:[...simulationDefinitions.people,...systemsWorkshopDefinitions.people],
        controllers:[...simulationDefinitions.controllers,...systemsWorkshopDefinitions.controllers],
        commands:[...simulationDefinitions.commands,...systemsWorkshopDefinitions.commands],
    },
    worlds: [...proto23Worlds,...molWorlds,...paradiseWorlds,...nestedWorlds,TIDEMARK_WORLD,{id:"pocket.folded_glasshouse",label:"Folded Glasshouse",publicName:"Folded Glasshouse",continuityLabel:"Original contained workshop",provenance:"Original optional persistent pocket prototype; native isolation checks deferred."},{id: "base.frontier", label: "YAIRPG: Parallel Frontier", publicName: "Frontier", continuity: "branch", sourceWorld: "YAIRPG",
        continuityLabel: "YAIRPG · Branch dimension",
        provenance: "Alternate continuity derived from Miktaew's YAIRPG. Expanded fork content belongs to this dimension; the original continuity remains the reference."}],
    techniques: techniqueDefinitions,
    capabilities: [...backlogCapabilities,
        ...villageCapabilities,
        ...bodyCapabilities,
        {id: "frontier.carry", label: "Carry route markers", stacking: "max", providers: [
            {id: "strength.basic", kind: "skill", label: "Strength 10", amount: 1,
                when: {fact: "strength", op: "gte", value: 10}},
            {id: "strength.practiced", kind: "skill", label: "Strength 12", amount: 2,
                when: {fact: "strength", op: "gte", value: 12}}]},
        {id: "frontier.anchors", label: "Reusable anchor technique", stacking: "max", providers: [
            {id: "equipment.survey_rope", kind: "equipment", label: "Carried survey rope", amount: 1,
                when: {fact: "rope", op: "gte", value: 1}},
            {id: "skill.climbing", kind: "skill", label: "Climbing 5: practiced anchors", amount: 1,
                when: {fact: "climbing", op: "gte", value: 5}}]},
        {id: "frontier.preparation", label: "Route preparation", stacking: "sum", providers: [
            {id: "knowledge.route_signals", kind: "knowledge", label: "Cartographer's route signals", amount: 1,
                when: {fact: "chronicle.routeSignals", op: "eq", value: true}},
            {id: "skill.climbing_preparation", kind: "skill", label: "Climbing 5", amount: 1,
                when: {fact: "climbing", op: "gte", value: 5}}]},
    ],
    sources: [...foundationInteractionSources,...worldCompletionSources,...villageSources, ...simulationSources, ...systemsWorkshopSources, ...townSources, ...bodySources, ...fieldSources, {id: "frontier.field_eye", label: "Field eye", kind: "trait", revision: 1,
        description: "An earned knack for reading routes. Adds one route preparation source.",
        grants: [{capability: "frontier.preparation", amount: 1}]}],
    rollTables: [{id: "frontier.observation", label: "Inspection discovery", revision: 1,
        outcomes: [{id: "ordinary", label: "Anchor notes recorded", weight: 4, effects: []},
            {id: "field_eye", label: "Discovered Field eye: +1 route preparation", weight: 1,
                effects: [{type: "source", sourceId: "frontier.field_eye", operation: "grant"}]}]}],
    opportunities: [{id: "frontier.departure", label: "The guide's next departure"}],
    actions: [...techniqueActions, ratStepRoute, archiveDutyAction, ...villageActions, ...townActions,
        {id: "frontier.inspect", worldId: "base.frontier", revision: 2, label: "Inspect the crossing",
            description: "Look for firm anchor points. Earn 12 Perception XP; you may notice something else along the bank.", completionScope: "actor",
            duration: 3, repeatable: false, requires: village, costs: [],
            rolls: [{id: "observation", tableId: "frontier.observation"}],
            outcomes: [{id: "learned", label: "Anchor points mapped", chance: 1,
                effects: [fact("campaign", "anchor", true), {type: "xp", skill: "Perception", amount: 12}]}]},
        {id: "frontier.kit", worldId: "base.frontier", revision: 2, label: "Buy a prepared kit",
            description: "Costs 8 wooden coins. Adds a real Prepared survey kit to your inventory.", completionScope: "actor",
            duration: 0, repeatable: true, requires: {all: [village, {fact: "kits", op: "lte", value: 0,
                reason: "You already have a kit."}, unsurveyed]}, costs: [{scope: "external", key: "money", amount: 8, label: "wooden coins"}],
            outcomes: [{id: "supplied", label: "Prepared kit added to inventory", chance: 1, effects: [item(SURVEY_KIT_KEY, 1, "prepared kit")]}]},
        {id: "frontier.rope", worldId: "base.frontier", revision: 1, label: "Buy a reusable survey rope",
            description: "Costs 16 wooden coins. Carry this rope to use the reusable anchor route; it is not consumed.", completionScope: "actor",
            duration: 0, repeatable: true, requires: {all: [village, unsurveyed, {fact: "rope", op: "lte", value: 0, reason: "You already carry a survey rope."}]},
            costs: [{scope: "external", key: "money", amount: 16, label: "wooden coins"}],
            outcomes: [{id: "supplied", label: "Reusable survey rope added to inventory", chance: 1, effects: [item(SURVEY_ROPE_KEY, 1, "survey rope")]}]},
        {id: "frontier.pack", worldId: "base.frontier", revision: 2, label: "Have a survey kit packed",
            description: "The Village supplier packs markers and crossing supplies from your notes. Costs 6 wooden coins and 4 minutes; earns one kit and 4 Climbing XP. Cancelling forfeits the fee.", completionScope: "actor",
            duration: 4, repeatable: true, cancellation: "forfeit",
            durationModifiers: [{when: capable("village.packing"), minutes: 2, label: "Craftsman's lesson: pack in 2 minutes"},
                {when:capable("body.hand_control"),minutes:1,operation:"subtract",label:"Conditioned grip: 1 minute quicker"},
                {when: {fact:"body.handsTender",op:"eq",value:true}, minutes:2, operation:"add", label:"Tender hands: 2 more minutes"}],
            requires: {all: [village, knownAnchor, unsurveyed, {fact: "kits", op: "eq", value: 0, reason: "You already carry a kit."}]},
            costs: [{scope: "external", key: "money", amount: 6, label: "wooden coins"}],
            outcomes: [{id: "packed", label: "Survey kit packed from your field notes", chance: 1,
                effects: [item(SURVEY_KIT_KEY, 1, "prepared kit"), xp(4)]}]},
        {id: "frontier.secure", worldId: "base.frontier", revision: 2, label: "Secure and survey the crossing",
            description: "Consume one inventory kit at commitment. Takes 8 minutes, repairs the crossing and grants 60 Climbing XP. Cancelling forfeits the kit.", completionScope: "actor",
            cancellation: "forfeit",
            duration: 8, repeatable: false, requires: {all: [village, knownAnchor, unsurveyed]},
            costs: [item(SURVEY_KIT_KEY, 1, "prepared kit")],
            effects: [...surveyed, fact("world", "crossing", "repaired"), xp(60)],
            outcomes: [{id: "safe", label: "Route secured; guide ready", chance: 0.85,
                effects: [fact("world", "guide.condition", "ready"), resource("external", "money", 16)]},
            {id: "strained", label: "Route secured; guide needs rest", chance: 0.15,
                effects: [fact("world", "guide.condition", "tired"), resource("external", "money", 10)]}],
            modifiers: [{when: capable("frontier.preparation"), label: "Route preparation: 10% moves from strain to safe",
                transfers: [{from: "strained", to: "safe", amount: 0.1}]}]},
        {id: "frontier.anchor_route", worldId: "base.frontier", revision: 1, label: "Survey with reusable anchors",
            description: "Use a carried rope or Climbing 5. Takes 12 minutes, repairs the crossing and grants 50 Climbing XP. Keeps your rope.", completionScope: "actor",
            duration: 12, repeatable: false, requires: {all: [village, knownAnchor, unsurveyed,
                capable("frontier.anchors", 1, "Carry a Survey rope or reach Climbing 5.")]}, costs: [],
            effects: [...surveyed, fact("world", "crossing", "repaired"), xp(50)],
            outcomes: [{id: "safe", label: "Reusable anchors held; guide ready", chance: 0.65,
                effects: [fact("world", "guide.condition", "ready"), resource("external", "money", 12)]},
            {id: "strained", label: "Crossing repaired; guide needs rest", chance: 0.35,
                effects: [fact("world", "guide.condition", "tired"), resource("external", "money", 8)]}],
            modifiers: [{when: capable("frontier.preparation"), label: "Route preparation: 10% moves from strain to safe",
                transfers: [{from: "strained", to: "safe", amount: 0.1}]}]},
        {id: "frontier.extract", worldId: "base.frontier", revision: 2, label: "Scout the fast footpath",
            description: "Use marker-carrying capability instead of supplies. Takes 4 minutes, grants 20 Climbing XP and leaves the crossing unrepaired.", completionScope: "actor",
            duration: 4, repeatable: false, requires: {all: [village, knownAnchor, unsurveyed,
                capable("frontier.carry", 1, "Needs Strength 10 or another marker-carrying source.")]}, costs: [],
            effects: [...surveyed, fact("world", "crossing", "unrepaired"), xp(20)],
            outcomes: [{id: "safe", label: "Footpath mapped; guide ready", chance: 0.6,
                effects: [fact("world", "guide.condition", "ready"), resource("external", "money", 10)]},
            {id: "strained", label: "Footpath mapped; guide needs rest", chance: 0.4,
                effects: [fact("world", "guide.condition", "tired"), resource("external", "money", 4)]}],
            modifiers: [{when: capable("frontier.carry", 2), label: "Strong marker carrying: 20% moves from strain to safe",
                transfers: [{from: "strained", to: "safe", amount: 0.2}]},
            {when: capable("frontier.preparation"), label: "Route preparation: 10% moves from strain to safe",
                transfers: [{from: "strained", to: "safe", amount: 0.1}]}]},
        {id: "frontier.depart", worldId: "base.frontier", revision: 3, label: "Join the guide's next departure",
            description: "Earn 1 Village reputation. A repaired crossing pays 18 wooden coins; otherwise a ready guide pays 12, or a tired guide pays 6 and takes longer.", completionScope: "actor",
            duration: 6, repeatable: false, opportunityId: "frontier.departure",
            effects: [{type: "reputation", region: "Village", amount: 1}],
            visibleWhen: {fact: "actor.surveyed", op: "eq", value: true}, requires: village, costs: [],
            outcomes: [{id: "escort", label: "Slower escort completed", chance: 1, effects: [resource("external", "money", 6)]},
            {id: "guided", label: "Guide opened a quick return route", chance: 0, effects: [resource("external", "money", 12),
                fact("campaign", "return_route", true)]},
            {id: "delivery", label: "Supplies delivered over the repaired crossing", chance: 0,
                effects: [resource("external", "money", 18), fact("campaign", "return_route", true)]}],
            durationModifiers: [{when: {fact: "world.guide.condition", op: "eq", value: "ready"}, minutes: 3,
                label: "Ready guide: return takes 3 minutes instead of 6"}],
            modifiers: [{when: {fact: "world.guide.condition", op: "eq", value: "ready"}, label: "The guide is ready: quick return guaranteed",
                transfers: [{from: "escort", to: "guided", amount: 1}]},
            {when: {fact: "world.crossing", op: "eq", value: "repaired"}, label: "Repaired crossing: supply delivery pays 18 wooden coins",
                transfers: [{from: "escort", to: "delivery", amount: 1}, {from: "guided", to: "delivery", amount: 1}]}]},
    ],
});

export function initializeExpedition(state) {
    // Additive content migration for the first engine schema. Never replay rewards.
    state.actors.player.facts.surveyed ??= false;
    for(const key of ["village.discovered", "village.tokenReturned", "village.board", "village.routeKnown", "village.chalkRead"]) state.actors.player.facts[key] ??= false;
    for(const key of TOWN_FACTS) state.actors.player.facts[key] ??= false;
    state.actors.player.facts["body.enrolled"] ??= false;
    return initializeCampaignFacts(initializeFieldFacts(state));
}

expeditionRegistry.workPlans=createWorkPlanRegistry([...societyWorkPlans,...referenceGameplayWorkPlans,...auditedKitReservePlanDefinitions,...crushSocialWorkPlans,...factorioRetortPlanDefinitions],expeditionRegistry.simulation);
