// ROUTE CONTRACT (stable, agent-readable; the page uses these same routes, so browsing and agents read the same rows).
//   GET /cheats                      summary: {counts{cheats,variations,withDefinition,candidates,candidateDocs,byStatus{proposal,working-default,implemented}},
//                                    byFamily[{code,title,cheats}], worlds[{world,cheats}] (top 40), unlinkedDefinitions[], topCandidates[<=25],
//                                    sweep{docsScanned,tables,namedRows,codedRows,skipped}, builtFrom{hash,files}}
//   GET /cheats/rows?offset&limit&q&status&world
//                                    {total, offset, limit<=100, hash, rows:[row]}; status = proposal | working-default | implemented | candidate
//                                    (default: catalogue rows only; `candidate` = absorption-sweep rows); q = substring of id, name, family, text,
//                                    variations, runtime ids, candidate locator; world = substring of a world name.
//   catalogue row  {key:"cheat:<CTC>", kind:"catalogue", id, name, family{code,title}, what, backing[], worlds[], hooks, limits,
//                   status, docStatus, docClaim(built|partly|not-built|unknown),
//                   runtime{definition:{id,file}|null, cards[], power[], claimedIds[], unverifiedIds[]},   // verified in src/, kept apart from docStatus
//                   rules{cht[{code,how:"named"|"backing",text}], other[]},
//                   variations[{kind, name, world, doc, anchor, line, link, match:"linked"|"code"|"inferred", score}],
//                   source{text, links[{label, doc, anchor, anchorFound}]}, locator{file,line,heading}}
//   candidate row  {key:"cheat:cand:<hash>", kind:"candidate", id, name, code|null, detector:"table-named"|"coded", status:"candidate",
//                   worlds[], excerpt, locator{file,line,heading,anchor,link}, alsoAt[locator], docsCount,
//                   resembles{key,id,name,score,label:"inferred"}|null}
// status is a composite and says so: implemented = the catalogue says built AND an id it names exists in src/cheat_*.js; working-default = the
// catalogue says partly (an engine piece exists, no card runs it) or says built with no id verifiable in src; proposal = everything else.
// The doc's own words stay in docStatus/docClaim, and the runtime evidence stays in `runtime`, so neither is folded into the other.
// Absorption sweep (rerun on every build, deterministic): scans docs/**/*.md except any `private/` segment and docs/research/novels/, and the
// catalogue itself. Two detectors: (1) table-named: a table whose header has a Cheat / Cheat family / Simple cheat column, name = that cell;
// (2) coded: a table row or list item led by a code like CM1 or SH2 whose heading chain, table header or item text says "cheat", name = the next cell
// or bold lead. Rows whose name strongly matches a catalogue row become variations of it; the rest are candidates, deduped by normalised name,
// ranked by how many distinct docs carry the name. `resembles` is a token-overlap guess, labelled inferred. Nothing here edits a doc.
//   node prototypes/world-atlas/cheats.mjs        prints the summary as JSON
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
export const MAX_PAGE = 100;
export const CATALOGUE = 'docs/CHEAT_CATALOGUE.md';
const VARIANT_DOCS = {
    'docs/CHEAT_LIBRARY.md': 'library-family', 'docs/CHEAT_COSMOLOGY.md': 'cosmology-placement',
    'docs/CHEATS_BY_WORLD.md': 'world-variant', 'docs/worlds/SCENARIO_WORLDS_AND_CHEATS_2026-11-18.md': 'scenario-lever',
};
const SRC_FILES = [/^cheat_.*\.js$/, /^rehearsed_foe\.js$/];

