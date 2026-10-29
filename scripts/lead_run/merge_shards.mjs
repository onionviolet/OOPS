// Cross-shard merge for the lead run (READINESS_AND_SCOPE C5, F1, F3, F7, R2). Free: reads shard files, calls no API.
//   node scripts/lead_run/merge_shards.mjs <privateDir> [--out <dir>] [--match <prefix regex>] [--overlay overlay.json]
// Reads <prefix>m_header.json/_census/_scenes/_fills. Default: agent-read shards only. --match selects headers by prefix instead (batch route included), e.g.
// '^(s|w[0-9]s[0-9]+m$|b[4-7]s)' for agent shards plus the volume 1 batch waves, leaving the w3s33 A/B variants out.
// Extra passes (rules, people, places, services, news, customs) load from <raw prefix>_<kind>.jsonl, raw = header prefix without the trailing m.
// Writes registry.jsonl, scenes.jsonl, fills.jsonl, extras.jsonl, affordance.json, overlay_proposed.json and merge_report.json (counts and ids only).
// Never edits shard files. Corrections live in the overlay: {redirect: {fromId: toId}, labels: {id: label}, kinds: {id: kind}} (L4).
// The proposed overlay folds ids that share one Chinese name; it is applied only when passed back with --overlay (one id per entity holds after that).
import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {RELATIONAL, CONTEXTUAL} from './shard_tools.mjs';
import {parseLocator, EN_RELATIONAL} from './world_profiles.mjs';

const readJsonl = p => existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
const writeJsonl = (p, rows) => writeFileSync(p, rows.map(r => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''));
const count = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);
const top = m => [...m].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0];
const RUNG = {M0: 0, M1: 1, M2: 2, M3: 3};
const ID_LIKE = /^[a-z]+(\.[a-z0-9-]+){2,}$/;
// Titles and kin words name a role, not one person: never an alias (shard_tools RELATIONAL plus police titles seen in volume 1).
const ROLE_WORDS = new Set([...RELATIONAL, ...EN_RELATIONAL, '警官', '督察', '警察']);
const roleWord = a => ROLE_WORDS.has(String(a).replace(/\s*\([^)]*\)\s*$/, '').trim());
const PROPER_KINDS = new Set(['person', 'place', 'organization', 'deity']);
export const EXTRA_KINDS = ['rules', 'people', 'places', 'services', 'news', 'customs', 'rules_other', 'people_other', 'texture_other'];
const ABSOLUTE_DATE = /^(\d{4})(?:-(\d\d))?(?:-(\d\d))?$/;

/** Order key for locators `zh 第N章 pM` (or `B1:PDF-pN` style falls back to string order). */
export function locatorKey(loc) {
    const m = parseLocator(loc);
    return m ? m.book * 1e8 + m.ch * 10000 + m.p : Infinity;
}

export const compareLocators = (left, right) => {
    const a = parseLocator(left), b = parseLocator(right);
    if (!a || !b) return a ? -1 : b ? 1 : String(left || '').localeCompare(String(right || ''));
    return a.book - b.book || a.ch - b.ch || a.p - b.p;
};
const firstShardLocator = shard => {
    const locators = [
        ...shard.census.map(row => row.firstMention),
        ...shard.scenes.flatMap(row => (row.evidence || []).map(item => item.locator)),
    ].filter(Boolean);
    return locators.sort(compareLocators)[0] || null;
};

/** "Benson, Klein's older brother" and "Tingen (city)" are descriptions of one label: keep the name part. */
export function cleanLabel(label) {
    return String(label || '').replace(/\s*\([^)]*\)\s*$/, '').split(',')[0].trim();
}

/** Shards in a private dir: header + rows. Batch-route variants (A/B experiments, pilots) are excluded unless asked for. */
export function loadShards(dir, {includeBatch = false, match = null} = {}) {
    const out = [];
    for (const f of readdirSync(dir).filter(f => /m_header\.json$/.test(f)).sort()) {
        const header = JSON.parse(readFileSync(join(dir, f), 'utf8')), prefix = f.replace('_header.json', '');
        if (match ? !match.test(prefix) : header.route === 'batch' && !includeBatch) continue;
        const raw = prefix.replace(/m$/, ''), extras = Object.fromEntries(EXTRA_KINDS.map(k => [k, readJsonl(join(dir, `${raw}_${k}.jsonl`))]));
        out.push({prefix, header, census: readJsonl(join(dir, `${prefix}_census.jsonl`)), scenes: readJsonl(join(dir, `${prefix}_scenes.jsonl`)), fills: readJsonl(join(dir, `${prefix}_fills.jsonl`)),
            ...extras});
    }
    // Locator order carries the volume. Chapter numbers restart in each volume,
    // so header chapter ranges alone interleave whole-book batches incorrectly.
    return out.sort((a, b) => compareLocators(firstShardLocator(a), firstShardLocator(b)) || a.prefix.localeCompare(b.prefix));
}

