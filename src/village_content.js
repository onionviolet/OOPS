// Original, reversible Proto23-inspired content. No reference code or text reused.
import {routeUnderstanding, everydayScene} from "./everyday_life.js";
export const ROUTE_NOTES = "Weathered route notes";
export const SURVEY_TOKEN = "Surveyor's brass token";
export const NOTES_KEY = JSON.stringify({id: ROUTE_NOTES});
export const TOKEN_KEY = JSON.stringify({id: SURVEY_TOKEN});
export const LOG_KEY = JSON.stringify({id: "Rough wood log"});
const KIT_KEY = JSON.stringify({id: "Prepared survey kit"});
const eq = (fact, value, reason) => ({fact, op: "eq", value, reason});
const fact = (key, value) => ({type: "fact", scope: "actor", key, value});
const source = sourceId => ({type: "source", operation: "grant", sourceId});
const item = (key, amount, label) => ({type: "item", key, amount, label});
const village = eq("location", "Village", "Return to Village for this interaction.");
const discovered = eq("actor.village.discovered", true, "Investigate the disused waypost first.");
const notesRead = eq("village.notesRead", true, "Read the Weathered route notes in your inventory.");
const routeKnown = {any: [eq("actor.village.routeKnown", true, "Understand the drainage route through reading, a lesson or field deduction."), notesRead]};
const routeUnknown = {not: routeKnown, reason: "You already understand this route."};
const craftsman = eq("village.craftsmanMet", true, "Meet the old craftsman. The elder can introduce you after you help with the rats.");
const unsurveyed = eq("actor.surveyed", false, "This crossing is already surveyed.");
const anchors = eq("campaign.anchor", true, "Inspect the crossing in the Field journal first.");
const action = definition => ({worldId: "base.frontier", group: "village", revision: 1,
    completionScope: "actor", repeatable: false, duration: 0, costs: [], ...definition});
const done = (label, effects) => [{id: "done", label, chance: 1, effects}];

