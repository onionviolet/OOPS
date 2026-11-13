// A physical haul checks the body's current capacity and the cargo's live
// load at settlement. The boost is temporary capacity, separate from effort.
import {natural, positive} from './basics.js';
import {defineWorkingLaw} from './kernel_working.js';
import {linkNeighbours, worldLinks} from './world_substrate.js';

const roles = {actor: 'body', cargo: 'thing', destination: 'place'};
const law = defineWorkingLaw({id: 'l.body-haul', revision: 1, operations: {
    haul: {roles, minutes: 1, settle({bound: {actor, cargo, destination}}) {
        if (!actor.holder || !actor.place || !cargo.holder || cargo.place !== actor.place ||
            !destination.holder || destination.holder === actor.place || !actor.haulExits?.includes(destination.holder))
            return {ok: false, reason: 'haul-out-of-reach'};
        const load = cargo.properties['haul-load'];
        const capacity = actor.properties['haul-capacity'];
        if (!positive(load) || !natural(capacity) || load - capacity > (actor.haulBoost ?? 0))
            return {ok: false, reason: 'load-exceeds-capacity'};
        return {ok: true, costs: [{quantity: 'stamina', amount: 1, payer: actor.holder}],
            effects: [actor, cargo].map(({holder}) => ({op: 'move', holder, to: destination.holder}))};
    }},
}});

export const BODY_HAUL_LAW = law;
export function readHaulBody(world, held) {
    return {haulExits: linkNeighbours(worldLinks(world), held.place, {kinds: ['path']}),
        haulBoost: world.laws.reduce((best, field) => field.scope === held.holder && field.kind === 'haul-strength' &&
            field.until > world.clock && natural(field.params.bonus) ? Math.max(best, field.params.bonus) : best, 0)};
}
export function bodyHaulWorking(bindings, minutes = 1) {
    return {law, bindings, method: {id: 'l.haul', revision: 1, law: law.ref, roles,
        steps: [{op: 'haul', minutes, bindings: {actor: 'actor', cargo: 'cargo', destination: 'destination'}}]}};
}
