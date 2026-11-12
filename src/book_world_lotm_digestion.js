// One digestion counter for every Lord of the Mysteries potion (PRG4, PRG10). Acting acts are a count
// track on R's path rule; the facts and felt words every pathway, the Seer and Seq 7 read come from here.
// The fact names are unchanged (`<prefix>.acting`, `<prefix>.digested`), so saves and rules stay as they were.
import {trackLevel} from './progression_path.js';

export const DIGESTION_FELT = Object.freeze(['unsettled', 'settling', 'settled']);
export const digestionTrack = need => Object.freeze({kind: 'count', need, felt: DIGESTION_FELT});

// Writes `<prefix>.acting` and `<prefix>.digested` from the act count. The Seer's prefix is `lotm`.
export function digestionFacts(f, prefix, acts, need) {
    const n = acts || 0;
    f[`${prefix}.acting`] = n;
    f[`${prefix}.digested`] = trackLevel(digestionTrack(need), n) >= 1;
    return f;
}
// Canon: digestion is known by feel, so the view shows words; the act count stays a record of what was done.
export const digestionFelt = (f, prefix) =>
    DIGESTION_FELT[f[`${prefix}.digested`] ? 2 : (f[`${prefix}.acting`] || 0) > 0 ? 1 : 0];
