import {check} from './basics.js';
import {validateAlly} from './tempo_allies.js';
import {validateParts} from './tempo_location.js';
import {validateGoals, validateExit} from './tempo_exit.js';

// Saved-fight contract for tempo fights (schema 7); light so native_battle_contracts can import it without cycles.
export const TEMPO_SCHEMA = 7;
export const TEMPO_LOG_LINES = 12;
export const TEMPO_MOVE_IDS = ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield', 'order'];
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
            ['active', 'down', 'left'].includes(f.status) && Array.isArray(f.moves) && f.moves.every(m => TEMPO_MOVE_IDS.includes(m)) && f.profile?.stats && (f.ally === undefined || (f.side === 'a' && validateAlly(f.ally))) && validateParts(f.parts) && validateGoals(f.goals) && (f.learned === undefined || (f.learned && typeof f.learned === 'object' && Object.values(f.learned).every(v => typeof v === 'string'))) && (f.tries === undefined || natural(f.tries)), 'Invalid saved tempo fighter.');
        if(state && id !== 'player') check(!state.simulation.people[id] || state.simulation.people[id].life === 'alive', 'Unavailable tempo fighter.');
    }
    check(active(b, 'a').length && active(b, 'b').length, 'A tempo fight needs fighters on both sides while open.');
    return b;
}
