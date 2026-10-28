// Lead-run table, census, loop, fill and shard-header lint, schemas 1.1-1.3 (protagonist-life plan, SF1-SF10,
// WA22-WA41; 1.2 adds action classes and loops, 1.3 adds the motive vocabulary, fills, pov and the shard header).
// Pure checks over parsed rows; the CLI reads JSONL files and an optional private shard
// (`=== <chapter title> | member <path>` headers, `pN: text` lines) to verify locators.
// Output is issue codes and counts only, never source text.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

export const KINDS = Object.freeze(['person', 'place', 'organization', 'deity', 'item', 'price', 'law', 'calendar',
    'clock', 'event', 'language', 'measure', 'document', 'note', 'creature']);
// Shared engine verb classes (WA5); a world supplies the nouns, costs and requirements.
export const ACTION_CLASSES = Object.freeze(['study', 'practice', 'research', 'craft', 'trade', 'work', 'travel', 'fight',
    'socialize', 'rest', 'care', 'appraise', 'ritual', 'other']);
const RHYTHMS = new Set(['schedule', 'deadline', 'opportunity']);
const SCENE_SCHEMAS = new Set(['lead-run/1.1', 'lead-run/1.2', 'lead-run/1.3']), CENSUS_SCHEMAS = new Set(['census/1.1', 'census/1.2', 'census/1.3']);
// Shared motive vocabulary (PL-L37, WA45). A new tag needs a reason in the schema changelog.
export const MOTIVES = Object.freeze(['hunger', 'fatigue', 'safety', 'fear', 'curiosity', 'thrift', 'income', 'family-duty',
    'loyalty', 'ambition', 'pride', 'secrecy', 'caution', 'guilt', 'grief', 'faith', 'justice', 'comfort', 'belonging', 'revenge']);
const FILL_LAYERS = new Set(['implied', 'period', 'invented']);
const AT_LEAST_13 = r => r.schema === 'lead-run/1.3';
const LABELS = new Set(['S', 'I', 'U']);
const RUNGS = new Set(['M0', 'M1', 'M2', 'M3', 'M4']);
const NAME_SOURCES = new Set(['repo', 'wiki', 'pinyin-unconfirmed']);
const PLACE_STATUS = new Set(['stated', 'claimed', 'inferred']);
const TOUCH_STATUS = new Set(['present', 'partial', 'missing']);
const CLASSES = new Set(['carried', 'changed', 'blocked']);
const LOCATOR = /^zh 第(\d+)章 p(\d+)$/;
const EVIDENCE_KIND = /^(shown|narration|inferred|thought:[\w.-]+|dialogue:[\w.-]+|dream:[\w.-]+)$/;
const CJK_RUN = /[㐀-鿿]{6,}/;   // quote guard: more than five source characters outside `zh`
const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;

/** Parse a shard into Map("ch:p" -> paragraph text). Chapter numbers come from 第N章 in each header. */
export function parseShard(text) {
    const map = new Map();
    let ch = null;
    for (const line of text.split('\n')) {
        const h = line.match(/^=== .*?第(\d+)章/);
        if (h) { ch = Number(h[1]); continue; }
        const p = line.match(/^p(\d+): (.*)$/);
        if (p && ch !== null) map.set(`${ch}:${p[1]}`, p[2]);
    }
    return map;
}

function locatorIssues(where, loc, out) {
    if (!LOCATOR.test(loc || '')) out.push({code: 'locator-format', where});
}

function quoteGuard(where, row, skip, out) {
    for (const [k, v] of Object.entries(row)) {
        if (skip.has(k)) continue;
        if (CJK_RUN.test(JSON.stringify(v))) out.push({code: 'quote-guard', where, field: k});
    }
}

