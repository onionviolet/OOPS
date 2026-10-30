// World-neutral episodes. Facts remain in their owner; this slice stores versions of them.
import {address, compareCodePoints} from './gen_kit.js';
import {checkKey} from './check_keys.js';
import {resolveCheck} from './check_resolver.js';

import {MEMORY_LIMITS, DEFAULT_TEMPERAMENT, TEMPERAMENT_TABLE, tableRevision} from './person_temperament.js';
export {MEMORY_LIMITS} from './person_temperament.js';
export const MEMORY_KINDS = Object.freeze(['helped', 'harmed', 'betrayed', 'witnessed', 'told', 'impression', 'amends']);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const natural = v => Number.isSafeInteger(v) && v >= 0;
const id = (v, limits = MEMORY_LIMITS) => typeof v === 'string' && v.length > 0 && v.length <= limits.idLength;
const need = (ok, message) => { if (!ok) throw TypeError(message); };
const fields = (v, keys) => object(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
const EPISODE_FIELDS = ['kind', 'about', 'fact', 'source', 'certainty', 'feeling', 'day', 'count'];
// Schema 2 (P3c) adds an optional silence flag on an episode and a claims list. Schema 1 slices load unchanged.
export const MEMORY_SCHEMA = 2;
const snapshots = new WeakSet();
export const isMemorySnapshot = slice => snapshots.has(slice);
const freezeMemory = s => {Object.freeze(s.ids); if(s.tables) Object.freeze(s.tables); if(s.claims) {s.claims.forEach(Object.freeze); Object.freeze(s.claims);} for(const rows of Object.values(s.holders)) {rows.forEach(Object.freeze); Object.freeze(rows);} Object.freeze(s.holders); snapshots.add(s); return Object.freeze(s);};
export const memorySnapshot = (slice, day, limits = MEMORY_LIMITS) => isMemorySnapshot(slice) ? (validateMemory(slice,day,limits),slice) : freezeMemory(structuredClone(validateMemory(slice,day,limits)));
const readCache = new WeakMap();
export const freshMemory = () => ({schema: 1, ids: [], holders: {}});
// Canon baseline is a read port, deliberately empty until a private pack supplies it.
export const canonBaseline = () => [];

export function validateEpisode(e, day, limits = MEMORY_LIMITS) {
    need(natural(day) && (fields(e, EPISODE_FIELDS) || fields(e, [...EPISODE_FIELDS, 'silence'])), 'Invalid episode shape or clock.');
    need(!Object.hasOwn(e, 'silence') || e.kind !== 'impression' && fields(e.silence, ['asker', 'promised']) && id(e.silence.asker, limits) && typeof e.silence.promised === 'boolean', 'Invalid silence flag.');
    need(MEMORY_KINDS.includes(e.kind) && id(e.about, limits) && (e.fact === null || id(e.fact, limits)), 'Invalid episode kind or pointer.');
    need(e.source === 'saw' || e.source === 'inferred' || fields(e.source, ['teller']) && id(e.source.teller, limits), 'Invalid episode source.');
    need(Number.isInteger(e.certainty) && e.certainty >= 0 && e.certainty <= 100 &&
        Number.isInteger(e.feeling) && Math.abs(e.feeling) <= 100 && natural(e.day) && e.day <= day, 'Invalid episode values or future day.');
    need(e.kind === 'impression' ? e.fact === null && e.source === 'inferred' && natural(e.count) && e.count > 0 :
        e.fact !== null && e.count === 1, 'Invalid episode detail/count.');
    return e;
}
export function episode(input, day, limits = MEMORY_LIMITS) {
    return structuredClone(validateEpisode({count: 1, ...input}, day, limits));
}
// One dictionary preserves arbitrary opaque IDs without repeating them per episode.
export function encodeMemory(holders, day, limits = MEMORY_LIMITS, claims = []) {
    need(object(holders) && Object.keys(holders).length <= limits.holders, 'Invalid memory holders.');
    const ids = [], refs = new Map(), ref = value => {
        if (!refs.has(value)) { refs.set(value, ids.length); ids.push(value); }
        return refs.get(value);
    };
    const rows = Object.create(null);
    for (const holder of Object.keys(holders).sort(compareCodePoints)) {
        need(id(holder, limits) && Array.isArray(holders[holder]) && holders[holder].length <= limits.episodes, 'Memory cap exceeded.');
        rows[holder] = holders[holder].map(e => {
            validateEpisode(e, day, limits);
            const tuple = [MEMORY_KINDS.indexOf(e.kind), ref(e.about), e.fact === null ? -1 : ref(e.fact),
                e.source === 'saw' ? -1 : e.source === 'inferred' ? -2 : ref(e.source.teller), e.certainty, e.feeling, e.day];
            if (e.kind === 'impression') tuple.push(e.count);
            else if (e.silence) tuple.push(ref(e.silence.asker), e.silence.promised ? 1 : 0);
            return tuple;
        });
    }
    need(Array.isArray(claims) && claims.length <= limits.episodes * 10, 'Too many claims.');
    const claimRows = claims.map(c => { need(fields(c, ['speaker', 'fact', 'says', 'day']) && natural(c.day) && c.day <= day && [c.speaker, c.fact, c.says].every(v => id(v, limits)), 'Invalid claim.'); return [ref(c.speaker), ref(c.fact), ref(c.says), c.day]; });
    const used = rows && Object.values(rows).some(r => r.some(t => t.length === 9)) || claimRows.length > 0;
    // The lowest schema that holds the data keeps every untouched save byte-identical.
    const slice = {schema: used ? 2 : 1, ids, holders: {...rows}, ...(claimRows.length ? {claims: claimRows} : {}), tables:[tableRevision(limits), tableRevision(TEMPERAMENT_TABLE)]};
    need(estimateMemoryBytes(slice) <= limits.bytes, 'Memory byte budget exceeded.');
    freezeMemory(validateMemory(slice, day, limits));
    // Encoding already validated these inputs. Keep a detached decoded read view.
    readCache.set(slice,{day,limits,rows:structuredClone(holders)});
    return slice;
}
export function decodeMemory(slice, day, limits = MEMORY_LIMITS) {
    validateMemory(slice, day, limits);
    const out = Object.create(null);
    for (const [holder, rows] of Object.entries(slice.holders)) out[holder] = rows.map(t => ({kind: MEMORY_KINDS[t[0]],
        about: slice.ids[t[1]], fact: t[2] === -1 ? null : slice.ids[t[2]],
        source: t[3] === -1 ? 'saw' : t[3] === -2 ? 'inferred' : {teller: slice.ids[t[3]]},
        certainty: t[4], feeling: t[5], day: t[6], count: t[0] === MEMORY_KINDS.indexOf('impression') ? t[7] : 1, ...(t.length === 9 ? {silence: {asker: slice.ids[t[7]], promised: t[8] === 1}} : {})}));
    return out;
}
export function decodeClaims(slice) { return (slice.claims || []).map(c => ({speaker: slice.ids[c[0]], fact: slice.ids[c[1]], says: slice.ids[c[2]], day: c[3]})); }
export function validateMemory(slice, day, limits = MEMORY_LIMITS) {
    need(natural(day) && object(slice) && ['schema', 'ids', 'holders'].every(k => Object.hasOwn(slice, k)) && Object.keys(slice).every(k => ['schema', 'ids', 'holders', 'tables', 'claims'].includes(k)) &&
        (slice.schema === 1 && !Object.hasOwn(slice, 'claims') || slice.schema === 2) && Array.isArray(slice.ids) &&
        slice.ids.every(value=>id(value,limits)) && new Set(slice.ids).size === slice.ids.length && object(slice.holders), 'Invalid memory slice.');
    need(Object.keys(slice.holders).length <= limits.holders && estimateMemoryBytes(slice) <= limits.bytes, 'Memory budget exceeded.');
    if(slice.tables) need(Array.isArray(slice.tables) && slice.tables.length === 2 && (slice.tables[0] === tableRevision(limits) || limits.readRevision === slice.tables[0]) && slice.tables[1] === tableRevision(TEMPERAMENT_TABLE), 'Memory table revision needs an explicit migration.');
    const pointer = n => natural(n) && n < slice.ids.length;
    if (slice.claims) need(Array.isArray(slice.claims) && slice.claims.every(c => Array.isArray(c) && c.length === 4 && pointer(c[0]) && pointer(c[1]) && pointer(c[2]) && natural(c[3]) && c[3] <= day), 'Invalid claims.');
    for (const [holder, rows] of Object.entries(slice.holders)) {
        need(id(holder, limits) && Array.isArray(rows) && rows.length <= limits.episodes, 'Memory cap exceeded.');
        const impressions = new Set();
        for (const t of rows) {
            need(Array.isArray(t) && (t.length === 7 || t.length === 8 || t.length === 9 && slice.schema === 2) && natural(t[0]) && t[0] < MEMORY_KINDS.length &&
                pointer(t[1]) && (t[2] === -1 || pointer(t[2])) && (t[3] === -1 || t[3] === -2 || pointer(t[3])), 'Invalid memory tuple.');
            const kind = MEMORY_KINDS[t[0]];
            need(kind === 'impression' ? t.length === 8 : t.length === 7 || t.length === 9, 'Invalid memory tuple length.');
            need(t.length !== 9 || pointer(t[7]) && (t[8] === 0 || t[8] === 1), 'Invalid silence tuple.');
            validateEpisode({kind, about: slice.ids[t[1]], fact: t[2] === -1 ? null : slice.ids[t[2]],
                source: t[3] === -1 ? 'saw' : t[3] === -2 ? 'inferred' : {teller: slice.ids[t[3]]},
                certainty: t[4], feeling: t[5], day: t[6], count: kind === 'impression' ? t[7] : 1, ...(t.length === 9 ? {silence: {asker: slice.ids[t[7]], promised: t[8] === 1}} : {})}, day, limits);
            if (kind === 'impression') { need(!impressions.has(t[1]), 'Duplicate subject impression.'); impressions.add(t[1]); }
        }
    }
    return slice;
}
// Mark the holder's existing episodes about `about` (optionally one topic fact) as asked-to-keep-quiet.
// A later promise upgrades the flag; a flag never downgrades. Returns the slice unchanged when nothing matches.
export function flagSilence(slice, holder, {about, match = () => true, asker, promised}, day, limits = MEMORY_LIMITS) {
    const readLimits = {...limits, readRevision:tableRevision(MEMORY_LIMITS), holders:Math.max(limits.holders,Object.keys(slice.holders).length), episodes:Math.max(limits.episodes,...Object.values(slice.holders).map(r=>r.length)), bytes:Math.max(limits.bytes,estimateMemoryBytes(slice))};
    const holders = decodeMemory(slice, day, readLimits);
    let changed = false;
    for (const e of holders[holder] ?? []) if (e.kind !== 'impression' && e.about === about && match(e)) {
        const was = e.silence; if (was && was.asker === asker && (was.promised || !promised)) continue;
        e.silence = {asker, promised: !!(promised || was?.asker === asker && was.promised)}; changed = true;
    }
    return changed ? encodeMemory(holders, day, limits, decodeClaims(slice)) : slice;
}
// A claim is what someone said about a fact, kept apart from the fact (LSD422). `says` is an opaque claim id.
export function addClaim(slice, claim, day, limits = MEMORY_LIMITS) {
    const readLimits = {...limits, readRevision:tableRevision(MEMORY_LIMITS), holders:Math.max(limits.holders,Object.keys(slice.holders).length), episodes:Math.max(limits.episodes,...Object.values(slice.holders).map(r=>r.length)), bytes:Math.max(limits.bytes,estimateMemoryBytes(slice))};
    const claims = decodeClaims(slice);
    if (claims.some(c => c.speaker === claim.speaker && c.fact === claim.fact && c.says === claim.says)) return slice;
    return encodeMemory(decodeMemory(slice, day, readLimits), day, limits, [...claims, {...claim, day}]);
}
// One group impression per holder and subject (LSD353): a later one merges by weight instead of duplicating.
export function mergeImpression(slice, holder, imp, day, limits = MEMORY_LIMITS) {
    const readLimits = {...limits, readRevision:tableRevision(MEMORY_LIMITS), holders:Math.max(limits.holders,Object.keys(slice.holders).length), episodes:Math.max(limits.episodes,...Object.values(slice.holders).map(r=>r.length)), bytes:Math.max(limits.bytes,estimateMemoryBytes(slice))};
    const holders = decodeMemory(slice, day, readLimits), rows = holders[holder] ??= [], at = rows.findIndex(e => e.kind === 'impression' && e.about === imp.about);
    const next = episode(imp, day, limits);
    if (at < 0) rows.push(next);
    else { const o = rows[at], n = o.count + next.count;
        rows[at] = episode({...o, feeling: Math.round((o.feeling * o.count + next.feeling * next.count) / n), certainty: Math.round((o.certainty * o.count + next.certainty * next.count) / n), count: n, day: Math.max(o.day, next.day)}, day, limits); }
    return encodeMemory(holders, day, limits, decodeClaims(slice));
}
export function migrateMemory(slice, day, limits = MEMORY_LIMITS) { return slice === undefined ? freshMemory() : structuredClone(validateMemory(slice, day, limits)); }
export const estimateMemoryBytes = slice => new TextEncoder().encode(JSON.stringify(slice)).length;

// Hyperbolic fade: no tick state. Harm and strong feelings lengthen the half-life.
export function vividness(e, day, temperament = DEFAULT_TEMPERAMENT, limits = MEMORY_LIMITS) {
    validateEpisode(e, day, limits);
    const harm = ['harmed', 'betrayed'].includes(e.kind);
    const halfLife = (harm ? limits.harmDays * temperament.harmFade : limits.otherDays * (e.kind === 'helped' ? temperament.helpFade : 1)) * (1 + Math.abs(e.feeling) / limits.feelingScale);
    return halfLife / (halfLife + (day - e.day));
}
export function tellMemory(e, teller, day, loss = MEMORY_LIMITS.tellingLoss, limits = MEMORY_LIMITS) {
    validateEpisode(e, day, limits);
    need(id(teller, limits) && Number.isInteger(loss) && loss >= 1 && loss <= 100 && e.kind !== 'impression', 'Invalid telling.');
    return episode({...e, source: {teller}, certainty: Math.max(0, e.certainty - loss)}, day, limits);
}
const identity = e => address(e);
function fold(rows, day, limits = MEMORY_LIMITS) {
    const groups = new Map();
    for (const e of rows) {
        const g = groups.get(e.about) ?? {kind: 'impression', about: e.about, fact: null, source: 'inferred', certainty: 0, feeling: 0, day: 0, count: 0};
        const total = g.count + e.count;
        need(Number.isSafeInteger(total), 'Impression count overflow.');
        g.feeling = Math.round((g.feeling * g.count + e.feeling * e.count) / total);
        g.certainty = Math.round((g.certainty * g.count + e.certainty * e.count) / total);
        g.count = total; g.day = Math.max(g.day, e.day); groups.set(e.about, g);
    }
    return [...groups.values()].map(e => episode(e, day, limits));
}
// Impressions consume slots too. Past 40 different subjects, the weakest
// impressions are forgotten outright (LSD360): forgetting a minor acquaintance
// is what a person would lose, and the fact log still holds the truth.
const strength = (e, day, limits = MEMORY_LIMITS) => (Math.abs(e.feeling) + 1) * vividness(e, day, DEFAULT_TEMPERAMENT, limits);
export function remember(slice, holder, input, day, limits = MEMORY_LIMITS) {
    need(id(holder,limits), 'Invalid memory holder.');
    // Lowered caps take effect at this write, not during a read of the old save.
    const readLimits = {...limits, readRevision:tableRevision(MEMORY_LIMITS), holders:Math.max(limits.holders,Object.keys(slice.holders).length), episodes:Math.max(limits.episodes,...Object.values(slice.holders).map(r=>r.length)), bytes:Math.max(limits.bytes,estimateMemoryBytes(slice))};
    const holders = decodeMemory(slice, day, readLimits), claims = decodeClaims(slice), e = episode(input, day, limits);
    holders[holder] = [...(holders[holder] ?? []), e];
    for(const holder of Object.keys(holders)) {
        const rank = (a, b) => strength(b, day, limits) - strength(a, day, limits) || b.day - a.day || compareCodePoints(identity(a), identity(b));
        let rows = holders[holder].sort(rank);
        // Forget whole subjects, weakest first, before folding anyone's detail.
        const subjects = [...new Set(rows.map(m => m.about))];
        if (subjects.length > limits.episodes) {
            const kept = new Set(subjects.slice(0, limits.episodes));
            rows = rows.filter(m => kept.has(m.about));
        }
        let keep = rows.length;
        while (keep > 0 && keep + new Set(rows.slice(keep).map(m => m.about)).size > limits.episodes) keep--;
        const kept = rows.slice(0, keep), folded = fold(rows.slice(keep), day, limits);
        // Merge a prior impression with newly folded detail for the same subject.
        const detail = kept.filter(m => m.kind !== 'impression');
        holders[holder] = [...detail, ...fold([...kept.filter(m => m.kind === 'impression'), ...folded], day, limits)];
    }
    const weakest = () => Object.keys(holders).sort((a,b)=>Math.max(0,...holders[a].map(e=>strength(e,day,limits)))-Math.max(0,...holders[b].map(e=>strength(e,day,limits))) || compareCodePoints(a,b))[0];
    while(Object.keys(holders).length > limits.holders) delete holders[weakest()];
    // A smaller byte budget forgets weakest detail, then empty holders. Truth stays with facts.
    for(;;) {
        try {return encodeMemory(holders, day, limits, claims);} catch(error) {
            if(!/byte budget/.test(error.message) || !Object.keys(holders).length) throw error;
            const h=weakest(); holders[h].sort((a,b)=>strength(a,day,limits)-strength(b,day,limits)); holders[h].shift();
            if(!holders[h].length) delete holders[h];
        }
    }
}

const RECALL_PROFILE = Object.freeze({id: 'memory.recall', revision: 1, family: 'roll_under', dice: {count: 1, sides: 100}});
// Cues carry their own opaque identity and matches, computed by the fact owner.
// No text/topic truth is duplicated in the memory save. One draw per invocation.
export function recallMemory({holder, memory, cue, period, day, drawAddress, temperament = DEFAULT_TEMPERAMENT, limits = MEMORY_LIMITS}) {
    validateEpisode(memory, day, limits);
    need(id(holder,limits) && fields(cue, ['id', 'person', 'place', 'topic']) && id(cue.id,limits) &&
        ['person', 'place', 'topic'].every(k => typeof cue[k] === 'boolean') && object(period), 'Invalid recall cue/period.');
    const matches = Number(cue.person) + Number(cue.place) + Number(cue.topic);
    const key = checkKey({subject: holder, method: 'memory.recall@1', period,
        targetState: {memory, cue, day}});
    const target = matches ? Math.max(1, Math.min(100, Math.floor(100 * vividness(memory, day, temperament, limits) * temperament.recall * (['harmed','betrayed'].includes(memory.kind) ? temperament.harmRecall : 1) * Math.min(1, matches / 2)))) : 0;
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
export function readMemories(slice, holder, day, {legacy = [], baseline = canonBaseline, limits = MEMORY_LIMITS} = {}) {
    need(id(holder, limits) && Array.isArray(legacy) && typeof baseline === 'function', 'Invalid memory reader.');
    let decoded;
    if(isMemorySnapshot(slice) && readCache.get(slice)?.day <= day && readCache.get(slice)?.limits === limits) decoded = readCache.get(slice).rows;
    else {decoded = decodeMemory(slice, day, limits); if(isMemorySnapshot(slice)) readCache.set(slice,{day,limits,rows:decoded});}
    return structuredClone([...(decoded[holder] ?? []), ...baseline(holder, day), ...legacy]);
}

// Inject the calendar reader; the domain owns state but no clock or save writer.
export function createMemoryDomain({day, limits = MEMORY_LIMITS}) {
    need(typeof day === 'function', 'Memory domain needs its clock port.');
    let state = freshMemory();
    return {id: 'memory', initialState: freshMemory,
        validate: (slice, envelope) => migrateMemory(slice, day(envelope), limits),
        migrate: (slice, envelope) => migrateMemory(slice, day(envelope), limits),
        load: slice => { state = freezeMemory(structuredClone(slice)); }, read: () => state, save: () => structuredClone(state),
        projection: envelope => decodeMemory(state, day(envelope), limits),
        commands: {remember: (holder, input, envelope) => { state = remember(state, holder, input, day(envelope), limits); }}};
}
