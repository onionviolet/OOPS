// AT17 PROTOTYPE, second consumer (proposal under AD32, not an accepted rule): docs/audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md.
// The weekly expense application goes to Captain Dunn (book_world_lotm_duties.js), so the first filing leaves a note Dunn holds about the player.
// Dunn is the pack's own person (no second, authored Dunn): a principal the be-life enrolls at the start, woken here only if a pack revision left
// him without a body. "First" is read from state (the note is absent), never from the duties projection (F6), so a second week, a replayed plan or a
// retried save writes nothing new. Default: the note keeps the first filing's date; a later consumer that wants the latest week can rewrite it (dial).
import {applySimulationEffects} from './simulation_effects.js';
import {wakeCastPerson} from './book_world_lotm_cast_host.js';

export const DUNN_ID = 'lotm.person.cast-618f4df49af02c7da45e'; // index id lotm.person.dunn-smith
export const EXPENSE_FILED_KEY = 'book.lotm.colleague.expense_filed';
export const EXPENSE_FILED_LINE = 'took your expense application and added it to the team\'s funding request';
// True when this call wrote the note. A registry without Dunn's definition (pack absent) writes nothing a save could not validate (F1).
export function noteExpenseFiled(plan, registry) {
    const s = plan?.state;
    if(!s?.simulation || s.simulation.knowledge?.[DUNN_ID]?.[EXPENSE_FILED_KEY]) return false;
    if(!registry?.simulation?.people?.has(DUNN_ID)) return false;
    wakeCastPerson(s, DUNN_ID);
    if(!s.simulation.people[DUNN_ID] || !s.actors?.[DUNN_ID]) return false;
    applySimulationEffects(plan, [{type: 'knowledge', actor: DUNN_ID, key: EXPENSE_FILED_KEY, stage: 'seen', value: EXPENSE_FILED_LINE}], {actorId: 'player'}, registry, 'book.lotm.expense_claim.dunn');
    return true;
}
