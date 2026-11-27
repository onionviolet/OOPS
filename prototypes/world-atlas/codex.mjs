// ROUTE CONTRACT (stable, agent-readable; the page uses these same routes, so browsing and agents read the same rows).
//   GET /codex                       {ledgers:[{ledger, rows, things, counts}]}
//   GET /codex/<ledger>              summary: {ledger, rows, things, invalid, counts{runs,expressed,catalogued,blocked,notAThing},
//                                    builtFrom{hash,bytes}, blockers:[{slug, rows, alsoInCount, alsoRows, alsoIn:[{ledger,rows}],
//                                    nextAction{kind, owner, text, gated}}], actions:[{kind, rows, owner, text, gated}]}
//   GET /codex/<ledger>/rows?offset&limit&state&q
//                                    {ledger, total, offset, limit<=100, hash, rows:[{key:"<ledger>:<id>", ledger, id, label|null,
//                                    state, family, blocker|null, source, locators[], mechanisms[], test, note, typed, derived,
//                                    ladder{caseState, case{module,id}|null, moduleReachable, playerAction, persistence}}]}
//     state = exact state, family (runs|expressed|catalogued|blocked|notAThing) or blocker slug; q = substring of id, label, state,
//     mechanisms, test or source. Ladder rungs 2-4 are null = "not recorded in the ledger", never inferred from rung 1.
//   nextAction names who owns the next step. It is a pointer only: nothing here runs it, and `gated` marks steps that spend and need
//   Weibao's yes. 404 for an unknown ledger; no route writes anything.
// Atlas-as-codex data (audit D1, D2, C1). Reads docs/coverage/<ledger>.jsonl and projects it three ways:
//   aggregates   per-ledger counts by state family plus blockers, small enough for the build snapshot;
//   blocker index every blocked slug with the ledgers it appears in, so a blocker's reach across corpora is visible;
//   row pages    a bounded slice of one ledger, fetched on demand. The ledger text itself never rides in the snapshot (C1).
// Row ids are composite `<ledger>:<id>` because a bare id repeats across ledgers (81 times at the audit).
// Evidence ladder (D1): four separate fields. The ledger records only what its row says. A field the row does not
// record is `null` ("not recorded"), never filled in from another rung. Counts and ids are the only derived numbers.
//   node prototypes/world-atlas/codex.mjs [ledger]     prints the summary (or all aggregates) as JSON
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {receiptState} from '../../scripts/ladder_receipts.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const DIR = 'docs/coverage';
// The same exclusions as scripts/coverage_report.mjs readLedgers(): these two files are not ledgers.
const NOT_LEDGERS = new Set(['worlds', 'interaction_oracle', 'gu_move_slots']); // gu_move_slots is WA23 slot evidence, read by moveSlots()
export const FAMILIES = ['runs', 'expressed', 'catalogued', 'blocked', 'notAThing'];
export const MAX_PAGE = 100; // C2: at most 100 mounted result rows

export const familyOf = state => state.startsWith('runs') ? 'runs' : state.startsWith('expressed') ? 'expressed'
    : state.startsWith('blocked') ? 'blocked' : state.startsWith('not-a-thing') ? 'notAThing' : 'catalogued';
export const blockerOf = state => state.startsWith('blocked:') ? state.slice(8) : null;

export function ledgerNames(dir = join(root, DIR)) {
    return existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.jsonl')).map(f => f.slice(0, -6)).filter(n => !NOT_LEDGERS.has(n)).sort() : [];
}
export function parseRows(text) {
    const rows = [];
    for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        try {const r = JSON.parse(line); if (r && typeof r === 'object') rows.push(r);} catch { /* malformed lines are the validator's to report */ }
    }
    return rows;
}

// Source locators are `; `-joined URLs and chapter marks. Keep the original string too: nothing is dropped.
const locators = source => typeof source === 'string' ? source.split(';').map(s => s.trim()).filter(Boolean) : Array.isArray(source) ? source.map(String) : [];

