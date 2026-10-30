// World-neutral crowd record (LSD366-LSD369). A crowd is one derived record, never saved: who is around at an
// hour, one keyed draw per step that splits it into actions, and lazy promotion of a slot to a person.
// Same place, minute, slot and root give the same person on replay (LSD139). Nothing here ticks or writes.
import {address, drawFraction, drawU32, compareCodePoints} from './gen_kit.js';

// Default, dial, reason (world data with id@rev; a world swaps tables without code).
export const CROWD_TABLE = Object.freeze({id: 'crowd.table', revision: 1,
    actions: Object.freeze(['flee', 'freeze', 'watch', 'help', 'fetch']),
    // Per role: share of each action at severity 0. Rows sum to 1. Authority fetches or helps; children flee; vendors watch.
    roles: Object.freeze({
        worker: Object.freeze({flee: 0.15, freeze: 0.15, watch: 0.5, help: 0.15, fetch: 0.05}),
        vendor: Object.freeze({flee: 0.1, freeze: 0.2, watch: 0.55, help: 0.05, fetch: 0.1}),
        child: Object.freeze({flee: 0.4, freeze: 0.2, watch: 0.4, help: 0, fetch: 0}),
        elder: Object.freeze({flee: 0.05, freeze: 0.25, watch: 0.5, help: 0.1, fetch: 0.1}),
        authority: Object.freeze({flee: 0, freeze: 0, watch: 0.2, help: 0.5, fetch: 0.3})}),
    // Each severity rung moves this much share from watching into fleeing and freezing (a worse sight scares people).
    scare: 0.08,
    // Presence by time band: base head-count per role for a place of scale 1. Scale comes from the host's population owner.
    presence: Object.freeze({night: {worker: 0, vendor: 0, child: 0, elder: 1, authority: 1}, dawn: {worker: 2, vendor: 1, child: 0, elder: 1, authority: 0},
        morning: {worker: 5, vendor: 3, child: 2, elder: 1, authority: 1}, noon: {worker: 4, vendor: 4, child: 3, elder: 2, authority: 1},
        afternoon: {worker: 5, vendor: 3, child: 3, elder: 1, authority: 1}, evening: {worker: 3, vendor: 1, child: 1, elder: 2, authority: 1}}),
    variance: 0.3, scarePromote: 1,
});
export const CROWD_REASONS = Object.freeze({
    roles: 'Children run, vendors watch their stalls, authorities help or fetch.', scare: 'Worse events scare more of the crowd.',
    presence: 'Who is around follows the hour; a place scales it.', variance: 'Head-counts move up to this share by day.',
});
export const BANDS = Object.freeze([['night', 0, 360], ['dawn', 360, 480], ['morning', 480, 720], ['noon', 720, 840], ['afternoon', 840, 1080], ['evening', 1080, 1440]]);
export const bandOf = minute => BANDS.find(([, from, to]) => (minute % 1440) >= from && (minute % 1440) < to)[0];
const ROLE_ORDER = table => Object.keys(table.roles).sort(compareCodePoints);

