// World-neutral social contest seam (lane W10-B, FD18 + lane G: persuade, deceive and read people were missing everywhere).
// socialContest(state, {actor, target, channel, stakes}) reads the actor's skill or ability rows that speak through the matching channel
// (channelsOf, so a world keeps its own nouns, AD46), sets them against the target's resistance, and settles it with ONE keyed draw on the
// notch scale (notch_contest.winChance). Pure: no clock, no save slice, no write. The draw is a function of (root, actor, target, channel,
// period, attempt, stakes), so the same inputs always give the same result (no reload re-roll) and a caller asks again only by changing `attempt`.
//
// Inputs. state: {streams:{root}} or {seed} (the per-save root), optional {period, actors}. actor/target: {id, rows?, disposition?, resist?, tell?}
// or an id found in state.actors. A row is whatever channelsOf reads ({skill_id, level} for a skill, {key|id, notch?} for an ability).
// Channels: 'sway' (persuade, press, bargain), 'deceive' (a lie told well; spoken through conceal and sway rows, since 'deceive' has no
// channel of its own yet), 'read_people' (against the target's conceal rows).
// Observer safety (ABR19): `text` is the actor's own view; `observerText` is what the target and any witness can know and never says a lie
// was told. The target learns it was a lie only when its own read_people row beats the lie (`exposed`, a second keyed draw, none when the
// target holds no read_people row).
import {channelsOf} from './channels.js';
import {winChance, NOTCH_DIALS} from './notch_contest.js';
import {drawFraction} from './gen_kit.js';
import {checkKey} from './check_keys.js';

const dial = (value, why) => Object.freeze({value, why});
export const SOCIAL_DIALS = Object.freeze({
    levelPerNotch: dial(5, 'A skill rises one notch per five levels: the Haggling track runs 0 to 25, so a master stands five notches over a newcomer.'),
    abilityNotch: dial(1, 'A held ability on the channel is one notch unless the row states its own: it is a trained edge, not a guarantee.'),
    baseResist: dial(1, 'Someone defending their own purse, post or secret starts one notch above a reference adult; warmth and low stakes lower it.'),
    openResist: dial(-1, 'A person with no practised face is read more easily than a reference adult.'),
    dispositionCap: dial(3, 'Goodwill or ill will moves resistance by at most three notches either way, so no standing makes a result certain.'),
    stakesCap: dial(3, 'Stakes add at most three notches: a bigger ask is harder, but never hopeless.'),
    notch: dial(NOTCH_DIALS, 'The shared notch-scale default; a world passes its own through state.dials.notch.')
});
export const SOCIAL_CHANNELS = Object.freeze({
    sway: Object.freeze({actor: ['sway'], resistedBy: null}),
    deceive: Object.freeze({actor: ['conceal', 'sway'], resistedBy: null}),
    read_people: Object.freeze({actor: ['read_people'], resistedBy: ['conceal']})
});
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const num = (n, d = 0) => Number.isFinite(n) ? n : d;

/** Notches this holder brings on the given channels: the best row, skill rows by level, ability rows by their own `notch` or the dial. Null if no row speaks them. */
export function rowNotch(rows, channels, dials = SOCIAL_DIALS) {
    let best = null;
    for (const row of Array.isArray(rows) ? rows : []) {
        if (!channelsOf(row).some(id => channels.includes(id))) continue;
        const n = typeof row.skill_id === 'string' ? Math.floor(num(row.level) / dials.levelPerNotch.value) : num(row.notch, dials.abilityNotch.value);
        if (best === null || n > best) best = n;
    }
    return best;
}
const who = (state, x) => (typeof x === 'string' ? state?.actors?.[x] && {id: x, ...state.actors[x]} : x) ?? null;
const rootOf = state => state?.streams?.root ?? state?.seed;

