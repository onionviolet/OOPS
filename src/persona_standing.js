// World-neutral persona standing (GM24, WA43). A persona is a face with its own standing, keyed by persona id and not by body. The
// link (0..1) is how well observers connect the persona to the body; exposure at or above an observer's notice leaks a share of the
// persona's standing onto the body. State is plain data this module returns; a host owns where it is saved (AR3, AR12).
import {check, finite, object, deepFreeze} from './basics.js';
import {rankOf} from './faction_rank.js';
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
export const LEAK = Object.freeze({share: 0.5, why: 'People who learn two faces are one person carry part of the first face\'s name onto the second; half is a default, not a law.'});
export const emptyPersonas = () => ({schema: 1, personas: {}});
export function addPersona(state, {id: pid, bodyId, link = 0}) {
    check(id(pid) && id(bodyId) && Number.isFinite(link) && link >= 0 && link <= 1, 'Invalid persona.');
    check(!state.personas[pid], 'Persona already exists.');
    return {...state, personas: {...state.personas, [pid]: {id: pid, bodyId, link, standing: {}, exposedTo: []}}};
}
export const standingOf = (state, pid, region) => state.personas[pid]?.standing[region] ?? 0;
export function changeStanding(state, pid, region, delta) {
    const p = state.personas[pid];
    check(p && id(region) && finite(delta), 'Invalid standing change.');
    return {...state, personas: {...state.personas, [pid]: {...p, standing: {...p.standing, [region]: standingOf(state, pid, region) + delta}}}};
}
/** The band one observer holds toward a persona in a region. An observer who knows the link also sees the body's own standing. */
export function attitudeOf(state, pid, region, {bodyStanding = {}, knowsLink = false} = {}) {
    const p = state.personas[pid];
    check(p, 'Unknown persona.');
    const own = standingOf(state, pid, region);
    const value = knowsLink ? own + Math.round((bodyStanding[region] || 0) * p.link) : own;
    return {persona: pid, region, ...rankOf(region, value), basis: knowsLink ? 'persona and linked body' : 'persona only'};
}
/** Exposure: observers learn the link. Leaks standing from persona to body when link >= notice. Returns {state, leaked}. */
export function expose(state, pid, region, {notice = 0.5, observerId} = {}) {
    const p = state.personas[pid];
    check(p && id(observerId), 'Invalid exposure.');
    if(p.exposedTo.includes(observerId)) return {state, leaked: 0};
    const next = {...p, exposedTo: [...p.exposedTo, observerId]};
    const leaked = p.link >= notice ? Math.round(standingOf(state, pid, region) * LEAK.share) : 0;
    return {state: {...state, personas: {...state.personas, [pid]: next}}, leaked, bodyId: p.bodyId};
}
