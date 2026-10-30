import {check} from './basics.js';

// Saved-fight contract for tempo fights (schema 7); light so native_battle_contracts can import it without cycles.
export const TEMPO_SCHEMA = 7;
export const TEMPO_LOG_LINES = 12;
export const TEMPO_MOVE_IDS = ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield'];
export const TEMPO_FACT_HELD = 'tempo.held_minutes';

// Away minutes during an open fight are banked in memory by the clock and folded
// into the saved fight at its next command (LSD317). Known limit: minutes not yet
// folded are lost on reload, because the game has no wall-clock accrual to repay.
let pendingHold = 0;
export function recordTempoHold(minutes) {pendingHold += Number.isFinite(minutes) && minutes > 0 ? Math.floor(minutes) : 0;}
export function takeTempoHold() {const m = pendingHold; pendingHold = 0; return m;}

const natural = n => Number.isSafeInteger(n) && n >= 0;
const active = (b, side) => Object.keys(b.fighters).filter(id => b.fighters[id].status === 'active' && (!side || b.fighters[id].side === side));

export function validateTempoBattle(b, session, state) {
    check(b?.schema === TEMPO_SCHEMA && session?.definitionId === 'tempo.fight' && typeof b.id === 'string' && b.id, 'Invalid tempo fight binding.');
    check(natural(b.seed) && b.seed > 0 && b.seed <= 0xffffffff && natural(b.actions) && natural(b.now) && natural(b.seconds) && natural(b.held) && natural(b.floor), 'Invalid saved tempo fight.');
    check(Array.isArray(b.log) && b.log.length <= TEMPO_LOG_LINES && typeof b.last === 'string' && b.last.length <= 500 && b.result === null, 'Invalid tempo log.');
    const ids = Object.keys(b.fighters || {});
    check(ids.includes('player') && b.fighters.player.side === 'a' && ids.some(id => b.fighters[id].side === 'b'), 'Invalid tempo roster.');
    for(const id of ids) {
        const f = b.fighters[id];
        check(['a', 'b'].includes(f.side) && natural(f.ready) && f.speed > 0 && Number.isFinite(f.hp) && f.hp >= 0 && f.hp <= f.maxHp && f.stamina >= 0 && f.stamina <= f.maxStamina &&
            ['active', 'down', 'left'].includes(f.status) && Array.isArray(f.moves) && f.moves.every(m => TEMPO_MOVE_IDS.includes(m)) && f.profile?.stats, 'Invalid saved tempo fighter.');
        if(state && id !== 'player') check(!state.simulation.people[id] || state.simulation.people[id].life === 'alive', 'Unavailable tempo fighter.');
    }
    check(active(b, 'a').length && active(b, 'b').length, 'A tempo fight needs fighters on both sides while open.');
    return b;
}
