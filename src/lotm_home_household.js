import {homeMarketActions} from './home_market_actions.js';
// W1d, LT10 read side (proposal under AD32, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md): Klein's rented flat as a home view, from LOTM's own data.
// Read side only: who lives there (the pack's people, shown once the player knows them), the rent the existing rent duty says is owed,
// and what the flat's stock views hold. The data goes through the shared home overview's world port (worldHomeModel), so the
// model and its words are the same ones every world's home reads; this file only gathers LOTM's own data.
// Default: the flat is the be-life's start place. Pack people are matched by index id, never by prose.
import {timeWords, worldHomeModel, homeModelLines} from './home_overview_model.js';
import {castKnown} from './book_world_lotm_cast_host.js';
import {placeStockViews} from './place_acts.js';
import {LOTM_RENT, LOTM_RENT_ID} from './book_world_lotm_duties.js';
import {LOTM_PENCE} from './book_world_lotm_ids.js';
import {LOTM_FLAT_HOME, LOTM_FLAT_PLACE, LOTM_HOME_FURNITURE, LOTM_HOME_ROOMS} from './lotm_home_world.js';
import {homeKey} from './home_content.js';

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

export function lotmHomeView(state, {pack, duties, homes = null, quote = null} = {}) {
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
    const model = worldHomeModel({homeId: LOTM_FLAT_HOME, here: state?.simulation?.people?.player?.location === placeId, place: {id: placeId, name: placeName}, tenure: 'rented',
        residents: residents.map(r => ({...r, self: r.relation === 'you'})),
        dues: [{id: LOTM_RENT_ID, label: 'Rent', words: rent.line, warn: rent.owed > 0, next: rent.owed > 0 ? 'Pay the rent when you can.' : undefined}],
        stores: stored}, homes);
    const lines = homeModelLines(model);
    // W3a-S3: once the flat is a home in the shared engine, its fittings and storage are the engine's, read from its own record.
    const flat = homes?.state?.properties?.[LOTM_FLAT_HOME] || null;
    if(flat) {
        const fitted = Object.values(flat.fixtures).map(r => {
            const f = LOTM_HOME_FURNITURE[JSON.parse(r.key).id];
            return f ? `${f.name}${r.owner === 'player' ? '' : ' (the landlord\u2019s)'}` : null;
        }).filter(Boolean);
        lines.push(fitted.length ? `Fitted: ${fitted.join(', ')}.` : 'Nothing is fitted yet.');
    }
    return {place: {id: placeId, name: placeName}, residents, rent, stored, lines, model, settled: !!flat, actions: [...homeActions(state, {flat, quote}),...homeMarketActions(state,homes,quote)]};
}

// The home acts this place offers, quoted through the home engine (one authority for what is allowed and what it costs).
// At the flat before it is a home: take it up. At a market that sells them: the pieces sold there. At the flat with a piece in hand: fit it.
function homeActions(state, {flat, quote}) {
    if(typeof quote !== 'function') return [];
    const at = state?.simulation?.people?.player?.location, rows = [];
    const offer = (id, label, request) => { const q = quote(request); rows.push({id, label, request, eligible: q.eligible, reason: q.eligible ? '' : q.reason}); };
    if(!flat && at === LOTM_FLAT_PLACE) offer('settle', 'Make the flat your home in this life', {type: 'settle_world_home', home: LOTM_FLAT_HOME});
    for(const [id, f] of Object.entries(LOTM_HOME_FURNITURE)) if(f.soldAt?.includes(at))
        offer(`buy:${id}`, `Buy a ${f.name.toLowerCase()} \u00b7 ${f.price} pence`, {type: 'buy', item: id});
    if(flat && at === LOTM_FLAT_PLACE) for(const [id, r] of Object.entries(LOTM_HOME_ROOMS)) if(!flat.improvements.includes(id)) offer(`improve:${id}`, `${r.name} · ${r.minutes} min`, {type: 'improve', home: LOTM_FLAT_HOME, improvement: id});
    if(flat) for(const [id, f] of Object.entries(LOTM_HOME_FURNITURE)) if(f.soldAt && !flat.fixtures[f.slot] && quote({type: 'install', key: homeKey(id)}).eligible)
        offer(`install:${id}`, `Fit the ${f.name.toLowerCase()} in the flat`, {type: 'install', key: homeKey(id)});
    return rows;
}
