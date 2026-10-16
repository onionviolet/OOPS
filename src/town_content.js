// Optional original fork story. Inherited dialogue, quests and balance stay owned
// by the native game; joining this chapter explicitly opens its locked town.
export const TOWN_FACTS = ["town.joined", "town.briefed", "town.worked", "town.settled", "town.returned"];
const wood = JSON.stringify({id: "Rough wood log"});
const kit = JSON.stringify({id: "Prepared survey kit"});
const eq = (fact, value, reason) => ({fact, op: "eq", value, ...(reason ? {reason} : {})});
const here = location => eq("location", location, `Travel to ${location} using the ordinary location menu.`);
const fact = (key, value = true) => ({type: "fact", scope: "actor", key, value});
const joined = eq("actor.town.joined", true, "Choose the optional town chapter at Town outskirts first.");
const openWork = {all: [joined, eq("actor.town.briefed", true), eq("actor.town.worked", false)]};
const action = values => ({worldId: "base.frontier", revision: 1, group: "town", completionScope: "actor",
    repeatable: false, duration: 0, costs: [], ...values});
const done = (label, effects) => [{id: "done", label, chance: 1, effects}];

export const townSources = [{id: "town.route_ledger", label: "Town survey office's corrected route ledger", kind: "knowledge", revision: 1,
    grants: [{capability: "frontier.preparation", amount: 1}]}];

export const townActions = [
    action({id: "town.begin", label: "Ask about the survey notice", visibleWhen: {all: [here("Town outskirts"), eq("actor.town.joined", false)]},
        requires: {all: [here("Town outskirts"), eq("village.elderMet", true, "Meet the Village elder through the original opening first.")]},
        description: "The gate issues visitor permits for Town square. Taking work at the office is optional.",
        outcomes: done("The survey office issues a visitor permit. The guard points you toward Town square.", [fact("town.joined")])}),
    action({id: "town.brief", label: "Visit the town survey office", visibleWhen: {all: [joined, eq("actor.town.briefed", false)]}, requires: here("Town square"),
        description: "Road sketches cover the clerk's desk. Ask what needs doing; no payment or supplies are required.",
        outcomes: done("Clerk: 'We have three maps and four versions of the same road. Bring a useful answer, or timber for proper markers.'", [fact("town.briefed")])}),
    action({id: "town.scout", label: "Check the forest road for the survey office", duration: 4, cancellation: "forfeit",
        visibleWhen: openWork, requires: here("Forest road"),
        description: "Compare the road with the clerk's sketch. Four game minutes, no supplies or combat; six Perception XP on completion. You can cancel before finishing and choose the timber work instead.",
        outcomes: done("The road is sound; a copied drainage mark points travelers into mud. You record its correct position.", [
            fact("town.worked"), fact("town.approach", "survey"), {type: "xp", skill: "Perception", amount: 6}])}),
    action({id: "town.timber", label: "Prepare two wood logs for the town markers", duration: 3, cancellation: "refund",
        durationModifiers:[{when:{fact:"capability.body.hand_control",op:"gte",value:1},minutes:1,operation:"subtract",label:"Conditioned grip: 1 minute quicker"},
            {when:{fact:"body.handsTender",op:"eq",value:true},minutes:2,operation:"add",label:"Tender hands: 2 more minutes"}],
        visibleWhen: openWork, requires: here("Village"), costs: [{type: "item", key: wood, amount: 2, label: "Rough wood logs"}],
        description: "Shape timber for road markers. Two Rough wood logs; normally three game minutes. Cancellation returns both logs. Complete this or the road survey.",
        outcomes: done("You prepare sound timber and record the shipment. The survey office can replace its unreliable markers.", [fact("town.worked"), fact("town.approach", "timber")])}),
    action({id: "town.settle", label: "Deliver your contribution to the survey office", visibleWhen: {all: [joined, eq("actor.town.worked", true), eq("actor.town.settled", false)]},
        requires: here("Town square"), description: "Collect the agreed six wooden coins, one Prepared survey kit and one Town reputation. Payment is made once.",
        outcomes: done("The clerk accepts your contribution, pays the agreed fee and hands over a kit with the corrected ledger.", [
            fact("town.settled"), {type: "resource", scope: "external", key: "money", amount: 6},
            {type: "item", key: kit, amount: 1}, {type: "reputation", region: "Town", amount: 1}])}),
    action({id: "town.return", label: "Share the corrected ledger in Village", visibleWhen: {all: [joined, eq("actor.town.settled", true), eq("actor.town.returned", false)]},
        requires: here("Village"), description: "Let the travelers copy your ledger. One Village reputation and permanent route preparation; no supplies spent.",
        outcomes: done("Village travelers copy the corrected signs. Your town work now helps the same ordinary routes you started with.", [
            fact("town.returned"), {type: "reputation", region: "Village", amount: 1}, {type: "source", operation: "grant", sourceId: "town.route_ledger"}])}),
];

export function townUnlocks(previous, next) {
    return !previous.actors.player.facts["town.joined"] && next.actors.player.facts["town.joined"]
        ? [{kind: "availability", category: "location", id: "Town square"}] : [];
}

export function usesTownClock(state) {return !!state.actors.player.facts["town.joined"];}

export function townScene(state) {
    const facts = state.actors.player.facts;
    if(!facts["town.joined"]) return "A survey-office notice hangs beside the town gate. Visitors can apply for short-term work.";
    if(facts["town.returned"]) return "Travelers compare the new signs with your copy of the ledger. For once, the directions agree.";
    if(facts["town.settled"]) return "The clerk's ledger is tucked into your kit. The margin beside Village has room for another hand.";
    if(facts["town.worked"]) return facts["town.approach"] === "survey" ? "Mud stains the edge of your corrected sketch." : "The shaped timber bears the office's shipment mark.";
    if(facts["town.briefed"]) return "Three maps lie open on the desk. None quite agrees with the road outside.";
    return "Past the gate, a small office has its shutters open.";
}

// Quests project existing facts. Rendering cannot grant rewards or advance work.
export function townQuestView(state) {
    const facts = state.actors.player.facts;
    if(!facts["town.joined"]) return null;
    const description = facts["town.briefed"]
        ? "The survey office needs a road check or timber for markers. Agreed payment: six wooden coins and one Prepared survey kit."
        : "Your visitor permit allows entry to Town square.";
    const job = state.pending.find(j => j.context.actorId === "player" && j.actionId.startsWith("town."));
    const objective = facts["town.returned"] ? "The Village travelers have a copy of the corrected ledger."
        : facts["town.settled"] ? "Share the clerk's ledger with travelers in Village."
        : facts["town.worked"] ? "Deliver your contribution at the survey office in Town square."
        : job ? `${job.actionId === "town.scout" ? "Checking Forest road" : "Preparing marker timber"} · ${Math.max(0, job.due-state.clock)} min remaining`
        : facts["town.briefed"] ? "Check Forest road, or prepare two Rough wood logs in Village."
        : "Ask about work at the survey office in Town square.";
    return {id: "town.survey", name: "Survey office", description, objective, completed: !!facts["town.returned"]};
}

// Pure projection of an existing saved fact. No adoption state or viewing reward.
export const VILLAGE_LEDGER_CUES = {sight: 'Travelers use the corrected signs copied from your ledger.'};
export function villageLedgerSentence(state) {
    return state?.actors?.player?.facts?.['town.returned'] === true ? VILLAGE_LEDGER_CUES.sight : '';
}
