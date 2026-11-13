// PC95. Exclusive loans transfer custody. Shared terms authorize local use
// while the lender keeps the specimen and its controller.
import {defineWorkingLaw} from '../kernel_working.js';
import {GU_OCCUPANCY_PROPERTIES, guUseOccupied, guWorldUseReason, sharedGuTerms} from '../gu_world_use.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {resolveHostedExtraction} from '../gu_host_custody.js';

const roles = {lender: 'operator', borrower: 'operator', specimen: 'gu'};
const successionRoles = {owner: 'operator', heir: 'operator', specimen: 'gu'};
const loanSuccessionRoles = {...successionRoles, borrower: 'operator'};
const namedHeir = 'gu_named_heir';
const plunderRoles = {keeper: 'operator', taker: 'operator', specimen: 'gu', tool: 'gu'};
const extractionRoles = {host: 'creature', taker: 'operator', specimen: 'gu', tool: 'gu'};
const refuse = reason => ({ok: false, reason});
const recallAnchor = 'gu_recall_anchor';
const recallArrival = 'gu_recall_arrival';
const fuel = 'energy:immortal.green-grape';
const stones = 'stock:primeval_stone';
const saleOffer = 'gu_sale_offer';
const offerBuyer = 'gu_offer_buyer';
const offerPrice = 'gu_offer_price';
const offerUntil = 'gu_offer_until';
const counterOffer = 'gu_offer_from_buyer';
const plunderFuel = 'energy:primeval.rank2';
const hostRefuge = 'gu_host_refuge';
const hostBraces = 'gu_host_braces';
const bracedUntil = 'gu_host_braced_until';
const hostStamina = 'energy:stamina';
const extractionGrip = 'gu.plunder.grip';
const property = (holder, name, value) => ({op: 'property', holder, property: name, value});
const returnTerms = (specimen, lender) => Object.entries({
    gu_use_grantee: null, gu_use_until: null, gu_exclusive_loan: null, gu_keeper: lender, [recallAnchor]: null,
}).map(([name, value]) => property(specimen, name, value));
const eligibleHeir = ({owner, heir, specimen}) => owner.properties.alive === false &&
    heir.properties.alive === true && specimen.properties.alive === true &&
    specimen.properties.gu_title === owner.id && specimen.properties[namedHeir] === heir.id;
const clearOffer = specimen => [saleOffer, offerBuyer, offerPrice, offerUntil, counterOffer]
    .map(name => property(specimen, name, null));
const transferEstate = ({owner, heir, specimen}) => [
    property(specimen.holder, 'gu_title', heir.id),
    property(specimen.holder, namedHeir, null),
    ...(specimen.properties.gu_controller === owner.id ? [property(specimen.holder, 'gu_controller', null)] : []),
    ...clearOffer(specimen.holder),
];

function saleUnavailable({lender: seller, borrower: buyer, specimen}, at) {
    const p = specimen.properties;
    if (!seller.place || buyer.place !== seller.place || specimen.place !== seller.place ||
        seller.id === buyer.id || seller.properties.alive !== true || buyer.properties.alive !== true ||
        p.alive !== true || p.gu_title !== seller.id || p.gu_keeper !== seller.id || p.gu_controller !== seller.id) {
        return 'Sale needs both living traders and the Gu under the seller’s control.';
    }
    if (p.gu_vital_master || p.gu_living_host || p.gu_installed_in || (p.gu_furnace_job && p.gu_furnace_until >= at) ||
        guUseOccupied(p, at) || (p.gu_use_grantee && p.gu_use_until > at) ||
        sharedGuTerms(p).some(term => term.until > at)) return 'The Gu is committed or bonded.';
    return null;
}

