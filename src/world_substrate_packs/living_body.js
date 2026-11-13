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
export const JUVENILE_GROWTH = Object.freeze({id: 'juvenile-growth-left', unit: 'fed-minute', min: 0, max: Number.MAX_SAFE_INTEGER});
export const JUVENILE_GROWTH_PAUSE = Object.freeze({id: 'juvenile-growth-paused-until', type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER});

const isBody = holder => holder.kind === 'body' && holder.tags.includes('living.body');
const whole = n => Number.isSafeInteger(n) && n >= 0;

/** Holder state for one body: its kind, its food rate per minute (0 never hungers). */
export function livingBodyState({species, rate}) {
    if (typeof species !== 'string' || !species || !whole(rate)) throw new Error('Living body: species and a whole food rate.');
    return {species, rate, hungry: false, emptySince: null, inbox: []};
}

const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const energyAccount = key => typeof key === 'string' && key.startsWith('energy:');

function liquidUptakeReactors(responses) {
    const byLiquid = Map.groupBy(responses, response => response.liquid);
    return [...byLiquid].map(([liquid, rows]) => ({
        id: rows[0].id, on: ['effect.move'], appliesTo: isBody,
        react(view, id, effect) {
            const {target: flask, object, to, amount} = effect.detail ?? {};
            if (to !== id || object !== liquid || !whole(amount) || amount === 0 ||
                !view.has(id, liquid) || view.holder(flask)?.kind !== 'thing') return [];
            const eligible = rows.filter(({active, account}) => view.has(id, account) && view.has(flask, active));
            if (!eligible.length) return [];
            const before = BigInt(view.amount(flask, liquid)) + BigInt(amount);
            const activeTotal = eligible.reduce((total, {active}) => total + BigInt(view.amount(flask, active)), 0n);
            if (activeTotal > before) throw new Error('Living body: active material exceeds liquid volume.');
            const ops = [add(id, liquid, -amount)];
            for (const {active, respond} of eligible) {
                const available = view.amount(flask, active);
                const absorbed = Number(BigInt(available) * BigInt(amount) / before);
                if (absorbed) ops.push(add(flask, active, -absorbed), ...respond(view, id, absorbed));
            }
            return ops;
        },
    }));
}

// A dose transfers liquid volume. The flask's active account records its
// concentration, and the body turns its absorbed share into lost responsiveness.
function doseResponse({liquid, active, baseline, suppressionPerUnit, recoveryPerMinute}) {
    if (!energyAccount(liquid) || !energyAccount(active) || liquid === active ||
        ![baseline, suppressionPerUnit, recoveryPerMinute].every(n => whole(n) && n > 0))
        throw new Error('Living body: invalid dose response settings.');
    const response = 'responsiveness';
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
        uptake: {id: 'liquid-uptake', liquid, active, account: response,
            respond: (view, id, absorbed) => [
                add(id, response, -Math.min(view.amount(id, response), absorbed * suppressionPerUnit)),
            ],
        },
    };
}

// Circulating volume and the rate of an open bleed are separate body accounts.
// Injury treatment can stop the loss through its own host interface.
function circulationResponse({liquid, active, capacity, volumePerUnit}) {
    if (!energyAccount(liquid) || !energyAccount(active) || liquid === active ||
        ![capacity, volumePerUnit].every(n => whole(n) && n > 0))
        throw new Error('Living body: invalid circulation settings.');
    const volume = 'circulating-blood', loss = 'blood-loss-rate';
    return {
        quantities: [{id: volume, unit: 'blood-unit', min: 0, max: capacity},
            {id: loss, unit: 'blood-unit-per-minute', min: 0, max: capacity}],
        reads: ['energy', volume, loss], writes: ['energy', volume],
        hears: ['effect.move'],
        laws: [{
            id: 'blood-loss',
            appliesTo: h => isBody(h) && Object.hasOwn(h.quantities, volume) && Object.hasOwn(h.quantities, loss),
            rates: (view, id) => {
                const rate = view.amount(id, loss);
                return rate > 0 && view.amount(id, volume) > 0 ? [{holder: id, quantity: volume, perMinute: -rate}] : [];
            },
        }],
        uptake: {id: 'blood-replenishment', liquid, active, account: volume,
            respond(view, id, absorbed) {
                const restored = Math.min(capacity - view.amount(id, volume), absorbed * volumePerUnit);
                return restored ? [add(id, volume, restored)] : [];
            },
        },
    };
}

