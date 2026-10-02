import {createContentRegistry} from "./expansion_engine.js";

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
    worlds: [{id: "base.frontier", label: "Mortal frontier", provenance: "Original Village prototype"}],
    capabilities: [
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
            {id: "skill.climbing_preparation", kind: "skill", label: "Climbing 5", amount: 1,
                when: {fact: "climbing", op: "gte", value: 5}}]},
    ],
    sources: [{id: "frontier.field_eye", label: "Field eye", kind: "trait", revision: 1,
        description: "An earned knack for reading routes. Adds one route preparation source.",
        grants: [{capability: "frontier.preparation", amount: 1}]}],
    rollTables: [{id: "frontier.observation", label: "Inspection discovery", revision: 1,
        outcomes: [{id: "ordinary", label: "Anchor notes recorded", weight: 4, effects: []},
            {id: "field_eye", label: "Discovered Field eye: +1 route preparation", weight: 1,
                effects: [{type: "source", sourceId: "frontier.field_eye", operation: "grant"}]}]}],
    opportunities: [{id: "frontier.departure", label: "The guide's next departure"}],
    actions: [
        {id: "frontier.inspect", worldId: "base.frontier", revision: 2, label: "Inspect the crossing",
            description: "Find anchor points and earn 12 Perception XP. A 20% discovery can earn Field eye, improving later survey odds.", completionScope: "actor",
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
    return state;
}
