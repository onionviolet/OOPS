// Harry's duel spells as practised spells (OR1 consumer: the corridor duel in tempo_lead_fights.js). Pure leaf: no state writes.
// One practice record per spell, keyed by the Hogwarts spell pack's row id (spell_pack_hogwarts.js), the same 'practice' power model
// the levitation charm uses (book_world_hp_lessons.js). The power id is `book.hp.lead.spell.<row id with _>`; the levitation row maps to
// the charm's existing saved id, so the model generalizes rather than adding a second kind of record. Practice on one spell does not carry
// to another (no levitation-to-jinx carry-over); each spell's hand is its own.
// The base hit stays the combat lane's dial (the kit row's `hit`); this module only scales it by that spell's own practice.
import {HP_SPELL_ROWS} from './spell_pack_hogwarts.js';
import {get_hit_chance} from './combat_math.js';

// Dials with reasons (proposals, AD56: they widen play and can be retuned per world).
export const HP_DUEL_PRACTICE = Object.freeze({
    perStep: {value: .05, why: 'Each practice cast steadies the wand a little: about a twentieth more accuracy, the jinx flying truer, not hitting harder.'},
    steps: {value: 10, why: 'After about ten practice casts the motion is learned; past that the target dodging decides more than the caster\'s hand.'},
    cap: {value: 3, why: 'The tempo kit validator\'s ceiling on a row\'s hit (tempo_kit.js validateTempoKitRow).'},
});
const ROWS = new Map(HP_SPELL_ROWS.map(r => [r.id, r]));
const clean = n => Number.isFinite(Number(n)) ? Math.max(0, Number(n)) : 0;

// The charm Harry learns in his first Charms lesson keeps its saved id (book_hp_lead_life_data.js HP_LEVITATION; pinned by the test).
const SAVED = Object.freeze({levitation: 'book.hp.lead.levitation'});
/** The practice power id for a Hogwarts spell row ('leg-lock' -> 'book.hp.lead.spell.leg_lock'); throws on an unknown row. */
export function hpSpellPower(rowId) {
    if(!ROWS.has(rowId)) throw Error(`Unknown Hogwarts spell row: ${rowId}`);
    return SAVED[rowId] ?? `book.hp.lead.spell.${rowId.replace(/-/g, '_')}`;
}
/** The player's practice steps on that spell (0 when never learned or practised). */
export const spellMastery = (state, rowId) => clean(state?.simulation?.powers?.player?.[hpSpellPower(rowId)]?.mastery);

/** The kit row's hit after practice: exactly baseHit at no practice, at most HP_DUEL_PRACTICE.cap. */
export function duelHit(baseHit, mastery = 0) {
    const base = Number(baseHit);
    if(!(Number.isFinite(base) && base > 0)) throw Error('A duel hit needs a positive base.');
    const steps = Math.min(clean(mastery), HP_DUEL_PRACTICE.steps.value);
    if(steps === 0) return base;
    return Math.min(HP_DUEL_PRACTICE.cap.value, Math.round(base * (1 + HP_DUEL_PRACTICE.perStep.value * steps) * 1000) / 1000);
}
/** Chance a cast with this hit lands, on the shared strike math (combat_math rollCombatStrike, no shield, no injury). Profiles are
 *  tempo fighter profiles ({stats}, readNativeFighter shape) or bare stats; null when the attacker has no attack points. */
export function duelLandChance(hit, attacker, target) {
    const a = attacker?.stats ?? attacker, t = target?.stats ?? target;
    const points = clean(a?.attack_points) * hit, evasion = clean(t?.agility) * Math.sqrt(t?.intuition ?? 1);
    if(!(points > 0)) return null; // no attacker stats: no number to show rather than a false zero
    return Math.max(0, Math.min(1, get_hit_chance(points, evasion)));
}
const times = n => n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`;
/** The hover line (OR2, one step away): practice count, then the landing odds when a target is known. */
export function duelHitWhy(rowId, mastery, chance = null) {
    const n = Math.floor(clean(mastery)), name = ROWS.get(rowId)?.forms?.[0] ?? rowId;
    const head = n ? `${name} practised ${times(n)}` : `${name} never practised`;
    const tail = chance == null ? (n ? `: about ${Math.round(HP_DUEL_PRACTICE.perStep.value * Math.min(n, HP_DUEL_PRACTICE.steps.value) * 100)}% truer than untried.` : ': it flies as an untried jinx does.')
        : `: lands about ${Math.round(chance * 10)} in 10.`;
    return head + tail;
}
/** The readiness numbers for a spell (practice steps, scaled hit, landing chance or null without a target). */
export function duelReadiness(state, rowId, baseHit, attacker = null, target = null) {
    const mastery = spellMastery(state, rowId), hit = duelHit(baseHit, mastery);
    return {mastery, hit, chance: attacker && target ? duelLandChance(hit, attacker, target) : null};
}
/** The kit row with its hit set by practice and the hover line appended (only `hit` and `why` change, so the row still validates).
 *  The one call the combat lane makes per spell row. */
export function practisedKitRow(row, state, rowId, attacker = null, target = null) {
    const {mastery, hit, chance} = duelReadiness(state, rowId, row.hit ?? 1, attacker, target);
    const why = [row.why, duelHitWhy(rowId, mastery, chance)].filter(Boolean).join(' ');
    return {...row, hit, why: why.length > 500 ? why.slice(0, 497) + '...' : why};
}
/** The combat lane's one change: wrap a fight's fighters array. Rewrites only the player's kit rows named in `spells` (kit id -> spell
 *  row id), with the first other-side fighter as the target for the landing odds. Other fighters (Draco's own kit) are left as they are. */
export function practiseDuelKit(state, fighters, spells) {
    const me = fighters.find(f => f.id === 'player'), them = fighters.find(f => f.side !== me?.side);
    if(!me?.kit) return fighters;
    const kit = Object.fromEntries(Object.entries(me.kit).map(([id, row]) => [id, spells[id] ? practisedKitRow(row, state, spells[id], me.profile, them?.profile) : row]));
    return fighters.map(f => f === me ? {...f, kit} : f);
}