/** One row, projected for the index and the detail panel. The ladder keeps its four rungs apart (D1). */
export function projectRow(ledger, row) {
    const state = typeof row.state === 'string' ? row.state : '';
    const hasCase = row.case && typeof row.case === 'object';
    return {
        key: `${ledger}:${row.id}`, ledger, id: String(row.id),
        label: row.label ?? row.name ?? null,
        state, family: state ? familyOf(state) : null, blocker: blockerOf(state),
        source: row.source ?? null, locators: locators(row.source),
        mechanisms: Array.isArray(row.mechanisms) ? row.mechanisms : [], test: row.test ?? null,
        note: row.note ?? null, typed: row.typed ?? null, derived: row.derived ?? null,
        ladder: {
            // Rung 1, case success: what the row's stored state says about the case. A runs-*/expressed-* state is the
            // runner's output written into the ledger; the case reference is shown beside it, not folded into it.
            caseState: state || null, case: hasCase ? {module: row.case.module ?? null, id: row.case.id ?? null} : null,
            // Rungs 2-4 are not fields of a ledger row. null means "not recorded here", not "no".
            moduleReachable: null, playerAction: null, persistence: null,
        },
    };
}

/** Per-ledger aggregate. `rows` are raw ledger rows. */
export function aggregate(ledger, rows) {
    const counts = Object.fromEntries(FAMILIES.map(f => [f, 0]));
    const blockers = new Map();
    let invalid = 0;
    for (const r of rows) {
        if (typeof r.state !== 'string') {invalid++; continue;}
        counts[familyOf(r.state)]++;
        const slug = blockerOf(r.state);
        if (slug) blockers.set(slug, (blockers.get(slug) || 0) + 1);
    }
    const things = rows.length - invalid - counts.notAThing; // shares are over things, as docs/coverage/README.md does
    return {ledger, rows: rows.length, things, invalid, counts, blockers: [...blockers].map(([slug, n]) => ({slug, rows: n})).sort((a, b) => b.rows - a.rows || a.slug.localeCompare(b.slug))};
}

/** slug -> [{ledger, rows}] across all aggregates, largest first. */
export function blockerIndex(aggregates) {
    const index = {};
    for (const a of aggregates) for (const b of a.blockers) (index[b.slug] ||= []).push({ledger: a.ledger, rows: b.rows});
    for (const list of Object.values(index)) list.sort((x, y) => y.rows - x.rows || x.ledger.localeCompare(y.ledger));
    return index;
}

// Next-action pointers. Existing owners only; nothing is performed here.
const OWNERS = {
    read: 'scripts/lead_run/reading_review.mjs (targeted read of the cited source; paid runs are gated by Weibao)',
    runner: 'scripts/case_runner.mjs and docs/coverage/CASE_SHAPE.md',
    rule: 'docs/coverage/blocked_slugs.json (canonical slug) and the mechanism seam named in the row note',
    slug: 'scripts/slug_normalize.mjs and docs/coverage/blocked_slugs.json',
};
export function nextAction(slug, canonical = []) {
    if (/-unknown$/.test(slug)) return {kind: 'targeted-read', owner: OWNERS.read, gated: true, text: 'Read the cited source for the missing fact; classify from the row note first, since some rank rows need a catalogue binding and not a read.'};
    if (/^runner-/.test(slug)) return {kind: 'runner-fix', owner: OWNERS.runner, gated: false, text: 'Fix the case or its mapping so the runner can execute it.'};
    if (!canonical.includes(slug)) return {kind: 'normalize-slug', owner: OWNERS.slug, gated: false, text: 'Not a canonical slug: fold it into one or add it by hand.'};
    return {kind: 'rule-owner', owner: OWNERS.rule, gated: false, text: 'Missing engine rule: hand to the owner of this mechanism; row count is not unique abilities.'};
}
/** Ledger-level pointers: expressed rows that do not yet run need a consumer. */
export function ledgerActions(a) {
    const out = [];
    if (a.counts.expressed) out.push({kind: 'draft-consumer', rows: a.counts.expressed, gated: false, owner: 'docs/coverage/CASE_SHAPE.md (runs needs the case module reachable from src/main.js)', text: 'Expressed, not runs: draft a consumer (action entry, means and costs, result, save effects, test scenario).'});
    return out;
}