export const villageActions = [
    action({id: "village.record_waypost_chapter", label: "Record the waypost account · keep learning and access",
        description: "Proposal: after returning the token and understanding the route, record this story chapter. Review the known opportunities above. Nothing expires, no time passes and no reward is issued. Daily teaching and bench orders continue independently.",
        visibleWhen: {all: [discovered, eq("village.waypostChapterOpen", true)]},
        requires: {all: [village, routeKnown, eq("actor.village.tokenReturned", true, "Return the known surveyor's token first.")]},
        outcomes: done("Waypost account recorded; learned methods and known opportunities remain", [fact("village.waypostChapterClosed", true)])}),
    action({id: "village.waypost", label: "Investigate the disused waypost", duration: 3,
        description: "Search the sheltered side of the marker. No supplies required; six Perception XP on completion. This is a single search.",
        requires: {all: [village, eq("village.elderMet", true, "Speak to the Village elder first.")]},
        visibleWhen: eq("actor.village.discovered", false),
        durationModifiers: [{when: {fact: "perception", op: "gte", value: 3}, minutes: 2, label: "Perception 3: a quicker search"}],
        outcomes: done("A dry booklet and a brass token found beneath the waypost", [fact("village.discovered", true),
            item(NOTES_KEY, 1, "route booklet"), item(TOKEN_KEY, 1, "brass token"), {type: "xp", skill: "Perception", amount: 6}])}),
    action({id: "village.return_token", label: "Return the surveyor's token to the old craftsman",
        description: "Show him the maker's mark and hand over the token. You keep the booklet; no coins are required.",
        visibleWhen: {all: [discovered, eq("actor.village.tokenReturned", false)]},
        requires: {all: [village, craftsman]}, costs: [item(TOKEN_KEY, 1, "surveyor's token")],
        outcomes: done("Craftsman: 'She always hid her notes from the rain. You brought something of her back.'", [
            fact("village.tokenReturned", true), source("village.packing_lesson"), {type: "reputation", region: "Village", amount: 1}])}),
    action({id: "village.route_lesson", label: "Ask the craftsman to explain the drainage marks", duration: 3, cancellation: "refund",
        description: "Three minutes and two wooden coins. He explains the marks when his bench is free, between 08:00 and 18:00. You need no booklet; this teaches the route without completing a book or awarding Literacy XP.",
        visibleWhen: {all: [discovered, routeUnknown]}, requires: {all: [village, discovered, routeUnknown, craftsman,
            eq("village.craftsmanPresent", true, "The craftsman is away; read the notes or deduce the route from the crossing."),
            eq("village.teacherHours", true, "He takes questions from 08:00 to 18:00. Come back then, read the notes or use field evidence."),
            eq("village.craftsmanBusy", false, "Wait for his bench work, or learn from the notes or field evidence."),
            eq("village.craftsmanIrritated", false, "He needs a quiet moment. Settle the exchange, wait, or use another learning method.")]},
        costs: [{scope: "external", key: "money", amount: 2, label: "wooden coins"}],
        outcomes: done("The craftsman explains how drainage cuts mark the dry bank", [fact("village.routeKnown", true), fact("village.routeOrigin", "teacher")])}),
    action({id: "village.route_deduction", label: "Make sense of the drainage marks in the field", duration: 5,
        description: "Compare the marker with the inspected crossing. Needs Perception 3; five minutes, no fee or booklet. You learn from the ground itself, with no book completion or Literacy XP.",
        visibleWhen: {all: [discovered, anchors, routeUnknown]}, requires: {all: [village, discovered, anchors, routeUnknown,
            {fact: "perception", op: "gte", value: 3, reason: "Needs Perception 3; a lesson or the booklet gives another way to learn."}]},
        durationModifiers: [{when: eq("village.playerUnsettled", true), minutes: 6, label: "The awkward exchange makes concentration slower"},
            {when: eq("village.playerReassured", true), minutes: 4, label: "A settled mind makes the field comparison quicker"}],
        outcomes: done("Your field comparison reveals the dry-bank route", [fact("village.routeKnown", true), fact("village.routeOrigin", "field")])}),
    action({id: "village.dry_bank", revision: 2, label: "Survey the dry-bank path", duration: 5,
        description: "Follow the old surveyor's drainage marks. No kit or rope needed. The guide stays ready; earn 25 Climbing XP. The crossing itself remains unrepaired.",
        visibleWhen: {all: [discovered, unsurveyed, routeKnown, anchors]}, requires: {all: [village, routeKnown, anchors, unsurveyed]},
        effects: [fact("surveyed", true), {type: "fact", scope: "world", key: "crossing", value: "unrepaired"},
            {type: "fact", scope: "world", key: "guide.condition", value: "ready"}, {type: "xp", skill: "Climbing", amount: 25},
            {type: "opportunity", id: "frontier.departure", delay: 12, lifetime: 120, blocking: false}],
        outcomes: done("Dry-bank route mapped; the guide keeps the booklet's route in mind", [])}),
    action({id: "village.route_board", revision: 2, label: "Build a route board in the Shack", duration: 4, cancellation: "refund",
        description: "Use 2 Rough wood logs and 2 wooden coins. The board remembers your crossing and lets you pack a kit from one log and two coins. Cancelling returns the materials and coins.",
        visibleWhen: {all: [discovered, eq("actor.village.board", false), eq("village.shackUnlocked", true)]},
        requires: {all: [eq("location", "Shack", "Build the board in the Shack, your ordinary resting place."), routeKnown,
            eq("village.shackUnlocked", true, "Report the cleared rat field to the elder to earn a place to rest.")]},
        costs: [item(LOG_KEY, 2, "Rough wood logs"), {scope: "external", key: "money", amount: 2, label: "wooden coins"}],
        outcomes: done("The route board is mounted beside your bed. It has one map and an unreasonable number of pins.", [fact("village.board", true)])}),
    action({id: "village.board_pack", label: "Pack a kit from your route board", duration: 2, repeatable: true, cancellation: "refund",
        description: "At the Shack, use 1 Rough wood log and 2 wooden coins to pack one real survey kit. Cancelling returns the inputs. Uses familiar gathered wood; no new resource currency.",
        visibleWhen: eq("actor.village.board", true), requires: {all: [eq("location", "Shack", "Use the board in the Shack."),
            anchors, unsurveyed, eq("kits", 0, "You already carry a prepared kit.")]},
        costs: [item(LOG_KEY, 1, "Rough wood log"), {scope: "external", key: "money", amount: 2, label: "wooden coins"}],
        outcomes: done("A survey kit packed using the route board", [item(KIT_KEY, 1, "prepared survey kit")])}),
    action({id: "village.morning_circle", label: "Join the morning wayfinding circle", repeatable: true,
        description: "Village, 08:00–10:00 each game day. Once per day, compare route signs with local travelers. Adds 1 route preparation for 60 played game minutes; optional, with another meeting tomorrow.",
        visibleWhen: {all: [discovered, anchors]}, requires: {all: [village, anchors]}, schedule: {period: 1440, opens: 480, closes: 600},
        outcomes: done("Fresh route signs discussed; today's briefing is recorded", [
            {...source("village.morning_signs"), duration: 60}])}),
    action({id: "village.chalk_copy", label: "Study the directions left after the morning circle", duration: 2,
        description: "The meeting's chalk directions remain after everyone leaves. Two minutes and one wooden coin provide the same hour of route preparation. One copy per traveler; no reward for skipped days.",
        visibleWhen: {all: [discovered, anchors, eq("village.circleOpen", false), eq("actor.village.chalkRead", false)]},
        requires: {all: [village, anchors, eq("village.circleOpen", false), eq("village.briefingActive", false, "Today's directions are still fresh in mind.")]},
        costs: [{scope: "external", key: "money", amount: 1, label: "wooden coin"}],
        outcomes: done("The chalk copy explains the day's route signs", [fact("village.chalkRead", true), {...source("village.morning_signs"), duration: 60}])}),
];

