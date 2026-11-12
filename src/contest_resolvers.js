// Contest resolvers (chat C, CFC2): how one meeting of two workings is decided.
// A world pack picks a resolver per move; each resolver is a pure function of
// the two entrants as read at the meeting's time, the move row and keyed draws.
// They reuse the existing math owners rather than restating it: upstream hit
// chance and damage spread (combat_math.js), the notch logistic
// (notch_contest.js) and Gu layered defense (gu_defense.js).
// Pure: no state, no clock, no save slice, no world imports.
import {get_hit_chance, rollBaseCombatDamage} from './combat_math.js';
import {winChance, NOTCH_DIALS} from './notch_contest.js';
import {resolveGuDefense} from './gu_defense.js';

// A resolver answers {outcome: 'hit'|'miss'|'blocked', landed: [{object, amount}], chance}.
// `draw(name)` returns a keyed fraction in [0, 1) for this meeting.
const landedFrom = (move, scale) => (move.effects ?? [{verb: 'remove', object: 'vitality'}])
    .map(e => ({verb: e.verb ?? 'remove', object: e.object, amount: Math.max(0, Math.round((e.amount ?? move.power ?? 0) * scale))}))
    .filter(e => e.amount > 0);

// EF3: a target whose running working blocks the incoming object adds its guard.
export const guardAgainst = (target, move) => (move.effects ?? [{object: 'vitality'}])
    .reduce((best, e) => Math.max(best, target.guard?.[e.object] ?? 0), 0);

export const CONTEST_RESOLVERS = Object.freeze({
    // Upstream feel: attack points against evasion, the native damage spread, flat armor.
    strike({actor, target, move, draw}) {
        const impair = actor.impair * (move.aim ?? 1);
        const chance = get_hit_chance((actor.profile.attack ?? 10) * impair,
            Math.max(1, (target.profile.evasion ?? 10) * target.impair));
        if (draw('hit') >= chance) return {outcome: 'miss', landed: [], chance};
        const guard = guardAgainst(target, move);
        const [rolled] = rollBaseCombatDamage(move.power ?? 1, 1, 1, () => draw('spread'));
        const armor = (target.profile.armor ?? 0) + guard;
        if (rolled <= armor && guard > 0) return {outcome: 'blocked', landed: [], chance};
        const scale = Math.max(1, rolled - armor) / Math.max(1, move.power ?? 1);
        return {outcome: 'hit', landed: landedFrom(move, scale), chance};
    },
    // Notch scale (FD2): skill notch plus the move's own against resistance and guard.
    notch({actor, target, move, draw, dials}) {
        // Impairment counts in notches: an impaired caster loses some, an impaired target gives some away.
        const notches = impair => Math.log(impair) / Math.log((dials?.notch ?? NOTCH_DIALS).gain);
        const delta = (actor.profile.notch ?? 0) + (move.notch ?? 0) + notches(actor.impair)
            - (target.profile.resist ?? 0) - guardAgainst(target, move) - notches(target.impair);
        const chance = winChance(delta, dials?.notch ?? NOTCH_DIALS);
        if (draw('notch') >= chance) return {outcome: guardAgainst(target, move) > 0 ? 'blocked' : 'miss', landed: [], chance};
        return {outcome: 'hit', landed: landedFrom(move, 1), chance};
    },
    // Gu: a packet passes the target's defense layers outside to inside; the remainder lands.
    // Aim still decides whether the packet reaches the target at all.
    layers({actor, target, move, draw}) {
        const chance = get_hit_chance((actor.profile.attack ?? 10) * actor.impair * (move.aim ?? 1),
            Math.max(1, (target.profile.evasion ?? 10) * target.impair));
        if (draw('hit') >= chance) return {outcome: 'miss', landed: [], chance};
        const packets = (move.effects ?? [{object: 'vitality'}]).map(e => ({type: move.type ?? 'physical', phase: move.phase,
            amount: e.amount ?? move.power ?? 0, object: e.object, verb: e.verb ?? 'remove'}));
        const {remainder} = resolveGuDefense(packets, target.profile.layers ?? []);
        const landed = remainder.map(p => ({verb: p.verb, object: p.object, amount: Math.round(p.amount)})).filter(p => p.amount > 0);
        return {outcome: landed.length ? 'hit' : 'blocked', landed, chance};
    },
});
