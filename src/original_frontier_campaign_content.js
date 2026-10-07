import {originalFrontierCareerDefinitions,originalFrontierCareerSources} from './original_frontier_career_content.js';
import {originalFrontierFieldDefinitions,originalFrontierFieldSources} from './original_frontier_field_content.js';
// Original Frontier proposal content. Registration never enrolls actors;
// the explicit native meeting publishes enrollment and opening together.
export const ORIGINAL_FRONTIER_IDS = Object.freeze({
    world: "base.frontier", situation: "original_frontier.short_measure",
    dispatcher: "original_frontier.mira", receiver: "original_frontier.wen",
    method: "original_frontier.load_tally", villageSite: "original_frontier.reserve_desk",
    townSite: "original_frontier.receiving_desk", begin: "original_frontier.begin",
});
const ids = ORIGINAL_FRONTIER_IDS;
const wood = JSON.stringify({id: "Rough wood log"});
const prefix = "original_frontier.freight";
const eq = (fact, value = true, reason) => ({fact, op: "eq", value, ...(reason ? {reason} : {})});
const gte = (fact, value) => ({fact, op: "gte", value});
const all = (...rules) => ({all: rules});
const any = (...rules) => ({any: rules});
const phase = value => eq(`situation.${ids.situation}.phase`, value);
const route = value => eq(`world.${prefix}.route`, value);
const af = (key, value = true, actor = "player") => ({type: "fact", scope: "actor", actor, key: `${prefix}.${key}`, value});
const wf = (key, value = true) => ({type: "world", worldId: ids.world, key: `${prefix}.${key}`, value});
const shift = (from, to) => ({type: "situation", situationId: ids.situation, operation: "advance", expected: Array.isArray(from) ? from : [from], phase: to});
const coins = (actor, amount) => ({type: "resource", actor, key: "coins", amount});
const pay = amount => ({type: "resource", actor: "player", native: true, key: "money", amount});
const know = (key, value, actor = "player", kind = "observation", attributedTo = ids.dispatcher) => ({
    type: "knowledge", actor, key: `${prefix}.${key}`, stage: kind === "instruction" ? "understood" : "seen", value,
    basis: {kind, attributedTo, situationId: ids.situation},
});
const memory = (actor, text, amount = 1) => ({type: "relationship", actor, target: "player", axis: "trust", amount, text});
const command = values => ({revision: 2, worldId: ids.world, group: "original_frontier", actorId: "player", location: "Village", costs: [], effects: [], ...values});
const npc = values => command({actorId: ids.dispatcher, audience: ["$actor"], ...values});
const open = all(phase("posted"), eq(`situation.${ids.situation}.responseOpen`));
const introduced = eq(`actor.${prefix}.introduced`);
const workable = all(eq(`faculty.${ids.method}.active`), eq(`knowledge.${prefix}.method.understood`), gte("vital.health", 2));
const accepted = eq(`world.${prefix}.accepted`);
const approach = (id, label, duration, wage, costs, selected, text) => command({
    id: `original_frontier.${id}`, label, duration, cancellation: "refund", claim: `${prefix}.choice`,
    targetId: ids.dispatcher, coLocated: true, participants: ["$target"], siteId: ids.villageSite,
    visibleWhen: phase("posted"), requires: open,
    description: `${text} Mira reserves ${wage} coins from her own purse. Cancellation returns every reserved input and pays nothing.`,
    completionCoLocated: true, completionFailure: "refund",
    costs: [...costs, {type: "item", actor: ids.dispatcher, key: wood, amount: -(selected === "audit" ? 3 : 4)}, coins(ids.dispatcher, -wage)],
    effects: [{type: "item", actor: ids.dispatcher, key: wood, amount: selected === "audit" ? 3 : 4}, pay(wage), wf("route", selected), af("acceptedWork"), af("approach", selected), shift("posted", "ready"),
        know("decision", text), know("decision", text, ids.dispatcher), memory(ids.dispatcher, text),
        {type: "xp", skill: "Perception", amount: selected === "audit" ? 6 : 3}],
});

const episodeSources = [{id: ids.method, revision: 1, label: "Practiced load tally", kind: "technique", origin: "trained",
    bioDetail: "You practiced matching a physical load to an agreed order and a retained reserve.", grants: []}];