/** Redirect map from the reviewed overlay only. Chains are followed; cycles stop. People-pass `reveals` (same_as) rows are proposals: some joined
 *  two different people (cast-lives CL102, 2026-10-28), so they go to `overlay_proposed.json` for review and fold only once the overlay carries them. */
export function buildRedirect(shards, overlay = {}) {
    const red = new Map(Object.entries(overlay.redirect || {}));
    const reveals = [], seen = new Set();
    for (const s of shards) for (const p of s.people || []) for (const r of p.reveals || []) {
        const key = `${p.id}>${r.same_as}`;
        if (r.same_as && p.id && r.same_as !== p.id && !red.has(p.id) && !seen.has(key)) { seen.add(key); reveals.push({from: p.id, to: r.same_as, label: r.label, locator: r.locator}); }
    }
    const resolve = id => { const seen = new Set(); while (red.has(id) && !seen.has(id)) { seen.add(id); id = red.get(id); } return id; };
    return {red, resolve, reveals};
}

/** One registry: one row per id, one label, union of aliases, earliest mention, best rung, kind by majority (conflicts reported). */
/** Fallback display name when every row held only an evidence label: the printed name for English sources, else a title from the id slug. */
const slugLabel = e => { const zh = top(e.zh) || ''; return /^[\x20-\x7e]+$/.test(zh) ? zh : e.id.split('.').pop().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); };

export function buildRegistry(shards, resolve, overlay = {}) {
    const by = new Map(), kindConflicts = [], zhCollisions = new Map();
    for (const s of shards) for (const r of s.census) {
        const id = resolve(r.id);
        if (!by.has(id)) by.set(id, {id, labels: new Map(), glossLabels: new Map(), zh: new Map(), kinds: new Map(), aliases: new Set(), rows: 0, shards: new Set(), firstMention: null, rung: 'M0', touchedByLead: false, nameSource: new Map(), notes: []});
        const e = by.get(id);
        e.rows++; e.shards.add(s.prefix);
        const lab = cleanLabel(r.label);
        // A label derived by migrate from the id or printed name only fills in when no reader gave a real one.
        // Rows read before the 2026-10-28 migrate fix still hold an evidence label (S, I, U, T) in `label`: treat it as no label.
        const evidenceOnly = ['S', 'I', 'U', 'T'].includes(lab);
        if (lab && !evidenceOnly) count(r.labelFrom ? (e.derivedLabels ??= new Map()) : e.labels, lab);
        // A label from the wiki or repo glossary is the canonical spelling when one exists (F7).
        if (lab && !evidenceOnly && !r.labelFrom && (r.nameSource === 'wiki' || r.nameSource === 'repo')) count(e.glossLabels, lab);
        if (r.label && r.label !== lab) e.aliases.add(r.label);
        if (r.zh) { count(e.zh, r.zh); if (r.id !== id) e.aliases.add(r.zh); }
        count(e.kinds, r.kind); count(e.nameSource, r.nameSource);
        for (const a of r.aliases || []) if (!roleWord(a)) e.aliases.add(a);
        if (r.id !== id && r.label && !evidenceOnly) e.aliases.add(r.label);
        if (!e.firstMention || locatorKey(r.firstMention) < locatorKey(e.firstMention)) e.firstMention = r.firstMention;
        if ((RUNG[r.rung] || 0) > (RUNG[e.rung] || 0)) e.rung = r.rung;
        e.touchedByLead ||= !!r.touchedByLead;
    }
    const registry = [];
    for (const e of by.values()) {
        const label = overlay.labels?.[e.id] || top(e.glossLabels.size ? e.glossLabels : e.labels.size ? e.labels : e.derivedLabels || e.labels) || slugLabel(e);
        const zh = top(e.zh), kind = overlay.kinds?.[e.id] || top(e.kinds);
        if (e.kinds.size > 1) kindConflicts.push({id: e.id, kinds: Object.fromEntries(e.kinds)});
        if (zh && !CONTEXTUAL.has(kind) && !roleWord(zh)) { if (!zhCollisions.has(zh)) zhCollisions.set(zh, []); zhCollisions.get(zh).push({id: e.id, kind, rows: e.rows, first: locatorKey(e.firstMention), glossary: e.nameSource.has('wiki') || e.nameSource.has('repo')}); }
        for (const l of e.labels.keys()) if (l !== label) e.aliases.add(l);
        e.aliases.delete(label); e.aliases.delete(zh);
        registry.push({schema: 'registry/1.0', id: e.id, label, zh, kind, rung: e.rung, nameSource: top(e.nameSource), firstMention: e.firstMention, touchedByLead: e.touchedByLead,
            aliases: [...e.aliases].sort(), rows: e.rows, shards: [...e.shards], whereabouts: [], claimants: {}});
    }
    const idCollisions = [...zhCollisions].filter(([, ids]) => ids.length > 1).map(([zh, ids]) => ({ids, proper: zh.length >= 3 || zh.includes('·')}));
    return {registry, kindConflicts, idCollisions};
}

