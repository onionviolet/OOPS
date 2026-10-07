// Unpublished plans only. The existing expansion publisher owns persistence.
import {activePractice} from './techniques.js';
import {simulationOccupiesActor, waitingSimulationChoice} from './simulation.js';
import {stageAcquisition} from './acquisition.js';

export const BACKLOG_SCHEMA = 1;
export const BACKLOG_REPLACEMENT_SCHEMA = 2;
export const backlogAssert = (ok, message) => { if (!ok) throw Error(message); };
export function backlogPlan(state, context) {
    return {state:structuredClone(state), external:structuredClone(context.external || {}),
        gameplay:structuredClone(context.gameplay || {}), vitals:structuredClone(context.vitals || {}),
        equipment:structuredClone(context.equipment || {}), acquisitions:[], unlocks:[],
        gameplayBefore:structuredClone(context.gameplay || {})};
}
export function assertBacklogBoundary(state, context) {
    backlogAssert(context.actorId === 'player' && state.simulation?.people.player?.life === 'alive', 'Meet local people and work before choosing this proof.');
    const physical = context.vitals?.player;
    backlogAssert(context.nativeAlive === true && physical && ['health','max_health','stamina','max_stamina'].every(key => Number.isFinite(physical[key]) && physical[key] >= 0) &&
        physical.health > 0 && physical.max_health >= physical.health && physical.max_stamina >= physical.stamina,
        'Bind a living actual native body before choosing this proof.');
    backlogAssert(!context.busy && !state.pending.length && !state.simulation.jobs.length && !Object.keys(state.simulation.sessions).length &&
        !simulationOccupiesActor(state, 'player') && !activePractice(state.actors.player) && !state.chronicle?.session &&
        state.chronicle?.life.endedAt == null && !waitingSimulationChoice(state), 'Finish current work, encounters and waiting decisions first.');
    backlogAssert(!Object.values(state.simulation.pursuits || {}).some(p => ['investigating','searching','moving','waiting','sheltered','encounter'].includes(p.status)), 'Resolve the active pursuit first.');
    backlogAssert(!Object.values(state.realmPrototype?.observation?.state?.leases || {}).some(lease => lease.status === 'active'), 'Close the remote view before changing a body or clock.');
}
export function backlogRecord(plan) {
    const state = plan.state;
    backlogAssert(!state.backlog || [BACKLOG_SCHEMA,BACKLOG_REPLACEMENT_SCHEMA].includes(state.backlog.schema), 'This backlog save needs a compatible build.');
    state.backlog ||= {schema:BACKLOG_SCHEMA, revision:1, enrolledAt:state.clock, receipts:{}};
    return state.backlog;
}
export function backlogActor(plan, id) {
    const actor = plan.state.actors[id], person = plan.state.simulation.people[id];
    backlogAssert(actor && person, 'The actual participant has not been introduced.');
    return {actor, person};
}
export function backlogInventory(plan, actorId) {
    const {person} = backlogActor(plan, actorId);
    if(person.inventory === 'simulation') {
        backlogAssert(plan.state.simulation.owners[actorId], 'Bind the participant’s actual possessions.');
        return plan.state.simulation.owners[actorId];
    }
    const inventory = plan.gameplay[actorId]?.inventory;
    backlogAssert(inventory, 'Bind the actual native inventory before this action.');
    return inventory;
}
export function backlogItem(plan, actorId, key, delta, {acquisition = true} = {}) {
    backlogAssert(Number.isSafeInteger(delta) && typeof key === 'string', 'Invalid stock operation.');
    backlogAssert(!Object.values(plan.state.simulation.custody || {}).some(c => c.key === key && c.holder === actorId), 'Return or release borrowed stock first.');
    backlogAssert(delta >= 0 || !Object.values(plan.state.simulation.equipment[actorId] || {}).includes(key), 'Unequip the item before using it.');
    const bag = backlogInventory(plan, actorId);
    if(delta === 0) return;
    const next = stageAcquisition({owner:bag}, delta < 0 ? {consumes:[{owner:'owner',key,count:-delta}]} : {grants:[{owner:'owner',key,count:delta}]}).owner;
    for(const k of Object.keys(bag)) delete bag[k];
    Object.assign(bag,next);
    if(delta > 0 && acquisition) plan.acquisitions.push({owner:actorId,key,count:delta});
}
export function backlogTransfer(plan, from, to, key, count) {
    backlogAssert(Number.isSafeInteger(count) && count > 0 && from !== to, 'Invalid property transfer.');
    backlogItem(plan, from, key, -count); backlogItem(plan, to, key, count);
}
export function backlogLog(plan, text) {
    const s = plan.state.simulation;
    s.log.push({at:plan.state.clock, text, cause:`backlog:${plan.state.sequence + 1}`});
    s.log = s.log.slice(-100);
}