function boneGrowthResponse({liquid, active, capacity, growthPerUnit, growthPerMinute, pain}) {
    if (!energyAccount(liquid) || !energyAccount(active) || liquid === active ||
        ![capacity, growthPerUnit, growthPerMinute, pain].every(n => whole(n) && n > 0))
        throw new Error('Living body: invalid bone growth settings.');
    const bone = 'arm-bone', reserve = 'bone-growth-reserve';
    const hasGrowthAccounts = h => isBody(h) && Object.hasOwn(h.quantities, bone) && Object.hasOwn(h.quantities, reserve);
    return {
        quantities: [bone, reserve].map(id => ({id, unit: 'bone-unit', min: 0, max: capacity})),
        reads: ['energy', bone, reserve], writes: ['energy', bone, reserve], hears: ['effect.move'],
        publishes: ['effect.add.mind'],
        laws: [{
            id: 'bone-growth', appliesTo: hasGrowthAccounts,
            horizon: () => Infinity,
            advance(view, id, elapsed) {
                const amount = Math.min(view.amount(id, reserve), capacity - view.amount(id, bone), elapsed * growthPerMinute);
                return amount ? [add(id, bone, amount), add(id, reserve, -amount)] : [];
            },
        }],
        uptake: {id: 'bone-growth-uptake', liquid, active, account: bone,
            respond(view, id, absorbed) {
                if (!view.has(id, reserve)) return [];
                const pending = view.amount(id, reserve);
                const granted = Math.min(capacity - view.amount(id, bone) - pending, absorbed * growthPerUnit);
                if (granted <= 0) return [];
                const minutes = Math.ceil((pending + granted) / growthPerMinute);
                return [add(id, reserve, granted),
                    {op: 'publish', kind: 'effect.add.mind', place: view.placeOf(id), by: id,
                        detail: {parts: {time: 'sustained'}, application: {
                            targets: [id], working: 'body.bone-growth', minutes, mind: {faculty: 'pain', amount: pain},
                        }}}];
            },
        },
    };
}

function poisonBreathing({burden, threshold, capacity}) {
    if (typeof burden !== 'string' || ![threshold, capacity].every(n => whole(n) && n > 0))
        throw new Error('Living body: invalid poison breathing settings.');
    const breathing = 'respiratory-capacity';
    return {
        id: 'poison-breathing',
        appliesTo: holder => isBody(holder) && Object.hasOwn(holder.quantities, burden) &&
            Object.hasOwn(holder.quantities, breathing),
        rates(view, id) {
            return [{holder: id, quantity: breathing, perMinute: view.amount(id, burden) >= threshold ? -1 : 1}];
        },
    };
}

function scarCareResponse({liquid, active, capacity, unitsPerPoint}) {
    if (!energyAccount(liquid) || !energyAccount(active) || liquid === active ||
        ![capacity, unitsPerPoint].every(n => whole(n) && n > 0))
        throw new Error('Living body: invalid scar care settings.');
    const scar = 'scar-burden', care = 'scar-care-reserve';
    return {
        quantities: [scar, care].map(id => ({id, unit: 'scar-unit', min: 0, max: capacity})),
        reads: ['energy', scar, care], writes: ['energy', scar, care], hears: ['effect.move'],
        laws: [{
            id: 'scar-remodeling',
            appliesTo: h => isBody(h) && Object.hasOwn(h.quantities, scar) && Object.hasOwn(h.quantities, care),
            horizon: () => Infinity,
            advance(view, id, elapsed) {
                const used = Math.min(view.amount(id, care), elapsed);
                const softened = Math.min(used, view.amount(id, scar));
                return used ? [add(id, care, -used), ...(softened ? [add(id, scar, -softened)] : [])] : [];
            },
        }],
        uptake: {id: 'scar-care-uptake', liquid, active, account: scar,
            respond(view, id, absorbed) {
                if (!view.has(id, care)) return [];
                const granted = Math.min(view.amount(id, scar) - view.amount(id, care), Math.floor(absorbed / unitsPerPoint));
                return granted > 0 ? [add(id, care, granted)] : [];
            },
        },
    };
}

