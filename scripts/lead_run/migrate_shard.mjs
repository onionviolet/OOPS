// Mechanical migration of shard files to schema 1.3 where a script can derive the change (LEAD_RUN_SCHEMA,
// "Schema 1.3 and the change rule"): schema tags, the organization id namespace, prose moved out of label fields,
// `pov` defaulting to the lead, and motive tags mapped onto the vocabulary. Steps without an action class and
// motives with no mapping are listed for a cheap review pass; nothing is invented. Writes `<prefix>_m13_*.jsonl`
// beside the originals. Usage: node scripts/lead_run/migrate_shard.mjs <dir> <prefix>
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {MOTIVES, parseShard} from './lint_lead_run.mjs';
import {parseLocator, formatLocator, nameIn} from './world_profiles.mjs';

const LABEL = new Set(['S', 'I', 'U']);
// Free-form tags seen in chapters 1-15 mapped onto the vocabulary; extend with a reason in the changelog.
export const MOTIVE_MAP = Object.freeze({'fear-of-unknown': 'fear', 'self-protect': 'safety', 'avoid-danger': 'safety',
    'survive': 'safety', 'avoid-exposure': 'secrecy', 'hide-thoughts': 'secrecy', 'hide-scene': 'secrecy',
    'learn-mysteries': 'curiosity', 'curiosity-about-secrets': 'curiosity', 'curiosity-mystery': 'curiosity',
    'seek-formula': 'ambition', 'avoid-rash-choice': 'caution', 'avoid-problem': 'caution', 'practical-pay': 'income',
    'return-home': 'belonging', 'unease-after-talk': 'fear', 'pride-of-state': 'pride'});

const fixLabel = (obj, key = 'label') => {
    if (obj && obj[key] !== undefined && !LABEL.has(obj[key])) { obj.note = [obj.note, String(obj[key])].filter(Boolean).join('; '); obj[key] = 'I'; }
};
const fixId = id => typeof id === 'string' ? id.replace(/\.org\./, '.organization.') : id;

export function migrateScene(r, review, beats = new Set()) {
    const s = structuredClone(r);
    s.schema = 'lead-run/1.3';
    s.pov ??= 'lead';
    fixLabel(s.date);
    // Safe structural repairs (nothing invented): string deps become order-only deps; an anchor that is not a beat
    // in this file becomes date-unsettled with the old anchor kept in the note; free-text evidence labels become I.
    s.deps = (s.deps || []).map(d => typeof d === 'string' ? {id: d, kind: 'after'} : d);
    if (s.date && s.date.anchor && !beats.has(s.date.anchor)) {
        s.date.note = [s.date.note, `anchor was ${s.date.anchor}`].filter(Boolean).join('; ');
        s.date = {...s.date, anchor: null, offsetDays: null, value: 'date-unsettled'};
    }
    for (const e of s.evidence || []) fixLabel(e);
    // A footprint with a free-text window keeps the text inside a window object; list fields default to empty.
    if (s.footprint && typeof s.footprint === 'object') {
        const f = s.footprint;
        if (typeof f.window !== 'object' || f.window === null) f.window = {note: String(f.window ?? '')};
        for (const k of ['places', 'hazards', 'roles']) if (!Array.isArray(f[k])) f[k] = f[k] ? [f[k]] : [];
    }
    // `great` needs a footprint; without one the scene is kept as routine and listed for review, not given a guessed footprint.
    if (s.weight === 'great' && !s.footprint) { s.weight = 'routine'; review.push({beat: s.beat, need: 'great-without-footprint'}); }
    for (const c of s.choices || []) fixLabel(c);
    for (const st of s.steps || []) if (!st.class) review.push({beat: s.beat, need: 'action-class', verb: st.verb});
    s.motives = (s.motives || []).map(m => {
        const tag = MOTIVES.includes(m.tag) ? m.tag : MOTIVE_MAP[m.tag];
        if (!tag) { review.push({beat: s.beat, need: 'motive', tag: m.tag}); return m; }
        return {...m, tag};
    });
    for (const t of s.touched || []) t.id = fixId(t.id);
    s.present = (s.present || []).map(fixId);
    return s;
}

export function migrateCensus(r) {
    const c = structuredClone(r);
    c.schema = 'census/1.3';
    c.id = fixId(c.id);
    if (c.kind === 'org') c.kind = 'organization';
    // A row claimed as placed with no address drops back to M0 rather than gaining an invented address.
    if (c.rung && c.rung !== 'M0' && !(c.whereabouts || []).some(w => w.place || w.era)) c.rung = 'M0';
    // The id's kind segment follows the row's kind (`lotm.item.x` on a document row becomes `lotm.document.x`); the old id is kept in `idWas`.
    const seg = /^([a-z0-9]+)\.([a-z]+)\.(.+)$/.exec(c.id || '');
    if (seg && c.kind && seg[2] !== c.kind) { c.idWas = c.id; c.id = `${seg[1]}.${c.kind}.${seg[3]}`; }
    // A price row without a parsed amount gets one when its printed name is a number and a known unit ("7便士", "three Galleons").
    if (c.kind === 'price' && !(c.amount && Number.isFinite(c.amount.value) && c.amount.unit)) { const a = parseAmount(c.zh) || noteAmount(c.note); if (a) c.amount = a; }
    // Batch readers put an evidence label (S, I, U, T) in the census `label`, which is the display name (2026-10-28): the printed name stands in for English
    // sources, a title from the id slug for others; `labelFrom` marks it so the merge prefers a real label.
    if (['S', 'I', 'U', 'T'].includes(c.label)) {
        c.labelWas = c.label;
        const ascii = /^[\x20-\x7e]+$/.test(c.zh || '');
        c.label = ascii ? c.zh : String(c.id || '').split('.').pop().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        c.labelFrom = ascii ? 'zh' : 'id';
    }
    return c;
}

