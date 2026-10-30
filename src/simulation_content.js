import {cohortDefinitions} from './cohort_battle_content.js';
import {eqRawReason as requires} from './basics.js';
import {storyAftermathDefinitions} from './story_aftermath.js';
import {storyletDefinitions} from './storylet_content.js';
import {foundationInteractionDefinitions} from './foundation_interaction_content.js';
import {steamAbsorptionDefinitions} from './steam_absorption_content.js';
import {CONTEXTUAL_BALM_DEFINITIONS} from './contextual_balm_content.js';
import {coolingRefinementDefinitions} from './cooling_refinement_content.js';
import {agreedDutyDefinitions,agreedDutyFollowupDefinitions,agreedDutyController} from './agreed_duty_content.js';
import {gameAbsorptionAssayDefinitions} from './game_absorption_assay_content.js';
import {homeFurnishingDefinitions} from './home_furnishing_content.js';
import {factorioRetortDefinitions} from './factorio_retort_content.js';
import {proto23Definitions} from './proto23_world_content.js';
import {crushSocialDefinitions} from './crush_social_content.js';
import {paradiseCampaignDefinitions,paradiseCampaignSources} from './book_world_paradise_campaign_content.js';
import {worldCompletionDefinitions} from './world_completion_content.js';
import {lorePracticeDefinitions} from './lore_practice_content.js';
import {bookCareDefinitions} from './book_care_content.js';
import {fieldCareDefinitions} from './field_care_content.js';
import {statusCareDefinitions} from './status_care_content.js';
import {paradiseDefinitions,paradiseSources,molDefinitions,molSources,lotmDefinitions,lotmSources} from './book_world_definitions.js';
import {nestedLifeDefinitions} from './feature_expansion_nested_life.js';
import {relayDefinitions} from './feature_expansion_subtlety_scene.js';
import {referenceDeskDefinitions} from './feature_expansion_reference_desk.js';
import {nestedDefinitions,nestedSources} from './feature_expansion_nested_content.js';
import {nestedChainDefinitions,nestedChainSources} from './feature_expansion_nested_chains.js';
import {inkRelayDefinitions,inkNestedDefinitions} from './ink_scene_content.js';
import {backlogSimulationDefinitions,backlogSources} from './backlog_expansion_content.js';
import {repositoryAbsorptionDefinitions,repositoryAbsorptionSources} from './repository_absorption_content.js';
import {inkSceneDefinitions} from './ink_scene_content.js';
import {featureExpansionDefinitions,featureExpansionSources} from './feature_expansion_content.js';
import {pocketSimulationDefinitions} from './pocket_realm_host.js';
import {skillDefinitions,skillSources} from './skill_expansion_content.js';
import {originalFrontierDefinitions,originalFrontierSources} from './original_frontier_campaign_content.js';
import {pocketObservationSources} from './pocket_observation.js';
import {observationDefinitions,observationSources} from "./observation_content.js";
import {promiseDefinitions,promiseSources} from "./promise_content.js";
import {partyDefinitions,partySources} from "./party_content.js";
import {exchangeDefinitions} from "./exchange_content.js";
import {campaignDefinitions,campaignSources} from "./frontier_campaign.js";
import {moodConditions, socialCommands} from "./everyday_life.js";
import {helperDefinitions} from "./helper_content.js";
import {bodyConditions, bodyCommands} from "./body_progression.js";
import {fieldDefinitions} from "./field_workshop.js";
import {fieldWorksDefinitions} from './field_works_content.js';
import {pursuitDefinitions,pursuitSources} from "./pursuit_content.js";
import {encounterDefinitions,encounterSources} from "./encounter_content.js";
const wood = JSON.stringify({id: "Rough wood log"});
const kit = JSON.stringify({id: "Prepared survey kit"});
const fact = (key, value) => ({type: "fact", scope: "actor", key, value});
const resource = (key, amount) => ({type: "resource", key, amount});
const money = amount => ({...resource("money", amount), native: true});
const command = d => ({revision: 1, worldId: "base.frontier", actorId: "player", location: "Village", costs: [], effects: [], ...d});
const met = requires("village.craftsmanMet", true, "Help with the rats, then meet the old craftsman through the elder.");

