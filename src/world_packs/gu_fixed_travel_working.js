// PC95. The destination snapshot is a bound impression held by the operator.
// Ch. 405–407 and 1003 inform the scene and ward checks. Timing and accounts
// are opt-in world values. The common host owns costs, relocation and restore.
import {defineWorkingLaw} from '../kernel_working.js';
import {fixedImmortalTravel, fixedImmortalTravelAbility, quoteFixedImmortalTravel} from '../gu_fixed_immortal_travel.js';
import {beginGuProjection, reachableGuCapability} from '../gu_projection.js';
import {guWorldUseReason} from '../gu_world_use.js';

export const fixedTravelFuel = 'energy:immortal.green-grape';
const borrowedFuel = 'energy:immortal.borrowed';
const supply = {pool: 'green-grape', family: 'immortal', rank: 6, source: 'stored'};
const roles = {operator: 'operator', destination: 'place', impression: 'impression'};
const liveRoles = {...roles, specimen: 'gu'};
const borrowedRoles = {...roles, anchor: 'time-anchor'};
const riverRoles = {...borrowedRoles, river: 'place'};
const attuneRoles = {operator: 'operator', anchor: 'time-anchor', river: 'place'};
const reject = reason => ({ok: false, reason});

export const GU_TRAVEL_PROPERTIES = [
    ...['gu_travel_scene', 'gu_impression_owner', 'gu_impression_site', 'gu_anchor_owner', 'gu_anchor_kind',
        'gu_installed_in', 'gu_anchor_river', 'gu_river_course', 'gu_anchor_course']
        .map(id => ({id, type: 'label'})),
    {id: 'gu_travel_sealed', type: 'flag'},
    {id: 'gu_carried', type: 'flag'},
    ...['gu_anchor_starts', 'gu_anchor_expires', 'gu_anchor_rank'].map(id => ({id, type: 'level', min: 0})),
];

export function boundTravelRoute({operator, destination, impression}) {
    const p = impression.properties;
    return {
        from: operator.place,
        destination: {id: destination.holder, scene: destination.properties?.gu_travel_scene,
            sealed: destination.properties?.gu_travel_sealed === true},
        impression: impression.holder && p?.gu_impression_owner === operator.id
            ? {site: p.gu_impression_site, scene: p.gu_travel_scene} : null,
    };
}

