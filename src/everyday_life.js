// Read models and authored social content use the existing actor/condition
// engine. No mood currency, hidden rolls, retroactive history or second clock.
import {recurringWindow} from './world_rhythm.js';
export const TEACHER_WINDOW = Object.freeze({period: 1440, opens: 480, closes: 1080});
export const IRRITATED = "mood.irritated";
export const UNSETTLED = "mood.unsettled";
export const REASSURED = "mood.reassured";
const eq = (fact, value, reason) => ({fact, op: "eq", value, ...(reason ? {reason} : {})});
const met = eq("village.craftsmanMet", true, "Meet the old craftsman first.");
const wood = JSON.stringify({id: "Rough wood log"});
const condition = (id, operation, actor, duration) => ({type: "condition", id, operation, ...(actor ? {actor} : {}), ...(duration ? {duration} : {})});
const respect = text => ({type: "relationship", actor: "$target", target: "$actor", axis: "respect", amount: 1, text});
const settle = [condition(IRRITATED, "remove", "$target"), condition(UNSETTLED, "remove"), condition(REASSURED, "apply", null, 20)];
const social = d => ({revision: 1, worldId: "base.frontier", actorId: "player", location: "Village",
    targetId: "oldCraftsman", coLocated: true, group: "social", costs: [], effects: [], ...d});

export const moodConditions = [
    {id: IRRITATED, revision: 1, label: "Irritated by an interruption", stacking: "max"},
    {id: UNSETTLED, revision: 1, label: "Unsettled after an awkward exchange", stacking: "max"},
    {id: REASSURED, revision: 1, label: "Reassured", stacking: "max"},
];

export const socialCommands = [
    social({id: "village.working_habits", label: "Ask about his working habits", once: true, requires: met,
        effects: [{type: "knowledge", key: "craftsman.preferences", stage: "understood", value: "He likes sound materials and quiet while counting fittings; questions are welcome after work."},
            {type: "relationship", actor: "$target", target: "$actor", axis: "familiarity", amount: 1, text: "Asked how he prefers to work."}]}),
    social({id: "village.interrupt_work", label: "Ask for his attention at the busy bench", once: true,
        visibleWhen: eq("village.craftsmanBusy", true), requires: {all: [met, eq("village.craftsmanBusy", true, "He is not working at the bench now.")]},
        effects: [condition(IRRITATED, "apply", "$target", 20), condition(UNSETTLED, "apply", null, 15),
            condition(REASSURED, "remove"), {type: "relationship", actor: "$target", target: "$actor", axis: "respect", amount: -1,
                text: "Interrupted him while he was counting fittings. He asked for quiet."}]}),
    social({id: "village.give_space", label: "Give him a quiet moment · 3 min", duration: 3, cancellation: "forfeit",
        visibleWhen: eq("village.craftsmanIrritated", true), requires: {all: [met, eq("village.craftsmanIrritated", true)]},
        effects: [...settle, respect("Gave him space after the interruption; the earlier exchange remains remembered.")]}),
    social({id: "village.practical_apology", label: "Apologize and contribute a log", visibleWhen: eq("village.craftsmanIrritated", true),
        requires: {all: [met, eq("village.craftsmanIrritated", true)]},
        costs: [{type: "transfer", from: "$actor", to: "$target", key: wood, count: 1}],
        effects: [...settle, respect("Apologized for the interruption and supplied an actual log for later work.")]}),
    {revision: 1, worldId: "base.frontier", actorId: "player", group: "social", id: "village.quiet_break",
        label: "Take a quiet break in the Shack · 3 min", location: "Shack", duration: 3, cancellation: "forfeit", costs: [],
        visibleWhen: {any: [eq("village.playerUnsettled", true), eq("village.playerReassured", false)]},
        requires: eq("village.shackUnlocked", true, "Earn a place to rest through the elder."),
        effects: [condition(UNSETTLED, "remove"), condition(REASSURED, "apply", null, 20)]},
];

export function activeMood(state, actorId, id) {
    const c = state.simulation?.conditions[actorId]?.[id];
    return c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock) ? c : null;
}

export function everydayFacts(state, {hour = 8} = {}) {
    const p = state.simulation?.people.oldCraftsman;
    return {"village.craftsmanBusy": !!state.actors.oldCraftsman?.facts["work.order"] || !!state.actors.oldCraftsman?.facts["field.partsOrder"] || !!state.simulation?.jobs.some(j => (j.participants || [j.actorId]).includes("oldCraftsman")),
        "village.craftsmanIrritated": !!activeMood(state, "oldCraftsman", IRRITATED),
        "village.playerUnsettled": !!activeMood(state, "player", UNSETTLED),
        "village.playerReassured": !!activeMood(state, "player", REASSURED),
        "village.teacherHours": recurringWindow(TEACHER_WINDOW, hour * 60).open,
        "village.waypostChapterOpen": !state.actors.player.facts["village.waypostChapterClosed"],
        "village.craftsmanPresent": !p || p.life === "alive" && p.location === "Village"};
}

export function routeUnderstanding(state, notesRead = false) {
    const f = state.actors.player.facts;
    return {known: !!f["village.routeKnown"] || notesRead,
        origin: f["village.routeKnown"] ? f["village.routeOrigin"] || "earlier experience" : notesRead ? "book" : null};
}

// Additive book projection, including completed books in older saves. The
// first learning source stays authoritative; finishing a book later is separate.
export function recordRouteReading(state, notesRead) {
    if(!notesRead || state.actors.player.facts["village.routeKnown"]) return state;
    const next = structuredClone(state);
    next.actors.player.facts["village.routeKnown"] = true;
    next.actors.player.facts["village.routeOrigin"] = "book";
    return next;
}

export function everydayScene(state, facts) {
    const text = [], location = facts.location;
    if(location === "Shack") {
        if(facts["weather.raining"]) text.push("Rain taps on the Shack's roof.");
        else if(facts["weather.damp"]) text.push("Damp footprints are fading beside the door.");
        else text.push(facts["day.hour"] >= 20 || facts["day.hour"] < 4
            ? "The window is dark; the Shack has gone quiet."
            : "The Shack is quiet; the small window leaves a square of light beside the bed.");
        if(state.actors.player.facts["town.returned"] && state.actors.player.facts["village.board"]) text.push("A corrected town sign has been added to your route board.");
    }
    if(location === "Village" && facts["village.craftsmanMet"]) {
        if(facts["village.craftsmanIrritated"]) text.push("He is still irritated by the interruption: 'Let me finish counting.' Questions can wait, or you can learn the route another way.");
        else if(state.actors.player.completed["village.give_space"] || state.actors.player.completed["village.practical_apology"]) text.push("He makes room beside the bench again. The awkward exchange is remembered, but he is willing to talk.");
        else if(state.actors.player.completed["village.interrupt_work"]) text.push("He has returned to his tools. You remember his earlier request for quiet.");
        else if(facts["village.craftsmanBusy"]) text.push("The craftsman counts fittings into small piles without looking up.");
        else if(facts["village.craftsmanPresent"]) text.push("The craftsman brushes wood shavings from the bench before setting out his tools.");
        if(state.simulation?.knowledge.player?.["craftsman.preferences"] && !facts["village.craftsmanIrritated"]) text.push("You know he prefers practical help and questions after work.");
    }
    if(facts["village.playerUnsettled"]) text.push("The abrupt exchange stays on your mind. A quiet break or time will help.");
    else if(facts["village.playerReassured"]) text.push("You feel settled enough to take your time with unfamiliar details.");
    return text.join(" ");
}