export function lintScenes(scenes) {
    const out = [], ids = new Map();
    scenes.forEach((r, i) => {
        const w = r.beat || `row ${i + 1}`;
        if (!SCENE_SCHEMAS.has(r.schema)) out.push({code: 'schema', where: w});
        if (!/^lr\.[a-z0-9]+\.[a-z0-9]+\.\d{3,}$/.test(r.beat || '')) out.push({code: 'beat-id', where: w});
        if (ids.has(r.beat)) out.push({code: 'duplicate', where: w});
        if (!Number.isInteger(r.order)) out.push({code: 'order', where: w});
        ids.set(r.beat, r.order);
        const d = r.date || {};
        if (!LABELS.has(d.label)) out.push({code: 'date-label', where: w});
        const relative = typeof d.anchor === 'string' && Number.isInteger(d.offsetDays);
        if (!(relative || d.value === 'date-unsettled' || (typeof d.value === 'string' && d.value))) out.push({code: 'date', where: w});
        if (!r.place) out.push({code: 'place', where: w});
        if (!['great', 'routine'].includes(r.weight)) out.push({code: 'weight', where: w});
        if (r.weight === 'great' && !r.footprint) out.push({code: 'great-needs-footprint', where: w});
        if (r.footprint && !(Array.isArray(r.footprint.places) && Array.isArray(r.footprint.hazards) && Array.isArray(r.footprint.roles)
            && r.footprint.window && typeof r.footprint.window === 'object')) out.push({code: 'footprint-shape', where: w});
        for (const c of r.choices || []) locatorIssues(w, c.locator, out);
        if (!Array.isArray(r.steps) || !r.steps.every(s => s && typeof s.verb === 'string')) out.push({code: 'steps', where: w});
        if (r.schema === 'lead-run/1.2') for (const st of r.steps || []) {
            if (!ACTION_CLASSES.includes(st.class)) out.push({code: 'action-class', where: w});
            if (!LABELS.has(st.label)) out.push({code: 'action-label', where: w});
            if (st.time && !(Number.isFinite(st.time.minutes) || typeof st.time.band === 'string')) out.push({code: 'action-time', where: w});
        }
        for (const o of r.options || []) if (o.class !== undefined && !ACTION_CLASSES.includes(o.class)) out.push({code: 'option-class', where: w});
        if (AT_LEAST_13(r)) {
            for (const st of r.steps || []) if (!ACTION_CLASSES.includes(st.class)) out.push({code: 'action-class', where: w});
            for (const m of r.motives || []) if (!MOTIVES.includes(m.tag)) out.push({code: 'motive-tag', where: w, tag: m.tag});
            for (const c of r.choices || []) if (!LABELS.has(c.label)) out.push({code: 'choice-label', where: w});
            if (typeof r.pov !== 'string' || !r.pov) out.push({code: 'pov', where: w});
        }
        for (const t of r.touched || []) {
            if (!KINDS.includes(t.kind)) out.push({code: 'touched-kind', where: w, kind: t.kind});
            if (!TOUCH_STATUS.has(t.status)) out.push({code: 'touched-status', where: w});
        }
        for (const o of r.outcomes || []) if (!CLASSES.has(o.class)) out.push({code: 'outcome-class', where: w});
        for (const a of r.anchors || []) {
            if (!a.fact || !Number.isFinite(a.value) || !a.unit || !['lead', 'household'].includes(a.scope)) out.push({code: 'anchor', where: w});
            locatorIssues(w, a.locator, out);
        }
        for (const k of r.knowledge || []) locatorIssues(w, k.locator, out);
        if (!Array.isArray(r.evidence) || !r.evidence.length) out.push({code: 'evidence-missing', where: w});
        for (const e of r.evidence || []) {
            if (!LABELS.has(e.label)) out.push({code: 'evidence-label', where: w});
            if (!EVIDENCE_KIND.test(e.kind || '')) out.push({code: 'evidence-kind', where: w});
            if (e.label === 'S') locatorIssues(w, e.locator, out);
        }
        quoteGuard(w, r, new Set(), out);
    });
    scenes.forEach(r => {
        const w = r.beat;
        if (r.date?.anchor && !ids.has(r.date.anchor)) out.push({code: 'date-anchor', where: w});
        for (const dep of r.deps || []) {
            if (!ids.has(dep.id)) out.push({code: 'dep-missing', where: w});
            else if (ids.get(dep.id) > r.order) out.push({code: 'dep-order', where: w});
            if (!['after', 'needs'].includes(dep.kind)) out.push({code: 'dep-kind', where: w});
        }
        if (r.continues && !ids.has(r.continues)) out.push({code: 'continues', where: w});
    });
    return out;
}

export function lintCensus(rows, shard = null) {
    const out = [], seen = new Set();
    for (const [i, r] of rows.entries()) {
        const w = r.id || `row ${i + 1}`;
        if (!CENSUS_SCHEMAS.has(r.schema)) out.push({code: 'schema', where: w});
        if (seen.has(r.id)) out.push({code: 'duplicate', where: w});
        seen.add(r.id);
        if (!KINDS.includes(r.kind)) out.push({code: 'kind', where: w, kind: r.kind});
        if (!new RegExp(`^[a-z0-9]+\\.${r.kind}\\.`).test(r.id || '')) out.push({code: 'id-namespace', where: w});
        if (!RUNGS.has(r.rung)) out.push({code: 'rung', where: w});
        if (!NAME_SOURCES.has(r.nameSource)) out.push({code: 'name-source', where: w});
        const where = Array.isArray(r.whereabouts) ? r.whereabouts : [];   // a non-array is reported, never crashes the lint
        if (!Array.isArray(r.whereabouts)) out.push({code: 'whereabouts', where: w});
        for (const p of where) if (!PLACE_STATUS.has(p?.status)) out.push({code: 'whereabouts-status', where: w});
        if (r.rung !== 'M0' && !where.some(p => p?.place || p?.era)) out.push({code: 'placed-without-address', where: w});
        if (r.kind === 'price' && !(r.amount && Number.isFinite(r.amount.value) && r.amount.unit)) out.push({code: 'price-amount', where: w});
        if (r.note && words(r.note) > 15) out.push({code: 'note-length', where: w});
        locatorIssues(w, r.firstMention, out);
        const m = (r.firstMention || '').match(LOCATOR);
        if (shard && m && r.zh) {
            const c = Number(m[1]), p = Number(m[2]);
            const hit = [p, p + 1, p + 2].some(q => (shard.get(`${c}:${q}`) || '').includes(r.zh));
            if (!hit) out.push({code: shard.has(`${c}:${p}`) ? 'zh-not-at-locator' : 'locator-outside-shard', where: w});
        }
        quoteGuard(w, r, new Set(['zh', 'aliases']), out);
    }
    return out;
}

