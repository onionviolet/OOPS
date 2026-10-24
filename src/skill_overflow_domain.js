// Per-world overflow for the single-gain skill XP cap (GTL6, GTR16, GTR21; proposal 2026-10-23).
// The cap stays; what happens to the excess is a world row. Banked excess drains into
// later gains of the same skill, in the same world: each fresh gain releases at most
// drainRatio times itself, never past the cap, so the bank pays out as you practise.
import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';

// Each world states its policy, dial and in-world reason. Unlisted worlds keep the
// older behaviour (excess lost), now stated, until a world pass gives them a row.
export const SKILL_GAIN_OVERFLOW = Object.freeze({
    'base.frontier': Object.freeze({policy: 'banked', limitLevels: 1, drainRatio: 1,
        reason: 'A big lesson digests over several sittings: excess practice waits and feeds later gains.'}),
    default: Object.freeze({policy: 'lost',
        reason: 'Practice past one sitting\'s limit does not carry here.'}),
});
// Event rows refine a world row for one named gain (GTR29). Proposal, original world:
// a purification's insight past the sitting cap settles into the drill being practised.
export const SKILL_EVENT_OVERFLOW = Object.freeze({
    'p23.mistglass#purification': Object.freeze({policy: 'converted', sink: 'practice-minutes', xpPerMinute: 5,
        reason: 'A purification teaches more than one sitting holds; the surplus settles into the drill you are practising, one minute per 5 insight. Open-mist absorption has no drill to deepen and an Integrated drill has no further stage, so there the surplus fades.'}),
});
export function skillEventOverflowRow(worldId, eventId) {
    return SKILL_EVENT_OVERFLOW[`${worldId}#${eventId}`] || skillOverflowRow(worldId);
}
const round = n => Math.round(n * 100) / 100;

let bank = {};
export function skillOverflowRow(worldId) {
    return SKILL_GAIN_OVERFLOW[worldId] || SKILL_GAIN_OVERFLOW.default;
}
function currentWorld() {
    return readPort('expansion')?.actors?.player?.worldId || 'base.frontier';
}
export function bankedSkillXP(skillId, worldId = currentWorld()) {
    return bank[worldId]?.[skillId] || 0;
}

// Pure over its inputs plus the bank; the caller has already decided the cap applies.
export function settleCappedSkillGain({skillId, xp, cap, xpToNext, worldId = currentWorld()}) {
    if (!Number.isFinite(cap) || !(cap > 0) || !Number.isFinite(xp)) return xp;
    const row = skillOverflowRow(worldId);
    if (row.policy !== 'banked') return Math.min(xp, cap);
    const store = bank[worldId] ||= {};
    let held = store[skillId] || 0;
    if (xp > cap) {
        held = Math.min(held + (xp - cap), xpToNext * row.limitLevels);
        xp = cap;
    } else {
        const draw = Math.min(held, cap - xp, xp * (row.drainRatio ?? 1));
        xp += draw; held -= draw;
    }
    held = round(held);
    if (held > 0) store[skillId] = held; else delete store[skillId];
    if (!Object.keys(store).length) delete bank[worldId];
    return xp;
}

function validSlice(slice) {
    return slice && slice.schema === 1 && slice.bank && typeof slice.bank === 'object' &&
        Object.values(slice.bank).every(w => w && typeof w === 'object' &&
            Object.keys(w).length > 0 && Object.values(w).every(n => Number.isFinite(n) && n > 0));
}
registerDomain({
    id: 'skill_overflow',
    initialState: () => ({schema: 1, bank: {}}),
    save: () => Object.keys(bank).length ? {schema: 1, bank: structuredClone(bank)} : undefined,
    validate: slice => { if (slice !== undefined && !validSlice(slice)) throw Error('Invalid skill overflow slice.'); },
    load: slice => { bank = validSlice(slice) ? structuredClone(slice.bank) : {}; },
    projection: (name, skillId) => name === 'bank' ? bankedSkillXP(skillId) :
        name === 'row' ? skillOverflowRow(currentWorld()) : undefined,
});