export const fixedTravelMovement = (holder, to) => ({
    sentence: {verb: 'move', object: 'position', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
    details: {target: {shape: 'holder', id: holder}, to},
});

function attuneRiverAnchor({bound: {operator, anchor, river}, at}) {
    const course = river.properties.gu_river_course;
    if (!course || !river.holder || !anchor.holder || !operator.place || operator.place !== anchor.place ||
        operator.properties.alive !== true || anchor.properties.gu_anchor_kind ||
        (anchor.properties.gu_anchor_owner && anchor.properties.gu_anchor_owner !== operator.id) ||
        anchor.quantities[borrowedFuel] !== 0) return reject('blank local river anchor required');
    const reserve = 2;
    const projection = beginGuProjection({anchor: anchor.id, operator: operator.id, now: at, duration: 20,
        rankLimit: supply.rank, profile: {rank: supply.rank, reserves: {[borrowedFuel]: reserve},
            capabilities: [{kind: fixedImmortalTravel, rank: supply.rank, ability: fixedImmortalTravelAbility}]}});
    const [capability] = projection.capabilities;
    const properties = {gu_anchor_owner: projection.operator, gu_anchor_kind: capability.kind,
        gu_anchor_rank: capability.rank, gu_anchor_starts: projection.startsAt, gu_anchor_expires: projection.expiresAt,
        gu_anchor_river: river.holder, gu_anchor_course: course};
    return {ok: true, costs: [{quantity: fixedTravelFuel, payer: operator.holder, amount: reserve}], effects: [
        ...Object.entries(properties).map(([property, value]) => ({op: 'property', holder: anchor.holder, property, value})),
        {op: 'add', holder: anchor.holder, quantity: borrowedFuel, amount: projection.reserves[borrowedFuel]},
    ]};
}

function settleTravel({bound, at}) {
    const {operator, destination, impression, specimen, anchor, river} = bound;
    const route = boundTravelRoute({operator, destination, impression});
    let gu, quantity, payer, balance;
    if (specimen) {
        const g = specimen.properties;
        if (!specimen.holder || g?.gu_carried !== true || g.gu_rank !== supply.rank) return reject('unavailable');
        const reason = guWorldUseReason(specimen, operator.id, operator.place, at);
        if (reason) return reject(reason === 'gu-use-grant-expired' ? reason : 'unavailable');
        gu = {id: specimen.id, kind: g.gu_kind, rank: g.gu_rank, holder: operator.id, injured: g.injured,
            alive: g.alive === true, fedThrough: specimen.quantities.satiety > 0 ? at : at - 1};
        quantity = fixedTravelFuel;
        payer = operator.holder;
        balance = operator.quantities[quantity] ?? 0;
    } else {
        // The saved anchor owns the separate reserve. Projection rules check
        // owner, capability and expiry. Borrowing creates no living Gu.
        const memory = anchor.properties;
        if (river && (!river.holder || memory.gu_anchor_river !== river.holder ||
            !memory.gu_anchor_course || memory.gu_anchor_course !== river.properties.gu_river_course)) {
            return reject('river-course-changed');
        }
        if (!river && memory.gu_anchor_river) return reject('river-anchor-required');
        if (!anchor.holder || memory.gu_anchor_kind !== fixedImmortalTravel ||
            memory.gu_anchor_rank !== supply.rank ||
            !Number.isSafeInteger(memory.gu_anchor_starts) || !Number.isSafeInteger(memory.gu_anchor_expires)) {
            return reject('unreachable-anchor');
        }
        const projection = {anchor: anchor.id, operator: memory.gu_anchor_owner,
            startsAt: memory.gu_anchor_starts, expiresAt: memory.gu_anchor_expires,
            capabilities: [{kind: memory.gu_anchor_kind, rank: memory.gu_anchor_rank, ability: fixedImmortalTravelAbility}]};
        let capability;
        try {
            capability = reachableGuCapability({projection, anchor: anchor.id, operator: operator.id, now: at, kind: fixedImmortalTravel});
        } catch {
            return reject('unreachable-anchor');
        }
        gu = {id: 'projection:' + fixedImmortalTravel, kind: capability.kind, rank: capability.rank,
            holder: operator.id, fedThrough: at};
        quantity = borrowedFuel;
        payer = anchor.holder;
        balance = anchor.quantities[quantity] ?? 0;
    }
    const quote = quoteFixedImmortalTravel({gu, operator: operator.id, now: at, ...route, supply, reserve: balance});
    if (quote.reason) return reject(quote.reason);
    return {ok: true, costs: [{quantity, payer, amount: quote.spent}],
        observed: {capability: specimen ? specimen.id : anchor.id},
        effects: [fixedTravelMovement(operator.holder, quote.destination)]};
}

export const GU_FIXED_TRAVEL_LAW = defineWorkingLaw({id: 'gu.fixed-travel-world', revision: 1, operations: {
    attune: {roles: attuneRoles, settle: attuneRiverAnchor},
    travel: {roles: liveRoles, settle: settleTravel},
    project: {roles: borrowedRoles, settle: settleTravel},
    'project-from-river': {roles: riverRoles, settle: settleTravel},
}});

export function fixedTravelWorking({borrowed = false, fromRiver = false, attune = false} = {}) {
    const bindings = attune ? attuneRoles : fromRiver ? riverRoles : borrowed ? borrowedRoles : liveRoles;
    const op = attune ? 'attune' : fromRiver ? 'project-from-river' : borrowed ? 'project' : 'travel';
    const method = attune ? 'attune' : fromRiver ? 'river' : borrowed ? 'borrowed' : 'live';
    return {id: 'gu.fixed-travel.' + method, revision: 1, law: GU_FIXED_TRAVEL_LAW.ref,
        roles: bindings, steps: [{op, minutes: 2,
            bindings: Object.fromEntries(Object.keys(bindings).map(role => [role, role]))}]};
}

// Carrying is explicit. A blocked operator never publishes arrival, so a Gu
// cannot be left on the far side by a failed departure.
export const guTravelCarryPack = {
    id: 'g.travel-carry', revision: 1, properties: GU_TRAVEL_PROPERTIES,
    reads: ['alive', 'gu_carried', 'gu_keeper', 'gu_installed_in'],
    reactors: [{
        id: 'carried-gu', on: ['departed'], appliesTo: holder => holder.as.includes('gu'),
        react(view, id, event) {
            return view.property(id, 'alive') === true && view.property(id, 'gu_carried') === true &&
                view.property(id, 'gu_keeper') === event.by && !view.property(id, 'gu_installed_in') &&
                view.placeOf(id) === event.place
                ? [{op: 'move', holder: id, to: event.detail.to}]
                : [];
        },
    }],
};
