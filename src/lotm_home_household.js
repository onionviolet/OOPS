// W1d, LT10 read side (proposal under AD32, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md): Klein's rented flat as a home view, from LOTM's own data.
// Read side only: who lives there (the pack's people, shown once the player knows them), the rent the existing rent duty says is owed,
// and what the flat's stock views hold. The shared home overview (home_overview_model.homeOverviewModel) reads projectHomes() of the
// native home state and cannot take world residents, dues or stores, so this is a thin adapter; only timeWords is reused from it.
// Default: the flat is the be-life's start place. Pack people are matched by index id, never by prose.
import {timeWords} from './home_overview_model.js';
import {castKnown} from './book_world_lotm_cast_host.js';
import {placeStockViews} from './place_acts.js';
import {LOTM_RENT, LOTM_RENT_ID} from './book_world_lotm_duties.js';
import {LOTM_PENCE} from './book_world_lotm_ids.js';

export const FLAT_RESIDENTS = Object.freeze([
    Object.freeze({indexId: 'lotm.person.klein-moretti', relation: 'you', self: true}),
    Object.freeze({indexId: 'lotm.person.benson', relation: 'your elder brother'}),
    Object.freeze({indexId: 'lotm.person.melissa', relation: 'your younger sister'})]);

const soli = pence => { const n = Math.round(pence / LOTM_PENCE.soli); return `${n} soli`; };

function rentOf(duties) {
    const def = LOTM_RENT.find(d => d.id === LOTM_RENT_ID), week = def.dues.amount;
    const item = (duties?.items || []).find(i => i.id === LOTM_RENT_ID);
    if(!item) return {owed: 0, dueIn: null, line: `Your rent is ${soli(week)} a week and nothing is owed right now.`};
    const behind = item.missed || 0, thisWeek = item.status === 'due' ? 1 : 0;
    const owed = (behind + thisWeek) * week, dueIn = Number.isFinite(item.shutsIn) ? item.shutsIn : null;
    let line;
    if(behind) line = `You are ${behind} ${behind === 1 ? 'week' : 'weeks'} behind on the rent: ${soli(owed)} owed.`;
    else if(item.status === 'late') line = `This week's rent of ${soli(week)} is late.`;
    else line = `This week's rent of ${soli(week)} is due${dueIn === null ? '' : ` in ${timeWords(dueIn)}`}.`;
    if(item.escalation) line += ` ${item.escalation}`;
    if(item.seizureWaiting) line += ` ${item.seizureWaiting}`;
    return {owed, dueIn, line};
}

export function lotmHomeView(state, {pack, duties} = {}) {
    const placeId = pack?.leadLife?.profile?.start || null;
    const place = (pack?.places || []).find(p => p.id === placeId);
    const placeName = place?.name || 'Your rented flat';
    const residents = FLAT_RESIDENTS.flatMap(r => {
        const p = (pack?.people || []).find(x => x.indexId === r.indexId);
        if(!p || !(r.self || castKnown(state, p.id))) return [];
        return [{id: p.id, name: p.name, relation: r.relation}];
    });
    const rent = rentOf(duties);
    const stored = (placeStockViews(state, pack?.householdActs) || []).flatMap(v => v.rows)
        .filter(r => Number.isFinite(r.amount) && r.amount > 0).map(r => ({label: r.label, count: r.amount}));
    const others = residents.filter(r => r.relation !== 'you');
    const lines = [others.length ? `${others.map(r => `${r.name} (${r.relation})`).join(' and ')} live${others.length === 1 ? 's' : ''} here with you.` : 'You live here on your own, as far as you know.',
        rent.line,
        stored.length ? `Kept here: ${stored.map(s => `${s.label} (${s.count})`).join(', ')}.` : 'Nothing is kept here that you know of.'];
    return {place: {id: placeId, name: placeName}, residents, rent, stored, lines};
}
