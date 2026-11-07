// positions@1 as a saved shared domain (FD15). Owns the optional top-level key `positions`; absent, foreign or unreadable loads fresh,
// and an untouched life writes no key. Imports no world (AR3/AR4): a world derives its rows and passes the row it is leaving.
import {registerDomain} from './domain_registry.js';
import {freshPositions, migratePositions, validatePositions, loadPositions, savePositions, positionsSlice, exitPosition, settlePositions, endPositionsOnDeath, positionsOf, POSITIONS_FAMILY} from './positions.js';
// exit({row, kind, at, reason}) records once; revert(slice) puts back an earlier snapshot when the save that goes with the exit fails.
const exit = ({row, kind, at, reason} = {}) => { exitPosition(row, {kind, at, reason}); return positionsSlice(); };
const revert = prior => { loadPositions(prior); };
// A world registers `live()`: its live state, or null when its life is not live. The tick settles term ends on the state's own clock.
const ports = new Map();
export function registerPositionsPort(id, live) {
    if (typeof id !== 'string' || !id || typeof live !== 'function') throw Error('Invalid positions port.');
    ports.set(id, live);
}
function tick() {
    for (const live of ports.values()) {
        try { const st = live(); if (st && Number.isInteger(st.clock) && st.clock >= 0) settlePositions(positionsOf(st), st.clock); } catch { /* world not ready: it settles on a later tick */ }
    }
}
// died({state, at}): the life's end, first observed by the world. Closes every open post as died at `at` (default: the state's clock).
const died = ({state, at} = {}) => endPositionsOnDeath(positionsOf(state), at ?? state?.clock);
registerDomain({id: 'positions', deps: [], initialState: freshPositions, tick,
    save: savePositions,
    validate: s => { if (s != null && s.family === POSITIONS_FAMILY) validatePositions(s); },
    migrate: migratePositions, load: loadPositions,
    projection: positionsSlice, commands: {exit, revert, died}});