/** A reader's own bracketed amount in a note ("Cash left.[5 pounds]") -> parseAmount of the bracket; null otherwise. */
export function noteAmount(note) {
    const m = /\[([^\]]+)\]/.exec(String(note || ''));
    return m ? parseAmount(m[1].trim()) : null;
}

const ZH_DIGIT = {零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9};
/** Chinese numerals up to the thousands ("十二", "三百五十", "两千") or plain digits. */
export function zhNumber(s) {
    if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
    let total = 0, cur = 0;
    for (const ch of s) {
        if (ch in ZH_DIGIT) cur = ZH_DIGIT[ch];
        else if (ch === '十') { total += (cur || 1) * 10; cur = 0; }
        else if (ch === '百') { total += cur * 100; cur = 0; }
        else if (ch === '千') { total += cur * 1000; cur = 0; }
        else return null;
    }
    return total + cur;
}
const ZH_UNITS = [['金镑', 'pound'], ['镑', 'pound'], ['苏勒', 'soli'], ['便士', 'penny']];
const EN_UNITS = {galleon: 'galleon', sickle: 'sickle', knut: 'knut', pound: 'pound', penny: 'penny', pence: 'penny', shilling: 'shilling', crown: 'crown'};
const EN_WORDS = {a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, twenty: 20, fifty: 50, hundred: 100};
/** "7便士" -> {value: 7, unit: 'penny'}; "three Galleons" -> {value: 3, unit: 'galleon'}; anything else -> null (nothing is guessed). */
export function parseAmount(name) {
    const s = String(name || '').trim();
    for (const [zh, unit] of ZH_UNITS) {
        const m = s.match(new RegExp(`^([\\d.零一二两三四五六七八九十百千]+)(?:个|枚|张)?(?:铜)?${zh}$`));
        if (m) { const v = zhNumber(m[1]); if (v != null) return {value: v, unit}; }
    }
    const e = s.toLowerCase().match(/^(\d+(?:\.\d+)?|[a-z]+) ([a-z]+?)s?$/);
    if (e && EN_UNITS[e[2]] && (EN_WORDS[e[1]] != null || /^\d/.test(e[1]))) return {value: /^\d/.test(e[1]) ? Number(e[1]) : EN_WORDS[e[1]], unit: EN_UNITS[e[2]]};
    return null;
}

/** With the shard text: a census row whose literal name is not at its cited paragraph (or the next two) moves its
 *  firstMention to the first paragraph that prints that name. A name printed nowhere in the shard is left for review. */
export function relocateFirstMention(c, shardMap, review) {
    const m = parseLocator(c.firstMention), lang = shardMap?.lang || 'zh';
    if (!c.zh || !shardMap) return c;
    if (m && [0, 1, 2].some(d => nameIn(shardMap.get(`${m.ch}:${m.p + d}`) || '', c.zh, lang))) return c;
    for (const [key, text] of shardMap) if (nameIn(text, c.zh, lang)) {
        const [ch, p] = key.split(':');
        return {...c, firstMention: formatLocator(lang, {book: shardMap.book || 1, ch, p}), note: c.note};
    }
    review.push({id: c.id, need: 'name-not-in-shard'});
    return c;
}

export function migrateFill(r) {
    const f = structuredClone(r);
    f.schema = 'fill/1.3';
    f.layer ??= 'period';
    f.replaceableBy = 'later reading';
    return f;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [dir, prefix, shardPath] = process.argv.slice(2);
    if (!dir || !prefix) { console.error('usage: migrate_shard.mjs <dir> <prefix> [shard.txt]'); process.exit(2); }
    const shardMap = shardPath ? parseShard(readFileSync(shardPath, 'utf8')) : null;
    const read = n => existsSync(join(dir, n)) ? readFileSync(join(dir, n), 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
    const write = (n, rows) => writeFileSync(join(dir, n), rows.map(r => JSON.stringify(r)).join('\n') + '\n');
    const review = [];
    const scenes = read(`${prefix}_scenes.jsonl`), beats = new Set(scenes.map(r => r.beat));
    write(`${prefix}_m13_scenes.jsonl`, scenes.map(r => migrateScene(r, review, beats)));
    write(`${prefix}_m13_census.jsonl`, read(`${prefix}_census.jsonl`).map(migrateCensus).map(c => relocateFirstMention(c, shardMap, review)));
    // A fill with no basis cannot be checked against the text; it goes to review instead of the shard (nothing invented).
    const fills = read(`${prefix}_fills.jsonl`).map(migrateFill);
    for (const f of fills) if (!Array.isArray(f.basis) || !f.basis.length) review.push({fill: f.id, need: 'fill-without-basis'});
    write(`${prefix}_m13_fills.jsonl`, fills.filter(f => Array.isArray(f.basis) && f.basis.length));
    writeFileSync(join(dir, `${prefix}_m13_review.json`), JSON.stringify(review, null, 1) + '\n');
    console.log(JSON.stringify({prefix, review: review.length, byNeed: review.reduce((a, r) => (a[r.need] = (a[r.need] || 0) + 1, a), {})}));
}
