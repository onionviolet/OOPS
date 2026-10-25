// Original proposal inspired by level bands, readable moves and layered area loot.
// No Proto23 source code/assets. Host owns native combat, custody, clock and commits.
import {copyJson as clone, deepFreeze as freeze} from '../../basics.js';
export const PROFILE_ID = 'p23.reed-circle.v1';
export const ENEMY_ID = 'Reed-circle sparring construct';
export const AREA_ID = 'Proto23 reed-circle training';
export const WORLD_ID = 'reference.proto23.village';
export const PROFILE = freeze({id: PROFILE_ID, levels: [1, 3], move: 'Reed sweep',
    counter: 'defensive', status: 'p23.off-balance', moveChance: 0.35,
    description: 'A reed-padded construct practises Reed sweep. Defensive Measures counters its one-exchange off-balance lesson.',
    stats: {health: [24, 40], attack: [3, 5], agility: [6, 10], dexterity: [6, 10],
        intuition: [4, 6], magic: [0, 0], defense: [1, 3], attack_speed: [0.7, 0.9], attack_count: [1, 1]},
    drop: {item_id: 'Piece of willow wood', chance: 0.2, rankMinimum: 1, rankMaximum: 3}});
const integer = (n, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(n) && n >= min && n <= max;
function requireValue(ok, message) {if (!ok) throw new TypeError(message);}
function keys(value, expected) {
    requireValue(value && typeof value === 'object' && !Array.isArray(value), 'Expected profile record');
    requireValue(Object.keys(value).sort().join() === expected.split(' ').sort().join(), 'Unsupported profile fields');
}
// Domain-separated deterministic draws from one seed supplied by the saved native RNG.
// No menu rerolls and no Math.random; pending seed and exchange index survive restore.
function draw(seed, domain, index = 0) {
    let x = (seed ^ domain ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0;
    x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b); x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
}
export function statsForLevel(level) {
    requireValue(integer(level, 1, 3), 'Unsupported training level');
    return Object.fromEntries(Object.entries(PROFILE.stats).map(([key, [lo, hi]]) =>
        [key, Math.round((lo + (hi - lo) * (level - 1) / 2) * 100) / 100]));
}
export function readProfileState(raw) {
    if (raw === undefined) return {schema: 1, nextAttempt: 1, completed: 0, pending: null};
    keys(raw, 'schema nextAttempt completed pending');
    requireValue(raw.schema === 1 && integer(raw.nextAttempt, 1) && integer(raw.completed) && raw.completed < raw.nextAttempt, 'Invalid training schema/cursor');
    if (raw.pending !== null) {
        const p = raw.pending;
        keys(p, 'profileId attempt seed level exchange offBalance settled'+(p.tower===undefined?'':' tower'));
        if(p.tower!==undefined){keys(p.tower,'floor repeat');requireValue(integer(p.tower.floor,1,12)&&integer(p.tower.repeat,0,50),'Invalid tower strength terms');}
        requireValue(p.profileId === PROFILE_ID && p.attempt === raw.nextAttempt && integer(p.seed, 0, 4294967295), 'Invalid encounter identity');
        requireValue(p.level === 1 + Math.floor(draw(p.seed, 0x11) * 3) && integer(p.exchange) && integer(p.offBalance, 0, 1) && typeof p.settled === 'boolean' && (!p.settled || p.offBalance === 0), 'Invalid pending encounter');
    }
    return clone(raw);
}
function contextReady(context) {
    requireValue(context?.worldId === WORLD_ID && context?.locationId === AREA_ID && context?.nativeEligible === true, 'Native world/location/body admission required');
}
export function beginAttempt(raw, {seed,tower, ...context}) {
    contextReady(context);
    const state = readProfileState(raw);
    requireValue(state.pending === null, 'Finish or leave the pending attempt first');
    requireValue(integer(seed, 0, 4294967295), 'Native saved RNG seed required');
    state.pending = {profileId: PROFILE_ID, attempt: state.nextAttempt, seed,
        level: 1 + Math.floor(draw(seed, 0x11) * 3), exchange: 0, offBalance: 0, settled: false,...(tower?{tower:clone(tower)}:{})};
    readProfileState(state);
    return state;
}
function pendingState(raw) {
    const state = readProfileState(raw);
    requireValue(state.pending && !state.pending.settled, 'Live pending encounter required');
    return state;
}
export function enemySpecification(raw) {
    const {pending: p} = pendingState(raw);
    const stats=statsForLevel(p.level);if(p.tower){const scale=1+0.15*(p.tower.floor-1)+0.1*p.tower.repeat;for(const key of ['health','attack','defense'])stats[key]=Math.round(stats[key]*scale*100)/100;}
    return {id: ENEMY_ID, name: ENEMY_ID, description: PROFILE.description,
        rank: p.level, xp_value: p.level * 2, size: 'medium', add_to_bestiary: true,
        tags: ['inanimate'], stats, loot_list: []};
}
// Preview reads the SAME saved draw as resolution and never advances the cursor.
export function previewExchange(raw, context) {
    contextReady(context);
    const {pending: p} = pendingState(raw);
    return {move: draw(p.seed, 0x22, p.exchange) < PROFILE.moveChance ? PROFILE.move : null,
        counterHint: 'Defensive Measures counters Reed sweep.'};
}
// One call immediately BEFORE one real construct exchange; use the native loop's
// exchange/cooldown owner. The status applies only to this encounter's player target.
export function planExchange(raw, {stanceId, ...context}) {
    contextReady(context);
    requireValue(typeof stanceId === 'string', 'Native current stance required');
    const state = pendingState(raw), p = state.pending;
    requireValue(p.exchange < Number.MAX_SAFE_INTEGER, 'Exchange cursor exhausted');
    const usesMove = draw(p.seed, 0x22, p.exchange) < PROFILE.moveChance;
    const countered = usesMove && stanceId === PROFILE.counter;
    p.exchange++;
    p.offBalance = usesMove && !countered ? 1 : 0;
    return {state, move: usesMove ? PROFILE.move : null, countered,
        status: p.offBalance ? {id: PROFILE.status, remainingExchanges: 1, attackPointsMultiplier: 0.8} : null,
        message: usesMove ? (countered ? 'Defensive Measures steadies your footing against Reed sweep.' : 'Reed sweep leaves you off balance for one exchange. Defensive Measures counters it.') : null};
}
export function planSettlement(raw, {eventId, rank, dropChanceModifier = 1, defeated, ...context}) {
    contextReady(context);
    const state = readProfileState(raw), p = state.pending;
    requireValue(p && eventId === `p23.reed-circle:${p.attempt}:kill` && defeated === true && rank === p.level, 'Real matching settled kill required');
    requireValue(Number.isFinite(dropChanceModifier) && dropChanceModifier >= 0, 'Invalid native luck/drop modifier');
    if (p.settled) return {duplicate: true, eventId, loot: [], state};
    const chance = Math.min(1, PROFILE.drop.chance * (1 + (rank - 1) * 0.25) * dropChanceModifier/(1+(p.tower?.repeat||0)));
    const loot = draw(p.seed, 0x33) < chance ? [{item_id: PROFILE.drop.item_id, count: 1}] : [];
    p.settled = true; p.offBalance = 0;
    return {duplicate: false, eventId, chance, loot, state};
}
// Host installs settlement.state ONLY in the same native transaction as loot/XP/
// kill progress and receipt. Planning does not insert inventory or publish receipts.
export function finishAttempt(raw, {abandon = false, ...context}) {
    contextReady(context);
    const state = readProfileState(raw);
    requireValue(state.pending && (state.pending.settled || abandon), 'Unsettled attempt cannot complete');
    requireValue(state.nextAttempt < Number.MAX_SAFE_INTEGER, 'Attempt cursor exhausted');
    if (state.pending.settled) state.completed++;
    state.nextAttempt++; state.pending = null;
    return state;
}
// P00 injects the native constructors/registries; imports alone register nothing.
export function createTrainingEnemy(raw, Enemy) {return new Enemy(enemySpecification(raw));}
export function createTrainingZone({CombatZone, parentLocation}) {
    requireValue(parentLocation?.id === 'Proto23 Dojo lobby', 'Native dojo parent required');
    return new CombatZone({id: AREA_ID, name: AREA_ID, parent_location: parentLocation,
        description: 'Repeatable reed-circle rung, levels 1–3. Reed sweep is countered by Defensive Measures. Local willow offcuts may settle with a victory.',
        is_unlocked: true, enemies_list: [ENEMY_ID], enemy_count: 1, enemy_group_size: [1, 1],
        enemy_stat_variation: 0, is_challenge: false, first_reward: {}, repeatable_reward: {},
        leave_text: 'Return to the dojo lobby'});
}
