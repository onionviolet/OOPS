// Stakes and kit for tempo fights (Weibao, 2026-11-14: "refining combat system to account for new possiblity while still being familar?
// and transfering across all the worlds"). Proposals under AD32 and AD56; palette rows in docs/PROCEDURAL_CARRY_OUT.md round 2 (FK1-FK13,
// SF1-SF6, WS1-WS3, GP4) and CFC9 in docs/CONTEST_CONTRACT.md. Leaf module: no world imports, no DOM, no save slice of its own.
//
// Stakes: a fight carries the five dials of round 2 as data, and a named kind is a preset row (CX3: a new kind costs a row). The world
// supplies its usual frame; the opener picks a preset and may override any dial with an in-world reason.
// Kit: a fighter can carry move rows of its own beside the shared moves. One row shape covers a spell, a Gu activation, a killer move
// filled from several Gu, and a blow that gear changes. A row says how it works (AD38): what it spends, what it needs in hand, what a
// landed cast takes from the target, how long it holds them, whether it can kill. Nothing reads its label.
import {check} from './basics.js';

// Each preset: what the fight is for and how it ends by default. Every field is a dial an opener may override.
//  lethal: a downing blow can kill (CFC9: any blow, a fist included, unless the striker holds back or the move cannot kill).
//  disarm: the means whose loss ends a fighter's part in the fight (a wand in a duel); null = losing it only blocks the moves that need it.
//  stopAt: fight seconds after which someone in the frame steps in and ends it (WS1: a teacher arrives); 0 = nobody comes.
export const TEMPO_PRESETS = Object.freeze({
    drill: {label: 'Drill', lethal: false, disarm: null, stopAt: 20, text: 'A practice bout. Someone calls it off soon.', stakes: 'pride'},
    duel: {label: 'Duel', lethal: false, disarm: 'wand', stopAt: 0, text: 'A duel: it ends when someone loses their wand, is bound, gives way or goes down.', stakes: 'standing'},
    brawl: {label: 'Brawl', lethal: false, disarm: null, stopAt: 0, text: 'An unruled scrap. It usually stops short of killing, but a hard enough blow can still kill.', stakes: 'pride'},
    hunt: {label: 'Hunt', lethal: true, disarm: null, stopAt: 0, text: 'A hunt: the quarry fights for its life.', stakes: 'a life'},
    mugging: {label: 'Robbery', lethal: false, disarm: null, stopAt: 0, text: 'A robbery: he wants your purse, not your life, but a blow is a blow.', stakes: 'property'},
    skirmish: {label: 'Skirmish', lethal: true, disarm: null, stopAt: 0, text: 'A skirmish: the other side means it.', stakes: 'a life'},
});
export const TEMPO_PRESET_IDS = Object.freeze(Object.keys(TEMPO_PRESETS));
// How a fighter ended, beside its status. `killed` and `knocked_out` come from downing blows; `disarmed` and `bound` from landed casts.
export const TEMPO_ENDS = Object.freeze(['downed', 'killed', 'knocked_out', 'disarmed', 'bound', 'stopped']);

const text = (s, n = 300) => typeof s === 'string' && s.length > 0 && s.length <= n;
const count = n => Number.isFinite(n) && n >= 0 && n <= 1e6;
const counts = o => o === undefined || (!!o && typeof o === 'object' && !Array.isArray(o) && Object.entries(o).every(([k, v]) => /^[a-z][a-z0-9_]{0,31}$/.test(k) && count(v)));

/** The fight's stakes from a spec: a preset, then the opener's overrides (each a dial with its reason in `why`). */
export function tempoStakes(spec = {}) {
    if(!spec) return null;
    const preset = spec.preset ?? 'brawl';
    check(TEMPO_PRESETS[preset], `Unknown fight preset ${preset}.`);
    const p = TEMPO_PRESETS[preset];
    return {preset, label: spec.label ?? p.label, lethal: spec.lethal ?? p.lethal, disarm: spec.disarm !== undefined ? spec.disarm : p.disarm,
        stopAt: spec.stopAt ?? p.stopAt, text: spec.text ?? p.text, stakes: spec.stakes ?? p.stakes,
        ...(spec.stopText ? {stopText: spec.stopText} : {}), ...(spec.why ? {why: spec.why} : {})};
}
export function validateTempoStakes(s) {
    if(s === undefined) return true;
    return !!s && TEMPO_PRESETS[s.preset] && typeof s.lethal === 'boolean' && (s.disarm === null || /^[a-z][a-z0-9_]{0,31}$/.test(s.disarm)) &&
        Number.isSafeInteger(s.stopAt) && s.stopAt >= 0 && text(s.label, 40) && text(s.text) && text(s.stakes, 60) &&
        (s.stopText === undefined || text(s.stopText)) && (s.cue === undefined || text(s.cue)) && (s.why === undefined || text(s.why, 500));
}

