import {createContentRegistry} from "./expansion_engine.js";

const fact = (scope, key, value) => ({type: "fact", scope, key, value});
const resource = (scope, key, amount) => ({type: "resource", scope, key, amount});
const village = {fact: "location", op: "eq", value: "Village", reason: "Return to Village to begin."};
const unsurveyed = {fact: "actor.surveyed", op: "eq", value: false, reason: "You have already surveyed this route."};
const knownAnchor = {fact: "campaign.anchor", op: "eq", value: true, reason: "Inspect the crossing to learn its anchor points."};
const aftermath = {type: "opportunity", id: "frontier.departure", delay: 12, lifetime: 120, blocking: false};
const surveyed = [fact("actor", "surveyed", true), aftermath];

// Original review content, not an accepted campaign or a direct book adaptation.
export const expeditionRegistry = createContentRegistry({
    worlds: [{id: "base.frontier", label: "Mortal frontier", provenance: "Original Village prototype"}],
    opportunities: [{id: "frontier.departure", label: "The guide's next departure"}],
    actions: [
        {id: "frontier.inspect", worldId: "base.frontier", revision: 1, label: "Inspect the crossing",
            description: "Find anchor points before choosing how to survey the route.", completionScope: "actor",
            duration: 3, repeatable: false, requires: village, costs: [],
            outcomes: [{id: "learned", label: "Anchor points mapped", chance: 1,
                effects: [fact("campaign", "anchor", true)]}]},
        {id: "frontier.kit", worldId: "base.frontier", revision: 1, label: "Buy a prepared kit",
            description: "A purchased kit substitutes for making your own equipment. Costs 8 wooden coins.", completionScope: "actor",
            duration: 0, repeatable: true, requires: {all: [village, {fact: "kits", op: "lte", value: 0,
                reason: "You already have a kit."}, unsurveyed]}, costs: [{scope: "external", key: "money", amount: 8, label: "wooden coins"}],
            outcomes: [{id: "supplied", label: "Prepared kit acquired", chance: 1, effects: [resource("actor", "kits", 1)]}]},
        {id: "frontier.secure", worldId: "base.frontier", revision: 1, label: "Secure and survey the crossing",
            description: "Spend one kit and 8 minutes. A repaired crossing gives the guide an easier return.", completionScope: "actor",
            duration: 8, repeatable: false, requires: {all: [village, knownAnchor, unsurveyed]},
            costs: [{scope: "actor", key: "kits", amount: 1, label: "prepared kit"}],
            effects: [...surveyed, fact("world", "crossing", "repaired")],
            outcomes: [{id: "safe", label: "Route secured; guide ready", chance: 0.85,
                effects: [fact("world", "guide.condition", "ready"), resource("external", "money", 16)]},
            {id: "strained", label: "Route secured; guide needs rest", chance: 0.15,
                effects: [fact("world", "guide.condition", "tired"), resource("external", "money", 10)]}],
            modifiers: [{when: {fact: "climbing", op: "gte", value: 5}, label: "Climbing 5: 10% moves from strain to safe",
                transfers: [{from: "strained", to: "safe", amount: 0.1}]}]},
        {id: "frontier.extract", worldId: "base.frontier", revision: 1, label: "Scout the fast footpath",
            description: "Use strength instead of a kit. Takes 4 minutes and leaves the crossing unrepaired.", completionScope: "actor",
            duration: 4, repeatable: false, requires: {all: [village, knownAnchor, unsurveyed,
                {fact: "strength", op: "gte", value: 10, reason: "Needs 10 Strength to carry the route markers."}]}, costs: [],
            effects: [...surveyed, fact("world", "crossing", "unrepaired")],
            outcomes: [{id: "safe", label: "Footpath mapped; guide ready", chance: 0.6,
                effects: [fact("world", "guide.condition", "ready"), resource("external", "money", 10)]},
            {id: "strained", label: "Footpath mapped; guide needs rest", chance: 0.4,
                effects: [fact("world", "guide.condition", "tired"), resource("external", "money", 4)]}],
            modifiers: [{when: {fact: "strength", op: "gte", value: 12}, label: "Strength 12: 20% moves from strain to safe",
                transfers: [{from: "strained", to: "safe", amount: 0.2}]}]},
        {id: "frontier.depart", worldId: "base.frontier", revision: 2, label: "Join the guide's next departure",
            description: "A repaired crossing enables a supply delivery paying 18 wooden coins. Otherwise a ready guide pays 12; a tired guide pays 6 and takes longer.", completionScope: "actor",
            duration: 6, repeatable: false, opportunityId: "frontier.departure",
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