export const villageCapabilities = [{id: "village.packing", label: "Learned kit packing", stacking: "max", providers: []}];
export const villageSources = [
    {id: "village.packing_lesson", label: "Old craftsman's packing lesson", kind: "knowledge", revision: 1,
        grants: [{capability: "village.packing", amount: 1}]},
    {id: "village.morning_signs", label: "Today's wayfinding circle", kind: "knowledge", revision: 1,
        grants: [{capability: "frontier.preparation", amount: 1}]},
];

export function usesVillageClock(state) {
    return !!state.actors.player.facts["village.discovered"] || state.pending.some(job => job.actionId.startsWith("village."));
}

export function villageScene(state, facts) {
    const actor = state.actors.player, world = state.worlds[actor.worldId];
    if(!actor.facts["village.discovered"]) return "An old survey marker leans against the Village fence. Something has been tucked beneath its dry side.";
    const learned = routeUnderstanding(state, facts["village.notesRead"]);
    const text = [learned.known
        ? learned.origin === "teacher" ? "The craftsman's explanation connects the drainage marks into a usable dry-bank route." + (facts["village.notesHeld"] && !facts["village.notesRead"] ? " The booklet itself can still be read." : "")
            : learned.origin === "field" ? "You recognize the dry-bank route from your own comparison of the ground and drainage cuts." + (facts["village.notesHeld"] && !facts["village.notesRead"] ? " The booklet itself can still be read." : "")
                : "The notes mark a dry bank above the crossing: 'Follow the drainage cuts, never the muddy footprints.'"
        : "A few drainage marks repeat through the booklet. Their meaning is still unclear."];
    if(actor.facts["village.tokenReturned"]) text.push("The old craftsman recognizes you: 'Still got the notes? Good. They're worth more in use than on a shelf.' His packing lesson stays learned.");
    else text.push("The old craftsman may recognize the maker's mark on the brass token.");
    if(actor.facts.surveyed && facts["village.notesRead"]) text.push("The final note makes more sense now: 'A shortcut is only short if you arrive.'");
    if(actor.facts["village.board"]) text.push(`Your Shack's route board shows ${world.facts.crossing === "repaired" ? "the repaired crossing" : actor.facts.surveyed ? "a mapped path beside the unrepaired crossing" : "an unfinished crossing"}. ${world.facts["guide.condition"] === "tired" ? "A note reminds you the guide needs rest." : "A small corner is reserved for tomorrow's route signs."}`);
    const detail = everydayScene(state, facts); if(detail) text.push(detail);
    return text.join(" ");
}
