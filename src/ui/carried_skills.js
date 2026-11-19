// PS307 (proposal): a life with its own body does not own the Village hero's skills. The ones still in the Skills list are carried across a
// crossing, so they sit under their own fold. F4 (WER9, skill_carry.js): each start records what carries, so the fold says per skill what it
// does in this body. A life with no recorded answer keeps the old note, which says plainly that the answer is not settled.
// Display only: the skill rows stay where display.js draws them; the fold is a sibling before the list and CSS hides the list while it is shut.
import {kitElement} from './kit.js';

const FOLD = 'skills-carried';

/**
 * Show (entry given) or remove (null) the "Carried from before" fold before the Skills list. Safe to call on every render.
 * entry: {carried: text} (no answer recorded) or {carry: {rows: [{label, text}], recorded, reason}} (the start's WER9 answer).
 */
export function syncCarriedSkills(doc, entry) {
    const list = doc?.getElementById?.('skill_list');
    if (!list?.parentNode) return;
    const old = list.parentNode.querySelector?.(`:scope > details.${FOLD}`);
    const carry = entry?.carry, note = carry ? carryNote(carry) : entry?.carried;
    if (!note && !carry?.rows?.length) { old?.remove(); return; }
    const signature = JSON.stringify([note, carry?.rows?.map(r => [r.label, r.text])]);
    if (old?.dataset?.signature === signature) return;
    const fold = kitElement('details', FOLD), summary = kitElement('summary', '', 'Carried from before');
    if (fold.dataset) fold.dataset.signature = signature; fold.open = old ? old.open : true; fold.append(summary);
    if (note) fold.append(kitElement('p', '', note));
    if (carry?.rows?.length) {
        const rows = kitElement('ul', `${FOLD}-rows`);
        for (const row of carry.rows) {
            const item = kitElement('li', `${FOLD}-row`);
            if (item.dataset) item.dataset.skill = row.id ?? row.label;
            item.append(kitElement('strong', '', row.label), kitElement('span', '', ` ${row.text}`));
            rows.append(item);
        }
        fold.append(rows);
    }
    if (old) old.replaceWith(fold); else list.before(fold);
}

function carryNote(carry) {
    if (!carry.recorded) return 'This life began before what carries was recorded, so nothing about your skills was changed here.';
    return carry.rows.length ? carry.reason : '';
}
