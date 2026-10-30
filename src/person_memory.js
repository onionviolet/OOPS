// World-neutral episodes. Facts remain in their owner; this slice stores versions of them.
import {address, compareCodePoints} from './gen_kit.js';
import {checkKey} from './check_keys.js';
import {resolveCheck} from './check_resolver.js';

export const MEMORY_LIMITS = Object.freeze({holders: 300, episodes: 40, bytes: 500000, idLength: 96});
export const MEMORY_KINDS = Object.freeze(['helped', 'harmed', 'betrayed', 'witnessed', 'told', 'impression']);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const natural = v => Number.isSafeInteger(v) && v >= 0;
const id = v => typeof v === 'string' && v.length > 0 && v.length <= MEMORY_LIMITS.idLength;
const need = (ok, message) => { if (!ok) throw TypeError(message); };
const fields = (v, keys) => object(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
const EPISODE_FIELDS = ['kind', 'about', 'fact', 'source', 'certainty', 'feeling', 'day', 'count'];
export const freshMemory = () => ({schema: 1, ids: [], holders: {}});
// Canon baseline is a read port, deliberately empty until a private pack supplies it.
export const canonBaseline = () => [];

export function validateEpisode(e, day) {
    need(natural(day) && fields(e, EPISODE_FIELDS), 'Invalid episode shape or clock.');
    need(MEMORY_KINDS.includes(e.kind) && id(e.about) && (e.fact === null || id(e.fact)), 'Invalid episode kind or pointer.');
    need(e.source === 'saw' || e.source === 'inferred' || fields(e.source, ['teller']) && id(e.source.teller), 'Invalid episode source.');
    need(Number.isInteger(e.certainty) && e.certainty >= 0 && e.certainty <= 100 &&
        Number.isInteger(e.feeling) && Math.abs(e.feeling) <= 100 && natural(e.day) && e.day <= day, 'Invalid episode values or future day.');
    need(e.kind === 'impression' ? e.fact === null && e.source === 'inferred' && natural(e.count) && e.count > 0 :
        e.fact !== null && e.count === 1, 'Invalid episode detail/count.');
    return e;
}
export function episode(input, day) {
    return structuredClone(validateEpisode({count: 1, ...input}, day));
}
// One dictionary preserves arbitrary opaque IDs without repeating them per episode.
export function encodeMemory(holders, day) {
    need(object(holders) && Object.keys(holders).length <= MEMORY_LIMITS.holders, 'Invalid memory holders.');
    const ids = [], refs = new Map(), ref = value => {
        if (!refs.has(value)) { refs.set(value, ids.length); ids.push(value); }
        return refs.get(value);
    };
    const rows = Object.create(null);
    for (const holder of Object.keys(holders).sort(compareCodePoints)) {
        need(id(holder) && Array.isArray(holders[holder]) && holders[holder].length <= MEMORY_LIMITS.episodes, 'Memory cap exceeded.');
        rows[holder] = holders[holder].map(e => {
            validateEpisode(e, day);
            const tuple = [MEMORY_KINDS.indexOf(e.kind), ref(e.about), e.fact === null ? -1 : ref(e.fact),
                e.source === 'saw' ? -1 : e.source === 'inferred' ? -2 : ref(e.source.teller), e.certainty, e.feeling, e.day];
            if (e.kind === 'impression') tuple.push(e.count);
            return tuple;
        });
    }
    const slice = {schema: 1, ids, holders: {...rows}};
    need(estimateMemoryBytes(slice) <= MEMORY_LIMITS.bytes, 'Memory byte budget exceeded.');
    return validateMemory(slice, day);
}
export function decodeMemory(slice, day) {
    validateMemory(slice, day);
    const out = Object.create(null);
    for (const [holder, rows] of Object.entries(slice.holders)) out[holder] = rows.map(t => ({kind: MEMORY_KINDS[t[0]],
        about: slice.ids[t[1]], fact: t[2] === -1 ? null : slice.ids[t[2]],
        source: t[3] === -1 ? 'saw' : t[3] === -2 ? 'inferred' : {teller: slice.ids[t[3]]},
        certainty: t[4], feeling: t[5], day: t[6], count: t[7] ?? 1}));
    return out;
}
export function validateMemory(slice, day) {
    need(natural(day) && fields(slice, ['schema', 'ids', 'holders']) && slice.schema === 1 && Array.isArray(slice.ids) &&
        slice.ids.every(id) && new Set(slice.ids).size === slice.ids.length && object(slice.holders), 'Invalid memory slice.');
    need(Object.keys(slice.holders).length <= MEMORY_LIMITS.holders && estimateMemoryBytes(slice) <= MEMORY_LIMITS.bytes, 'Memory budget exceeded.');
    const pointer = n => natural(n) && n < slice.ids.length;
    for (const [holder, rows] of Object.entries(slice.holders)) {
        need(id(holder) && Array.isArray(rows) && rows.length <= MEMORY_LIMITS.episodes, 'Memory cap exceeded.');
        const impressions = new Set();
        for (const t of rows) {
            need(Array.isArray(t) && (t.length === 7 || t.length === 8) && natural(t[0]) && t[0] < MEMORY_KINDS.length &&
                pointer(t[1]) && (t[2] === -1 || pointer(t[2])) && (t[3] === -1 || t[3] === -2 || pointer(t[3])), 'Invalid memory tuple.');
            const kind = MEMORY_KINDS[t[0]];
            need(t.length === (kind === 'impression' ? 8 : 7), 'Invalid memory tuple length.');
            validateEpisode({kind, about: slice.ids[t[1]], fact: t[2] === -1 ? null : slice.ids[t[2]],
                source: t[3] === -1 ? 'saw' : t[3] === -2 ? 'inferred' : {teller: slice.ids[t[3]]},
                certainty: t[4], feeling: t[5], day: t[6], count: t[7] ?? 1}, day);
            if (kind === 'impression') { need(!impressions.has(t[1]), 'Duplicate subject impression.'); impressions.add(t[1]); }
        }
    }
    return slice;
}
export function migrateMemory(slice, day) { return slice === undefined ? freshMemory() : structuredClone(validateMemory(slice, day)); }
export const estimateMemoryBytes = slice => new TextEncoder().encode(JSON.stringify(slice)).length;

// Hyperbolic fade: no tick state. Harm and strong feelings lengthen the half-life.
export function vividness(e, day) {
    validateEpisode(e, day);
    const halfLife = (['harmed', 'betrayed'].includes(e.kind) ? 120 : 30) * (1 + Math.abs(e.feeling) / 10);
    return halfLife / (halfLife + day - e.day);
}
export function tellMemory(e, teller, day, loss = 20) {
    validateEpisode(e, day);
    need(id(teller) && Number.isInteger(loss) && loss >= 1 && loss <= 100 && e.kind !== 'impression', 'Invalid telling.');
    return episode({...e, source: {teller}, certainty: Math.max(0, e.certainty - loss)}, day);
}
const identity = e => address(e);
function fold(rows, day) {
    const groups = new Map();
    for (const e of rows) {
        const g = groups.get(e.about) ?? {kind: 'impression', about: e.about, fact: null, source: 'inferred', certainty: 0, feeling: 0, day: 0, count: 0};
        const total = g.count + e.count;
        need(Number.isSafeInteger(total), 'Impression count overflow.');
        g.feeling = Math.round((g.feeling * g.count + e.feeling * e.count) / total);
        g.certainty = Math.round((g.certainty * g.count + e.certainty * e.count) / total);
        g.count = total; g.day = Math.max(g.day, e.day); groups.set(e.about, g);
    }
    return [...groups.values()].map(e => episode(e, day));
}
// Impressions consume slots too. Past 40 different subjects, the weakest
// impressions are forgotten outright (LSD360): forgetting a minor acquaintance
// is what a person would lose, and the fact log still holds the truth.
const strength = (e, day) => (Math.abs(e.feeling) + 1) * vividness(e, day);
export function remember(slice, holder, input, day) {
    need(id(holder), 'Invalid memory holder.');
    const holders = decodeMemory(slice, day), e = episode(input, day);
    const rank = (a, b) => strength(b, day) - strength(a, day) || b.day - a.day || compareCodePoints(identity(a), identity(b));
    let rows = [...(holders[holder] ?? []), e].sort(rank);
    // Forget whole subjects, weakest first, before folding anyone's detail.
    const subjects = [...new Set(rows.map(m => m.about))];
    if (subjects.length > MEMORY_LIMITS.episodes) {
        const kept = new Set(subjects.slice(0, MEMORY_LIMITS.episodes));
        rows = rows.filter(m => kept.has(m.about));
    }
    let keep = rows.length;
    while (keep > 0 && keep + new Set(rows.slice(keep).map(m => m.about)).size > MEMORY_LIMITS.episodes) keep--;
    const kept = rows.slice(0, keep), folded = fold(rows.slice(keep), day);
    // Merge a prior impression with newly folded detail for the same subject.
    const detail = kept.filter(m => m.kind !== 'impression');
    holders[holder] = [...detail, ...fold([...kept.filter(m => m.kind === 'impression'), ...folded], day)];
    return encodeMemory(holders, day);
}

const RECALL_PROFILE = Object.freeze({id: 'memory.recall', revision: 1, family: 'roll_under', dice: {count: 1, sides: 100}});
// Cues carry their own opaque identity and matches, computed by the fact owner.
// No text/topic truth is duplicated in the memory save. One draw per invocation.
export function recallMemory({holder, memory, cue, period, day, drawAddress}) {
    validateEpisode(memory, day);
    need(id(holder) && fields(cue, ['id', 'person', 'place', 'topic']) && id(cue.id) &&
        ['person', 'place', 'topic'].every(k => typeof cue[k] === 'boolean') && object(period), 'Invalid recall cue/period.');
    const matches = Number(cue.person) + Number(cue.place) + Number(cue.topic);
    const key = checkKey({subject: holder, method: 'memory.recall@1', period,
        targetState: {memory, cue, day}});
    const target = matches ? Math.max(1, Math.floor(100 * vividness(memory, day) * Math.min(1, matches / 2))) : 0;
    return resolveCheck(RECALL_PROFILE, {id: key, target}, drawAddress);
}

// Caller supplies rows from any of the three legacy owners, with their clock
// converted to days. This is a detached read, never a migration or a write.
export function legacyEpisodes(rows, {holder, about, store, toDay}) {
    need(id(holder) && id(about) && ['simulation', 'chronicle', 'household'].includes(store) &&
        Array.isArray(rows) && typeof toDay === 'function', 'Invalid legacy memory read.');
    return rows.map((m, index) => {
        const day = toDay(m.at);
        need(object(m) && typeof m.text === 'string' && natural(day), 'Invalid legacy literal.');
        return {kind: 'legacy-literal', holder, about, store, id: m.id ?? m.cause ?? String(index), day, text: m.text};
    });
}
export function readMemories(slice, holder, day, {legacy = [], baseline = canonBaseline} = {}) {
    need(id(holder) && Array.isArray(legacy) && typeof baseline === 'function', 'Invalid memory reader.');
    return structuredClone([...(decodeMemory(slice, day)[holder] ?? []), ...baseline(holder, day), ...legacy]);
}

// Inject the calendar reader; the domain owns state but no clock or save writer.
export function createMemoryDomain({day}) {
    need(typeof day === 'function', 'Memory domain needs its clock port.');
    let state = freshMemory();
    return {id: 'memory', initialState: freshMemory,
        validate: (slice, envelope) => migrateMemory(slice, day(envelope)),
        migrate: (slice, envelope) => migrateMemory(slice, day(envelope)),
        load: slice => { state = structuredClone(slice); }, save: () => structuredClone(state),
        projection: envelope => decodeMemory(state, day(envelope)),
        commands: {remember: (holder, input, envelope) => { state = remember(state, holder, input, day(envelope)); }}};
}