/** The summary the page needs: the aggregate with each blocker's reach into other ledgers. */
export function summary(codex, ledger) {
    const a = codex.ledgers.find(l => l.ledger === ledger);
    if (!a) return null;
    return {...a, builtFrom: codex.inputs[ledger] ?? null, actions: ledgerActions(a), blockers: a.blockers.map(b => {
        const others = (codex.blockers[b.slug] || []).filter(o => o.ledger !== ledger);
        return {...b, alsoInCount: others.length, alsoRows: others.reduce((n, o) => n + o.rows, 0), alsoIn: others.slice(0, 8), nextAction: nextAction(b.slug, codex.canonical)};
    })};
}

// ---- Ladder receipts (G2): rungs 2-4 from docs/coverage/evidence/ladder/*.json, written by scripts/ladder_receipts.mjs ----
// Each rung is shown only from its own receipt. A receipt whose watched files changed reads "stale"; a row whose bytes changed
// since the receipt reads "row changed". Neither is shown as proof. Hashing the watch lists is cached for 30 s.
const LADDER = join(root, DIR, 'evidence', 'ladder');
let ladderCache = null;
const sha1 = text => createHash('sha1').update(text).digest('hex');
export function readReceipts(dir = LADDER, now = Date.now()) {
    const files = ['reachability.json', 'engine.json', 'play.json'].map(f => join(dir, f));
    const stamp = files.map(f => existsSync(f) ? statSync(f).mtimeMs : 0).join('|');
    if (ladderCache && ladderCache.stamp === stamp && now - ladderCache.at < 30000) return ladderCache.value;
    const read = f => {try {return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;} catch {return null;}};
    const [reach, engine, play] = files.map(read);
    const state = r => r ? receiptState(r, root.replace(/\/$/, '')) : null;
    const plays = new Map();
    for (const r of play?.receipts ?? []) for (const k of r.keys ?? []) (plays.get(k) ?? plays.set(k, []).get(k)).push({...r, state: state(r)});
    const value = {
        reach: reach && {at: reach.at, commit: reach.tree?.commit ?? null, state: state(reach), rows: reach.rows ?? {}, modules: reach.modules ?? {}},
        engine: engine && {at: engine.at, state: state(engine), rows: new Map((engine.entries ?? []).map(e => [e.key, e]))},
        plays,
    };
    ladderCache = {stamp, at: now, value};
    return value;
}
/** Rungs 2-4 for one projected row from the receipts, each with its own freshness. `raw` is the ledger line's parsed row. */
export function ladderFromReceipts(p, raw, rc = readReceipts()) {
    const rowSha = raw ? sha1(JSON.stringify(raw)) : null; // receipts hash the ledger line text; compare loosely below
    const reachRow = rc.reach?.rows[p.key];
    let moduleReachable = null;
    if (rc.reach) {
        if (!reachRow) moduleReachable = {value: 'no case module', state: rc.reach.state, at: rc.reach.at};
        else {
            const m = rc.reach.modules[reachRow.module] ?? {};
            moduleReachable = {value: m.reachable ? (m.consumerCallsCase ? 'reachable, and a file on the chain calls the case' : 'reachable by import only: nothing on the chain calls the case, so this is not play')
                : 'not reachable from src/main.js', module: reachRow.module, via: m.via ?? null, state: rc.reach.state, at: rc.reach.at};
        }
    }
    const plays = rc.plays.get(p.key) ?? [];
    const best = plays.find(x => x.state === 'current' && x.playerAction) ?? plays[0] ?? null;
    const playerAction = best ? {value: best.playerAction ? `proven in ${best.scope} (${best.route})` : 'test ran but did not prove a player action', state: best.state, at: best.at, command: best.producer?.command ?? null} : null;
    const eng = rc.engine?.rows.get(p.key);
    const checks = {...(best?.persistence ?? {})};
    if (eng) checks.engineRestore = checks.engineRestore || !!eng.engineRestore;
    const names = {engineRestore: 'engine restore', saveReload: 'save and reload', exportImport: 'export and import', browser: 'browser'};
    const persistence = (best || eng) ? {checks: Object.fromEntries(Object.keys(names).map(k => [names[k], !!checks[k]])), state: best?.state ?? rc.engine?.state ?? null,
        at: best?.at ?? rc.engine?.at ?? null} : null;
    return {moduleReachable, playerAction, persistence, rowSha};
}