/** Loop records (`loop/1.2`): what the lead repeats, how often, what it pays, and which engine owner runs it. */
export function lintLoops(loops) {
    const out = [], seen = new Set();
    for (const [i, r] of loops.entries()) {
        const w = r.id || `row ${i + 1}`;
        if (r.schema !== 'loop/1.2') out.push({code: 'schema', where: w});
        if (seen.has(r.id)) out.push({code: 'duplicate', where: w});
        seen.add(r.id);
        if (!/^[a-z0-9]+\.loop\./.test(r.id || '')) out.push({code: 'id-namespace', where: w});
        if (!r.trigger) out.push({code: 'trigger', where: w});
        if (!Array.isArray(r.steps) || !r.steps.length || !r.steps.every(c => ACTION_CLASSES.includes(c))) out.push({code: 'loop-steps', where: w});
        if (!Array.isArray(r.rewards) || !r.rewards.length) out.push({code: 'rewards', where: w});
        if (!RHYTHMS.has(r.rhythm)) out.push({code: 'rhythm', where: w});
        if (typeof r.owner !== 'string' || !r.owner) out.push({code: 'owner', where: w});
        if (!Array.isArray(r.evidence) || !r.evidence.length) out.push({code: 'evidence-missing', where: w});
        for (const e of r.evidence || []) if (!LABELS.has(e.label)) out.push({code: 'evidence-label', where: w});
        quoteGuard(w, r, new Set(), out);
    }
    return out;
}

/** Fill rows (`fill/1.3`): unstated blanks with their layer, basis and what they must respect (WA38). */
export function lintFills(fills) {
    const out = [], seen = new Set();
    for (const [i, r] of fills.entries()) {
        const w = r.id || `row ${i + 1}`;
        if (!['fill/1.1', 'fill/1.3'].includes(r.schema)) out.push({code: 'schema', where: w});
        if (seen.has(r.id)) out.push({code: 'duplicate', where: w});
        seen.add(r.id);
        if (!/^[a-z0-9]+\.fill\./.test(r.id || '')) out.push({code: 'id-namespace', where: w});
        if (!['authored-proposal', 'generator-spec'].includes(r.status)) out.push({code: 'fill-status', where: w});
        if (!Array.isArray(r.basis) || !r.basis.length) out.push({code: 'fill-basis', where: w});
        if (r.schema === 'fill/1.3') {
            if (!FILL_LAYERS.has(r.layer)) out.push({code: 'fill-layer', where: w});
            if (r.replaceableBy !== 'later reading') out.push({code: 'fill-replaceable', where: w});
        }
        quoteGuard(w, r, new Set(), out);
    }
    return out;
}

/** Shard header (`shard-header/1.3`, WA31): what produced the files and how far to trust them. */
export function lintHeader(h) {
    const out = [], need = ['shard', 'schema', 'readerModel', 'sourceHash', 'date', 'chapters', 'lint', 'grade'];
    if (!h || h.schema !== 'shard-header/1.3') out.push({code: 'header-schema', where: 'header'});
    for (const k of need) if (h?.[k] === undefined) out.push({code: 'header-field', where: 'header', field: k});
    if (h && !['A', 'B', 'C'].includes(h.grade)) out.push({code: 'header-grade', where: 'header'});
    return out;
}

export function summarize(issues) {
    const counts = {};
    for (const i of issues) counts[i.code] = (counts[i.code] || 0) + 1;
    return counts;
}

const jsonl = path => readFileSync(path, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2), li = args.indexOf('--loops');
    const loopsPath = li >= 0 ? args.splice(li, 2)[1] : null;
    const [scenesPath, censusPath, shardPath] = args;
    if (!scenesPath || !censusPath) {
        console.error('usage: node scripts/lead_run/lint_lead_run.mjs <scenes.jsonl> <census.jsonl> [shard.txt] [--loops loops.jsonl]');
        process.exit(2);
    }
    const shard = shardPath ? parseShard(readFileSync(shardPath, 'utf8')) : null;
    const scenes = jsonl(scenesPath), census = jsonl(censusPath);
    const a = lintScenes(scenes), b = lintCensus(census, shard), c = loopsPath ? lintLoops(jsonl(loopsPath)) : [];
    console.log(JSON.stringify({scenes: scenes.length, census: census.length,
        sceneIssues: summarize(a), censusIssues: summarize(b), loopIssues: summarize(c), ok: !a.length && !b.length && !c.length,
        // Row ids per code (ids and codes only, never source text) so a single fix pass can target the rows.
        rows: [...a, ...b, ...c].slice(0, 60).map(i => `${i.code}:${i.where}${i.field ? '.' + i.field : ''}`)}, null, 1));
    process.exit(a.length || b.length || c.length ? 1 : 0);
}