// One record per place and hour block. `scale` and `exclude` (named cast already present as people) come from the host.
export function generateCrowd({place, minute, root, scale = 1, exclude = {}, table = CROWD_TABLE}) {
    const band = bandOf(minute), day = Math.floor(minute / 1440), roles = {};
    for (const role of ROLE_ORDER(table)) {
        const base = (table.presence[band]?.[role] ?? 0) * scale, swing = (drawFraction(root, address('crowd.size', {place, day, band, role})) * 2 - 1) * table.variance;
        roles[role] = Math.max(0, Math.round(base * (1 + swing)) - (exclude[role] || 0));
    }
    const size = Object.values(roles).reduce((a, b) => a + b, 0);
    return {id: address('crowd', {place, day, band}), place, day, band, size, roles};
}
// Shares for a role at a severity rung (0-4): the scare moves watching into fleeing and freezing.
export function shares(role, severity, table = CROWD_TABLE) {
    const base = {...table.roles[role]}, moved = Math.min(base.watch, severity * table.scare);
    base.watch -= moved; base.flee += moved * 0.5; base.freeze += moved * 0.5;
    return base;
}
// ONE keyed draw per step splits every role (systematic rounding): counts sum back to the role's size.
export function stepCrowd({crowd, severity = 0, step = 0, root, table = CROWD_TABLE}) {
    const u = drawFraction(root, address('crowd.step', {crowd: crowd.id, step})), out = {};
    for (const role of ROLE_ORDER(table)) {
        const n = crowd.roles[role] || 0, s = shares(role, severity, table), counts = {}; let cum = 0, last = 0;
        for (const action of table.actions) { cum += s[action]; const upto = action === table.actions.at(-1) ? n : Math.floor(n * cum + u); counts[action] = Math.max(0, upto - last); last = Math.max(last, upto); }
        out[role] = counts;
    }
    const totals = Object.fromEntries(table.actions.map(a => [a, Object.values(out).reduce((t, c) => t + c[a], 0)]));
    return {step, severity, byRole: out, totals};
}
// Every head has a stable slot: roles in code-point order, then index. A slot's action follows the step counts.
export function slotsOf(crowd, table = CROWD_TABLE) {
    const slots = []; for (const role of ROLE_ORDER(table)) for (let i = 0; i < (crowd.roles[role] || 0); i++) slots.push({role, index: i});
    return slots.map((s, slot) => ({...s, slot}));
}
// A person's name seed depends only on who they are (place, day, band, role, index), never on the crowd's other heads.
export const nameSeed = (root, id) => drawU32(root, address('crowd.name', {id}));
export const parsePerson = id => { const m = /^crowd\.(.+)\.(\d+)\.([a-z]+)\.([a-z_]+)\.(\d+)$/.exec(id); return m ? {place: m[1], day: +m[2], band: m[3], role: m[4], index: +m[5]} : null; };
// Lazy promotion (LSD367). The person is a pure function of crowd, slot and reason, so replay gives the same one.
export function promote({crowd, slot, reason, root, step = null, table = CROWD_TABLE}) {
    const s = slotsOf(crowd, table)[slot]; if (!s) throw RangeError('No such crowd slot.');
    const id = `crowd.${crowd.place}.${crowd.day}.${crowd.band}.${s.role}.${s.index}`;
    let action = null;
    if (step) { let left = s.index; for (const a of table.actions) { const c = step.byRole[s.role][a]; if (left < c) { action = a; break; } left -= c; } }
    return {id, role: s.role, slot, reason, action, place: crowd.place, seed: nameSeed(root, id)};
}
// Pick whom a sight matters to: a keyed slot among those watching or helping (they were looking), else any head.
export function chooseWitness({crowd, step, reason, root, table = CROWD_TABLE}) {
    const slots = slotsOf(crowd, table); if (!slots.length) return null;
    const looking = slots.filter(s => { const p = promote({crowd, slot: s.slot, reason, root, step, table}); return p.action === 'watch' || p.action === 'help'; });
    const pool = looking.length ? looking : slots;
    const pick = pool[Math.floor(drawFraction(root, address('crowd.witness', {crowd: crowd.id, reason})) * pool.length)];
    return promote({crowd, slot: pick.slot, reason, root, step, table});
}
// Witnesses come forward to an investigator by keyed draw, bent by their goals (LSD369, LSD347). goals: {civic, protect, fear} 0-1.
export const TESTIMONY_TABLE = Object.freeze({id: 'crowd.testimony', revision: 1, base: 45, civic: 40, protect: -50, fear: -35, certaintyFloor: 20});
export function comesForward({witness, investigator, day, root, goals = {}, certainty = 70, table = TESTIMONY_TABLE}) {
    const chance = Math.max(3, Math.min(97, Math.round(table.base + (goals.civic || 0) * table.civic + (goals.protect || 0) * table.protect + (goals.fear || 0) * table.fear)));
    const roll = drawFraction(root, address('crowd.testimony', {witness, investigator, period: {day}})) * 100;
    return {comes: roll < chance && certainty >= table.certaintyFloor, chance, certainty};
}
// How many of an unpromoted watching crowd would speak: one draw, systematic rounding.
export function crowdTestimony({watching, investigator, crowdId, root, goals = {}, table = TESTIMONY_TABLE}) {
    const chance = Math.max(3, Math.min(97, Math.round(table.base + (goals.civic || 0) * table.civic + (goals.protect || 0) * table.protect + (goals.fear || 0) * table.fear))) / 100;
    return Math.floor(watching * chance + drawFraction(root, address('crowd.speak', {crowd: crowdId, investigator})));
}