// A kit row. cost: time units. power: strike power on the shared strike math (0 = no harm; the cast still has to land). force: harm
// that comes from the thing itself, not the arm behind it (a Gu blade cuts by its Gu's rank, AD38); it replaces power times the striker's attack. hit: accuracy
// multiplier. spends: means used on casting, landed or not. needs: means that must be in hand and are not used. takes: means a landed cast
// removes from the target. stun: time units a landed cast adds before the target acts. binds: a landed cast takes the target out of the
// fight unharmed. ward: a guard of this strength instead of an attack. lethal: false means a downing blow from it knocks out. roles: the
// parts that fill the row (a killer move's Gu), shown in its detail. blocked: why it cannot be used now (a hungry Gu), set by the world.
export function validateTempoKitRow(r) {
    return !!r && text(r.label, 60) && text(r.text) && Number.isSafeInteger(r.cost) && r.cost > 0 && r.cost <= 60 && count(r.power ?? 0) && (r.power ?? 0) <= 10 && (r.force === undefined || (count(r.force) && r.force <= 500)) &&
        (r.hit === undefined || (Number.isFinite(r.hit) && r.hit > 0 && r.hit <= 3)) && counts(r.spends) && counts(r.needs) && counts(r.takes) &&
        (r.stun === undefined || (Number.isSafeInteger(r.stun) && r.stun >= 0 && r.stun <= 60)) && (r.binds === undefined || typeof r.binds === 'boolean') &&
        (r.ward === undefined || (Number.isFinite(r.ward) && r.ward >= 0 && r.ward <= 20)) && (r.lethal === undefined || typeof r.lethal === 'boolean') &&
        (r.roles === undefined || (Array.isArray(r.roles) && r.roles.length <= 6 && r.roles.every(x => x && text(x.role, 40) && text(x.by, 60)))) &&
        (r.blocked === undefined || text(r.blocked)) && (r.escalates === undefined || typeof r.escalates === 'boolean') && (r.whenHurt === undefined || (Number.isFinite(r.whenHurt) && r.whenHurt > 0 && r.whenHurt <= 1)) && (r.why === undefined || text(r.why, 500)) && (r.safe === undefined || typeof r.safe === 'boolean');
}
export function validateTempoKit(f, sharedIds) {
    if(f.means !== undefined && !counts(f.means)) return false;
    if(f.meansLabels !== undefined && !(f.meansLabels && typeof f.meansLabels === 'object' && Object.values(f.meansLabels).every(v => text(v, 40)))) return false;
    if(f.holdBack !== undefined && typeof f.holdBack !== 'boolean') return false;
    if(f.end !== undefined && !TEMPO_ENDS.includes(f.end)) return false;
    if(f.pleas !== undefined && !(Number.isSafeInteger(f.pleas) && f.pleas >= 0)) return false;
    if(f.fateText !== undefined && !(f.fateText && typeof f.fateText === 'object' && Object.values(f.fateText).every(v => text(v, 300)))) return false;
    if(f.kit === undefined) return true;
    return !!f.kit && typeof f.kit === 'object' && Object.keys(f.kit).length <= 12 &&
        Object.entries(f.kit).every(([id, r]) => /^[a-z][a-z0-9_]{0,31}$/.test(id) && !sharedIds.includes(id) && validateTempoKitRow(r));
}

const meansName = (f, q) => f.meansLabels?.[q] ?? q.replace(/_/g, ' ');
/** Why a kit row cannot be used now, or ''. Reads only the fighter's own means. */
export function kitWhy(f, row) {
    if(row.blocked) return row.blocked;
    for(const [q, n] of Object.entries(row.needs || {})) if((f.means?.[q] ?? 0) < n) return q === 'wand' ? 'You have no wand in hand.' : `You need ${meansName(f, q)} in hand.`;
    for(const [q, n] of Object.entries(row.spends || {})) if((f.means?.[q] ?? 0) < n) return `Needs ${n} ${meansName(f, q)}; ${f.means?.[q] ?? 0} left.`;
    return '';
}
/** What a row costs and takes, in player words: "4 essence", "takes the wand". */
export function kitCostText(f, row) {
    return Object.entries(row.spends || {}).map(([q, n]) => `${n} ${meansName(f, q)}`).join(', ');
}
/** The detail one step away (hover): how it works, what fills it, what it can do. */
export function kitDetail(f, row, stakes) {
    const parts = [row.why];
    if(row.roles?.length) parts.push(`Filled by: ${row.roles.map(r => `${r.role}, ${r.by}`).join('; ')}.`);
    const effects = [];
    if(row.power || row.force) effects.push(row.lethal === false || !stakes?.lethal ? 'harms but does not kill' : 'can kill');
    for(const q of Object.keys(row.takes || {})) effects.push(`takes the ${meansName(f, q)}`);
    if(row.stun) effects.push(`holds them about ${row.stun} time`);
    if(row.binds) effects.push('binds them out of the fight');
    if(row.ward) effects.push('braces you strongly against the next blow');
    if(effects.length) parts.push(`On a hit it ${effects.join(', ')}.`);
    return parts.filter(Boolean).join(' ');
}
