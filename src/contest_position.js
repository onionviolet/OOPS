// Optional local positioning for contests that need range or a light angle.
// Positions are on the encounter's axis. Facing follows the current opponent.
import {HARM_RUNGS, HARM_WORLDS, injurePart} from './harm_state.js';

export function inReach(actor, target, move) {
    if (actor.position === undefined || target.position === undefined) return true;
    const distance = Math.abs(actor.position - target.position);
    return distance >= (move.minReach ?? 0) && distance <= (move.reach ?? Infinity);
}

export function facesLight(actor, target, threshold) {
    return actor.position !== undefined && target.position !== undefined &&
        actor.sunlight >= threshold && Math.sign(target.position - actor.position) === actor.sunDirection;
}

export function hasMeans(actor, move) {
    if (move.tool && !actor.held?.[move.tool]) return false;
    if (move.freeHand && actor.held?.[move.freeHand]) return false;
    const rung = actor.harm?.parts?.[move.partRequired]?.rung;
    return HARM_RUNGS.indexOf(rung) < HARM_RUNGS.indexOf('maimed');
}

export function contactEffects(target, move, effects, location) {
    const part = move.type === 'slashing' && target.profile.exposedPart;
    if (!part) return location === 'head' ? effects.map(effect => effect.object === 'vitality'
        ? {...effect, amount: Math.ceil(effect.amount * move.headOpening)} : effect) : effects;
    return effects.flatMap(effect => effect.object === 'vitality' && effect.verb === 'remove'
        ? [{...effect, amount: Math.ceil(effect.amount / 4)}, {...effect, part}]
        : [effect]);
}

export function woundPart(entrant, part, amount, cause) {
    const rung = amount >= 12 ? 'maimed' : 'wounded';
    entrant.harm = injurePart(entrant.harm, HARM_WORLDS.default, part, {rung, cause}).state;
}

export function canUseAtPosition(me, target, move) {
    if (move.kind === 'drop') return !!me.held?.[move.tool] &&
        (me.quantities[move.ammunition] === 0 || !inReach(me, target, move));
    if (move.kind === 'cross') return me.position !== undefined && target.position !== undefined &&
        me.position !== target.position && inReach(me, target, move);
    if (move.kind === 'advance') return me.position !== undefined && target.position !== undefined &&
        Math.abs(me.position - target.position) > move.advance;
    return inReach(me, target, move);
}

export function shiftPosition(actor, target, move) {
    if (actor.position === undefined || target.position === undefined) return;
    const gap = target.position - actor.position;
    if (move.kind === 'cross') actor.position = target.position + Math.sign(gap);
    else if (move.advance) actor.position += Math.sign(gap) * Math.min(Math.abs(gap), move.advance);
}