function draw(state, a, t, method, extra) {
    const root = rootOf(state);
    if (!Number.isInteger(root) || root < 0) throw new TypeError('socialContest needs a per-save root (state.streams.root or state.seed).');
    return drawFraction(root, checkKey({subject: `${a.id}>${t.id}`, method: `social:${method}`, period: {at: num(state.period)}, targetState: extra.target, attemptState: {attempt: extra.attempt}}));
}
// Signed -1..1: how decisively the draw landed, relative to the room it had to land in (win: share of the winning band; loss: share of the losing band).
const marginOf = (chance, roll) => roll < chance ? (chance - roll) / chance : -(roll - chance) / (1 - chance);

const LINES = {
    sway: {win: t => `${t} gives ground.`, lose: t => `${t} holds their position.`, watch: (a, t) => `${a} makes a case to ${t}.`},
    deceive: {win: t => `${t} takes it as true.`, lose: t => `${t} is not convinced.`, expose: t => `${t} watches you the whole way and knows it for a lie.`, watch: (a, t) => `${a} speaks with ${t}.`},
    read_people: {win: t => `You see what ${t} is carrying.`, lose: t => `${t}'s face gives you nothing.`, watch: (a, t) => `${a} studies ${t}.`}
};
const mood = d => d >= 1 ? 'warm toward you' : d <= -1 ? 'cold toward you' : 'even-handed with you';

export function socialContest(state, {actor, target, channel, stakes = 0, attempt = 0} = {}) {
    const spec = SOCIAL_CHANNELS[channel];
    if (!spec) throw new TypeError(`Unknown social channel: ${channel}`);
    const a = who(state, actor), t = who(state, target);
    if (!a?.id || !t?.id) throw new TypeError('socialContest needs an actor and a target with ids.');
    const D = state?.dials ? {...SOCIAL_DIALS, ...state.dials} : SOCIAL_DIALS, nd = D.notch.value ?? D.notch;
    const actorNotch = rowNotch(a.rows, spec.actor, D) ?? 0;
    const disposition = clamp(num(t.disposition), -D.dispositionCap.value, D.dispositionCap.value);
    const stake = clamp(num(stakes), 0, D.stakesCap.value);
    let resist;
    if (spec.resistedBy) {
        const face = rowNotch(t.rows, spec.resistedBy, D);
        resist = (face ?? D.openResist.value) + num(t.resist);
    } else resist = D.baseResist.value + stake - disposition + num(t.resist);
    const delta = actorNotch - resist, chance = winChance(delta, nd);
    const roll = draw(state, a, t, channel, {target: {stake, disposition, resist}, attempt});
    const landed = roll < chance;
    const L = LINES[channel], name = t.name ?? t.id;
    const out = {channel, won: landed, margin: marginOf(chance, roll), chance, delta, actorNotch, resistNotch: resist, stakes: stake, exposed: false,
        text: landed ? L.win(name) : L.lose(name), observerText: L.watch(a.name ?? a.id, name)};
    if (channel === 'deceive' && landed) {
        // The target learns it was a lie only by reading it: its own read_people row against the lie's notch, one more keyed draw.
        const read = rowNotch(t.rows, ['read_people'], D);
        if (read !== null) {
            const rc = winChance(read - actorNotch, nd), rr = draw(state, a, t, 'deceive:read', {target: {read, lie: actorNotch}, attempt});
            if (rr < rc) Object.assign(out, {won: false, exposed: true, margin: -marginOf(rc, rr), text: L.expose(name)});
        }
    }
    if (channel === 'read_people' && landed) out.learned = {mood: mood(disposition), tell: typeof t.tell === 'string' ? t.tell : null};
    return out;
}

/** A bounded effect from a result: 0 on a loss, otherwise min..max by how decisively it landed. The one place consumers turn `margin` into an amount. */
export const scaleByMargin = (result, min, max) => result?.won ? Math.round((min + (max - min) * Math.max(0, Math.min(1, result.margin))) * 10000) / 10000 : 0;