function settleSale(bound, at, price) {
    const unavailable = saleUnavailable(bound, at);
    if (unavailable) return refuse(unavailable);
    const {lender: seller, borrower: buyer, specimen} = bound;
    if (!Number.isSafeInteger(price) || price < 1 || !(buyer.quantities[stones] >= price) ||
        !(seller.quantities[stones] <= WORLD_QUANTITIES.stock.max - price)) return refuse('The sale cannot settle its price.');
    return {ok: true, costs: [{quantity: stones, payer: buyer.holder, amount: price}], effects: [
        {op: 'add', holder: seller.holder, quantity: stones, amount: price},
        ...returnTerms(specimen.holder, buyer.id),
        ...['gu_title', 'gu_controller'].map(name => property(specimen.holder, name, buyer.id)),
        ...[namedHeir, 'gu_shared_use', 'gu_shared_use_by', 'gu_use_working', 'gu_use_working_until']
            .map(name => property(specimen.holder, name, null)),
        ...clearOffer(specimen.holder),
    ]};
}

function matchingOffer({lender, borrower, specimen}, at, offer, fromBuyer = false) {
    const p = specimen.properties;
    return typeof offer === 'string' && p[saleOffer] === offer && p[offerBuyer] === borrower.id &&
        p.gu_title === lender.id && p[offerUntil] > at && (p[counterOffer] === true) === fromBuyer;
}

function proposeSale(bound, at, address, price, until, fromBuyer = false) {
    const unavailable = saleUnavailable(bound, at);
    if (unavailable) return refuse(unavailable);
    if (!Number.isSafeInteger(price) || price < 1 || price > WORLD_QUANTITIES.stock.max ||
        !Number.isSafeInteger(until) || until <= at) return refuse('An offer needs a price and a future deadline.');
    const {specimen, borrower} = bound;
    return {ok: true, observed: {offer: address, price, until}, effects: [
        property(specimen.holder, saleOffer, address), property(specimen.holder, offerBuyer, borrower.id),
        property(specimen.holder, offerPrice, price), property(specimen.holder, offerUntil, until),
        property(specimen.holder, counterOffer, fromBuyer ? true : null),
    ]};
}

export const GU_USE_AGREEMENT_PROPERTIES = [
    {id: 'gu_title', type: 'label'},
    {id: saleOffer, type: 'label'},
    {id: offerBuyer, type: 'label'},
    {id: offerPrice, type: 'level', min: 1, max: WORLD_QUANTITIES.stock.max},
    {id: offerUntil, type: 'level', min: 0},
    {id: counterOffer, type: 'flag'},
    {id: namedHeir, type: 'label'},
    {id: 'gu_living_host', type: 'label'},
    {id: 'gu_exclusive_loan', type: 'flag'},
    {id: 'gu_use_grantee', type: 'label'},
    {id: 'gu_use_until', type: 'level', min: 0},
    {id: 'gu_shared_use', type: 'set'},
    {id: 'gu_shared_use_by', type: 'label'},
    ...GU_OCCUPANCY_PROPERTIES,
    {id: recallAnchor, type: 'label'},
    {id: recallArrival, type: 'label'},
];

export const guLivingHostPack = {
    id: 'g.gu-living-host', revision: 1,
    properties: [{id: hostRefuge, type: 'label'}, {id: hostBraces, type: 'flag'},
        {id: bracedUntil, type: 'level', min: 0}],
    reads: ['alive', 'gu_living_host', hostRefuge, hostBraces, bracedUntil, hostStamina],
    writes: [hostStamina, bracedUntil],
    publishes: [extractionGrip], hears: ['departed', extractionGrip],
    reactors: [{
        id: 'attached-gu', on: ['departed'], appliesTo: holder => holder.as.includes('gu'),
        react(view, id, event) {
            const host = view.property(id, 'gu_living_host');
            if (host !== event.by || view.property(host, 'alive') !== true ||
                view.property(id, 'alive') !== true || view.placeOf(host) !== event.detail.to ||
                view.placeOf(id) !== event.place) return [];
            return [{op: 'move', holder: id, to: event.detail.to}];
        },
    }, {
        id: 'resist-extraction', on: [extractionGrip], appliesTo: holder => holder.kind === 'body',
        react(view, id, event) {
            if (id !== event.detail?.host || view.placeOf(id) !== event.place || view.property(id, 'alive') !== true ||
                view.property(event.detail.specimen, 'gu_living_host') !== id) return [];
            const {specimen} = event.detail;
            if (!view.has(id, hostStamina) || view.amount(id, hostStamina) < 1) return [];
            const refuge = view.property(id, hostRefuge);
            const pinned = view.lawFields(id, 'block').some(({params}) => params.spellObject === undefined &&
                (params.verb === undefined || ['move', '*'].includes(params.verb)) &&
                (params.object === undefined || ['position', '*'].includes(params.object)));
            const spend = {op: 'add', holder: id, quantity: hostStamina, amount: -1};
            if (!pinned && refuge && view.exits(event.place, {kinds: ['path']}).some(exit => exit.to === refuge)) {
                return [spend, {op: 'move', holder: id, to: refuge}];
            }
            if (!view.property(id, hostBraces) || view.property(specimen, bracedUntil) >= view.clock + 1) return [];
            return [spend, property(specimen, bracedUntil, view.clock + 1)];
        },
    }],
};

