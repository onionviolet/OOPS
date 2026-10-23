// Vows (gap G47). A vow trades freedom for strength: while kept it adds a
// permille bonus to a named track; broken, it stops paying and leaves a scar
// (pressure the breakthrough trial reads, src/breakthrough_trial.js). Nothing
// forbids a vow or breaking one: the price is the rule (AD38). Rules are data
// per world; the save slice `progression.vows@1` is plain JSON.
// Pure. Not wired into live gameplay yet.
import {natural as nat, positive as pos} from './basics.js';

export const VOW_FAMILY = 'progression.vows@1';
const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);

// spec vow: {id, text, track, bonus:permille, scar:pressure points, reason}
export function defineVowRules(spec) {
    const vows = {};
    for(const v of spec.vows ?? []) {
        if(vows[text(v.id, 'Vow ID')]) fail(`Duplicate vow ${v.id}.`);
        if(!pos(v.bonus) || !pos(v.scar)) fail(`Vow ${v.id} needs a positive bonus and scar.`);
        vows[v.id] = Object.freeze({id: v.id, text: text(v.text, 'Vow text'), track: text(v.track, 'Vow track'), bonus: v.bonus, scar: v.scar, reason: text(v.reason, 'Vow reason')});
    }
    return Object.freeze({id: text(spec.id, 'Rules ID'), revision: pos(spec.revision) ? spec.revision : fail('Revision must be positive.'),
        maxKept: spec.maxKept ?? 3, vows: Object.freeze(vows)});
}
export const createVowState = () => ({family: VOW_FAMILY, kept: {}, broken: {}});

export function takeVow(rules, state, id, at) {
    if(!rules.vows[id]) fail(`Unknown vow ${id}.`);
    if(!nat(at)) fail('Vows are taken at a game minute.');
    if(state.kept[id]) fail(`Vow ${id} is already kept.`);
    if(Object.keys(state.kept).length >= rules.maxKept) fail(`Only ${rules.maxKept} vows can be kept at once.`);
    return {...state, kept: {...state.kept, [id]: {at}}};
}
// Breaking is allowed; the scar lands now and does not heal by itself.
export function breakVow(rules, state, id, at) {
    if(!state.kept[id]) fail(`Vow ${id} is not kept.`);
    const {[id]: _, ...kept} = state.kept;
    return {...state, kept, broken: {...state.broken, [id]: {at, scar: rules.vows[id].scar}}};
}
// Permille bonus per track from kept vows.
export function vowBonuses(rules, state) {
    const out = {};
    for(const id of Object.keys(state.kept)) { const v = rules.vows[id]; out[v.track] = (out[v.track] ?? 0) + v.bonus; }
    return out;
}
export const vowScar = state => Object.values(state.broken).reduce((n, b) => n + b.scar, 0);

export function validateVowState(rules, state) {
    if(state?.family !== VOW_FAMILY) fail('Unsupported vow state.');
    for(const [id, e] of [...Object.entries(state.kept), ...Object.entries(state.broken)]) if(!rules.vows[id] || !nat(e.at)) fail(`Invalid vow record ${id}.`);
    if(Object.keys(state.kept).length > rules.maxKept) fail('Too many kept vows.');
    return state;
}
