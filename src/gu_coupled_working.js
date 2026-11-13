// A Gu procedure beat as one K filler (SC6, KW18-KW21). The world form reads
// live custody, appetite and balances. The component form takes fixture
// reserves. In both forms the kernel owns time, receipts and restore.
import {check, natural, object} from './basics.js';
import {stableId} from './simulation_ids.js';
import {resolveGuActivation} from './gu_activation.js';
import {guWorldUseReason} from './gu_world_use.js';
import {defineWorkingLaw, MAX_WORKING_STEPS, validateWorkingMethod} from './kernel_working.js';
import {linkDistance, linkExits, worldLinks} from './world_substrate.js';

const refuse = reason => ({ok: false, reason});
const channelCapacity = 'gu.essence-channel-capacity';

export function readGuCoupledRoute(ref, _at, world) {
    if (ref.kind !== 'gu-coupled-route' || world.holders[ref.id]?.kind !== 'place') return null;
    return {links: worldLinks(world), channels: world.laws.filter(field => field.kind === channelCapacity && field.scope === 'world'),
        places: Object.values(world.holders)
        .filter(holder => holder.kind === 'place' && 'temperature' in holder.quantities).map(holder => holder.id),
        occupants: Object.values(world.holders)
        .filter(holder => holder.kind === 'body' && holder.properties.alive === true && holder.quantities.vitality > 0)
        .map(({id, place, properties}) => ({id, place, properties}))};
}

function supportTransfer(corridor, channel, from, to, amount, at) {
    const pathOptions = {kinds: [channel.kind], maxCost: channel.reach};
    if (!linkDistance(corridor.links, from, to, pathOptions)) return refuse('storm support channel unavailable');
    const finite = new Map(corridor.channels.map(field => [field.params.link, field]));
    const links = corridor.links.filter(link => {
        const field = finite.get(link.id);
        return !field || field.params.capacity - channelUsed(field, at) >= amount;
    });
    const path = linkDistance(links, from, to, pathOptions);
    if (!path) return refuse('storm support channel capacity unavailable');
    return {ok: true, effects: path.route.flatMap(link => {
        const field = finite.get(link);
        return field ? [channelBalance(field, at, channelUsed(field, at) + amount)] : [];
    })};
}

function channelUsed({params}, at) {
    if (params.at === at) return params.used;
    if (params.refillPerMinute === undefined || params.at === undefined) return 0;
    return Math.max(0, params.used - params.refillPerMinute * Math.max(0, at - params.at));
}

const channelBalance = (field, at, used) => ({op: 'law_params', id: field.id, params: {at, used}});
const rechargeRoles = {operator: 'operator', corridor: 'gu-coupled-route'};
const livingRechargeRoles = {...rechargeRoles, specimen: 'gu'};

function channelRecharge(roles) {
    return {roles, minutes: 1, settle({bound: {operator, corridor, specimen}, options: {fieldId}, at}) {
        const field = corridor.channels.find(row => row.id === fieldId);
        const link = field && corridor.links.find(row => row.id === field.params.link);
        if (!link || link.state !== 'open' || operator.place !== link.from || operator.properties.alive !== true ||
            field.params.keeper !== operator.holder || !natural(field.params.refillPerMinute)) {
            return refuse('channel recharge unavailable');
        }
        const used = channelUsed(field, at);
        if (!(used >= 1)) return refuse('channel reservoir is full');
        if (field.params.rechargeGu !== undefined || specimen) {
            const p = specimen?.properties;
            if (!p || specimen.holder !== field.params.rechargeGu || p.alive !== true || p.injured ||
                !(specimen.quantities.satiety > 0) || guWorldUseReason(specimen, operator.id, operator.place, at))
                return refuse('channel recharge Gu unavailable');
        }
        const quantity = field.params.rechargeFuel;
        if (typeof quantity !== 'string' || !(operator.quantities[quantity] >= 1)) return refuse('channel recharge essence unavailable');
        return {ok: true, costs: [{quantity, payer: operator.holder, amount: 1}],
            effects: [channelBalance(field, at, used - 1)]};
    }};
}

export const GU_CHANNEL_RECHARGE_LAW = defineWorkingLaw({id: 'gu.channel-recharge', revision: 1, operations: {
    recharge: channelRecharge(rechargeRoles),
    'recharge-with-gu': channelRecharge(livingRechargeRoles),
}});