// Original, reversible proof content. These are ordinary Village services, not
// an adopted cast, a book adaptation, a second world or an automatic prestige.
export const simulationSources = [...paradiseCampaignSources,...molSources,...lotmSources,...paradiseSources,...nestedSources,...nestedChainSources,...backlogSources,...repositoryAbsorptionSources,...featureExpansionSources,...originalFrontierSources,...skillSources,...pocketObservationSources,...observationSources,...partySources,...promiseSources,...campaignSources,...pursuitSources,...encounterSources,{id: "frontier.measured_work", revision: 1, label: "Measured work", kind: "knowledge",
    grants: [{capability: "frontier.preparation", amount: 1, when: requires("actor.sim.measured", true)}]}];
export const simulationDefinitions = {
    situations:[...fieldDefinitions.situations,...lotmDefinitions.situations,...(paradiseCampaignDefinitions.situations||[]),...(molDefinitions.situations||[]),...(paradiseDefinitions.situations||[]),...originalFrontierDefinitions.situations,...pocketSimulationDefinitions.situations,...observationDefinitions.situations,...promiseDefinitions.situations,...exchangeDefinitions.situations],
    onEnroll: [{type: "world", worldId: "base.frontier", key: "workbench.wet", value: false}],
    people: [...(paradiseCampaignDefinitions.people||[]),...cohortDefinitions.people,...(molDefinitions.people||[]),...lotmDefinitions.people,...(paradiseDefinitions.people||[]),...originalFrontierDefinitions.people,...pocketSimulationDefinitions.people,...observationDefinitions.people,...exchangeDefinitions.people,...partyDefinitions.people,...promiseDefinitions.people,{id: "oldCraftsman", revision: 1, label: "Old craftsman", worldId: "base.frontier", location: "Village", inventory: "native", traits:["forgiving"], temperamentReason:"Practical restitution lets him return to his work.", resources: {focus: 3}}, ...campaignDefinitions.people,...helperDefinitions.people,...fieldDefinitions.people,...pursuitDefinitions.people,...encounterDefinitions.people],
    pursuits:[...campaignDefinitions.pursuits,...pursuitDefinitions.pursuits,...encounterDefinitions.pursuits],
    energies:[...(molDefinitions.energies||[]),...lotmDefinitions.energies,...fieldDefinitions.energies],
    sites: [...paradiseCampaignDefinitions.sites,...(molDefinitions.sites||[]),...lotmDefinitions.sites,...(paradiseDefinitions.sites||[]),...originalFrontierDefinitions.sites,...pocketSimulationDefinitions.sites,{id: "village.workbench", revision: 1, label: "Craftsman's workbench", capacity: 1},...fieldDefinitions.sites],
    conditions: [...paradiseCampaignDefinitions.conditions,...lotmDefinitions.conditions,...(molDefinitions.conditions||[]),...fieldCareDefinitions.conditions,...statusCareDefinitions.conditions, ...moodConditions, ...bodyConditions, {id: "soaked", revision: 1, label: "Soaked supplies", stacking: "max"}],
    powers: [...campaignDefinitions.powers,...paradiseCampaignDefinitions.powers,...(molDefinitions.powers||[]),...lotmDefinitions.powers,...(paradiseDefinitions.powers||[]),...originalFrontierDefinitions.powers,...skillDefinitions.powers,...pocketSimulationDefinitions.powers,...observationDefinitions.powers,{id: "frontier.measured_pack", revision: 1, label: "Measured packing", model: "practice", capacity: 1, cooldown: 2,
        execution: requires("knowledge.workbench.understood", true, "Learn the craftsman's packing notes first.")},...fieldDefinitions.powers],
    advancements: [{id: "frontier.measurement", revision: 1, label: "Understand the workbench method", track: "craft", branch: "measurement",
        requires: requires("knowledge.workbench.seen", true), costs: [money(-1)],
        effects: [{type: "knowledge", key: "workbench", stage: "understood", value: "A kit needs sound wood, counted fittings and a dry layout."},
            {type: "power", powerId: "frontier.measured_pack", operation: "learn"},
            {type: "source", sourceId: "frontier.measured_work", operation: "grant", awakened: true, active: true}, fact("sim.measured", true)]}],
    encounters: [...cohortDefinitions.encounters,...paradiseCampaignDefinitions.encounters,...(molDefinitions.encounters||[]),...originalFrontierDefinitions.encounters,...skillDefinitions.encounters,...campaignDefinitions.encounters,...helperDefinitions.encounters,...fieldDefinitions.encounters,...pursuitDefinitions.encounters,...encounterDefinitions.encounters],
    commands: [...cohortDefinitions.commands,...paradiseCampaignDefinitions.commands,...(molDefinitions.commands||[]),...lotmDefinitions.commands,...fieldCareDefinitions.commands,...statusCareDefinitions.commands,...(paradiseDefinitions.commands||[]),...originalFrontierDefinitions.commands,...skillDefinitions.commands,...pocketSimulationDefinitions.commands,...observationDefinitions.commands,...exchangeDefinitions.commands,...partyDefinitions.commands,...promiseDefinitions.commands,...campaignDefinitions.commands,
        ...pursuitDefinitions.commands,
        ...encounterDefinitions.commands,
        ...fieldDefinitions.commands,
        ...helperDefinitions.commands,
        ...socialCommands,
        ...bodyCommands,
        command({id: "village.commission", label: "Commission a kit · 2 logs + 1 coin", targetId: "oldCraftsman", coLocated: true, requires: met,
            claim: "village.first_commission", costs: [{type: "transfer", from: "$actor", to: "$target", key: wood, count: 2}, money(-1)],
            effects: [fact("sim.commissioned", true), {...fact("work.order", true), actor: "$target"},
                {type: "knowledge", key: "workbench", stage: "seen", value: "The craftsman has your wood and will work when his bench is free."},
                {type: "relationship", actor: "$target", target: "$actor", axis: "trust", amount: 1, text: "Supplied the agreed materials."}]}),
        command({id: "village.craftsman_work", actorId: "oldCraftsman", label: "Craftsman packs the commissioned kit", siteId: "village.workbench", duration: 5,
            requires: requires("actor.work.order", true), costs: [{type: "item", key: wood, amount: -2}],
            effects: [{type: "item", key: kit, amount: 1}, fact("work.order", false), fact("work.ready", true)]}),
        command({id: "village.collect", label: "Collect the finished commissioned kit", targetId: "oldCraftsman", coLocated: true, once: true,
            requires: requires("actor.sim.commissioned", true, "Commission the craftsman first."),
            costs: [{type: "transfer", from: "$target", to: "$actor", key: kit, count: 1}],
            effects: [{type: "knowledge", key: "workbench", stage: "interpreted", value: "Good preparation is a method, not a mysterious pile of bonuses."},
                {...fact("work.ready", false), actor: "$target"}]}),
        command({id: "village.measured_pack", label: "Pack carefully · 1 log + 2 coins · 3 min", location: "Shack", powerId: "frontier.measured_pack", duration: 3,
            requires: {all: [requires("village.shackUnlocked", true), requires("world.workbench.wet", false, "Wait for the bench to dry, or cover it through the shower report.")]}, automatable: true, cancellation: "refund",
            costs: [{type: "item", key: wood, amount: -1}, money(-2)], effects: [{type: "item", key: kit, amount: 1}, resource("practice", 1)]}),
        command({id: "village.study_method", label: "Learn measured packing · 1 coin", requires: {all: [met, requires("knowledge.workbench.seen", true)]}, once: true,
            costs: [money(-1)], effects: [{type: "knowledge", key: "workbench", stage: "understood", value: "Sound wood and counted fittings make a repeatable kit."},
                {type: "power", powerId: "frontier.measured_pack", operation: "learn"}, fact("sim.measured", true),
                {type: "source", sourceId: "frontier.measured_work", operation: "grant", awakened: true, active: true}]})
    ],
    transitions:campaignDefinitions.transitions,
    controllers: [...paradiseCampaignDefinitions.controllers,...(molDefinitions.controllers||[]),...(paradiseDefinitions.controllers||[]),...originalFrontierDefinitions.controllers,...pocketSimulationDefinitions.controllers,...exchangeDefinitions.controllers,...promiseDefinitions.controllers,{id: "village.craftsman_controller", revision: 1, label: "Craftsman's work plan", actorId: "oldCraftsman", interval: 1,
        actions: [{commandId:"field.workshop.parts",priority:2,when:requires("actor.field.partsOrder",true)}, {commandId: "village.craftsman_work", priority: 1, when: requires("actor.work.order", true)}]}, ...helperDefinitions.controllers,...fieldDefinitions.controllers],
    events: [...observationDefinitions.events,{id: "village.shower", revision: 1, label: "A short shower reaches the Village workbench", automatic: true, public: true, interval: 12,
        maxOccurrences: 1, chance: 1, lifetime: 8, mode: "offer", effects: [{type: "world", worldId: "base.frontier", key: "workbench.wet", value: true}],
        responses: [{id: "cover", label: "Cover the bench · 1 coin", costs: [money(-1)], effects: [{type: "world", worldId: "base.frontier", key: "workbench.wet", value: false},
            {type: "relationship", target: "oldCraftsman", axis: "respect", amount: 1, text: "Covered the bench during the shower."}]},
        {id: "wait", label: "Let it dry naturally", effects: [{type: "world", worldId: "base.frontier", key: "workbench.wet", value: false}]}],
        onExpire: [{type: "world", worldId: "base.frontier", key: "workbench.wet", value: false},
            {type: "knowledge", key: "missed.shower", stage: "seen", value: "The shower passed; the craftsman dried his bench. No missed reward is owed."}]}, ...helperDefinitions.events,...fieldDefinitions.events,...encounterDefinitions.events]
};

