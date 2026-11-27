import {LOTM_BE_ACTING_ROWS} from './lotm_be_acting.js';
import {SHIFT_NOTE} from './book_world_lotm_shift.js';
import {WAGE_START_NOTE, nextWageWeek, wageWords} from './book_world_lotm_wage.js';
import {formatDuration} from './number_format.js';
import {beClientView} from './book_world_lotm_be_clients.js';
import {officeFollowupView,OFFICE_CHART_CLIENT} from './lotm_office_followup.js';

export const LOTM_RENT_RECEIPT = 'book.lotm.rent.last_payment';

export function officeCustomerLines(state) {
    return beClientView(state).clients.map(client => {
        const settlement = client.status === 'paid' ? `paid ${wageWords(client.feePence)}`
            : client.status === 'served_unpaid' ? 'no fee taken' : 'no service completed';
        const followup=client.id===OFFICE_CHART_CLIENT?officeFollowupView(state):null;
        return `${client.label}: ${client.service} · ${settlement}${client.favor > 0 ? ' · remembers your help' : ''}${followup?` · ${followup.reason}`:''}`;
    });
}

const seerReading = id => LOTM_BE_ACTING_ROWS.some(row => id.startsWith(`${row}.`));
const seerStudy = id => id.startsWith('lotm.be.lesson.') || id.startsWith('lotm.be.office.') || seerReading(id);
const seerPractice = id => seerStudy(id) || id.startsWith('lotm.be.club.');

export function officePracticeRows(divinations = [], jobs = []) {
    const groups = new Map();
    for (const act of divinations) {
        if (!seerPractice(act.id)) continue;
        const running = jobs.find(job => job.commandId === act.id);
        if (act.record && !act.eligible && !running) continue;
        const prior = groups.get(act.queryId);
        if (!prior || running || (!prior.running && act.eligible && !prior.eligible)) groups.set(act.queryId, {...act, running});
    }
    const rows = [...groups.values()];
    const available = rows.filter(row => row.eligible || row.running);
    return available.length ? available : rows.slice(0, 2);
}

export function officeRecap(state, wage) {
    const notes = state.simulation?.knowledge?.player || {};
    const practice = Object.entries(notes).filter(([key]) => key.startsWith('divination.') && seerStudy(key.slice('divination.'.length)))
        .map(([, note]) => note).sort((a, b) => b.at - a.at)[0];
    // A shift can close the rent week. A pay collection right after it shares that clock minute.
    const pay = notes[`book.lotm.wage.week${wage.paid}`] ?? notes[WAGE_START_NOTE];
    return [pay, notes[LOTM_RENT_RECEIPT], notes[SHIFT_NOTE], practice]
        .filter(note => typeof note?.value === 'string').sort((a, b) => b.at - a.at).map(note => note.value);
}

export function officeBudget(wage, rent) {
    const {withheld, takeHome} = nextWageWeek(wage);
    const lines = [`Next week: ${wageWords(wage.weeklyPence)} pay${withheld ? ` · ${wageWords(withheld)} kept for the advance` : ''} · ${wageWords(takeHome)} to you`];
    if (rent && Number.isFinite(rent.amount)) {
        const remaining = takeHome - rent.amount;
        const due = rent.status === 'late' ? 'late' : `due in ${formatDuration(rent.shutsIn)}`;
        const overdue = rent.missed ? ` · ${rent.missed} ${rent.missed === 1 ? 'week' : 'weeks'} behind` : '';
        lines.push(`Rent: ${wageWords(rent.amount)} a week · ${due}${overdue}`);
        lines.push(remaining >= 0 ? `After one week’s rent: ${wageWords(remaining)}` : `Short of one week’s rent by ${wageWords(-remaining)}`);
    }
    return lines;
}
