// Living bodies on the world substrate (chat L, phase 2, 2026-11-12; proposal under AD56).
// Every living body in a place, whatever its kind (a pet, a ewe, a wild fox, a Gu),
// carries `satiety`: ration-minutes left in it, draining at its kind's food rate.
// Feeding is an outside `add` of satiety (a host's meal, a K working's effect). When a
// body runs empty it publishes `living.hungry` once into its place, so an actor or a
// predator nearby can answer it (O3). Hits and backlash published into a place for a
// body (`living.harm`, detail {target, kind, amount}) go to that body's harm inbox;
// the host drains the inbox into the lifecycle with applyBodyHarm, which stays the
// one authority for wounds. No other pack is imported (PFP10, WSC1).
//
// When a body sits on the substrate, its satiety is the hunger authority:
// living_body.js readLivingBody takes {satiety, emptySince} and reads the same need
// stage as a host's minutes-since-meal would (one hunger source, not two).
// This pack is the one declarer of satiety. A second pack reads it now (A's wild
// agency, which declares nothing and keeps its own fullness as row data), so the
// move to world_quantities.js is an open request to chat W.
export const SATIETY = Object.freeze({id: 'satiety', unit: 'ration-minute', min: 0, max: 1_000_000});

const isBody = holder => holder.kind === 'body' && holder.tags.includes('living.body');
const whole = n => Number.isSafeInteger(n) && n >= 0;

/** Holder state for one body: its kind, its food rate per minute (0 never hungers). */
export function livingBodyState({species, rate}) {
    if (typeof species !== 'string' || !species || !whole(rate)) throw new Error('Living body: species and a whole food rate.');
    return {species, rate, hungry: false, emptySince: null, inbox: []};
}

// A dose transfers liquid volume. The flask's active account records its
// concentration, and the body turns its absorbed share into lost responsiveness.
function doseResponse({liquid, active, baseline, suppressionPerUnit, recoveryPerMinute}) {
    if (!liquid?.startsWith('energy:') || !active?.startsWith('energy:') || liquid === active ||
        ![baseline, suppressionPerUnit, recoveryPerMinute].every(n => whole(n) && n > 0))
        throw new Error('Living body: invalid dose response settings.');
    const response = 'responsiveness';
    const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
    return {
        quantities: [{id: response, unit: 'response-unit', min: 0, max: baseline}],
        reads: ['energy', response], writes: ['energy', response],
        hears: ['effect.move'],
        laws: [{
            id: 'response-recovery',
            appliesTo: h => isBody(h) && response in h.quantities,
            rates: (view, id) => view.amount(id, response) < baseline
                ? [{holder: id, quantity: response, perMinute: recoveryPerMinute}] : [],
        }],
        reactors: [{
            id: 'liquid-uptake', on: ['effect.move'], appliesTo: isBody,
            react: (view, id, effect) => {
                const {target: flask, object, to, amount} = effect.detail ?? {};
                if (to !== id || object !== liquid || !whole(amount) || amount === 0 ||
                    !view.has(id, liquid) || !view.has(id, response) ||
                    view.holder(flask)?.kind !== 'thing' || !view.has(flask, active)) return [];
                const before = view.amount(flask, liquid) + amount;
                const available = view.amount(flask, active);
                if (available > before) throw new Error('Living body: active material exceeds liquid volume.');
                const absorbed = Number(BigInt(available) * BigInt(amount) / BigInt(before));
                const loss = Math.min(view.amount(id, response), absorbed * suppressionPerUnit);
                return [
                    add(id, liquid, -amount),
                    ...(absorbed ? [add(flask, active, -absorbed), add(id, response, -loss)] : []),
                ];
            },
        }],
    };
}

export function createLivingBodyPack({inboxLimit = 16, dose} = {}) {
    const response = dose ? doseResponse(dose) : {quantities: [], reads: [], writes: [], hears: [], laws: [], reactors: []};
    return {
        id: 'l.living_body', revision: 0,
        quantities: [SATIETY, ...response.quantities],
        reads: ['satiety', ...response.reads], writes: ['satiety', ...response.writes],
        publishes: ['living.hungry'], hears: ['living.harm', ...response.hears],
        laws: [{
            id: 'appetite', appliesTo: isBody,
            rates: (view, id) => {
                const s = view.state(id);
                return s.rate > 0 && view.amount(id, 'satiety') > 0 ? [{holder: id, quantity: 'satiety', perMinute: -s.rate}] : [];
            },
            watches: (view, id) => [{holder: id, quantity: 'satiety', op: 'lte', value: 0}],
            decide: (view, id) => {
                const s = view.state(id), empty = s.rate > 0 && view.amount(id, 'satiety') <= 0;
                if (empty === s.hungry) return [];
                return [{op: 'state', holder: id, value: {...s, hungry: empty, emptySince: empty ? view.clock : null}},
                    ...(empty ? [{op: 'publish', kind: 'living.hungry', place: view.placeOf(id), detail: {species: s.species}}] : [])];
            },
        }, ...response.laws],
        reactors: [{
            id: 'harm-inbox', on: ['living.harm'], appliesTo: isBody,
            react: (view, id, effect) => {
                const {target, kind, amount} = effect.detail ?? {};
                if (target !== id || typeof kind !== 'string' || !whole(amount) || amount === 0) return [];
                const s = view.state(id);
                const inbox = [...s.inbox, {at: view.clock, kind, amount, by: effect.by}].slice(-inboxLimit);
                return [{op: 'state', holder: id, value: {...s, inbox}}];
            },
        }, ...response.reactors],
    };
}
