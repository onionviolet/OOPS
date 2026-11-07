// LOTM source for the positions projection (FD15). Read-only: it derives rows from the life profile data
// (book_world_lotm_lives.js) and facts the branch already keeps; nothing is written.
// Facts read: state.lotm.entryProfile, state.actors.player.worldId, actors.player.facts['book.lotm.contract.signed'],
// and the 'book.lotm.contract' knowledge note's `.at` (the signing time, as weeksOwed reads it).
// Mapping is an authored proposal: the civil post is 'contracted' (5-year term, pay, lifetime secrecy); a probationer is 'enrolled'
// on the Beyonder track with no fixed term. The civil term ends termYears game years after signing (a game year is 12 months of 30 days, the
// calendar's own length). How a post ENDED is the one saved fact (positions@1, positions.js); everything else here stays derived.
import {LOTM_IDS as I, LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {LOTM_PROFILES,CIVIL_POSITION_ID,LOTM_WEEK_MINUTES} from './book_world_lotm_lives.js';
import {LOTM_CIVIL_DUTY_ID} from './book_world_lotm_duties.js';
import {districtById} from './book_world_lotm_districts.js';
import {registerPositionSource,withExit} from './positions.js';
import {guardRows,guardPayWords} from './book_world_lotm_guard.js';

const TEAM_OF = home => (home === 'evernight' ? 'Nighthawks' : districtById(home)?.team || home);
const SOURCE = 'book_world_lotm_lives.js';
const WORDS = {0: 'no', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve'};
const words = n => WORDS[n] ?? String(n);
export const LOTM_YEAR_MINUTES = 12 * 30 * 24 * 60;
// Resignation cost (default and dial): the clerk leaves at once; the week in progress is forfeited as the notice not given, weeks already
// served stay collectible, the office report stops, the lodging rent does not. Reason: a clerk who walks out mid-week forfeits that week.
// Dial: a longer notice (pay through it) is a later per-post number; rehire after leaving is not modelled.
export const CIVIL_RESIGN_COST = 'Resigning ends your pay at once and forfeits the week in progress; weeks already served stay yours to collect. The weekly office report stops, your lodging rent still falls due, and the secrecy binds for life.';
const RESIGN_REASON = 'Resigned the civil staff post without notice; the week in progress was forfeited.';

// One builder for both entry points: state (positionsOf) and the panel's view, which carries the same two facts.
function rowsFor(profileKey, contractAt) {
    const profile = LOTM_PROFILES[profileKey];
    if (!profile) return [];
    const institution = TEAM_OF(profile.home);
    if (profile.contract) {
        if (contractAt === null) return [];
        const c = profile.contract;
        return [withExit({id: CIVIL_POSITION_ID, institution, role: 'Civil staff', rank: 'clerk',
            term: {type: 'contracted', startedAt: contractAt, years: c.termYears, endsAt: contractAt + c.termYears * LOTM_YEAR_MINUTES},
            pay: {amount: c.weeklyPence, unit: 'pence', period: 'week'}, duties: [LOTM_CIVIL_DUTY_ID],
            exit: {kinds: ['resign'], cost: CIVIL_RESIGN_COST}, source: SOURCE})];
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
    return [...rowsFor(key, signed ? (Number.isFinite(at) ? at : 0) : null), ...guardRows(state)];
}
// The panel view holds entryProfile and the contract note record (id, at); same rows as lotmPositions.
export function lotmPositionsFromView(v) {
    const note = v?.records?.find(r => r.id === 'book.lotm.contract');
    return [...rowsFor(profileKeyOfId(v?.entryProfile), note ? (Number.isFinite(note.at) ? note.at : 0) : null), ...(v?.guard?.rows || [])]; // guard rows come from the host, derived from state
}
// "four years and 11 months left": whole months (30 days) and years, rounded down; under a month it says so.
export function termLeftWords(endsAt, now) {
    const days = Math.floor((endsAt - now) / (24 * 60));
    if (days <= 0) return 'the term has run out';
    const months = Math.floor(days / 30), y = Math.floor(months / 12), m = months % 12;
    if (!months) return 'less than a month left';
    const parts = [y ? `${words(y)} year${y === 1 ? '' : 's'}` : '', m ? `${m} month${m === 1 ? '' : 's'}` : ''].filter(Boolean);
    return `${parts.join(' and ')} left`;
}
// A short hire counts in weeks: "five weeks left", "less than a week left".
export function weeksLeftWords(endsAt, now) {
    const left = endsAt - now;
    if (left <= 0) return 'the term has run out';
    const w = Math.floor(left / LOTM_WEEK_MINUTES);
    return w ? `${words(w)} week${w === 1 ? '' : 's'} left` : 'less than a week left';
}
// Plain words, for example "Civil staff, Nighthawks: contract, 3 pounds a week, five years. Four years and 11 months left."
// `now` (minutes) adds the term left to a live post; an ended post says how it ended instead. Without `now` the base line is unchanged.
export function lotmPositionLine(rows, now) {
    return rows.map(r => {
        const parts = [];
        if (r.term.type === 'contracted') parts.push('contract');
        if (r.term.type === 'hired') parts.push('hired');
        if (r.pay?.unit === 'pence') parts.push(`${r.pay.amount % P.pound ? guardPayWords(r.pay.amount) : `${r.pay.amount / P.pound} pounds`} a ${r.pay.period}`);
        if (r.term.years) parts.push(`${words(r.term.years)} years`);
        if (r.term.weeks) parts.push(`${words(r.term.weeks)} weeks`);
        let line = `${r.role}, ${r.institution}${parts.length ? `: ${parts.join(', ')}` : ''}`;
        if (r.ended) {
            const w = Math.max(0, Math.floor((r.ended.at - r.term.startedAt) / LOTM_WEEK_MINUTES));
            line += `. Ended: ${r.ended.kind === 'resign' ? 'you resigned' : r.ended.kind === 'term_end' ? 'the hire ran its term' : r.ended.kind} after ${w} week${w === 1 ? '' : 's'}`;
        } else if (now != null && Number.isFinite(r.term.endsAt)) {
            const left = r.term.weeks ? weeksLeftWords(r.term.endsAt, now) : termLeftWords(r.term.endsAt, now);
            line += `. ${left[0].toUpperCase()}${left.slice(1)}`;
        }
        return line + (r.ended || (now != null && Number.isFinite(r.term.endsAt)) ? '.' : '');
    }).join('; ');
}
// Is this duty still held by a live (not ended) post? The duty set's `active` reads this, so ending a post ends its duties through the duties seam.
export const lotmDutyHeld = (state, dutyId) => lotmPositions(state).some(r => !r.ended && r.duties?.includes(dutyId));
// The one exit the civil post offers. Pure: names the row to leave and the record to write; the host does the saving. Throws the player-facing reason.
export function lotmResignPlan(state) {
    const row = lotmPositions(state).find(r => r.id === CIVIL_POSITION_ID);
    if (!row) throw new Error('You hold no post to resign.');
    if (row.ended) throw new Error('You already resigned this post; there is nothing left to resign.');
    return {row, exit: {kind: 'resign', at: state.clock, reason: RESIGN_REASON}};
}
registerPositionSource('lotm', lotmPositions);