export function guChannelRechargeWorking(fieldId, {living = false} = {}) {
    check(stableId(fieldId), 'Recharge needs a channel field.');
    const roles = living ? livingRechargeRoles : rechargeRoles;
    return {id: 'gu.channel.recharge', revision: 1, law: GU_CHANNEL_RECHARGE_LAW.ref, roles,
        steps: [{op: living ? 'recharge-with-gu' : 'recharge', minutes: 1,
            bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role])), options: {fieldId}}]};
}

function routeTargets({operator, corridor}, route, ground) {
    const foes = corridor.occupants.filter(holder => holder.id !== operator.id && ground.includes(holder.place) &&
        holder.properties[route.side] && holder.properties[route.side] !== operator.properties[route.side]);
    return {ground: ground.filter(id => corridor.places.includes(id)), foes: foes.map(holder => holder.id)};
}

function walkRoute(links, kind, origin, ids, radius) {
    const ground = [];
    let here = origin;
    let remaining = radius;
    for (const link of ids) {
        const exit = linkExits(links, here, {kinds: [kind]}).find(row => row.link === link);
        if (!exit || exit.cost > remaining || exit.to === origin || ground.includes(exit.to)) return null;
        here = exit.to;
        remaining -= exit.cost;
        ground.push(exit.to);
    }
    return {ground, remaining};
}

function worldEffects(rows, bound, targets, destination) {
    return rows.map(({verb, object, role, details}) => ({
        sentence: {verb, object, target: 'bound', time: details.minutes ? 'sustained' : 'instant',
            carrier: 'gu', cost: 'none', limits: []},
        details: {...details, target: targets && Object.hasOwn(targets, role)
            ? {shape: 'holders', ids: targets[role]} : {shape: 'holder', id: bound[role].holder},
        ...(verb === 'move' && {to: destination})},
    }));
}

function settleCrossing({bound, facts, options: {participants, world, index, upkeep = []}, at}) {
    const {operator, corridor} = bound;
    const flight = facts.coupledRoute;
    if (!flight || operator.place !== flight.here || operator.properties.alive === false ||
        !operator.properties[world.route.side]) return refuse('storm path changed');
    for (const {id, kind} of participants) {
        const held = bound[id];
        const p = held.properties;
        const reason = guWorldUseReason(held, operator.id, flight.here, at);
        if (reason) return refuse(reason);
        if (p.alive !== true || p.injured || p.gu_kind !== kind || !(held.quantities.satiety > 0))
            return refuse('storm constituent unavailable');
    }
    const leg = walkRoute(corridor.links, world.route.kind, flight.here, [world.route.crossings[index]], flight.remaining);
    const next = leg?.ground[0];
    if (!next || next !== flight.ground[index]) return refuse('storm crossing unavailable');
    const supporter = bound.supporter;
    let channelEffects = [];
    if (supporter && (supporter.holder === operator.holder || !supporter.place ||
        supporter.properties.alive !== true || supporter.properties[world.route.side] !== operator.properties[world.route.side])) {
        return refuse('storm crossing supporter unavailable');
    }
    if (supporter && supporter.place !== flight.here) {
        const channel = world.route.supportChannel;
        if (!channel) return refuse('storm crossing supporter unavailable');
        const amount = upkeep.filter(row => row.role === 'supporter').reduce((total, row) => total + row.amount, 0);
        const transfer = supportTransfer(corridor, channel, supporter.place, flight.here, amount, at);
        if (!transfer.ok) return transfer;
        channelEffects = transfer.effects;
    }
    const costs = upkeep.map(({quantity, amount, role = 'operator'}) =>
        ({quantity, amount, payer: bound[role].holder}));
    if (upkeep.some(({quantity, amount, role = 'operator'}) => !(bound[role].quantities[quantity] >= amount))) {
        return refuse('storm crossing essence unavailable');
    }
    const effects = worldEffects(world.effects.filter(row => !row.details.minutes), bound,
        routeTargets(bound, world.route, [next]), next);
    return {ok: true, effects: [...channelEffects, ...effects], ...(costs.length && {costs}),
        facts: {coupledRoute: {...flight, here: next, remaining: leg.remaining}},
        observed: {crossed: next}};
}

