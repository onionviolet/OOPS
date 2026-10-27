// Mechanical migration of shard files to schema 1.3 where a script can derive the change (LEAD_RUN_SCHEMA,
// "Schema 1.3 and the change rule"): schema tags, the organization id namespace, prose moved out of label fields,
// `pov` defaulting to the lead, and motive tags mapped onto the vocabulary. Steps without an action class and
// motives with no mapping are listed for a cheap review pass; nothing is invented. Writes `<prefix>_m13_*.jsonl`
// beside the originals. Usage: node scripts/lead_run/migrate_shard.mjs <dir> <prefix>
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {MOTIVES} from './lint_lead_run.mjs';

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
    const [dir, prefix] = process.argv.slice(2);
    if (!dir || !prefix) { console.error('usage: migrate_shard.mjs <dir> <prefix>'); process.exit(2); }
    const read = n => existsSync(join(dir, n)) ? readFileSync(join(dir, n), 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
    const write = (n, rows) => writeFileSync(join(dir, n), rows.map(r => JSON.stringify(r)).join('\n') + '\n');
    const review = [];
    const scenes = read(`${prefix}_scenes.jsonl`), beats = new Set(scenes.map(r => r.beat));
    write(`${prefix}_m13_scenes.jsonl`, scenes.map(r => migrateScene(r, review, beats)));
    write(`${prefix}_m13_census.jsonl`, read(`${prefix}_census.jsonl`).map(migrateCensus));
    write(`${prefix}_m13_fills.jsonl`, read(`${prefix}_fills.jsonl`).map(migrateFill));
    writeFileSync(join(dir, `${prefix}_m13_review.json`), JSON.stringify(review, null, 1) + '\n');
    console.log(JSON.stringify({prefix, review: review.length, byNeed: review.reduce((a, r) => (a[r.need] = (a[r.need] || 0) + 1, a), {})}));
}