// Directly selected opt-in families. Registration itself provisions nothing.
for(const family of [homeFurnishingDefinitions,crushSocialDefinitions,factorioRetortDefinitions,proto23Definitions,fieldWorksDefinitions])for(const [key,rows] of Object.entries(family)){simulationDefinitions[key] ||= [];simulationDefinitions[key].push(...rows);}
for(const [key,rows] of Object.entries(featureExpansionDefinitions)) {simulationDefinitions[key] ||= [];simulationDefinitions[key].push(...rows);}

for(const family of [worldCompletionDefinitions,lorePracticeDefinitions,bookCareDefinitions,backlogSimulationDefinitions,repositoryAbsorptionDefinitions,inkSceneDefinitions,inkRelayDefinitions,inkNestedDefinitions,relayDefinitions,referenceDeskDefinitions,nestedDefinitions,nestedChainDefinitions,nestedLifeDefinitions])for(const [key,rows] of Object.entries(family)){simulationDefinitions[key] ||= [];simulationDefinitions[key].push(...rows);}

simulationDefinitions.commands.push(...gameAbsorptionAssayDefinitions.commands);

simulationDefinitions.commands.push(...CONTEXTUAL_BALM_DEFINITIONS.commands,...coolingRefinementDefinitions.commands,...agreedDutyDefinitions.commands,...agreedDutyFollowupDefinitions.commands);
simulationDefinitions.controllers=simulationDefinitions.controllers.map(agreedDutyController);
for(const [key,rows] of Object.entries(steamAbsorptionDefinitions)) {
    simulationDefinitions[key] ||= [];
    simulationDefinitions[key].push(...rows);
}

// Optional original arena definitions do not provision actors on enrollment.
for(const [key,rows]of Object.entries(foundationInteractionDefinitions))simulationDefinitions[key]=[...(simulationDefinitions[key]||[]),...rows];

// P3: registered cards draw only after the player begins Village encounters.
for(const [key,rows] of Object.entries({people:storyletDefinitions.people,commands:storyletDefinitions.commands,events:[...storyletDefinitions.events,...storyAftermathDefinitions.events]}))simulationDefinitions[key]=[...(simulationDefinitions[key]||[]),...rows];
