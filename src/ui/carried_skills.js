// PS307 (proposal): a life with its own body (own_holdings.js) does not own the Village hero's skills. The ones still in the
// Skills list are carried across a crossing, so they sit under their own fold with what this body can use from them.
// WER9 names what carries per crossing; no start records it yet, so the note says it is not settled (a gap, not an answer).
// Display only: the skill rows stay where display.js draws them; the fold is a sibling before the list and CSS hides the list while it is shut.
import {kitElement} from './kit.js';

const FOLD = 'skills-carried';

/** Show (entry given) or remove (null) the "Carried" fold before the Skills list. Safe to call on every render. */
export function syncCarriedSkills(doc, entry) {
    const list = doc?.getElementById?.('skill_list');
    if (!list?.parentNode) return;
    const old = list.parentNode.querySelector?.(`:scope > details.${FOLD}`);
    if (!entry?.carried) { old?.remove(); return; }
    if (old) { const note = old.querySelector('p'); if (note && note.textContent !== entry.carried) note.textContent = entry.carried; return; }
    const fold = kitElement('details', FOLD), summary = kitElement('summary', '', 'Carried from before'), note = kitElement('p', '', entry.carried);
    fold.open = true; fold.append(summary, note); list.before(fold);
}
