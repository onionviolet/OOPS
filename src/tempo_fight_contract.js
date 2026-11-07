import {check} from './basics.js';
import {validateAlly} from './tempo_allies.js';
import {validateParts} from './tempo_location.js';
import {validateGoals, validateExit} from './tempo_exit.js';
import {CHANNEL_IDS} from './channels.js';

// Saved-fight contract for tempo fights (schema 7); light so native_battle_contracts can import it without cycles.
export const TEMPO_SCHEMA = 7;
export const TEMPO_LOG_LINES = 12;
export const TEMPO_MOVE_IDS = ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield', 'order'];
// Stock moves (FD3/FD17, AT15): granted per fighter, never in the default list, so fights that do not name them are unchanged.
export const TEMPO_STOCK_MOVE_IDS = ['shoot', 'reload'];
export const TEMPO_ALLOWED_MOVE_IDS = [...TEMPO_MOVE_IDS, ...TEMPO_STOCK_MOVE_IDS];
export const TEMPO_FACT_HELD = 'tempo.held_minutes';

// Away minutes during an open fight are banked in memory by the clock and folded
// into the saved fight (LSD317). With the open fight passed they go straight into
// its saved `held`, so a save and reload keeps them; without it they wait in memory.
let pendingHold = 0;
export function recordTempoHold(minutes, battle) {
    const m = Number.isFinite(minutes) && minutes > 0 ? Math.floor(minutes) : 0;
    if(battle) battle.held = Math.min(7 * 24 * 60, (battle.held || 0) + m); else pendingHold += m;
}
export function takeTempoHold() {const m = pendingHold; pendingHold = 0; return m;}

const natural = n => Number.isSafeInteger(n) && n >= 0;
// Ready stock carried into a fight (FD3): counts live in the fight record; `keys` (player only) names the actor resources written back once at the end.
const chance = n => Number.isFinite(n) && n >= 0 && n <= 1;
// N7: `holder` names the fighter who carries the stock (stamped at begin; absent in older saves). Only the player's stock may carry `keys`:
// a foe's rounds live and die inside the fight record and are never written to an actor (a foe is not persistent stock).
export function validateTempoStock(st, ids, holder) {
    if(st === undefined) return true;
    const keysOk = st.keys === undefined || (holder === 'player' && st.keys && typeof st.keys.loaded === 'string' && typeof st.keys.carried === 'string' && st.start && natural(st.start.loaded) && natural(st.start.carried));
    return !!st && (st.holder === undefined || st.holder === holder) && typeof st.kind === 'string' && natural(st.loaded) && natural(st.carried) && Number.isSafeInteger(st.capacity) && st.capacity > 0 && st.loaded <= st.capacity &&
        Number.isSafeInteger(st.batch) && st.batch > 0 && keysOk && st.vs && typeof st.vs === 'object' &&
        Object.entries(st.vs).every(([id, v]) => ids.includes(id) && chance(v?.chance) && Number.isFinite(v.downIn) && v.downIn >= 1);
}
// Channel effects of moves (lane W7-B): `channels` maps a move this fighter holds to the effect line it leaves in the log; `conceal` (notches, 0 or absent = in the open)
// is how hard the effect is to notice; `perceive` (notches) is this fighter's noticing, absent = no edge. Lines are resolved when written, never stored hidden.
export function validateTempoChannels(f) {
    if(f.perceive !== undefined && !Number.isFinite(f.perceive)) return false;
    if(f.channels === undefined) return true;
    return !!f.channels && typeof f.channels === 'object' && Object.entries(f.channels).every(([m, c]) => f.moves.includes(m) && c && CHANNEL_IDS.includes(c.channel) &&
        typeof c.text === 'string' && c.text.length > 0 && c.text.length <= 200 && (c.neutral === undefined || (typeof c.neutral === 'string' && c.neutral.length <= 200)) && (c.conceal === undefined || (Number.isFinite(c.conceal) && c.conceal >= 0)));
}
const active = (b, side) => Object.keys(b.fighters).filter(id => b.fighters[id].status === 'active' && (!side || b.fighters[id].side === side));

export function validateTempoBattle(b, session, state) {
    check(b?.schema === TEMPO_SCHEMA && session && typeof session.definitionId === 'string' && typeof b.id === 'string' && b.id, 'Invalid tempo fight binding.');
    check(natural(b.seed) && b.seed > 0 && b.seed <= 0xffffffff && natural(b.actions) && natural(b.now) && natural(b.seconds) && natural(b.held) && natural(b.floor), 'Invalid saved tempo fight.');
    check(b.worst === undefined || (b.worst && typeof b.worst === 'object' && Object.values(b.worst).every(w => typeof w.holder === 'string' && typeof w.subject === 'string' && Number.isSafeInteger(w.severity) && w.severity >= 0 && w.severity <= 4 && Number.isFinite(w.amount) && w.amount >= 0 && typeof w.place === 'string')), 'Invalid tempo witness record.');
    check(b.hits === undefined || (Array.isArray(b.hits) && b.hits.length <= TEMPO_LOG_LINES && b.hits.every(h => typeof h.actor === 'string' && typeof h.target === 'string' && typeof h.slot === 'string' && Number.isFinite(h.dmg) && Number.isFinite(h.stopped) && Number.isFinite(h.multiplier ?? 1) && (h.split === undefined || (h.split && typeof h.split === 'object')) && (h.injury === undefined || typeof h.injury === 'string'))), 'Invalid tempo hit record.');
    check(validateExit(b.exit), 'Invalid tempo exit record.');
    check(Array.isArray(b.log) && b.log.length <= TEMPO_LOG_LINES && typeof b.last === 'string' && b.last.length <= 500 && b.result === null, 'Invalid tempo log.');
    const ids = Object.keys(b.fighters || {});
    check(ids.includes('player') && b.fighters.player.side === 'a' && ids.some(id => b.fighters[id].side === 'b'), 'Invalid tempo roster.');
    for(const id of ids) {
        const f = b.fighters[id];
        check(['a', 'b'].includes(f.side) && natural(f.ready) && f.speed > 0 && Number.isFinite(f.hp) && f.hp >= 0 && f.hp <= f.maxHp && f.stamina >= 0 && f.stamina <= f.maxStamina &&
            ['active', 'down', 'left'].includes(f.status) && Array.isArray(f.moves) && f.moves.every(m => TEMPO_ALLOWED_MOVE_IDS.includes(m)) && validateTempoStock(f.stock, ids, id) && (f.tags === undefined || (Array.isArray(f.tags) && f.tags.length <= 8 && f.tags.every(t => typeof t === 'string' && t.length > 0 && t.length <= 32))) && validateTempoChannels(f) && f.profile?.stats && (f.ally === undefined || (f.side === 'a' && validateAlly(f.ally))) && validateParts(f.parts) && validateGoals(f.goals) && (f.learned === undefined || (f.learned && typeof f.learned === 'object' && Object.values(f.learned).every(v => typeof v === 'string'))) && (f.tries === undefined || natural(f.tries)), 'Invalid saved tempo fighter.');
        if(state && id !== 'player') check(!state.simulation.people[id] || state.simulation.people[id].life === 'alive', 'Unavailable tempo fighter.');
    }
    check(active(b, 'a').length && active(b, 'b').length, 'A tempo fight needs fighters on both sides while open.');
    return b;
}