/** Paged rows. `state` matches an exact state, a family name or a blocker slug; `q` is a case-insensitive substring of id, label, blocker, mechanisms, test or source. */
export function pageRows(ledger, rows, {offset = 0, limit = MAX_PAGE, state = '', q = ''} = {}) {
    const lim = Math.min(Math.max(Math.trunc(Number(limit)) || MAX_PAGE, 1), MAX_PAGE), off = Math.max(Math.trunc(Number(offset)) || 0, 0);
    const needle = String(q || '').trim().toLowerCase(), want = String(state || '');
    const hits = [];
    for (const r of rows) {
        if (typeof r.state !== 'string') continue;
        if (want && r.state !== want && familyOf(r.state) !== want && blockerOf(r.state) !== want) continue;
        if (needle) {
            const hay = [r.id, r.label, r.name, r.state, ...(Array.isArray(r.mechanisms) ? r.mechanisms : []), r.test, r.source].join('\n').toLowerCase();
            if (!hay.includes(needle)) continue;
        }
        hits.push(r);
    }
    const rc = readReceipts();
    return {ledger, total: hits.length, offset: off, limit: lim, rows: hits.slice(off, off + lim).map(r => {
        const p = projectRow(ledger, r), lad = ladderFromReceipts(p, r, rc);
        return {...p, ladder: {...p.ladder, moduleReachable: lad.moduleReachable, playerAction: lad.playerAction, persistence: lad.persistence}};
    })};
}

// ---- IO: cached reads, the build part ----
const cache = new Map(); // ledger -> {hash, rows}
export function readLedger(ledger, dir = join(root, DIR)) {
    if (!ledgerNames(dir).includes(ledger)) return null; // names are checked against the directory listing, never joined raw
    const text = readFileSync(join(dir, ledger + '.jsonl'), 'utf8');
    const hash = createHash('sha1').update(text).digest('hex').slice(0, 12);
    const hit = cache.get(ledger);
    if (hit?.hash === hash) return hit;
    const entry = {hash, bytes: Buffer.byteLength(text), rows: parseRows(text)};
    cache.set(ledger, entry);
    return entry;
}

/** Build part: aggregates for every ledger (or the names passed), the blocker index and input hashes. No row text. */
export function buildCodex(names = ledgerNames(), dir = join(root, DIR)) {
    const ledgers = [], inputs = {};
    for (const name of names) {
        const entry = readLedger(name, dir);
        if (!entry) continue;
        ledgers.push(aggregate(name, entry.rows));
        inputs[name] = {hash: entry.hash, bytes: entry.bytes};
    }
    let canonical = [];
    try {canonical = JSON.parse(readFileSync(join(dir, 'blocked_slugs.json'), 'utf8')).canonical || [];} catch { /* every slug then reads as non-canonical */ }
    return {source: DIR + '/*.jsonl', ledgers, blockers: blockerIndex(ledgers), canonical, inputs};
}

if (import.meta.main) {
    const codex = buildCodex(process.argv[2] ? [process.argv[2]] : undefined);
    process.stdout.write(JSON.stringify(process.argv[2] ? summary(codex, process.argv[2]) : codex));
}

// WA23 slot evidence (owned by scripts/gu_move_slots.py): the recipe slots of one gu_moves row, grouped by variant.
// The file carries no passage text. Order is shown only when orderStated; unnamed slots stay open.
let slotCache = null;
export function moveSlots(move, file = join(root, DIR, 'evidence', 'gu_move_slots.jsonl')) {
    if (!existsSync(file)) return null;
    const mtime = statSync(file).mtimeMs;
    if (!slotCache || slotCache.mtime !== mtime) slotCache = {mtime, rows: parseRows(readFileSync(file, 'utf8'))};
    const variants = new Map();
    for (const r of slotCache.rows) if (r.move === move) {
        const k = r.variant ?? null;
        if (!variants.has(k)) variants.set(k, []);
        variants.get(k).push({role: r.role, gu: r.gu ?? null, name: r.name, locator: r.locator, tier: r.tier,
            order: r.orderStated ? r.order : null, orderStated: !!r.orderStated, resolution: r.resolution,
               secondRead: r.secondRead ?? null, secondReadNote: r.secondReadNote ?? null, job: r.job ?? null, jobAt: r.jobAt ?? null});
    }
    return {move, variants: [...variants].map(([variant, slots]) => ({variant, slots}))};
}