export const guRecallPack = {
    id: 'g.gu-recall', revision: 1, properties: GU_USE_AGREEMENT_PROPERTIES,
    reads: [recallArrival, 'gu_title', 'gu_use_grantee', 'gu_keeper', 'gu_exclusive_loan', 'alive'],
    writes: ['gu_use_grantee', 'gu_use_until', 'gu_exclusive_loan', 'gu_keeper', recallAnchor],
    reactors: [{id: 'reclaim-arriving-gu', on: ['arrived'], appliesTo: holder => holder.as.includes('gu'),
        react(view, id, event) {
            const lender = view.property(id, 'gu_title');
            if (event.by !== id || view.property(id, recallArrival) !== event.place || view.placeOf(id) !== event.place ||
                view.placeOf(lender) !== event.place || view.property(id, 'alive') !== true || view.property(lender, 'alive') !== true ||
                view.property(id, 'gu_exclusive_loan') !== true ||
                view.property(id, 'gu_keeper') !== view.property(id, 'gu_use_grantee')) return [];
            return returnTerms(id, lender);
        },
    }],
};

export const GU_USE_AGREEMENT_LAW = defineWorkingLaw({id: 'gu.use-agreement', revision: 1, operations: {
    bequeath: {roles: successionRoles, minutes: 1, settle({bound: {owner, heir, specimen}}) {
        if (owner.properties.alive !== true || heir.properties.alive !== true || owner.id === heir.id ||
            specimen.properties.alive !== true || specimen.properties.gu_title !== owner.id) {
            return refuse('A living owner must name a living heir for their Gu.');
        }
        return {ok: true, effects: [property(specimen.holder, namedHeir, heir.id)]};
    }},
    inherit: {roles: successionRoles, minutes: 1, settle({bound, at}) {
        const {owner, heir, specimen} = bound;
        const p = specimen.properties;
        if (!eligibleHeir(bound) || !heir.place || specimen.place !== heir.place) {
            return refuse('Inheritance needs the named heir and the living Gu of a deceased owner.');
        }
        if (p.gu_keeper !== owner.id || p.gu_living_host || p.gu_installed_in ||
            guUseOccupied(p, at) || (p.gu_furnace_job && p.gu_furnace_until >= at) ||
            (p.gu_use_grantee && p.gu_use_until > at) || sharedGuTerms(p).some(term => term.until > at)) {
            return refuse('The Gu must be free of other custody and commitments.');
        }
        return {ok: true, effects: [
            ...returnTerms(specimen.holder, heir.id),
            ...transferEstate(bound),
            ...['gu_shared_use', 'gu_shared_use_by', 'gu_use_working', 'gu_use_working_until']
                .map(name => property(specimen.holder, name, null)),
        ]};
    }},
    'inherit-loan': {roles: loanSuccessionRoles, minutes: 1, settle({bound}) {
        const {specimen, borrower} = bound;
        const p = specimen.properties;
        if (!eligibleHeir(bound) || borrower.properties.alive !== true || !borrower.place ||
            specimen.place !== borrower.place || p.gu_exclusive_loan !== true ||
            p.gu_keeper !== borrower.id || p.gu_use_grantee !== borrower.id || !Number.isSafeInteger(p.gu_use_until)) {
            return refuse('Inheritance needs the named heir and the Gu in the recorded borrower’s care.');
        }
        return {ok: true, effects: [...transferEstate(bound), property(specimen.holder, recallAnchor, null)]};
    }},
    extract: {roles: extractionRoles, minutes: 1, settle({bound: {host, taker, specimen, tool}, at, facts, address}) {
        const p = specimen.properties, held = tool.properties;
        if (!taker.place || taker.place !== host.place || specimen.place !== host.place ||
            taker.id === host.id || taker.properties.alive !== true || host.properties.alive !== true || p.alive !== true ||
            p.gu_living_host !== host.id || p.gu_keeper !== host.id || specimen.holder === tool.holder ||
            held.gu_kind !== 'plunder' || held.alive !== true || held.injured || !(tool.quantities.satiety > 0)) {
            return refuse('Extraction needs the living host, its Gu and a fed Plunder Gu within reach.');
        }
        const working = address.slice(0, address.lastIndexOf('/'));
        const reason = guWorldUseReason(tool, taker.id, taker.place, at, {working});
        if (reason) return refuse(reason);
        const reserve = taker.quantities[plunderFuel] ?? 0;
        const price = [{quantity: plunderFuel, payer: taker.holder, amount: 1}];
        if (!facts.grip) {
            if (reserve < 1) return refuse('Plunder needs essence to take hold.');
            return {ok: true, costs: price, facts: {grip: true}, effects: [
                property(tool.holder, 'gu_use_working', working), property(tool.holder, 'gu_use_working_until', at + 1),
                ...(host.properties[hostRefuge] || host.properties[hostBraces] ? [{op: 'publish', kind: extractionGrip, place: host.place,
                    by: taker.holder, detail: {host: host.holder, specimen: specimen.holder}}] : []),
            ]};
        }
        if (held.gu_use_working !== working || held.gu_use_working_until !== at) return refuse('Plunder lost its hold.');
        const release = ['gu_use_working', 'gu_use_working_until'].map(name => property(tool.holder, name, null));
        const result = resolveHostedExtraction({gu: {id: tool.holder, kind: 'plunder', fedThrough: at},
            operator: taker.id, cost: 1, clock: at, reserve});
        if (result.outcome !== 'complete') return {ok: true, observed: {result: 'backlash'},
            effects: [...release, property(tool.holder, 'injured', true)]};
        if (p[bracedUntil] >= at) return {ok: true, costs: price, effects: release, observed: {result: 'host-braced'}};
        if (p.gu_installed_in || guUseOccupied(p, at) || (p.gu_furnace_job && p.gu_furnace_until >= at)) {
            return {ok: true, costs: price, effects: release, observed: {result: 'specimen-held-fast'}};
        }
        return {ok: true, costs: price, observed: {taken: specimen.holder}, effects: [
            ...release, property(specimen.holder, 'gu_living_host', null), property(specimen.holder, 'gu_keeper', taker.id),
        ]};
    }},
    plunder: {roles: plunderRoles, minutes: 2, settle({bound: {keeper, taker, specimen, tool}, at}) {
        const p = specimen.properties, held = tool.properties;
        if (!taker.place || taker.place !== keeper.place || specimen.place !== keeper.place ||
            taker.id === keeper.id || taker.properties.alive !== true || p.alive !== true ||
            p.gu_keeper !== keeper.id || specimen.holder === tool.holder ||
            held.gu_kind !== 'plunder' || held.alive !== true || held.injured || !(tool.quantities.satiety > 0)) {
            return refuse('Plunder needs a living local Gu and a fed Plunder Gu.');
        }
        const reason = guWorldUseReason(tool, taker.id, taker.place, at);
        if (reason) return refuse(reason);
        if (!(taker.quantities[plunderFuel] >= 2)) return refuse('Plunder needs two essence.');
        const costs = [{quantity: plunderFuel, payer: taker.holder, amount: 2}];
        if (p.gu_living_host || p.gu_installed_in || guUseOccupied(p, at) || (p.gu_furnace_job && p.gu_furnace_until >= at)) {
            return {ok: true, costs, observed: {result: 'specimen-held-fast'}};
        }
        return {ok: true, costs, observed: {taken: specimen.holder},
            effects: [property(specimen.holder, 'gu_keeper', taker.id)]};
    }},
    sell: {roles, minutes: 1, settle({bound, at, options: {price}}) {
        return settleSale(bound, at, price);
    }},
    offer: {roles, minutes: 1, settle({bound, at, address, options: {price, until}}) {
        return proposeSale(bound, at, address, price, until);
    }},
    counter: {roles, minutes: 1, settle({bound, at, address, options: {offer, price, until}}) {
        if (!matchingOffer(bound, at, offer)) return refuse('The sale offer is no longer open.');
        return proposeSale(bound, at, address, price, until, true);
    }},
    'accept-counter': {roles, minutes: 1, settle({bound, at, options: {offer}}) {
        if (!matchingOffer(bound, at, offer, true)) return refuse('The counteroffer is no longer open.');
        return settleSale(bound, at, bound.specimen.properties[offerPrice]);
    }},
    'decline-counter': {roles, minutes: 1, settle({bound, at, options: {offer}}) {
        if (!matchingOffer(bound, at, offer, true) || bound.lender.properties.alive !== true) {
            return refuse('The counteroffer is no longer open.');
        }
        return {ok: true, effects: clearOffer(bound.specimen.holder)};
    }},
    accept: {roles, minutes: 1, settle({bound, at, options: {offer}}) {
        if (!matchingOffer(bound, at, offer)) return refuse('The sale offer is no longer open.');
        return settleSale(bound, at, bound.specimen.properties[offerPrice]);
    }},
    decline: {roles, minutes: 1, settle({bound, at, options: {offer}}) {
        if (!matchingOffer(bound, at, offer) || bound.borrower.properties.alive !== true) {
            return refuse('The sale offer is no longer open.');
        }
        return {ok: true, effects: clearOffer(bound.specimen.holder)};
    }},
    grant: {roles, minutes: 1, settle({bound: {lender, borrower, specimen}, at, options: {until, recallable}}) {
        const p = specimen.properties;
        if (!p.alive || lender.id === borrower.id || p.gu_title !== lender.id || p.gu_controller !== lender.id ||
            !lender.place || lender.place !== borrower.place || specimen.place !== lender.place) {
            return refuse('The lender, borrower and living Gu must be available.');
        }
        if (p.gu_installed_in || (p.gu_furnace_job && p.gu_furnace_until >= at) || guUseOccupied(p, at)) return refuse('The Gu is committed to another working.');
        if (p.gu_use_grantee && p.gu_use_until > at) return refuse('This Gu already has a live use grant.');
        if (sharedGuTerms(p).some(term => term.until > at)) return refuse('This Gu already has live shared use terms.');
        if (p.gu_keeper !== lender.id && p.gu_keeper !== borrower.id) return refuse('The current keeper must return the Gu first.');
        if (!Number.isSafeInteger(until) || until <= at) return refuse('The use interval must extend beyond settlement.');
        return {ok: true, effects: Object.entries({
            gu_use_grantee: borrower.id, gu_use_until: until, gu_exclusive_loan: true, gu_keeper: borrower.id,
            gu_shared_use: null, gu_shared_use_by: null,
            [recallAnchor]: recallable === true ? lender.place : null,
        }).map(([property, value]) => ({op: 'property', holder: specimen.holder, property, value}))};
    }},
    share: {roles, minutes: 1, settle({bound: {lender, borrower, specimen}, at, options: {until}}) {
        const p = specimen.properties;
        if (p.alive !== true || lender.properties.alive !== true || borrower.properties.alive !== true || lender.id === borrower.id ||
            p.gu_title !== lender.id || p.gu_controller !== lender.id || p.gu_keeper !== lender.id ||
            !lender.place || lender.place !== borrower.place || specimen.place !== lender.place) {
            return refuse('Shared use needs both living operators and the Gu in the lender’s care.');
        }
        if (p.gu_installed_in || (p.gu_furnace_job && p.gu_furnace_until >= at) || guUseOccupied(p, at) || (p.gu_use_grantee && p.gu_use_until > at)) {
            return refuse('The Gu is committed to another working or borrower.');
        }
        if (!Number.isSafeInteger(until) || until <= at) return refuse('The use interval must extend beyond settlement.');
        const terms = sharedGuTerms(p).filter(term => term.until > at && term.operator !== borrower.id);
        terms.push({operator: borrower.id, until});
        return {ok: true, effects: [
            {op: 'property', holder: specimen.holder, property: 'gu_shared_use_by', value: lender.id},
            {op: 'property', holder: specimen.holder, property: 'gu_shared_use', value: terms.map(term => `${term.operator}:${term.until}`)},
        ]};
    }},
    return: {roles, minutes: 1, settle({bound: {lender, borrower, specimen}, at}) {
        const p = specimen.properties;
        if (!p.alive || p.gu_title !== lender.id || p.gu_use_grantee !== borrower.id || p.gu_keeper !== borrower.id ||
            !lender.place || lender.place !== borrower.place || specimen.place !== lender.place) {
            return refuse('The current borrower needs to return the living Gu in person.');
        }
        return {ok: true, effects: returnTerms(specimen.holder, lender.id),
        observed: {returned: specimen.id, endedEarly: at < p.gu_use_until}};
    }},
    recall: {roles, minutes: 1, settle({bound: {lender, borrower, specimen}, at}) {
        const p = specimen.properties;
        if (lender.properties.alive !== true || p.alive !== true || p.gu_title !== lender.id || p.gu_controller !== lender.id ||
            p.gu_use_grantee !== borrower.id || p.gu_keeper !== borrower.id || !p.gu_exclusive_loan ||
            !lender.place || lender.place === specimen.place || lender.place !== p[recallAnchor] ||
            p.gu_installed_in || (p.gu_furnace_job && p.gu_furnace_until >= at) || !(lender.quantities[fuel] >= 1)) {
            return refuse('Recall needs the living loaned Gu, its return anchor and the lender’s essence.');
        }
        return {ok: true, costs: [{quantity: fuel, payer: lender.holder, amount: 1}], effects: [
            property(specimen.holder, recallArrival, lender.place),
            {sentence: {verb: 'move', object: 'position', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
                details: {target: {shape: 'holder', id: specimen.holder}, to: lender.place}},
            property(specimen.holder, recallArrival, null),
        ]};
    }},
}});

export function guUseAgreementWorking(action, until, {recallable = false, price, offer} = {}) {
    if (!Object.hasOwn(GU_USE_AGREEMENT_LAW.operations, action)) throw Error('Unknown Gu agreement action.');
    const needs = GU_USE_AGREEMENT_LAW.operations[action].roles;
    if (action === 'extract') {
        const step = {op: action, bindings: Object.fromEntries(Object.keys(needs).map(role => [role, role]))};
        return {id: 'gu.use-agreement.extract', revision: 1, law: GU_USE_AGREEMENT_LAW.ref, roles: needs, steps: [step, step]};
    }
    return {id: 'gu.use-agreement.' + action, revision: 1, law: GU_USE_AGREEMENT_LAW.ref, roles: needs, steps: [
        {op: action, bindings: Object.fromEntries(Object.keys(needs).map(role => [role, role])),
            ...(action === 'sell' && {options: {price: price ?? null}}),
            ...(action === 'offer' && {options: {price: price ?? null, until: until ?? null}}),
            ...(action === 'counter' && {options: {offer: offer ?? null, price: price ?? null, until: until ?? null}}),
            ...(['accept', 'decline', 'accept-counter', 'decline-counter'].includes(action) && {options: {offer: offer ?? null}}),
            ...(['grant', 'share'].includes(action) && {options: {until: until ?? null,
                ...(action === 'grant' && recallable && {recallable: true})}})},
    ]};
}
