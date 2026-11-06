// LOTM source for the positions projection (FD15). Read-only: it derives rows from the life profile data
// (book_world_lotm_lives.js) and facts the branch already keeps; nothing is written.
// Facts read: state.lotm.entryProfile, state.actors.player.worldId, actors.player.facts['book.lotm.contract.signed'],
// and the 'book.lotm.contract' knowledge note's `.at` (the signing time, as weeksOwed reads it).
// Mapping is an authored proposal: the civil post is 'contracted' (5-year term, pay, lifetime secrecy); a probationer is 'enrolled'
// on the Beyonder track with no fixed term. Term end is not derived (no year length in the branch clock). Pure data.
import {LOTM_IDS as I, LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {LOTM_PROFILES} from './book_world_lotm_lives.js';
import {districtById} from './book_world_lotm_districts.js';
import {registerPositionSource} from './positions.js';

const TEAM_OF = home => (home === 'evernight' ? 'Nighthawks' : districtById(home)?.team || home);
const SOURCE = 'book_world_lotm_lives.js';
const WORDS = {5: 'five'};

// One builder for both entry points: state (positionsOf) and the panel's view, which carries the same two facts.
function rowsFor(profileKey, contractAt) {
    const profile = LOTM_PROFILES[profileKey];
    if (!profile) return [];
    const institution = TEAM_OF(profile.home);
    if (profile.contract) {
        if (contractAt === null) return [];
        const c = profile.contract;
        return [{id: `lotm.position.${profileKey}.civil_staff`, institution, role: 'Civil staff', rank: 'clerk',
            term: {type: 'contracted', startedAt: contractAt, years: c.termYears},
            pay: {amount: c.weeklyPence, unit: 'pence', period: 'week'},
            exit: {kinds: [], cost: `Secrecy ${c.secrecy}; the term's end is not modelled yet.`}, source: SOURCE}];
    }
    if (profile.beyonderTrack) {
        return [{id: `lotm.position.${profileKey}.probationer`, institution, role: 'Probationer', rank: 'probationer',
            term: {type: 'enrolled'}, exit: {kinds: [], cost: 'Not modelled yet.'}, source: SOURCE}];
    }
    return [];
}
const profileKeyOfId = id => Object.values(LOTM_PROFILES).find(p => p.id === id)?.key || null;

export function lotmPositions(state) {
    if (state?.actors?.player?.worldId !== I.world || !state.lotm) return [];
    const key = profileKeyOfId(state.lotm.entryProfile);
    const signed = state.actors.player.facts?.['book.lotm.contract.signed'] === true;
    const at = state.simulation?.knowledge?.player?.['book.lotm.contract']?.at;
    return rowsFor(key, signed ? (Number.isFinite(at) ? at : 0) : null);
}
// The panel view holds entryProfile and the contract note record (id, at); same rows as lotmPositions.
export function lotmPositionsFromView(v) {
    const note = v?.records?.find(r => r.id === 'book.lotm.contract');
    return rowsFor(profileKeyOfId(v?.entryProfile), note ? (Number.isFinite(note.at) ? note.at : 0) : null);
}
// Plain words, for example "Civil staff, Nighthawks: contract, 3 pounds a week, five years".
export function lotmPositionLine(rows) {
    return rows.map(r => {
        const parts = [];
        if (r.term.type === 'contracted') parts.push('contract');
        if (r.pay?.unit === 'pence') parts.push(`${r.pay.amount / P.pound} pounds a ${r.pay.period}`);
        if (r.term.years) parts.push(`${WORDS[r.term.years] || r.term.years} years`);
        return `${r.role}, ${r.institution}${parts.length ? `: ${parts.join(', ')}` : ''}`;
    }).join('; ');
}
registerPositionSource('lotm', lotmPositions);
