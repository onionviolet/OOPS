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
export const DEV_REASONS = new Set([UNMET_REASON, ...FOREIGN_REASONS]);
const RETURN = /^Return to (.+)\.$/;

// Splits a joined reason string into sentences and sorts them for the player.
// player: what may be printed; dev: engine text; place: a "Return to X." location.
export function splitReasons(reasons) {
    const list = (Array.isArray(reasons) ? reasons : String(reasons || "").split(/(?<=\.)\s+/)).map(r => String(r).trim()).filter(Boolean);
    const out = {player: [], dev: [], place: null};
    for(const r of list) {
        if(DEV_REASONS.has(r)) out.dev.push(r);
        else if(RETURN.test(r) && !out.place) out.place = r.match(RETURN)[1];
        else out.player.push(r);
    }
    return out;
}
export const playerReasonText = reasons => {const s = splitReasons(reasons); return [...s.player, ...(s.place ? [`Return to ${s.place}.`] : [])].join(" ");};
// An action is out of reach when the engine names another world/actor or an unmet unstated requirement.
export const unreachable = reasons => splitReasons(reasons).dev.length > 0;