const episodeDefinitions = {
    encounters: [],
    // Both templates are explicit opt-ins. Existing native NPCs keep their owners.
    people: [
        {id: ids.dispatcher, revision: 1, label: "Mira, parcel dispatcher", worldId: ids.world, location: "Village", inventory: "simulation", provision: false,
            resources: {coins: 10, reserveOrders: 1}, body: {hands: 2}, vitals: {health: 20, max_health: 20, stamina: 12, max_stamina: 12}},
        {id: ids.receiver, revision: 1, label: "Wen, depot receiver", worldId: ids.world, location: "Town square", inventory: "simulation", provision: false,
            resources: {coins: 4, acceptanceOrders: 1}, body: {hands: 2}, vitals: {health: 20, max_health: 20, stamina: 8, max_stamina: 8}},
    ],
    sites: [
        {id: ids.villageSite, revision: 1, label: "Village parcel reserve desk", capacity: 1},
        {id: ids.townSite, revision: 1, label: "Town depot receiving desk", capacity: 1},
    ],
    powers: [{id: ids.method, revision: 1, label: "Load tally", model: "practice", capacity: 1, execution: workable}],
    situations: [{id: ids.situation, revision: 1, label: "Short Measure",
        context: {worldId: ids.world, instanceId: "frontier.main", continuityId: "frontier.branch", eraId: "frontier.present", regionId: "frontier.village"},
        privateTruth: {cause: "reserve_counted_twice_on_dispatch_slip", originalLogs: 3, promisedTownLogs: 3, promisedReserve: 1},
        participants: ["player", ids.dispatcher, ids.receiver], initialPhase: "posted", responseWindow: 12,
        phases: ["posted", "declined", "deferred", "ready", "out_forest", "out_gate", "out_town", "delivered", "accepted", "back_gate", "back_forest", "returned"]}],
    commands: [
        command({id: ids.begin, label: "Ask about the parcel tally", once: true, claim: `${prefix}.opening`,
            visibleWhen: all(eq("village.elderMet"), eq("originalFrontier.townAccessible")),
            requires: all(eq("village.elderMet"), eq("originalFrontier.townAccessible", true, "Earn ordinary Town square access first.")),
            description: "Optional work after the familiar opening and Town access. Mira has three logs; the slip promises three to Town and one local reserve. You make no promise by asking. Reply within twelve played minutes, or she handles her own order.",
            effects: [{type: "spawn", personId: ids.dispatcher, definitionId: ids.dispatcher}, {type: "spawn", personId: ids.receiver, definitionId: ids.receiver},
                {type: "item", actor: ids.dispatcher, key: wood, amount: 3}, {type: "situation", situationId: ids.situation, operation: "begin"},
                {type: "site", actor: ids.dispatcher, siteId: ids.villageSite, operation: "open"}, {type: "site", actor: ids.receiver, siteId: ids.townSite, operation: "open"},
                af("introduced"), af("acceptedWork", false), af("townMet", false), af("trained", false), wf("route", "unselected"), wf("accepted", false),
                af("received", false, ids.receiver),
                know("opening", "Mira shows three rough logs beside a slip promising three to the Town depot and one Village reserve. Audit the order for two coins, or supply one real log for four coins. Asking accepted no work."),
                know("opening", "I own three logs and ten coins. The dispatch slip promises more than this stack; I can revise the order myself if nobody takes the work.", ids.dispatcher),
                memory(ids.dispatcher, "Explained a present paid order without accepting an agreement on the traveler's behalf.", 0)]}),
        approach("audit", "Audit the order · 1 stamina + 4 min · earn 2 coins", 4, 2,
            [{type: "vital", key: "stamina", amount: -1}], "audit",
            "You counted the reserve twice on the slip. Revise the Town order to two logs and retain one real Village log; no player materials are donated."),
        approach("underwrite", "Supply the shortfall · 1 log + 2 stamina + 2 min · earn 4 coins", 2, 4,
            [{type: "transfer", from: "player", to: ids.dispatcher, key: wood, count: 1}, {type: "vital", key: "stamina", amount: -2}], "underwritten",
            "You supplied one owned log for this order. Mira can send three logs and retain one local reserve; this contribution does not establish why the slip was wrong."),
        ...[["decline", "Decline this work", "declined"], ["delay", "Leave the decision to Mira", "deferred"]].map(([id, label, to]) => command({
            id: `original_frontier.${id}`, label, claim: `${prefix}.choice`, targetId: ids.dispatcher, coLocated: true,
            visibleWhen: phase("posted"), requires: open,
            description: "No fee, reward, debt or standing loss. Mira will revise and deliver a smaller order using her own means. Leaving without an answer has the same independent fallback with a different retained record.",
            effects: [shift("posted", to), af("approach", to), know("decision", to === "declined" ? "You declined the present paid work. Mira accepted no promise from you." : "You left this decision to Mira. She will arrange her own order."),
                memory(ids.dispatcher, to === "declined" ? "The traveler declined this work; no agreement was broken." : "The traveler deferred; I will make my own decision.", 0)],
        })),
        ...["declined", "deferred", "unanswered"].map(selected => npc({
            id: `original_frontier.correct_${selected}`, label: "Mira reconciles her own dispatch slip", duration: 2, cancellation: "none",
            requires: selected === "unanswered" ? all(phase("posted"), eq(`situation.${ids.situation}.responseOpen`, false)) : phase(selected),
            costs: [coins(ids.dispatcher, -1), {type: "vital", key: "stamina", amount: -1}],
            effects: [wf("route", selected), shift(selected === "unanswered" ? "posted" : selected, "ready"),
                know("correction", "I counted the reserve twice. I paid for a corrected slip and will deliver two logs, retaining one Village log. No traveler agreed to this work.", ids.dispatcher)],
        })),
        // Each leg is paid, location-checked authored NPC work. Native player
        // travel remains native. Mira has no trained travel-speed bonus.
        ...[
            ["out_forest", "Village", "Forest road", "ready", 240],
            ["out_gate", "Forest road", "Town outskirts", "out_forest", 240],
            ["out_town", "Town outskirts", "Town square", "out_gate", 40],
            ["back_gate", "Town square", "Town outskirts", "accepted", 40],
            ["back_forest", "Town outskirts", "Forest road", "back_gate", 240],
            ["returned", "Forest road", "Village", "back_forest", 240],
        ].map(([toPhase, from, to, fromPhase, duration]) => npc({
            id: `original_frontier.travel_${toPhase}`, label: `Mira travels from ${from} to ${to}`, location: from, duration, cancellation: "none",
            requires: all(phase(fromPhase), eq("originalFrontier.townAccessible")), costs: [{type: "vital", key: "stamina", amount: -1}],
            effects: [{type: "relocate", location: to}, shift(fromPhase, toPhase), know("whereabouts", `I reached ${to} with my retained stock.`, ids.dispatcher)],
        })),
        ...[[2, any(route("audit"), route("declined"), route("deferred"), route("unanswered"))], [3, route("underwritten")]].map(([count, selected]) => npc({
            id: `original_frontier.deliver_${count}`, label: "Mira hands over the agreed actual stock", location: "Town square", targetId: ids.receiver,
            coLocated: true, participants: ["$target"], requires: all(phase("out_town"), selected),
            costs: [{type: "transfer", from: ids.dispatcher, to: ids.receiver, key: wood, count}],
            effects: [shift("out_town", "delivered"), af("received", true, ids.receiver), af("shipment", count, ids.receiver),
                know("received", `Mira handed over ${count} actual logs. One log remains her Village reserve.`, ids.receiver),
                know("handover", `I delivered ${count} logs and retained one reserve.`, ids.dispatcher)],
        })),
        command({id: "original_frontier.depot_accept", actorId: ids.receiver, audience: ["$actor"], location: "Town square", label: "Wen accepts the consignment with his own means", duration: 2, cancellation: "none",
            requires: all(phase("delivered"), eq(`actor.${prefix}.received`)), costs: [coins(ids.receiver, -1), {type: "vital", key: "stamina", amount: -1}],
            effects: [wf("accepted"), shift("delivered", "accepted"), know("acceptance", "I paid for the receiving entry and accepted the actual delivered stock. The parcel tally can now be taught at my desk.", ids.receiver, "observation", ids.receiver)]}),
        ...["audit", "underwritten", "declined", "deferred", "unanswered"].map(selected => command({
            id: `original_frontier.meet_${selected}`, label: "Hear Wen's actual receiving report", location: "Town square", targetId: ids.receiver, coLocated: true,
            once: true, visibleWhen: all(introduced, eq(`actor.${prefix}.townMet`, false)), requires: all(introduced, accepted, route(selected)),
            effects: [af("townMet"), af("reportedRoute", selected),
                know("later", selected === "underwritten" ? "Wen shows three delivered logs: your extra log made the larger order possible. Mira retained one reserve and took your contribution as present help, not a continuing duty."
                    : selected === "audit" ? "Wen shows two delivered logs and the revised order. Your audit protected the Village reserve; the depot accepted a smaller shipment instead of pretending the missing log existed."
                    : `Wen shows two delivered logs. He reports that Mira corrected her own slip and paid for that work after ${selected === "declined" ? "you declined" : selected === "deferred" ? "you deferred" : "no reply arrived"}. No wage or obligation was assigned to you.`, "player", "observation", ids.receiver),
                memory(ids.receiver, "Showed the actual receiving entry and named who supplied or corrected the order.")],
        })),
        command({id: "original_frontier.learn_tally", label: "Practice Load tally · 1 stamina + 2 min", location: "Town square", targetId: ids.receiver, coLocated: true,
            participants: ["$target"], siteId: ids.townSite, once: true, duration: 2, cancellation: "refund",
            visibleWhen: all(eq(`actor.${prefix}.townMet`), eq(`actor.${prefix}.trained`, false)), requires: all(eq(`actor.${prefix}.townMet`), gte("vital.health", 2)),
            description: "Wen teaches you to check a physical lot, match its agreed destination and retain a separate reserve. Refusal earlier does not bar paid later work. Cancellation returns stamina and teaches nothing.",
            costs: [{type: "vital", key: "stamina", amount: -1}], effects: [af("trained"),
                know("method", "You practiced physical counting, destination matching and reserve separation at Wen's desk. This supports the two agreed paid tally jobs; it grants no goods, reputation, route bonus or stock replenishment.", "player", "instruction", ids.receiver),
                {type: "source", sourceId: ids.method, operation: "grant", origin: "trained", awakened: true, active: true},
                {type: "power", powerId: ids.method, operation: "learn"}, {type: "power", powerId: ids.method, operation: "refine", amount: 1},
                memory(ids.receiver, "Taught the ordinary method after showing the actual consignment.")]}),
        ...[
            ["reserve", ids.dispatcher, "Village", ids.villageSite, "reserveOrders", "Check Mira's retained reserve", phase("returned"), 1, "reserve"],
            ["receiving", ids.receiver, "Town square", ids.townSite, "acceptanceOrders", "Check Wen's two-log parcel lot", all(accepted, any(route("audit"),route("declined"),route("deferred"),route("unanswered"))), 2, "receiving"],
            ["receiving_full", ids.receiver, "Town square", ids.townSite, "acceptanceOrders", "Check Wen's three-log parcel lot", all(accepted, route("underwritten")), 3, "receiving"],
        ].map(([id, target, location, siteId, orders, label, ready, count, checked]) => command({
            id: `original_frontier.work_${id}`, label: `${label} · 1 stamina + 2 min · earn 1 coin`, location, targetId: target, coLocated: true,
            participants: ["$target"], siteId, powerId: ids.method, duration: 2, cancellation: "refund", automatable: true,
            completionRequires: workable, completionCoLocated: true, completionFailure: "refund",
            visibleWhen: all(eq(`actor.${prefix}.trained`), id === "receiving_full" ? eq(`actor.${prefix}.reportedRoute`, "underwritten") : id === "receiving" ? any(...["audit","declined","deferred","unanswered"].map(value => eq(`actor.${prefix}.reportedRoute`, value))) : introduced), requires: all(workable, ready),
            description: "One contracted lot check is funded here. The employer's order and coin are reserved once; the inspected logs move into the accepted job's reservation and return to that same employer on settlement or refund. Cancellation returns inputs. Further orders need explicitly funded content, so an automatic routine pauses after this lot.",
            costs: [{type: "item", actor: target, key: wood, amount: -count}, {type: "vital", key: "stamina", amount: -1}, coins(target, -1), {type: "resource", actor: target, key: orders, amount: -1}],
            effects: [{type: "item", actor: target, key: wood, amount: count}, pay(1), af(`${checked}Checked`), af(`${checked}Checked`, true, target), {type: "xp", skill: "Perception", amount: 2},
                know(`${id}_work`, `${label}: you matched the actual lot to its agreed order. One employer-funded coin was paid; this check created or consumed no log.`, "player", "observation", target),
                memory(target, "Paid one agreed coin for a practiced physical lot check.")],
        })),
        command({id: "original_frontier.return_report", label: "Ask Mira how the order changed her next work", targetId: ids.dispatcher, coLocated: true, once: true,
            visibleWhen: introduced, requires: all(introduced, phase("returned")), effects: [af("villageRevisited"),
                know("return", "Mira is back with the same one-log reserve. She now separates reserve and shipment before quoting work; one local check is funded. Her old wage and travel spending remain spent."),
                memory(ids.dispatcher, "Reported a smaller, funded next order after returning with the retained reserve.", 0)]}),
    ],
    controllers: [
        {id: "original_frontier.dispatch_plan", revision: 1, label: "Mira's funded consignment", actorId: ids.dispatcher, interval: 1,
            actions: [
                ...["declined", "deferred", "unanswered"].map(selected => ({commandId: `original_frontier.correct_${selected}`, priority: 4})),
                ...["out_forest", "out_gate", "out_town", "back_gate", "back_forest", "returned"].map(selected => ({commandId: `original_frontier.travel_${selected}`, priority: 2})),
                ...[2, 3].map(count => ({commandId: `original_frontier.deliver_${count}`, targetId: ids.receiver, priority: 3})),
            ]},
        {id: "original_frontier.receiver_plan", revision: 1, label: "Wen's funded receiving work", actorId: ids.receiver, interval: 1,
            actions: [{commandId: "original_frontier.depot_accept", priority: 1}]},
    ],
};

