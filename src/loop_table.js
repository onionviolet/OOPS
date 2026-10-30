// World-neutral loop table (GM11, 2026-10-30, proposal). One row set per world says what a restart resets and what carries over; Mother of Learning,
// The Perfect Run and COI each register theirs and share the readout. It reads sw-death's RESTART_SCOPES for the mode and reason and never restarts anything.
import {RESTART_SCOPES} from './harm_restart_scope.js';
const tables = new Map();
export function defineLoopTable({worldId, resets, carries, source}) {
    if(!worldId || !resets?.length || !carries?.length) throw new Error('A loop table names a world, what resets and what carries.');
    tables.set(worldId, Object.freeze({worldId, resets: [...resets], carries: [...carries], source: source ?? 'Proposed reset table'}));
}
export function loopReadout(worldId, held = []) {
    const own = Object.hasOwn(RESTART_SCOPES, worldId), scope = own ? RESTART_SCOPES[worldId] : RESTART_SCOPES.default, t = tables.get(worldId);
    const base = {mode: scope.mode, reason: scope.reason, heldNow: [...held]};
    if(t) return {...base, source: t.source, resets: t.resets, carries: t.carries};
    return {...base, source: 'World default: this world has no reset table yet', resets: ['Your body, health and money', 'Items you hold', 'Quests and this world’s own state and date'],
        carries: ['Cheats and preferences', 'Memories and the record of past lives', 'Other worlds, which keep running']};
}
