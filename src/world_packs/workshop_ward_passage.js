// PC95 / WER1 and WER9. A named physical doorway between two authored
// endpoints on the same headless host carries a worn ward as two holders.
import {startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {previewRealmPassage, validateRealmConnection} from '../realm_connections.js';
import {quantityDef, substratePort, worldLinks} from '../world_substrate.js';
import {carriesMountedWard, wardPassageTerms} from './gear_ward.js';

const roles = {bearer: 'body', mount: 'thing', insert: 'thing', door: 'workshop_ward_door'};
const passageCosts = connection => [...connection.costs, ...(connection.requirements.costs ?? [])];

function quote({bearer, mount, insert, door}, at) {
    if (!door.connection || bearer.quantities.vitality === 0 || !carriesMountedWard(bearer, mount, insert)) return null;
    const {connection, from, to, sequence, otherCargo} = door;
    if (otherCargo) return null;
    const direction = bearer.place === from ? 'forward' : bearer.place === to ? 'reverse' : null;
    if (!direction) return null;
    const forward = direction === 'forward';
    const context = {actorId: bearer.holder, sequence, clock: at, endpoint: forward ? connection.from : connection.to,
        life: 'alive', body: {id: bearer.holder, revision: 1, form: 'human'},
        knownConnectionIds: [connection.id], knownBoundaryIds: [connection.requirements.id], cargoComplete: true,
        resources: [...new Set(passageCosts(connection).map(row => row.resourceId))].map(resourceId =>
            ({ownerId: bearer.holder, resourceId,
                amount: Math.max(0, (bearer.quantities[resourceId] ?? 0) - (door.bounds?.[resourceId]?.min ?? 0))})),
        cargo: [mount, insert].map(part => {
            const {lender, connection: permission} = wardPassageTerms(part);
            return {itemId: part.holder, ownerId: lender ?? bearer.holder, holderId: bearer.holder,
                classId: 'ward-assembly', count: 1, equipped: true, transferable: true,
                authorizedConnectionIds: permission === connection.id ? [permission] : []};
        }),
        bindings: [[connection.from, from], [connection.to, to]].map(([endpoint, place]) => ({
            endpoint, available: true, positions: [{id: place, free: true, bodyForms: ['human']}],
        }))};
    // Settlement checks admission now. Duration was already spent by the working.
    const plan = previewRealmPassage(connection, context, {expectedSequence: sequence,
        expectedRevision: connection.revision, operation: 'passage', direction});
    const transfers = [];
    if (door.collectorId && plan.costs.length) {
        for (const {resourceId, amount} of plan.costs) {
            const account = door.collection?.[resourceId];
            if (door.collectorId === bearer.holder || !account || account.amount + amount > account.max) {
                plan.allowed = false;
                plan.reasons.push('The doorway toll account cannot receive this payment.');
                break;
            }
            // Transfer the quoted stock itself. A cost substitute or debt cannot fund this credit.
            transfers.push({op: 'add', holder: bearer.holder, quantity: resourceId, amount: -amount},
                {op: 'add', holder: door.collectorId, quantity: resourceId, amount});
        }
    }
    return {plan, transfers, destination: forward ? to : from};
}

export const WARD_PASSAGE_LAW = defineWorkingLaw({id: 'workshop.carry_ward_through_door', revision: 1, operations: {
    cross: {roles, settle({bound, options: {origin, destination, revision, duration, quotedCosts = [], collectorId = null}, at}) {
        const {bearer, mount, insert, door} = bound;
        if (bearer.place !== origin || door.connection?.revision !== revision)
            return {ok: false, reason: 'The doorway or its approach has changed.'};
        const trip = quote(withManifest({...bound, door: {...door, connection: {...door.connection, duration: 0}}}), at);
        if (!trip?.plan.allowed || trip.destination !== destination || door.connection.duration !== duration ||
            (door.collectorId ?? null) !== collectorId ||
            JSON.stringify(trip.plan.costs) !== JSON.stringify(quotedCosts))
            return {ok: false, reason: 'The doorway can no longer carry this ward.'};
        return {ok: true, observed: {connection: door.connection.id, destination, cargo: [mount.holder, insert.holder],
            ...(collectorId ? {toll: {collectorId, costs: trip.plan.costs}} : {})},
            costs: collectorId ? [] : trip.plan.costs.map(({ownerId, resourceId, amount}) =>
                ({payer: ownerId, quantity: resourceId, amount})),
            effects: [...trip.transfers, ...[mount, insert, bearer].map(part => ({op: 'move', holder: part.holder, to: destination}))]};
    }},
}});

// The caller supplies the authored endpoints on create and restore. The live
// substrate link supplies availability; an arbitrary link cannot name worlds.
export function wardPassagePort({connection, from, to, collectorId = null, rules = null}) {
    validateRealmConnection(connection);
    if (!connection.open || connection.kind !== 'physical' || connection.from.worldId === connection.to.worldId ||
        from === to || connection.duration < 1 ||
        connection.requirements.exceptions?.length || !connection.flows.includes('cargo'))
        throw Error('Choose an open physical doorway with distinct world endpoints and a fixed duration.');
    if (passageCosts(connection).some(row => row.ownerId !== '$actor' || !Number.isSafeInteger(row.amount)))
        throw Error('This doorway needs whole payments from the traveler.');
    if (collectorId !== null && (typeof collectorId !== 'string' || !collectorId || !rules))
        throw Error('Bind the toll collector and its quantity rules.');
    const authored = structuredClone(connection);
    const bounds = Object.fromEntries(passageCosts(authored).map(({resourceId}) =>
        [resourceId, rules ? quantityDef(rules, resourceId) : null]));
    return (ref, at, world) => {
        if (ref.kind !== roles.door || ref.id !== authored.id) return null;
        const link = worldLinks(world).find(row => row.id === authored.id && row.kind === 'realm-door' &&
            row.from === from && row.to === to && row.cost === authored.duration && row.oneWay === !authored.bidirectional);
        if (!link) return null;
        const collector = collectorId && world.holders[collectorId];
        const collection = Object.fromEntries(Object.entries(bounds).flatMap(([resourceId, def]) => {
            const amount = collector?.quantities[resourceId];
            const max = def?.max;
            return Number.isSafeInteger(amount) && Number.isSafeInteger(max) ? [[resourceId, {amount, max}]] : [];
        }));
        // Other inventory owners must be deposited before this two-part crossing.
        return {connection: link.state === 'open' ? authored : {...authored, open: false,
            closure: {at, reason: 'manual', cause: 'workshop.door-closed'}},
            from, to, sequence: world.seq, collectorId, collection, bounds,
            carried: Object.values(world.holders).filter(item => item.kind === 'thing')
                .map(item => [item.id, item.properties.holder ?? null, item.properties['workshop.held_by'] ?? null])};
    };
}

function withManifest(bound) {
    const {bearer, mount, insert, door} = bound;
    return {...bound, door: {...door, otherCargo: door.carried?.some(([id, holder, workshopHolder]) =>
        (holder === bearer.holder || workshopHolder === bearer.holder) && id !== mount.holder && id !== insert.holder)}};
}

export function startWardRealmPassage(engine, {id, bearer, mount, insert, door}) {
    const ids = {bearer, mount, insert, door};
    const bindings = Object.fromEntries(Object.entries(roles).map(([role, kind]) => [role, {kind, id: ids[role]}]));
    const read = substratePort(engine.world);
    const bound = Object.fromEntries(Object.entries(bindings).map(([role, ref]) => [role, role === 'door'
        ? engine.host.ports.readThing?.(ref, engine.world.clock, engine.world) : read(ref)]));
    if (Object.values(bound).some(part => !part)) throw Error('Bring the mounted ward to a known doorway.');
    const trip = quote(withManifest(bound), engine.world.clock);
    if (!trip?.plan.allowed) throw Error(trip?.plan.reasons[0] ?? 'The doorway cannot carry this ward.');
    if (trip.plan.duration !== bound.door.connection.duration)
        throw Error('This doorway requires a different passage working.');
    return startEngineWorking(engine, {id, law: WARD_PASSAGE_LAW, bindings,
        method: {id: WARD_PASSAGE_LAW.id, law: WARD_PASSAGE_LAW.ref, revision: 1, roles,
            steps: [{op: 'cross', minutes: trip.plan.duration, bindings: {bearer: 'bearer', mount: 'mount', insert: 'insert', door: 'door'},
                options: {origin: bound.bearer.place, destination: trip.destination,
                    revision: bound.door.connection.revision, duration: trip.plan.duration, quotedCosts: trip.plan.costs,
                    collectorId: bound.door.collectorId ?? null}}]}});
}
