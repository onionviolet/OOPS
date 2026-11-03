// World-neutral loop table (GM11, 2026-10-30, proposal). One row set per world says what a restart resets and what carries over; Mother of Learning,
// The Perfect Run and COI each register theirs and share the readout. It reads sw-death's RESTART_SCOPES for the mode and reason and never restarts anything.
import {RESTART_SCOPES} from './harm_restart_scope.js';
import {LOOP_RESETS, loopKey, rowTriggers} from './harm_loops.js';
const tables = new Map();
export function defineLoopTable({worldId, resets, carries, source}) {
    if(!worldId || !resets?.length || !carries?.length) throw new Error('A loop table names a world, what resets and what carries.');
    tables.set(worldId, Object.freeze({worldId, resets: [...resets], carries: [...carries], source: source ?? 'Proposed reset table'}));
}
// A start's table is its LOOP_RESETS row read for the player (no second table): only a row with structured carry entries derives one, so a
// registered table or the world default still answers for everything else. Key: worldId, or worldId#startId (harm_loops loopKey).
function derived(key) {
    const r = Object.hasOwn(LOOP_RESETS, key) ? LOOP_RESETS[key] : null;
    if(!r || !r.carry.some(c => typeof c === 'object')) return null;
    const entries = r.carry.filter(c => typeof c === 'object');
    const out = {source: `Proposed reset row ${key}: ${r.label}`, resets: entries.filter(c => c.class === 'reset').map(c => c.what),
        carries: entries.filter(c => c.class !== 'reset').map(c => c.carrier && c.carrier !== 'the self' ? `${c.what} (by ${c.carrier})` : c.what),
        triggers: rowTriggers(r).map(t => t.kind)};
    if(r.budget) out.budget = {...r.budget};
    if(Array.isArray(r.witnesses)) out.witnesses = r.witnesses.map(w => ({...w}));
    if(r.staleness) out.staleness = {...r.staleness};
    if(Array.isArray(r.exit)) out.exits = r.exit.map(e => ({...e}));
    return out;
}
export function loopReadout(worldId, held = [], startId) {
    const key = loopKey(worldId, startId), id = Object.hasOwn(RESTART_SCOPES, key) ? key : worldId;
    const own = Object.hasOwn(RESTART_SCOPES, id), scope = own ? RESTART_SCOPES[id] : RESTART_SCOPES.default, t = tables.get(key) ?? (startId ? null : tables.get(worldId));
    const base = {mode: scope.mode, reason: scope.reason, heldNow: [...held]};
    if(t) return {...base, source: t.source, resets: t.resets, carries: t.carries};
    const d = derived(key);
    if(d) return {...base, ...d};
    const w = startId ? tables.get(worldId) : null;
    if(w) return {...base, source: w.source, resets: w.resets, carries: w.carries};
    return {...base, source: 'World default: this world has no reset table yet', resets: ['Your body, health and money', 'Items you hold', 'Quests and this world’s own state and date'],
        carries: ['Cheats and preferences', 'Memories and the record of past lives', 'Other worlds, which keep running']};
}
