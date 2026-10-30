// P3c severity: a rung over an episode, relative to its holder, intent and context (LSD412-LSD416).
// Derived on read and never saved. Tables are world data with id@rev (GR10); a world swaps them without code.
import {isHarm, payload} from './person_episode.js';
import {vividness} from './person_memory.js';
import {DEFAULT_TEMPERAMENT} from './person_temperament.js';

export const SEVERITY_TABLE = Object.freeze({id: 'memory.severity', revision: 1,
    // Upper bound (exclusive) of the scaled magnitude for each rung. The last rung is open.
    rungs: Object.freeze([
        Object.freeze({id: 'trivial', below: 0.5, band: 0, fadeX: 0.5, reach: 'household', goal: false}),
        Object.freeze({id: 'minor', below: 1.5, band: 1, fadeX: 1, reach: 'household', goal: false}),
        Object.freeze({id: 'serious', below: 4, band: 2, fadeX: 2, reach: 'street', goal: false}),
        Object.freeze({id: 'grave', below: 8, band: 3, fadeX: 4, reach: 'town', goal: true}),
        Object.freeze({id: 'life_changing', below: Infinity, band: 4, fadeX: 8, reach: 'town', goal: true})]),
    intent: Object.freeze({deliberate: 1.5, unknown: 1, accident: 0.5}),
    provokedX: 0.5, publicX: 1.5, friendBondDiv: 10, lastStraw: 3, strawRung: 'serious',
});
export const SEVERITY_REASONS = Object.freeze({
    rungs: 'Five rungs set how long a hurt lasts, how far it travels and whether it can become a goal.',
    intent: 'A deliberate wrong cuts deeper than an accident.', provokedX: 'Provocation softens blame.', publicX: 'A public wrong is felt more.',
    friendBondDiv: 'A friend\'s harm counts as betrayal, scaled by the bond.', lastStraw: 'Many minor slights add up to a serious one.',
});
export const rungIndex = (id, table = SEVERITY_TABLE) => table.rungs.findIndex(r => r.id === id);
// scaled magnitude: feeling x share of the holder's means x sensitivity x intent x context. Ten coins is grave to a labourer.
export function scaledSeverity(e, {wealth = 1, sensitivity = 1, intent = 'unknown', provoked = false, publicly = false, friendBond = 0} = {}, table = SEVERITY_TABLE) {
    const base = Math.abs(e.feeling) / Math.max(1, wealth);
    const betrayal = friendBond > 0 ? 1 + friendBond / table.friendBondDiv : 1;
    return base * sensitivity * (table.intent[intent] ?? 1) * (provoked ? table.provokedX : 1) * (publicly ? table.publicX : 1) * betrayal;
}
export const rungFor = (scaled, table = SEVERITY_TABLE) => table.rungs.find(r => scaled < r.below);
export const severityOf = (e, relative, table = SEVERITY_TABLE) => rungFor(scaledSeverity(e, relative, table), table);
// The last straw: current weights of a holder's minor slights about one subject, summed. Time pulls the sum back under.
export function lastStraw({rows, subject, day, temperament = DEFAULT_TEMPERAMENT, relative, table = SEVERITY_TABLE}) {
    const minor = rows.filter(e => e.about === subject && isHarm(e) && payload(e) && rungFor(scaledSeverity(e, relative, table), table).id === 'minor');
    const sum = minor.reduce((t, e) => t + Math.abs(e.feeling) * vividness(e, day, temperament), 0);
    return {sum, crossed: sum >= table.lastStraw, count: minor.length, rung: sum >= table.lastStraw ? table.strawRung : null};
}
// The standing rung of a held harm: the larger of its own rung and the last-straw rung when it is part of the sum.
export function standingRung(e, ctx) {
    const own = severityOf(e, ctx.relative, ctx.table), straw = lastStraw({...ctx, subject: e.about});
    return straw.crossed && rungIndex(straw.rung, ctx.table) > rungIndex(own.id, ctx.table) ? ctx.table.rungs[rungIndex(straw.rung, ctx.table)] : own;
}
