// P3c keeping quiet (LSD417-LSD422). The verdict is pure and replayable: same inputs, same outcome,
// and the factors are returned so the inspector can say why. A holder never needs a roll the player cannot explain.
import {checkKey} from './check_keys.js';
import {drawFraction, address} from './gen_kit.js';

export const SILENCE_TABLE = Object.freeze({id: 'memory.silence', revision: 1,
    base: 50, floor: 3, ceiling: 97, periodDays: 30,
    bond: 5, promise: 15, bribe: 12, discreet: 20, severity: 4, listener: 4, loyalty: 3,
});
export const SILENCE_REASONS = Object.freeze({
    base: 'With no other pull, keeping quiet is a coin toss.', floor: 'Even the surest listener might hear.', ceiling: 'No promise is certain.',
    periodDays: 'The choice holds for this many days, then is weighed again.', bond: 'Per point of bond to the asker.',
    promise: 'A promise binds a person who made one.', bribe: 'Per point of payment received for silence.', discreet: 'Scaled by how seldom the holder tells (reserved) or how often (sociable).',
    severity: 'Per rung of the secret: heavier secrets are harder to hold.', listener: 'Per point of bond to the one who would hear it.', loyalty: 'Per point of earned loyalty to the asker.',
});
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
// inputs: bondAsker, bondListener, bribe (sum of felt payment), loyalty, rung (0-4), telling (temperament multiplier), promised.
export function silenceVerdict({holder, secret, listener, day, root, promised, bondAsker = 0, bondListener = 0, bribe = 0, loyalty = 0, rung = 0, telling = 1, table = SILENCE_TABLE}) {
    const factors = [
        {id: 'bond', value: bondAsker * table.bond}, {id: 'promise', value: promised ? table.promise : 0}, {id: 'bribe', value: bribe * table.bribe},
        {id: 'loyalty', value: loyalty * table.loyalty}, {id: 'discreet', value: (1 - telling) * table.discreet},
        {id: 'severity', value: -rung * table.severity}, {id: 'listener', value: -bondListener * table.listener}].map(f => ({...f, value: Math.round(f.value * 10) / 10}));
    const score = table.base + factors.reduce((t, f) => t + f.value, 0), chance = clamp(Math.round(score), table.floor, table.ceiling);
    const key = checkKey({subject: holder, method: 'memory.silence@1', period: {block: Math.floor(day / table.periodDays)}, targetState: {secret, listener}});
    return {keeps: drawFraction(root, address(key, 'silence')) * 100 < chance, chance, factors, key};
}
const WORDS = {bond: ['likes you', 'is wary of you'], promise: ['gave you his word', ''], bribe: ['was paid to keep quiet', ''], loyalty: ['owes you loyalty', ''],
    discreet: ['rarely repeats things', 'likes to talk'], severity: ['', 'it weighs heavily'], listener: ['', 'is close to the one who would hear it']};
// One line for the player: the biggest pulls each way, never the die.
export function silenceExplanation(v) {
    const pull = f => f.value > 0 ? WORDS[f.id][0] : f.value < 0 ? WORDS[f.id][1] || '' : '';
    const by = [...v.factors].filter(f => f.value !== 0 && pull(f)).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 3);
    const keep = by.filter(f => f.value > 0).map(pull), leak = by.filter(f => f.value < 0).map(pull);
    return `About ${v.chance}% likely to keep it quiet${keep.length ? ': ' + keep.join(', ') : ''}${leak.length ? (keep.length ? '; against: ' : ': ') + leak.join(', ') : ''}.`;
}
// Claims (LSD422): a lie lives as a claim beside the fact, never in place of it.
export const claimDiffers = (claim, truth) => claim.says !== truth;
export function claimsAbout(claims, fact) { return claims.filter(c => c.fact === fact); }
// Two accounts of one fact disagree if their `says` differ; the trace is the fact owner's record.
export function compareClaims(claims, fact, truthId) {
    const about = claimsAbout(claims, fact);
    return {claims: about, conflict: new Set(about.map(c => c.says)).size > 1 || about.some(c => claimDiffers(c, truthId)), lies: about.filter(c => claimDiffers(c, truthId))};
}