/**
 * Proposed overlay from ids that share one Chinese name. Auto: same proper kind (person, place, organization, deity) and a proper name (3+ characters or a middle dot); a glossary-backed id wins, then more rows,
 * then the earlier mention. Everything else is listed for review. Proposed only: applied when passed back as --overlay.
 */
export function proposeOverlay(idCollisions) {
    const redirect = {}, review = [];
    for (const c of idCollisions) {
        const kinds = new Set(c.ids.map(x => x.kind));
        // Common nouns (items, notes) under one word may still be different things: review, not auto.
        if (!c.proper || kinds.size > 1 || !PROPER_KINDS.has(c.ids[0].kind)) { review.push(c.ids.map(x => x.id)); continue; }
        // A glossary-backed id (wiki or repo name) wins over a reader-minted spelling; then more rows, then the earlier mention.
        const [keep, ...rest] = [...c.ids].sort((a, b) => (b.glossary ? 1 : 0) - (a.glossary ? 1 : 0) || b.rows - a.rows || a.first - b.first);
        for (const r of rest) redirect[r.id] = keep.id;
    }
    return {redirect, review};
}

/** Extra-pass rows with ids redirected (every id-like string value), tagged with their kind and shard. */
export function collectExtras(shards, resolve) {
    const fix = v => typeof v === 'string' ? (ID_LIKE.test(v) ? resolve(v) : v) : Array.isArray(v) ? v.map(fix) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)])) : v;
    return shards.flatMap(s => EXTRA_KINDS.flatMap(k => (s[k] || []).map(r => ({...fix(r), extra: k, shard: s.prefix}))));
}

/** Scenes with ids redirected; own-id uniqueness is checked (a duplicate beat keeps the first). */
export function collectScenes(shards, resolve) {
    const seen = new Set(), scenes = [], dupBeats = [];
    const fixId = id => typeof id === 'string' && ID_LIKE.test(id) ? resolve(id) : id;
    for (const s of shards) for (const sc of s.scenes) {
        if (seen.has(sc.beat)) { dupBeats.push(sc.beat); continue; }
        seen.add(sc.beat);
        const c = structuredClone(sc);
        c.place = fixId(c.place);
        c.present = (c.present || []).map(fixId);
        for (const t of c.touched || []) t.id = fixId(t.id);
        for (const o of c.options || []) o.needs = (o.needs || []).map(fixId);
        for (const k of c.knowledge || []) k.from = fixId(k.from);
        if (c.footprint?.places) c.footprint.places = c.footprint.places.map(fixId);
        c.pov = fixId(c.pov);
        c.shard = s.prefix;
        scenes.push(c);
    }
    return {scenes, dupBeats};
}

/** Dates: follow anchor/offset chains to a root beat. A root with a stated year-month(-day) gives an absolute date at that precision. */
export function resolveTimeline(scenes) {
    const byBeat = new Map(scenes.map(s => [s.beat, s])), memo = new Map();
    const walk = (s, seen = new Set()) => {
        if (memo.has(s.beat)) return memo.get(s.beat);
        const d = s.date || {};
        let out;
        const abs = ABSOLUTE_DATE.exec(String(d.value || ''));
        if (abs) out = {root: s.beat, offsetDays: 0, absolute: d.value, precision: abs[3] ? 'day' : abs[2] ? 'month' : 'year'};
        else if (d.anchor && byBeat.has(d.anchor) && !seen.has(d.anchor)) {
            const p = walk(byBeat.get(d.anchor), new Set([...seen, s.beat]));
            out = d.offsetDays == null ? {root: p.root, offsetDays: p.offsetDays, absolute: p.absolute, precision: p.precision, approx: true}
                : {root: p.root, offsetDays: p.offsetDays + d.offsetDays, absolute: p.absolute, precision: p.precision};
        } else out = {root: s.beat, offsetDays: 0, absolute: null, precision: 'relative'};
        memo.set(s.beat, out);
        return out;
    };
    for (const s of scenes) s.dateRef = walk(s);
    const rooted = scenes.filter(s => s.dateRef.root !== s.beat).length, absolute = scenes.filter(s => s.dateRef.absolute).length;
    const deps = scenes.flatMap(s => s.deps || []), depsResolved = deps.filter(d => byBeat.has(d.id)).length;
    return {scenes: scenes.length, chained: rooted, withAbsoluteRoot: absolute, deps: deps.length, depsResolved, rootCount: new Set(scenes.map(s => s.dateRef.root)).size};
}

