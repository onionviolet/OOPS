// World-neutral second-city kit (GM22, WA48, SR1-SR24). A region record lists its arrival, institutions with services, offices, errands
// and a price list; readRegion turns it into the read model the Maps, Economy, Worlds and Organizations views consume. Pure data and pure
// functions: no clock, location, purse or save (AR3, AR12). Rank is faction_rank.js's derived band over the region's own reputation.
import {check, natural, object, deepFreeze} from './basics.js';
import {rankOf, ladderFor} from './faction_rank.js';
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const text = v => typeof v === 'string' && v.length > 0;
const LABELS = ['S', 'T', 'I'];
const hoursOk = h => h === undefined || h === null || Array.isArray(h) && h.length === 2 && h.every(Number.isInteger) && h[0] >= 0 && h[0] < 24 && h[1] >= 0 && h[1] <= 24 && h[0] !== h[1];
const unique = (rows, what) => {const s = new Set(); for(const r of rows) {check(object(r) && id(r.id) && !s.has(r.id), `Invalid or duplicate ${what} id.`); s.add(r.id);} return s;};
const amountOk = a => a === 'unstated' || natural(a);
export const isOpen = (hours, hour) => !hours || (hours[0] < hours[1] ? hour >= hours[0] && hour < hours[1] : hour >= hours[0] || hour < hours[1]);
export const hoursText = hours => hours ? `${hours[0]}:00-${hours[1]}:00` : 'always open';
export const priceText = (amount, unit) => amount === 'unstated' || amount === undefined ? 'price not recorded' : amount === 0 ? 'free' : `${amount} ${unit || 'money'}`;

export function defineRegion(row) {
    check(object(row) && id(row.id) && id(row.world) && text(row.label), 'Invalid region.');
    const dial = {strictness: 1, hazard: 1, priceLevel: 1, ...(row.dial || {})};
    check(Object.values(dial).every(v => Number.isFinite(v) && v >= 0), 'Invalid region dial.');
    const arrival = row.arrival;
    check(object(arrival) && id(arrival.id) && text(arrival.text) && (arrival.from === undefined || id(arrival.from)), 'A region needs an arrival.');
    const places = row.places || [], institutions = row.institutions || [], offices = row.offices || [], errands = row.errands || [], prices = row.prices || [];
    const placeIds = unique(places, 'place'), instIds = unique(institutions, 'institution');
    unique(offices, 'office'); unique(errands, 'errand'); unique(prices, 'price'); unique(row.customs || [], 'custom');
    for(const p of places) check(text(p.label) && hoursOk(p.hours), `Invalid place ${p.id}.`);
    const ladder = ladderFor(row.id).map(r => r.id);
    for(const i of institutions) {
        check(text(i.label) && text(i.kind) && placeIds.has(i.place) && hoursOk(i.hours), `Invalid institution ${i.id}.`);
        check(i.minRank === undefined || ladder.includes(i.minRank), `Unknown rank in ${i.id}.`);
        const s = new Set();
        for(const svc of i.services || []) {
            check(object(svc) && id(svc.id) && !s.has(svc.id) && text(svc.label) && (svc.price === undefined || amountOk(svc.price)) && (svc.minRank === undefined || ladder.includes(svc.minRank)), `Invalid service in ${i.id}.`);
            s.add(svc.id);
        }
    }
    for(const o of offices) check(instIds.has(o.institution) && text(o.label) && ladder.includes(o.minRank), `Invalid office ${o.id}.`);
    for(const e of errands) check(instIds.has(e.institution) && text(e.label) && (e.pay === undefined || amountOk(e.pay)) && (e.minRank === undefined || ladder.includes(e.minRank)), `Invalid errand ${e.id}.`);
    for(const p of prices) check(text(p.label) && amountOk(p.amount) && ['quoted', 'formula', 'proposed'].includes(p.basis), `Invalid price ${p.id}.`);
    for(const r of [arrival, ...institutions, ...offices, ...errands, ...prices]) check(r.evidence === undefined || LABELS.includes(r.evidence), `Unknown evidence label on ${r.id}.`);
    return deepFreeze(structuredClone({...row, dial, places, institutions, offices, errands, prices, customs: row.customs || [], statutes: row.statutes || []}));
}

const scaled = (amount, level) => amount === 'unstated' || amount === undefined ? amount : Math.round(amount * level);
/** ctx: {reputation, hour, money, held: office ids}. Returns the read model; every refusal carries its reason. */
export function readRegion(region, {reputation = 0, hour = 12, money = Infinity, held = []} = {}) {
    const rank = rankOf(region.id, reputation), level = region.dial.priceLevel;
    const need = (min) => {
        if(!min) return {ok: true, reason: ''};
        const want = ladderFor(region.id).findIndex(r => r.id === min);
        return rank.index >= want ? {ok: true, reason: ''} : {ok: false, reason: `Needs ${ladderFor(region.id)[want].name} standing in ${region.label}; you are ${rank.name}.`};
    };
    const places = new Map(region.places.map(p => [p.id, p]));
    const institutions = region.institutions.map(i => {
        const hours = i.hours || places.get(i.place)?.hours || null, open = isOpen(hours, hour), gate = need(i.minRank);
        return {id: i.id, label: i.label, kind: i.kind, place: i.place, enforcer: i.enforcer || null, open, hoursText: hoursText(hours),
            services: (i.services || []).map(s => {
                const price = scaled(s.price, level), sg = need(s.minRank), reasons = [];
                if(!open) reasons.push(`Closed; open ${hoursText(hours)}.`);
                if(!gate.ok) reasons.push(gate.reason);
                if(!sg.ok) reasons.push(sg.reason);
                if(natural(price) && money < price) reasons.push(`Needs ${price} money.`);
                return {id: s.id, label: s.label, price, priceText: priceText(price, s.unit), available: !reasons.length, reasons};
            })};
    });
    const offices = region.offices.map(o => {const g = need(o.minRank); return {id: o.id, label: o.label, institution: o.institution, held: held.includes(o.id), eligible: g.ok, reasons: g.ok ? [] : [g.reason]};});
    const errands = region.errands.map(e => {const g = need(e.minRank); return {id: e.id, label: e.label, institution: e.institution, eligible: g.ok, reasons: g.ok ? [] : [g.reason], payText: priceText(scaled(e.pay, level), e.unit)};});
    const priceList = region.prices.map(p => ({id: p.id, label: p.label, amount: scaled(p.amount, level), text: priceText(scaled(p.amount, level), p.unit), basis: p.basis}));
    return {id: region.id, label: region.label, rank: {id: rank.id, name: rank.name, feeling: rank.feeling, next: rank.next ? rank.next.id : null},
        arrival: {...region.arrival}, institutions, offices, errands, priceList, customs: region.customs.map(c => ({...c}))};
}
