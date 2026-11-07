// AT17 PROTOTYPE of a proposal (AD32), not an accepted rule: docs/audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md.
// A recurring role is a person a world names often enough that a durable note (knowledge, a relationship, a claim) must be able to point at him.
// Default: the role is registered at all times with `provision:false` (so an untouched life stays byte-identical and a save that carries him always
// validates, F1), and is promoted to a real persistent person only at the first durable reference, through the existing `spawn` effect (no new save key,
// AR3). Promotion is idempotent (F3), keyed to the event and never to a projection (F6), and the id is the authored slot id, never a counter.
// Dial: the clock for `bornAt` is the live clock (spawn's own rule); a pack that wants ageing to match enrolled neighbours can anchor it later (F4).
// Leaf module: no world imports, no DOM, no save slice.
import {createSimulationRegistry} from './simulation_contracts.js';
import {applySimulationEffects} from './simulation_effects.js';

const roles = new Map();
// Register a promotable role. Nothing is provisioned: the definition only exists so a later promotion and every later load can validate.
export function defineRole(definition) {
    if(!definition || typeof definition.id !== 'string') throw Error('A recurring role needs an id.');
    if(roles.has(definition.id)) throw Error(`Role ${definition.id} is already defined.`);
    const def = {revision: 1, inventory: 'simulation', ...definition, provision: false};
    createSimulationRegistry({people: [def]}); // validates the shape once, here, rather than at the first fight
    roles.set(def.id, def);
    return def;
}
export const roleDefinitions = () => [...roles.values()];
// Put every defined role into a registry's people map (idempotent). Whoever builds or receives a registry calls this once before any save is validated.
export function installRoleDefinitions(registry) {
    const defs = createSimulationRegistry({people: roleDefinitions().filter(d => !registry.simulation.people.has(d.id))});
    for(const [id, def] of defs.people) registry.simulation.people.set(id, def);
}
export const roleRegistered = (registry, definitionId) => !!registry?.simulation?.people?.has(definitionId);
// Promote one role into the plan's state. True when this call created him; false when he already exists (a second fight, a replayed plan, a clock
// rewind inside the same state). Throws when the role is not registered: promoting without a definition would write a person no save could validate (F1).
export function promoteRole(plan, registry, {definitionId, personId = definitionId, cause}) {
    const s = plan?.state?.simulation;
    if(!s) throw Error('Promotion needs a simulation plan.');
    if(s.people[personId] && plan.state.actors[personId]) return false;
    if(!roleRegistered(registry, definitionId)) throw Error(`Role ${definitionId} is not registered.`);
    applySimulationEffects(plan, [{type: 'spawn', personId, definitionId}], {actorId: 'player'}, registry, cause);
    return true;
}
