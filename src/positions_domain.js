// positions@1 as a saved shared domain (FD15). Owns the optional top-level key `positions`; absent, foreign or unreadable loads fresh,
// and an untouched life writes no key. Imports no world (AR3/AR4): a world derives its rows and passes the row it is leaving.
import {registerDomain} from './domain_registry.js';
import {freshPositions, migratePositions, validatePositions, loadPositions, savePositions, positionsSlice, exitPosition, POSITIONS_FAMILY} from './positions.js';
// exit({row, kind, at, reason}) records once; revert(slice) puts back an earlier snapshot when the save that goes with the exit fails.
const exit = ({row, kind, at, reason} = {}) => { exitPosition(row, {kind, at, reason}); return positionsSlice(); };
const revert = prior => { loadPositions(prior); };
registerDomain({id: 'positions', deps: [], initialState: freshPositions,
    save: savePositions,
    validate: s => { if (s != null && s.family === POSITIONS_FAMILY) validatePositions(s); },
    migrate: migratePositions, load: loadPositions,
    projection: positionsSlice, commands: {exit, revert}});