// ---- text helpers ----
export const plain = s => String(s ?? '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
export function slugify(heading, seen = new Map()) {
    const base = plain(heading).toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-');
    const n = seen.get(base) || 0; seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
}
const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'its', 'are', 'was', 'cheat', 'cheats', 'system', 'power', 'powers', 'world', 'book', 'game', 'ability', 'type', 'one', 'your']);
const stem = w => w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
export const tokens = s => plain(s).toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP.has(w)).map(stem);
export const norm = s => plain(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** One pass over a doc: headings (with slugs) and table rows with their header, heading chain and line. Fenced code is skipped. */
export function scanDoc(text) {
    const lines = text.split('\n'), headings = [], rows = [], items = [], seen = new Map(), stack = [];
    let fence = false, header = null, headerLine = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\s*(```|~~~)/.test(line)) {fence = !fence; continue;}
        if (fence) continue;
        const h = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
        if (h) {
            const level = h[1].length, title = plain(h[2]);
            while (stack.length && stack.at(-1).level >= level) stack.pop();
            const entry = {level, text: title, line: i + 1, slug: slugify(h[2], seen)};
            stack.push(entry); headings.push(entry); header = null; continue;
        }
        if (line.startsWith('|')) {
            const cells = line.replace(/^\||\|\s*$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
            if (cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
            const next = lines[i + 1] || '';
            if (!header && /^\|[\s:|-]+\|?\s*$/.test(next) && /-{3}/.test(next)) {header = cells; headerLine = i + 1; continue;}
            if (header) rows.push({cells, header, headerLine, line: i + 1, chain: stack.map(s => s.text), heading: stack.at(-1) || null});
            continue;
        }
        header = null;
        const li = /^\s*(?:[-*]|\d+\.)\s+\*\*([A-Z]{1,5}\d{1,3}[a-z]?)[.:]\s*(.+?)\*\*/.exec(line);
        if (li) items.push({code: li[1], name: plain(li[2]).replace(/[.:]+$/, ''), line: i + 1, text: plain(line), chain: stack.map(s => s.text), heading: stack.at(-1) || null});
    }
    return {headings, rows, items, title: headings[0]?.text || ''};
}

// ---- catalogue ----
const FAMILY_RE = /^##\s+([A-Z])\.\s+(.*)$/;
export function parseCatalogue(text) {
    const out = [], family = {};
    let cur = null;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
        const f = FAMILY_RE.exec(line); if (f) cur = {code: f[1], title: plain(f[2])};
        if (!line.startsWith('| CTC')) return;
        const c = line.replace(/^\||\|\s*$/g, '').split(/(?<!\\)\|/).map(x => x.trim());
        if (c.length < 9) return;
        const [id, type, what, backing, worlds, hooks, limits, status, source] = c;
        out.push({id, name: plain(type), what: plain(what), backing: plain(backing).split(/,\s*/).filter(Boolean), worldsText: plain(worlds), hooks: plain(hooks), limits: plain(limits),
            statusText: status, sourceText: source, family: cur ? {...cur} : null, line: i + 1, heading: cur ? `${cur.code}. ${cur.title}` : null});
    });
    void family;
    return out;
}
const links = (text, baseDir) => [...String(text).matchAll(/\[([^\]]+)\]\(([^)#\s]*)(?:#([^)\s]*))?\)/g)].map(m => ({label: m[1], doc: m[2] ? posix.normalize(posix.join(baseDir, m[2])) : null, anchor: m[3] || null}));

/** Rule index: CHT code -> first bold phrase of its row in CHEAT_RULES. */
export function parseRules(text) {
    const map = {};
    for (const line of text.split('\n')) {const m = /^\|\s*(CHT\d+)\s*\|\s*\*\*(.+?)\*\*/.exec(line); if (m) map[m[1]] = plain(m[2]);}
    return map;
}

/** Ids a card or definition file declares: `id: 'x'`, `id:'x'`. Kept per file so the evidence can name its file. */
export function declaredIds(text) {
    return new Set([...text.matchAll(/\{\s*id\s*:\s*['"]([a-z0-9][a-z0-9._-]*)['"]\s*,\s*name\s*:/gi)].map(m => m[1]));
}
/** Quoted literals in a src file: `'ring-spirit'` counts as named there (a card that is seeded by choice, not declared as a definition). */
export const namesLiteral = (text, id) => text.includes(`'${id}'`) || text.includes(`"${id}"`);

const claimOf = s => /^\s*built\b/i.test(s) ? 'built' : /^\s*partly\b/i.test(s) ? 'partly' : /^\s*not built\b/i.test(s) ? 'not-built' : 'unknown';

/** Match the catalogue's status text against src evidence. Never reads "implemented" from the doc: only an id found in src counts. */
export function runtimeEvidence(statusText, src) {
    const claimed = [...String(statusText).matchAll(/`([^`]+)`/g)].map(m => m[1]);
    const ev = {definition: null, cards: [], power: [], claimedIds: claimed, unverifiedIds: []};
    for (const id of claimed) {
        if (src.definitions?.ids.has(id)) ev.definition ||= {id, file: src.definitions.file};
        else if (src.cards && namesLiteral(src.cards.text, id)) ev.cards.push({id, file: src.cards.file});
        else if (src.other?.some(f => f.text.includes(id) && /[._]/.test(id))) ev.power.push({id, file: src.other.find(f => f.text.includes(id)).file});
        else ev.unverifiedIds.push(id);
    }
    return ev;
}
export function statusOf(claim, ev) {
    const verified = Boolean(ev.definition || ev.cards.length || ev.power.length);
    if (claim === 'built' && verified) return 'implemented';
    if (claim === 'built' || claim === 'partly') return 'working-default';
    return 'proposal';
}

// ---- sweep detectors ----
const BAD_NAME = /^(?:|-|n\/a|none|cheat|cheats|tbd|\?|[0-9. ]+)$|\.(?:m?js|json|md)\b|\btests?\b/i; // also file names and test notes from run logs
const HEAD_NAME = /^(?:simple |game |book |world |player-side )?cheats?(?:\s*\((?:book|world)\)|\s+(?:family|type|name))?$/i;
const SKIP_PATH = p => /(^|\/)private\//.test(p) || p.startsWith('docs/research/novels/');
const splitNames = name => plain(name).replace(/\([^)]*\)/g, ' ').split(/,|;| and | \/ /).map(s => s.trim()).filter(s => s.length >= 3);

/** Yield sweep rows from one scanned doc. */
export function sweepDoc(file, scan) {
    const out = [];
    const base = (r, extra) => ({file, line: r.line, heading: r.heading?.text || null, anchor: r.heading?.slug || null, ...extra});
    for (const r of scan.rows) {
        const hi = r.header.findIndex(h => HEAD_NAME.test(plain(h)));
        const worldI = r.header.findIndex(h => /^world$/i.test(plain(h)));
        const world = worldI >= 0 ? plain(r.cells[worldI]) : null;
        if (hi >= 0) {
            const name = plain(r.cells[hi]);
            const lead = plain(r.cells[0]), code = hi > 0 && /^[A-Z]{1,5}\d{1,3}[a-z]?$/.test(lead) && !/^CTC\d+$/.test(lead) ? lead : null; // a Code column in front keeps its code
            if (!BAD_NAME.test(name) && name.length <= 140) out.push(base(r, {name, code, detector: code ? 'coded' : 'table-named', world, text: r.cells.map(plain).join(' · ')}));
            continue;
        }
        const code = plain(r.cells[0]);
        if (/^[A-Z]{1,5}\d{1,3}[a-z]?$/.test(code) && !/^CTC\d+$/.test(code) && r.cells.length >= 2) {
            const ctx = `${r.chain.join(' ')} ${r.header.join(' ')}`;
            const second = plain(r.header[1] || '');
            if (/cheat/i.test(ctx) && /^(cheat|type|family|name|card|item)/i.test(second)) {
                const name = plain(r.cells[1]);
                if (!BAD_NAME.test(name) && name.length <= 100) out.push(base(r, {name, code, detector: 'coded', world: null, text: r.cells.map(plain).join(' · ')}));
            }
        }
    }
    for (const it of scan.items) {
        if (/cheat/i.test(it.chain.join(' ') + ' ' + it.text) && it.name.length >= 3 && it.name.length <= 100 && !/^CTC/.test(it.code))
            out.push({file, line: it.line, heading: it.heading?.text || null, anchor: it.heading?.slug || null, name: it.name, code: it.code, detector: 'coded', world: null, text: it.text});
    }
    return out;
}

/** How well does a sweep name match a catalogue row? 1 exact type, 0.9 phrase in the row, else shared-token coverage. */
export function matchScore(name, ctc) {
    const full = `${ctc.name} ${ctc.what} ${ctc.worldsText} ${ctc.statusText || ''}`;
    const hay = norm(full), type = norm(ctc.name);
    const hayTok = new Set(tokens(full)), typeTok = new Set(tokens(ctc.name));
    let best = 0;
    for (const part of [name, ...splitNames(name)]) {
        const n = norm(part); if (n.length < 5) continue;
        if (n === type) {best = Math.max(best, 1); continue;}
        if (` ${hay} `.includes(` ${n} `)) {best = Math.max(best, 0.9); continue;}
        const t = tokens(part); if (!t.length) continue;
        const inHay = t.filter(w => hayTok.has(w)).length, inType = t.filter(w => typeTok.has(w)).length;
        if (inHay >= 2 || (t.length === 1 && inType === 1)) best = Math.max(best, 0.8 * inHay / t.length + (inType ? 0.05 : 0));
    }
    return Math.round(best * 100) / 100;
}
const STRONG = 0.85, WEAK = 0.45;
export function bestMatch(name, catalogue) {
    let best = null;
    for (const c of catalogue) {const s = matchScore(name, c); if (s > (best?.score ?? 0)) best = {ctc: c, score: s};}
    return best;
}

const short = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;
const locOf = r => ({file: r.file, line: r.line, heading: r.heading, anchor: r.anchor, link: r.file + (r.anchor ? '#' + r.anchor : '')});
const hash8 = s => createHash('sha1').update(s).digest('hex').slice(0, 8);

/**
 * Assemble every row. `read(path)` returns text or null; `files` lists docs paths (relative, sorted); `srcFiles` is [{file,text}].
 * Pure given those inputs, so tests pass fixtures.
 */
export function assembleCheats({read, files, srcFiles = []}) {
    const catText = read(CATALOGUE);
    const cat = catText ? parseCatalogue(catText) : [];
    const rules = parseRules(read('docs/CHEAT_RULES.md') || '');
    const src = {definitions: null, cards: null, other: []};
    for (const f of srcFiles) {
        const name = f.file.split('/').pop();
        if (name === 'cheat_definitions.js') src.definitions = {file: f.file, ids: declaredIds(f.text)};
        else if (name === 'cheat_cards.js') {src.cards = {file: f.file, text: f.text}; src.other.push(f);} else src.other.push(f);
    }
    const headingsCache = new Map();
    const headingsOf = doc => {
        if (!headingsCache.has(doc)) {const t = read(doc); headingsCache.set(doc, t == null ? null : scanDoc(t).headings);}
        return headingsCache.get(doc);
    };
    const rows = cat.map(c => {
        const claim = claimOf(c.statusText), runtime = runtimeEvidence(c.statusText, src);
        const srcLinks = links(c.sourceText, 'docs').map(l => {
            const h = l.doc && l.anchor ? headingsOf(l.doc) : null;
            const hit = h?.find(x => x.slug === l.anchor);
            return {...l, anchorFound: l.anchor ? (h ? Boolean(hit) : null) : null, line: hit?.line ?? null};
        });
        const chtNamed = [...new Set([...(`${c.hooks} ${c.limits} ${c.what} ${c.statusText}`).matchAll(/\bCHT\d+\b/g)].map(m => m[0]))];
        const other = [...new Set([...(`${c.hooks} ${c.limits}`).matchAll(/\b(?!CTC|CHT)[A-Z]{2,4}\d{1,3}\b/g)].map(m => m[0]))];
        const variations = srcLinks.filter(l => l.doc).map(l => ({kind: 'catalogue-source', name: l.label, world: null, doc: l.doc, anchor: l.anchor, line: l.line,
            link: l.doc + (l.anchor ? '#' + l.anchor : ''), match: 'linked', score: 1, anchorFound: l.anchorFound}));
        return {key: `cheat:${c.id}`, kind: 'catalogue', id: c.id, name: c.name, family: c.family, what: c.what, backing: c.backing,
            worlds: c.worldsText.split(/;/).map(s => s.trim()).filter(Boolean), hooks: c.hooks, limits: c.limits,
            status: statusOf(claim, runtime), docStatus: plain(c.statusText), docClaim: claim, runtime,
            rules: {cht: [...chtNamed.map(code => ({code, how: 'named', text: rules[code] || null})), ...(c.backing.length ? [{code: 'CHT5', how: 'backing', text: rules.CHT5 || null}] : [])]
                .filter((r, i, a) => a.findIndex(x => x.code === r.code) === i), other},
            variations, source: {text: plain(c.sourceText), links: srcLinks}, locator: {file: CATALOGUE, line: c.line, heading: c.heading}};
    });
    const byId = new Map(rows.map(r => [r.id, r]));
    // Sweep.
    const sweep = {docsScanned: 0, tables: 0, namedRows: 0, codedRows: 0, skipped: 0};
    const groups = new Map();
    for (const file of files) {
        if (file === CATALOGUE || SKIP_PATH(file)) {sweep.skipped++; continue;}
        const text = read(file); if (text == null) continue;
        if (!/cheat/i.test(text)) continue; // a doc with no mention of "cheat" cannot carry a cheat row
        sweep.docsScanned++;
        const scan = scanDoc(text);
        sweep.tables += new Set(scan.rows.map(r => r.headerLine)).size;
        for (const r of sweepDoc(file, scan)) {
            sweep[r.detector === 'coded' ? 'codedRows' : 'namedRows']++;
            const ctcCode = /\bCTC\d+\b/.exec(r.text)?.[0];
            const m = bestMatch(r.name, cat);
            const kind = VARIANT_DOCS[file];
            if (kind && ctcCode && byId.has(ctcCode)) {
                byId.get(ctcCode).variations.push({kind, name: r.name, world: r.world, doc: file, anchor: r.anchor, line: r.line, link: locOf(r).link, match: 'code', score: 1}); continue;
            }
            if (kind && m && m.score >= STRONG) {
                byId.get(m.ctc.id).variations.push({kind, name: r.name, world: r.world || (file.endsWith('CHEATS_BY_WORLD.md') ? r.heading : null), doc: file, anchor: r.anchor, line: r.line, link: locOf(r).link, match: 'inferred', score: m.score}); continue;
            }
            if (!kind && m && m.score >= STRONG) continue; // already covered by a catalogue row; other docs do not become variations
            const key = norm(r.name);
            if (!key) continue;
            if (!r.world && file.endsWith('CHEATS_BY_WORLD.md')) r.world = r.heading; // that doc files rows under a heading per world
            const g = groups.get(key) || {first: r, name: r.name, all: [], best: null};
            g.all.push(r);
            if (m && (!g.best || m.score > g.best.score)) g.best = m;
            if (r.code && !g.first.code) g.first = r;
            groups.set(key, g);
        }
    }
    const candidates = [...groups.entries()].map(([k, g]) => {
        const docs = new Set(g.all.map(x => x.file));
        const f = g.first;
        const resembles = g.best && g.best.score >= WEAK ? {key: `cheat:${g.best.ctc.id}`, id: g.best.ctc.id, name: g.best.ctc.name, score: g.best.score, label: 'inferred'} : null;
        return {key: `cheat:cand:${hash8(k)}`, kind: 'candidate', id: `cand:${hash8(k)}`, name: f.name, code: f.code, detector: f.detector, status: 'candidate',
            worlds: [...new Set(g.all.map(x => x.world).filter(Boolean))], excerpt: short(f.text, 220), locator: locOf(f),
            alsoAt: g.all.filter(x => x !== f).slice(0, 12).map(locOf), docsCount: docs.size, resembles};
    }).sort((a, b) => b.docsCount - a.docsCount || (b.code ? 1 : 0) - (a.code ? 1 : 0) || a.locator.file.localeCompare(b.locator.file) || a.locator.line - b.locator.line);
    for (const r of rows) r.variations.sort((a, b) => a.doc.localeCompare(b.doc) || (a.line ?? 0) - (b.line ?? 0));
    return {rows, candidates, sweep, definitionIds: src.definitions ? [...src.definitions.ids] : [], srcFiles: srcFiles.map(f => f.file)};
}

// ---- projections ----
export function summarize(data, inputs = null) {
    const {rows, candidates} = data, byStatus = {proposal: 0, 'working-default': 0, implemented: 0};
    const fam = new Map(), worlds = new Map();
    for (const r of rows) {
        byStatus[r.status]++;
        const k = r.family ? `${r.family.code}|${r.family.title}` : '?|none'; fam.set(k, (fam.get(k) || 0) + 1);
        for (const w of new Set([...r.worlds, ...r.variations.map(v => v.world).filter(Boolean)].map(w => w.trim()))) worlds.set(w, (worlds.get(w) || 0) + 1);
    }
    const linked = new Set(rows.map(r => r.runtime.definition?.id).filter(Boolean));
    return {
        counts: {cheats: rows.length, variations: rows.reduce((n, r) => n + r.variations.length, 0), withDefinition: rows.filter(r => r.runtime.definition).length,
            candidates: candidates.length, candidateDocs: new Set(candidates.map(c => c.locator.file)).size, byStatus},
        byFamily: [...fam].map(([k, cheats]) => ({code: k.split('|')[0], title: k.split('|')[1], cheats})),
        worlds: [...worlds].map(([world, cheats]) => ({world, cheats})).sort((a, b) => b.cheats - a.cheats || a.world.localeCompare(b.world)).slice(0, 40),
        unlinkedDefinitions: data.definitionIds.filter(id => !linked.has(id)),
        topCandidates: candidates.slice(0, 25).map(c => ({key: c.key, name: c.name, code: c.code, docsCount: c.docsCount, locator: c.locator.link + ':' + c.locator.line, resembles: c.resembles?.id ?? null})),
        sweep: data.sweep, builtFrom: inputs,
    };
}

const haystack = r => r.kind === 'candidate'
    ? [r.id, r.name, r.code, r.excerpt, r.locator.file, r.locator.heading, ...r.worlds, r.resembles?.id].join('\n')
    : [r.id, r.name, r.family?.title, r.what, r.hooks, r.limits, r.backing.join(' '), r.docStatus, r.worlds.join(' '),
        r.runtime.definition?.id, ...r.runtime.cards.map(c => c.id), ...r.variations.flatMap(v => [v.name, v.world, v.doc])].join('\n');
export function pageCheats(data, {offset = 0, limit = MAX_PAGE, q = '', status = '', world = ''} = {}) {
    const lim = Math.min(Math.max(Math.trunc(Number(limit)) || MAX_PAGE, 1), MAX_PAGE), off = Math.max(Math.trunc(Number(offset)) || 0, 0);
    const needle = String(q || '').trim().toLowerCase(), want = String(status || ''), w = String(world || '').trim().toLowerCase();
    const pool = want === 'candidate' ? data.candidates : data.rows;
    const hits = pool.filter(r => {
        if (want && want !== 'candidate' && r.status !== want) return false;
        if (w && ![...r.worlds, ...(r.variations || []).map(v => v.world || '')].some(x => x.toLowerCase().includes(w))) return false;
        return !needle || haystack(r).toLowerCase().includes(needle);
    });
    return {total: hits.length, offset: off, limit: lim, rows: hits.slice(off, off + lim)};
}

// ---- IO ----
export function listDocs(dir = root) {
    const out = [], walk = rel => {
        for (const e of readdirSync(join(dir, rel), {withFileTypes: true})) {
            const p = rel + '/' + e.name;
            if (e.isDirectory()) {if (e.name !== 'private' && p !== 'docs/research/novels') walk(p);} else if (e.name.endsWith('.md') && !SKIP_PATH(p)) out.push(p);
        }
    };
    if (existsSync(join(dir, 'docs'))) walk('docs');
    return out.sort();
}
function readSrc(dir) {
    const d = join(dir, 'src');
    return existsSync(d) ? readdirSync(d).filter(n => SRC_FILES.some(re => re.test(n))).sort().map(n => ({file: 'src/' + n, text: readFileSync(join(d, n), 'utf8')})) : [];
}
const cache = {sig: null, data: null};
/** Full rows for the server. Cached on a cheap stat signature of every input (path, size, mtime). */
export function readCheats(dir = root) {
    const files = listDocs(dir), srcFiles = readSrc(dir);
    const h = createHash('sha1');
    for (const f of files) {const s = statSync(join(dir, f)); h.update(f + s.size + ':' + s.mtimeMs + '\n');}
    for (const f of srcFiles) h.update(f.file + f.text.length + '\n');
    const sig = h.digest('hex').slice(0, 12);
    if (dir === root && cache.sig === sig) return cache.data;
    const read = p => {try {return readFileSync(join(dir, p), 'utf8');} catch {return null;}};
    const data = {...assembleCheats({read, files, srcFiles}), hash: sig, files: files.length};
    if (dir === root) Object.assign(cache, {sig, data});
    return data;
}
/** Build part: summary only (no row text rides in the snapshot). */
export function buildCheats(dir = root) {
    const data = readCheats(dir);
    return summarize(data, {hash: data.hash, files: data.files});
}

if (import.meta.main) process.stdout.write(JSON.stringify(buildCheats()));