export function createLivingBodyPack({inboxLimit = 16, dose, circulation, boneGrowth, poison, skinInjury, scarCare} = {}) {
    const response = dose ? doseResponse(dose) : {quantities: [], reads: [], writes: [], hears: [], laws: []};
    const blood = circulation ? circulationResponse(circulation) : {quantities: [], reads: [], writes: [], hears: [], laws: []};
    const growth = boneGrowth ? boneGrowthResponse(boneGrowth) : {quantities: [], reads: [], writes: [], hears: [], publishes: [], laws: []};
    const scars = scarCare ? scarCareResponse(scarCare) : {quantities: [], reads: [], writes: [], hears: [], laws: []};
    const uptake = [response, blood, growth, scars].flatMap(({uptake}) => uptake ? [uptake] : []);
    for (const [liquid, rows] of Map.groupBy(uptake, row => row.liquid)) {
        if (new Set(rows.map(row => row.active)).size !== rows.length)
            throw new Error(`Living body: responses on ${liquid} need distinct active accounts.`);
    }
    const poisonLaw = poison && poisonBreathing(poison);
    const breathing = poisonLaw ? [{id: 'respiratory-capacity', unit: 'breathing-unit', min: 0, max: poison.capacity}] : [];
    const skin = 'skin-lesions';
    if (skinInjury && (typeof skinInjury.kind !== 'string' || !skinInjury.kind ||
        ![skinInjury.capacity, skinInjury.unitsPerLesion].every(n => whole(n) && n > 0)))
        throw new Error('Living body: invalid skin injury settings.');
    return {
        id: 'l.living_body', revision: 0,
        quantities: [SATIETY, JUVENILE_GROWTH, ...response.quantities, ...blood.quantities, ...growth.quantities, ...breathing, ...scars.quantities,
            ...(skinInjury ? [{id: skin, unit: 'lesion-unit', min: 0, max: skinInjury.capacity}] : [])],
        properties: [JUVENILE_GROWTH_PAUSE],
        reads: [...new Set(['satiety', JUVENILE_GROWTH_PAUSE.id, ...response.reads, ...blood.reads, ...growth.reads,
            ...scars.reads, ...(poisonLaw ? [poison.burden] : []), ...(skinInjury ? [skin] : [])])],
        writes: [...new Set(['satiety', JUVENILE_GROWTH.id, ...response.writes, ...blood.writes, ...growth.writes,
            ...scars.writes, ...breathing.map(quantity => quantity.id), ...(skinInjury ? [skin] : [])])],
        publishes: ['living.hungry', ...growth.publishes],
        hears: [...new Set(['living.harm', ...response.hears, ...blood.hears, ...growth.hears, ...scars.hears])],
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
        }, {
            id: 'fed-growth',
            appliesTo: h => isBody(h) && Object.hasOwn(h.quantities, JUVENILE_GROWTH.id),
            rates(view, id) {
                return view.clock >= (view.property(id, JUVENILE_GROWTH_PAUSE.id) ?? 0) &&
                    view.amount(id, 'satiety') > 0 && view.amount(id, JUVENILE_GROWTH.id) > 0
                    ? [{holder: id, quantity: JUVENILE_GROWTH.id, perMinute: -1}] : [];
            },
            horizon(view, id) {
                const until = view.property(id, JUVENILE_GROWTH_PAUSE.id) ?? 0;
                return until > view.clock ? until - view.clock : Infinity;
            },
        }, ...response.laws, ...blood.laws, ...growth.laws, ...scars.laws, ...(poisonLaw ? [poisonLaw] : [])],
        reactors: [{
            id: 'harm-inbox', on: ['living.harm'], appliesTo: isBody,
            react: (view, id, effect) => {
                const {target, kind, amount} = effect.detail ?? {};
                if (target !== id || typeof kind !== 'string' || !whole(amount) || amount === 0) return [];
                const s = view.state(id);
                const inbox = [...s.inbox, {at: view.clock, kind, amount, by: effect.by}].slice(-inboxLimit);
                const ops = [{op: 'state', holder: id, value: {...s, inbox}}];
                if (skinInjury?.kind === kind && view.has(id, skin)) {
                    const lesions = Math.min(skinInjury.capacity - view.amount(id, skin),
                        Math.floor(amount / skinInjury.unitsPerLesion));
                    if (lesions) ops.push(add(id, skin, lesions));
                }
                return ops;
            },
        }, ...liquidUptakeReactors(uptake)],
    };
}