export const originalFrontierSources=[...episodeSources,...originalFrontierCareerSources,...originalFrontierFieldSources];
export const originalFrontierDefinitions=Object.fromEntries(['people','sites','powers','commands','controllers','encounters','situations'].map(family=>
    [family,[...(episodeDefinitions[family] || []),...(originalFrontierCareerDefinitions[family] || []),...(originalFrontierFieldDefinitions[family] || [])]]));

// Player projections read only earned player facts/knowledge. NPC stock, jobs,
// private truth, directed memories and unobserved phase changes are excluded.
export function originalFrontierEpisodeView(state) {
    const facts = state.actors?.player?.facts || {}, known = state.simulation?.knowledge?.player || {};
    return {introduced: !!facts[`${prefix}.introduced`], approach: facts[`${prefix}.approach`] || null,
        townMet: !!facts[`${prefix}.townMet`], trained: !!facts[`${prefix}.trained`],
        villageRevisited: !!facts[`${prefix}.villageRevisited`], reserveChecked: !!facts[`${prefix}.reserveChecked`], receivingChecked: !!facts[`${prefix}.receivingChecked`],
        details: Object.entries(known).filter(([key]) => key.startsWith(`${prefix}.`)).map(([key, value]) => ({key, text: value.value, at: value.at, basis: value.basis ? {...value.basis} : null}))};
}
export function originalFrontierQuestView(state) {
    const facts = state.actors?.player?.facts || {};
    if(!facts[`${prefix}.acceptedWork`]) return null;
    return {id: "original_frontier.short_measure", name: "Short Measure", description: "Your agreed Village tally work was paid. Visit the receiving desk at Town square to hear what arrived; no further duty was accepted.",
        objective: facts[`${prefix}.townMet`] ? "You saw the receiving entry. Wen's ordinary Load tally lesson is optional." : "Travel normally to Town square and ask Wen for the receiving entry. If it is not ready, leave it to the funded resident work.",
        completed: !!facts[`${prefix}.townMet`]};
}
