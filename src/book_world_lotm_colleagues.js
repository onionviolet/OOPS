// AT17 PROTOTYPE, second consumer (proposal under AD32, not an accepted rule): docs/audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md.
// The weekly expense application goes to Captain Dunn (book_world_lotm_duties.js), so the first filing leaves a note Dunn holds about the player.
// Dunn is the pack's own person (no second, authored Dunn): a principal the be-life enrolls at the start, woken here only if a pack revision left
// him without a body. "First" is read from state (the note is absent), never from the duties projection (F6), so a second week, a replayed plan or a
// retried save writes nothing new. Default: the note keeps the first filing's date; a later consumer that wants the latest week can rewrite it (dial).
import {applySimulationEffects} from './simulation_effects.js';
import {wakeCastPerson, LOTM_CAST_SITUATION} from './book_world_lotm_cast_host.js';
import {registerWorldTies, tieEffects} from './person_ties.js';

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

// LT8 (proposal, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md#lt8-ties): Dunn's trust in the player is a tie on the shared person record.
// Default: each week's application handed in raises it by one, once per week (the cause names the week). Dial: the threshold of the
// offer below (two weeks). Reason: a captain who signs your papers every week comes to rely on you; the book shows Dunn answering
// Klein's questions about the team's routine (KJ3T), so trust opens disclosure, not money.
export const LOTM_TIES = registerWorldTies({worldId: 'book.lotm.tingen', situationId: LOTM_CAST_SITUATION, kinds: ['trust'], people: {dunn: DUNN_ID},
    offers: [{id: 'book.lotm.tie.dunn_funding', alias: 'dunn', kind: 'trust', atLeast: 2,
        label: 'Ask Captain Dunn how the funding request works',
        description: 'Dunn has signed your weekly applications; ask him what happens to them after he signs.',
        blocked: 'Dunn answers that kind of question once he has signed two of your weekly applications.',
        note: {key: 'book.lotm.tie.dunn_funding', value: 'Dunn explained that he signs each member\'s weekly application and adds it to the team\'s quarterly funding request to the church, so an application on time keeps the team\'s request simple.'}}]});
export const EXPENSE_TIE_KEY = 'book.lotm.tie.dunn_signed';
export const EXPENSE_TIE_LINE = 'Captain Dunn took your weekly expense application and signed it.';
// One tie step per week of the life's own clock. Returns true when it wrote (false without Dunn's body, as above).
export function tieExpenseFiled(plan, registry, week) {
    const s = plan?.state;
    if(!s?.simulation || !Number.isSafeInteger(week) || week < 0 || !registry?.simulation?.people?.has(DUNN_ID)) return false;
    wakeCastPerson(s, DUNN_ID);
    if(!s.simulation.people[DUNN_ID] || !s.actors?.[DUNN_ID]) return false;
    applySimulationEffects(plan, tieEffects('book.lotm.tingen', {alias: 'dunn', kind: 'trust', seen: {key: EXPENSE_TIE_KEY, value: EXPENSE_TIE_LINE}}), {actorId: 'player'}, registry, `book.lotm.expense_claim.dunn.w${week}`);
    return true;
}
