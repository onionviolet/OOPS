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
// Satiety stays a pack quantity (WSC2) until a second pack reads it (A's wants, M's
// want rates); then it moves to world_quantities.js as a request to chat W.
export const SATIETY = Object.freeze({id: 'satiety', unit: 'ration-minute', min: 0, max: 1_000_000});

const isBody = holder => holder.kind === 'body' && holder.tags.includes('living.body');
const whole = n => Number.isSafeInteger(n) && n >= 0;

/** Holder state for one body: its kind, its food rate per minute (0 never hungers). */
export function livingBodyState({species, rate}) {
    if (typeof species !== 'string' || !species || !whole(rate)) throw new Error('Living body: species and a whole food rate.');
    return {species, rate, hungry: false, inbox: []};
}

export function createLivingBodyPack({inboxLimit = 16} = {}) {
    return {
        id: 'l.living_body', revision: 0,
        quantities: [SATIETY], reads: ['satiety'], writes: ['satiety'],
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
                return [{op: 'state', holder: id, value: {...s, hungry: empty}},
                    ...(empty ? [{op: 'publish', kind: 'living.hungry', place: view.placeOf(id), detail: {species: s.species}}] : [])];
            },
        }],
        reactors: [{
            id: 'harm-inbox', on: ['living.harm'], appliesTo: isBody,
            react: (view, id, effect) => {
                const {target, kind, amount} = effect.detail ?? {};
                if (target !== id || typeof kind !== 'string' || !whole(amount) || amount === 0) return [];
                const s = view.state(id);
                const inbox = [...s.inbox, {at: view.clock, kind, amount, by: effect.by}].slice(-inboxLimit);
                return [{op: 'state', holder: id, value: {...s, inbox}}];
            },
        }],
    };
}
