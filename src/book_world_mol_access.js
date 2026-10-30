// Cyoria academy access view (GM6) and the restart readout (GM11), 2026-10-30, proposal. Derived from state the pack already keeps: the guest permit
// fact Ilsa's command writes, the trained operator power and the lamp knowledge. Only the issue stamp is stored (slice `mol_access`, written once
// the permit is first seen). The term is a per-world dial; the pack gives no expiry, so 30 days is a labelled proposal.
import {defineGrant, accessStatus} from './institution_access.js';
import {defineLoopTable, loopReadout} from './loop_table.js';
import {MOL_IDS as I} from './book_world_mol_ids.js';

export const DAY = 1440;
export const GUEST_TERM = Object.freeze({value: 30 * DAY, reason: 'the guest desk renews a pass about once a month.'});
export const WORLD = I.world;
export const hasPermit = expansion => !!expansion?.actors?.player?.facts?.['book.mol.guestPermit'];
export const inCyoria = expansion => expansion?.actors?.player?.worldId === WORLD;

// What the permit never covered, copied from the pass's own receipt line in the pack (original wording).
const NOT_COVERED = ['A first-circle badge', 'Admission to the academy', 'Authority to unlock property', 'Permission to sell made goods'];
const OPENS = [{id: 'library', label: 'Guest library reading'}, {id: 'repair', label: 'Ibery’s catalogue repair'}, {id: 'rebuild', label: 'Supervised reconstruction'}];

export function ownSkill(expansion) {
    const sim = expansion?.simulation, rows = [];
    const power = sim?.powers?.player?.['book.mol.formula_operator'];
    if(power?.mastery) rows.push({id: 'operator', label: 'Keyed-lamp operator', detail: `mastery ${power.mastery}`});
    if(sim?.knowledge?.player?.['book.mol.formula']) rows.push({id: 'formula', label: 'The lamp formula', detail: 'studied'});
    return rows;
}

export function accessView(expansion, slice) {
    if(!hasPermit(expansion)) return {granted: false, permit: false};
    const now = expansion.clock ?? 0, issuedAt = slice?.issuedAt ?? now;
    const grant = defineGrant({id: 'book.mol.guest_pass', issuer: 'Ilsa, academy guest desk', subject: 'You', label: 'Ilsa’s guest pass', issuedAt,
        expiresAt: issuedAt + (slice?.termMinutes ?? GUEST_TERM.value), warnWithin: 3 * DAY, scope: OPENS, notScope: NOT_COVERED, suspendedAt: slice?.suspendedAt ?? null});
    const status = accessStatus(grant, now, ownSkill(expansion));
    return {granted: true, permit: true, label: grant.label, issuer: grant.issuer, term: slice?.termMinutes ? {value: slice.termMinutes, reason: 'Set for this save.'} : GUEST_TERM, issuedAt, expiresAt: grant.expiresAt, ...status};
}

// MoL's rows for the shared loop table. Proposal: the PG4 text read of the loop ids is still owed, so no row claims canon.
defineLoopTable({worldId: WORLD, source: 'Proposed Mother of Learning reset table (default scoped restart; the canonical loop read is pending)',
    resets: ['Your body, health and money', 'Items you hold, including the guest pass (it returns to Ilsa’s stock)', 'Quests and Cyoria’s own state and date',
        'The keyed-lamp operator training and formula study (they live in Cyoria’s state)'],
    carries: ['Cheats and preferences', 'Memories and the record of past lives', 'Trained aptitude in Literacy, Crafting, Smelting and Forging', 'Other worlds and the Village, which keep running']});
export const loopView = expansion => loopReadout(WORLD, ownSkill(expansion).map(r => r.label));