/** Claimants, lead touch and whereabouts from scenes (no model). */
export function enrichFromScenes(registry, scenes) {
    const reg = new Map(registry.map(r => [r.id, r]));
    for (const sc of scenes) {
        const ids = new Set([...(sc.present || []), ...(sc.touched || []).map(t => t.id), sc.place].filter(id => reg.has(id)));
        const loc = sc.evidence?.[0]?.locator || null;
        for (const id of ids) {
            const r = reg.get(id);
            if (sc.pov === 'lead') r.touchedByLead = true;
            for (const ev of sc.evidence || []) count(r.claimantsMap ||= new Map(), ev.kind);
            if (id !== sc.place && (sc.present || []).includes(id) && sc.place) {
                r.whereabouts.push({place: sc.place, beat: sc.beat, timeOfDay: sc.timeOfDay?.value ?? null, date: sc.dateRef?.absolute ? {absolute: sc.dateRef.absolute, offsetDays: sc.dateRef.offsetDays, precision: sc.dateRef.precision} : {root: sc.dateRef?.root, offsetDays: sc.dateRef?.offsetDays}, locator: loc});
            }
        }
    }
    for (const r of registry) { r.claimants = Object.fromEntries(r.claimantsMap || []); delete r.claimantsMap; }
}

/** Place x action class from steps and options (F1). `cells[place][class] = {steps, options, beats[]}`. */
export function affordanceMatrix(scenes, registry, extras = []) {
    const places = new Set(registry.filter(r => r.kind === 'place').map(r => r.id)), cells = {}, classes = new Set();
    for (const sc of scenes) {
        if (!sc.place || !places.has(sc.place)) continue;
        const add = (cls, kind) => {
            if (!cls) return;
            classes.add(cls);
            const c = ((cells[sc.place] ||= {})[cls] ||= {steps: 0, options: 0, beats: []});
            c[kind]++;
            if (!c.beats.includes(sc.beat)) c.beats.push(sc.beat);
        };
        for (const st of sc.steps || []) add(st.class, 'steps');
        for (const o of sc.options || []) add(o.class, 'options');
    }
    // Texture rows (pass 5) state what a place affords even where no scene happens there.
    for (const p of extras.filter(x => x.extra === 'places' && places.has(x.id))) for (const a of p.affordances || []) {
        if (!a.class) continue;
        classes.add(a.class);
        const c = ((cells[p.id] ||= {})[a.class] ||= {steps: 0, options: 0, beats: []});
        c.texture = (c.texture || 0) + 1;
    }
    const cls = [...classes].sort();
    const withScenes = Object.keys(cells);
    return {classes: cls, places: withScenes.length, filledCells: withScenes.reduce((n, p) => n + Object.keys(cells[p]).length, 0), possibleCells: withScenes.length * cls.length, cells};
}

/** Share of id-like references in scenes that resolve to a registry row (or a known extra id such as a glossary id). R2. */
export function resolveRate(scenes, knownIds, extraIds = new Set()) {
    const ok = id => knownIds.has(id) || extraIds.has(id);
    const tally = () => ({refs: 0, resolved: 0}), all = tally(), needs = tally(), perShard = {}, missing = new Map();
    const hit = (t, id, shard) => {
        if (typeof id !== 'string' || !ID_LIKE.test(id)) return;
        t.refs++; all.refs++; const s = perShard[shard] ||= tally(); s.refs++;
        if (ok(id)) { t.resolved++; all.resolved++; s.resolved++; } else count(missing, id);
    };
    const any = tally();
    for (const sc of scenes) {
        hit(any, sc.place, sc.shard);
        for (const id of sc.present || []) hit(any, id, sc.shard);
        for (const t of sc.touched || []) hit(any, t.id, sc.shard);
        for (const o of sc.options || []) for (const id of o.needs || []) hit(needs, id, sc.shard);
        for (const id of sc.footprint?.places || []) hit(any, id, sc.shard);
    }
    const rate = t => t.refs ? Number((t.resolved / t.refs).toFixed(3)) : null;
    return {overall: rate(all), references: all.refs, needs: {...needs, rate: rate(needs)}, perShard: Object.fromEntries(Object.entries(perShard).map(([k, v]) => [k, rate(v)])),
        lowShards: Object.entries(perShard).filter(([, v]) => v.refs && v.resolved / v.refs < 0.7).map(([k]) => k), unresolvedTop: [...missing].sort((a, b) => b[1] - a[1]).slice(0, 15)};
}

