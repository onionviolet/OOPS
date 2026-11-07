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
// A live state whose chronicle life has ended (old age) closes its posts as died at the chronicle's own end minute, not the minute anyone looked.
const lifePorts = new Map();
export function registerPositionsLifePort(id, live) {
    if (typeof id !== 'string' || !id || typeof live !== 'function') throw Error('Invalid positions life port.');
    lifePorts.set(id, live);
}
function tick() {
    for (const live of lifePorts.values()) {
        try { const st = live(), at = st?.chronicle?.life?.endedAt; if (Number.isInteger(at) && at >= 0) endPositionsOnDeath(positionsOf(st), at); } catch { /* world not ready: it settles on a later tick */ }
    }
    for (const live of ports.values()) {
        try { const st = live(); if (st && Number.isInteger(st.clock) && st.clock >= 0) settlePositions(positionsOf(st), st.clock); } catch { /* world not ready: it settles on a later tick */ }
    }
}
// died({state, at}): the life's end, first observed by the world. Closes every open post as died at `at` (default: the state's clock).
const died = ({state, at} = {}) => endPositionsOnDeath(positionsOf(state), at ?? state?.clock);
// diedInSave(save): a continuation death applied to a save envelope. Closes the posts that save holds, as died at the chronicle's end minute or else the
// save's own clock, and writes the result into save.positions (no key when no post was ever held). The live slice is left as it was.
const diedInSave = save => {
    const st = save?.expansion, at = Number.isInteger(st?.chronicle?.life?.endedAt) ? st.chronicle.life.endedAt : st?.clock;
    if (!Number.isInteger(at) || at < 0) return save;
    const prior = positionsSlice();
    try {
        loadPositions(save.positions ?? freshPositions());
        endPositionsOnDeath(positionsOf(st), at);
        const out = savePositions();
        if (out === undefined) delete save.positions; else save.positions = out;
    } catch { /* unreadable posts stay as saved */ } finally { loadPositions(prior); }
    return save;
};
registerDomain({id: 'positions', deps: [], initialState: freshPositions, tick,
    save: savePositions,
    validate: s => { if (s != null && s.family === POSITIONS_FAMILY) validatePositions(s); },
    migrate: migratePositions, load: loadPositions,
    projection: positionsSlice, commands: {exit, revert, died, diedInSave}});