function settleBeat({bound, facts, options: {participants, effect, scope, world}, at}) {
    const operator = bound.operator.id;
    const reserve = world
        ? Object.fromEntries(participants.map(({fuel}) => [fuel, bound.operator.quantities?.[world.fuelAccounts[fuel]] ?? 0]))
        : facts.reserves?.[operator] ?? {};
    if (!object(reserve)) return refuse('invalid-essence-reserve');
    if (world) {
        if (bound.operator.place !== bound.origin.id || (!world.route && bound.target.place !== bound.place.id)) {
            return refuse('storm path changed');
        }
        const from = bound.origin.properties?.[world.position];
        const to = bound.place.properties?.[world.position];
        if (!Number.isFinite(from) || !Number.isFinite(to) || Math.abs(to - from) > scope.radius) {
            return refuse('storm destination out of reach');
        }
        if (!world.route && bound.target.id === operator) return refuse('storm target must be distinct');
    }
    let path;
    if (world?.route) {
        const {operator, origin, place, corridor} = bound;
        const ids = world.route.crossings ?? linkDistance(corridor.links, origin.id, place.id,
            {kinds: [world.route.kind], maxCost: scope.radius})?.route;
        if (ids && corridor.id === place.id && operator.properties[world.route.side]) {
            path = walkRoute(corridor.links, world.route.kind, origin.id, ids, scope.radius);
        }
        if (!path || (path.ground.at(-1) ?? origin.id) !== place.id) return refuse('storm route unavailable');
    }
    const stages = [];
    const used = new Set();
    for (const {id, kind, fuel, cost} of participants) {
        const held = bound[id];
        const specimen = world ? {id: held.id, holder: held.properties.gu_keeper,
            guKind: held.properties.gu_kind, alive: held.properties.alive === true,
            injured: held.properties.injured, fedThrough: held.quantities.satiety > 0 ? at : at - 1} : held;
        if (used.has(specimen.id)) return refuse('duplicate-gu');
        if (specimen.guKind !== kind) return refuse('wrong-gu-kind');
        const reason = world ? guWorldUseReason(held, operator, bound.origin.id, at)
            : specimen.holder !== operator ? 'gu-not-held' : null;
        if (reason) return refuse(reason);
        const balance = Object.hasOwn(reserve, fuel) ? reserve[fuel] : 0;
        if (!Number.isFinite(balance) || balance < 0) return refuse('invalid-essence-reserve');
        used.add(specimen.id);
        // The beat pays to use each body. Its constituent activations have
        // no standalone output; only a successful beat emits the combined intent.
        stages.push({gu: {...specimen, kind: specimen.guKind}, operator, ability: {fuel, cost}});
    }

    const completionEffect = scope ? {...effect, scope: {place: bound.place.id, radius: scope.radius}} : effect;
    const result = resolveGuActivation({beats: [{stages}], reserves: {...facts.reserves, [operator]: reserve},
        day: world ? at : facts.day ?? at, modifiers: facts.modifiers ?? [], completionEffect});
    if (result.outcome !== 'complete') return refuse(result.reason);
    if (world) return {ok: true,
        costs: result.activations.map(({fuel, cost}) => ({
            quantity: world.fuelAccounts[fuel], payer: bound.operator.holder, amount: cost,
        })),
        ...(world.route?.crossings && {facts: {coupledRoute: {ground: path.ground, here: bound.origin.id, remaining: scope.radius}}}),
        effects: world.route?.crossings
            ? worldEffects(world.effects.filter(row => row.details.minutes), bound, null, bound.origin.id)
            : worldEffects(world.effects, bound, path && routeTargets(bound, world.route,
                path.ground.length ? path.ground : [bound.place.id]), bound.place.holder),
        observed: {activated: result.activations.map(row => row.id)},
    };
    return {ok: true, facts: {reserves: result.remaining}, effects: result.effects,
        costs: result.activations.map(({fuel, cost, operator}) => ({quantity: `essence.${fuel}`, holder: operator, amount: cost})),
        observed: {activated: result.activations.map(row => row.id)}};
}

