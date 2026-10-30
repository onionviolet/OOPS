// World-neutral recurring gatherings (GM30). Seats hide the personas behind them; standing controls admission, and an offer may
// deliberately reveal its owner's persona. Trades return exchange receipts for the host to apply, not inventory or save changes (AR3).
import {check, natural, object, deepFreeze} from './basics.js';
import {standingOf, emptyPersonas} from './persona_standing.js';
import {happenedOn} from './world_events.js';
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v);
export function defineGathering(row) {
    check(object(row) && id(row.id) && id(row.world) && typeof row.label === 'string' && row.label.trim(), 'Invalid gathering.');
    const s = row.schedule;
    check(object(s) && natural(s.everyDays) && s.everyDays > 0 && natural(s.offset) && natural(s.hour) && s.hour < 24, 'Invalid gathering schedule.');
    check(row.eventId === undefined || id(row.eventId), 'Invalid gathering event.');
    check(Array.isArray(row.seats), 'Invalid gathering seats.');
    const seats = new Set(), personas = new Set();
    for(const seat of row.seats) {
        check(object(seat) && id(seat.id) && id(seat.personaId) && !seats.has(seat.id) && !personas.has(seat.personaId), 'Invalid or duplicate gathering seat.');
        const gate = seat.minStanding;
        check(gate === undefined || (object(gate) && id(gate.region) && Number.isFinite(gate.atLeast)), 'Invalid gathering standing gate.');
        seats.add(seat.id);
        personas.add(seat.personaId);
    }
    check(row.dial === undefined || object(row.dial), 'Invalid gathering dial.');
    const secrecy = row.dial?.secrecy ?? 1;
    check(Number.isFinite(secrecy) && secrecy >= 0 && secrecy <= 1, 'Invalid gathering secrecy.');
    return deepFreeze(structuredClone({...row, dial: {...row.dial, secrecy}}));
}
export function meetsOn(g, day, {book = null} = {}) {
    check(natural(day), 'Invalid gathering day.');
    return day >= g.schedule.offset && (day - g.schedule.offset) % g.schedule.everyDays === 0 &&
        (!g.eventId || !book || happenedOn(book, day).some(e => e.id === g.eventId));
}
export function seatsOn(g, day, {absent = [], personas = emptyPersonas()} = {}) {
    check(natural(day) && Array.isArray(absent), 'Invalid gathering attendance.');
    return g.seats.filter(s => !absent.includes(s.personaId) && (!s.minStanding || standingOf(personas, s.personaId, s.minStanding.region) >= s.minStanding.atLeast))
        .map(s => ({seatId: s.id, label: s.id}));
}
// give belongs to from; take belongs to to. Each offer's reveal:true names that seat's persona, never its body.
// exchanged.from and exchanged.to list what each seat receives. state and personas are host-owned; no balances are changed here.
export function trade(g, state, {from, to, give, take, personas} = {}) {
    const a = g.seats.find(s => s.id === from), b = g.seats.find(s => s.id === to), reasons = [];
    if(!a || !b) reasons.push('Unknown gathering seat.');
    if(from === to) reasons.push('A seat cannot trade with itself.');
    const offer = v => object(v) && ['fact', 'item', 'favour'].includes(v.kind) && id(v.key) &&
        (v.qty === undefined || (natural(v.qty) && v.qty > 0)) && (v.reveal === undefined || typeof v.reveal === 'boolean');
    if(!offer(give) || !offer(take)) reasons.push('Both sides must offer a fact, item or favour with a key and a positive quantity.');
    const ok = reasons.length === 0;
    const receipt = v => ({kind: v.kind, key: v.key, ...(v.qty === undefined ? {} : {qty: v.qty})});
    return {ok, reasons, exchanged: {from: ok ? [receipt(take)] : [], to: ok ? [receipt(give)] : []},
        exposed: ok ? [give.reveal === true ? {seatId: a.id, personaId: a.personaId} : null, take.reveal === true ? {seatId: b.id, personaId: b.personaId} : null].filter(Boolean) : [],
        ...(g.dial.secrecy < 1 ? {risk: 1 - g.dial.secrecy} : {})};
}
export function leave(g, seatId, {revealed = []} = {}) {
    check(g.seats.some(s => s.id === seatId) && Array.isArray(revealed), 'Invalid gathering departure.');
    return {seatId, bodyRevealed: revealed.includes(seatId)};
}