export function mergeAll(dir, {includeBatch = false, match = null, overlay = {}} = {}) {
    const shards = loadShards(dir, {includeBatch, match}), {red, resolve, reveals} = buildRedirect(shards, overlay);
    const {registry, kindConflicts, idCollisions} = buildRegistry(shards, resolve, overlay);
    const {scenes, dupBeats} = collectScenes(shards, resolve);
    const timeline = resolveTimeline(scenes);
    enrichFromScenes(registry, scenes);
    const extras = collectExtras(shards, resolve);
    const affordance = affordanceMatrix(scenes, registry, extras);
    const proposed = {...proposeOverlay(idCollisions), reveals};
    const ids = new Set(registry.map(r => r.id)), beats = new Set(scenes.map(s => s.beat));
    const fillIds = new Set(shards.flatMap(s => s.fills.map(f => f.id)));
    const resolveR = resolveRate(scenes, new Set([...ids, ...beats, ...fillIds]));
    const fills = shards.flatMap(s => s.fills.map(f => ({...f, shard: s.prefix})));
    const report = {shards: shards.length, censusRowsIn: shards.reduce((n, s) => n + s.census.length, 0), registry: registry.length, redirected: red.size, kindConflicts: kindConflicts.length,
        idCollisionsByZh: idCollisions.length, proposedRedirects: Object.keys(proposed.redirect).length, collisionsForReview: proposed.review.length, revealsForReview: reveals.length,
        extras: Object.fromEntries(EXTRA_KINDS.map(k => [k, extras.filter(x => x.extra === k).length])), scenes: scenes.length, duplicateBeats: dupBeats.length, fills: fills.length, timeline, affordance: {classes: affordance.classes, places: affordance.places, filledCells: affordance.filledCells, possibleCells: affordance.possibleCells},
        resolve: resolveR, leadTouched: registry.filter(r => r.touchedByLead).length, withWhereabouts: registry.filter(r => r.whereabouts.length).length, multiClaimant: registry.filter(r => Object.keys(r.claimants).length > 1).length,
        labelsWithAliases: registry.filter(r => r.aliases.length).length, kindConflictIds: kindConflicts.slice(0, 20).map(k => k.id)};
    report.notes = ['resolve rate is a defect detector, not a quality score: scenes cite ids the same reader minted, so it is near 1 by construction',
        'one id per entity holds only after the proposed overlay is reviewed and applied with --overlay'];
    return {registry, scenes, fills, extras, affordance, proposed, report};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), flag = (n, d = null) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : d; };
    const dir = a[0];
    if (!dir || dir.startsWith('--')) { console.error('usage: merge_shards.mjs <privateDir> [--out dir] [--match regex] [--overlay overlay.json]'); process.exit(2); }
    const overlayPath = flag('--overlay'), overlay = overlayPath ? JSON.parse(readFileSync(overlayPath, 'utf8')) : {};
    const match = flag('--match') ? new RegExp(flag('--match')) : null;
    const out = flag('--out', join(dir, 'merged')), r = mergeAll(dir, {includeBatch: a.includes('--include-batch'), match, overlay});
    mkdirSync(out, {recursive: true});
    writeJsonl(join(out, 'registry.jsonl'), r.registry);
    writeJsonl(join(out, 'scenes.jsonl'), r.scenes);
    writeJsonl(join(out, 'fills.jsonl'), r.fills);
    writeJsonl(join(out, 'extras.jsonl'), r.extras);
    writeFileSync(join(out, 'overlay_proposed.json'), JSON.stringify({...r.proposed, labels: overlay.labels || {}, kinds: overlay.kinds || {}}, null, 1) + '\n');
    writeFileSync(join(out, 'affordance.json'), JSON.stringify(r.affordance, null, 1) + '\n');
    writeFileSync(join(out, 'merge_report.json'), JSON.stringify(r.report, null, 1) + '\n');
    console.log(JSON.stringify(r.report, null, 1));
}
