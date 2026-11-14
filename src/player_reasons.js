// Engine refusal reasons that are developer text, not player text (UR73, 2026-10-30).
// Weibao: "These command belongs to another world" is meaningless and detracts from the game.
// Engines keep these exact strings (other code compares them); players never read them.
// An action the engine can only refuse with these is unreachable here and stays hidden (UR82);
// with dev mode on, panels may show them under a "dev" label.
export const UNMET_REASON = "The required knowledge, means or circumstances are missing.";
export const FOREIGN_REASONS = Object.freeze([
    "This command belongs to another world.",
    "This command belongs to another actor.",
    "This command belongs to another actor role.",
    "This expedition belongs to another world.",
    "This source-specific rule belongs to another world.",
    "This counterpart already belongs to another actual record.",
    "This relay action is stale or belongs to another actor.",
    "This original local action is stale or belongs to another body.",
    "This plan belongs to another actor.",
    "This response belongs to another actor.",
]);
// What a tooltip says when the engine could only refuse with its fallback (OPN4): true in every world, names no hidden fact.
export const NEUTRAL_REASON = "Not open to you yet.";
export const DEV_REASONS = new Set([UNMET_REASON, ...FOREIGN_REASONS]);
const RETURN = /^Return to (.+)\.$/;
// Engine wording that is true but says nothing a player can act on: say what to do (UR73).
const PLAYER_WORDS = new Map([["Insufficient, stale or unavailable item quantity. Refresh the trade.", "You do not have all the items or coin this asks for."]]);

// Splits a joined reason string into sentences and sorts them for the player.
// player: what may be printed; dev: engine text; place: a "Return to X." location.
export function splitReasons(reasons) {
    const worded = typeof reasons === "string" ? [...PLAYER_WORDS].reduce((t, [from, to]) => t.split(from).join(to), reasons) : reasons;
    const list = (Array.isArray(worded) ? worded : String(worded || "").split(/(?<=\.)\s+/)).map(r => String(r).trim()).filter(Boolean);
    const out = {player: [], dev: [], place: null};
    for(const r of list) {
        if(DEV_REASONS.has(r)) out.dev.push(r);
        else if(RETURN.test(r) && !out.place) out.place = r.match(RETURN)[1];
        else out.player.push(PLAYER_WORDS.get(r) || r);
    }
    return out;
}
// G6: a place the game knows only by its id is never printed ("Return to lotm.place.cast-126f…"); the line says
// the act is done elsewhere and leaves the name to the place list.
const RAW_ID = /^[a-z0-9_-]+(?:\.[a-z0-9_-]+)+$/i;
export const returnLine = place => (RAW_ID.test(String(place)) ? 'This is done somewhere else; go there first.' : `Return to ${place}.`);
// For panels that print the engine's reasons themselves: the same rule, applied to a list.
export const tidyReasons = (reasons, glue = ' ') => (Array.isArray(reasons) ? reasons : [reasons]).filter(Boolean).map(r => String(r).replace(/Return to ([a-z0-9_-]+(?:\.[a-z0-9_-]+)+)\./gi, (_, place) => returnLine(place))).join(glue);
export const playerReasonText = reasons => {const s = splitReasons(reasons); return [...s.player, ...(s.place ? [returnLine(s.place)] : [])].join(" ");};
// An action is out of reach when the engine names another world/actor or an unmet unstated requirement.
export const unreachable = reasons => splitReasons(reasons).dev.length > 0;