// Versioned world data supplies concrete role kinds, charges, minutes and a
// combined effect intent. A scoped intent binds a live place and its authored
// radius. The host decides how to apply the intent to that place.
export function compileGuCoupledBeat({id, revision, grammar, participants, minutes, effect, scope, world}) {
    check(stableId(id) && natural(revision) && revision > 0 && natural(minutes), 'A Gu beat needs a versioned id and duration.');
    check(Array.isArray(participants) && participants.length >= 2, 'A coupled beat needs at least two Gu.');
    check(object(effect) && stableId(effect.kind), 'A coupled beat needs a combined effect.');
    check(scope === undefined || (object(scope) && Number.isFinite(scope.radius) && scope.radius > 0),
        'A scoped beat needs a positive radius.');

    check(world === undefined || (scope && stableId(world.position) && object(world.fuelAccounts) &&
        Array.isArray(world.effects) && world.effects.length > 0), 'A world beat needs a scope, accounts and effects.');
    const crossings = world?.route?.crossings;
    const crossingFuel = world?.route?.crossingFuel;
    const supportFuel = world?.route?.supportFuel;
    const supportChannel = world?.route?.supportChannel;
    check(!world?.route || (stableId(world.route.kind) && stableId(world.route.side) && Number.isSafeInteger(scope.radius)),
        'A routed beat needs link and side keys and whole reach.');
    check(crossings === undefined || Array.isArray(crossings) && crossings.length > 0 &&
        crossings.length < MAX_WORKING_STEPS && crossings.every(stableId), 'A staged route needs a bounded list of links.');
    check(crossingFuel === undefined || (crossings && object(crossingFuel)), 'Crossing fuel needs a staged route.');
    check(supportFuel === undefined || (crossings && object(supportFuel) && Object.keys(supportFuel).length > 0),
        'Support fuel needs a staged route and at least one account.');
    check(supportChannel === undefined || (supportFuel && object(supportChannel) &&
        stableId(supportChannel.kind) && natural(supportChannel.reach)), 'Remote support needs a funded link channel and whole reach.');
    const roles = {operator: 'operator', ...(scope && {place: 'place'}),
        ...(world && {origin: 'place', ...(world.route ? {corridor: 'gu-coupled-route'} : {target: 'creature'})}),
        ...(supportFuel && {supporter: 'operator'})};
    const charges = participants.map(participant => {
        const {id, kind, fuel, cost} = participant;
        check(stableId(id) && !Object.hasOwn(roles, id) && (!world?.route || !['ground', 'foes'].includes(id)) &&
            stableId(kind) && stableId(fuel) && Number.isFinite(cost) && cost > 0,
            'Each Gu beat role needs a unique id, a kind, a fuel and a positive cost.');
        check(!world || (Number.isSafeInteger(cost) && typeof world.fuelAccounts[fuel] === 'string'),
            'A world beat needs whole costs and a named account for each fuel.');
        roles[id] = 'gu';
        return {id, kind, fuel, cost};
    });
    const methodId = `gu.coupled.${id}`;
    const upkeep = [['operator', crossingFuel], ['supporter', supportFuel]].flatMap(([role, fuelCosts]) =>
        Object.entries(fuelCosts ?? {}).map(([fuel, amount]) => {
            check(charges.some(row => row.fuel === fuel) && Number.isSafeInteger(amount) && amount > 0,
                'Crossing fuel needs a constituent account and a positive whole cost.');
            return {quantity: world.fuelAccounts[fuel], amount, role};
        }));
    if (world) {
        const fuels = new Set(charges.map(row => row.fuel));
        check(new Set([...fuels].map(fuel => world.fuelAccounts[fuel])).size === fuels.size,
            'A world beat cannot quote one account as two fuels.');
        for (const row of world.effects) {
            const area = world.route && ['ground', 'foes'].includes(row?.role) && row.verb !== 'move' &&
                (!crossings || !row.details?.minutes);
            check(object(row) && stableId(row.verb) && stableId(row.object) && (Object.hasOwn(roles, row.role) || area) &&
                object(row.details), 'A world effect needs a verb, object, bound role and details.');
        }
    }
    const bindings = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
    const law = defineWorkingLaw({id: `${methodId}.r${revision}`, revision: 1, operations: {activate: {roles, settle: settleBeat},
        ...(crossings && {cross: {roles, settle: settleCrossing}})}});
    const method = validateWorkingMethod(law, {id: methodId, revision, law: law.ref, roles, ...(grammar !== undefined && {grammar}),
        steps: [{op: 'activate', minutes, bindings,
            options: structuredClone({participants: charges, effect, ...(scope && {scope: {radius: scope.radius}}),
                ...(world && {world})})}, ...(crossings ?? []).map((_, index) => ({op: 'cross', minutes: 1, bindings,
                    options: structuredClone({participants: charges, world, index, ...(upkeep.length && {upkeep})})}))]});
    return {law, method};
}
